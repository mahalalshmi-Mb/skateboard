import React, { useRef } from "react";
import styled from "styled-components";
import BottomDrawer from "../../../components/molecules/BottomDrawer/BottomDrawer";
import Text from "../../../components/atoms/Text";

function RestrictionsPrompt(props) {
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
            <Text type="bold">Oops!</Text>
          </TitleText>
          <SubTitleText>
            {props?.restrictionText?.map((item, index) => (
              <Text key={index}>{item}</Text>
            ))}
          </SubTitleText>
          <PrimaryButton onClick={() => closeModal()}>
            <TitleText>Okay, got it</TitleText>
          </PrimaryButton>
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
  background: linear-gradient(
    180deg,
    rgba(4, 173, 170, 0.1) 28.78%,
    #fff 88.17%
  );
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

export default RestrictionsPrompt;
