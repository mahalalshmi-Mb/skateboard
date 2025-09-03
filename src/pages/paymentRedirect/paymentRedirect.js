import { useConfig } from "context/configContext";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useHistory } from "react-router-dom";
import moment from "util/momentWrapper";
import callAPI from "../../commons/callAPI";
import config from "../../commons/config";
import { getAppConfig } from "../../commons/util/appConfigHelper";
import Util from "../../commons/util/util";
import Loader from "../../components/atoms/loader";
import PushAlert from "../../components/atoms/pushAlert";
import { CartContext } from "../../context/cartContext";
import { NavContext } from "../../context/navContext";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import {
  getSessionStorage,
  removeSessionStorage,
} from "../../util/storageUtil";
import { productDomain } from "../edpFSTR/pages/config/config";

function PaymentRedirect(props) {
  const ClientCart = useContext(CartContext);
  const useNav = useContext(NavContext);
  const history = useHistory();
  const { pushHistory, replaceHistory } = useCustomNavigation();
  const { appConfig, timezone } = useConfig();

  const [cookies] = useCookies(["loginData", "gwLoginData"]);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const [paymentGateway] = useState(
    props?.location?.state?.data?.paymentGateway
      ? JSON.parse(props?.location?.state?.data?.paymentGateway)
      : {}
  );
  const [availablePromo] = useState(getSessionStorage("availablePromo"));
  const [dineInSessionData] = useState(getSessionStorage("dine-in"));
  const [dutyFreeSessionData] = useState(getSessionStorage("productsData"));
  const [isDineIn] = useState(dineInSessionData?.storeId || "" !== "");
  const [isDutyFree] = useState(
    dutyFreeSessionData?.domain === productDomain?.dutyFree
  );
  const [isDeliveryQrCode] = useState(
    getSessionStorage("qrCodeSource")
      ?.toLowerCase()
      ?.includes("deliver-to-gate") ||
      getSessionStorage("qrCodeSource")?.toLowerCase()?.includes("lounge-bar")
  );
  useEffect(() => {
    if (isDineIn || isDeliveryQrCode) {
      useNav.hideAllNavs();
    }
    localStorage.removeItem("module");
    if (localStorage.getItem("redirectToPayment") === "fromEdp") {
      try {
        createOrder();
      } catch (err) {
        console.log(err);
        pushHistory("/cart");
      }
    } else {
      if (isDineIn) {
        pushHistory("/dine-in/payBill");
      } else {
        pushHistory("/cart");
      }
    }

    return () => {
      if (isDineIn || isDeliveryQrCode) {
        useNav.showAllNavs();
      }
    };
  }, [props.location]);

  const clearSessionItems = () => {
    removeSessionStorage("hotelData");
    removeSessionStorage("cabsData");
  };

  const createOrder = async () => {
    if (!executeRecaptcha) return;

    const token = await executeRecaptcha("checkout");

    let userMobileNo = "";

    if (cookies.gwLoginData) {
      userMobileNo = cookies.gwLoginData.mobile
        ? cookies.gwLoginData.mobile
        : "";
    }
    let cartObject = ClientCart.getCart();

    Object.values(cartObject).forEach((x) => {
      x.items.forEach((citem) => {
        if (citem.mandatoryFieldsFilled) delete citem.mandatoryFieldsFilled;
      });
    });

    let promoCode = "";
    const appliedPromo = getSessionStorage("appliedCoupon");
    if (appliedPromo?.coupon && appliedPromo?.coupon !== "") {
      promoCode = appliedPromo?.coupon;
    }

    let mandatoryInfo = getSessionStorage("mandatoryInfoData");
    if (
      mandatoryInfo &&
      (mandatoryInfo?.isMandatoryInfoRequired !== undefined ||
        mandatoryInfo?.isMandatoryInfoRequired !== null)
    ) {
      delete mandatoryInfo.isMandatoryInfoRequired;
    }
    const dineInPaymentOption = localStorage.getItem("dineInPaymentOption");
    const dineInRefId = localStorage.getItem("dineInRefId");

    let tipData = getSessionStorage("tipData") || [];

    let source = "";
    if (isDineIn) {
      source = "dine-in";
    }
    if (isDutyFree) {
      source = `${
        getAppConfig("BOOKING_SOURCE") || ""
      }-${dutyFreeSessionData?.domain
        ?.replaceAll(" ", "")
        .toLowerCase()}-${dutyFreeSessionData?.movementType?.toLowerCase()}`;
    }

    let reqBody = {
      items:
        !isDineIn || dineInPaymentOption === "later"
          ? Object.values(cartObject)
          : [],
      promo: promoCode,
      input: mandatoryInfo,
      rules: getAppConfig("CALL_PROMO_API") ? availablePromo?.data : [],
      payoption: isDineIn ? dineInPaymentOption : "now",
      refId: dineInRefId ? dineInRefId : "",
      paymentGateWayService: paymentGateway?.pgName || null,
      paymentGateWayServiceId: paymentGateway?.pgId || null,
      country: {
        code: appConfig?.countryCode,
        currency: appConfig?.currency,
      },
      source: {
        name: Util.getBookingSource(),
        type: source,
        channel: getAppConfig("POS_APP_ID"),
        partnerId: "",
        platform: getAppConfig("platform") || "",
      },
      captcha: token,
      tip: tipData,
    };

    // Used for Pulse Tablet Payment Flow
    let dataReference = JSON.parse(
      localStorage.getItem("DATA_REFERENCE") || "{}"
    );

    if (dataReference?.bookingSource) {
      reqBody["posAppId"] = dataReference.posAppId;
      reqBody["channel"] = dataReference.posAppId;
      reqBody["bookingSource"] = dataReference.bookingSource;
      reqBody["source"] = dataReference.bookingSource;
      reqBody["posTillNo"] = dataReference.posTillNo;
    }

    let qrCodeSource = getSessionStorage("qrCodeSource");
    if (qrCodeSource?.length > 0) {
      let qrCodeSourceUrl = `${reqBody["bookingSource"]}`;
      qrCodeSource = JSON.parse(qrCodeSource);
      qrCodeSource.forEach((source) => {
        qrCodeSourceUrl = qrCodeSourceUrl + ` | ${source}`;
      });
      reqBody["bookingSource"] = qrCodeSourceUrl;
    }

    if (isDineIn) {
      const kitchenNotes = localStorage.getItem("kitchenNotes") || "";
      const deliveryTime = moment(new Date(), "UTC", "UTC").format();

      reqBody["category"] = "dinein";

      if (reqBody?.items?.length > 0) {
        reqBody.items[0].deliveryOptions = {
          kitchenNotes: `Table-${dineInSessionData?.tableNumber} | ${kitchenNotes}`,
          itemEstimatedDeliveryTime: deliveryTime,
          deliveryTime: deliveryTime,
          itemCollectionDate: "",
          itemCollectionTime: "",
          itemDeliveryOption: "dinein store",
          isPackagingRequested: false,
          itemDeliveryAddress: "",
          itemActualDeliveryDate: "",
          itemActualDeliveryTime: "",
          itemDeliveredBy: "NA",
          timezone: timezone,
        };
      }
    }
    let headers = Util.getAuthHeaders();
    try {
      let apiResponse = await callAPI.post(
        config.api.checkout.checkout,
        reqBody,
        headers
      );

      let regResponse = await apiResponse.json();

      if (
        "success" === regResponse.type &&
        (201 === regResponse.status || 200 === regResponse.status)
      ) {
        if (reqBody?.items && reqBody?.items.length > 0) {
          Util.triggerMoEngageEvent("proceed_to_pay", reqBody?.items, {}, true);
        }

        if (isDineIn) {
          if (regResponse?.data?.orderId) {
            localStorage.setItem("dineInRefId", regResponse?.data?.orderId);
          } else {
            localStorage.removeItem("dineInRefId");
          }
          if (dineInPaymentOption === "later") {
            ClientCart.reset();
            pushHistory("dine-in/payBill");
          }

          // Removing LocalStorage PaymentOption
          localStorage.removeItem("dineInPaymentOption");
          localStorage.removeItem("kitchenNotes");
        }

        let tempCart = cartObject;
        Object.values(tempCart).forEach((x) => {
          x.items.forEach((citem) => {
            if (citem.itemType === "service")
              citem["mandatoryFieldsFilled"] = true;
          });
        });
        if (!isDineIn) {
          window.sessionStorage.setItem(
            "payRedir",
            JSON.stringify(ClientCart.getCart())
          );
        }
        clearSessionItems();
        if (paymentGateway !== "phicom") {
          if (
            paymentGateway?.pgName === "stripe" &&
            !regResponse?.metadata?.invoice?.clientSecret &&
            !regResponse?.metadata?.invoice?.publisherKey
          ) {
            PushAlert.error(
              "Something went wrong, please try again after sometime"
            );
            history.goBack();
            return;
          }
          if (
            regResponse?.metadata?.invoice?.paymentSession ||
            regResponse?.metadata?.invoice?.clientSecret
          ) {
            replaceHistory(`/payment`, {
              data: {
                paymentGateway: JSON.stringify(paymentGateway),
                paymentSession: regResponse?.metadata?.invoice?.paymentSession,
                clientSecret:
                  regResponse?.metadata?.invoice?.clientSecret || "",
                publisherKey:
                  regResponse?.metadata?.invoice?.publisherKey || "",
                orderId: regResponse?.data?.orderId,
                orderAmount: regResponse?.data?.totalAmount,
                orderSummary: JSON.stringify(
                  regResponse?.metadata?.priceSummary || {}
                ),
              },
            });
          } else {
            PushAlert.error(
              "Something went wrong, please try again after sometime"
            );
          }
        } else {
          if (
            regResponse?.data &&
            regResponse?.data?.redirectUrl &&
            regResponse?.data?.redirectUrl !== ""
          ) {
            localStorage.removeItem("redirectToPayment");
            window.location.replace(regResponse?.data?.redirectUrl);
          } else {
            if (isDineIn && dineInPaymentOption === "counter") {
              history.goBack();
            }
            return false;
          }
        }
      } else {
        PushAlert.error("Order Creation Failed");
        PushAlert.info(regResponse.message);
        history.goBack();
      }
    } catch (err) {
      if (isDineIn) {
        pushHistory("dine-in/payBill");
      }
      PushAlert.error("Error in creating order");
      console.log(err);
    }
  };

  const getMoEngageEventData = (cartItems) => {
    const eventData = {
      domain_types: [],
      fulfilment_types: [],
      items: [],
      items_price: [],
      stores: [],
    };

    cartItems.forEach((cartItem) => {
      const domain = cartItem?.domain;
      const fulfilmentType = cartItem?.fulfilmentType;
      const storeName = cartItem?.storeNm;

      const items = cartItem?.items;
      items.forEach((item) => {
        eventData.domain_types.push(domain);
        eventData.fulfilment_types.push(fulfilmentType);
        eventData.items.push(item?.itemName || item?.itemLabel);
        eventData.items_price.push(Number(item?.itemPrice));
        eventData.stores.push(storeName);
      });
    });

    return eventData;
  };

  const formattedDueDate = () => {
    let today = new Date();
    today.setDate(today.getDate() + 1);
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return dd + "/" + mm + "/" + yyyy;
  };

  const paymentGatewayConfiguration = async () => {
    try {
      const apiURL = config.api.payment.gatewayConfiguration;
      let apiResponse = await callAPI.get(apiURL, {}, "", false);

      let regResponse = await apiResponse.json();
      if (regResponse.data) {
        createOrder(regResponse.data);
      } else {
      }
    } catch (err) {
      console.log(err);
      pushHistory("/cart");
    }
  };

  return <Loader />;
}

export default PaymentRedirect;
