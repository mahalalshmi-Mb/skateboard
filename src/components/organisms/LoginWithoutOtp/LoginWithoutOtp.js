import React, { useState, useEffect, useRef, useContext } from "react";
import Moengage from "@moengage/web-sdk";
import { useCookies } from "react-cookie";
import PhoneInput from "react-phone-input-2";
import styled from "styled-components";
import BottomDrawer from "../../molecules/BottomDrawer/BottomDrawer";
import CustomModal from "../../../containers/customModal/customModal";
import CrossWithBackground from "../../molecules/BottomDrawer/assets/crossWithBackground.svg";
import {
  applicablepromo,
  device,
  getUserInfo,
  isMobileDevice,
  isDesktopDevice,
} from "commons/util/helperFunctions";
import Text from "components/atoms/Text";
import ButtonWithLoading from "components/molecules/ButtonWithLoading";
import CustomTextField from "components/molecules/customTextField";
import Input from "../QuickSignInDrawer/SubComponents/CustomInput";
import "./style.css";
import CustomCheckbox from "components/atoms/customCheckbox";
import { colors } from "theme/colors";
import Util from "commons/util/util";
import PushAlert from "components/atoms/pushAlert";
import config from "commons/config";
import callAPI from "commons/callAPI";
import useCustomNavigation from "hooks/useCustomNavigation";
import { getAppConfig } from "commons/util/appConfigHelper";
import { setLocalStorage, setSessionStorage } from "util/storageUtil";
import { setUserPermission } from "commons/util/permissionsConfig";
import { CartContext } from "context/cartContext";
import { useConfig } from "context/configContext";
import { isEuropeanCountry } from "./config";

