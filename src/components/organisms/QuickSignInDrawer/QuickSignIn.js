import React, { useState, useEffect, useRef } from "react";
import { isDesktop } from "react-device-detect";
import styled from "styled-components";
import BottomDrawer from "../../molecules/BottomDrawer/BottomDrawer";
import ViewOne from "./SubComponents/ViewOne/ViewOne";
import ViewTwo from "./SubComponents/ViewTwo/ViewTwo";
import ViewThree from "./SubComponents/ViewThree/ViewThree";
import ViewSignUp from "./SubComponents/ViewSignUp/ViewSignUp";
import CustomModal from "../../../containers/customModal/customModal";
import Cross from "../../molecules/BottomDrawer/assets/cross.svg";

function QuickSignIn(props) {
  const sheetRef = useRef();
  const [viewIndex, setViewIndex] = useState(0);
  const [countryCode, setCountryCode] = useState("");
  const [phNumber, setPhNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pseudoUserId, setPseudoUserId] = useState("");

  useEffect(() => {
    return () => {
      setViewIndex(0);
    };
  }, []);

  const closeModal = () => {
    setViewIndex(0);
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    try {
      props.setIsDrawerOpen(false);
    } catch (e) {}
  };

  const renderContent = () => {
    if (viewIndex === 0) {
      return (
        <ViewOne
          setViewIndex={setViewIndex}
          pseudoUserId={pseudoUserId}
          setPseudoUserId={setPseudoUserId}
          phNumber={phNumber}
          setPhNumber={setPhNumber}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          fullName={fullName}
          setFullName={setFullName}
        />
      );
    } else if (viewIndex === 1) {
      return (
        <ViewTwo
          setViewIndex={setViewIndex}
          pseudoUserId={pseudoUserId}
          setPseudoUserId={setPseudoUserId}
          phNumber={phNumber}
          setPhNumber={setPhNumber}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          source={props.source}
        />
      );
    } else if (viewIndex === 2) {
      return (
        <ViewThree
          setViewIndex={setViewIndex}
          setIsDrawerOpen={props.setIsDrawerOpen}
          successHandler={props.successHandler}
        />
      );
    } else if (viewIndex === 3) {
      return (
        <ViewSignUp
          setViewIndex={setViewIndex}
          pseudoUserId={pseudoUserId}
          setPseudoUserId={setPseudoUserId}
          phNumber={phNumber}
          setPhNumber={setPhNumber}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          hasReferral={props.hasReferral}
        />
      );
    } else {
      return (
        <ViewOne
          setViewIndex={setViewIndex}
          pseudoUserId={pseudoUserId}
          setPseudoUserId={setPseudoUserId}
        />
      );
    }
  };

  if (isDesktop) {
    return (
      <CustomModal isOpen={props.isDrawerOpen} boxStyle={{ maxWidth: "570px" }}>
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
        isOpen={props.isDrawerOpen}
        setIsOpen={props.setIsDrawerOpen}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
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
  padding: 0px 24px;
  height: calc(100% - 40px - 53px - 20px);
`;
const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
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
`;
const CloseIcon = styled.img`
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

export default QuickSignIn;
