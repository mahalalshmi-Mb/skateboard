import $ from "jquery";
import { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import CartItem from "./components/cartItem";

import moment from "util/momentWrapper";

import { useConfig } from "context/configContext";
import { isMobile } from "react-device-detect";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import ArrowRight from "../../assets/images/cart/arrowRightBlack.svg";
import CouponIcon from "../../assets/images/cart/couponIcon.svg";
import DiscountIcon from "../../assets/images/cart/discount_icon.svg";
import callAPI from "../../commons/callAPI";
import config from "../../commons/config";
import { getAppConfig } from "../../commons/util/appConfigHelper";
import Util from "../../commons/util/util";
import Text from "../../components/atoms/Text";
import GoBack from "../../components/atoms/goBack";
import Loader from "../../components/atoms/loader";
import PushAlert from "../../components/atoms/pushAlert";
import BottomDrawer from "../../components/molecules/BottomDrawer/BottomDrawer";
import { CartContext } from "../../context/cartContext";
import { NavContext } from "../../context/navContext";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import {
  Begin_Checkout_Event,
  View_Cart_Event,
} from "../../util/FirebaseAnalyticsUtil";
import {
  getSessionStorage,
  removeLocalStorage,
  removeSessionStorage,
  setSessionStorage,
} from "../../util/storageUtil";
import CookingInstructionView from "../dineIn/components/CookingInstructionView";
import CloseIcon from "../edpFSTR/assets/CancelBlack.svg";
import PrepTimeIcon from "../edpFSTR/assets/ETABlack.svg";
import ItemCustomizationModal from "../edpFSTR/components/organism/ItemCustomizationModal";
import ItemDetailModal from "../edpFSTR/components/organism/ItemDetailModal";
import RepeatSelectionModal from "../edpFSTR/components/organism/RepeatSelectionModal";
import {
  defaultDatePickerTime,
  delTimePerStore,
  productDomain,
} from "../edpFSTR/pages/config/config";
import CookingIcon from "./assets/Cooking.svg";
import SwipeToPaySliderImage from "./assets/swipe-to-pay-slider.svg";
import "./cart.css";
import Accordian from "./components/Accordian";
import AppliedCouponModal from "./components/AppliedCouponModal";
import CartItemExpiredModal from "./components/CartItemExpiredModal";
import DutyFreeItemsModal from "./components/DutyFreeItemsModal";
import FlightHeader from "./components/FlightHeader";
import ItemNotesPrompt from "./components/ItemNotesPrompt";
import RestrictionsPrompt from "./components/RestrictionsPrompt";
import TakeawaySummary from "./components/TakeawaySummary";
import StoreItem from "./components/storeItem";
import AddTipModal from "./components/AddTipModal";
import HorzScrollContainer from "../edpFSTR/productComponents/organisms/HorzScrollContainer";
import MenuItem from "../edpFSTR/components/molecules/MenuItem";
import CouponModal from "./pages/CouponListing/CouponModal";
import { AddButton } from "theme/globalStyleSheet";
import { colors } from "theme/colors";
import {
  device,
  formatPrice,
  isDesktopDevice,
} from "commons/util/helperFunctions";
import LoginWithoutOtp from "components/organisms/LoginWithoutOtp/LoginWithoutOtp";
import EmptyCart from "./components/EmptyCart";
import PriceSummary from "components/organisms/PriceSummary/PriceSummary";
import { convertSpelling } from "commons/util/spellingHelper";
import SuccessIcon from "../../assets/images/commons/success_icon.svg";
import ErrorIcon from "../../assets/images/commons/error_icon.svg";

export default function Cart(props) {
  const sheetRef = useRef();
  const ClientCart = useContext(CartContext);
  const useNav = useContext(NavContext);
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();

  const [isWebView] = useState(Util.isWebView());
  const [isReRender, setReRender] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [priceSummary, setPriceSummary] = useState({});
  const [expiredItems, setExpiredItems] = useState({});
  const [expiredItemsCount, setExpiredItemsCount] = useState(0);
  const [showAlertBox, setShowAlertBox] = useState(false);
  const [applicableOffers, setApplicableOffers] = useState([]);

  const [promoCode, setPromoCode] = useState(
    getSessionStorage("couponCode") || ""
  );
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoClicked, setPromoClicked] = useState(false);
  const [showTaxSummary, setShowTaxSummary] = useState(false);
  const [showOtherChargesSummary, setShowOtherChargesSummary] = useState({});
  const [showAdditionalChargesSummary, setShowAdditionalOtherChargesSummary] =
    useState(false);

  const [cookies] = useCookies(["loginData", "gwLoginData"]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCustomisationModal, setShowCustomisationModal] = useState(false);
  const [showRepeatSelectionModal, setShowRepeatSelectionModal] =
    useState(false);
  const [changeRepeatSelection, setChangeRepeatSelection] = useState(false);
  const [changeRepeatSelectionItem, setChangeRepeatSelectionItem] = useState(
    {}
  );
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItem, setSelectedItem] = useState({});
  const [changeCartItem, setChangeCartItem] = useState({});
  const [prepTime, setPrepTime] = useState();
  const [showPrepTimePrompt, setShowPrepTimePrompt] = useState(true);
  const [showPreOrderPrompt, setShowPreOrderPrompt] = useState(false);
  const [showItemExpiredModal, setShowItemExpiredModal] = useState(false);
  const [productsData] = useState(getSessionStorage("productsData"));
  const [time, setTime] = useState(productsData?.deliveryOptions?.deliveryTime);
  const [availablePromo, setAvailablePromo] = useState(
    getSessionStorage("availablePromo")
  );
  const [mandatoryFieldsObj, setMandatoryFieldsObj] = useState([]);
  const [isInfoRequired, setIsInfoRequired] = useState(true);
  const [showDutyfreeItemsModal, setShowDutyfreeItemsModal] = useState(false);
  const [nonDutyFreeItemsCount, setNonDutyFreeItemsCount] = useState(0);
  const [nonDutyFreeItemIds, setNonDutyFreeItemIds] = useState([]);
  const [dutyFreeItemIds, setDutyFreeItemIds] = useState([]);
  const [showRestrictionsModal, setShowRestrictionsModal] = useState(false);
  const [cartRestrictions, setCartRestrictions] = useState({});

  const [appliedCouponObj, setAppliedCouponObj] = useState(
    getSessionStorage("appliedCoupon") || {}
  );

  // Dine-In
  const [dineInSessionData] = useState(getSessionStorage("dine-in"));
  const [isDineIn] = useState(dineInSessionData?.storeId || "" !== "");
  const [tooltipOverlay, setTooltipOverlay] = useState(false);

  const [startX, setStartX] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [maxDeltaX] = useState(((window.innerWidth - 48) * 3) / 4 - 22);
  const [cookingInstructionModalOpen, setCookingInstructionModalOpen] =
    useState(false);
  const [cookingInstruction, setCookingInstruction] = useState("");
  const [kitchenNotes, setKitchenNotes] = useState("");
  const [pageData, setPageData] = useState({});

  const [cartData, setCartData] = useState({});
  const [activeAccordian, setActiveAccordian] = useState([]);
  const [isDeliveryQrCode] = useState(
    getSessionStorage("qrCodeSource")
      ?.toLowerCase()
      ?.includes("deliver-to-gate")
  );

  const [isLoungeQrCode] = useState(
    getSessionStorage("qrCodeSource")?.toLowerCase()?.includes("lounge-bar")
  );
  const [itemNotesModalOpen, setItemNotesModalOpen] = useState(false);
  const [itemNotes, setItemNotes] = useState({});
  const [addTipModalOpen, setAddTipModalOpen] = useState(false);
  const [tipData, setTipData] = useState({});
  const [showCoupon, setShowCoupon] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState("");
  const [couponCode, setCouponCode] = useState(
    getSessionStorage("appliedCoupon")?.coupon?.toUpperCase() || ""
  );
  const [isQuickSignInOpen, setIsQuickSignInOpen] = useState(false);
  const [isCouponCodeLoginPromptOpen, setIsCouponCodeLoginPromptOpen] =
    useState(false);
  const [dutyFreeSessionData] = useState(getSessionStorage("productsData"));
  const [isDutyFree] = useState(
    dutyFreeSessionData?.domain === productDomain?.dutyFree
  );
  const [showTaxBreakup, setShowTaxBreakup] = useState(false);
  const [addNewCustomisation, setAddNewCustomisation] = useState(false);
  const [isRecommendation, setIsRecommendation] = useState(false);
  const [showAppliedPromoMessage, setShowAppliedPromoMessage] = useState(false);

  useEffect(() => {
    getPageData();
  }, []);

  useEffect(() => {
    let cartContents = ClientCart.getCart();
    Util.triggerMoEngageEvent("cart_viewed", cartContents, {}, true);
  }, []);

  useEffect(() => {
    if (showCustomisationModal === false && showDetailModal === false) {
      document.getElementsByTagName("body")[0].style.overflow = "auto";
      if (isMobile) {
        useNav.showHeaderNavs();
        useNav.hideBottomNavs();
      } else {
        useNav.showHeaderNavs();
      }
    }

    return () => {
      useNav.showHeaderNavs();
    };
  }, [showCustomisationModal, showDetailModal, showRepeatSelectionModal]);

  useEffect(() => {
    if (isDineIn) {
      useNav.hideAllNavs();
      useNav.setShowDineInBottomTab(true);
    } else if (isDeliveryQrCode || isLoungeQrCode) {
      useNav.hideAllNavs();
    } else {
      if (isMobile) {
        useNav.hideFooterNavs();
        useNav.hideBottomNavs();
        useNav.showHeaderGoBack();
      } else {
        useNav.hideFooterNavs();
        useNav.hideHeaderGoBack();
      }
    }

    return () => {
      if (isDineIn) {
        useNav.showAllNavs();
        useNav.setShowDineInBottomTab(false);
      } else if (isDeliveryQrCode || isLoungeQrCode) {
        useNav.showAllNavs();
      } else {
        useNav.showFooterNavs();
        useNav.hideHeaderGoBack();
        useNav.showBottomNavs();
      }
    };
  }, [useNav]);

  useEffect(() => {
    localStorage.removeItem("module");
  }, [isReRender]);

  // useEffect(() => {
  //   getSavedCartItems();
  // }, []);

  useEffect(() => {
    const $root = $(document);
    const sessRef = checkPayRedir();
    let reqData = ClientCart.isEmpty()
      ? sessRef && ClientCart.isEmpty(sessRef)
        ? ClientCart.getItems()
        : ClientCart.getItems(sessRef)
      : ClientCart.getItems();
    if (reqData?.length > 0) {
      Util.sendMessageToReactNative(View_Cart_Event);
    }
    getPriceSummary_v2(reqData);

    if (ClientCart.isEmpty()) {
      let applicablePromo = getSessionStorage("availablePromo");
      if (applicablePromo?.data && applicablePromo?.data?.[0]?.couponCode) {
        applicablePromo?.data?.[0]?.couponCode?.splice(
          applicablePromo?.data?.[0]?.couponCode.indexOf(
            appliedCouponObj.coupon
          ),
          1
        );
      }
      setAvailablePromo(applicablePromo);
      setAppliedCouponObj({});
      setSessionStorage("availablePromo", applicablePromo);
      setSessionStorage("appliedCoupon", {});
      setCouponCode("");
      removeSessionStorage("couponCode");
      setShowAppliedPromoMessage(false);
    }

    if (ClientCart.isEmpty()) {
      $root.find('[data-id="headerCart"]').addClass("header-cart-empty");
      $root.find('[data-id="headerCart"]').removeClass("header-cart-filled");
    } else {
      $root.find('[data-id="headerCart"]').addClass("header-cart-filled");
      $root.find('[data-id="headerCart"]').removeClass("header-cart-empty");
    }
  }, [isReRender]);

  const getPriceSummary_v2 = async (reqData) => {
    let ruleId = "";
    let cartArray = [...reqData];
    cartArray.forEach((ele) => {
      ele.ruleId = ruleId;
    });
    let promo = ClientCart.isEmpty()
      ? ""
      : promoCode
      ? promoCode.toUpperCase()
      : "";

    const mandatoryInfoData = getSessionStorage("mandatoryInfoData");
    const tipData = getSessionStorage("tipData") || [];
    const promoData = getSessionStorage("availablePromo") || [];
    const flightAdded = mandatoryInfoData?.mandatory?.find(
      (x) => x.key === "flightDetails"
    );
    ClientCart.updateFnbFlight(
      flightAdded?.value?.flightId,
      flightAdded?.value?.UID,
      true
    );
    cartArray?.forEach((x) => {
      if (x.itemType === "product") {
        x.flightUid = flightAdded?.value?.UID;
        x.flightId = flightAdded?.value?.flightId;
      }
    });
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

    setIsLoading(true);
    try {
      let apiResponse = await callAPI.patch(
        config.api.cart.summary,
        {
          promo,
          ruleId,
          items: cartArray,
          rules: getAppConfig("CALL_PROMO_API") ? promoData?.data || [] : [],
          tip: tipData,
          source: {
            name: getAppConfig("CALL_PROMO_API") ? Util.getBookingSource() : "",
            type: source,
            channel: getAppConfig("POS_APP_ID"),
            partnerId: "",
            platform: getAppConfig("platform") || "",
          },
        },
        "",
        true
      );

      let regResponse = await apiResponse.json();

      if (regResponse.status === 200) {
        if (promoClicked) {
          if (
            regResponse?.metadata?.coupon &&
            regResponse?.metadata?.coupon?.isValid
          ) {
            setPromoApplied(true);
            setSessionStorage("couponCode", promoCode);
            setPromoClicked(false);
          } else {
            setPromoApplied(false);
            removeSessionStorage("couponCode");
            setPromoClicked(false);
          }
        }
        regResponse?.data?.products?.forEach((x) => {
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
        const sumData = convertv2(regResponse);
        const convertedData = convertData(regResponse);
        setCartData(convertedData);
        let domains = [];
        convertedData?.data?.forEach((x) => {
          domains.push(x.domain);
        });
        setActiveAccordian(domains);
        checkForDutyFreeItems(regResponse);
        let allPrepTime = [];
        let allItems = [];
        let prepTimeUnit = "";
        let found = undefined;
        if (sumData.flights.length > 0) {
          sumData.flights?.forEach((fl) => {
            allItems = allItems.concat(fl.cartItems);
            fl.cartItems?.forEach((cItems) => {
              cItems.items?.forEach((item) => {
                if (item?.prepTime && item.itemType === "product") {
                  allPrepTime.push(parseInt(item.prepTime?.value));
                  prepTimeUnit = item.prepTime?.durationType;
                }
              });
            });
          });
          found = allItems?.find(
            (x) => x?.domain?.toLowerCase() === "food and beverages"
          );
          if (allPrepTime.length > 0) {
            let maxPrepTime = 0;
            if (
              productsData?.deliveryOptions?.deliveryOption ===
              config.deliveryOptions.deliveryAtGate
            ) {
              const fnbStores = allItems.filter(
                (store) => store.itemType === "product"
              );
              const noOfFnbStores = fnbStores.length;
              maxPrepTime =
                Math.max(...allPrepTime) + noOfFnbStores * delTimePerStore;
            } else {
              maxPrepTime = Math.max(...allPrepTime);
            }
            maxPrepTime = `${maxPrepTime} ${prepTimeUnit}`;
            setPrepTime(maxPrepTime);
          } else {
            setPrepTime(null);
          }
          if (found) {
            setShowPreOrderPrompt(true);
          } else {
            setShowPreOrderPrompt(false);
          }
        }
        setPriceSummary(sumData);
        setExpiredItems({});
        setShowItemExpiredModal(false);
        if (promoClicked && regResponse?.metadata?.alerts?.length > 0) {
          handleAlerts(regResponse.metadata.alerts);
        }
        regResponse.metadata.input.mandatory.forEach((x) => {
          if (!x.value) {
            x.value = "";
          }
        });
        setMandatoryFieldsObj(regResponse.metadata.input);
        const mandatoryInfoData = getSessionStorage("mandatoryInfoData");
        if (
          mandatoryInfoData &&
          regResponse?.metadata?.input?.mandatory?.length > 0
        ) {
          setIsInfoRequired(mandatoryInfoData?.isMandatoryInfoRequired);
        } else {
          if (regResponse?.metadata?.input?.mandatory?.length > 0) {
            setIsInfoRequired(
              regResponse?.metadata?.input?.mandatory.some(
                checkMadatoryFieldsRequired
              )
            );
          } else {
            setIsInfoRequired(false);
          }
        }
        let chargesObj = {};
        if (regResponse?.metadata?.priceSummary?.charges?.length > 0) {
          regResponse?.metadata?.priceSummary?.charges?.forEach((x) => {
            chargesObj[x.name] = false;
          });
        }
        if (!regResponse?.metadata?.priceSummary?.couponApplied) {
          let applicablePromo = getSessionStorage("availablePromo");
          if (applicablePromo?.data && applicablePromo?.data?.[0]?.couponCode) {
            applicablePromo?.data?.[0]?.couponCode?.splice(
              applicablePromo?.data?.[0]?.couponCode.indexOf(
                appliedCouponObj.coupon
              ),
              1
            );
          }
          setAvailablePromo(applicablePromo);
          setAppliedCouponObj({});
          setSessionStorage("availablePromo", applicablePromo);
          setSessionStorage("appliedCoupon", {});
          removeSessionStorage("couponCode");
        }
        setShowOtherChargesSummary(chargesObj);
        setPaymentGateway(regResponse?.metadata?.paymentGateway?.[0] || {});
        setIsLoading(false);

        // if (ClientCart.isEmpty() && !sessRef) {
        //   resetSelectedDeliveries(true);
        // } else {
        //   if (!(delRef && selDelRef)) {
        //     createSelectedDeliveries(
        //       sumData.flights,
        //       deliveryState.selectedDeliveryData,
        //       deliveryState.deliveryData
        //     );
        //   }
        // }
      } else if (
        regResponse.status === 404 &&
        (regResponse?.metadata?.available?.products?.length > 0 ||
          regResponse?.metadata?.available?.services?.length > 0 ||
          regResponse?.metadata?.expired?.products?.length > 0 ||
          regResponse?.metadata?.expired?.services?.length > 0)
      ) {
        let availObj = {
          data: regResponse.metadata.available,
          metadata: {},
        };
        let availItems = convertv2(availObj);
        let allPrepTime = [];
        let allItems = [];
        let prepTimeUnit = "";
        let found = undefined;
        if (availItems.flights.length > 0) {
          availItems.flights?.forEach((fl) => {
            allItems = allItems.concat(fl.cartItems);
            fl.cartItems?.forEach((cItems) => {
              cItems.items?.forEach((item) => {
                if (item?.prepTime && item.itemType === "product") {
                  allPrepTime.push(parseInt(item.prepTime?.value));
                  prepTimeUnit = item.prepTime?.durationType;
                }
              });
            });
          });
          found = allItems?.find(
            (x) => x?.domain?.toLowerCase() === "food and beverages"
          );
          if (allPrepTime.length > 0) {
            let maxPrepTime = Math.max(...allPrepTime);
            maxPrepTime = `${maxPrepTime} ${prepTimeUnit}`;
            setPrepTime(maxPrepTime);
          } else {
            setPrepTime(null);
          }
          if (found) {
            setShowPreOrderPrompt(true);
          } else {
            setShowPreOrderPrompt(false);
          }
        }
        setPriceSummary(availItems);
        let expObj = {
          data: regResponse.metadata.expired,
          metadata: {},
        };
        const expItems = convertv2(expObj);
        setExpiredItems(expItems);
        const expItemsCount =
          regResponse?.metadata?.expired?.products?.length +
          regResponse?.metadata?.expired?.services?.length;
        setExpiredItemsCount(expItemsCount);
        if (expItemsCount > 0) {
          setShowItemExpiredModal(true);
        }
        setIsLoading(false);
      } else {
        PushAlert.error(regResponse.message);
        ClientCart.reset();
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      ClientCart.reset();
      setIsLoading(false);
    }
  };

  const getPageData = async () => {
    try {
      let apiURL = config.api.pages.replace(
        "{{pageId}}",
        Util.getSlug(props?.location?.pathname)
      );
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (apiResponse.status === 200) {
        setPageData(regResponse);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkMandatoryFields = (arr) => {
    return arr?.some(checkMadatoryFieldsRequired);
  };

  function convertv2(response) {
    let summaryData = {
      flights: [],
      metadata: response.metadata,
    };

    let rawData = response;
    let noStock = 0;
    let finalApplicableOffers = [];

    rawData?.data?.products?.forEach((product) => {
      Array.prototype.push.apply(
        finalApplicableOffers,
        product.applicableOffers
      );
      const flightUid = product?.flight?.uid ? product?.flight?.uid : "Others";
      const itemId = product.storeInfo?.storeId
        ? product.storeInfo.storeId
        : "";

      let flightFlag = false;

      summaryData.flights.forEach((flight) => {
        if (flightUid === flight.flightUid) {
          flightFlag = true;

          let storeFlag = false;
          flight.cartItems.map((cartItem) => {
            if (itemId === cartItem.itemId) {
              storeFlag = true;
              cartItem.items.push(product);
            }
          });
          if (!storeFlag) {
            let store = {
              itemId: itemId,
              itemName: product.storeInfo?.storeName,
              itemType: product.itemType,
              domain: product.storeInfo?.domain,
              items: [product],
            };
            flight.cartItems.push(store);
          }
        }
      });

      if (!flightFlag) {
        if (flightUid === "Others") {
          let store = {
            itemId: itemId,
            itemName: product.storeInfo?.storeName,
            itemType: product.itemType,
            domain: product.storeInfo?.domain,
            items: [product],
          };

          let newFlightItem = {
            flightId: "Others",
            flightUid: flightUid,
            cartItems: [store],
          };
          summaryData.flights.push(newFlightItem);
        } else {
          let store = {
            itemId: itemId,
            itemName: product.storeInfo?.storeName,
            itemType: product.itemType,
            domain: product.storeInfo?.domain,
            items: [product],
          };

          let newFlightItem = {
            flightId: product.flight?.id,
            flightUid: flightUid,
            source: product.flight?.source,
            destination: product.flight?.destination,
            scheduledDate: moment(product.flight?.estimatedDeparture).format(
              "L"
            ),
            scheduledTime: moment(product.flight?.estimatedDeparture).format(
              "LTS"
            ),
            estimatedDeparture: product.flight?.estimatedDeparture,
            sector: product.flight?.sector,
            gate: product.flight?.gate,
            cartItems: [store],
          };
          summaryData.flights.push(newFlightItem);
        }
      }

      product.alerts &&
        product.alerts.forEach((item) => {
          if (item.priority <= 5) setShowAlertBox(true);
        });
    });
    setApplicableOffers(finalApplicableOffers);

    rawData?.data?.services?.forEach((service) => {
      const flightUid = service.flight?.uid ? service.flight?.uid : "Others";
      let flightFlag = false;

      summaryData.flights.forEach((flight) => {
        if (flightUid === flight.flightUid) {
          flightFlag = true;

          flight.cartItems.push(service);
        }
      });

      if (!flightFlag) {
        let newFlightItem = {
          flightId: service.flight?.id,
          flightUid: flightUid,
          source: service.flight?.source,
          destination: service.flight?.destination,
          scheduledDate: moment(service.flight?.estimatedDeparture).format("L"),
          scheduledTime: moment(service.flight?.estimatedDeparture).format(
            "LTS"
          ),
          estimatedDeparture: service.flight?.estimatedDeparture,
          sector: service.flight?.sector,
          gate: service.flight?.gate,
          cartItems: [service],
        };

        summaryData.flights.push(newFlightItem);
      }

      service.alerts &&
        service.alerts.forEach((item) => {
          if (item.priority <= 5) setShowAlertBox(true);
        });
    });

    rawData?.data?.noschema?.forEach((noschema) => {
      const flightUid = noschema.flight?.uid ? noschema.flight?.uid : "Others";
      let flightFlag = false;

      summaryData.flights.forEach((flight) => {
        if (flightUid === flight.flightUid) {
          flightFlag = true;

          flight.cartItems.push(noschema);
        }
      });

      if (!flightFlag) {
        let newFlightItem = {
          flightId: noschema.flight?.id,
          flightUid: flightUid,
          source: noschema.flight?.source,
          destination: noschema.flight?.destination,
          scheduledDate: moment(noschema.flight?.estimatedDeparture).format(
            "L"
          ),
          scheduledTime: moment(noschema.flight?.estimatedDeparture).format(
            "LTS"
          ),
          estimatedDeparture: noschema.flight?.estimatedDeparture,
          sector: noschema.flight?.sector,
          gate: noschema.flight?.gate,
          cartItems: [noschema],
        };

        summaryData.flights.push(newFlightItem);
      }

      noschema?.alerts?.forEach((item) => {
        if (item.priority <= 5) setShowAlertBox(true);
      });
    });

    if (noStock > 0) {
      PushAlert.info(
        `${noStock} ${noStock > 1 ? "items" : "item"} ${
          noStock > 1 ? "are" : "is"
        } out of stock.`
      );
    }

    return summaryData;
  }

  const convertData = (response) => {
    let data = [];
    let flightDetails = {};
    let metadata = {};
    let responseData = [];
    let finalData = {};

    metadata = response.metadata;
    responseData = responseData?.concat(
      response?.data?.noschema,
      response?.data?.products,
      response?.data?.services
    );

    const flightFound = responseData?.find(
      (x) => x.flight && Object.keys(x.flight).length > 0
    );
    if (flightFound) {
      flightDetails = flightFound?.flight;
    }

    if (data.length === 0) {
      responseData.forEach((x) => {
        const domainFound = data.find(
          (dom) =>
            dom.domain === x?.storeInfo?.domain || dom.domain === x?.ancestors
        );
        if (!domainFound) {
          data.push({
            domain: x?.storeInfo?.domain || x?.ancestors,
            store: [],
          });
        }
      });
    }

    data.forEach((localData) => {
      responseData.forEach((respData) => {
        if (
          localData.domain &&
          (localData?.domain === respData?.storeInfo?.domain ||
            localData?.domain === respData?.ancestors)
        ) {
          const storeFound = localData?.store.find(
            (storeObj) =>
              storeObj?.storeDetails?.storeId ===
                respData?.storeInfo?.storeId ||
              storeObj?.storeDetails?.storeId === respData?.vendorInfo?.vendorId
          );
          if (!storeFound) {
            localData?.store?.push({
              storeName:
                respData?.storeInfo?.storeName ||
                respData?.vendorInfo?.vendorName,
              storeDetails: respData?.storeInfo || respData?.vendorInfo,
              items: [],
            });
          }
          localData?.store?.forEach((str) => {
            if (
              str?.storeDetails?.storeId === respData?.storeInfo?.storeId ||
              str?.storeDetails?.storeId === respData?.vendorInfo?.vendorId
            ) {
              str.items.push(respData);
            }
          });
        }
      });
    });

    finalData.data = data;
    finalData.flightDetails = flightDetails;
    finalData.metadata = metadata;

    return finalData;
  };

  const checkMadatoryFieldsRequired = (arr) => {
    return arr.showOnUI;
  };

  const handleAlerts = (alerts) => {
    let singleAlert = [];
    if (alerts.length === 1) {
      singleAlert = alerts;
    } else {
      const result = alerts.sort((a, b) => a.priority - b.priority);
      singleAlert = result;
    }
    if (singleAlert.length > 0) {
      if (singleAlert[0]?.type === "success") {
        PushAlert.success(singleAlert[0]?.message);
      } else if (singleAlert[0]?.type === "warning") {
        PushAlert.warning(singleAlert[0]?.message);
      } else if (singleAlert[0]?.type === "info") {
        PushAlert.info(singleAlert[0]?.message);
      } else if (
        singleAlert[0]?.type === "error" ||
        singleAlert[0]?.type === "failure"
      ) {
        PushAlert.error(singleAlert[0]?.message);
      } else {
        PushAlert.error(singleAlert[0]?.message);
      }
    }
  };

  const checkPayRedir = () => {
    const redirStr = window.sessionStorage.getItem("payRedir");
    let redirObj;

    if (
      !(
        void 0 === redirStr ||
        "" === redirStr ||
        " " === redirStr ||
        null === redirStr
      )
    ) {
      redirObj = JSON.parse(redirStr);

      ClientCart.set(redirObj);
    }

    window.sessionStorage.setItem("payRedir", "");

    return redirObj;
  };

  const checkIfLoggedInForPromo = () => {
    if (cookies.gwLoginData) {
      handleApplyCoupon({
        coupon: couponCode?.toLowerCase(),
      });
    } else {
      setIsCouponCodeLoginPromptOpen(true);
    }
  };

  const checkIfLoggedIn = () => {
    if (cookies.gwLoginData) {
      doCheckout();
    } else {
      setIsQuickSignInOpen(true);
    }
  };

  const doCheckout = () => {
    Util.sendMessageToReactNative("Checkout Initiated");
    if (isDineIn) {
      localStorage.setItem("kitchenNotes", kitchenNotes);
    }
    Util.sendMessageToReactNative(Begin_Checkout_Event);
    if (!ClientCart.isEmpty()) {
      redirectToPayment();
    }
  };

  const redirectToPayment = () => {
    pushHistory("/paymentRedir", {
      data: {
        paymentGateway: JSON.stringify(paymentGateway || {}),
      },
    });
    if (isDineIn) {
      localStorage.setItem("dineInPaymentOption", "later");
    }
    localStorage.setItem("redirectToPayment", "fromEdp");
  };

  const handleDetailClick = (item) => {
    const selectedItem = Object.assign({}, item);
    selectedItem.price = "";
    setSelectedItem(selectedItem);
    if (item?.isCustomizable) {
      const updatedObject = item;
      updatedObject.addOns.forEach((addOn) => {
        delete addOn.quantity;
        delete addOn.priceToPay;
        addOn.selected = true;
      });
      updatedObject.addOn = item.addOns;
      updatedObject.customisationPreferences = item.preferences;
      setSelectedItemId(updatedObject.itemId);
      setChangeCartItem(updatedObject);
      setShowCustomisationModal(true);
    } else {
      setSelectedItemId(item.itemId);
      setShowDetailModal(true);
    }
  };

  const deleteAllUnavailableItems = () => {
    let cartContents = ClientCart.getCart();

    expiredItems.flights.forEach((flightItem) => {
      flightItem.cartItems.forEach((cartItem) => {
        if (cartItem.itemType === "product") {
          cartItem.items.forEach((subItem) => {
            let localAddon = [];
            if (subItem.addOns) {
              localAddon = JSON.parse(JSON.stringify(subItem.addOns));
              localAddon = localAddon.map((x) => {
                x.selected = true;
                delete x.quantity;
                delete x.priceToPay;
                return x;
              });
            }

            let localCustomisationPreferences = [];
            if (subItem.preferences) {
              localCustomisationPreferences = JSON.parse(
                JSON.stringify(subItem.preferences)
              );
              localCustomisationPreferences = localCustomisationPreferences.map(
                (x) => {
                  x.selection.forEach((y) => {
                    delete y.preferenceSku;
                  });
                  return x;
                }
              );
            }

            let item = subItem;
            item.addOn = localAddon;
            item.customisationPreferences = localCustomisationPreferences;

            const updateParam = {
              storeId: subItem.storeInfo.storeId,
              productId: subItem.itemId,
              quantity: 0,
              addOn: localAddon || [],
              customisationPreferences: localCustomisationPreferences || [],
              item: item,
            };
            ClientCart.updateProductItem(updateParam, true);
          });
        } else {
          cartContents[cartItem.vendorInfo?.vendorId] &&
            cartContents[cartItem.vendorInfo?.vendorId].items.forEach((x) => {
              if (cartItem.flightuid !== "") {
                if (
                  x.itemId === cartItem.ref &&
                  x.flightUid === cartItem.flightuid
                ) {
                  let found = cartItem.uom.find(
                    (ele) => ele.primaryFlag === "Y" || ele.primaryFlag === "y"
                  );
                  if (found) {
                    const updateParam = {
                      storecode: cartItem.vendorInfo?.vendorId,
                      productId: x.itemId,
                      quantity: 0,
                      flightUid: cartItem.flightuid,
                    };
                    ClientCart.updateService(updateParam, true);
                  } else {
                    const updateParam = {
                      storecode: cartItem.vendorInfo?.vendorId,
                      productId: x.itemId,
                      quantity: 0,
                      flightUid: cartItem.flightuid,
                    };
                    ClientCart.updateService(updateParam, true);
                  }
                }
              } else {
                if (x.itemId === cartItem.ref) {
                  let found = cartItem.uom.find(
                    (ele) => ele.primaryFlag === "Y" || ele.primaryFlag === "y"
                  );
                  if (found) {
                    const updateParam = {
                      storecode: cartItem.vendorInfo?.vendorId,
                      productId: x.itemId,
                      quantity: 0,
                      flightUid: "",
                    };
                    ClientCart.updateService(updateParam, true);
                  } else {
                    const updateParam = {
                      storecode: cartItem.vendorInfo?.vendorId,
                      productId: x.itemId,
                      quantity: 0,
                      flightUid: "",
                    };
                    ClientCart.updateService(updateParam, true);
                  }
                }
              }
            });
        }
      });
    });
    setReRender(!isReRender);
  };

  const deleteAllNonDutyFreeItems = () => {
    nonDutyFreeItemIds.forEach((x) => {
      const updateParam = {
        storeId: x.storeId,
        productId: x.itemId,
        quantity: 0,
        addOn: [],
        customisationPreferences: [],
        item: [],
      };
      ClientCart.updateProductItem(updateParam, true);
    });
    setReRender(!isReRender);
  };

  const deleteAllDutyFreeItems = () => {
    dutyFreeItemIds.forEach((x) => {
      const updateParam = {
        storeId: x.storeId,
        productId: x.itemId,
        quantity: 0,
        addOn: [],
        customisationPreferences: [],
        item: [],
      };
      ClientCart.updateProductItem(updateParam, true);
    });
    removeSessionStorage("productsData");
    setReRender(!isReRender);
  };

  const handleDeliveryChange = () => {
    pushHistory("/delivery-flight-selection");
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX) {
      const currentX = e.touches[0].clientX;
      setDeltaX(Math.min(maxDeltaX, Math.max(0, currentX - startX)));
    }
  };

  const handleTouchEnd = () => {
    if (deltaX >= maxDeltaX) {
      const dineInRefId = localStorage.getItem("dineInRefId");
      if (
        dineInSessionData?.domain &&
        dineInSessionData?.domain.toLowerCase() === "lounge" &&
        dineInRefId
      ) {
        PushAlert.error(
          "You cannot checkout from here. Please complete your payment for the current order first."
        );
      } else {
        checkIfLoggedIn();
      }
      setStartX(0);
      setDeltaX(0);
    } else {
      setStartX(0);
      setDeltaX(0);
    }
  };

  const goToMandatoryFieldsPage = () => {
    let obj = JSON.parse(JSON.stringify(mandatoryFieldsObj));
    obj.isMandatoryInfoRequired = isInfoRequired;
    setSessionStorage("mandatoryInfoData", obj);

    pushHistory("/mandatoryInfo");
  };

  const closeModal = () => {
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
  };

  const handleClearClick = () => {
    setCookingInstruction("");
  };

  const handleSaveClick = () => {
    setCookingInstructionModalOpen(false);
    setKitchenNotes(cookingInstruction);
  };

  const checkForDutyFreeItems = (response) => {
    let data = [];
    data = data.concat(
      response?.data?.noschema,
      response?.data?.products,
      response?.data?.services
    );
    const dutyFreeItems = data?.filter(
      (x) => x?.storeInfo?.domain === "Duty Free"
    );
    if (dutyFreeItems?.length > 0) {
      let dutyfreeIds = [];
      dutyFreeItems.forEach((x) => {
        dutyfreeIds.push({
          itemId: x?.itemId,
          storeId: x?.vendorInfo?.vendorId || x?.storeInfo?.storeId,
        });
      });
      setDutyFreeItemIds([...dutyfreeIds]);
      const nonDutyFreeItems = data.filter(
        (x) => x.itemType !== "product" || x?.storeInfo?.domain !== "Duty Free"
      );
      if (nonDutyFreeItems.length > 0) {
        setShowDutyfreeItemsModal(true);
        setNonDutyFreeItemsCount(nonDutyFreeItems.length);
        let ids = [];
        nonDutyFreeItems.forEach((x) => {
          ids.push({
            itemId: x?.itemId,
            storeId: x?.vendorInfo?.vendorId || x?.storeInfo?.storeId,
          });
        });
        setNonDutyFreeItemIds([...ids]);
      } else {
        setShowDutyfreeItemsModal(false);
        setNonDutyFreeItemsCount(0);
        setShowDutyfreeItemsModal([]);
        setCartRestrictions(response?.metadata?.restrictions || {});
        if (response?.metadata?.restrictions?.restrictionApplied) {
          setShowRestrictionsModal(true);
        }
      }
    } else {
      setShowDutyfreeItemsModal(false);
      setNonDutyFreeItemsCount(0);
      setShowDutyfreeItemsModal([]);
      setCartRestrictions(response?.metadata?.restrictions || {});
      if (response?.metadata?.restrictions?.restrictionApplied) {
        setShowRestrictionsModal(true);
      }
    }
  };

  const handleViewCoupon = () => {
    setShowCoupon(!showCoupon);
  };

  const handleRemovePromo = () => {
    let applicablePromo = getSessionStorage("availablePromo");
    if (applicablePromo?.data && applicablePromo?.data?.[0]?.couponCode) {
      applicablePromo?.data?.[0]?.couponCode?.splice(
        applicablePromo?.data?.[0]?.couponCode.indexOf(appliedCouponObj.coupon),
        1
      );
    }
    setAvailablePromo(applicablePromo);
    setAppliedCouponObj({});
    setSessionStorage("availablePromo", applicablePromo);
    setSessionStorage("appliedCoupon", {});
    setShowAppliedPromoMessage(false);
    setReRender(!isReRender);
  };

  const handleAccordianToggle = (domain) => {
    let data = JSON.parse(JSON.stringify(activeAccordian));
    if (data.includes(domain)) {
      data.splice(data.indexOf(domain), 1);
    } else {
      data.push(domain);
    }
    setActiveAccordian([...data]);
  };

  const handleQuickLinks = (url) => {
    if (url) {
      pushHistory(url);
    }
  };

  const getItemsLength = (storeArray) => {
    let len = 0;
    storeArray.forEach((x) => (len += x?.items?.length));
    return len?.toString();
  };

  const handleApplyCoupon = (obj) => {
    let applicablePromo =
      JSON.parse(JSON.stringify(getSessionStorage("availablePromo"))) || {};
    let appliedCoupon = getSessionStorage("appliedCoupon");

    if (applicablePromo && Object.keys(applicablePromo)?.length === 0) {
      let tempObj = {};
      let tempData = [];
      let couponData = [];
      couponData?.push(obj?.coupon);
      tempData?.push({ couponCode: couponData });
      tempObj.data = tempData;
      applicablePromo = tempObj;
    } else {
      if (applicablePromo?.data?.[0]?.couponCode) {
        if (!applicablePromo?.data?.[0]?.couponCode?.includes(obj?.coupon)) {
          applicablePromo?.data?.[0]?.couponCode?.push(obj?.coupon);
        }
      } else {
        let arr = [];
        arr?.push(obj?.coupon);
        applicablePromo.data[0].couponCode = arr;
      }
    }
    obj.showAppliedCouponModal = true;
    // setSelectedCoupon(obj?.coupon);
    setSessionStorage("availablePromo", applicablePromo);
    setSessionStorage("appliedCoupon", obj);
    setAppliedCouponObj(obj);

    Util.triggerMoEngageEvent("apply_coupon", {
      couponName: obj?.coupon || "",
      couponDiscountPercentage: obj?.discOff || "",
      ruleId: obj?.ruleId || "",
      promoId: obj?.promoId || "",
    });
    setShowCoupon(false);
    setShowAppliedPromoMessage(true);
    setTimeout(() => {
      setShowAppliedPromoMessage(false);
    }, [7000]);
    setReRender(!isReRender);
  };

  // const handleRemovePromo = (coupon) => {
  //   let applicablePromo = getSessionStorage("availablePromo");
  //   if (applicablePromo && applicablePromo?.data?.[0]?.couponCode) {
  //     applicablePromo?.data?.[0]?.couponCode?.splice(
  //       applicablePromo?.data?.[0]?.couponCode?.indexOf(coupon.toLowerCase()),
  //       1
  //     );
  //   }
  //   setAvailablePromo(applicablePromo);
  //   setSessionStorage("availablePromo", applicablePromo);
  //   setSessionStorage("appliedCoupon", {});
  //   setSelectedCoupon();
  //   getPriceSummary();
  // };

  const handleOtherCharges = (name) => {
    let obj = JSON.parse(JSON.stringify(showOtherChargesSummary));
    if (obj[name] === true) {
      obj[name] = false;
    } else {
      obj[name] = true;
    }
    setShowOtherChargesSummary(obj);
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div
        className={`cart ${
          isDineIn || ClientCart.isEmpty() ? `cart-ful-height` : ``
        }`}
        style={{
          backgroundColor: ClientCart.isEmpty() ? "#fff" : "#f5f5f5",
        }}
      >
        {ClientCart.isEmpty() ? (
          <>
            {isDineIn || isDeliveryQrCode || isLoungeQrCode ? (
              <GoBack
                color={"black"}
                style={{
                  marginTop: "20px",
                  marginLeft: "24px",
                }}
                marginLeft="8px"
                fontWeight={500}
                fontSize="16px"
                lineHeight="normal"
                onBack={() => {
                  isDineIn
                    ? pushHistory(`/storefront/${dineInSessionData?.storeId}`)
                    : history.goBack();
                }}
              />
            ) : null}
            <EmptyCart data={pageData} />
          </>
        ) : (
          <>
            <div
              className={`content-container ${
                isDineIn ? `cart-dinein-header-padding` : ``
              }`}
            >
              {cartData?.flightDetails &&
                Object.keys(cartData?.flightDetails)?.length > 1 && (
                  <FlightHeader
                    data={cartData?.flightDetails || {}}
                    showEditOption={checkMandatoryFields(
                      priceSummary?.metadata?.input?.mandatory
                    )}
                  />
                )}
              {showDetailModal && (
                <ItemDetailModal
                  selectedItemId={selectedItemId}
                  setSelectedItemId={setSelectedItemId}
                  selectedItem={selectedItem}
                  setShowCustomisationModal={setShowCustomisationModal}
                  isDrawerOpen={showDetailModal}
                  setIsDrawerOpen={setShowDetailModal}
                  isReRender={() => setReRender(!isReRender)}
                  reRender={true}
                  disableDrag={true}
                  setShowDetailModal={setShowDetailModal}
                ></ItemDetailModal>
              )}
              {showCustomisationModal && (
                <ItemCustomizationModal
                  selectedItemId={selectedItemId}
                  onModalHide={() => {
                    setAddNewCustomisation(false);
                    setShowCustomisationModal(false);
                  }}
                  updateCartItem={
                    isRecommendation ? false : changeCartItem !== undefined
                  }
                  changeCartItem={changeCartItem}
                  isReRender={() => setReRender(!isReRender)}
                  reRender={true}
                  isDrawerOpen={showCustomisationModal}
                  setIsDrawerOpen={setShowCustomisationModal}
                  skipSaveCart={true}
                  disableDrag={true}
                  changeRepeatSelection={changeRepeatSelection}
                  setIsRecommendation={setIsRecommendation}
                ></ItemCustomizationModal>
              )}
              {showRepeatSelectionModal && (
                <RepeatSelectionModal
                  selectedItemId={selectedItemId}
                  onModalHide={() => setShowRepeatSelectionModal(false)}
                  setSelectedItemId={setSelectedItemId}
                  setShowCustomisationModal={setShowCustomisationModal}
                  showRepeatSelectionModal={showRepeatSelectionModal}
                  setShowRepeatSelectionModal={setShowRepeatSelectionModal}
                  setChangeRepeatSelection={setChangeRepeatSelection}
                  setChangeRepeatSelectionItem={setChangeRepeatSelectionItem}
                  changeRepeatSelectionItem={changeRepeatSelectionItem}
                  isReRender={() => setReRender(!isReRender)}
                  reRender={true}
                  setChangeCartItem={setChangeCartItem}
                  skipSaveCart={true}
                  disableDrag={true}
                  setAddNewCustomisation={setAddNewCustomisation}
                ></RepeatSelectionModal>
              )}
              {showItemExpiredModal && (
                <CartItemExpiredModal
                  isDrawerOpen={showItemExpiredModal}
                  setIsDrawerOpen={setShowItemExpiredModal}
                  expiredItemCount={expiredItemsCount}
                  handleSubmit={deleteAllUnavailableItems}
                />
              )}
              {showDutyfreeItemsModal && nonDutyFreeItemsCount > 0 && (
                <DutyFreeItemsModal
                  isDrawerOpen={showDutyfreeItemsModal}
                  setIsDrawerOpen={setShowDutyfreeItemsModal}
                  unavailableItemsCount={nonDutyFreeItemsCount}
                  handlePrimaryButton={deleteAllNonDutyFreeItems}
                  handleSecondaryButton={deleteAllDutyFreeItems}
                />
              )}
              {showRestrictionsModal && (
                <RestrictionsPrompt
                  isDrawerOpen={showRestrictionsModal}
                  setIsDrawerOpen={setShowRestrictionsModal}
                  restrictionText={cartRestrictions?.restrictions || []}
                />
              )}
              {itemNotesModalOpen && (
                <ItemNotesPrompt
                  isDrawerOpen={itemNotesModalOpen}
                  setIsDrawerOpen={setItemNotesModalOpen}
                  itemNotes={itemNotes}
                  setItemNotes={setItemNotes}
                  isReRender={() => setReRender(!isReRender)}
                  reRender={true}
                  skipSaveCart={true}
                />
              )}
              {addTipModalOpen && (
                <AddTipModal
                  isDrawerOpen={addTipModalOpen}
                  setIsDrawerOpen={setAddTipModalOpen}
                  data={tipData}
                  isReRender={() => setReRender(!isReRender)}
                  reRender={true}
                />
              )}
              {isQuickSignInOpen && (
                <LoginWithoutOtp
                  isDrawerOpen={isQuickSignInOpen}
                  setIsDrawerOpen={setIsQuickSignInOpen}
                  successHandler={doCheckout}
                  disableSaveCart={true}
                />
              )}
              {isCouponCodeLoginPromptOpen && (
                <LoginWithoutOtp
                  isDrawerOpen={isCouponCodeLoginPromptOpen}
                  setIsDrawerOpen={setIsCouponCodeLoginPromptOpen}
                  successHandler={() =>
                    handleApplyCoupon({
                      coupon: couponCode?.toLowerCase(),
                    })
                  }
                  disableSaveCart={true}
                />
              )}
              {isDineIn || isDeliveryQrCode || isLoungeQrCode ? (
                <GoBack
                  color={"black"}
                  style={{
                    marginTop: "20px",
                    marginLeft: "24px",
                  }}
                  marginLeft="8px"
                  fontWeight={500}
                  fontSize="16px"
                  lineHeight="normal"
                  onBack={() => {
                    isDineIn
                      ? pushHistory(`/storefront/${dineInSessionData?.storeId}`)
                      : history.goBack();
                  }}
                />
              ) : null}
              <div
                className={`purchase-item-container ${
                  isDineIn ? `no-padding-top` : ``
                }`}
                // style={{
                //   padding: isDineIn
                //     ? "0px 24px 40px 24px"
                //     : "30px 24px 40px 24px",
                // }}
              >
                <div className="cart-content-wrapper">
                  {!isDineIn && (
                    <div className="cart-items-header">
                      <div className="your-orders-text">
                        <Text type="bold" variant="heading">
                          My Cart
                        </Text>
                      </div>
                    </div>
                  )}
                  {showPreOrderPrompt &&
                  productsData?.deliveryOptions?.isScheduled &&
                  !productsData?.deliveryOptions?.isDelivery ? (
                    <TakeawaySummary
                      value={time}
                      setValue={setTime}
                      minTime={defaultDatePickerTime()}
                      label="Want to pre-order?"
                      onChange={setReRender}
                      changeFlag={isReRender}
                      productsData={productsData}
                    />
                  ) : null}
                  {cartData?.data?.map((cartItem, cartIndex) => (
                    <div
                      data-id="purchaseItems"
                      className="purchase-items"
                      key={cartIndex}
                    >
                      <div className="purchase-items-wrapper">
                        <Accordian
                          key={cartIndex}
                          index={cartIndex}
                          headerText={`${cartItem?.domain} (${getItemsLength(
                            cartItem?.store
                          )})`}
                          domain={cartItem?.domain}
                          isOpen={activeAccordian?.includes(cartItem?.domain)}
                          handleAccordianToggle={handleAccordianToggle}
                        >
                          <div className="accordian-content-container">
                            {cartItem?.store?.map((storeItem, storeIndex) => (
                              <>
                                <StoreItem
                                  key={storeIndex}
                                  data={storeItem}
                                  storeId={storeItem?.storeDetails?.storeId}
                                  storeName={storeItem?.storeName}
                                  storeLogo={
                                    storeItem?.storeDetails?.brandingImageURL
                                  }
                                  pickupLocation={
                                    storeItem?.storeDetails?.pickupLocation
                                  }
                                  terminal={storeItem?.storeDetails?.terminal}
                                  masterTipData={
                                    priceSummary?.metadata?.tip || []
                                  }
                                  tipData={tipData}
                                  setTipData={setTipData}
                                  addTipModalOpen={addTipModalOpen}
                                  setAddTipModalOpen={setAddTipModalOpen}
                                  showPreOrderTime={
                                    productsData?.deliveryOptions?.isScheduled
                                  }
                                  caller="cart"
                                />
                                {storeItem?.items?.map((item, index) => (
                                  <div className="item-card-container">
                                    <CartItem
                                      {...item}
                                      item={item}
                                      onChange={setReRender}
                                      changeFlag={isReRender}
                                      showAlertBox={showAlertBox}
                                      key={index}
                                      onDetailClick={() =>
                                        handleDetailClick(item)
                                      }
                                      setShowRepeatSelectionModal={
                                        setShowRepeatSelectionModal
                                      }
                                      setChangeRepeatSelectionItem={
                                        setChangeRepeatSelectionItem
                                      }
                                      setSelectedItemId={setSelectedItemId}
                                      showDetailButton={
                                        item.itemType === "product"
                                          ? true
                                          : false
                                      }
                                      showCustomisation={item.isCustomizable}
                                      // isAvailable={item.isAvailable}
                                      isAvailable={true}
                                    />
                                  </div>
                                ))}
                                {cartItem?.store?.length - 1 !== storeIndex && (
                                  <ItemDivider />
                                )}
                              </>
                            ))}
                          </div>
                        </Accordian>
                      </div>
                    </div>
                  ))}
                  {priceSummary?.metadata?.recommendation?.products?.length >
                    0 && (
                    <div className="recommendation-container">
                      <div className="price-summary-label">
                        <Text type="bold">Recommendations</Text>
                      </div>
                      <div className="recommendation-wrapper">
                        <HorzScrollContainer
                          isDesktopScrollbarVisible={true}
                          cardType="ProductCardTwo"
                        >
                          {priceSummary?.metadata?.recommendation?.products?.map(
                            (item, index) => (
                              <MenuItem
                                index={index}
                                product={item?.pDetails}
                                productId={item?.pDetails?._id}
                                item={item?.pDetails}
                                selectedItemId={selectedItemId}
                                setSelectedItemId={setSelectedItemId}
                                setShowDetailModal={setShowDetailModal}
                                setShowCustomisationModal={
                                  setShowCustomisationModal
                                }
                                setShowRepeatSelectionModal={
                                  setShowRepeatSelectionModal
                                }
                                ageVerificationReq={
                                  item?.pDetails?.ageVerificationRequired
                                }
                                isReRender={() => setReRender(!isReRender)}
                                reRender={true}
                                setIsRecommendation={setIsRecommendation}
                                {...props}
                              />
                            )
                          )}
                        </HorzScrollContainer>
                      </div>
                    </div>
                  )}
                  <div className="promo-code-container">
                    <div className="promo-code-wrapper">
                      <CustomTextField
                        placeholder="Enter discount code"
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e?.target?.value)}
                        disabled={
                          priceSummary?.metadata?.priceSummary?.couponSavings
                        }
                      />
                      <ApplyPromoButton
                        disabled={couponCode === ""}
                        onClick={() => {
                          if (
                            priceSummary?.metadata?.priceSummary?.couponSavings
                          ) {
                            handleRemovePromo();
                            setCouponCode("");
                          } else {
                            // handleApplyCoupon({
                            //   coupon: couponCode?.toLowerCase(),
                            // });
                            checkIfLoggedInForPromo();
                          }
                        }}
                      >
                        <Text type={"bold"}>
                          {priceSummary?.metadata?.priceSummary?.couponSavings
                            ? "Remove"
                            : "Apply"}
                        </Text>
                      </ApplyPromoButton>
                    </div>
                    {showAppliedPromoMessage && (
                      <div className="promo-message-container">
                        <img
                          className="promo-message-icon"
                          src={
                            priceSummary?.metadata?.priceSummary?.couponApplied
                              ? SuccessIcon
                              : ErrorIcon
                          }
                          alt="icon"
                        />
                        <Text
                          style={{
                            color: priceSummary?.metadata?.priceSummary
                              ?.couponApplied
                              ? colors?.state?.success
                              : colors?.state?.error,
                          }}
                        >
                          {priceSummary?.metadata?.priceSummary?.couponApplied
                            ? `Applied Successfully`
                            : `${
                                priceSummary?.metadata?.priceSummary
                                  ?.couponMessage || "Promo not valid"
                              }`}
                        </Text>
                      </div>
                    )}
                  </div>
                  {Object.keys(expiredItems)?.length === 0 ? (
                    <div className="mobile-price-summary-container">
                      <PriceSummary
                        subtotal={
                          priceSummary?.metadata?.priceSummary?.total || 0
                        }
                        discount={
                          priceSummary?.metadata?.priceSummary?.discounts || 0
                        }
                        deliveryStrikeout={
                          priceSummary?.metadata?.priceSummary
                            ?.deliveryStrikeout || 0
                        }
                        delivery={
                          priceSummary?.metadata?.priceSummary?.delivery || 0
                        }
                        packagingCharges={
                          priceSummary?.metadata?.priceSummary
                            ?.packagingCharges || 0
                        }
                        tip={priceSummary?.metadata?.priceSummary?.tip || 0}
                        charges={
                          priceSummary?.metadata?.priceSummary?.charges || []
                        }
                        taxes={priceSummary?.metadata?.priceSummary?.taxes || 0}
                        discountedTax={
                          priceSummary?.metadata?.priceSummary?.discountedTax
                        }
                        taxBreakup={
                          priceSummary?.metadata?.priceSummary?.taxBreakup || []
                        }
                        total={
                          priceSummary?.metadata?.priceSummary?.priceToPay || 0
                        }
                        isWaiveOff={
                          priceSummary?.metadata?.priceSummary?.offers?.[0]
                            ?.additionalCharges?.length > 0
                        }
                      />
                    </div>
                  ) : null}
                  {priceSummary?.metadata?.priceSummary?.possibleOffers
                    ?.length > 0 &&
                  priceSummary?.metadata?.priceSummary?.possibleOffers[0]
                    ?.message !== "" ? (
                    <div
                      className="offers-container"
                      style={
                        tooltipOverlay ? { zIndex: "20" } : { zIndex: "0" }
                      }
                    >
                      <div className="offers-illustration-wrapper">
                        <img src={DiscountIcon} alt="discount-img" />
                      </div>
                      <ReactTooltip
                        id="checkout-tooltip"
                        type="light"
                        effect="solid"
                        className="tooltip-layout"
                        backgroundColor="#096b71"
                        afterShow={() => setTooltipOverlay(!tooltipOverlay)}
                        afterHide={() => setTooltipOverlay(!tooltipOverlay)}
                      >
                        <div className="tooltip-container">
                          <div className="tooltip-title">
                            <Text>
                              {
                                priceSummary?.metadata?.priceSummary
                                  ?.possibleOffers[0]?.promoDescription
                              }
                            </Text>
                          </div>
                          <div className="tooltip-content">
                            <div className="tooltip-start-date">
                              <Text type="semi-bold">
                                Start:{" "}
                                {priceSummary?.metadata?.priceSummary
                                  ?.possibleOffers[0]?.startDate
                                  ? moment(
                                      priceSummary?.metadata?.priceSummary
                                        ?.possibleOffers[0]?.startDate
                                    )
                                      .utc()
                                      .format("L")
                                  : null}
                              </Text>
                            </div>
                            <div className="tooltip-end-date">
                              <Text type="semi-bold">
                                End:{" "}
                                {priceSummary?.metadata?.priceSummary
                                  ?.possibleOffers[0]?.endDate
                                  ? moment(
                                      priceSummary?.metadata?.priceSummary
                                        ?.possibleOffers[0]?.endDate
                                    )
                                      .utc()
                                      .format("L")
                                  : null}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </ReactTooltip>
                    </div>
                  ) : null}
                  {showPreOrderPrompt &&
                  productsData?.deliveryOptions?.isDelivery ? (
                    <div className="delivery-info-container">
                      <div className="delivery-info-wrapper">
                        <div className="delivery-info-title">
                          <Text type="extra-bold">
                            {`Delivering to: ${productsData?.deliveryOptions?.deliveryAddress}, ${productsData?.terminal}`}
                          </Text>
                        </div>
                        {productsData?.deliveryOptions?.isScheduled && (
                          <div className="delivery-info-sub-title">
                            <Text type="semi-bold">
                              {`Scheduled for ${moment(
                                productsData?.deliveryOptions?.deliveryTime
                              ).format("lll")}`}
                            </Text>
                          </div>
                        )}
                      </div>
                      <div className="delivery-action-wrapper">
                        <div
                          className="delivery-info-action-text"
                          onClick={() => handleDeliveryChange()}
                        >
                          <Text type="extra-bold">Change</Text>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {isLoungeQrCode && (
                    <ItemInstructionWrapper>
                      <CookingImage src={CookingIcon} />
                      <CookingInstructionTextWrapper
                        onClick={() => {
                          setItemNotesModalOpen(true);
                        }}
                      >
                        {Object.values(itemNotes)?.length > 0 ? (
                          <Text type="regular">
                            <span style={{ fontWeight: 400 }}>
                              Edit Notes?{" "}
                            </span>
                            <span
                              style={{
                                fontWeight: 700,
                                fontFamily: "ManropeBold",
                                cursor: "pointer",
                              }}
                            >
                              Click here
                            </span>
                          </Text>
                        ) : (
                          <Text type="regular">
                            <span style={{ fontWeight: 400 }}>Add Notes? </span>
                            <span
                              style={{
                                fontWeight: 700,
                                fontFamily: "ManropeBold",
                                cursor: "pointer",
                              }}
                            >
                              Click here
                            </span>
                          </Text>
                        )}
                      </CookingInstructionTextWrapper>
                    </ItemInstructionWrapper>
                  )}
                </div>
                {!isDineIn &&
                Object.keys(expiredItems).length === 0 &&
                nonDutyFreeItemsCount === 0 &&
                !cartRestrictions.restrictionApplied ? (
                  <div className="desktop-price-summary-container">
                    <DesktopPriceSummaryWrapper>
                      <PriceSummary
                        subtotal={
                          priceSummary?.metadata?.priceSummary?.total || 0
                        }
                        discount={
                          priceSummary?.metadata?.priceSummary?.discounts || 0
                        }
                        deliveryStrikeout={
                          priceSummary?.metadata?.priceSummary
                            ?.deliveryStrikeout || 0
                        }
                        delivery={
                          priceSummary?.metadata?.priceSummary?.delivery || 0
                        }
                        packagingCharges={
                          priceSummary?.metadata?.priceSummary
                            ?.packagingCharges || 0
                        }
                        tip={priceSummary?.metadata?.priceSummary?.tip || 0}
                        charges={
                          priceSummary?.metadata?.priceSummary?.charges || []
                        }
                        taxes={priceSummary?.metadata?.priceSummary?.taxes || 0}
                        discountedTax={
                          priceSummary?.metadata?.priceSummary?.discountedTax
                        }
                        taxBreakup={
                          priceSummary?.metadata?.priceSummary?.taxBreakup || []
                        }
                        total={
                          priceSummary?.metadata?.priceSummary?.priceToPay || 0
                        }
                        isWaiveOff={
                          priceSummary?.metadata?.priceSummary?.offers?.[0]
                            ?.additionalCharges?.length > 0
                        }
                      />
                      {getAppConfig("SHOW_CART_COUPON") &&
                        !isDeliveryQrCode &&
                        !isLoungeQrCode && (
                          <div
                            className="view-coupons-cta"
                            onClick={() => handleViewCoupon()}
                          >
                            <Text
                              type="extra-bold"
                              style={{
                                paddingTop: "0.5rem",
                                textAlign: "center",
                                cursor: "pointer",
                              }}
                            >
                              View Coupons
                            </Text>
                          </div>
                        )}
                      <CheckoutButtonWrapper>
                        <CheckoutButton
                          data-id="doCheckout"
                          disabled={ClientCart.isEmpty()}
                          onClick={
                            isInfoRequired
                              ? goToMandatoryFieldsPage
                              : checkIfLoggedIn
                          }
                        >
                          <Text type="extra-bold">
                            {isInfoRequired
                              ? convertSpelling("Add Details & Pay")
                              : convertSpelling("Proceed to Pay")}
                          </Text>
                        </CheckoutButton>
                        <ContinueShopping
                          onClick={() => pushHistory("/takeaway")}
                        >
                          <Text type="bold"> Continue Shopping </Text>
                        </ContinueShopping>
                      </CheckoutButtonWrapper>
                    </DesktopPriceSummaryWrapper>
                  </div>
                ) : null}
              </div>
              {isDineIn && (
                <CookingInstructionWrapper>
                  <CookingImage src={CookingIcon} />
                  <CookingInstructionTextWrapper
                    onClick={() => {
                      setCookingInstructionModalOpen(true);
                    }}
                  >
                    {kitchenNotes.length > 0 ? (
                      <Text type="regular">
                        <span style={{ fontWeight: 400 }}>Instructions: </span>
                        <span
                          style={{ fontWeight: 700, fontFamily: "ManropeBold" }}
                        >
                          {kitchenNotes}
                        </span>
                      </Text>
                    ) : (
                      <Text type="regular">
                        <span style={{ fontWeight: 400 }}>
                          Have cooking instructions?{" "}
                        </span>
                        <span
                          style={{ fontWeight: 700, fontFamily: "ManropeBold" }}
                        >
                          Click here
                        </span>
                      </Text>
                    )}
                  </CookingInstructionTextWrapper>
                </CookingInstructionWrapper>
              )}
            </div>
            {!isDineIn &&
            Object.keys(expiredItems).length === 0 &&
            nonDutyFreeItemsCount === 0 &&
            !cartRestrictions.restrictionApplied ? (
              <div className="purchase-summary">
                <div className="purchase-total-checkout-wrapper">
                  <div
                    className="purchase-total-wrapper"
                    style={{ display: !isDesktopDevice() ? "none" : "flex" }}
                  >
                    <div className="order-total-value">
                      <Text type="extra-bold">
                        {formatPrice(
                          priceSummary.metadata.priceSummary.priceToPay
                        )}
                      </Text>
                    </div>
                    {getAppConfig("SHOW_CART_COUPON") &&
                      !isDeliveryQrCode &&
                      !isLoungeQrCode && (
                        <div
                          className="view-coupons-cta"
                          onClick={() => handleViewCoupon()}
                        >
                          <Text type="extra-bold">View Coupons</Text>
                        </div>
                      )}
                  </div>
                  <div
                    className="checkout-wrapper"
                    style={{ width: !isDesktopDevice() ? "100%" : "50%" }}
                  >
                    <CheckoutWrapper>
                      <CheckoutButton
                        data-id="doCheckout"
                        disabled={ClientCart.isEmpty()}
                        onClick={
                          isInfoRequired
                            ? goToMandatoryFieldsPage
                            : checkIfLoggedIn
                        }
                      >
                        <Text type="extra-bold">
                          {isInfoRequired
                            ? convertSpelling("Add Details & Pay")
                            : convertSpelling("Proceed to Pay")}
                        </Text>
                        {!isDesktopDevice() ? (
                          <Text type="extra-bold" style={{ marginLeft: "8px" }}>
                            {formatPrice(
                              priceSummary.metadata.priceSummary.priceToPay
                            )}{" "}
                          </Text>
                        ) : null}
                      </CheckoutButton>
                      <ContinueShopping
                        onClick={() => pushHistory("/takeaway")}
                      >
                        <Text type="bold"> Continue Shopping </Text>
                      </ContinueShopping>
                    </CheckoutWrapper>
                  </div>
                </div>
              </div>
            ) : null}
            {isDineIn && (
              <SwipeComponentWrapper>
                <SwipeButton>
                  <SwipeImage
                    src={SwipeToPaySliderImage}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ transform: `translateX(${deltaX}px)` }}
                  />
                  <SwipeButtonTextWrapper>
                    <Text type="bold">Slide to place order</Text>
                  </SwipeButtonTextWrapper>
                </SwipeButton>
                <AlertText>
                  <Text type="semi-bold">
                    Once the order is placed you cannot cancel it
                  </Text>
                </AlertText>
              </SwipeComponentWrapper>
            )}
            <BottomDrawer
              sheetRef={sheetRef}
              isOpen={cookingInstructionModalOpen}
              setIsOpen={setCookingInstructionModalOpen}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#F4F4F5",
                borderRadius: "8px 8px 0px 0px",
              }}
              snapPoints={[1, 0]}
              initialSnap={0}
              disableDrag
              hideHeader={true}
              hideCloseIcon={true}
              handleClose={closeModal}
            >
              <CookingInstructionView
                cookingInstruction={cookingInstruction}
                setCookingInstruction={setCookingInstruction}
                setCookingInstructionModalOpen={setCookingInstructionModalOpen}
              />
              <CTAWrapper>
                <ClearButtonWrapper
                  onClick={() => {
                    handleClearClick();
                  }}
                >
                  <Text type="bold">Clear</Text>
                </ClearButtonWrapper>
                <SaveButtonWrapper
                  onClick={() => {
                    handleSaveClick();
                  }}
                >
                  <Text type="bold">Save</Text>
                </SaveButtonWrapper>
              </CTAWrapper>
            </BottomDrawer>
            {showCoupon && (
              <CouponModal
                showCoupon={showCoupon}
                setShowCoupon={setShowCoupon}
                appliedCouponObj={appliedCouponObj}
                setAppliedCouponObj={setAppliedCouponObj}
                isReRender={() => setReRender(!isReRender)}
                reRender={true}
              />
            )}
          </>
        )}
      </div>
    );
  }
}

const SwipeComponentWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 110px;
  padding: 8px 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  background: #fff;
  box-shadow: -4px -1px 27px 0px rgba(0, 0, 0, 0.1);

  margin-bottom: 60px;
  position: fixed;
  bottom: 0;
  z-index: 9999;
`;

const SwipeButton = styled.div`
  width: 100%;
  display: flex;
  padding: 4px;
  align-items: center;
  gap: 60px;
  border-radius: 100px;
  background: linear-gradient(270deg, #04adaa 19.46%, #0cd1ce 114.18%);
  justify-content: center;
  height: 52px;
`;

const SwipeImage = styled.img`
  width: 44px;
  height: 44px;
  transform: translateX(0);
  transition: transform 0s ease;
  position: absolute;
  left: 28px;
`;

const SwipeButtonTextWrapper = styled.div`
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const AlertText = styled.div`
  color: #000;

  font-family: Manrope;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  opacity: 0.5;
`;

const CookingInstructionWrapper = styled.div`
  background: #faefea;
  display: flex;
  padding: 12px;
  align-items: center;
  gap: 6px;
  margin: 0px 24px;
`;

const ItemInstructionWrapper = styled.div`
  background: #faefea;
  display: flex;
  padding: 12px;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
`;

const CookingImage = styled.img`
  width: 24px;
  height: 24px;
`;

const CookingInstructionTextWrapper = styled.div`
  color: #273135;
  font-size: 16px;
  font-style: normal;
  line-height: normal;
  overflow-wrap: anywhere;
`;

const CTAWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fff;
  padding: 16px 24px;
  gap: 24px;
`;

const ClearButtonWrapper = styled.div`
  width: 100%;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  border: 1px solid ${colors?.primary};

  color: ${colors?.text?.actionTextColor};
  font-size: 16px;
  font-weight: 800;
  line-height: 130%;
  text-align: center;
`;

const SaveButtonWrapper = styled.div`
  width: 100%;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  background: ${colors?.primary};
  box-shadow: 0px 1px 12px 0px rgba(5, 32, 61, 0.05);

  color: #fff;
  font-size: 16px;
  font-weight: 800;
  line-height: 130%;
  text-align: center;
`;
const CustomTextField = styled.input`
  display: flex;
  width: 100%;
  height: 54px;
  font-size: 16px;
  text-align: start;
  text-indent: 10px;
  border: 1px solid rgba(34, 34, 34, 0.7);
  border-radius: 8px;
  text-transform: none;
  outline: none;
  color: #222222;
  background-color: #fff;
  z-index: 9;
  font-family: ${colors?.font?.primary};
  font-weight: 300;
  outline: none;
  opacity: ${({ disabled }) => (disabled ? "0.7" : "1")};

  &:focus {
    outline: none;
  }
  &::placeholder {
    font-family: ${colors?.font?.primary};
    font-weight: 300;
    font-size: 14px;
    color: #888888;
    opacity: 1;
  }
`;
const ApplyPromoButton = styled(AddButton)`
  width: fit-content;
  display: flex;
  padding: 12px 32px;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  height: 42px;
  cursor: pointer;
  z-index: 9;

  @media ${device.laptop} {
    width: 200px;
    min-width: 200px;
    max-width: 200px;
  }
`;
const DesktopPriceSummaryWrapper = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
  border-radius: 12px;
  background: #fefefe;
`;
const CheckoutButtonWrapper = styled.div`
  width: 100%;
  padding: 0px 24px;
  display: flex;
  gap: 12px;
  flex-flow: column;
`;
const CheckoutButton = styled(AddButton)`
  width: 100%;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.1px;
  text-transform: uppercase;
`;
const ItemDivider = styled.div`
  margin-left: -24px;
  width: calc(100% + 48px);
  height: 1px;
  border: 1px solid #d9d9d9;
  opacity: 0.7;
  margin-top: 12px;
  margin-bottom: 12px;

  @media ${device.laptop} {
    margin-left: -32px;
    width: calc(100% + 64px);
  }
`;
const ContinueShopping = styled.div`
  cursor: pointer;
  color: ${colors?.text?.actionTextColor};
  text-align: center;
  font-size: 14px;
`;
const CheckoutWrapper = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;
