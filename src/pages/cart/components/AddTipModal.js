import React, { useState, useEffect, useRef, useContext } from "react";
import { isDesktop } from "react-device-detect";
import styled from "styled-components";
import Cross from "../../../components/molecules/BottomDrawer/assets/cross.svg";
import BottomDrawer from "../../../components/molecules/BottomDrawer/BottomDrawer";
import CustomModal from "../../../containers/customModal/customModal";
import Text from "../../../components/atoms/Text";
import { CartContext } from "../../../context/cartContext";
import Loader from "../../../components/atoms/loader";
import { device, formatPrice } from "../../../commons/util/helperFunctions";
import { colors } from "../../../theme/colors";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../util/storageUtil";

function AddTipModal(props) {
  const ClientCart = useContext(CartContext);
  const sheetRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTip, setSelectedTip] = useState({});
  const [customTipType, setCustomTipType] = useState("");
  const [customTip, setCustomTip] = useState("");
  const [isTipAdded, setIsTipAdded] = useState(false);

  useEffect(() => {
    checkIfTipAdded();
  }, []);

  const checkIfTipAdded = () => {
    let data = getSessionStorage("tipData") || [];
    const tipFound = data?.find((x) => x?.storeId === props?.data?.storeId);
    if (tipFound) {
      setIsTipAdded(true);
      setSelectedTip(tipFound?.tip || {});
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

  const handleTipSelection = (type, value) => {
    let obj = {
      type,
      value: Number(value),
    };
    setSelectedTip(obj);
    setCustomTipType("");
    setCustomTip("");
  };

  const handleCustomTipType = (type) => {
    setCustomTipType(type);
    setCustomTip("");
    setSelectedTip({});
  };

  function checkValue(inp) {
    let refinedValue = handleDecimalsOnValue(inp);
    let obj = {
      type: customTipType,
      value: Number(refinedValue),
    };
    setSelectedTip(obj);
    setCustomTip(refinedValue);
  }

  function handleDecimalsOnValue(value) {
    const regex = /([0-9]*[\.|\,]{0,1}[0-9]{0,2})/s;
    return value.match(regex)[0];
  }

  const handleSubmit = () => {
    let data = getSessionStorage("tipData") || [];
    let obj = {
      storeId: props?.data?.storeId,
      tip: selectedTip,
    };
    let found = data?.find((x) => x?.storeId === props?.data?.storeId);
    if (found) {
      if (Object.keys(selectedTip).length === 0) {
        data = data?.filter((x) => x?.storeId !== props?.data?.storeId);
      } else {
        data.forEach((val) => {
          if (val?.storeId === props?.data?.storeId) {
            val.tip = selectedTip;
          }
        });
      }
    } else {
      data.push(obj);
    }
    setSessionStorage("tipData", data);
    if (props.reRender) {
      props.isReRender();
    }
    closeModal();
  };

  const renderContent = () => {
    return (
      <Wrapper>
        <FormContainer>
          <Title>
            <Text type="bold">Add tip for {props?.data?.storeName}</Text>
          </Title>
          <FormWrapper>
            <TippingOptionsContainer>
              <TippingOptionsWrapper>
                {props?.data?.tip?.map((tip) =>
                  tip?.values?.map((val, index) => (
                    <TippingOptionsCard
                      key={index}
                      onClick={() => handleTipSelection(tip?.type, val?.value)}
                      isSelected={
                        selectedTip?.type === tip?.type &&
                        selectedTip?.value === val?.value
                      }
                    >
                      <Text type="semi-bold">
                        {tip?.type?.toLowerCase() === "percentage"
                          ? `${val?.value}%`
                          : `${formatPrice(val?.value)}`}
                      </Text>
                      {val?.actualValue && val?.value !== val?.actualValue && (
                        <Text type="semi-bold">
                          {formatPrice(val?.actualValue)}
                        </Text>
                      )}
                    </TippingOptionsCard>
                  ))
                )}
                <CustomTippingContainer>
                  {props?.data?.tip?.map((tip, index) => (
                    <CustomTippingCard
                      key={index}
                      isSelected={customTipType === tip?.type}
                      onClick={() => handleCustomTipType(tip?.type)}
                    >
                      <Text>{`Add Custom ${
                        tip?.type?.toLowerCase() === "flat"
                          ? `Amount`
                          : tip?.type
                      }`}</Text>
                    </CustomTippingCard>
                  ))}
                  <CustomTippingCard
                    isSelected={customTipType === "No Tip"}
                    onClick={() => handleCustomTipType("No Tip")}
                  >
                    <Text>No Tip</Text>
                  </CustomTippingCard>
                  {customTipType !== "" && customTipType !== "No Tip" && (
                    <CustomTextField
                      autoFocus={true}
                      placeholder={`Add Custom ${
                        customTipType?.toLowerCase() === "flat"
                          ? `Amount`
                          : customTipType
                      }`}
                      value={customTip}
                      onChange={(e) => checkValue(e?.target?.value)}
                    />
                  )}
                </CustomTippingContainer>
              </TippingOptionsWrapper>
            </TippingOptionsContainer>
          </FormWrapper>
        </FormContainer>
        <FooterWrapper>
          <ClearButtonWrapper onClick={() => closeModal()}>
            <Text type="bold">Cancel</Text>
          </ClearButtonWrapper>
          <SaveButtonWrapper onClick={() => handleSubmit()}>
            <Text type="bold">{isTipAdded ? `Edit Tip` : `Add Tip`}</Text>
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
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;
const TippingOptionsContainer = styled.div`
  width: 100%;
`;
const TippingOptionsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;
const TippingOptionsCard = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px 0px;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #919191;
  background-color: ${({ isSelected }) =>
    isSelected ? colors?.primary : "#ffffff"};
  color: ${({ isSelected }) =>
    isSelected ? "#ffffff" : colors?.text?.primaryText};
  font-size: 14px;
  cursor: pointer;
`;
const CustomTippingContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;
const CustomTippingCard = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #919191;
  background-color: ${({ isSelected }) =>
    isSelected ? colors.primary : "#ffffff"};
  color: ${({ isSelected }) =>
    isSelected ? "#ffffff" : colors?.text?.primaryText};
  font-size: 14px;
  cursor: pointer;
`;
const CustomTextField = styled.input`
  margin-top: 8px;
  display: flex;
  width: 100%;
  height: 45px;
  font-size: 16px;
  text-align: start;
  text-indent: 20px;
  border: 1px solid #919191;
  border-radius: 8px;
  text-transform: none;
  outline: none;
  color: ${colors?.text?.primaryText};
  text-align: center;
`;
const ClearButtonWrapper = styled.div`
  width: 100%;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  border: 1px solid ${colors.primary};

  color: ${colors.primary};
  font-size: 16px;
  font-weight: 800;
  line-height: 130%;
  text-align: center;
  cursor: pointer;
`;

const SaveButtonWrapper = styled.div`
  width: 100%;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  background: ${colors?.button?.primaryBackground};
  box-shadow: 0px 1px 12px 0px rgba(5, 32, 61, 0.05);

  color: #fff;
  font-size: 16px;
  font-weight: 800;
  line-height: 130%;
  text-align: center;
  cursor: pointer;
`;

export default AddTipModal;
