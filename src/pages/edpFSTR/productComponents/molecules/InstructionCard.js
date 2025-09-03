import React, { useState } from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import { getSessionStorage } from "../../../../util/storageUtil";
import DisclaimerPrompt from "../organisms/DisclaimerPrompt";

function InstructionCard(props) {
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
      <Wrapper onClick={() => handleCardClick()}>
        <ContentContainer>
          <InstructionNumberContainer>
            <Text type="bold">{props.number}</Text>
          </InstructionNumberContainer>
          <InstructionsWrapper>
            <InstructionsHeader>
              <Text type="semi-bold">{props.title}</Text>
            </InstructionsHeader>
            <InstructionsDesc>
              <Text>{props.description}</Text>
            </InstructionsDesc>
          </InstructionsWrapper>
        </ContentContainer>
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
  display: flex;
  align-items: center;
  min-width: 240px;
  max-width: 240px;
  padding: 12px 16px 12px 4px;
  border-radius: 8px;
  background-color: rgba(231, 242, 243, 0.5);
`;
const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;
const InstructionNumberContainer = styled.div`
  color: rgba(4, 173, 170, 0.5);
  font-size: 74px;
  font-weight: 700;
  line-height: 58px;
  opacity: 0.5;
`;
const InstructionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const InstructionsHeader = styled.div`
  color: #273135;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1.6px;
  text-transform: uppercase;
`;
const InstructionsDesc = styled.div`
  color: #273135;
  font-size: 14px;
  font-weight: 400;
  opacity: 0.7;
`;

export default InstructionCard;
