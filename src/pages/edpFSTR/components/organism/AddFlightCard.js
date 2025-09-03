import React from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import IllustrationImage from "../../assets/addFlightIllustration.svg";
import { device } from "../../../../commons/util/helperFunctions";
import BackArrowWhite from "../../../../assets/images/terminalTwo/backArrow.svg";

function AddFlightCard(props) {
  return (
    <Wrapper>
      <TextWrapper>
        <DesktopGoBackWrapper onClick={() => props.handleGoBack()}>
          <BackArrowImg src={BackArrowWhite} />
          <GoBackText>
            <Text>Go Back</Text>
          </GoBackText>
        </DesktopGoBackWrapper>
        <InfoBox>
          <Text type="extra-bold">DEPARTURE PASSENGERS</Text>
        </InfoBox>
        <Title>
          <Text type="semi-bold">Before you place your order</Text>
        </Title>
        <SubTitle>
          <Text>Add a flight so we can deliver to your boarding gate</Text>
        </SubTitle>
      </TextWrapper>
      <AddFlightButtonWrapper>
        <AddFlightButton onClick={() => props.handleAddFlightShow()}>
          <Text type="extra-bold">+ Add Flight</Text>
        </AddFlightButton>
      </AddFlightButtonWrapper>
      <IllustrationWrapper>
        <Illustration src={IllustrationImage} alt="floral-image" />
      </IllustrationWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 24px 32px 24px;
  background: var(
    --grey,
    linear-gradient(139deg, #60678b -35.77%, #1f2131 140.71%)
  );
  position: relative;

  @media ${device.laptop} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 32px 136px 95px 136px;
  }
`;
const TextWrapper = styled.div``;
const DesktopGoBackWrapper = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }
`;
const BackArrowImg = styled.img``;
const GoBackText = styled.div`
  font-size: 16px;
  color: #fff;
`;
export const InfoBox = styled.div`
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  border-radius: 2px;
  background-color: #f8cf46;

  color: #000;
  font-size: 10px;
  letter-spacing: 1px;

  @media ${device.laptop} {
    margin-top: 32px;
  }
`;
export const Title = styled.div`
  color: #fff;
  font-size: 20px;
  line-height: 26px;
  margin-top: 12px;
`;
export const SubTitle = styled.div`
  width: 80%;
  max-width: 80%;
  color: #fff;
  font-size: 16px;
  line-height: 26px;
  margin-top: 8px;
`;
const AddFlightButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;
const AddFlightButton = styled.div`
  background-color: #037b79;
  border: none;
  border-radius: 100px;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 400;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  position: relative;
  width: 220px;
  z-index: 1;

  @media ${device.laptop} {
    width: 268px;
    height: 54px;
    padding: 0px;
  }
`;
const IllustrationWrapper = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
`;
const Illustration = styled.img``;

export default AddFlightCard;
