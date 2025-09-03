import React, { useEffect, useState } from "react";
import VerifyOtp from "../../../../containers/verifyOtp/verifyOtp";
import arrowLeft from "../../../../assets/images/verifyOtp/arrow-left.svg";
import { Body, Header, Wrapper } from "./verifyStyle";
import Text from "../../../../components/atoms/Text";
import config, { otpTimeout, resource } from "../../../../commons/config";
import { useHistory } from "react-router-dom";
import { encode } from "../../../../commons/util/helperFunctions";
import callAPI from "../../../../commons/callAPI";
import PushAlert from "../../../../components/atoms/pushAlert";
import Util from "../../../../commons/util/util";

const VerifyEmail = (props) => {
  const history = useHistory();
  const [mobile] = useState(props.location.state.mobile);
  const [mobileOtp, setMobileOtp] = useState("");
  const [email] = useState(props.location.state.email);
  const [verifyIsLoading, setVerifyIsLoading] = useState(false);
  const [resendIsLoading, setResendIsLoading] = useState(false);

  const [seconds, setSeconds] = useState(otpTimeout);
  const [isClickDisabled, setIsClickDisabled] = useState(false);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (seconds === 0) {
        clearInterval(myInterval);
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [seconds]);

  const handleGoBack = () => {
    history.goBack();
  };
  const handleResendOtp = async (disabled) => {
    if (!disabled) {
      setIsClickDisabled(true);
      setResendIsLoading(true);
      try {
        let apiURL = `${config.api.user.requestOtpUpdateEmail.replace(
          ":email",
          encode(email)
        )}`;
        let apiResponse = await callAPI.get(apiURL);
        let regResponse = await apiResponse.json();
        setIsClickDisabled(false);
        if (regResponse.status === 200) {
          PushAlert.success(regResponse.message);
          setSeconds(otpTimeout);
        } else {
          PushAlert.error(regResponse.message);
        }
      } catch (error) {
        setIsClickDisabled(false);
        PushAlert.error("Something went wrong");
      }
      resetOtp();
      setResendIsLoading(false);
    }
  };
  const handleVerifyOtp = async (disabled) => {
    if (!disabled) {
      setIsClickDisabled(true);
      setVerifyIsLoading(true);
      try {
        let apiURL = config.api.user.updateEmail;
        let body = {
          otp: {
            mobile: parseInt(mobileOtp),
          },
          resource: resource,
        };
        let apiResponse = await callAPI.put(apiURL, body);
        let regResponse = await apiResponse.json();
        setIsClickDisabled(false);
        if (regResponse.status === 200) {
          if (
            props.location.state.isEditName ||
            props.location.state.isEditDob ||
            props.location.state.isEditNationality
          ) {
            handleSubmitPersonalDetails();
          } else {
            handleGoBack();
            PushAlert.success(regResponse.message);
            setVerifyIsLoading(false);
          }
        } else {
          PushAlert.error(regResponse.message);
          resetOtp();
          setVerifyIsLoading(false);
        }
      } catch (error) {
        setIsClickDisabled(false);
        PushAlert.error("Something went wrong");
        resetOtp();
        setVerifyIsLoading(false);
      }
    }
  };

  const handleSubmitPersonalDetails = async () => {
    let apiURL = config.api.auth.initiate;
    let userObj = {
      countryCode: props.location.state.countryCode,
      mobile: props.location.state.mobileUnmasked,
      firstName: props.location.state.firstName,
      lastName: props.location.state.lastName,
      nationality: props.location.state.nationality,
      dob: props.location.state.dob,
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
    if (apiResponse.status === 200) {
      if (regResponse.status?.toString()?.startsWith("20")) {
        PushAlert.success("Personal Details Updated Successfully!");
        handleGoBack();
      } else {
        PushAlert.error("Could not update details, please try again!");
      }
    }
    setVerifyIsLoading(false);
  };

  const resetOtp = () => {
    setMobileOtp("");
  };
  return (
    <Wrapper>
      <Header>
        <img
          src={arrowLeft}
          alt="arrowLeft-not-found"
          style={{ height: "18px", width: "18px" }}
          onClick={handleGoBack}
        />
        <Text
          style={{ display: "flex", marginLeft: 10 }}
          onClick={handleGoBack}
        >
          Back to{" "}
          <Text type="bold" style={{ marginLeft: 3 }} onClick={handleGoBack}>
            Login
          </Text>
        </Text>
      </Header>
      <Body>
        <VerifyOtp
          verifyMobile={true}
          mobile={mobile}
          mobileOtp={mobileOtp}
          setMobileOtp={setMobileOtp}
          timeRemaining={seconds}
          onResend={handleResendOtp}
          onVerify={handleVerifyOtp}
          verifyIsLoading={verifyIsLoading}
          resendIsLoading={resendIsLoading}
          isVerifyDisabled={mobileOtp.length < 4 ? true : false}
          isClickDisabled={isClickDisabled}
        />
      </Body>
    </Wrapper>
  );
};

export default VerifyEmail;
