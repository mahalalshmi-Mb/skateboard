import React from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";

function RectangularImage(props) {
  return (
    <Wrapper style={props.wrapperStyle}>
      <Image src={props.image} style={props.imageStyle} />
      {props.imageText && props.imageText !== "" && (
        <ImageText style={props.textStyle}>
          <Text>{props.imageText}</Text>
        </ImageText>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  position: relative;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
`;
const ImageText = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  position: absolute;
  left: 16px;
  bottom: 16px;
`;

export default RectangularImage;
