import React, { useState } from "react";
import styled from "styled-components";
import RectangularImage from "../atoms/RectangularImage";
import { getSessionStorage } from "../../../../util/storageUtil";
import DisclaimerPrompt from "../organisms/DisclaimerPrompt";

function CategoryCardTwo(props) {
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
      <Wrapper style={props.style} onClick={() => handleCardClick()}>
        <RectangularImage image={props.image} imageText={props.imageText} />
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
  height: 200px;
  min-width: 180px;
  min-height: 200px;
`;

export default CategoryCardTwo;
