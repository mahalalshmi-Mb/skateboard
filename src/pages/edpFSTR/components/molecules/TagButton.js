import React from "react";
import Text from "../../../../components/atoms/Text";
import styled from "styled-components";
import XIconGreen from "../../assets/xIconGreen.svg";
import { colors } from "theme/colors";

const TagButtonWrapper = styled.div`
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

const TagClearButton = styled.img`
  padding-left: 10px;
`;
const TagTypeTextWrapper = styled.div`
  font-weight: 500;
  font-size: 14px;
  margin-left: 6px;
  line-height: 19px;
  color: ${colors?.text?.black200};
`;

const CategoryIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const TagButton = (props) => {
  return (
    <TagButtonWrapper
      selected={props.selected}
      onClick={!props.selected ? props.onClick : null}
    >
      {props.showIcon && <CategoryIcon src={props.tagIcon} alt="tagIcon" />}
      <TagTypeTextWrapper>
        <Text>{props.text}</Text>
      </TagTypeTextWrapper>
      {props.selected && (
        <TagClearButton onClick={props.clearFilter} src={XIconGreen} />
      )}
    </TagButtonWrapper>
  );
};

export default TagButton;
