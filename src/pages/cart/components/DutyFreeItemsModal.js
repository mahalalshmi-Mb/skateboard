import React, { useRef } from "react";
import styled from "styled-components";
import BottomDrawer from "../../../components/molecules/BottomDrawer/BottomDrawer";
import Text from "../../../components/atoms/Text";

function DutyFreeItemsModal(props) {
  const closeModal = () => {};
  const sheetRef = useRef();
  return (
    <BottomDrawer
      sheetRef={sheetRef}
      isOpen={props.isDrawerOpen}
      setIsOpen={props.setIsDrawerOpen}
      //   drawerHeight="415px"
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "-24px",
        backgroundColor: "#F4F4F5",
        borderRadius: "8px 8px 0px 0px",
      }}
      snapPoints={[1, 0]}
      initialSnap={0}
      disableDrag
      hideCloseIcon={true}
      handleClose={closeModal}
    >
      <Wrapper>
        <ContentWrapper>
          <TitleText>
            <Text type="bold">Buy dutyfree items</Text>
          </TitleText>
          <SubTitleText>
            <Text>
              Unfortunately, dutyfree items cannot be combined with any other
              items
            </Text>
          </SubTitleText>
          <PrimaryButton onClick={props.handlePrimaryButton}>
            <TitleText>Remove non-dutyfree item(s)</TitleText>
          </PrimaryButton>
          <SecondaryButton onClick={props.handleSecondaryButton}>
            <TitleText>Remove dutyfree item(s)</TitleText>
          </SecondaryButton>
        </ContentWrapper>
      </Wrapper>
    </BottomDrawer>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ContentWrapper = styled.div`
  width: 100%;
  padding: 24px;
`;

const TitleText = styled.div`
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
`;
const SubTitleText = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`;
const PrimaryButton = styled.button`
  width: 100%;
  height: 45px;
  border-radius: 60px;
  border: none;
  background-color: #04adaa;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;
const SecondaryButton = styled.button`
  width: 100%;
  border: none;
  background-color: transparent;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #04adaa;
`;

export default DutyFreeItemsModal;
