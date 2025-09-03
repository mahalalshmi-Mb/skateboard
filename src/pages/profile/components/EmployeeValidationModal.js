import React, { useEffect, useContext, useRef, useState } from "react";
import styled from "styled-components";
import Cross from "../../../components/molecules/BottomDrawer/assets/cross.svg";
import BottomDrawer from "../../../components/molecules/BottomDrawer/BottomDrawer";
import Text from "../../../components/atoms/Text";
import { device, isDesktopDevice } from "../../../commons/util/helperFunctions";
import { PrimaryButton } from "../../../theme/globalStyleSheet";
import { NavContext } from "../../../context/navContext";
import CustomModal from "containers/customModal/customModal";
import { colors } from "theme/colors";
import Input from "components/organisms/QuickSignInDrawer/SubComponents/CustomInput";

const EmployeeValidationModal = (props) => {
  const useNav = useContext(NavContext);
  const sheetRef = useRef();
  const [empCode, setEmpCode] = useState("");

  const closeModal = () => {
    document.body.style.overflow = "auto";
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    props.setIsDrawerOpen(false);
  };

  useEffect(() => {
    useNav.hideAllNavs();

    return () => {
      if (props.isDineIn) {
        useNav.setShowDineInBottomTab(true);
        useNav.hideAllNavs();
      } else {
        useNav.setShowHeaderNav(true);
        useNav.setShowBottomNav(true);
        useNav.setShowFeedback(true);
        useNav.setShowFooter(false);

        if (props.reRender) {
          props.isReRender();
        }
      }
    };
  }, []);

  const handleSubmit = () => {
    if (props?.showRemoveValidationModal) {
      props?.removeHandler();
    } else {
      props?.successHandler(empCode);
    }
    closeModal();
  };

  const renderContent = () => {
    return (
      <Wrapper>
        {props?.showRemoveValidationModal ? (
          <ContentContainer>
            <CloseIconContainer>
              <CloseIcon src={Cross} onClick={closeModal} />
            </CloseIconContainer>
            <Title>
              <Text type="extra-bold">Unenroll as employee</Text>
            </Title>
            <SubTitle>
                <Text type="bold" style={{ opacity: "0.7"}}>Are you sure you want to unenroll as an employee?</Text>
              </SubTitle>
          </ContentContainer>
        ) : (
          <>
            <ContentContainer>
              <CloseIconContainer>
                <CloseIcon src={Cross} onClick={closeModal} />
              </CloseIconContainer>
              <Title>
                <Text type="extra-bold">Enroll as employee</Text>
              </Title>
              <SubTitle>
                <Text type="semi-bold">Enter your employee code</Text>
              </SubTitle>
              <EmployeeCodeInputContainer>
                <Input
                  style={{
                    height: "54px",
                    borderRadius: "8px",
                    paddingLeft: "16px",
                    fontSize: "16px",
                    fontWeight: "300",
                    fontFamily: colors?.font?.primary,
                    backgroundColor: colors?.text?.gray600,
                    border: `1px solid ${colors?.text?.gray600}`,
                  }}
                  placeholder="Employee Code"
                  value={empCode}
                  onChange={(e) => setEmpCode(e?.target?.value)}
                  autoComplete="on"
                />
              </EmployeeCodeInputContainer>
            </ContentContainer>
          </>
        )}
        <FooterButtonContainer isShowRemoveModal={props?.showRemoveValidationModal}>
          <CancelButton onClick={closeModal}>
            <Text type="extra-bold">Cancel</Text>
          </CancelButton>
          <SuccessButton
            disabled={
              props?.showRemoveValidationModal
                ? false
                : empCode === ""
                ? true
                : false
            }
            onClick={() => handleSubmit()}
          >
            <Text type="extra-bold">Confirm</Text>
          </SuccessButton>
        </FooterButtonContainer>
      </Wrapper>
    );
  };

  if (isDesktopDevice()) {
    return (
      <CustomModal
        isOpen={props.isDrawerOpen}
        boxStyle={{ maxWidth: "570px" }}
        modalStyle={{ zIndex: 999999 }}
      >
        <ModalContainer>
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
          backgroundColor: "#fff",
          borderRadius: "8px 8px 0px 0px",
        }}
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag
        hideHeader={true}
        handleClose={closeModal}
      >
        <DrawerContainer>
          <DrawerContentContainer>{renderContent()}</DrawerContentContainer>
        </DrawerContainer>
      </BottomDrawer>
    );
  }
};

const DrawerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const DrawerContentContainer = styled.div`
  width: 100%;
  padding: 21px 24px 24px 24px;
  height: calc(100% - 40px - 53px - 20px);
`;
const Wrapper = styled.div`
  width: 100%;
`;
const ContentContainer = styled.div`
  width: 100%;
  position: relative;
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
const CloseIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;
const CloseIconContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
`;
const Title = styled.div`
  max-width: 90%;
  font-size: 21px;
  line-height: 28px;
  color: ${colors?.text?.black200};
`;
const SubTitle = styled.div`
  font-size: 16px;
  line-height: 21px;
  color: ${colors?.text?.black200};
  padding-top: 12px;
  opacity: 0.6;
`;
const EmployeeCodeInputContainer = styled.div`
  width: 100%;
  margin-top: 16px;
`;
const FooterButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
  background-color: #fff;
  gap: 24px;

  @media ${device.laptop} {
    justify-content: center;
  }
`;
export const SuccessButton = styled(PrimaryButton)`
  width: 50%;
  font-size: 16px;
  line-height: 21px;
  color: ${colors?.button?.primaryText};

  @media ${device.laptop} {
    padding: 13px 65px;
    width: fit-content;
  }
`;
export const CancelButton = styled.button`
  width: 50%;
  padding: 13px 0px;
  border-radius: 100px;
  border: 1px solid ${`${colors?.primary}`};
  background-color: #fff;

  font-size: 16px;
  line-height: 21px;
  color: ${colors?.text?.actionTextColor};

  @media ${device.laptop} {
    padding: 13px 65px;
    width: fit-content;
  }
`;
export const PhoneNumberContainer = styled.div`
  width: 100%;
  padding-top: 24px;
`;

export default EmployeeValidationModal;
