import React from "react";
import styled from "styled-components";
import Text from "components/atoms/Text";
import { StandardSectionWrapper, Title } from "./style";
import { device } from "../../../commons/util/helperFunctions"
import TravelItem from "./TravelItem";

const BookYourTravel = (props) => {
  return (
    <StandardSectionWrapper>
      <Title>
        <Text type="bold">{props?.data?.header || ""}</Text>
      </Title>
      <Content>
        {props?.data?.content_blocks?.map((item) => (
          <TravelItem item={item} header={props?.data?.header || ""} />
        ))}
      </Content>
    </StandardSectionWrapper>
  );
};

const Content = styled.div`
  margin-top: 24px;
  padding: 0px 24px;
  width: 100%;
  overflow: scroll;
  scrollbar-width: none;
  display: grid;
  grid-template-rows: auto auto;
  grid-auto-flow: column;
  gap: 20px 18px;

  @media ${device.tablet} {
    padding: 0px 48px;
    grid-template-rows: auto;
  }
`;

export default BookYourTravel;
