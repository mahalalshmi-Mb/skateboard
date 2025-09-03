import React from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import { colors } from "theme/colors";

function FilterCard(props) {
  return (
    <Wrapper
      style={props.wrapperStyle}
      selected={props.selected}
      onClick={props.onClick}
    >
      <Text style={props.textStyle} type="semi-bold">
        {props.title}
      </Text>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  color: ${colors?.text?.black900};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1.3px;
  opacity: 0.6;
  width: fit-content;
  min-width: fit-content;
  text-transform: uppercase;

  padding: ${(props) => (props.selected ? "8px 12px" : "0px")};
  border-radius: ${(props) => (props.selected ? "8px" : "0px")};
  color: ${(props) =>
    props.selected ? `${colors?.text?.white900}` : `${colors?.text?.black900}`};
  background: ${(props) => (props.selected ? "rgba(0, 0, 0, 0.45)" : "none")};
`;

export default FilterCard;
