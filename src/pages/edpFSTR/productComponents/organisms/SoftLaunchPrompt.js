import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import BottomDrawer from "../../../../components/molecules/BottomDrawer/BottomDrawer";
import Loader from "../../../../components/atoms/loader";
import Text from "../../../../components/atoms/Text";
import CancelBlack from "../../assets/CancelBlack.svg";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import { device } from "../../../../commons/util/helperFunctions";
import { colors } from "theme/colors";
import CustomModal from "containers/customModal/customModal";
import { isDesktop } from "react-device-detect";

const defaultData = {
  header: "Welcome to the Beta Version",
  description:
    "This application is currently in beta and intended for internal use only. You may experience occasional glitches.",
  name: "Continue",
};

function SoftLaunchPrompt(props) {
  const sheetRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [displayData, setDisplayData] = useState({});

  useEffect(() => {
    getDisplayData();
  }, []);

  const getDisplayData = () => {
    const data = getSessionStorage("softLaunchData") || props?.data;
    if (data?.softLaunchPromptData) {
      setDisplayData(data.softLaunchPromptData);
    } else {
      setDisplayData(defaultData);
    }
  };

  const closeModal = () => {
    document.body.style.overflow = "auto";
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    try {
      props.setIsDrawerOpen(false);
    } catch (e) {}
  };

  const onSuccess = () => {
    setSessionStorage("hideSoftLaunchPrompt", true);
    closeModal();
    props.successHandler();
  };

  const renderContent = () => {
    return (
      <ContentWrapper>
        <CancelButtonWrapper>
          <CancelImageButton onClick={() => closeModal()} src={CancelBlack} />
        </CancelButtonWrapper>
        <TitleText style={props.titleTextStyle}>
          <Text type="bold">{displayData?.header}</Text>
        </TitleText>
        <SubTitleText style={props.subTitleTextStyle}>
          <Text>{displayData?.description}</Text>
        </SubTitleText>
        <FooterWrapper>
          <SuccessButton style={props.successButtonStyle} onClick={onSuccess}>
            <Text type="extra-bold" style={props.successButtonTextStyle}>
              {displayData?.name}
            </Text>
          </SuccessButton>
        </FooterWrapper>
      </ContentWrapper>
    );
  };

  if (isDesktop) {
    return (
      <CustomModal
        isOpen={props.isDrawerOpen}
        boxStyle={{
          maxWidth: "570px",
          backgroundColor: "#F4F5F5",
        }}
      >
        {isLoading ? (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        ) : (
          <ModalContainer>
            <ModalContentContainer>{renderContent()}</ModalContentContainer>
          </ModalContainer>
        )}
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
          backgroundColor: "#F4F4F5",
          borderRadius: "8px 8px 0px 0px",
          overflow: "scroll",
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
          <DrawerContainer>{renderContent()}</DrawerContainer>
        )}
      </BottomDrawer>
    );
  }
}

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 24px;

  @media ${device.tablet} {
    padding: 40px 48px;
  }
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
  cursor: pointer;
`;
const CancelImageButton = styled.img`
  width: 20px;
  height: 20px;
`;
const TitleText = styled.div`
  color: #273135;
  font-size: 24px;
  font-weight: 700;
  line-height: 23px;
`;
const SubTitleText = styled.div`
  color: #273135;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  margin-top: 8px;
  padding-top: 8px;
`;
const FooterWrapper = styled.div`
  width: 100%;
  height: 77px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;
const SuccessButton = styled.div`
  display: flex;
  height: 47px;
  padding: 16px 32px;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background-color: ${colors?.button?.primaryBackground};

  color: ${colors?.button?.primaryText};
  font-size: 16px;
  font-weight: 800;
  line-height: 21px;
  cursor: pointer;

  @media ${device.mobileS} {
    font-size: 12px;
    line-height: 16px;
  }

  @media ${device.mobileL} {
    font-size: 16px;
    line-height: 21px;
  }
`;
const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const ModalContentContainer = styled.div`
  width: 100%;
  height: 100%;
`;
const DrawerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export default SoftLaunchPrompt;
