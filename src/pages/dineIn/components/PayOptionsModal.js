import React, { useRef } from "react";
import BottomDrawer from "../../../components/molecules/BottomDrawer/BottomDrawer";
import styled from "styled-components";
import Text from "../../../components/atoms/Text";
import CloseIconImg from "../../../assets/CancelBlack.svg";
import { Radio } from "@mui/material";

const PayOptionsModal = ({
  isDrawerOpen,
  setIsDrawerOpen,
  paymentSelections,
  selectedPaymentOption,
  setSelectedPaymentOption,
  onPaymentSelection,
}) => {
  const sheetRef = useRef();

  const closeModal = () => {
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    setIsDrawerOpen(false);
  };

  const onPaymentClick = (paymentOption) => {
    setSelectedPaymentOption(paymentOption);
    onPaymentSelection(paymentOption);
    closeModal();
  };

  return (
    <BottomDrawer
      sheetRef={sheetRef}
      isOpen={isDrawerOpen}
      setIsOpen={setIsDrawerOpen}
      drawerHeight="350px"
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
      <MainWrapper>
        <CloseIcon
          src={CloseIconImg}
          onClick={() => {
            closeModal();
          }}
        />
        <ContentWrapper>
          <Text
            type="bold"
            style={{
              fontSize: "18px",
            }}
          >
            Select Payment
          </Text>
          <Text
            style={{
              fontSize: "14px",
            }}
          >
            You can not change once you select Pay mode
          </Text>
          <Divider></Divider>
          {paymentSelections.map((paymentOption, index) => (
            <PaymentSelectionItem
              key={index}
              paymentOption={paymentOption}
              selected={paymentOption?.title === selectedPaymentOption?.title}
              onPaymentSelection={onPaymentClick}
            />
          ))}
        </ContentWrapper>
      </MainWrapper>
    </BottomDrawer>
  );
};

const PaymentSelectionItem = ({ paymentOption, selected, onPaymentSelection }) => {
  return (
    <PaymentSelectionItemWrapper
      onClick={() => {
        onPaymentSelection(paymentOption);
      }}
    >
      <Radio
        style={{
          width: "16px",
          height: "16px",
          transform: "scale(0.8888)",
        }}
        sx={{
          "&.Mui-checked": {
            color: "#037B79",
          },
        }}
        checked={selected}
      />
      <Text
        type="semi-bold"
        style={{
          fontSize: "14px",
        }}
      >
        {paymentOption?.title}
      </Text>
    </PaymentSelectionItemWrapper>
  );
};

const MainWrapper = styled.div`
  padding: 24px;
`;

const CloseIcon = styled.img`
  margin: 15px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
`;

const ContentWrapper = styled.div``;

const Divider = styled.div`
  height: 2px;
  background-color: #c4e6e6;
  margin-top: 24px;
  margin-bottom: 24px;
`;

const PaymentSelectionItemWrapper = styled.div`
  border: 1px solid #dcdcdc;
  display: flex;
  padding: 24px;
  border-radius: 8px;
  gap: 16px;
  margin-bottom: 16px;
`;

export default PayOptionsModal;
