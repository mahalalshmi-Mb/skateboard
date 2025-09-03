import React from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import { colors } from "theme/colors";

function CollectionSubTitle(props) {
  return (
    <Wrapper style={props.textStyle}>
      <Text type={props.textType || "regular"}>{props.subTitle}</Text>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  color: ${colors?.text?.black900};
  font-size: 18px;
  font-weight: 500;
  opacity: 0.8;
`;

export default CollectionSubTitle;
