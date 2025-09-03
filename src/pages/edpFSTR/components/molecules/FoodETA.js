import React from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import ETA from "../../assets/ETA.svg";

const FoodETAWrapper = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-radius: ${(props) => props.borderRadius || "0px 8px"};
  position: absolute;
  right: 0px;
  padding: ${(props) => props.padding || "4px"};
  background: ${(props) => props.background || "#273135"};
`;

const FoodETA = (props) => {
  return (
    <FoodETAWrapper
      borderRadius={props.borderRadius}
      padding={props.padding}
      background={props.background}
    >
      {props.value && props.value !== "" && (
        <React.Fragment>
          <FoodETAImageWrapper src={ETA} />
          <FoodTimeWrapper
            style={props.foodTimeStyle}
            textTransform={props.textTransform}
          >
            <Text>
              {props.value} {props.durationType}
            </Text>
          </FoodTimeWrapper>
          <div
            style={{
              width: "12px",
              rotate: "90deg",
              border: "0.5px solid #FFFFFF",
            }}
          />
        </React.Fragment>
      )}
      {props.terminal && props.terminal !== "" ? (
        <Text
          type="bold"
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#F8CF46",
          }}
        >
          {props?.terminal?.indexOf("Terminal") > -1
            ? props?.terminal?.replace("Terminal", "T")
            : props?.terminal}
        </Text>
      ) : null}
    </FoodETAWrapper>
  );
};

const FoodETAImageWrapper = styled.img``;

const FoodTimeWrapper = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: #ffffff;
  margin-left: 4px;
  letter-spacing: 0.1em;
  text-transform: ${({ textTransform }) => textTransform || "uppercase"};
`;

export default FoodETA;
