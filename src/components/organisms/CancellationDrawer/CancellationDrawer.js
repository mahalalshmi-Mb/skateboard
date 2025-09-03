import moment from "util/momentWrapper";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../theme/globalStyleSheet";
import Text from "../../atoms/Text";
import BottomDrawer from "../../molecules/BottomDrawer/BottomDrawer";
import RadioButtonWithLabel from "../../molecules/RadioButtonWithLabel";

const CancellationDrawer = (props) => {
  const sheetRef = useRef();
  const [selectedReason, setSelectedReason] = useState("");

  const closeModal = (e) => {
    document.body.style.overflow = "auto";
    e.stopPropagation();
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
  };

  const handleReasonClick = (data) => {
    setSelectedReason(data);
  };

  const getMessage = () => {
    let startTime = props?.data?.startTimeEta;
    let noRefund = props?.data?.cancellationPolicyDetails?.cancellation?.find(
      (item) => item.refundFlag === "N"
    );
    let yesRefund = props?.data?.cancellationPolicyDetails?.cancellation?.find(
      (item) => item.refundFlag === "Y"
    );
    startTime = moment(startTime).subtract(
      noRefund.endValue,
      noRefund.type.toLowerCase()
    );

    if (moment().isAfter(startTime)) {
      return noRefund.policyDesc;
    } else {
      return yesRefund.policyDesc;
    }
  };

  return (
    <DrawerWrapper>
      <BottomDrawer
        sheetRef={sheetRef}
        isOpen={props.isOpen}
        setIsOpen={props.setIsOpen}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag
        hideCloseIcon={false}
        handleClose={closeModal}
        title={props.title || "Cancel"}
      >
        <Wrapper>
          {props.subDrawerTitle && (
            <SubTitle>
              <Text type="semi-bold">{props.title}</Text>
            </SubTitle>
          )}
          <SubHeader>
            <Text type="semi-bold">{props.subTitle}</Text>
          </SubHeader>
          <ReasonsWrapper>
            {props.reasons.map((item) => (
              <RadioButtonWithLabel
                checked={selectedReason.value === item.value}
                label={item.label}
                key={item.value}
                onClick={handleReasonClick}
                data={item}
              />
            ))}
          </ReasonsWrapper>
          <FooterMessage>
            <Text type="bold">{getMessage()}</Text>
          </FooterMessage>
          <ButtonsWrapper>
            <SecondaryCancelButton
              onClick={(e) => {
                setSelectedReason("");
                closeModal(e);
              }}
            >
              <Text type="bold">
                {props.secondaryBtnText || "Don't Cancel"}
              </Text>
            </SecondaryCancelButton>

            <PrimaryCancelButton
              onClick={(e) => {
                props.handlePrimaryBtnClick(selectedReason);
                closeModal(e);
              }}
            >
              <Text type="bold">{props.primaryBtnText || "Cancel"}</Text>
            </PrimaryCancelButton>
          </ButtonsWrapper>
        </Wrapper>
      </BottomDrawer>
    </DrawerWrapper>
  );
};

const DrawerWrapper = styled.section``;

const Wrapper = styled.section`
  width: 100%;
  padding-bottom: 24px;
`;

const SubTitle = styled.div`
  font-size: 18px;
  line-height: 23px;
  letter-spacing: 0.01em;
  text-align: left;
  margin-top: 10px;
  padding: 0px 24px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  padding: 0px 24px;
  gap: 30px;
`;

const ReasonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  padding: 0px 24px;
  gap: 20px;
`;

const SecondaryCancelButton = styled(SecondaryButton)``;
const PrimaryCancelButton = styled(PrimaryButton)``;

const SubHeader = styled.div`
  font-size: 18px;
  line-height: 23px;
  letter-spacing: 0.01em;
  text-align: left;
  margin-top: 12px;
  padding: 0px 24px;
`;

const FooterMessage = styled.div`
  font-size: 14px;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: left;
  margin-top: 24px;
  padding: 0px 24px;
  opacity: 50%;
`;

export default CancellationDrawer;
