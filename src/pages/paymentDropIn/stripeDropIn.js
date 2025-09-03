import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { device, formatPrice } from "commons/util/helperFunctions";
import Text from "components/atoms/Text";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PrimaryButton } from "theme/globalStyleSheet";

export default function StripeDropIn(props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [paymentElementLoaded, setPaymentElementLoaded] = useState(false);

  useEffect(() => {
    if (stripe && elements) {
      setLoading(false);
    }
  }, [stripe, elements]);

  useEffect(() => {
    if (!elements) return;
    const paymentElement = elements.getElement("payment");
    if (!paymentElement) return;
    const listener = (event) => {
      setIsComplete(event.complete);
    };
    paymentElement.on("change", listener);

    return () => {
      paymentElement.off("change", listener);
    };
  }, [elements]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsSubmitting(true);
    const returnUrl = `${window?.location?.origin}/success/${props?.orderId}`;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: "if_required",
    });

    if (error) {
      console.error(error);
      props?.handlePaymentFailed();
    } else if (
      paymentIntent?.status?.toLowerCase() === "succeeded" ||
      paymentIntent?.status?.toLowerCase() === "requires_capture"
    ) {
      props?.handlePaymentCompleted();
    }
    setIsSubmitting(false);
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
      <PaymentElement
        onReady={() => setPaymentElementLoaded(true)}
        onChange={(event) => {
          if (event.complete) {
            setLoading(false);
          }
        }}
      />
      {paymentElementLoaded && (
        <Button disabled={!isComplete || isSubmitting}>
          <Text type="bold">
            {`Pay ${
              props?.orderAmount ? `${formatPrice(props?.orderAmount)}` : ``
            }`}
          </Text>
        </Button>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.form`
  width: 100%;
  position: relative;
`;

const Button = styled(PrimaryButton)`
  width: 100%;
  position: relative;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};
  margin-top: 24px;

  @media ${device.laptop} {
    width: fit-content;
    padding: 0px 24px;
    display: flex;
    align-items: center;
    justify-self: center;
  }
`;
