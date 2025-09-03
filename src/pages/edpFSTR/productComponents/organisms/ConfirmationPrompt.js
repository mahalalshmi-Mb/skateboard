import React, { useRef } from "react";
import BottomDrawer from "../../../../components/molecules/BottomDrawer/BottomDrawer";
import styled from "styled-components";
import CancelBlack from "../../assets/CancelBlack.svg";
import Text from "../../../../components/atoms/Text";
import { colors } from "theme/colors";
import { isDesktop } from "react-device-detect";
import CustomModal from "containers/customModal/customModal";

const ConfirmationPrompt = ({
  isDrawerOpen,
  setIsDrawerOpen,
  clearAndProceed,
}) => {
  const sheetRef = useRef();

  const closeModal = () => {
    document.body.style.overflow = "auto";
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
  };

  const handleSubmit = () => {
    clearAndProceed();
    closeModal();
  };

  const renderContent = () => {
    return (
      <Wrapper>
        <ContentWrapper>
          <CancelImageButton onClick={() => closeModal()} src={CancelBlack} />
          <TitleTextWrapper>
            <Text type="bold">Are you sure you want to continue?</Text>
          </TitleTextWrapper>
          <DescriptionTextWrapper>
            <Text>
              You currently have items in your cart. To proceed, please either
              complete the payment or remove the items from your cart.
            </Text>
          </DescriptionTextWrapper>
        </ContentWrapper>
        <FooterWrapper>
          <FailureButton onClick={() => closeModal()}>
            <Text type="extra-bold">No</Text>
          </FailureButton>
          <SuccessButton onClick={() => handleSubmit()}>
            <Text type="extra-bold">Yes</Text>
          </SuccessButton>
        </FooterWrapper>
      </Wrapper>
    );
  };

  if (isDesktop) {
    return (
      <CustomModal
        isOpen={isDrawerOpen}
        boxStyle={{
          maxWidth: "570px",
          backgroundColor: "#F4F5F5",
          maxHeight: "500px",
        }}
      >
        <ModalContainer>
          <ModalContentContainer>{renderContent()}</ModalContentContainer>
        </ModalContainer>
      </CustomModal>
    );
  }
  return (
    <BottomDrawer
      sheetRef={sheetRef}
      isOpen={isDrawerOpen}
      setIsOpen={setIsDrawerOpen}
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
      <DrawerContainer>{renderContent()}</DrawerContainer>
    </BottomDrawer>
  );
};

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

const CancelImageButton = styled.img`
  width: 20px;
  height: 20px;

  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
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

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 24px 85px 24px;
  overflow-y: scroll;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }
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
  cursor: pointer;
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
  cursor: pointer;
`;

export default ConfirmationPrompt;
