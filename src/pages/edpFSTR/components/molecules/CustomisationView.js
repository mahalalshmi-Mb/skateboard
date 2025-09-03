import React from "react";
import Text from "../../../../components/atoms/Text";
import { Checkbox, Radio } from "@mui/material";
import styled from "styled-components";
import { device, formatPrice } from "../../../../commons/util/helperFunctions";
import { DietCategoryIcon } from "../../pages/config/config";
import { colors } from "theme/colors";

const CustomisationView = (props) => {
  return (
    <Wrapper>
      <HeaderWrapper marginTop={props.marginTop}>
        <SelectionHeaderTextWrapper>
          <Text type="semi-bold">{props.selectionType}</Text>
        </SelectionHeaderTextWrapper>
      </HeaderWrapper>
      <SelectionContentWrapper>
        {props.selectionsAvailable?.length > 0 &&
          props.selectionsAvailable.map((item, index) => {
            return (
              <SelectionItemsWrapper
                key={index}
                index={index}
                onClick={(e) => props.onCheckClick(e, item)}
              >
                <ItemTypeAndTitleWrapper>
                  <ItemTitleWrapper>
                    <Text>
                      {(
                        item.type ||
                        item.name ||
                        item.productName ||
                        item.attributeValue
                      )?.toLowerCase()}
                    </Text>
                  </ItemTitleWrapper>
                </ItemTypeAndTitleWrapper>
                <PriceCheckboxWrapper>
                  {(item.unitPrice !== undefined &&
                    item.unitPrice !== null &&
                    item.unitPrice !== 0) ||
                  (item.price !== undefined &&
                    item.price !== null &&
                    item.price !== 0) ||
                  (item.pricing !== undefined &&
                    item.pricing !== null &&
                    item.pricing !== 0) ? (
                    <PriceTextWrapper>
                      <Text>
                        {formatPrice(
                          item.unitPrice || item.price || item.pricing || 0
                        )}
                      </Text>
                    </PriceTextWrapper>
                  ) : null}
                  {props.singleSelect ? (
                    <Radio
                      style={{
                        width: "16px",
                        height: "16px",
                        transform: "scale(0.8888)",
                      }}
                      sx={{
                        "&.Mui-checked": {
                          color: colors?.primary,
                        },
                      }}
                      checked={props.selectedItems.some((selected) => {
                        const updatedObject = { ...selected };
                        delete updatedObject["preferenceId"];
                        delete updatedObject["_id"];
                        delete updatedObject["pricing"];
                        delete updatedObject["attributeDietCategory"];

                        const sortedSelected = {};
                        const sortedItem = {};

                        const keysItem = Object.keys(updatedObject).sort();

                        keysItem.forEach((key) => {
                          sortedItem[key] = item[key];
                          sortedSelected[key] = selected[key];
                        });

                        return (
                          JSON.stringify(sortedItem) ===
                          JSON.stringify(sortedSelected)
                        );
                      })}
                    ></Radio>
                  ) : (
                    <Checkbox
                      sx={{
                        color: `${colors?.primary}`,
                        "&.Mui-checked": {
                          color: `${colors?.primary}`,
                        },
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                      checked={props.selectedItems.some((selected) => {
                        const sortedSelected = {};
                        const sortedItem = {};

                        const keysItem = Object.keys(item).sort();

                        keysItem.forEach((key) => {
                          sortedItem[key] = item[key];
                          sortedSelected[key] = selected[key];
                        });

                        delete sortedItem["preferenceDietCategory"];
                        delete sortedSelected["preferenceDietCategory"];
                        delete sortedItem["isActive"];
                        delete sortedSelected["isActive"];

                        return (
                          JSON.stringify(sortedItem) ===
                          JSON.stringify(sortedSelected)
                        );
                      })}
                    ></Checkbox>
                  )}
                </PriceCheckboxWrapper>
              </SelectionItemsWrapper>
            );
          })}
      </SelectionContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-left: 24px;
  margin-right: 24px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  margin-top: ${({ marginTop }) => marginTop};
  justify-content: space-between;
`;

const SelectionContentWrapper = styled.div`
  background: #ffffff;
  border-radius: 8px;
  margin-top: 13px;
  padding: 16px 16px;

  @media ${device.laptop} {
    margin-bottom: 0px;
  }
`;

const SelectionHeaderTextWrapper = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${colors?.text?.black200};
`;

const SelectionCountTextWrapper = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${colors?.text?.black200};
`;

const SelectionItemsWrapper = styled.div`
  display: flex;
  margin-top: ${({ index }) => (index === 0 ? "0px" : "14px")};
  justify-content: space-between;
`;

const ItemTypeAndTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CategoryTypeImageWrapper = styled.img`
  width: 12px;
  height: 12px;
`;

const ItemTitleWrapper = styled.div`
  margin-left: 6px;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  color: ${colors?.text?.black900};
  text-transform: capitalize;
  width: 100%;

  @media ${device.mobileS} {
    min-width: 100px;
    max-width: 100px;
  }

  @media ${device.mobileM} {
    min-width: 150px;
    max-width: 150px;
  }

  @media ${device.mobileP} {
    min-width: 200px;
    max-width: 200px;
  }

  @media ${device.mobileL} {
    min-width: 200px;
    max-width: 200px;
  }

  @media ${device.tablet} {
    min-width: 500px;
    max-width: 500px;
  }

  @media ${device.laptop} {
    min-width: 350px;
    max-width: 350px;
  }
`;

const PriceCheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const PriceTextWrapper = styled.div`
  margin-right: 16px;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  color: ${colors?.text?.black900};
`;

export default CustomisationView;
