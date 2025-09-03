import React from "react";
import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";

function MedPaddingContainer(props) {
  return <Wrapper style={props.style}>{props.children}</Wrapper>;
}

const Wrapper = styled.div`
  width: 100%;
  padding: 0px 16px;

  @media ${device.laptop} {
    padding: 0px 50px;
  }
`;

export default MedPaddingContainer;
