import React, { useState, useEffect, useRef, useContext } from "react";
import { isDesktop } from "react-device-detect";
import styled from "styled-components";
import Cross from "../../../components/molecules/BottomDrawer/assets/cross.svg";
import BottomDrawer from "../../../components/molecules/BottomDrawer/BottomDrawer";
import CustomModal from "../../../containers/customModal/customModal";
import Text from "../../../components/atoms/Text";
import { CartContext } from "../../../context/cartContext";
import Loader from "../../../components/atoms/loader";
import { device } from "../../../commons/util/helperFunctions";

function ItemNotesPrompt(props) {
  const ClientCart = useContext(CartContext);
  const sheetRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    setCartItems(ClientCart.getItems());
    const cart = JSON.parse(JSON.stringify(ClientCart.getItems()));
    let obj = {};
    cart.forEach((x) => {
      obj[x.itemId] = {
        notes: x?.deliveryOptions?.kitchenNotes || "",
      };
    });
    setNotes(obj);
    setIsLoading(false);
  }, []);

  const handleNotes = (id, value) => {
    let obj = JSON.parse(JSON.stringify(notes));
    obj[id].notes = value;
    setNotes(obj);
  };

  const handleClearClick = () => {
    const cart = JSON.parse(JSON.stringify(ClientCart.getItems()));
    let obj = {};
    cart.forEach((x) => {
      obj[x.itemId] = {
        notes: "",
      };
    });
    setNotes(obj);
    props.setItemNotes({});
  };

  const handleSave = () => {
    props.setItemNotes(notes);
    ClientCart.updateItemNotes(notes, props.skipSaveCart);
    if (props.reRender) {
      props.isReRender();
    }
    closeModal();
  };

  const closeModal = () => {
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    try {
      props.setIsDrawerOpen(false);
    } catch (e) {}
  };

  const renderContent = () => {
    return (
      <Wrapper>
        <FormContainer>
          <Title>
            <Text type="bold">Add Notes</Text>
          </Title>
          <FormWrapper>
            {cartItems?.map((item, index) => (
              <ItemContainer key={index}>
                <SubTitle>
                  <Text type="semi-bold">{item?.itemName || ""}</Text>
                </SubTitle>
                <Textarea
                  value={notes[item?.itemId]?.notes || ""}
                  onChange={(e) => handleNotes(item?.itemId, e.target.value)}
                  placeholder={"Add Notes"}
                />
              </ItemContainer>
            ))}
          </FormWrapper>
        </FormContainer>
        <FooterWrapper>
          <ClearButtonWrapper
            onClick={() => {
              handleClearClick();
            }}
          >
            <Text type="bold">Clear</Text>
          </ClearButtonWrapper>
          <SaveButtonWrapper
            onClick={() => {
              handleSave();
            }}
          >
            <Text type="bold">Save</Text>
          </SaveButtonWrapper>
        </FooterWrapper>
      </Wrapper>
    );
  };

  if (isDesktop) {
    return (
      <CustomModal isOpen={props.isDrawerOpen} boxStyle={{ maxWidth: "570px" }}>
        <ModalContainer>
          <ModalCloseIconContainer>
            <CloseIcon alt="close" src={Cross} onClick={(e) => closeModal()} />
          </ModalCloseIconContainer>
          {isLoading ? (
            <Loader />
          ) : (
            <ModalContentContainer>{renderContent()}</ModalContentContainer>
          )}
        </ModalContainer>
      </CustomModal>
    );
  } else {
    return (
      <BottomDrawer
        sheetRef={sheetRef}
        isOpen={props.isDrawerOpen}
        setIsOpen={props.setIsDrawerOpen}
        drawerHeight="415px"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag
        handleClose={closeModal}
      >
        <DrawerContainer>
          {isLoading ? (
            <Loader />
          ) : (
            <DrawerContentContainer>{renderContent()}</DrawerContentContainer>
          )}
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
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;
const Title = styled.div`
  color: #273135;
  font-size: 21px;
  font-weight: 800;
  line-height: normal;
`;
const SubTitle = styled.div`
  color: #273135;
  font-size: 16px;
  line-height: normal;
`;
const FormContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }

  @media ${device.laptop} {
    -ms-overflow-style: none;
    scrollbar-width: none;
    height: 350px;
    max-height: 350px;
    padding-bottom: 100px;
  }
`;
const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  gap: 16px;
`;
const ItemContainer = styled.div`
  width: 100%;
`;
const Textarea = styled.textarea`
  padding-top: 10px;
  padding-left: 10px;
  margin-top: 5px;
  display: flex;
  width: 100%;
  height: 40px;
  font-size: 14px;
  text-align: start;
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  text-transform: none;
  background-color: #fff;
  outline: none;
`;
const FooterWrapper = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  gap: 24px;
  background-color: #fff;
`;
const ClearButtonWrapper = styled.div`
  width: 100%;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  border: 1px solid #04adaa;

  color: #04adaa;
  font-size: 16px;
  font-weight: 800;
  line-height: 130%;
  text-align: center;
`;

const SaveButtonWrapper = styled.div`
  width: 100%;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  background: #04adaa;
  box-shadow: 0px 1px 12px 0px rgba(5, 32, 61, 0.05);

  color: #fff;
  font-size: 16px;
  font-weight: 800;
  line-height: 130%;
  text-align: center;
`;

export default ItemNotesPrompt;
