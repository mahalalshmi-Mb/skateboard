import React from "react";

import { Button, Container, Logo, Title, Wrapper } from "./style";

import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import pulseDesktop from "../../assets/images/pulseBanner/pulse-desktop.svg";
import pulseMobile from "../../assets/images/pulseBanner/pulse-mobile.svg";
import PushAlert from "../../components/atoms/pushAlert";
import Text from "../../components/atoms/Text";
import CustomPicture from "../../components/molecules/customPicture";
import { isMember } from "../../util/lmsMemberUtil";
import useCustomNavigation from "../../hooks/useCustomNavigation";

const PulseBanner = () => {
  const [cookies] = useCookies(["gwLoginData"]);
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();

  const handleOnClick = async () => {
    if (cookies.gwLoginData) {
      let memberToken = await isMember();
      if (memberToken) {
        PushAlert.info("You are already a member!");
        pushHistory("/travellers/profile");
      } else {
        pushHistory("/travellers/rewards");
      }
    } else {
      PushAlert.info("Sign in to become a member!");
      pushHistory("/signin");
    }
  };
  return (
    <Wrapper>
      <Container onClick={handleOnClick}>
        <Logo>
          <CustomPicture
            mobilePicture={pulseMobile}
            desktopPicture={pulseDesktop}
          />
        </Logo>
        <Title>
          <Text type="bold">
            Join BLR Pulse and unlock members-only benefits
          </Text>
        </Title>
        <Button>
          <Text type="bold">Join for free</Text>
        </Button>
      </Container>
    </Wrapper>
  );
};

export default PulseBanner;
