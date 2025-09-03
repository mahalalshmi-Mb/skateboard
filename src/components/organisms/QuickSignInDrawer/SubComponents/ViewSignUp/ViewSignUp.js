import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import styled from "styled-components";
import callAPI from "../../../../../commons/callAPI";
import config from "../../../../../commons/config";
import ButtonWithLoading from "components/atoms/ButtonWithLoading";
import Text from "../../../../atoms/Text";
import PushAlert from "../../../../atoms/pushAlert";
import Input from "../CustomInput";
import "./ViewSignUp.css";
import ConsentCheckBox from "../../../ConsentCheckbox";
import { device } from "../../../../../commons/util/helperFunctions";
import CustomTextField from "../../../../molecules/customTextField";
import Util from "../../../../../commons/util/util";

function ViewSignUp(props) {
  const [countryCode, setCountryCode] = useState("");
  const [confirmIsLoading, setIsConfirmLoading] = useState(false);
  const [isClickDisabled, setIsClickDisabled] = useState(false);
  const [pulseProgramHasConsent, setPulseProgramHasConsent] = useState(false);

  //referral-code
  const [referral, setReferral] = useState("");
  const [referralCodeError, setReferralCodeError] = useState(false);
  const [referralCodeSuccess, setReferralCodeSuccess] = useState(false);

  const [isValidEmail, setIsValidEmail] = useState(false);

  useEffect(() => {
    if (props.email) {
      setIsValidEmail(Util.isEmailValid(props.email));
    }
  }, [props.email]);

  useEffect(() => {
    if (referralCodeError) {
      setReferralCodeError(false);
    }
    if (referralCodeSuccess) {
      setReferralCodeSuccess(false);
    }
    const getDataTimerId = setTimeout(() => {
      if (referral) callReferralCheckApi();
    }, 1000);

    return () => clearTimeout(getDataTimerId);
  }, [referral]);

  const handleFullName = (e) => {
    props.setFullName(e.target.value);
  };

  const handleEmail = (e) => {
    props.setEmail(e.target.value);
  };

  const handleGenerateOtp = async () => {
    if (props.fullName && props.fullName.trim() !== "" && props.phNumber) {
      if (props.phNumber.slice(0, 2) === "91") {
        if (props.phNumber.length !== 12) {
          PushAlert.error("Please enter your 10-digit mobile number");
          return false;
        }
      }

      const splitArray = props.fullName.split(" ");
      const firstName = splitArray[0] || "";
      const lastName = splitArray[1] || "";
      const email = props.email;

      if (!email || !Util.isEmailValid(email)) {
        PushAlert.warning("Please Enter Valid Email ID");
        return false;
      }

      try {
        setIsClickDisabled(true);
        setIsConfirmLoading(true);
        let apiURL = config.api.auth.initiate;
        let userObj = {
          firstName: firstName?.trim() || "",
          lastName: lastName?.trim() || "",
          email: email?.trim() || "",
          countryCode,
          mobile: props.phNumber?.replace(countryCode, "") || "",
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

        if (regResponse.status?.toString()?.startsWith("20")) {
          props.setPseudoUserId(regResponse.data);
          goToStageTwo();
          setIsConfirmLoading(false);
          PushAlert.success(regResponse.message);
        } else if (regResponse.status === 429) {
          props.setPseudoUserId(regResponse.data);
          goToStageTwo();
          setIsConfirmLoading(false);
          PushAlert.error(regResponse.message);
        } else {
          setIsConfirmLoading(true);
          PushAlert.error(regResponse.message);
        }
      } catch (err) {
        if (err.response.data.status === 429) {
          goToStageTwo();
          props.setPseudoUserId(err.response.data.status.data);
        }
        PushAlert.error("Something went wrong, please try again!");
        console.log(err);
      }
    } else {
      if (!props.fullName || props.fullName.trim() === "") {
        PushAlert.error("Please Enter First Name");
      } else if (!props.phNumber) {
        PushAlert.error("Please Enter Mobile Number");
      }
    }
  };

  const goToStageTwo = () => {
    props.setViewIndex(1);
  };

  const goToViewOne = () => {
    props.setViewIndex(0);
  };

  const callReferralCheckApi = async () => {
    try {
      let apiURL = `${config.api.user.referral_check}`;
      let apiResponse;
      apiResponse = await callAPI.get(apiURL, { referral });

      let regResponse = await apiResponse.json();

      if (regResponse.data.isValid) {
        PushAlert.success(
          "Code verified! Get ready to be rewarded, please proceed with registration"
        );
        setReferralCodeSuccess(true);
      } else {
        PushAlert.error(
          "Code not valid, please enter valid code or proceed without referral code"
        );
        setReferralCodeError(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="view-signup-container">
      <HeaderText>
        <Text type="extra-bold">Create an account</Text>
      </HeaderText>

      <UserInputContainer>
        <Input
          border={"1px solid #DCDCDC"}
          style={{
            height: "54px",
            borderRadius: "8px",
            paddingLeft: "16px",
            fontSize: "16px",
            fontFamily: "ManropeRegular",
            fontWeight: "500",
          }}
          placeholder="Full name*"
          value={props.fullName}
          onChange={handleFullName}
        />
        <PhoneInput
          country={"in"}
          countryCodeEditable={false}
          value={props.phNumber}
          onChange={(phone, data) => {
            props.setPhNumber(phone);
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
          }}
          dropdownStyle={{
            width: "300px",
            maxHeight: "300px",
          }}
        />
        <Input
          border={"1px solid #DCDCDC"}
          style={{
            height: "54px",
            borderRadius: "8px",
            paddingLeft: "16px",
            fontSize: "16px",
            fontFamily: "ManropeRegular",
            fontWeight: "500",
          }}
          placeholder="Email*"
          value={props.email}
          onChange={handleEmail}
        />
      </UserInputContainer>
      <ConsentCheckBox
        isChecked={pulseProgramHasConsent}
        setIsChecked={setPulseProgramHasConsent}
        containerStyle={{ alignItems: "center" }}
      />
      {props.hasReferral && (
        <div style={{ marginTop: "30px" }}>
          <CustomTextField
            value={referral}
            setValue={setReferral}
            placeholder={"Referral code"}
            inputProps={{ maxLength: 50 }}
            type="text"
            disabled={false}
            error={referralCodeError}
            setError={setReferralCodeError}
            success={referralCodeSuccess}
            style={{ padding: 0 }}
          />
        </div>
      )}
      <UserActionContainer>
        <ButtonWithLoading
          isLoading={confirmIsLoading}
          disabled={
            props.fullName === "" ||
            props.phNumber === "" ||
            props.phNumber.length < 5 ||
            isClickDisabled ||
            confirmIsLoading ||
            !isValidEmail ||
            !pulseProgramHasConsent
          }
          onClick={() => handleGenerateOtp()}
          buttonLabel="Confirm"
        />
      </UserActionContainer>
      <FooterText onClick={goToViewOne}>
        <Text type="medium">Already have an account?</Text>
        <Text style={{ color: "#0A6B71" }} type="bold">
          Login
        </Text>
      </FooterText>
    </div>
  );
}

const HeaderText = styled.div`
  width: 100%;
  color: #273135;
  font-size: 21px;
  padding-top: 8px;

  @media ${device.laptop} {
    font-size: 24px;
  }
`;

const UserInputContainer = styled.div`
  width: 100%;
  padding-top: 24px;
  gap: 24px;
  display: flex;
  flex-direction: column;
`;
const UserActionContainer = styled.div`
  width: 100%;
  margin-top: 40px;

  @media ${device.laptop} {
    margin-top: 32px;
  }

  @media ${device.laptop} {
    max-width: 340px;
    margin: 0px auto;
    margin-top: 32px;
  }
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

export default ViewSignUp;
