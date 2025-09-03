import React, { useState, useRef } from "react";
import { isDesktop } from "react-device-detect";
import styled from "styled-components";
import BottomDrawer from "components/molecules/BottomDrawer/BottomDrawer";
import CustomModal from "containers/customModal/customModal";
import Cross from "components/molecules/BottomDrawer/assets/cross.svg";
import CouponListing from "./CouponListing";

function CouponModal(props) {
  const sheetRef = useRef();
  const [viewIndex, setViewIndex] = useState(0);

  const closeModal = () => {
    document.body.style.overflow = "auto";
    setViewIndex(0);
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    try {
      props.setShowCoupon(false);
    } catch (e) {}
  };

  const renderContent = () => {
    return (
      <CouponListing
        setShowCoupon={props?.setShowCoupon}
        setShowAppliedCouponModal={props?.setShowAppliedCouponModal}
        appliedCouponObj={props?.appliedCouponObj}
        setAppliedCouponObj={props?.setAppliedCouponObj}
        isReRender={props?.isReRender}
        reRender={props?.reRender}
      />
    );
  };

  if (isDesktop) {
    return (
      <CustomModal
        isOpen={props.showCoupon}
        boxStyle={{ maxWidth: "570px", maxHeight: "90%" }}
      >
        <ModalContainer>
          <ModalCloseIconContainer>
            <CloseIcon alt="close" src={Cross} onClick={(e) => closeModal()} />
          </ModalCloseIconContainer>
          <ModalContentContainer>{renderContent()}</ModalContentContainer>
        </ModalContainer>
      </CustomModal>
    );
  } else {
    return (
      <BottomDrawer
        sheetRef={sheetRef}
        isOpen={props.showCoupon}
        setIsOpen={props.setShowCoupon}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        background="linear-gradient(180deg, rgba(4, 173, 170, 0.18) 0%, rgba(4, 173, 170, 0) 100%), rgb(255, 255, 255)"
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag
        handleClose={closeModal}
        hideCloseIcon={viewIndex === 2}
      >
        <DrawerContainer>
          <DrawerContentContainer>{renderContent()}</DrawerContentContainer>
        </DrawerContainer>
      </BottomDrawer>
    );
  }
}

const DrawerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const DrawerContentContainer = styled.div`
  width: 100%;
  height: calc(100% - 40px - 53px - 20px);
`;
const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(
    180deg,
    rgba(4, 173, 170, 0.18) 0%,
    rgba(4, 173, 170, 0) 100%
  );
  border-radius: 18px;
`;
const ModalContentContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 32px;
`;
const ModalCloseIconContainer = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  cursor: pointer;
  z-index: 9;
`;
const CloseIcon = styled.img`
  width: 32px;
  height: 32px;
`;

export default CouponModal;
