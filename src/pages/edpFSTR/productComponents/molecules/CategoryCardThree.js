import React, { useState } from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import DisclaimerPrompt from "../organisms/DisclaimerPrompt";
import { getSessionStorage } from "../../../../util/storageUtil";
import TealGradient from "../../assets/Teal-Gradient.png";
import PinkGradient from "../../assets/Pink-Gradient.png";

function CategoryCardThree(props) {
  const [showAgeVerificationPrompt, setShowAgeVerificationPrompt] =
    useState(false);

  const handleCardClick = () => {
    if (props.ageVerificationReq && !getSessionStorage("isAgeDeclared")) {
      setShowAgeVerificationPrompt(true);
    } else {
      if (props.handleAction) {
        props.handleAction();
      }
    }
  };
  return (
    <>
      <Wrapper
        style={{
          ...props.wrapperStyle,
          ...(props.index % 2 === 0
            ? { backgroundColor: "#E98E8D" }
            : { backgroundColor: "#73A1A1" }),
        }}
        onClick={() => handleCardClick()}
      >
        <GradientImage
          src={props.index % 2 === 0 ? PinkGradient : TealGradient}
          style={props.gradientImageStyle}
        />
        <Image src={props.image} style={props.imageStyle} />
        <Title style={props.textStyle}>
          <Text type="bold">{props.title}</Text>
        </Title>
      </Wrapper>
      {showAgeVerificationPrompt && (
        <DisclaimerPrompt
          isDrawerOpen={showAgeVerificationPrompt}
          setIsDrawerOpen={setShowAgeVerificationPrompt}
          successHandler={props.handleAction}
        ></DisclaimerPrompt>
      )}
    </>
  );
}

const Wrapper = styled.div`
  width: 180px;
  min-width: 180px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: #f6e0b5;
  margin-top: 24px;
  position: relative;
`;
const GradientImage = styled.img``;
const Image = styled.img`
  height: 166px;
  max-height: 166px;
  position: absolute;
  margin-top: -85px;
`;
const Title = styled.div`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  position: absolute;
  bottom: 8px;
  text-align: center;
  padding: 0px 36px;
`;

export default CategoryCardThree;
