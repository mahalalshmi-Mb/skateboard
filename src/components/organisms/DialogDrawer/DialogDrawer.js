import React, { Fragment, useRef } from "react";
import styled from "styled-components";

import Text from "../../atoms/Text";
import {
  PrimaryButton,
  TertiaryButton,
  UnorderedList,
} from "../../../theme/globalStyleSheet";
import BottomDrawer from "../../molecules/BottomDrawer/BottomDrawer";
import { isDesktop } from "react-device-detect";
import CustomModal from "../../../containers/customModal/customModal";
import Cross from "../../molecules/BottomDrawer/assets/cross.svg";
import { device } from "../../../commons/util/helperFunctions";

const DialogDrawer = (props) => {
  const sheetRef = useRef();

  const handleModalProceed = () => {
    props.callback();
    closeModal();
  };

  const closeModal = () => {
    document.body.style.overflow = "auto";
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    try {
      props.setIsDrawerOpen(false);
    } catch (e) {}
  };

  const renderContent = () => {
    return (
      <Fragment>
        <DrawerContentWrapper>
          <DrawerDataBox>
            <DrawerTitle>
              <Text type="bold">Cart items will be updated 📌</Text>
            </DrawerTitle>
            <DrawerSubTitle>
              <Text type="semi-bold">Are you sure you wish to proceed?</Text>
            </DrawerSubTitle>
            {props.dialogData && props.dialogData.length > 0 ? (
              <Fragment>
                <DashedHorzDivider />
                <ListContainer>
                  {props.dialogData.map((item) => (
                    <ListItem key={item.name}>
                      <ListItemText>
                        <Text type="semi-bold">{item.itemLabel}</Text>
                      </ListItemText>
                    </ListItem>
                  ))}
                </ListContainer>
              </Fragment>
            ) : null}
          </DrawerDataBox>
        </DrawerContentWrapper>
        <DrawerFooterWrapper>
          <TertiaryButton onClick={() => closeModal()}>
            <Text type="bold">Cancel</Text>
          </TertiaryButton>
          <FooterButton onClick={() => handleModalProceed()}>
            <Text type="bold">Confirm</Text>
          </FooterButton>
        </DrawerFooterWrapper>
      </Fragment>
    );
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
        drawerHeight={"auto"}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag
        handleClose={closeModal}
      >
        <DrawerContainer>{renderContent()}</DrawerContainer>
      </BottomDrawer>
    );
  }
};

const FooterButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 40px;
  height: 45px;
  border-radius: 60px;
  background-color: #037b79;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  font-weight: 800;
  font-size: 16px;
  line-height: 21px;
  color: #ffffff;
`;

const DrawerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const DrawerContentWrapper = styled.div`
  width: 100%;
  padding: 0px 24px;
  padding-bottom: 120px;
`;

const DrawerDataBox = styled.div`
  margin-top: 14px;
  width: 100%;
  background-color: #fcf1ee;
  border-radius: 8px;
  padding: 24px;
`;

const DrawerTitle = styled.div`
  font-weight: 700;
  font-size: 21px;
  line-height: 27px;
  color: #273135;
`;

const DrawerSubTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  color: #273135;
  padding-top: 26px;
  padding-bottom: 16px;
`;

const DrawerFooterWrapper = styled.div`
  width: 100%;
  height: 68px;
  padding: 0px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 0px;
  background-color: #ffffff;
  box-shadow: 0px 1px 12px rgba(5, 32, 61, 0.05);

  @media ${device.laptop} {
    padding: 0px 24px;
  }
`;

const DashedHorzDivider = styled.div`
  border-bottom: 2px dashed #f2d3c2;
  border-radius: 1px;
  width: 100%;
`;

const ListContainer = styled(UnorderedList)`
  width: 100%;
  padding-top: 16px;
  padding-bottom: 16px;
`;

const ListItem = styled.li`
  width: 100%;
  display: list-item;
  list-style-type: circle;
  margin-left: 24px;
`;

const ListItemText = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  color: #273135;
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
const ModalCloseIconContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 32px;
`;
const CloseIcon = styled.img`
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

export default DialogDrawer;
