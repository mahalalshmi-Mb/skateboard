import React, { Fragment, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import alertCross from "../../assets/images/alertCross.png";
import callAPI from "../../commons/callAPI";
import config from "../../commons/config";
import { getAppConfig } from "../../commons/util/appConfigHelper";
import { getUserInfo } from "../../commons/util/helperFunctions";
import { setUserPermission } from "../../commons/util/permissionsConfig";
import Util from "../../commons/util/util";
import { SnackbarContext } from "../../context/snackbarContext";
import CustomModal from "../customModal/customModal";
import CustomTextField from "./components/customTextField";
import PrimaryButton from "./components/primaryButton";
import { otpTimeoutSeconds } from "./util";
import { CartContext } from "../../context/cartContext";
import { FlightContext } from "../../context/FlightsContext";

const OtpVerify = (props) => {
  const ClientCart = useContext(CartContext);
  const ClientFlight = useContext(FlightContext);
  const useSnackbar = useContext(SnackbarContext);
  const history = useHistory();
  const [otp, setOtp] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(otpTimeoutSeconds);
  const [cookies, setCookie] = useCookies(["gwLoginData"]);

  const [isClickDisabled, setIsClickDisabled] = useState(false);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [seconds, minutes]);

  const handleClose = () => {
    props.setIsOpen(false);
  };

  const handleResendOTP = async () => {
    props.setDisableOtp(true);
    setOtp("");
    if (seconds < 1 && minutes < 1) {
      let apiURL = config.api.login.otp;
      if (!props.pseudoUserId) {
        try {
          let apiResponse;

          apiResponse = await callAPI.patch(apiURL, {
            username: props.number,
          });

          let regResponse = await apiResponse.json();
          props.setDisableOtp(false);
          if (regResponse.status === 201) {
            useSnackbar.showMessage("OTP Resend Successful");
            setSeconds(otpTimeoutSeconds);
          } else if (regResponse.status === 429) {
            useSnackbar.showMessage("Previous OTP still alive, please re-use");
          } else {
            useSnackbar.showMessage(regResponse.message);
          }
        } catch (err) {
          props.setDisableOtp(false);
          useSnackbar.showMessage(err.response.message);
          console.log("error", err.response.status);
        }
      } else {
        props.setDisableOtp(false);
        setSeconds(otpTimeoutSeconds);
        useSnackbar.showMessage("Re-submit registration");
        props.setIsOpen(false);
      }
    } else {
      props.setDisableOtp(false);
    }
  };
  const handleVerify = async () => {
    let apiResponse;
    if (otp) {
      try {
        setIsClickDisabled(true);
        if (props.pseudoUserId) {
          let apiURL = config.api.validateRegistration;
          apiResponse = await callAPI.post(apiURL, {
            pseudoUserId: props.pseudoUserId,
            otp,
            skipLMS: props.acceptLoyality,
            referral: props.refer ? props.refer : "",
          });
        } else if (props.number) {
          let source = "regular";
          if (localStorage.getItem("module"))
            source = localStorage.getItem("module");

          const data = {
            source,
            name: "signin",
          };
          const userAgentData = Util.getUserAgentData(data);
          const userMetadata = Util.getUsermetaData();

          let apiURL = `${config.api.login.local}${userAgentData}`;
          apiResponse = await callAPI.patch(
            apiURL,
            {
              username: props.number,
              password: otp,
              resource: "paxapp",
            },
            userMetadata
          );
        }
        let regResponse = await apiResponse.json();
        if (regResponse.status === 200) {
          useSnackbar.showMessage("OTP Verification Successful");
          let data = await getUserInfo();
          let email = data.email;
          let gwLoginData = {
            profileImageURL: "",
            email,
          };
          setCookie("gwLoginData", JSON.stringify(gwLoginData), {
            path: "/",
            maxAge: 86400 * getAppConfig("LOGIN_COOKIE_EXPIRY_DAYS"),
          });
          await setUserPermission();
          await ClientCart.saveCart(true);
          // await ClientFlight.saveFlight();
          props.setIsOpen(false);
          props.setPrevIsOpen && props.setPrevIsOpen(false);
          history.go(0);
        } else {
          useSnackbar.showMessage(
            "OTP Verification Unsuccessful, re-enter OTP"
          );
        }
        setIsClickDisabled(false);
      } catch (error) {
        setIsClickDisabled(false);
        useSnackbar.showMessage("OTP Verification Unsuccessful, re-enter OTP");
        console.log(error);
      }
    } else {
      useSnackbar.showMessage("Enter OTP");
    }
  };
  return (
    <Fragment>
      <CustomModal {...props}>
        <div className="manual-signin-content">
          <span className="close-wrapper" onClick={() => handleClose()}>
            <img src={alertCross} alt="" style={{ height: 20, width: 20 }} />
          </span>
          <div className="content">
            <div className="title">Verify OTP</div>

            <CustomTextField
              value={otp}
              setValue={setOtp}
              label="Enter OTP"
              fullWidth
              style={{ marginTop: 15 }}
              type="tel"
              required
              inputProps={{ maxLength: 4 }}
            />

            <div style={{ marginTop: 10, marginLeft: 5 }}>
              <span
                className={seconds < 1 ? "additional-option" : ""}
                onClick={() => handleResendOTP(false)}
                style={{
                  pointerEvents: props.disableOtp ? "none" : "",
                }}
              >
                Resend OTP
              </span>{" "}
              {seconds > 0 ? ` in ${seconds} seconds` : ``}
            </div>
            <PrimaryButton
              style={{
                marginTop: 25,
                pointerEvents: isClickDisabled ? "none" : "",
              }}
              onClick={handleVerify}
            >
              Verify
            </PrimaryButton>
            <div style={{ marginTop: 10, marginLeft: 5 }}>
              or{" "}
              <span
                className="additional-option"
                onClick={() => props.setIsOpen(false)}
              >
                Go Back
              </span>
            </div>
          </div>
        </div>
      </CustomModal>
    </Fragment>
  );
};

export default OtpVerify;
