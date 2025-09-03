import React from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import { colors } from "theme/colors";
import { device } from "../../../../commons/util/helperFunctions";

function CollectionTitle(props) {
  return (
    <Wrapper style={props.textStyle}>
      <TextWrapper>
        <Text type={props.textType || "bold"} variant="heading">{`${
          props.title
        } ${
          props?.count && props?.count !== "" && props?.count !== 0
            ? `(${props?.count})`
            : ``
        }`}</Text>
      </TextWrapper>
      {props?.collectionLogo && <StoreLogo src={props?.collectionLogo} />}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  color: ${colors?.text?.actionTextColor};
  font-size: 24px;
  font-weight: 700;
  display: flex;
  flex-direction: row;
  gap: 8px;

  @media ${device.laptop} {
    font-size: 32px;
  }
`;
const TextWrapper = styled.div``;
const StoreLogo = styled.img`
  width: 32px;

  @media ${device.laptop} {
    width: 48px;
  }
`;

export default CollectionTitle;
