import React, { useState, useEffect, useContext, useRef } from "react";
import { useCookies } from "react-cookie";
import PhoneInput from "react-phone-input-2";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { NavContext } from "../../../../../context/navContext";
import BottomDrawer from "../../../../../components/molecules/BottomDrawer/BottomDrawer";
import Text from "../../../../../components/atoms/Text";
import Cross from "../../../../../components/molecules/BottomDrawer/assets/cross.svg";
import { PrimaryButton } from "../../../../../theme/globalStyleSheet";
import PushAlert from "../../../../../components/atoms/pushAlert";
import config from "../../../../../commons/config";
import callAPI from "../../../../../commons/callAPI";
import CustomOtpInput from "../../../../../containers/verifyOtp/components/CustomOtpInput/CustomOtpInput";
import { CartContext } from "../../../../../context/cartContext";
import {
  device,
  isDesktopDevice,
} from "../../../../../commons/util/helperFunctions";
import { callAppConfigApi } from "../../../../../commons/util/appConfigHelper";
import useCustomNavigation from "../../../../../hooks/useCustomNavigation";
import { removeLocalStorage } from "util/storageUtil";
import CustomModal from "containers/customModal/customModal";
import { colors } from "theme/colors";

const DeleteAccountModal = (props) => {
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();
  const useNav = useContext(NavContext);
  const ClientCart = useContext(CartContext);
  const sheetRef = useRef();

  const [viewIndex, setViewIndex] = useState(0);
  const [countryCode, setCountryCode] = useState("");
  const [phNo, setPhNo] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const [otp, setOtp] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["gwLoginData"]);

  const closeModal = () => {
    document.body.style.overflow = "auto";
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    props.setIsDrawerOpen(false);
  };

  useEffect(() => {
    // document.getElementsByTagName("body")[0].style.overflow = "hidden";
    useNav.hideAllNavs();

    return () => {
      // useNav.showAllNavs();
      // useNav.showFooterNavs();

      if (props.isDineIn) {
        useNav.setShowDineInBottomTab(true);
        useNav.hideAllNavs();
      } else {
        useNav.setShowHeaderNav(true);
        useNav.setShowBottomNav(true);
        useNav.setShowFeedback(true);
        useNav.setShowFooter(false);

        if (props.reRender) {
          props.isReRender();
        }
      }
    };
  }, []);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(60);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [seconds, minutes]);

  const handleSendOtp = async () => {
    if (phNo.length !== 12) {
      PushAlert.warning("Please enter your 10-digit mobile number");
      return false;
    }
    setIsOtpSent(true);
    let apiURL = config.api.login.otp;
    try {
      let apiResponse = await callAPI.patch(apiURL, {
        username: phNo,
      });
      let regResponse = await apiResponse.json();
      setIsOtpSent(false);
      if (regResponse?.status === 201) {
        PushAlert.success("OTP Generation Successful");
        setViewIndex(2);
      } else if (regResponse?.status === 429) {
        PushAlert.warning("Previous OTP still alive, please re-use");
        setViewIndex(2);
      } else {
        PushAlert.error(regResponse?.message);
      }
    } catch (err) {
      setIsOtpSent(false);
      PushAlert.error("OTP Generation Unsuccessful");
      console.log("error", err?.response?.status);
    }
  };

  const handleResendOTP = async () => {
    setSeconds(60);
    setOtp("");
    handleSendOtp();
  };

  const handleDeleteAccount = async () => {
    let apiURL = config.api.user.delete;
    try {
      let apiResponse = await callAPI.post(apiURL, {
        otp: otp,
        resource: "paxapp",
      });
      let regResponse = await apiResponse.json();
      if (regResponse?.status === 200) {
        PushAlert.success("User Account Deleted");
        closeModal();
        removeCookie("gwLoginData", { path: "/" });
        localStorage.removeItem("userData");
        removeLocalStorage("guestUserData");
        localStorage.clear();
        ClientCart.reset();
        await callAppConfigApi();
        pushHistory("/");
      } else {
        PushAlert.error(regResponse?.message);
      }
    } catch (err) {
      PushAlert.error("User Record Deletion Unsuccessful");
      console.log("error", err?.response?.status);
    }
  };

  const renderContent = () => {
    return (
      <Wrapper>
        {viewIndex === 0 ? (
          <>
            <ContentContainer>
              <CloseIconContainer>
                <CloseIcon src={Cross} onClick={closeModal} />
              </CloseIconContainer>
              <Title>
                <Text type="extra-bold">
                  Are you sure you want to delete your account?
                </Text>
              </Title>
              <SubTitle>
                <Text type="semi-bold">
                  Deleting your account will delete all your history, rewards
                  and updates on this app
                </Text>
              </SubTitle>
            </ContentContainer>
            <FooterButtonContainer>
              <SuccessButton onClick={() => setViewIndex(1)}>
                <Text type="extra-bold">Yes</Text>
              </SuccessButton>
              <CancelButton onClick={closeModal}>
                <Text type="extra-bold">No</Text>
              </CancelButton>
            </FooterButtonContainer>
          </>
        ) : viewIndex === 1 ? (
          <>
            <ContentContainer>
              <CloseIconContainer>
                <CloseIcon src={Cross} onClick={closeModal} />
              </CloseIconContainer>
              <Title>
                <Text type="extra-bold">Please enter your phone number</Text>
              </Title>
              <SubTitle>
                <Text type="semi-bold">
                  We will send an otp to verify your account
                </Text>
              </SubTitle>
              <PhoneNumberContainer>
                <PhoneInput
                  country={"us"}
                  countryCodeEditable={false}
                  value={phNo}
                  onChange={(phone, data) => {
                    setPhNo(phone);
                    setCountryCode(data.dialCode ? data.dialCode : "");
                  }}
                  containerStyle={{
                    width: "100%",
                    height: "54px",
                  }}
                  inputStyle={{
                    border: "1px solid #DCDCDC;",
                    borderRadius: "8px",
                    height: "100%",
                    paddingLeft: "90px",
                    width: "100%",
                    fontSize: "16px",
                    fontFamily: "ManropeRegular",
                    fontWeight: "500",
                    backgroundColor: "#ffffff",
                  }}
                  buttonStyle={{
                    backgroundColor: "#ffffff",
                    fontSize: "16px",
                    fontFamily: "ManropeRegular",
                    fontWeight: "500",
                    padding: "0px 20px",
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                    // border: isPhInputFocused ? "1px solid #273135" : null,
                  }}
                  dropdownStyle={{
                    width: "300px",
                    maxHeight: "300px",
                  }}
                />
              </PhoneNumberContainer>
            </ContentContainer>
            <FooterButtonContainer>
              <SuccessButton
                disabled={isOtpSent}
                onClick={() => handleSendOtp()}
              >
                <Text type="extra-bold">Continue</Text>
              </SuccessButton>
              <CancelButton onClick={closeModal}>
                <Text type="extra-bold">Cancel</Text>
              </CancelButton>
            </FooterButtonContainer>
          </>
        ) : viewIndex === 2 ? (
          <>
            <ContentContainer>
              <CloseIconContainer>
                <CloseIcon src={Cross} onClick={closeModal} />
              </CloseIconContainer>
              <Title>
                <Text type="extra-bold">Verify your OTP</Text>
              </Title>
              <SubTitle>
                <Text type="semi-bold">
                  Enter the 4 digit code sent to your email id and to your phone
                </Text>
              </SubTitle>
              <OtpInputContainer>
                <CustomOtpInput
                  containerStyleObj={{ backgroundColor: "#000" }}
                  value={otp}
                  setValue={setOtp}
                  placeholder="0-0-0-0"
                />
              </OtpInputContainer>
              <ResendOtpTimerContainer>
                {seconds > 0 && (
                  <ResendOtpTimerText>
                    <Text>
                      {`Time remaining  00:${
                        seconds > 9 ? seconds : `0${seconds}`
                      } secs`}
                    </Text>
                  </ResendOtpTimerText>
                )}
              </ResendOtpTimerContainer>
              <ResendOtpButton
                onClick={() => handleResendOTP()}
                disabled={seconds > 1}
                style={{
                  pointerEvents: seconds > 1 ? "none" : "",
                }}
              >
                <Text type="bold">Resend OTP</Text>
              </ResendOtpButton>
            </ContentContainer>
            <FooterButtonContainer>
              <SuccessButton
                disabled={isOtpSent}
                onClick={() => handleDeleteAccount()}
              >
                <Text type="extra-bold">Continue</Text>
              </SuccessButton>
              <CancelButton onClick={closeModal}>
                <Text type="extra-bold">Cancel</Text>
              </CancelButton>
            </FooterButtonContainer>
          </>
        ) : null}
      </Wrapper>
    );
  };

  if (isDesktopDevice()) {
    return (
      <CustomModal
        isOpen={props.isDrawerOpen}
        boxStyle={{ maxWidth: "570px" }}
        modalStyle={{ zIndex: 999999 }}
      >
        <ModalContainer>
          <ModalContentContainer>{renderContent()}</ModalContentContainer>
        </ModalContainer>
      </CustomModal>
    );
  } else {
    return (
      <BottomDrawer
        sheetRef={sheetRef}
        isOpen={props.isDrawerOpen}
        setIsOpen={props.setIsDrawerOpen}
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          borderRadius: "8px 8px 0px 0px",
        }}
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag
        hideHeader={true}
        handleClose={closeModal}
      >
        <DrawerContainer>
          <DrawerContentContainer>{renderContent()}</DrawerContentContainer>
        </DrawerContainer>
      </BottomDrawer>
    );
  }
};

const DrawerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const DrawerContentContainer = styled.div`
  width: 100%;
  padding: 24px 24px 21px 24px;
  height: calc(100% - 40px - 53px - 20px);
`;
const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const ModalContentContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 32px;
`;
const Wrapper = styled.div`
  width: 100%;
`;
const ContentContainer = styled.div`
  width: 100%;
  position: relative;
`;
const CloseIconContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
`;
const CloseIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;
const Title = styled.div`
  max-width: 90%;
  font-size: 21px;
  line-height: 28px;
  color: ${colors?.text?.black200};
`;
const SubTitle = styled.div`
  font-size: 16px;
  line-height: 21px;
  color: ${colors?.text?.black200};
  padding-top: 12px;
  opacity: 0.6;
`;
const FooterButtonContainer = styled.div`
  width: 100%;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0px;
  background-color: #fff;
  gap: 24px;

  @media ${device.laptop} {
    justify-content: center;
  }
`;
export const CancelButton = styled(PrimaryButton)`
  width: 50%;
  font-size: 16px;
  line-height: 21px;
  color: #fff;
  gap: 24px;

  @media ${device.laptop} {
    padding: 13px 65px;
    width: fit-content;
  }
`;
export const SuccessButton = styled.button`
  width: 50%;
  padding: 13px 0px;
  border-radius: 100px;
  border: 1px solid ${colors.primary};
  background-color: #fff;

  font-size: 16px;
  line-height: 21px;
  color: ${colors.primary};

  @media ${device.laptop} {
    padding: 13px 65px;
    width: fit-content;
  }
`;
export const PhoneNumberContainer = styled.div`
  width: 100%;
  padding-top: 24px;
`;
const OtpInputContainer = styled.div`
  width: 100%;
  padding-top: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
`;
const ResendOtpTimerContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;
const ResendOtpTimerText = styled.div`
  color: #4d5055;
  font-size: 16px;
  opacity: 0.8;
`;
const ResendOtpButton = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
  font-weight: 800;
  font-size: 16px;
  color: ${colors.text.actionTextColor};
  cursor: pointer;
`;

export default DeleteAccountModal;
