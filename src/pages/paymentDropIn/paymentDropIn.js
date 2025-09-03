import React, { useState, useContext, useEffect } from "react";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import {
  decode,
  device,
  getUserInfo,
} from "../../commons/util/helperFunctions";
import { getLocalStorage, getSessionStorage } from "../../util/storageUtil";
import { NavContext } from "../../context/navContext";
import Text from "../../components/atoms/Text";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import Loader from "../../components/atoms/loader";
import AdyenDropIn from "./adyenDropIn";
import BraintreeDropIn from "./braintreeDropIn";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { colors } from "theme/colors";
import config from "commons/config";
import Util from "commons/util/util";
import callAPI from "commons/callAPI";
import PriceSummary from "components/organisms/PriceSummary/PriceSummary";
import StripeDropIn from "./stripeDropIn";
import { useConfig } from "context/configContext";
import PushAlert from "components/atoms/pushAlert";

const PaymentDropIn = (props) => {
  const useNav = useContext(NavContext);
  const { pushHistory } = useCustomNavigation();
  const { profileMandatoryFields } = useConfig();
  //Will be available from response of checkout api only for stripe payment gateway
  const [clientSecret] = useState(
    atob(props?.location?.state?.data?.clientSecret)
  );
  const publisherKey = props?.location?.state?.data?.publisherKey;
  const stripePromise = publisherKey ? loadStripe(publisherKey) : null;

  //Will be available from response of checkout api for adyen and braintree payment gateway
  const [paymentSession] = useState(
    props?.location?.state?.data?.paymentSession
  );
  const [isLoading, setIsLoading] = useState(false);
  const [orderId] = useState(props?.location?.state?.data?.orderId);
  const [orderAmount] = useState(props?.location?.state?.data?.orderAmount);
  const [paymentGateway] = useState(
    props?.location?.state?.data?.paymentGateway
      ? JSON.parse(props?.location?.state?.data?.paymentGateway)
      : {}
  );
  const [orderSummary] = useState(
    props?.location?.state?.data?.orderSummary
      ? JSON.parse(props?.location?.state?.data?.orderSummary)
      : {}
  );

  const [dineInSessionData] = useState(getSessionStorage("dine-in"));
  const [isDineIn] = useState(dineInSessionData?.storeId || "" !== "");
  const [isDeliveryQrCode] = useState(
    getSessionStorage("qrCodeSource")
      ?.toLowerCase()
      ?.includes("deliver-to-gate") ||
      getSessionStorage("qrCodeSource")?.toLowerCase()?.includes("lounge-bar")
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phNo, setPhNo] = useState("");
  const [pageData, setPageData] = useState({});

  useEffect(() => {
    handleNavs();
    getUserDetails();
    getPageData();

    return () => {
      if (isDineIn || isDeliveryQrCode) {
        useNav.showAllNavs();
      } else {
        useNav.hideHeaderGoBack();
        useNav.showFooterNavs();
      }
    };
  }, []);

  const handleNavs = () => {
    if (isDineIn || isDeliveryQrCode) {
      useNav.hideAllNavs();
    } else {
      useNav.showHeaderGoBack();
      useNav.hideFooterNavs();
    }
  };

  const getUserDetails = async () => {
    try {
      let apiData = await getUserInfo("both");
      let data = apiData.data;
      if (data?.segment?.code === "G") {
        const guestData = getLocalStorage("guestUserData") || {};
        if (guestData && Object.keys(guestData)?.length > 0) {
          setFirstName(
            guestData.firstName !== null && guestData.firstName !== undefined
              ? guestData.firstName
              : ""
          );
          setLastName(
            guestData.lastName !== null && guestData.lastName !== undefined
              ? guestData.lastName
              : ""
          );

          if (guestData.email !== null && guestData.email !== undefined) {
            setEmail(guestData.email);
          }

          if (guestData.mobile !== null && guestData.mobile !== undefined) {
            const nonFormattedPhNumber = `+${guestData?.countryCode}${guestData.mobile}`;
            const phoneNumber = parsePhoneNumberWithError(nonFormattedPhNumber);
            setPhNo(
              phoneNumber?.formatInternational() ||
                `${guestData?.countryCode}${guestData.mobile}`
            );
          }
        }
      } else {
        if (data) {
          setFirstName(
            data.firstName !== null && data.firstName !== undefined
              ? data.firstName
              : ""
          );
          setLastName(
            data.lastName !== null && data.lastName !== undefined
              ? data.lastName
              : ""
          );

          if (data.email !== null && data.email !== undefined) {
            setEmail(decode(data.email));
          }

          if (data.mobile !== null && data.mobile !== undefined) {
            const nonFormattedPhNumber = `+${data?.countryCode}${decode(
              data.mobile
            )}`;
            const phoneNumber = parsePhoneNumberWithError(nonFormattedPhNumber);
            setPhNo(
              phoneNumber?.formatInternational() ||
                `${data?.countryCode}${data.mobile}`
            );
          }
        }
      }
      let chargesObj = {};
      if (orderSummary?.charges?.length > 0) {
        orderSummary?.charges?.forEach((x) => {
          chargesObj[x.name] = false;
        });
      }
      if (
        orderSummary?.couponApplied === false &&
        orderSummary?.couponMessage !== ""
      ) {
        PushAlert.error(orderSummary?.couponMessage);
      }
    } catch (e) {
      console.log(e);
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

  const renderPaymentDropIn = () => {
    if (paymentGateway?.pgName === "adyen") {
      return (
        <AdyenDropIn
          paymentSession={paymentSession}
          handlePaymentCompleted={handlePaymentCompleted}
          handlePaymentFailed={handlePaymentFailed}
          handlePaymentError={handlePaymentError}
          clientSecret={clientSecret}
        />
      );
    } else if (paymentGateway?.pgName === "braintree") {
      return (
        <BraintreeDropIn
          paymentSession={paymentSession}
          handlePaymentCompleted={handlePaymentCompleted}
          handlePaymentFailed={handlePaymentFailed}
          handlePaymentError={handlePaymentError}
          orderId={orderId}
          orderAmount={orderAmount}
        />
      );
    } else if (paymentGateway?.pgName === "stripe" && clientSecret) {
      return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripeDropIn
            clientSecret={clientSecret}
            paymentSession={paymentSession}
            handlePaymentCompleted={handlePaymentCompleted}
            handlePaymentFailed={handlePaymentFailed}
            handlePaymentError={handlePaymentError}
            orderId={orderId}
            orderAmount={orderAmount}
          />
        </Elements>
      );
    } else {
      return (
        <AdyenDropIn
          paymentSession={paymentSession}
          handlePaymentCompleted={handlePaymentCompleted}
          handlePaymentFailed={handlePaymentFailed}
          handlePaymentError={handlePaymentError}
          clientSecret={clientSecret}
        />
      );
    }
  };

  const isDropInDisabled = () => {
    if (firstName === "" || lastName === "" || phNo === "") {
      if (profileMandatoryFields?.email && email === "") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handlePaymentCompleted = () => {
    pushHistory(`/success/${orderId}`);
  };

  const handlePaymentFailed = () => {
    pushHistory(`/fail/${orderId}`);
  };

  const handlePaymentError = () => {
    pushHistory(`/fail/${orderId}`);
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <PageWrapper>
        <ContentContainer>
          <DetailsWrapper>
            <FormContainer>
              {firstName && firstName !== "" && (
                <InputWrapper>
                  <UserDetailsLabel>
                    <Text>First Name</Text>
                  </UserDetailsLabel>
                  <UserDetailsValue>
                    <Text>{firstName}</Text>
                  </UserDetailsValue>
                </InputWrapper>
              )}
              {lastName && lastName !== "" && (
                <InputWrapper>
                  <UserDetailsLabel>
                    <Text>Last Name</Text>
                  </UserDetailsLabel>
                  <UserDetailsValue>
                    <Text>{lastName}</Text>
                  </UserDetailsValue>
                </InputWrapper>
              )}
              {phNo && phNo !== "" && (
                <InputWrapper>
                  <UserDetailsLabel>
                    <Text>Contact No</Text>
                  </UserDetailsLabel>
                  <UserDetailsValue>
                    <Text>{phNo}</Text>
                  </UserDetailsValue>
                </InputWrapper>
              )}
              {email && email !== "" && (
                <InputWrapper>
                  <UserDetailsLabel>
                    <Text>Email</Text>
                  </UserDetailsLabel>
                  <UserDetailsValue>
                    <Text>{email}</Text>
                  </UserDetailsValue>
                </InputWrapper>
              )}
            </FormContainer>
            {orderSummary && Object.keys(orderSummary)?.length > 0 && (
              <PriceSummaryContainer>
                <PriceSummary
                  subtotal={orderSummary?.total || 0}
                  discount={orderSummary?.discounts || 0}
                  deliveryStrikeout={orderSummary?.deliveryStrikeout || 0}
                  delivery={orderSummary?.delivery || 0}
                  packagingCharges={orderSummary?.packagingCharges || 0}
                  tip={orderSummary?.tip || 0}
                  charges={orderSummary?.charges || []}
                  taxes={orderSummary?.taxes || 0}
                  discountedTax={orderSummary?.discountedTax}
                  taxBreakup={orderSummary?.taxBreakup || []}
                  total={orderSummary?.priceToPay || 0}
                  isWaiveOff={
                    orderSummary?.offers?.[0]?.additionalCharges?.length > 0
                  }
                />
              </PriceSummaryContainer>
            )}
          </DetailsWrapper>
          {pageData?.html && (
            <TermsAndConditionsContainer>
              <TermsAndConditionsWrapper>
                {ReactHtmlParser(pageData?.html)}
              </TermsAndConditionsWrapper>
              {pageData?.banner?.[0]?.url !== "" && (
                <LogoWrapper>
                  <Logo src={pageData?.banner?.[0]?.url} />
                </LogoWrapper>
              )}
            </TermsAndConditionsContainer>
          )}
          <DropInContainer>
            <DropInWrapper disabled={isDropInDisabled()}>
              {renderPaymentDropIn()}
            </DropInWrapper>
          </DropInContainer>
        </ContentContainer>
      </PageWrapper>
    );
  }
};

const PageWrapper = styled.div`
  width: 100%;
  position: relative;
  background-color: ${colors?.pageBackground?.secondary};
`;
const ContentContainer = styled.div`
  width: 100%;
  padding: 24px;

  @media ${device.laptop} {
    padding: 48px 160px;
  }
`;
const DetailsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media ${device.laptop} {
    flex-direction: row;
    align-items: flex-start;
    gap: 0px 24px;
  }
`;
const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px 0px;

  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
`;
const UserDetailsLabel = styled.div`
  font-size: 12px;
  color: ${colors?.text?.gray200};

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
const UserDetailsValue = styled.div`
  max-width: 80%;
  font-size: 12px;
  color: ${colors?.text?.black200};
  word-break: break-all;

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const PriceSummaryContainer = styled.div`
  width: 100%;
  margin-top: 16px;

  @media ${device.laptop} {
    margin-top: 0px;
  }
`;
const TermsAndConditionsContainer = styled.div`
  width: 100%;
  margin-top: 16px;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: space-between;

  @media ${device.laptop} {
    margin-top: 48px;
    flex-direction: column;
  }
`;
const TermsAndConditionsWrapper = styled.div`
  font-size: 10px;
  color: ${colors?.text?.gray200};

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
const LogoWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const Logo = styled.img`
  height: 20px;

  @media ${device.laptop} {
    height: 31px;
  }
`;
const DropInContainer = styled.div`
  width: 100%;
  margin-top: 24px;
  position: relative;
`;
const DropInWrapper = styled.div`
  width: 100%;
  position: relative;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "all")};
`;

export default PaymentDropIn;
