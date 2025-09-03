import React, { useState, useEffect, useRef } from "react";
import {
  AdyenCheckout,
  Dropin,
  Card,
  GooglePay,
  ApplePay,
} from "@adyen/adyen-web";
import "@adyen/adyen-web/styles/adyen.css";
import styled from "styled-components";
import { ENV } from "../../commons/config";
import Loader from "../../components/atoms/loader";

const AdyenDropIn = (props) => {
  const dropInRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initiateDropIn();
  }, []);

  const initiateDropIn = async () => {
    let paymentConfig = {
      session: {
        id: props?.paymentSession?.id, // Unique identifier for the payment session.
        sessionData: props?.paymentSession?.sessionData, // The payment session data.
      },
      environment: ENV === "DEV" ? "test" : "live", // Change to 'live' for the live environment.
      amount: {
        value: props?.paymentSession?.amount?.value,
        currency: props?.paymentSession?.amount?.currency,
      },
      locale: props?.paymentSession?.shopperLocale,
      countryCode: props?.paymentSession?.countryCode,
      clientKey: props?.clientSecret, // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
      onPaymentCompleted: (result, component) => {
        console.log("onPaymentCompleted", result, component);
        props?.handlePaymentCompleted(result);
      },
      onPaymentFailed: (result, component) => {
        console.log("onPaymentFailed", result, component);
        props?.handlePaymentFailed(result);
      },
      onError: (error, component) => {
        console.log(
          "onError",
          error.name,
          error.message,
          error.stack,
          component
        );
        props?.handlePaymentError(error);
      },
    };
    const checkout = await AdyenCheckout(paymentConfig);
    const dropinConfiguration = {
      paymentMethodComponents: [Card, ApplePay, GooglePay],
      paymentMethodsConfiguration: {
        card: {
          // Optional configuration.
          hasHolderName: true, // Show the cardholder name field.
          holderNameRequired: true, // Mark the cardholder name field as required.
        },
        googlepay: {
          amount: {
            value: props?.paymentSession?.amount?.value,
            currency: props?.paymentSession?.amount?.currency,
          },
          countryCode: props?.paymentSession?.countryCode,
          //Set this to PRODUCTION when you are ready to accept live payments
          environment: ENV === "DEV" ? "TEST" : "PRODUCTION",
          configuration: {
            merchantId:
              props?.paymentSession?.googlePayConfig?.merchantId || "",
            merchantName:
              props?.paymentSession?.googlePayConfig?.merchantName || "",
            gatewayMerchantId: props?.paymentSession?.merchantAccount || "",
          },
          onError: console.error,
        },
        applepay: {
          amount: {
            value: props?.paymentSession?.amount?.value,
            currency: props?.paymentSession?.amount?.currency,
          },
          countryCode: props?.paymentSession?.countryCode,
          buttonType: "pay",
          buttonColor: "black",
          onError: console.error,
        },
      },
      onReady: () => {},
    };
    const dropin = new Dropin(checkout, dropinConfiguration).mount(
      dropInRef?.current
    );
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <Wrapper>
        <DropInWrapper ref={dropInRef}></DropInWrapper>
      </Wrapper>
    );
  }
};

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;
const DropInWrapper = styled.div`
  width: 100%;
  position: relative;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};
`;

export default AdyenDropIn;
