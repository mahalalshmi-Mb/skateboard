import React from "react";
import styled from "styled-components";
import Text from "../../../components/atoms/Text";
import { device } from "../../../commons/util/helperFunctions";
import { colors } from "theme/colors";

const Introduction = (props) => {
  return (
    <Wrapper>
      <ContentContainer>
        <Image
          src={props?.data?.attributes?.image?.data?.[0]?.attributes?.url || ""}
        />
        <Title>
          <Text type="medium">{props?.data?.attributes?.name || ""}</Text>
        </Title>
        <SubTitle>
          <Text>{props?.data?.attributes?.Body || ""}</Text>
        </SubTitle>
      </ContentContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 32px 0 0;
  text-align: center;
  position: relative;

  @media ${device.laptop} {
    padding: 107px 0 0;
  }
`;
const ContentContainer = styled.div`
  width: 100%;
  padding: 0px 16px;
  margin-bottom: 32px;

  @media ${device.laptop} {
    padding: 0 2.5rem;
    max-width: 51.25rem;
    margin: 0 auto 0.9375rem;
  }
`;
const Title = styled.div`
  font-size: 50px;
  line-height: 62px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 48px;
  }
`;
const SubTitle = styled.div`
  font-size: 16px;
  color: ${colors?.text?.black200};
  line-height: 21px;

  @media ${device.laptop} {
    font-size: 24px;
    line-height: 1.3;
  }
`;
const Image = styled.img`
  width: 104px;
  height: 104px;
`;

export default Introduction;
