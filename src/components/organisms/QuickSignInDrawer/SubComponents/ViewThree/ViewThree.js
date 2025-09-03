import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import OtpVerifiedIcon from "../../../../../assets/images/quickSignIn/OtpVerified.svg";
import "./ViewThree.css";
import Text from "../../../../atoms/Text";
import useCustomNavigation from "../../../../../hooks/useCustomNavigation";

function ViewThree(props) {
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();

  useEffect(() => {
    setTimeout(() => {
      props.setIsDrawerOpen(false);
      if (props.successHandler) {
        props.successHandler();
      } else {
        pushHistory("/cartRedirect");
      }
    }, 2000);
    return () => {
      props.setViewIndex(0);
    };
  }, []);

  return (
    <div className="view-three-container">
      <div className="content-container animate pop">
        <img
          // className="otp-verified-icon slide-right"
          className="otp-verified-icon"
          src={OtpVerifiedIcon}
          alt="otp_verified"
        />
        <div
          // className="otp-verified-text slide-left"
          className="otp-verified-text"
        >
          <Text type="bold">OTP Verified!</Text>
        </div>
      </div>
    </div>
  );
}

export default ViewThree;
