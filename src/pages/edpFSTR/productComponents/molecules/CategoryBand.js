import React, { useState } from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import DownArrow from "../../assets/DownArrow.svg";
import HorzScrollContainer from "../organisms/HorzScrollContainer";
import CategoryCardOne from "./CategoryCardOne";

const getCircularImage = (imageArr) => {
  const image = imageArr?.filter(
    (x) =>
      (x?.platform?.toLowerCase() === "web" ||
        x?.platform?.toLowerCase() === "marketplace") &&
      x?.type?.toLowerCase() === "small" &&
      x?.dimension?.toLowerCase() === "circular"
  );
  if (image) {
    return image[0]?.imageUrl;
  }
};

function CategoryBand(props) {
  return (
    <Wrapper>
      <ContentWrapper
        onClick={() =>
          props.setIsCategoryDropdownOpen(!props.isCategoryDropdownOpen)
        }
      >
        <SelectedCategoryText>
          <Text type="extra-bold">{props.selectedCategory}</Text>
        </SelectedCategoryText>
        <DownArrowImg src={DownArrow} isOpen={props.isCategoryDropdownOpen} />
      </ContentWrapper>
      {props.isCategoryDropdownOpen && (
        <DropdownContainer>
          <DropdownWrapper>
            <HorzScrollContainer style={{ position: "relative" }}>
              {props.categoryData.map((item, index) => (
                <CategoryCardOne
                  key={index}
                  ageVerificationReq={item?.ageVerificationRequired}
                  title={item?.categoryName}
                  image={getCircularImage(item?.categoryImage)}
                  item={item}
                  handleAction={() =>
                    props.selectedCategory !== item?.categoryName
                      ? props.handleAction(item)
                      : null
                  }
                />
              ))}
            </HorzScrollContainer>
          </DropdownWrapper>
        </DropdownContainer>
      )}
      {props.isCategoryDropdownOpen && <DropdownWrapperMask />}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 42px;
  background-color: #fff;
  // filter: drop-shadow(-4px 4px 10px rgba(0, 0, 0, 0.1));
`;
const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 24px;
`;
const SelectedCategoryText = styled.div`
  color: #273135;
  font-size: 13px;
  font-weight: 800;
  line-height: 17px;
  letter-spacing: 1.3px;
  text-transform: uppercase;
`;
const DownArrowImg = styled.img`
  transition: all 0.4s ease;
  transform: ${({ isOpen }) => isOpen && "rotateZ(-180deg)"};
`;
const DropdownContainer = styled.div`
  width: 100%;
  background-color: #fff;
  z-index: 999999;
  margin-top: -2px;
  position: absolute;
`;
const DropdownWrapper = styled.div`
  width: 100%;
  padding: 24px 0px;
  position: relative;
`;

const DropdownWrapperMask = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
  position: absolute;
  left: 0px;
  z-index: 1;
`;

export default CategoryBand;
