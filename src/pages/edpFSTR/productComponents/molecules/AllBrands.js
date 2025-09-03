import React from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import BrandCard from "./BrandCard";
import HorzScrollContainer from "../organisms/HorzScrollContainer";

function AllBrands(props) {
  const getSmallImage = (imageArr) => {
    const image = imageArr?.filter(
      (x) =>
        (x?.platform?.toLowerCase() === "web" ||
          x?.platform?.toLowerCase() === "marketplace") &&
        x?.type?.toLowerCase() === "small"
    );
    if (image) {
      return image[0]?.imageUrl;
    }
  };

  return (
    <BrandsBox
      onClick={props.handleAction}
      style={{
        background: props.sectionData?.sectionComponent?.backgroundColor,
      }}
    >
      <BrandIllustraionImageWrapper>
        {props.sectionData?.sectionComponent?.backgroundImage?.url && (
          <BrandIllustraionImage
            src={props.sectionData?.sectionComponent?.backgroundImage?.url}
          />
        )}
      </BrandIllustraionImageWrapper>
      <TitleWrapper>
        <Title
          style={{ color: props.sectionData?.sectionComponent?.fontColor }}
        >
          <Text type="semi-bold">
            {props.sectionData?.sectionComponent?.displayLabel}
          </Text>
        </Title>
        <SubTitle
          style={{ color: props.sectionData?.sectionComponent?.fontColor }}
        >
          <Text type="bold">
            {props.sectionData?.sectionComponent?.description}
          </Text>
        </SubTitle>
      </TitleWrapper>
      <BrandsListingWrapper>
        {props.items?.length >= 6 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px 0px",
            }}
          >
            <HorzScrollContainer>
              {props.items
                ?.slice(0, props.items?.length / 2)
                .map((subItem, subIndex) => (
                  <BrandCard
                    key={subIndex}
                    index={subIndex}
                    image={getSmallImage(subItem.brandImage)}
                    // image={subItem.logo}
                    imageText={subItem.brandName}
                    handleAction={(e) =>
                      props.handleCardAction(
                        props.sectionData?.actions,
                        props.sectionData?.sectionComponent?.cardComponent
                          ?.cardAction,
                        subItem,
                        e
                      )
                    }
                  />
                ))}
            </HorzScrollContainer>
            <HorzScrollContainer>
              {props.items
                ?.slice(props.items?.length / 2, props.items?.length)
                .map((subItem, subIndex) => (
                  <BrandCard
                    key={subIndex}
                    index={subIndex}
                    image={getSmallImage(subItem.brandImage)}
                    imageText={subItem.brandName}
                    handleAction={(e) =>
                      props.handleCardAction(
                        props.sectionData?.actions,
                        props.sectionData?.sectionComponent?.cardComponent
                          ?.cardAction,
                        subItem,
                        e
                      )
                    }
                  />
                ))}
            </HorzScrollContainer>
          </div>
        ) : (
          <HorzScrollContainer>
            {props.items?.map((subItem, subIndex) => (
              <BrandCard
                key={subIndex}
                index={subIndex}
                image={getSmallImage(subItem.brandImage)}
                imageText={subItem.brandName}
                handleAction={(e) =>
                  props.handleCardAction(
                    props.sectionData?.actions,
                    props.sectionData?.sectionComponent?.cardComponent
                      ?.cardAction,
                    subItem,
                    e
                  )
                }
              />
            ))}
          </HorzScrollContainer>
        )}
      </BrandsListingWrapper>
    </BrandsBox>
  );
}

const BrandsBox = styled.div`
  width: 100%;
  padding: 24px 0px 32px 0px;
  background: linear-gradient(180deg, #f9d59c 0%, rgba(249, 213, 156, 0) 100%);
  border: 2px solid rgba(249, 214, 159, 1);
  position: relative;
`;
const TitleWrapper = styled.div`
  padding: 0px 24px;
`;
const Title = styled.div`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #273135;
`;
const SubTitle = styled.div`
  color: #273135;
  font-size: 24px;
  font-weight: 500;
  padding-top: 3px;
`;
const BrandIllustraionImageWrapper = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  mix-blend-mode: overlay;
`;
const BrandIllustraionImage = styled.img``;
const BrandsListingWrapper = styled.div`
  width: 100%;
  padding-top: 24px;
`;

export default AllBrands;
