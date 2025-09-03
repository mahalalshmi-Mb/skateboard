import React from "react";
import OtpInput from "react18-input-otp";
import "./style.css";

const CustomOtpInput = (props) => {
  return (
    <OtpInput
      isInputNum={true}
      className={props.inputContainerClassname || "verify-otp-input"}
      containerStyleObj={props.containerStyleObj}
      placeholder={props.placeholder}
      value={props.value}
      onChange={(otp) => {
        props.setValue(otp);
      }}
      numInputs={4}
      containerStyle="verify-otp-input-container-style"
      inputStyle={{
        width: 70,
        height: 50,
        border: "1px solid #DDDDDD",
        borderRadius: 8,
        ...props.inputStyle,
      }}
    />
  );
};

export default CustomOtpInput;
