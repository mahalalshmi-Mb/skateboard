import React from "react";
import Text from "../../../../components/atoms/Text";
import styled from "styled-components";
import ProductFallbackImg from "../../assets/Fallback Images/product-fallback-small.svg";
import { colors } from "theme/colors";

const StoreCard = (props) => {
  return (
    <Wrapper onClick={props?.onClick} selected={props?.selected}>
      {/* <StoreImageWrapper
        src={props?.storeCard?.shopBrandImageUrl || ""}
        onError={(e) => {
          e.target.src = ProductFallbackImg;
        }}
      /> */}
      <StoreNameWrapper selected={props?.selected}>
        <Text type={props?.selected ? "bold" : ""}>
          {props?.storeCard?.storeDisplayName || ""}
        </Text>
      </StoreNameWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-width: 82px;
  width: 82px;
  height: 74px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: ${({ selected }) => (selected ? "#E7F2F3" : "#FFFFFF")};
  border-right: ${({ selected }) =>
    selected ? "2px solid #A2D7D6" : "1px solid rgba(172, 172, 172, 0.2)"};
  cursor: pointer;
`;

const StoreImageWrapper = styled.img`
  width: 34px;
  height: 34px;
`;

const StoreNameWrapper = styled.div`
  text-align: center;
  margin-top: 6px;
  font-size: 14px;
  font-weight: ${({ selected }) => (selected ? "700" : "500")};
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 16px;
  color: ${({ selected }) =>
    selected ? `${colors?.text?.black200}` : `${colors?.text?.gray300}`};
`;

export default StoreCard;
