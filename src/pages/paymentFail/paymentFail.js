import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import config from "../../commons/config";
import PushAlert from "../../components/atoms/pushAlert";
import Loader from "../../components/atoms/loader";
import callAPI from "../../commons/callAPI";
import "./paymentFail.css";
import {
  getSessionStorage,
  removeSessionStorage,
} from "../../util/storageUtil";
import Util from "../../commons/util/util";
import { getEventDataFromOrderSummary } from "../../util/analytics/cdp/Constant";
import { NavContext } from "../../context/navContext";
import { CartContext } from "../../context/cartContext";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { removeAppliedCoupon } from "commons/util/helperFunctions";

export default function PaymentFail(props) {
  const { pushHistory } = useCustomNavigation();
  const ClientCart = useContext(CartContext);
  const params = useParams();
  const useNav = useContext(NavContext);
  const [orderid] = useState(params.orderid);
  const [isLoading, setIsLoaded] = useState(true);
  const [shopId, setShopId] = useState("");
  const [isDeliveryQrCode] = useState(
    getSessionStorage("qrCodeSource")
      ?.toLowerCase()
      ?.includes("deliver-to-gate") ||
      getSessionStorage("qrCodeSource")?.toLowerCase()?.includes("lounge-bar")
  );

  useEffect(() => {
    async function pullOrderDetails() {
      try {
        let apiURL = config.api.payment.orderSummaryV2;
        let apiResponse = await callAPI.get(apiURL, {
          orderId: orderid,
        });

        let regResponse = await apiResponse.json();
        if (regResponse && regResponse.data) {
          const eventData = getEventDataFromOrderSummary(regResponse);
          Util.triggerMoEngageEvent("payment_failed", eventData, {
            orderId: orderid,
          });
          setIsLoaded(false);
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (!isDeliveryQrCode) {
      //hide footer and bottom nav
      useNav.hideFooterNavs();
      useNav.hideBottomNavs();
    } else {
      useNav.hideAllNavs();
    }

    isLoading && pullOrderDetails();
    // ClientCart.reset();
    // removeSessionStorage("productsData");
    removeSessionStorage("isAgeDeclared");
    removeSessionStorage("couponCode");
    removeSessionStorage("appliedCoupon");
    removeAppliedCoupon();
    // Clearing Dine-In session storage
    removeSessionStorage("dine-in");
    removeSessionStorage("productFilters");
    removeSessionStorage("qrCodeSource");
    removeSessionStorage("categoryData");

    return () => {
      if (!isDeliveryQrCode) {
        useNav.showFooterNavs();
        useNav.showBottomNavs();
      } else {
        useNav.showAllNavs();
      }
      removeSessionStorage("qrCodeSource");
    };
  }, []);

  const gotoHomepage = () => {
    pushHistory(`/`);
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div className="payment-fail">
        <div className="payment-fail-info">
          <div className="payment-fail-icon"></div>
          <div className="payment-fail-title">Payment failed!</div>
          <div className="payment-fail-description">
            You can retry your payment from the cart screen
          </div>
          <div className="payment-fail-description">
            If amount was deducted from your account, it will be credited back
            in 3-5 business days.
          </div>
          <div className="payment-redirect" onClick={gotoHomepage}>
            Go Home
          </div>
        </div>
      </div>
    );
  }
}
