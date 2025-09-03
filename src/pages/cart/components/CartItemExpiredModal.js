import React, { useRef } from "react";
import styled from "styled-components";
import BottomDrawer from "../../../components/molecules/BottomDrawer/BottomDrawer";
import Text from "../../../components/atoms/Text";

function CartItemExpiredModal(props) {
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
      //   handleClose={closeModal}
    >
      <Wrapper>
        <ContentWrapper>
          <TitleText>
            <Text type="bold">{`${props.expiredItemCount} Item(s) unavailable`}</Text>
          </TitleText>
          <SubTitleText>
            <Text>Sorry! few items are unavailable</Text>
          </SubTitleText>
          <RemoveButton onClick={props.handleSubmit}>
            <TitleText>Remove unavailable item(s)</TitleText>
          </RemoveButton>
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
const RemoveButton = styled.button`
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

export default CartItemExpiredModal;
