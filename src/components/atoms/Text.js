import React from "react";
import { colors } from "../../theme/colors";
import styled from "styled-components";

const Text = (props) => {
  const getFontWeight = (type) => {
    switch (type) {
      case "light":
        return 300;
      case "regular":
        return 400;
      case "medium":
        return 500;
      case "semi-bold":
        return 600;
      case "bold":
        return 700;
      case "extra-bold":
        return 800;
      default:
        return 300;
    }
  };
  const styles = {
    fontFamily:
      props.variant === "heading"
        ? colors?.font?.secondary
        : colors?.font?.primary,
    fontWeight: getFontWeight(props.type),
    color: colors.text.primary,
  };
  return (
    <CustomText {...props} style={{ ...styles, ...props.style }}>
      {props.children}
    </CustomText>
  );
};

const CustomText = styled.div`
  width: ${({ isEllipsis, width }) => (isEllipsis ? width || "100%" : "auto")};
  white-space: ${({ isEllipsis }) => isEllipsis && "nowrap"};
  overflow: ${({ isEllipsis }) => isEllipsis && "hidden"};
  text-overflow: ${({ isEllipsis }) => isEllipsis && "ellipsis"};
`;

export default Text;
