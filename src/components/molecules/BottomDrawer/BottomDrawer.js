import React, { useEffect } from "react";
// import Sheet from "react-modal-sheet";
import styled from "styled-components";
import Cross from "./assets/cross.svg";
import Text from "../../atoms/Text";
import { H2 } from "../../../theme/globalStyleSheet";

const BottomDrawer = (props) => {
  useEffect(() => {
    if (props.sheetRef.current && props.isOpen) {
      props.sheetRef.current.snapTo = (snapPoint) => {
        if (snapPoint === 1) {
          props.setIsOpen(false);
        }
      };
    }
  }, [props.sheetRef, props.isOpen]);

  useEffect(() => {
    if (props.isOpen && props.onOpenStart) {
      props.onOpenStart();
    }
    if (props.isOpen) {
      if (props.disableDrag) {
        document.body.style.overflow = "hidden";
      }
    } else {
      document.body.style.overflow = "auto";
    }
  }, [props.isOpen]);

  if (!props.isOpen) {
    return null;
  }

  return (
    <Sheet ref={props.sheetRef}>
      <SheetContainer
        background={props?.background}
        style={props?.modalContainerStyle}
      >
        {props.hideHeader ? null : (
          <SheetHeader>
            <Header isTitle={props.title}>
              {props.title && (
                <Title style={props?.headerTextStyle}>
                  <Text type="bold">{props.title || "Drawer"}</Text>
                </Title>
              )}
              {!props.hideCloseIcon && (
                <CloseIcon
                  alt="close"
                  src={props?.closeIcon || Cross}
                  onClick={(e) => props.handleClose && props.handleClose(e)}
                />
              )}
            </Header>
            {props.HeaderChildren}
          </SheetHeader>
        )}
        <SheetContent>
          <DrawerWrapper height={props.drawerHeight} style={props.style}>
            {props.children}
          </DrawerWrapper>
        </SheetContent>
      </SheetContainer>
      {props.isOpen && (
        <SheetBackdrop
          onClick={(e) => {
            (props.handleClose && props.handleClose(e, "backdrop")) ||
              props.setIsOpen(false);
          }}
        />
      )}
    </Sheet>
  );
};

const Sheet = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 9999999;
  visibility: visible;
`;

const SheetContainer = styled.div`
  z-index: 2;
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  background-color: rgb(255, 255, 255);
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px -2px 16px;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  max-height: min(720px, calc(100% - 40px - 34px));
  transform: none;
  transition: height 0.6s ease-in-out; /* Smooth transition */
  background: ${(props) => props.background || "rgb(255, 255, 255)"};
`;

const SheetContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0px;
  position: relative;
`;

const SheetHeader = styled.div``;

const SheetBackdrop = styled.div`
  z-index: 1;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  touch-action: none;
  border: none;
  pointer-events: auto;
  opacity: 1;
`;

const DrawerWrapper = styled.div`
  height: ${(props) => (props.height ? props.height : null)};
`;

const Header = styled.nav`
  display: flex;
  justify-content: ${({ isTitle }) => (isTitle ? "space-between" : "flex-end")};
  margin-top: 24px;
  padding: 0px 24px;
`;

const CloseIcon = styled.img``;

const Title = styled(H2)`
  font-weight: 700;
  font-size: 21px;
  line-height: 27px;
  color: #273135;
`;

export default BottomDrawer;
