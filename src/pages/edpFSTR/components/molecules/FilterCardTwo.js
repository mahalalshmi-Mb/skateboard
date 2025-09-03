import React, { useState } from "react";
import styled from "styled-components";
import XIcon from "../../../../assets/images/commons/x-icon-gray.svg";
import ProductFallbackImg from "../../assets/Fallback Images/product-fallback-medium.svg";
import Text from "../../../../components/atoms/Text";
import { colors } from "theme/colors";
import { device, isDesktopDevice } from "commons/util/helperFunctions";

const FilterCardTwo = (props) => {
  const [isHover, setIsHover] = useState(false);

  const filterImage =
    props?.isShowAll && isHover && isDesktopDevice()
      ? props?.imageHover
      : props?.tagIcon;
  return (
    <Wrapper
      selected={props.selected}
      onClick={props.selected ? props.clearFilter : props.onClick}
      imageStyles={props?.imageStyles}
    >
      <ImageWrapper
        imageStyles={props?.imageStyles}
        isShowAll={props?.isShowAll}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Image
          src={filterImage}
          onError={(e) => {
            e.target.src = ProductFallbackImg;
          }}
          selected={props.selected}
          imageStyles={props?.imageStyles}
          isShowAll={props?.isShowAll}
          imageHover={props?.imageHover}
        />
        {props.selected && (
          <CloseIconWrapper>
            <CloseIcon src={XIcon} />
          </CloseIconWrapper>
        )}
      </ImageWrapper>
      <ContentWrapper>
        <Title selected={props.selected}>
          <Text type={props.selected ? "regular" : "bold"}>
            {props?.text || ""}
          </Text>
        </Title>
        {props?.count && (
          <SubTitle selected={props.selected}>
            <Text>{`${props?.count} ${
              props?.count > 1 ? `places` : `place`
            }`}</Text>
          </SubTitle>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ imageStyles }) => imageStyles?.width || "96px"};
  min-width: ${({ imageStyles }) => imageStyles?.width || "112px"};
  cursor: pointer;
  overflow: visible;

  @media ${device.laptop} {
    transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);

    &:hover {
      transform: translateY(-1px);
    }
  }
`;
const ImageWrapper = styled.div`
  width: ${({ imageStyles }) => imageStyles?.width || "147px"};
  height: ${({ isShowAll, imageStyles }) =>
    isShowAll
      ? `calc(${imageStyles?.height})`
      : imageStyles
      ? `calc(${imageStyles?.height} + 16px)`
      : "calc(97px + 16px)"};
  border-radius: ${({ imageStyles }) => imageStyles?.borderRadius || "6px"};
  position: relative;
  padding-top: ${({ isShowAll }) => (isShowAll ? "0px" : "16px")};
  border: ${({ isShowAll }) =>
    isShowAll ? `1px solid ${colors.primary}` : "none"};
  background-color: ${({ isShowAll }) =>
    isShowAll ? colors.background : "transparent"};
  text-align: center;
  margin-top: ${({ isShowAll }) => (isShowAll ? "16px" : "0px")};
  display: flex;
  justify-content: center;
  align-items: center;

  @media ${device.laptop} {
    &:hover {
      background: ${({ isShowAll }) =>
        isShowAll ? colors.foreground : "transparent"};
      border: ${({ isShowAll }) =>
        isShowAll ? `1px solid ${colors.primary}` : "none"};
      transition: transform 0.5s ease;
      transform: scale(1.02);
    }
  }
`;
const CloseIconWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: -8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid #757575;
  background-color: #ffffff;
  z-index: 9;
`;
const CloseIcon = styled.img`
  width: 16px;
  height: 16px;
`;
const Image = styled.img`
  width: ${({ isShowAll, imageStyles }) =>
    isShowAll ? "40px" : imageStyles ? imageStyles?.width : "100%"};
  height: ${({ isShowAll, imageStyles }) =>
    isShowAll ? "40px" : imageStyles ? imageStyles?.height : "100%"};
  border-radius: ${({ imageStyles }) => imageStyles?.borderRadius || "6px"};
  object-fit: ${({ imageStyles }) => imageStyles?.objectFit || "cover"};
`;
const ContentWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  padding-top: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Title = styled.div`
  font-size: 18px;
  color: ${({ selected }) =>
    selected ? "#757575" : colors?.text?.actionTextColor};
  margin-top: 8px;
`;
const SubTitle = styled.div`
  font-size: 16px;
  color: #757575;
`;

export default FilterCardTwo;
