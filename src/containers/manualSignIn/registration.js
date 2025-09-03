import React, { Fragment, useContext, useState } from "react";
import PhoneInput from "react-phone-input-2";
import alertCross from "../../assets/images/alertCross.png";
import callAPI from "../../commons/callAPI";
import config from "../../commons/config";
import Util from "../../commons/util/util";
import { SnackbarContext } from "../../context/snackbarContext";
import CustomModal from "../customModal/customModal";
import CustomTextField from "./components/customTextField";
import PrimaryButton from "./components/primaryButton";
import OtpVerify from "./otpVerify";
import "./registration.css";

const Registration = (props) => {
  const useSnackbar = useContext(SnackbarContext);

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [email, setEmail] = useState();
  const [pseudoUserId, setPseudoUserId] = useState("");
  const [referral, setReferral] = useState("");
  const [lpCheck, setLpCheck] = useState(false);

  const [isClickDisabled, setIsClickDisabled] = useState(false);

  const handleClose = () => {
    props.setIsOpen(false);
  };

  const handleOpenVerifyOtp = async () => {
    if (firstName && number) {
      let validityCheckPass = true;
      if (email && !Util.isEmailValid(email)) {
        validityCheckPass = false;
        useSnackbar.showMessage("Please Enter Valid Email ID");
      }

      if (validityCheckPass) {
        try {
          setIsClickDisabled(true);
          let apiURL = config.api.register;
          let apiResponse = await callAPI.post(apiURL, {
            contact: number,
            countryCode,
            firstName,
            lastName,
            email: email && email.trim(),
          });
          let regResponse = await apiResponse.json();
          setIsClickDisabled(false);
          if (regResponse.status === 200) {
            setPseudoUserId(regResponse.data);
            setIsOtpModalOpen(true);
            useSnackbar.showMessage("Please Enter OTP");
          } else {
            useSnackbar.showMessage(regResponse.message);
          }
        } catch (err) {
          setIsClickDisabled(false);
          useSnackbar.showMessage("Something went wrong");
        }
      }
    } else {
      if (!firstName) {
        useSnackbar.showMessage("Please Enter First Name");
      } else if (!number) {
        useSnackbar.showMessage("Please Enter Mobile Number");
      }
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
            <div className="title">
              Sign up for a personalised flight itinerary and relevant airport
              updates
            </div>
            <CustomTextField
              label="First Name"
              fullWidth
              style={{ marginTop: 5 }}
              value={firstName}
              setValue={setFirstName}
              name="firstname"
              required
              type="text"
            />

            <CustomTextField
              label="Last Name"
              fullWidth
              style={{ marginTop: 5 }}
              value={lastName}
              setValue={setLastName}
              name="firstname"
              type="text"
            />

            <div style={{ marginTop: 20 }}>
              <PhoneInput
                country={"in"}
                value={number}
                onChange={(phone, data) => {
                  setNumber(phone);
                  setCountryCode(data.dialCode ? data.dialCode : "");
                }}
                style={{ marginTop: 5 }}
              />
            </div>

            {/* <CustomTextField
              label='Enter Last Name'
              name  = "lastname"
              fullWidth
              style={{ marginTop: 5 }}
              value={lastName}
              setValue={setLastName}
              type='text'
            /> */}

            {/* <CustomTextField
              label='Enter Email'
              name  = "email"
              fullWidth
              style={{ marginTop: 5 }}
              value={email}
              setValue={setEmail}
              inputProps={{ maxLength: 50 }}
              type='email'
            /> */}

            <div className="check_box">
              <input
                type="checkbox"
                id="lp"
                checked={lpCheck}
                onClick={() => {
                  setLpCheck(!lpCheck);
                  console.log(lpCheck);
                }}
              />

              <label
                htmlFor="lp"
                style={{
                  marginLeft: "20px",
                  fontSize: "13px",
                  marginTop: "10px",
                }}
              >
                Enrol me into the{" "}
                <span className="boldTxt">Pulse Rewards Program</span>
              </label>
            </div>

            {/* <label
              htmlFor='referral'
              style={{ marginTop: 4, fontSize:'18px', fontWeight:"normal" }}
            >
              Have a referral code? Enter here
            </label> */}

            <CustomTextField
              label="Enter referral Code"
              name="referral"
              fullWidth
              value={referral}
              setValue={setReferral}
              inputProps={{ maxLength: 50 }}
              type="text"
              disabled={!lpCheck}
            />

            <PrimaryButton
              className="otp-btn-mob"
              style={{
                marginTop: 10,
                backgroundColor: "#149b99",
                pointerEvents: isClickDisabled ? "none" : "",
              }}
              onClick={handleOpenVerifyOtp}
            >
              Get OTP
            </PrimaryButton>
            <div style={{ marginTop: 10, marginLeft: 5 }}>
              Don't have a local sim?{" "}
              <span
                className="additional-option"
                onClick={() => props.setIsOpen(false)}
              >
                Sign up with e-mail
              </span>
            </div>
          </div>
        </div>
        <OtpVerify
          acceptLoyality={!lpCheck}
          isOpen={isOtpModalOpen}
          setIsOpen={setIsOtpModalOpen}
          prevIsOpen={props.isOpen}
          setPrevIsOpen={props.setIsOpen}
          pseudoUserId={pseudoUserId}
          resendOTPCallback={handleOpenVerifyOtp}
          refer={referral}
          disableOtp={isClickDisabled}
          setDisableOtp={setIsClickDisabled}
        />
      </CustomModal>
    </Fragment>
  );
};

export default Registration;