function LoginWithoutOtp(props) {
  const ClientCart = useContext(CartContext);
  const sheetRef = useRef();
  const { countryCode, profileMandatoryFields } = useConfig();
  const { pushHistory } = useCustomNavigation();
  const [isCPH] = useState(
    window?.location?.href?.toLowerCase()?.includes("cph")
  );
  const [cookies, setCookie] = useCookies(["gwLoginData"]);
  const [viewIndex, setViewIndex] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phCountryCode, setPhCountryCode] = useState("");
  const [phNumber, setPhNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isRegularUser, setIsRegularUser] = useState(true);
  const [optForAlerts, setOptForAlerts] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isClickDisabled, setIsClickDisabled] = useState(false);
  const [confirmIsLoading, setIsConfirmLoading] = useState(false);

  const [showEmail, setShowEmail] = useState(
    isCPH ? profileMandatoryFields?.email || false : true
  );
  const [isTermsCondChecked, setIsTermsCondChecked] = useState(
    isCPH ? false : true
  );

  const [isFirstNameMandatory, setIsFirstNameMandatory] = useState(
    profileMandatoryFields?.firstName || false
  );
  const [isLastNameMandatory, setIsLastNameMandatory] = useState(
    profileMandatoryFields?.lastName || false
  );
  const [isMobileMandatory, setIsMobileMandatory] = useState(
    profileMandatoryFields?.mobile || false
  );
  const [isEmailMandatory, setIsEmailMandatory] = useState(
    profileMandatoryFields?.email || false
  );

  useEffect(() => {
    defaultAlerts();
  }, []);

  useEffect(() => {
    if (email) {
      setIsValidEmail(Util.isEmailValid(email));
    }
  }, [email]);

  useEffect(() => {
    return () => {
      setViewIndex(0);
    };
  }, []);

  const defaultAlerts = () => {
    if (isEuropeanCountry(countryCode)) {
      setIsRegularUser(false);
    }
  };

  const closeModal = () => {
    document.body.style.overflow = "auto";
    setViewIndex(0);
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    try {
      props.setIsDrawerOpen(false);
    } catch (e) {}
  };

  const handleLogin = async () => {
    if (firstName === "") {
      PushAlert.error("First name cannot be empty");
      return;
    }
    if (lastName === "") {
      PushAlert.error("Last name cannot be empty");
      return;
    }
    if (
      (showEmail && email === "" && phNumber === "") ||
      (!showEmail && phNumber === "")
    ) {
      PushAlert.error(
        showEmail ? "Email cannot be empty" : "Phone number cannot be empty"
      );
      return;
    }
    try {
      setIsClickDisabled(true);
      setIsConfirmLoading(true);
      let apiURL = config.api.auth.initiate;
      const userObj = {
        firstName,
        lastName,
        email,
        countryCode: phCountryCode,
        mobile: phNumber?.replace(phCountryCode, "") || "",
        segment: {
          code: isRegularUser ? "R" : "G",
        },
        subscription: {
          email: {
            newsletter: true,
            promotions: true,
            offers: true,
          },
          sms: {
            newsletter: optForAlerts,
            promotions: optForAlerts,
            offers: optForAlerts,
          },
          notifications: {
            newsletter: optForAlerts,
            promotions: optForAlerts,
            offers: optForAlerts,
          },
        },
      };
      let param = btoa(JSON.stringify(userObj));
      let headers = Util.getAuthHeaders();
      let apiResponse = await callAPI.put(
        apiURL,
        { params: param },
        0,
        {},
        headers
      );

      let regResponse = await apiResponse.json();
      setIsClickDisabled(false);
      if (regResponse?.status?.toString()?.startsWith("20")) {
        const userInfo = await getUserInfo("both");
        let data = userInfo.data;
        let metadata = userInfo.metadata;

        const memberId =
          metadata?.status?.membership?.loyalty?.mmid ||
          metadata?.status?.membership?.mmid;

        let gwLoginData = {
          profileImageURL: "",
          email: data?.email || "",
          mobile: data?.mobile || "",
          name: data?.fullName || "",
          userId: data?.userId || "",
        };

        try {
          Util.triggerMoEngageEvent("quick_sign_in", {
            userId: data.userId,
            name: gwLoginData.name,
            type: "login",
            lmsmemberid: memberId,
          });
          Moengage.add_unique_user_id(memberId);
          Moengage.add_user_name(gwLoginData.name);
          Moengage.add_user_attribute("lmsmemberid", memberId);
          Moengage.add_user_attribute("userId", data.userId);
        } catch (e) {}

        if (getAppConfig("CALL_PROMO_API") && data?.userId) {
          let getPromoData = await applicablepromo(
            window.atob(data.userId),
            "L"
          );
          setSessionStorage("availablePromo", getPromoData);
        }
        setCookie("gwLoginData", JSON.stringify(gwLoginData), {
          path: "/",
          maxAge: 86400 * getAppConfig("LOGIN_COOKIE_EXPIRY_DAYS"),
        });
        if (!isRegularUser) {
          setLocalStorage("guestUserData", userObj);
        }
        if (!props?.disableSaveCart) {
          await ClientCart.saveCart(true);
        }

        setIsConfirmLoading(false);
        closeModal();
        if (props.successHandler) {
          props.successHandler();
        } else {
          pushHistory("/cartRedirect");
        }
        PushAlert.success(regResponse.message);
      } else if (regResponse.status === 429) {
        setIsConfirmLoading(false);
        PushAlert.error(regResponse.message);
      } else if (regResponse.status === 403) {
        setIsConfirmLoading(false);
        PushAlert.error(regResponse.message);
      } else {
        setIsConfirmLoading(true);
        PushAlert.error(regResponse.message);
      }
    } catch (err) {
      PushAlert.error("Something went wrong, please try again!");
      console.log(err);
    }
  };

  const termsCondHandler = () => {
    window.open(`/terms-of-service`, "_blank");
  };

  const getIsDisabled = () => {
    let isFirstNameDisabled,
      isLastNameDisabled,
      isMobileDisabled,
      isEmailDisabled = true;
    if (isFirstNameMandatory) {
      isFirstNameDisabled = firstName === "";
    } else {
      isFirstNameDisabled = isFirstNameMandatory;
    }
    if (isLastNameMandatory) {
      isLastNameDisabled = lastName === "";
    } else {
      isLastNameDisabled = isLastNameMandatory;
    }
    if (isMobileMandatory)
      isMobileDisabled = phNumber === "" || phNumber.length < 5;
    if (isEmailMandatory || showEmail)
      isEmailDisabled = email === "" || !isValidEmail;

    let emailPhoneCheck = false;
    if (isCPH && isEmailMandatory && isMobileMandatory) {
      emailPhoneCheck = isEmailDisabled || isMobileDisabled;
    } else if (isCPH && (!isEmailMandatory || isMobileMandatory)) {
      emailPhoneCheck = isEmailDisabled && isMobileDisabled;
    } else if (isEmailMandatory && isMobileMandatory) {
      emailPhoneCheck = isEmailDisabled || isMobileDisabled;
    } else if (isEmailMandatory) {
      emailPhoneCheck = isEmailDisabled;
    } else if (isMobileMandatory) {
      emailPhoneCheck = isMobileDisabled;
    }

    return (
      emailPhoneCheck ||
      isFirstNameDisabled ||
      isLastNameDisabled ||
      !isTermsCondChecked
    );
  };

  const renderMailCheckboxContent = () => {
    return (
      <CheckboxWrapper>
        <CustomCheckbox
          checked={isRegularUser}
          handleChange={(e) => {
            setIsRegularUser(e.target.checked);
          }}
          checkedColor={colors?.text?.actionTextColor}
          unCheckedColor={colors?.text?.actionTextColor}
          ariaLabel={"I would like to receive future discounts and promotions"}
        />
        <CheckboxLabel>
          <Text>I would like to receive future discounts and promotions</Text>
        </CheckboxLabel>
      </CheckboxWrapper>
    );
  };

  const renderPhoneCheckboxContent = () => {
    return (
      <CheckboxWrapper>
        <CustomCheckbox
          checked={optForAlerts}
          handleChange={(e) => {
            setOptForAlerts(e.target.checked);
          }}
          checkedColor={colors?.text?.actionTextColor}
          unCheckedColor={colors?.text?.actionTextColor}
          ariaLabel={"Send order status alerts to my phone"}
        />
        <CheckboxLabel>
          <Text>Send order status alerts to my phone</Text>
        </CheckboxLabel>
      </CheckboxWrapper>
    );
  };

  const renderShowEmailContent = () => {
    return (
      <ShowEmailContent>
        <Text>Dont have a valid mobile number?</Text>
        <Text
          onClick={() => {
            setShowEmail(true);
          }}
          style={{ cursor: "pointer" }}
        >
          Click here
        </Text>
      </ShowEmailContent>
    );
  };

  const renderTermsCondCheckBoxContent = () => {
    return (
      <CheckboxWrapper>
        <CustomCheckbox
          checked={isTermsCondChecked}
          handleChange={(e) => {
            setIsTermsCondChecked(e.target.checked);
          }}
          checkedColor={colors?.text?.actionTextColor}
          unCheckedColor={colors?.text?.actionTextColor}
          ariaLabel={
            "By ticking this box, I confirm that I have read and understood the terms & conditions."
          }
        />
        <CheckboxLabel>
          <Text>
            By ticking this box, I confirm that I have read and understood the{" "}
            <a
              style={{
                color: colors?.text?.actionTextColor,
                cursor: "pointer",
              }}
              onClick={() => {
                termsCondHandler();
              }}
            >
              terms & conditions.
            </a>
            <span style={{ color: colors?.state?.error }}>*</span>
          </Text>
        </CheckboxLabel>
      </CheckboxWrapper>
    );
  };

  const renderContent = () => {
    return (
      <div className="login-without-otp-container">
        <ContentContainer>
          <HeaderText>
            <Text type="bold" variant="heading">
              Enter Your Details
            </Text>
          </HeaderText>
          <HorzDivider />
          <Wrapper>
            <RowContainer>
              <ColumnContainer>
                <Label>
                  <Text>First Name{isFirstNameMandatory ? "*" : ""}</Text>
                </Label>
                <Input
                  style={{
                    height: "54px",
                    borderRadius: "8px",
                    paddingLeft: "16px",
                    fontSize: "16px",
                    fontWeight: "300",
                    fontFamily: colors?.font?.primary,
                    backgroundColor: colors?.text?.gray600,
                    border: `1px solid ${colors?.text?.gray600}`,
                  }}
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e?.target?.value)}
                  autoComplete="on"
                />
              </ColumnContainer>
              <ColumnContainer>
                <Label>
                  <Text>Last Name{isLastNameMandatory ? "*" : ""}</Text>
                </Label>
                <Input
                  style={{
                    height: "54px",
                    borderRadius: "8px",
                    paddingLeft: "16px",
                    fontSize: "16px",
                    fontWeight: "300",
                    fontFamily: colors?.font?.primary,
                    backgroundColor: colors?.text?.gray600,
                    border: `1px solid ${colors?.text?.gray600}`,
                  }}
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e?.target?.value)}
                  autoComplete="on"
                />
              </ColumnContainer>
            </RowContainer>
            <RowContainer>
              <ColumnContainer>
                <Label>
                  <Text>Phone{isMobileMandatory ? "*" : ""}</Text>
                </Label>
                <PhoneNumberContainer>
                  <PhoneInput
                    country={countryCode?.toLowerCase() || "us"}
                    countryCodeEditable={false}
                    value={props.phNumber}
                    onChange={(phone, data) => {
                      setPhNumber(phone);
                      setPhCountryCode(data.dialCode ? data.dialCode : "");
                    }}
                    containerStyle={{
                      width: "100%",
                      height: "54px",
                    }}
                    style={{
                      height: "54px",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontFamily: colors?.font?.primary,
                      fontWeight: "300",
                      backgroundColor: colors?.text?.gray600,
                    }}
                    buttonStyle={{
                      backgroundColor: colors?.text?.gray600,
                      fontSize: "14px",
                      fontFamily: colors?.font?.primary,
                      fontWeight: "300",
                      padding: "0px 12px 0px 20px",
                      height: "34px",
                      margin: "auto",
                    }}
                    dropdownStyle={{
                      width: "300px",
                      maxHeight: "156px",
                      position: isMobileDevice() ? "absolute" : "fixed",
                    }}
                  />
                </PhoneNumberContainer>
                {!isDesktopDevice() && !showEmail && renderShowEmailContent()}
                {!isDesktopDevice() && (
                  <CheckboxContainer showEmail={showEmail}>
                    {renderPhoneCheckboxContent()}
                  </CheckboxContainer>
                )}
              </ColumnContainer>
              <ColumnContainer>
                <EmailContainer showContainer={showEmail}>
                  <Label>
                    <Text>Email{isEmailMandatory ? "*" : ""}</Text>
                  </Label>
                  <Input
                    style={{
                      height: "54px",
                      borderRadius: "8px",
                      paddingLeft: "16px",
                      fontSize: "16px",
                      fontWeight: "300",
                      fontFamily: colors?.font?.primary,
                      backgroundColor: colors?.text?.gray600,
                      border: `1px solid ${colors?.text?.gray600}`,
                    }}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e?.target?.value)}
                    autoComplete="on"
                  />
                </EmailContainer>
                {!isDesktopDevice() && (
                  <CheckboxContainer showEmail={showEmail}>
                    {!isCPH && renderMailCheckboxContent()}
                    {isCPH && renderTermsCondCheckBoxContent()}
                  </CheckboxContainer>
                )}
              </ColumnContainer>
            </RowContainer>
          </Wrapper>
          {!isMobileDevice() && (
            <CheckboxContainer>
              {!showEmail && renderShowEmailContent()}
              {!isCPH && renderMailCheckboxContent()}
              {renderPhoneCheckboxContent()}
              {isCPH && renderTermsCondCheckBoxContent()}
            </CheckboxContainer>
          )}
        </ContentContainer>
        <UserActionContainer>
          <ButtonWithLoading
            isLoading={confirmIsLoading}
            disabled={getIsDisabled()}
            onClick={() => handleLogin()}
            style={{
              width: isDesktopDevice() ? "100px" : "100%",
              border: `2px solid ${colors?.text?.actionTextColor}`,
              background: "none",
              color: colors?.text?.actionTextColor,
            }}
          >
            <ButtonLabel>
              <Text type="bold">Confirm</Text>
            </ButtonLabel>
          </ButtonWithLoading>
        </UserActionContainer>
      </div>
    );
  };

  if (isDesktopDevice()) {
    return (
      <CustomModal
        isOpen={props.isDrawerOpen}
        boxStyle={{ maxWidth: "800px", maxHeight: "600px" }}
        modalStyle={{ zIndex: 999999 }}
      >
        <ModalContainer>
          <ModalCloseIconContainer>
            <CloseIcon
              alt="close"
              src={CrossWithBackground}
              onClick={(e) => closeModal()}
            />
          </ModalCloseIconContainer>
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
        }}
        modalContainerStyle={{
          height: "90vh",
          maxHeight: "90vh",
          minHeight: "90vh",
        }}
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag={true}
        handleClose={closeModal}
        hideCloseIcon={viewIndex === 2}
        closeIcon={CrossWithBackground}
        title="Enter Your Details"
        headerTextStyle={{
          fontSize: "26px",
          width: "100%",
          color: colors?.text?.actionTextColor,
          paddingTop: "8px",
        }}
      >
        <DrawerContainer>
          <DrawerContentContainer>{renderContent()}</DrawerContentContainer>
        </DrawerContainer>
      </BottomDrawer>
    );
  }
}

const DrawerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const DrawerContentContainer = styled.div`
  width: 100%;
  padding: 0px 24px;
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
const ContentContainer = styled.div`
  width: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  height: calc(100vh - 198px);

  @media ${device.laptop} {
    height: auto;
    padding-bottom: 80px;
  }
`;
const ModalCloseIconContainer = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  z-index: 9999;
`;
const CloseIcon = styled.img`
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

const HeaderText = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    font-size: 26px;
    width: 100%;
    color: ${colors?.text?.actionTextColor};
    font-size: 21px;
    padding-top: 8px;
  }
`;
const HorzDivider = styled.div`
  width: 100%;
  height: 1px;
  margin: 24px 0px;
  background-color: ${colors?.border};
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  scrollbar-width: none;
  padding-bottom: 60px;

  @media ${device.laptop} {
    height: auto;
    padding-bottom: 0px;
  }
`;
const UserActionContainer = styled.div`
  width: 100%;
  margin-top: 32px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  left: 0px;
  background-color: #fff;
  padding: 24px;

  @media ${device.laptop} {
    margin-top: 32px;
    margin: 0px auto;
    margin-top: 32px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }
`;
const PhoneNumberContainer = styled.div`
  width: 100%;
`;
const CheckboxContainer = styled.div`
  width: 100%;
  gap: 8px;
  padding-top: ${({ showEmail }) => (showEmail ? "18px" : "0px")};

  @media ${device.laptop} {
    padding-top: 8px;
    display: flex;
    flex-direction: column;
  }
`;
const CheckboxWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
const CheckboxLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${colors?.text?.gray800};
`;

const FooterText = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 19.12px;
  text-align: left;
  display: flex;
  gap: 4px;
  margin-top: 16px;

  @media ${device.laptop} {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
`;
const ButtonLabel = styled.div`
  font-size: 14px;
  color: ${colors?.text?.actionTextColor};
  text-transform: uppercase;
`;
const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;

  @media ${device.laptop} {
    flex-wrap: wrap;
    flex-direction: row;
  }
`;
const ColumnContainer = styled.div`
  flex: 1;
  min-width: fit-content;

  @media ${device.tablet} {
    min-width: 100%;
  }

  @media ${device.laptop} {
    min-width: fit-content;
  }
`;
const Label = styled.div`
  font-size: 14px;
  color: ${colors?.text?.black800};
  padding-bottom: 12px;
`;
const EmailContainer = styled.div`
  display: ${({ showContainer }) => (showContainer ? "inherit" : "none")};
`;
const ShowEmailContent = styled.div`
  font-size: 14px;
  color: ${colors?.text?.black800};
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 20px 0px;

  @media ${device.laptop} {
    padding: 0px;
  }
`;
export default LoginWithoutOtp;
