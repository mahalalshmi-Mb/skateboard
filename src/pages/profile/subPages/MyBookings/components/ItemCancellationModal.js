import React, { useState, useEffect, useContext, useRef } from "react";
import { isDesktop, isMobile } from "react-device-detect";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { NavContext } from "../../../../../context/navContext";
import BottomDrawer from "../../../../../components/molecules/BottomDrawer/BottomDrawer";
import Text from "../../../../../components/atoms/Text";
import { Radio } from "@mui/material";
import { CancellationReason } from "../config/config";
import Cross from "../../../../../components/molecules/BottomDrawer/assets/cross.svg";
import config from "../../../../../commons/config";
import callAPI from "../../../../../commons/callAPI";
import PushAlert from "../../../../../components/atoms/pushAlert";
import { colors } from "theme/colors";
import CustomModal from "containers/customModal/customModal";

const ItemCancellationModal = (props) => {
  const history = useHistory();
  const useNav = useContext(NavContext);
  const sheetRef = useRef();
  const [selectedOption, setSelectedOption] = useState({});
  const [reasons, setReasons] = useState(CancellationReason["Others"]);
  const [comment, setComment] = useState("");

  const closeModal = () => {
    document.body.style.overflow = "auto";
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    props.setIsDrawerOpen(false);
  };

  useEffect(() => {
    //configureReasons
    if (props.type && CancellationReason[props.type]) {
      setReasons(CancellationReason[props.type]);
    } else {
      setReasons(CancellationReason["Others"]);
    }

    // document.getElementsByTagName("body")[0].style.overflow = "hidden";
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

  const cancelItem = async () => {
    try {
      const reason =
        selectedOption && selectedOption !== undefined
          ? selectedOption.label === "Others" && comment !== ""
            ? comment
            : selectedOption.label
          : "";
      let reqBody = [];
      let items = [];
      items.push({
        itemKey: props.itemKey,
        itemId: props.itemId,
        itemSKU: props.itemSKU,
        reason: reason,
      });
      reqBody.push({ suborderId: props?.subOrderId, items });
      let apiURL = `${config.api.myOrders.cancelService}/${props?.orderId}`;
      let apiResponse = await callAPI.put(apiURL, reqBody);
      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        PushAlert.success(regResponse.message);
        if (regResponse.metadata?.failedItems?.length > 0) {
          regResponse.metadata.failedItems.forEach((failedItem) => {
            if (failedItem.xhr.message) {
              PushAlert.info(failedItem.xhr.message);
            }
          });
        }
        closeModal();
        history.goBack();
      } else {
        PushAlert.warning(regResponse.message);
        if (regResponse.metadata?.length > 0) {
          regResponse.metadata.forEach((item) => {
            if (item.alerts?.length > 0) {
              item.alerts.forEach((alert) => {
                if (alert.type === "failure") {
                  PushAlert.error(alert.message);
                } else {
                  PushAlert.info(alert.message);
                }
              });
            }
          });
        }
      }
    } catch (err) {
      PushAlert.error("Something went wrong! Please try again later");
      console.log(err);
    }
  };

  const renderContent = () => {
    return (
      <Wrapper>
        <ContentContainer>
          <CloseIconContainer>
            <CloseIcon src={Cross} onClick={closeModal} />
          </CloseIconContainer>
          <Title>
            <Text type="extra-bold">Cancel Order</Text>
          </Title>
          <SubTitle>
            <Text type="semi-bold">Why do you want to cancel your order?</Text>
          </SubTitle>
          <OptionsContainer>
            {reasons &&
              reasons.map((item, index) => (
                <OptionItemWrapper
                  key={index}
                  onClick={() =>
                    setSelectedOption({ value: item.value, label: item.label })
                  }
                >
                  <Radio
                    style={{
                      width: "19px",
                      height: "19px",
                      transform: "scale(0.8888)",
                    }}
                    sx={{
                      "&.Mui-checked": {
                        color: "#037B79",
                      },
                    }}
                    checked={selectedOption?.value === item.value}
                  />
                  <OptionItemText>
                    <Text type="semi-bold">{item.label}</Text>
                  </OptionItemText>
                </OptionItemWrapper>
              ))}
            {selectedOption?.label === "Others" && (
              <CommentsContainer>
                <Textarea
                  maxLength={200}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={"Comment"}
                />
              </CommentsContainer>
            )}
          </OptionsContainer>
        </ContentContainer>
        <CancelButtonContainer>
          <CancelButton onClick={() => cancelItem()}>
            <Text type="extra-bold">Cancel Item</Text>
          </CancelButton>
        </CancelButtonContainer>
      </Wrapper>
    );
  };

  if (isDesktop) {
    return (
      <CustomModal
        isOpen={props.isDrawerOpen}
        boxStyle={{
          maxWidth: "570px",
          backgroundColor: colors?.secondary,
          maxHeight: "500px",
        }}
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
        drawerHeight="100%"
        modalContainerStyle={{ maxHeight: "90%" }}
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors?.secondary,
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
  }
};

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
const Wrapper = styled.div`
  width: 100%;
  padding: 24px 24px 21px 24px;
`;
const ContentContainer = styled.div`
  width: 100%;
  position: relative;
`;
const CloseIconContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;
`;
const CloseIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const Title = styled.div`
  font-size: 21px;
  line-height: 28px;
  color: ${colors?.text?.black200};
`;
const SubTitle = styled.div`
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.01px;
  color: ${colors?.text?.black200};
  padding-top: 12px;
`;
const OptionsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px 0px;
  margin-top: 8px;
  max-height: 390px;
  overflow-y: scroll;
`;
const OptionItemWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 18px;
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  gap: 14px;
`;
const OptionItemText = styled.div`
  font-size: 16px;
  line-height: 21px;
  letter-spacing: 0.01px;
  color: ${colors?.text?.black200};
`;
const CommentsContainer = styled.div`
  width: 100%;
`;
const Textarea = styled.textarea`
  padding-top: 10px;
  padding-left: 10px;
  margin-top: 5px;
  display: flex;
  width: 100%;
  height: 80px;
  font-size: 16px;
  text-align: start;
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  text-transform: none;
  background-color: #fff;
  outline: none;
`;
const CancelButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0px;
`;
const CancelButton = styled.div`
  width: fit-content;
  padding: 13px 32px;
  border-radius: 60px;
  background-color: ${colors?.primary};

  font-size: 16px;
  line-height: 21px;
  color: ${colors?.button?.primaryText};
  cursor: pointer;
`;

export default ItemCancellationModal;
