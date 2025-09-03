import React, { useState } from "react";
import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";
import Text from "../../../../components/atoms/Text";
import { colors } from "theme/colors";

const FilterList = (props) => {
  const [showMore, setShowMore] = useState(false);
  const data = props?.data?.filterData || props?.data || {};

  const filterData = Array.isArray(data?.facetDetails?.facetOptionValues)
    ? data?.facetDetails?.facetOptionValues
    : data?.facetDetails || [];

  return (
    <Wrapper key={props?.index}>
      <Title>
        <Text type="bold">{data?.facetDetails?.facetLabel}</Text>
      </Title>
      <FilterListingContainer showMore={showMore}>
        {filterData?.map((item, index) => (
          <FilterItemContainer
            key={index}
            onClick={() => props.handleFilterClick(data?.filterParam, item)}
          >
            <FilterItemWrapper>
              <FilterItem
                selected={
                  props.selectedFilter[data?.filterParam] &&
                  props.selectedFilter[data?.filterParam]?.includes(item.value)
                }
              >
                <Text type="regular">
                  {item?.displayLabel || item?.value || ""}
                </Text>
              </FilterItem>
            </FilterItemWrapper>
            <FilterCount
              selected={
                props.selectedFilter[data?.filterParam] &&
                props.selectedFilter[data?.filterParam]?.includes(item.value)
              }
              type={
                props.selectedFilter[data?.filterParam] &&
                props.selectedFilter[data?.filterParam]?.includes(item.value)
                  ? "bold"
                  : "regular"
              }
            >
              {item?.count > 9 ? `${item?.count}` : `0${item?.count}`}
            </FilterCount>
          </FilterItemContainer>
        ))}
      </FilterListingContainer>
      {filterData?.length > 5 && (
        <ShowMoreText onClick={() => setShowMore(!showMore)}>
          <Text type="semi-bold">
            {showMore ? "Show Less -" : "Show More +"}
          </Text>
        </ShowMoreText>
      )}
      {!props?.isLastItem && <HorizontalDivider />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;
const Title = styled.h3`
  font-size: 16px;
  line-height: 22px;
  color: ${colors?.text?.black300};
`;
const FilterListingContainer = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px 0px;
  margin-top: 6px;
  max-height: ${({ showMore }) => (showMore ? "fitContent" : "172px")};
  overflow-y: hidden;
  padding: 0px;
  font-size: 14px;
`;
const FilterItemContainer = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;
const FilterItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const FilterItem = styled.div`
  font-size: 14px;
  color: ${({ selected }) =>
    selected ? `${colors?.text?.black300}` : `${colors?.text?.gray300}`};

  width: max-content;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ selected }) => (selected ? "36px" : `0px`)};
  border: ${({ selected }) =>
    selected ? `1px solid ${colors?.text?.gray300}` : `none`};
  padding: ${({ selected }) => (selected ? "4px 12px" : `0px`)};
  line-height: 18px;

  @media ${device.laptop} {
    &:hover {
      text-decoration: ${({ selected }) => (selected ? "none" : "underline")};
    }
  }
`;
const FilterCount = styled.div`
  background: ${colors?.text?.actionTextColor};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 6px;
  font-size: 14px;
  color: ${colors?.text?.white900};
  height: 27px;
  min-width: 30px;
`;
const ShowMoreText = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: ${colors?.text?.black300};
  cursor: pointer;
`;
const HorizontalDivider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0px;
  color: ${colors?.border};
  opacity: 1;
`;

export default FilterList;
