import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Text from "../../components/atoms/Text";
import callAPI, { callTokenApi } from "../../commons/callAPI";
import config from "../../commons/config";
import Util from "../../commons/util/util";
import Loader from "../../components/atoms/loader";
import { CartContext } from "../../context/cartContext";
import OrderItem from "./components/orderItemCard";
import Moengage from "@moengage/web-sdk";
import styled from "styled-components";
import { NavContext } from "../../context/navContext";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { getEventDataFromOrderSummary } from "../../util/analytics/cdp/Constant";
import { triggerOrderSuccessEvent } from "../../util/analytics/GoogleTagManager";
import {
  getSessionStorage,
  removeLocalStorage,
  removeSessionStorage,
} from "../../util/storageUtil";
import OrderConfirmedIcon from "../../assets/images/paymentSuccess/order_confirmed.gif";
import "./paymentSuccess.css";
import moment from "util/momentWrapper";
import {
  deleteAllCookies,
  formatPrice,
  removeAppliedCoupon,
} from "commons/util/helperFunctions";
import {
  PageWrapper,
  HeaderWrapper,
  OrderConfirmedImage,
  Title,
  Desc,
  OrderDetailsContainer,
  OrderDetailsWrapper,
  OrderDetailsText,
  OrderItemsContainer,
  InvoiceTextContainer,
  ActionButtonContainer,
  ActionButton,
  ContentContainer,
  ActionButtonSecondary,
  ActionButtonPrimary,
} from "./style";
import "./paymentSuccess.css";
import { SpacedOutRow } from "theme/globalStyleSheet";
import OrderItemCard from "./components/orderItemCard";
import { Sign_Out_Event } from "util/FirebaseAnalyticsUtil";
import { useCookies } from "react-cookie";
import { resetUserPermission } from "commons/util/permissionsConfig";
import { useConfig } from "context/configContext";

