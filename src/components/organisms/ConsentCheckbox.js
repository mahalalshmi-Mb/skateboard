import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { device } from "../../commons/util/helperFunctions";
import { setSessionStorage } from "../../util/storageUtil";
import Text from "../atoms/Text";
import CustomCheckbox from "../atoms/customCheckbox";
import useCustomNavigation from "../../hooks/useCustomNavigation";
const ConsentCheckBox = (props) => {
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();

  const navigateToTerms = () => {
    setSessionStorage("temp-signup", {
      firstName: props.firstName || "",
      number: props.number || "",
    });

    pushHistory("/travellers/terms-of-use");
  };
  return (
    <ConsentCheckBoxContainer style={props.containerStyle}>
      <CustomCheckbox
        checked={props.isChecked}
        handleChange={(e) => {
          props.setIsChecked && props.setIsChecked(e.target.checked);
        }}
        ariaLabel={"Terms & Conditions"}
      />
      <EnrollTextWrapper>
        <Text type="semi-bold">
          <span>I have read and accept the </span>
          <span
            style={{
              fontWeight: 600,
              fontFamily: "ManropeSemiBold",
              color: "#0A6B71",
            }}
            onClick={() => navigateToTerms()}
          >
            Terms & Conditions{" "}
          </span>
        </Text>
      </EnrollTextWrapper>
    </ConsentCheckBoxContainer>
  );
};

const ConsentCheckBoxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 20px;
  text-align: left;

  @media ${device.tablet} {
    align-items: center;
  }
`;

const EnrollTextWrapper = styled.div`
  color: #273135;
  font-family: Manrope;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;

  @media ${device.laptop} {
    font-size: 16px;
  }
`;

export default ConsentCheckBox;
