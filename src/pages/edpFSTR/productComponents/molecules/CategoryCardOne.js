import React, { useState } from "react";
import styled from "styled-components";
import CircularImage from "../atoms/CircularImage";
import Text from "../../../../components/atoms/Text";
import LoadingSkeleton from "../atoms/LoadingSkeleton";
import DisclaimerPrompt from "../organisms/DisclaimerPrompt";
import { getSessionStorage } from "../../../../util/storageUtil";
import { colors } from "theme/colors";

function CategoryCardOne(props) {
  const [showAgeVerificationPrompt, setShowAgeVerificationPrompt] =
    useState(false);

  const handleCardClick = () => {
    if (props.ageVerificationReq && !getSessionStorage("isAgeDeclared")) {
      setShowAgeVerificationPrompt(true);
    } else {
      if (props.handleAction) {
        if (props.item) {
          props.handleAction(props.item);
        } else {
          props.handleAction();
        }
      }
    }
  };
  return (
    <>
      <Wrapper onClick={() => handleCardClick()}>
        <CircularImage image={props.image} />
        <CardTitleWrapper>
          {props.title ? (
            <Text type="semi-bold">{props.title}</Text>
          ) : (
            <LoadingSkeleton variant="text" sx={{ fontSize: "14px" }} />
          )}
        </CardTitleWrapper>
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

const Wrapper = styled.div``;
const CardTitleWrapper = styled.div`
  text-align: center;
  padding-top: 12px;
  color: ${colors?.text?.black200};
  font-size: 13px;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 1.3px;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-transform: uppercase;
  max-width: 92px;
`;

export default CategoryCardOne;