function PaymentSuccess() {
  const { pushHistory } = useCustomNavigation();
  const params = useParams();
  const ClientCart = useContext(CartContext);
  const useNavs = useContext(NavContext);
  const { skipUserSessionRetention } = useConfig();

  const [orderid] = useState(params.orderid);
  const [cookies, setCookie, removeCookie] = useCookies(["gwLoginData"]);
  const [isLoading, setIsLoading] = useState(true);

  const [orderItems, setOrderItems] = useState([]);
  const [orderMetadata, setOrderMetadata] = useState({});
  const [isDeliveryQrCode] = useState(
    getSessionStorage("qrCodeSource")
      ?.toLowerCase()
      ?.includes("deliver-to-gate")
  );
  const [isLoungeQrCode] = useState(
    getSessionStorage("qrCodeSource")?.toLowerCase()?.includes("lounge-bar")
  );

  useEffect(() => {
    // Clearing Dine-In session storage
    removeSessionStorage("dine-in");
    useNavs.hideFooterNavs();

    removeSessionStorage("productsData");
    removeSessionStorage("isAgeDeclared");
    removeSessionStorage("couponCode");
    removeSessionStorage("mandatoryInfoData");
    removeSessionStorage("tipData");
    removeSessionStorage("productFilters");
    removeSessionStorage("appliedCoupon");
    removeAppliedCoupon();
    removeSessionStorage("categoryData");
    ClientCart.reset();
    isLoading && callSuccessApi();

    return () => {
      if (skipUserSessionRetention) {
        signOut();
      }
      useNavs.showFooterNavs();
      removeSessionStorage("qrCodeSource");
    };
  }, []);

  const callSuccessApi = async () => {
    try {
      let apiURL = config.api.payment.orderSummaryV2;
      let apiResponse = await callAPI.get(apiURL, {
        orderId: orderid,
      });

      let regResponse = await apiResponse.json();

      if (regResponse.status === 200) {
        const eventData = getEventDataFromOrderSummary(regResponse);
        Util.triggerMoEngageEvent("payment_successful", eventData, {
          orderId: orderid,
        });
        Util.sendMessageToReactNative(
          "FSTR Checkout Completed",
          regResponse?.data
        );
        triggerOrderSuccessEvent(regResponse?.data);

        window.sessionStorage.setItem("payRedir", "");
        window.sessionStorage.setItem("accountIDRedir", "");
        regResponse.metadata.input.optional.forEach((x) => {
          x.value = "";
        });
        regResponse?.data?.forEach((x) => {
          let allAttributes = [];
          let allPreferences = [];
          if (x?.attributeList?.length > 0) {
            x?.attributeList?.forEach((attr) => {
              attr?.attributeValues?.forEach((attrVal) => {
                allAttributes.push(attrVal?.attributeValue?.trim());
              });
            });
          }
          if (x?.preferences?.length > 0) {
            x?.preferences?.forEach((pref) => {
              pref?.selection?.forEach((prefVal) => {
                allPreferences.push(prefVal?.name?.trim());
              });
            });
          }
          x.allAttributes = allAttributes;
          x.allPreferences = allPreferences;
        });
        const groupedData = convertData(regResponse);
        setOrderItems(groupedData?.data);
        setOrderMetadata(groupedData?.metadata);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const convertData = (response) => {
    let data = [];
    let metadata = {};
    let responseData = [];
    let finalData = {};

    metadata = response.metadata;
    responseData = response?.data;

    if (data.length === 0) {
      responseData?.forEach((x) => {
        const storeFound = data?.find(
          (str) => str?.shopDetails?.shopId === x?.shopDetails?.shopId
        );
        if (!storeFound) {
          data.push({
            shopDetails: x?.shopDetails,
            items: [],
          });
        }
      });
    }

    data?.forEach((localData) => {
      responseData?.forEach((respData) => {
        if (localData?.shopDetails?.shopId === respData?.shopDetails?.shopId) {
          localData.items = localData?.items?.concat(respData);
        }
      });
    });

    finalData.data = data;
    finalData.metadata = metadata;

    return finalData;
  };

  const signOut = async () => {
    try {
      let apiURL = config.api.logout;
      let apiResponse = await callAPI.put(apiURL);
      let regResponse = await apiResponse.json();

      if (regResponse.status === 200) {
        Util.sendMessageToReactNative(Sign_Out_Event);
        removeCookie("gwLoginData", { path: "/" });
        removeCookie("profileVerifiedMobileNumber", { path: "/" });
        removeCookie("jwtToken", { path: "/" });
        removeSessionStorage("hotelData");
        removeSessionStorage("productsData");
        removeSessionStorage("isAgeDeclared");
        removeSessionStorage("productFilters");
        removeSessionStorage("appliedCoupon");
        removeAppliedCoupon();
        removeSessionStorage("mandatoryInfoData");
        removeSessionStorage("tipData");
        localStorage.removeItem("module");
        localStorage.removeItem("flightInfo");
        localStorage.removeItem("userData");
        removeLocalStorage("guestUserData");
        ClientCart.reset();
        deleteAllCookies();
        resetUserPermission();

        try {
          Util.triggerMoEngageEvent("sign_out");
          if (!window.ReactNativeWebView) {
            Moengage.destroy_session();
          }
        } catch (e) {}

        const success = await callTokenApi.guest();
        if (success) {
          pushHistory("/");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const goToHome = () => {
    pushHistory(`/`);
  };

  const goToMyBooking = () => {
    pushHistory(`/travellers/profile/myBookings`);
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <PageWrapper>
        <ContentContainer>
          <HeaderWrapper>
            <OrderConfirmedImage src={OrderConfirmedIcon} />
            <Title>
              <Text type="bold" variant="heading">
                Order Successful!
              </Text>
            </Title>
            <Desc>
              <Text type="bold">
                Your order has been received. Thank you for choosing us!
              </Text>
            </Desc>
          </HeaderWrapper>
          <OrderDetailsContainer>
            <OrderDetailsWrapper>
              <SpacedOutRow>
                <OrderDetailsText>
                  <Text>{`Order No: ${orderid?.slice(-10)}`}</Text>
                </OrderDetailsText>
                <OrderDetailsText>
                  <Text>{` ${moment(orderItems?.[0]?.createdAt).format(
                    "lll"
                  )}`}</Text>
                </OrderDetailsText>
              </SpacedOutRow>
            </OrderDetailsWrapper>
            <OrderItemsContainer>
              {orderItems.map((item, index) => (
                <OrderItem
                  key={index}
                  data={item}
                  lastItem={orderItems?.length - 1 === index}
                />
              ))}
            </OrderItemsContainer>
          </OrderDetailsContainer>
          <InvoiceTextContainer>
            <Text type="bold">
              Order receipt will be sent via email, if provided.
            </Text>
          </InvoiceTextContainer>
        </ContentContainer>

        <ActionButtonContainer>
          {!skipUserSessionRetention && (
            <ActionButtonSecondary onClick={() => goToMyBooking()}>
              <Text type="extra-bold">Order Status</Text>
            </ActionButtonSecondary>
          )}
          <ActionButtonPrimary onClick={() => goToHome()}>
            <Text type="extra-bold">Go to home</Text>
          </ActionButtonPrimary>
        </ActionButtonContainer>
      </PageWrapper>
    );
  }
}

export const VerificationCodeText = styled.div`
  margin-top: 5px;
  font-size: 22px;
`;

export default PaymentSuccess;
