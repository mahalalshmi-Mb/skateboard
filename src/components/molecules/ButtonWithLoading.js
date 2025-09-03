import React from "react";
import { PrimaryButton } from "../../theme/globalStyleSheet";
import ButtonLoader from "../atoms/buttonLoader";
import { colors } from "theme/colors";

const ButtonWithLoading = (props) => {
  return (
    <PrimaryButton disabled={props.disabled} onClick={props.onClick} style={props?.style}>
      {props.isLoading ? <ButtonLoader color={colors?.text?.actionTextColor} /> : props.children}
    </PrimaryButton>
  );
};

export default ButtonWithLoading;
