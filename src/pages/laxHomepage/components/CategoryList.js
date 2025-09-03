import React from "react";
import styled from "styled-components";
import CategoryCard from "./CategoryCard";
import { device } from "../../../commons/util/helperFunctions";
import Text from "../../../components/atoms/Text";
import HorzScrollContainer from "../../edpFSTR/productComponents/organisms/HorzScrollContainer";
import ScrollContainer from "../../edpFSTR/productComponents/organisms/ScrollContainer";
import { colors } from "theme/colors";

const CategoryList = (props) => {
  return (
    <Wrapper isExperience={props?.isExperience || false}>
      <Title>
        <Text type="bold">{props?.categoryTitle}</Text>
      </Title>
      <ContentWrapper>
        {props?.isExperience ? (
          <ScrollContainer>
            {props?.data?.map((data, index) => (
              <CategoryCard
                key={`catCard-${index}`}
                data={data}
                isExperience={props?.isExperience || false}
              />
            ))}
          </ScrollContainer>
        ) : (
          <HorzScrollContainer>
            {props?.data?.map((data, index) => (
              <CategoryCard key={`catCard-${index}`} data={data} />
            ))}
          </HorzScrollContainer>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: ${({ isExperience }) => (isExperience ? "16px" : "0px 16px")};

  @media ${device.laptop} {
    max-width: 1240px;
    align-items: center;
    display: flex;
    flex-flow: column;
    padding-top: 1rem;
    margin: 0 auto;
    justify-content: center;
  }
`;
const Title = styled.div`
  font-size: 28px;
  line-height: 1.5;
  color: ${colors?.text?.black300};
  text-align: center;
`;
const ContentWrapper = styled.div`
  width: 100%;
  padding-top: 32px;
`;

export default CategoryList;
