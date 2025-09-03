import React from "react";
import styled from "styled-components";
import { device } from "../../../commons/util/helperFunctions";
import ImageCarousel from "pages/edpFSTR/productComponents/organisms/ImageCarousel";

import { colors } from "theme/colors";
import Text from "components/atoms/Text";

const RetailerSection = (props) => {
  return (
    <Wrapper>
      {props?.data?.attributes?.title && <SectionTitle>
        <Text>{props?.data?.attributes?.title || ""}</Text>
      </SectionTitle>}
      <ImageCarousel {...props} 
      isAutoscrollHorizontal={props?.sectionType}
      wrapperStyle={{ height: "100px" , padding: "14px" }}
      settings={props?.settings}>
          {props.children}
      </ImageCarousel>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;
const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 18px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 28px;
  }
`;
const Logo = styled.img`
  display: inline-block;
  width: 150px;
  max-width: 100%;
  height: auto !important;
  vertical-align: middle;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.07);
  }
`;

export default RetailerSection;
