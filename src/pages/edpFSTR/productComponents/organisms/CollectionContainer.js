import React from "react";
import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";

function CollectionContainer(props) {
  return <Wrapper style={props.style} collectionType={props?.collectionType || false}>{props.children}</Wrapper>;
}

const Wrapper = styled.div`
  width: 100%;
  margin: ${({ collectionType }) => collectionType ? "0px" : '32px 0px'};
  padding: ${({ collectionType }) => collectionType ? "0px" : '40px 24px 55px 24px'};
  background: transparent;
  position: relative;

  @media ${device.laptop} {
    padding: ${({ collectionType }) => collectionType ? "0px" : "40px 136px 55px 136px"};
    padding: 0px;
  }
`;

export default CollectionContainer;
