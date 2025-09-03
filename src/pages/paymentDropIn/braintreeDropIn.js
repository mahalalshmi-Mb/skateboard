import React, { useEffect, useState } from "react";
import { PrimaryButton } from "theme/globalStyleSheet";
import dropin from "braintree-web-drop-in";
import styled from "styled-components";
import config from "commons/config";
import callAPI from "commons/callAPI";
import { device, formatPrice } from "commons/util/helperFunctions";

export default function BraintreeDropIn(props) {
  const [braintreeInstance, setBraintreeInstance] = useState(undefined);

  useEffect(() => {
    const initializeBraintree = () =>
      dropin.create(
        {
          // insert your tokenization key or client token here
          authorization: props?.paymentSession?.sessionData,
          container: "#braintree-drop-in-div",
          applePay: {
            displayName: "Merchant Name",
            paymentRequest: {
              total: {
                label: "Localized Name",
                amount: props?.paymentSession?.amount?.value,
              },
            },
          },
          googlePay: {
            googlePayVersion: 2,
            merchantId: "merchant-id-from-google",
            transactionInfo: {
              totalPriceStatus: "FINAL",
              totalPrice: props?.paymentSession?.amount?.value,
              currencyCode: props?.paymentSession?.amount?.currency,
            },
          },
        },
        function (error, instance) {
          if (error) console.error(error);
          else setBraintreeInstance(instance);
        }
      );

    if (braintreeInstance) {
      braintreeInstance.teardown().then(() => {
        initializeBraintree();
      });
    } else {
      initializeBraintree();
    }
  }, []);

  const onPaymentCompleted = async (nonce) => {
    try {
      const apiUrl = config?.api?.braintreePayment?.paymentProcess;
      let apiResponse = await callAPI.post(apiUrl, {
        nonce,
        amount: props?.orderAmount,
        orderId: props?.orderId,
      });

      let regResponse = await apiResponse.json();
      if (regResponse?.status === 200) {
        props?.handlePaymentCompleted();
      } else if (regResponse?.status === 400) {
        props?.handlePaymentFailed();
      } else {
        props?.handlePaymentError();
      }
    } catch (e) {
      console.log(e);
      props?.handlePaymentFailed();
    }
  };

  return (
    <Wrapper>
      <DropinWrapper id="braintree-drop-in-div" />
      {braintreeInstance && (
        <Button
          className={"braintreePayButton"}
          disabled={!braintreeInstance}
          onClick={() => {
            if (braintreeInstance) {
              braintreeInstance.requestPaymentMethod((error, payload) => {
                if (error) {
                  console.error(error);
                } else {
                  onPaymentCompleted(payload.nonce);
                }
              });
            }
          }}
        >
          {`Pay ${
            props?.paymentSession?.amount?.value
              ? `${formatPrice(props?.paymentSession?.amount?.value)}`
              : ``
          }`}
        </Button>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;
const DropinWrapper = styled.div`
  width: 100%;
  position: relative;
`;
const Button = styled(PrimaryButton)`
  width: 100%;
  position: relative;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};

  @media ${device.laptop} {
    width: fit-content;
    padding: 0px 24px;
    display: flex;
    align-items: center;
    justify-self: center;
  }
`;
