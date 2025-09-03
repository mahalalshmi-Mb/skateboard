import React from "react";
import RadioButton from "../atoms/RadioButton";
import Text from "../atoms/Text";
import styled from "styled-components";

const RadioButtonWithLabel = (props) => {
  return (
    <Wrapper
      onClick={() => {
        props.onClick(props.data);
      }}
      checked={props.checked}
    >
      <RadioButton {...props} />
      <Label>
        <Text type="semi-bold">{props.label}</Text>
      </Label>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 6px;
  height: 50px;

  border: ${({ checked }) =>
    checked ? "1px solid #04ADAA" : "1px solid #bdbdbd"};

  cursor: pointer;
  transition: 0.3s;
`;

const Label = styled.div`
  font-size: 16px;
  line-height: 21px;
  letter-spacing: 0.01em;
  text-align: left;
`;

export default RadioButtonWithLabel;
