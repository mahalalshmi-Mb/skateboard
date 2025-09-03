import React from "react";
import styled from "styled-components";
import LocateIcon from "../../assets/LocateIcon.svg";
import DropdownIcon from "../../assets/DropDownIcon.svg";
import ArrowLeft from "../../assets/arrowLeft.svg";
import Text from "../../../../components/atoms/Text";
import { getSessionStorage } from "../../../../util/storageUtil";
import Util from "../../../../commons/util/util";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import { colors } from "theme/colors";

const TerminalSectorWrapper = (props) => {
  const { pushHistory } = useCustomNavigation();

  const handleDropdownClick = () => {
    // if (props?.handleClick) {
    //   props?.handleClick();
    // } else {
    //   Util.triggerMoEngageEvent("takeaway_select_location");
    //   if (props.deliveryOption === "collect at store") {
    //     let productsData = getSessionStorage("productsData");
    //     if (productsData.domain) {
    //       pushHistory(`/takeaway-selection?domain=${productsData.domain}`);
    //     }
    //   } else {
    //     pushHistory("/delivery-flight-selection");
    //   }
    // }
    if (props?.handleClick) {
      props?.handleClick();
    } else {
      Util.triggerMoEngageEvent("takeaway_select_location");
      pushHistory("/takeaway-selection");
    }
  };

  return (
    <Wrapper onClick={() => handleDropdownClick()}>
      <LocationWrapper>
        {/* <IconImage src={ArrowLeft} /> */}
        <TextWrapper>
          <IconImage src={LocateIcon} />
          <Text type="bold">
            {props?.terminal === "All" ? "All Terminals" : props?.terminal}
          </Text>
        </TextWrapper>
      </LocationWrapper>
      {/* <DropdownIconImage src={DropdownIcon} /> */}
    </Wrapper>
  );
};

const IconImage = styled.img``;
const TextWrapper = styled.div`
  font-size: 16px;
  color: ${colors?.text?.actionTextColor};
  line-height: 19px;
  font-weight: 700;
  text-transform: capitalize;
  display: flex;
  flex-direction: row;
  gap: 4px;
`;
const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

const LocationWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${colors?.secondaryLightForeground};
  justify-content: space-between;
  padding: 16px 24px;
  width: fit-content;
  border: 1px solid ${colors?.text?.actionTextColor};
  border-radius: 12px;
`;

const DropdownIconImage = styled.img`
  width: 20px;
  height: 20px;
  transform: rotate(270deg);
`;

export default TerminalSectorWrapper;
