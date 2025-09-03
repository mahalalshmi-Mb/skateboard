import React from "react";
import styled from "styled-components";

function GridContainer(props) {
  return <Wrapper style={props.style}>{props.children}</Wrapper>;
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 24px 22px;
`;

export default GridContainer;
