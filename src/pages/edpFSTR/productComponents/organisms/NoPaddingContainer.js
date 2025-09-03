import React from "react";
import styled from "styled-components";

function NoPaddingContainer(props) {
  return <Wrapper style={props.style}>{props.children}</Wrapper>;
}

const Wrapper = styled.div`
  width: 100%;
`;

export default NoPaddingContainer;
