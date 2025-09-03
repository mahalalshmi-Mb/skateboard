import React from "react";
import Text from "../../../../components/atoms/Text";
import styled from "styled-components";
import XIconGreen from "../../assets/xIconGreen.svg";
import { DietCategoryIcon } from "../../pages/config/config";

const FilterButtonWrapper = styled.div`
  width: fit-content;
  min-width: fit-content;
  height: 35px;
  padding: 12px;
  border-radius: 17.5px;
  background: #f4f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.selected ? "rgba(4, 173, 170, 0.04)" : "rgba(244, 245, 245, 1)"};
  border: ${(props) => (props.selected ? "1.4px solid #04ADAA" : "")};
  border-radius: 17.5px;
  cursor: pointer;
`;

const FilterClearButton = styled.img`
  padding-left: 10px;
`;

const FilterTypeTextWrapper = styled.div({
  fontWeight: 500,
  fontSize: "14px",
  marginLeft: "6px",
  lineHeight: "19px",
  color: "#273435",
});

const CategoryIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const FilterButton = (props) => {
  return (
    <FilterButtonWrapper
      selected={props.selected}
      onClick={!props.selected ? props.onClick : null}
    >
      {props.showIcon && (
        <CategoryIcon
          src={
            props.text === "Veg"
              ? DietCategoryIcon.veg
              : DietCategoryIcon.nonVeg
          }
          alt="category"
        />
      )}
      <FilterTypeTextWrapper>
        <Text>{props.text}</Text>
      </FilterTypeTextWrapper>
      {props.selected && (
        <FilterClearButton onClick={props.clearFilter} src={XIconGreen} />
      )}
    </FilterButtonWrapper>
  );
};

export default FilterButton;
