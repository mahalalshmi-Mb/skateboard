import styled from "styled-components";
import moment from "util/momentWrapper";
import config from "../../../../commons/config";
import { getAppConfig } from "../../../../commons/util/appConfigHelper";
import { device } from "../../../../commons/util/helperFunctions";
import Util from "../../../../commons/util/util";
import Text from "../../../../components/atoms/Text";
import LottiePlayer from "../../../../components/atoms/lottiePlayer";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import { productDomain } from "../config/config";
import { useConfig } from "context/configContext";

const FSTREntry = (props) => {
  const { timezone } = useConfig();
  const { pushHistory } = useCustomNavigation();

  const handleTakeAwayClick = () => {
    Util.triggerMoEngageEvent("takeaway_button_clicked");
    Util.sendMessageToReactNative("Takeaway Button Clicked");
    let existingData = getSessionStorage("productsData");
    if (
      existingData?.deliveryOptions?.deliveryOption ===
        config?.deliveryOptions?.takeaway &&
      existingData?.deliveryOptions?.isScheduled === true
    ) {
      pushHistory(`/takeaway-selection?domain=${productDomain.fnb}`);
    } else {
      let productsData = {
        deliveryOptions: {
          deliveryOption: config.deliveryOptions.takeaway,
          deliveryTime: moment(new Date(), "UTC", "UTC").format(),
          isPackagingRequested: true,
          timezone: timezone,
        },
        domain: productDomain.fnb,
      };
      setSessionStorage("productsData", productsData);
      pushHistory(`/takeaway-selection?domain=${productDomain.fnb}`);
    }
  };

  const handleDeliveryClick = () => {
    let existingData = getSessionStorage("productsData");
    Util.triggerMoEngageEvent("deliver_to_gate_clicked");

    if (
      existingData?.deliveryOptions?.deliveryOption ===
        config?.deliveryOptions?.deliveryAtGate &&
      existingData?.deliveryOptions?.isScheduled === true
    ) {
      pushHistory("/delivery-flight-selection");
    } else {
      let productsData = {
        deliveryOptions: {
          deliveryOption: config.deliveryOptions.deliveryAtGate,
          deliveryTime: moment(new Date(), "UTC", "UTC").format(),
          isPackagingRequested: true,
          isDelivery: true,
          timezone: timezone,
        },
        domain: productDomain.fnb,
      };
      setSessionStorage("productsData", productsData);
      pushHistory("/delivery-flight-selection");
    }
  };

  const handleMediaOnClick = () => {
    if (props.redirectLink) {
      pushHistory(`${props.redirectLink}?domain=${productDomain.fnb}`);
      Util.triggerMoEngageEvent("takeaway_button_clicked");
    }
  };

  return (
    <Wrapper>
      <MainContentWrapper>
        {props.type === "lottie" && (
          <LottiePlayer
            mobileFile={props.mediaMobile}
            desktopFile={props.mediaDesktop}
            styles={{ borderRadius: "8px" }}
          />
        )}
        {props.type === "image" && (
          <FstrEntryImage
            src={props.mediaMobile}
            alt="entry"
            onClick={handleMediaOnClick}
          />
        )}
      </MainContentWrapper>
      <TakeAwayButton onClick={handleTakeAwayClick}>
        <Text type="extra-bold">Takeaway</Text>
      </TakeAwayButton>
      {getAppConfig("SHOW_DEL_TO_GATE") ? (
        <DeliveryToGateWrapper onClick={handleDeliveryClick}>
          <Text type="extra-bold">Deliver to my gate</Text>
        </DeliveryToGateWrapper>
      ) : null}
    </Wrapper>
  );
};

const MainContentWrapper = styled.div({
  position: "relative",
  width: "100%",
});

const DeliveryToGateWrapper = styled.div({
  fontSize: "16px",
  lineHeight: "21px",
  color: "#037B79",
  marginTop: "24px",
  cursor: "pointer",
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 24px;
  padding-right: 24px;
  margin: 40px 0px 0px 0px;
  align-items: center;

  @media ${device.tablet} {
    display: none;
  }
`;

const TakeAwayButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  height: 45px;
  width: 83.58%;
  background: #037b79;
  border-radius: 100px;
  margin-top: 24px;
  cursor: pointer;

  font-weight: 800;
  font-size: 16px;
  line-height: 21px;
  color: #ffffff;
`;

const FstrEntryImage = styled.img`
  width: 100%;
  cursor: pointer;
  border-radius: 8px;
`;

export default FSTREntry;
