import React from "react";
import ButtonLoader from "./buttonLoader";
import Text from "./Text";
import { PrimaryButton } from "theme/globalStyleSheet";

const ButtonWithLoading = (props) => {
  return (
    <PrimaryButton
      disabled={props.disabled}
      onClick={props.onClick}
      style={props.style}
    >
      {props.isLoading ? (
        <ButtonLoader />
      ) : (
        <Text type="extra-bold">{props.buttonLabel}</Text>
      )}
    </PrimaryButton>
  );
};

export default ButtonWithLoading;
