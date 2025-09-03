import React, { useRef } from "react";
import BottomDrawer from "../../../../components/molecules/BottomDrawer/BottomDrawer";
import styled from "styled-components";
import CancelBlack from "../../assets/CancelBlack.svg";
import Text from "../../../../components/atoms/Text";
import { colors } from "theme/colors";

const FlightConfirmationPrompt = (props) => {
  const sheetRef = useRef();

  const closeModal = () => {
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
  };

  return (
    <BottomDrawer
      sheetRef={sheetRef}
      isOpen={props.isDrawerOpen}
      setIsOpen={props.setIsDrawerOpen}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F4F4F5",
        borderRadius: "8px 8px 0px 0px",
      }}
      snapPoints={[1, 0]}
      initialSnap={0}
      disableDrag
      hideHeader={true}
      hideCloseIcon={true}
      handleClose={closeModal}
    >
      <Wrapper>
        <ContentWrapper>
          <CancelImageButton
            onClick={() => {
              props.setIsDrawerOpen(false);
            }}
            src={CancelBlack}
          />
          <TitleTextWrapper>
            <Text type="bold">Are you sure you want to continue?</Text>
          </TitleTextWrapper>
          <DescriptionTextWrapper>
            <Text type="semi-bold">
              The flight added does not match with the area selected. We will
              remove your flight, you can add it at a later stage
            </Text>
          </DescriptionTextWrapper>
        </ContentWrapper>
        <FooterWrapper>
          <FailureButton
            onClick={() => {
              props.setIsDrawerOpen(false);
            }}
          >
            <Text type="extra-bold">No</Text>
          </FailureButton>
          <SuccessButton
            onClick={() => {
              props.successHandler();
            }}
          >
            <Text type="extra-bold">Yes</Text>
          </SuccessButton>
        </FooterWrapper>
      </Wrapper>
    </BottomDrawer>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const CancelImageButton = styled.img`
  width: 20px;
  height: 20px;

  position: absolute;
  top: 16px;
  right: 16px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  background: linear-gradient(
    180deg,
    rgba(4, 173, 170, 0.1) 28.78%,
    #fff 88.17%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 24px 85px 24px;
  overflow-y: scroll;
`;

const TitleTextWrapper = styled.div`
  color: ${colors?.text?.black200};
  text-align: center;
  font-family: Manrope;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
`;

const DescriptionTextWrapper = styled.div`
  color: ${colors?.text?.black200};
  text-align: center;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  padding-top: 16px;
`;

const FooterWrapper = styled.div`
  width: 100%;
  height: 79px;
  position: absolute;
  bottom: 0;
  padding: 0px 24px 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const SuccessButton = styled.div`
  display: flex;
  height: 47px;
  width: 100%;
  padding: 16px;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background-color: ${colors?.button?.primaryBackground};

  color: #fff;
  font-size: 16px;
  font-weight: 800;
  line-height: 21px;
`;
const FailureButton = styled.div`
  display: flex;
  height: 47px;
  width: 100%;
  padding: 16px;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  border: 1px solid ${colors?.primary};

  color: ${colors?.primary};
  font-size: 16px;
  font-weight: 800;
  line-height: 21px;
`;

export default FlightConfirmationPrompt;
