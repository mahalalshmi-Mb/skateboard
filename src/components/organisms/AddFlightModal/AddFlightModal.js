import React, { Fragment, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import Text from "../../atoms/Text";
import { isMobileDevice } from "../../../commons/util/helperFunctions";
import styled from "styled-components";
import CustomModal from "../../../containers/customModal/customModal";
import Cross from "../../molecules/BottomDrawer/assets/cross.svg";

const AddFlightModal = (props) => {
  const { show, setShow, onHide, onExited, fullscreen, children } = props;
  const [showDesktopFlightListingView, setShowDesktopFlightListingView] =
    useState(false);
  const sheetRef = useRef();

  const closeModal = () => {
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    setShowDesktopFlightListingView(false);
    setShow(false);
    snapTo(1);
    try {
      onHide();
    } catch (e) {}
  };

  const renderChildrenWithProps = () => {
    return React.Children.map(children, (child) =>
      React.isValidElement(child)
        ? React.cloneElement(child, {
            showDesktopFlightListingView,
            setShowDesktopFlightListingView,
            closeModal,
          })
        : child
    );
  };

  return (
    <Fragment>
      {isMobileDevice() ? (
        <Modal
          show={show}
          onHide={onHide}
          onExited={onExited}
          fullscreen={fullscreen || true}
          style={{ zIndex: 99999 }}
        >
          <Modal.Header
            style={{
              fontStyle: "normal",
              fontSize: "21px",
              color: "#273135",
            }}
            closeButton
          >
            <Text type="regular">Add Flight Details</Text>
          </Modal.Header>
          {children}
        </Modal>
      ) : (
        <CustomModal
          isOpen={show}
          boxStyle={{
            maxWidth: showDesktopFlightListingView ? "630px" : "840px",
            height: showDesktopFlightListingView ? "auto" : "auto",
            minHeight: showDesktopFlightListingView ? "640px" : null,
            maxHeight: showDesktopFlightListingView ? "auto" : null,
            overflow: "visible",
          }}
        >
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>
                {showDesktopFlightListingView
                  ? "Choose your flight"
                  : "Add Flight Details"}
              </ModalTitle>
              <ModalCloseIconContainer>
                <CloseIcon
                  alt="close"
                  src={Cross}
                  onClick={(e) => closeModal()}
                />
              </ModalCloseIconContainer>
            </ModalHeader>
            <ModalContentContainer>
              {renderChildrenWithProps()}
            </ModalContentContainer>
          </ModalContainer>
        </CustomModal>
      )}
    </Fragment>
  );
};

const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ModalTitle = styled(Text)`
  font-size: 24px;
  font-weight: 600;
  line-height: 32.78px;
  text-align: left;
`;
const ModalContentContainer = styled.div``;
const ModalCloseIconContainer = styled.div`
  z-index: 9999;
`;
const CloseIcon = styled.img`
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

export default AddFlightModal;
