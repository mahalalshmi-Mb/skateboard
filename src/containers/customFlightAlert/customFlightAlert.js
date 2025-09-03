import { Checkbox } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import OtpInput from "../../containers/verifyOtp/components/CustomOtpInput/CustomOtpInput";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import alertCross from "../../assets/images/alertCross.png";
import callAPI from "../../commons/callAPI";
import config from "../../commons/config";
import CustomModal from "../customModal/customModal";
import Util from "../../commons/util/util";
import "./customFlightAlert.css";
import { FlightAlertContext } from "../../context/flightAlertContext";
import { decode, encode } from "../../commons/util/helperFunctions";
import PushAlert from "../../components/atoms/pushAlert";
import { useHistory } from "react-router-dom";

const CustomFlightAlert = (props) => {
  const history = useHistory();
  const useFlightAlert = useContext(FlightAlertContext);
  const [cookies, setCookie] = useCookies([
    "gwLoginData",
    "profileVerifiedMobileNumber",
  ]);
  const [emailIsChecked, setEmailIsChecked] = useState(true);
  const [numberIsChecked, setNumberIsChecked] = useState(true);
  const [emailValue, setEmailValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [otpIsOpen, setOtpIsOpen] = useState(false);
  const [otp, setOtp] = useState();
  const [mobileVerified, setMobileVerified] = useState(false);

  const [verifyButtonEnabled, setVerifyButtonEnabled] = useState(false);
  const [trackFlightButtonEnabled, setTrackFlightButtonEnabled] =
    useState(false);
  const [verifyOTPButtonEnabled, setVerifyOTPButtonEnabled] = useState(false);
  const [pseudoUserId, setPseudoUserId] = useState();
  const [counter, setCounter] = useState(59);
  const [otpErrorText, setOtpErrorText] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(true);

  const [isClickDisabled, setIsClickDisabled] = useState(false);

  useEffect(() => {
    const onInitialLoad = () => {
      if (cookies.gwLoginData && cookies.gwLoginData.email) {
        setEmailValue(decode(cookies.gwLoginData.email));
      }
      if (cookies.gwLoginData && cookies.gwLoginData.mobile) {
        setPhoneValue(decode(cookies.gwLoginData.mobile));
        setMobileVerified(true);
        setVerifyButtonEnabled(false);
        if (cookies.profileVerifiedMobileNumber) {
          setMobileVerified(true);
          setVerifyButtonEnabled(false);
        }
      } else {
        setMobileVerified(false);
        setVerifyButtonEnabled(true);
      }
    };
    onInitialLoad();
  }, []);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    if (!emailIsChecked && !numberIsChecked) {
      setTrackFlightButtonEnabled(false);
    } else if (numberIsChecked && !mobileVerified) {
      setTrackFlightButtonEnabled(false);
    } else if (
      (emailIsChecked && !emailIsValid) ||
      (emailIsChecked && emailValue === "")
    ) {
      setTrackFlightButtonEnabled(false);
    } else {
      setTrackFlightButtonEnabled(true);
    }
  }, [emailIsChecked, numberIsChecked, mobileVerified, emailIsValid]);

  const handleOTP = (otpVal) => {
    if (otpVal.length !== 4) {
      setVerifyOTPButtonEnabled(false);
    } else {
      setVerifyOTPButtonEnabled(true);
      setOtp(otpVal);
    }
  };
  const verifyOTP = async () => {
    try {
      setIsClickDisabled(true);
      const apiUrl = config.api.validateOtp_v2;
      const body = pseudoUserId
        ? {
            pseudoUserId: pseudoUserId,
            contact: phoneValue,
            otp: otp,
          }
        : {
            contact: phoneValue,
            otp: otp,
          };

      let apiResponse = await callAPI.post(apiUrl, body);
      let regResponse = await apiResponse.json();
      if (
        ("success" === regResponse.type ||
          "cors" === apiResponse.type ||
          200 === regResponse.status) &&
        200 === apiResponse.status
      ) {
        setCounter(59);
        setOtpIsOpen(!otpIsOpen);
        setMobileVerified(true);
        setCookie("profileVerifiedMobileNumber", encode(phoneValue));
        setVerifyButtonEnabled(false);
      } else {
        setOtpErrorText(regResponse.message);
        setTimeout(() => setOtpErrorText(""), 5000);
      }
      setIsClickDisabled(false);
    } catch (err) {
      setIsClickDisabled(false);
      setOtpErrorText("Please try again later");
      setTimeout(() => setOtpErrorText(""), 5000);
    }
  };

  const emailInputValidation = (email) => {
    const emailValidation = Util.isEmailValid(email);
    if (emailValidation) {
      setEmailIsChecked(true);
      setTrackFlightButtonEnabled(true);
      setEmailIsValid(true);
    } else {
      setEmailIsChecked(false);

      setTrackFlightButtonEnabled(false);
      setEmailIsValid(false);
    }
  };

  const PhoneInputValidation = (ph) => {
    const regexExp = /^[6-9]\d{11}$/gi;
    const phoneValidation = regexExp.test(ph);
    setVerifyButtonEnabled(phoneValidation);
  };

  const sendOTP = async () => {
    if (verifyButtonEnabled || !mobileVerified) {
      setIsClickDisabled(true);
      setCounter(59);
      setPseudoUserId("");

      try {
        let apiResponse = await callAPI.post(config.api.genOtp_v2, {
          contact: phoneValue,
        });
        let regResponse = await apiResponse.json();
        setIsClickDisabled(false);
        if (
          ("success" === apiResponse.type || "cors" === apiResponse.type) &&
          200 === apiResponse.status
        ) {
          if (regResponse.data) setPseudoUserId(regResponse.data);
          setOtpIsOpen(true);
        } else {
          console.log(regResponse.message);
        }
      } catch (err) {
        setIsClickDisabled(false);
        console.log(err);
      }
    }
  };

  const handleClose = () => {
    useFlightAlert.closeFlightAlert();
  };
  const handleSubmit = async () => {
    if (trackFlightButtonEnabled) {
      let notificationMethod = [];

      if (numberIsChecked) {
        notificationMethod.push("SMS");
      }
      if (emailIsChecked) {
        notificationMethod.push("EMAIL");
      }

      let apiURL = config.api.flightTrack;
      let apiData = {
        ...useFlightAlert.flightDetails,
        notificationMethod: notificationMethod,
        user: {
          email: emailValue,
          mobile: phoneValue,
          userId: cookies.gwLoginData.userId,
        },
      };

      Util.triggerMoEngageEvent("flight_tracked", {
        flight_name: useFlightAlert?.flightDetails?.airline_name,
        flight_id: useFlightAlert?.flightDetails?.flight_id,
        flight_status: useFlightAlert?.flightDetails?.flight_status,
        scheduled_time: useFlightAlert?.flightDetails?.scheduled_time,
        estimated_time: useFlightAlert?.flightDetails?.estimated_time,
        gate: useFlightAlert?.flightDetails?.gate,
        from_home_page: true,
      });

      try {
        setTrackFlightButtonEnabled(false);
        let apiResponse = await callAPI.post(apiURL, apiData);
        let regResponse = await apiResponse.json();
        if (regResponse.status === 200 || regResponse.status === 201) {
          handleClose();
          PushAlert.info("Your flight is now being tracked!");
          history.go(0);
          setTrackFlightButtonEnabled(true);
        } else {
          setTrackFlightButtonEnabled(true);
        }
      } catch (e) {
        console.log(e);
        PushAlert.info("Something went wrong, try later!");
      }
    }
  };
  return (
    <div className="custom-flight-alert-wrapper">
      <CustomModal
        isOpen={useFlightAlert.isOpen}
        boxStyle={{ overflow: "hidden" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              right: 16,
              padding: 4,
              backgroundColor: "#7a7a7a",
              zIndex: 10,
              cursor: "pointer",
            }}
            onClick={() => handleClose()}
          >
            <img src={alertCross} alt="" style={{ height: 20, width: 20 }} />
          </span>
          <span
            style={{
              backgroundColor: "#ffd14f",
              height: 40,
              width: 130,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            Flight Alerts
          </span>
        </div>
        <div
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            marginTop: 10,
            fontSize: 14,
          }}
        >
          Track your flight status and get notified in the event of delays,
          cancellations, gate and belt changes.
          <br />
          Choose how you want to be notified - email, phone or both.
        </div>
        <div
          style={{
            // backgroundColor: '#999',
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Checkbox
              checked={emailIsChecked}
              color="default"
              onChange={(e) => {
                setEmailIsChecked(e.target.checked);
              }}
            />
            {/* <img src={alertEmail} alt='' style={{ width: 30 }} /> */}
            <input
              type="email"
              className="custom-flight-alert-wrapper-email-input"
              style={
                !emailIsValid && emailIsChecked
                  ? {
                      marginLeft: 10,
                      height: 30,
                      paddingLeft: 16,
                      border: "1px solid rgb(186, 44, 67)",
                    }
                  : {
                      marginLeft: 10,
                      height: 30,
                      paddingLeft: 16,
                    }
              }
              value={emailValue}
              onChange={(e) => {
                setEmailValue(e.target.value);
                emailInputValidation(e.target.value);
              }}
              onBlur={(e) => {
                if (!emailIsValid) {
                  e.target.value = "";
                  setEmailValue("");
                  e.target.placeholder = "Please enter a valid email id";
                }
              }}
              placeholder="Enter email"
            />
          </div>
          <div className="custom-flight-alert-wrapper-phone-number-input">
            <Checkbox
              checked={numberIsChecked}
              color="default"
              onChange={(e) => {
                setNumberIsChecked(e.target.checked);
              }}
            />
            <div className="custom-flight-alert-wrapper-button-wrapper">
              <PhoneInput
                disabled={mobileVerified ? true : false}
                country={"in"}
                value={
                  !cookies.profileVerifiedMobileNumber
                    ? phoneValue
                    : decode(cookies.profileVerifiedMobileNumber)
                }
                onChange={(phone) => {
                  setPhoneValue(phone);
                  PhoneInputValidation(phone);
                }}
                inputClass="custom-flight-alert-tel-input"
                style={{ marginLeft: 10 }}
              />
              {!otpIsOpen ? (
                <div
                  style={{
                    backgroundColor: "#056362",
                    color: "#fff",
                    fontSize: 14,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: 5,
                    paddingRight: 5,
                    width: 80,
                    cursor: "pointer",
                    borderRadius: 5,
                  }}
                  className={`custom-flight-alert-wrapper-verify-button ${
                    !verifyButtonEnabled || mobileVerified
                      ? "custom-flight-alert-wrapper-button-disabled"
                      : null
                  }`}
                  onClick={sendOTP}
                  disabled={mobileVerified ? true : false}
                >
                  {otpIsOpen ? "Cancel" : ""}
                  {mobileVerified ? "Verified" : "Verify"}
                </div>
              ) : (
                <div
                  style={{
                    height: 30,
                    width: 80,
                  }}
                ></div>
              )}
            </div>
          </div>
          {otpIsOpen ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: "bold" }}>
                Please enter OTP
              </div>
              <OtpInput value={otp} setValue={setOtp} placeholder="" />
              <div style={{ fontSize: 14, marginTop: 15 }}>
                {counter === 0 ? (
                  <span
                    style={{
                      color: "#056362",
                      fontWeight: "bold",
                      textDecoration: "underline",
                      cursor: "pointer",
                      pointerEvents: isClickDisabled ? "none" : "",
                    }}
                    onClick={sendOTP}
                  >
                    Resend OTP
                  </span>
                ) : (
                  <span
                    style={{
                      color: "#000",
                    }}
                  >
                    Resend OTP in 00:{counter < 10 ? "0" + counter : counter}
                  </span>
                )}
              </div>
              {otpErrorText !== "" ? (
                <div style={{ fontSize: "14px", color: "red" }}>
                  {otpErrorText}
                </div>
              ) : null}
              <div
                className={`custom-flight-alert-wrapper-common-ui-button ${
                  !verifyOTPButtonEnabled
                    ? "custom-flight-alert-wrapper-button-disabled"
                    : null
                }`}
                style={{
                  pointerEvents: isClickDisabled ? "none" : "",
                }}
                onClick={() => verifyOTP()}
              >
                Verify OTP
              </div>
              <div
                className="custom-flight-alert-wrapper-common-ui-button"
                onClick={() => {
                  setCounter(59);
                  setOtpIsOpen(false);
                  setOtp("");
                }}
              >
                Cancel
              </div>
            </div>
          ) : null}
          <div
            style={{
              width: 150,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              marginTop: 20,
              marginBottom: 20,
              borderRadius: 5,
              cursor: "pointer",
            }}
            className={`custom-flight-alert-wrapper-flight-button ${
              !trackFlightButtonEnabled
                ? "custom-flight-alert-wrapper-button-disabled"
                : null
            }`}
            onClick={handleSubmit}
          >
            Track Flight
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default CustomFlightAlert;
