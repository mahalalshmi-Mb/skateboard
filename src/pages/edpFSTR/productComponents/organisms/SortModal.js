import React, { useState, useRef } from "react";
import styled from "styled-components";
import BottomDrawer from "../../../../components/molecules/BottomDrawer/BottomDrawer";
import Loader from "../../../../components/atoms/loader";
import Text from "../../../../components/atoms/Text";

import CancelBlack from "../../assets/CancelBlack.svg";
import RadioButton from "../../../../components/atoms/RadioButton";

function SortModal(props) {
  const sheetRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

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
        maxHeight: "600px",
      }}
      snapPoints={[1, 0]}
      initialSnap={0}
      disableDrag
      hideHeader={true}
      hideCloseIcon={true}
      handleClose={closeModal}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Wrapper>
          <ContentWrapper>
            <CancelButtonWrapper>
              <CancelImageButton
                onClick={() => props.setIsDrawerOpen(false)}
                src={CancelBlack}
              />
            </CancelButtonWrapper>
            <TitleText style={props.titleTextStyle}>
              <Text type="bold">Sort</Text>
            </TitleText>
            <SortOptionsContainer>
              {props?.data?.map((item, index) => (
                <>
                  <SortItemWrapper
                    key={index}
                    onClick={() => {
                      console.log(item.sortKey);
                      props.handleSortSelection(item.sortKey);
                    }}
                  >
                    <SortItemText>
                      <Text type="semi-bold">{item.label}</Text>
                    </SortItemText>
                    <RadioButton checked={props.sortValue === item.sortKey} />
                  </SortItemWrapper>
                  {index !== props?.data?.length - 1 && (
                    <HorizontalLineDivider />
                  )}
                </>
              ))}
            </SortOptionsContainer>
          </ContentWrapper>
        </Wrapper>
      )}
    </BottomDrawer>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 8px 8px 0px 0px;
  background-color: #fff;
`;
const ContentWrapper = styled.div`
  width: 100%;
  padding: 44px 15px 40px 15px;
  overflow-y: scroll;
`;
const CancelButtonWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 14px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CancelImageButton = styled.img`
  width: 20px;
  height: 20px;
`;
const TitleText = styled.div`
  color: #273135;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
`;
const SortOptionsContainer = styled.div`
  width: 100%;
  padding-top: 24px;
`;
const SortItemWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SortItemText = styled.div`
  color: #273135;
  font-size: 16px;
  font-weight: 600;
  line-height: 21px;
`;
const HorizontalLineDivider = styled.div`
  width: 100%;
  height: 1px;
  opacity: 0.6;
  background: #dcdcdc;
  margin: 15px 0px;
`;

export default SortModal;
