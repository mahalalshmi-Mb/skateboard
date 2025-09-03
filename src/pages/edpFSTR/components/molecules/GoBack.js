import React from "react";
import { useHistory } from "react-router-dom";
import { device } from "commons/util/helperFunctions";
import styled from "styled-components";
import Text from "components/atoms/Text";
import { colors } from "theme/colors";
import BackArrowIcon from "../../assets/BackArrow.svg";

function GoBack(props) {
  const history = useHistory();
  const handleGoBack = () => {
    if (props?.onClick) {
      props?.onClick();
    } else {
      history.goBack();
    }
  };
  return (
    <Wrapper
      onClick={() => handleGoBack()}
      mobileHeight={props?.mobileHeight}
      desktopHeight={props?.desktopHeight}
      style={props?.wrapperStyle}
    >
      <BackArrow src={BackArrowIcon} alt="back-arrow" />
      <GoBackText>
        <Text>Back</Text>
      </GoBackText>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: fit-content;
  height: ${({ mobileHeight }) => mobileHeight || "44px"};
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0px 10px;
  border: 1px solid #5d5d5d;
  border-radius: 6px;
  cursor: pointer;

  @media ${device.laptop} {
    height: ${({ desktopHeight }) => desktopHeight || "52px"};
    padding: 0px 20px;
  }
`;
const BackArrow = styled.img`
  width: 16px;
  height: 16px;
`;
const GoBackText = styled.div`
  font-size: 12px;
  color: ${colors?.text?.gray200};

  @media ${device.laptop} {
    font-size: 14px;
  }
`;

export default GoBack;
