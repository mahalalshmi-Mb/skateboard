import React, { useState, useRef, useContext } from "react";
import styled from "styled-components";
import CustomModal from "../../../../containers/customModal/customModal";
import { device } from "commons/util/helperFunctions";
import Text from "components/atoms/Text";
import ButtonWithLoading from "components/molecules/ButtonWithLoading";
import { colors } from "theme/colors";
import { CartContext } from "context/cartContext";

function MultiStoreCheckModal(props) {
  const ClientCart = useContext(CartContext);
  const sheetRef = useRef();
  const [confirmIsLoading, setIsConfirmLoading] = useState(false);

  const closeModal = (e) => {
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    try {
      e?.stopPropagation();
      props.setIsDrawerOpen(false);
    } catch (e) {}
  };

  const clearCart = () => {
    ClientCart.reset();
    closeModal();
  };

  const renderContent = () => {
    return (
      <Wrapper>
        <ContentText>
          <Text>
            You currently have items from{" "}
            <strong>{props?.multiStoreData?.oldStore || ""}</strong> in your
            cart. We currently supports orders from one restaurant at a time. Do
            you want to clear the cart and start ordering from{" "}
            <strong>{props?.multiStoreData?.newStore || ""}</strong>?
          </Text>
        </ContentText>
        <UserActionContainer>
          <ButtonWithLoading
            isLoading={confirmIsLoading}
            onClick={() => clearCart()}
          >
            <ButtonLabel>
              <Text type="bold">Yes, clear my cart</Text>
            </ButtonLabel>
          </ButtonWithLoading>
          <CancelButton
            isLoading={confirmIsLoading}
            onClick={(e) => closeModal(e)}
          >
            <CancelButtonLabel>
              <Text type="bold">No</Text>
            </CancelButtonLabel>
          </CancelButton>
        </UserActionContainer>
      </Wrapper>
    );
  };

  return (
    <CustomModal isOpen={props.isDrawerOpen} modalStyle={{ zIndex: 999999 }}>
      <ModalContainer>
        <ModalContentContainer>{renderContent()}</ModalContentContainer>
      </ModalContainer>
    </CustomModal>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 30px;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }
`;
const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const ModalContentContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 32px 32px 0px 32px;
`;
const ContentText = styled.div`
  width: 100%;
  color: ${colors.text.black200};
  font-size: 20px;

  @media ${device.laptop} {
    font-size: 22px;
  }
`;
const UserActionContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
  gap: 0px 16px;

  @media ${device.laptop} {
    margin-top: 32px;
  }

  @media ${device.laptop} {
    max-width: 340px;
    margin: 0px auto;
    margin-top: 32px;
  }
`;
const ButtonLabel = styled.div`
  font-size: 14px;
  color: ${colors?.button?.primaryText};

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
const CancelButton = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: transparent;
  font-weight: bold;
  border-radius: 100px;
  cursor: pointer;
  border: 1px solid ${colors.primary};
`;
const CancelButtonLabel = styled.div`
  font-size: 14px;
  color: ${colors.text.black200};

  @media ${device.laptop} {
    font-size: 16px;
  }
`;

export default MultiStoreCheckModal;
