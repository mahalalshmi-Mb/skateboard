import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import styled from "styled-components";
import callAPI from "../../../../../commons/callAPI";
import config from "../../../../../commons/config";
import ButtonWithLoading from "components/atoms/ButtonWithLoading";
import Text from "../../../../atoms/Text";
import PushAlert from "../../../../atoms/pushAlert";
import "./ViewOne.css";
import { device } from "../../../../../commons/util/helperFunctions";
import Util from "../../../../../commons/util/util";

function ViewOne(props) {
  const [confirmIsLoading, setIsConfirmLoading] = useState(false);
  const [isClickDisabled, setIsClickDisabled] = useState(false);

  const handleGenerateOtp = async () => {
    if (props.phNumber) {
      if (props.phNumber.slice(0, 2) === "91") {
        if (props.phNumber.length !== 12) {
          PushAlert.error("Please enter your 10-digit mobile number");
          return false;
        }
      }

      try {
        setIsClickDisabled(true);
        setIsConfirmLoading(true);
        let apiURL = config.api.auth.initiate;
        let userObj = {
          countryCode: props.countryCode,
          mobile: props.phNumber?.replace(props.countryCode, "") || "",
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
          props.setPseudoUserId(regResponse.data);
          goToStageTwo();
          setIsConfirmLoading(false);
          PushAlert.success(regResponse.message);
        } else if (regResponse.status === 429) {
          props.setPseudoUserId(regResponse.data);
          goToStageTwo();
          setIsConfirmLoading(false);
          PushAlert.error(regResponse.message);
        } else if (regResponse.status === 403) {
          props.setPseudoUserId(regResponse.data);
          goToViewSignUp();
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
        if (err.response.data.status === 403) {
          goToViewSignUp();
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

  const goToViewSignUp = () => {
    props.setViewIndex(3);
  };

  return (
    <div className="view-one-container">
      <HeaderText>
        <Text type="extra-bold">Login to proceed</Text>
      </HeaderText>

      <UserInputContainer>
        <PhoneInput
          country={"in"}
          countryCodeEditable={false}
          value={props.phNumber}
          onChange={(phone, data) => {
            props.setPhNumber(phone);
            props.setCountryCode(data.dialCode ? data.dialCode : "");
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
      </UserInputContainer>

      <UserActionContainer>
        <ButtonWithLoading
          isLoading={confirmIsLoading}
          disabled={
            props.phNumber === "" ||
            props.phNumber.length < 5 ||
            isClickDisabled ||
            confirmIsLoading
          }
          onClick={() => handleGenerateOtp()}
          buttonLabel="Confirm"
        />
      </UserActionContainer>
      <FooterText onClick={goToViewSignUp}>
        <Text type="medium">Don't have an account?</Text>
        <Text style={{ color: "#0A6B71" }} type="bold">
          Sign up
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
    max-width: 340px;
    margin: 0px auto;
    margin-top: 32px;
  }
`;

export default ViewOne;
