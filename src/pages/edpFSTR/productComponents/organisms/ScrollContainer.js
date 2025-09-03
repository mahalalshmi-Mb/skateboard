import React from "react";
import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";

function ScrollContainer(props) {
  return (
    <Wrapper
      style={props.style}
      isDesktopScrollbarVisible={props?.isDesktopScrollbarVisible}
    >
      {props.children}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  overflow: auto;
  gap: 12px;
  scrollbar-width: none;
  flex-direction: row;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }

  @media ${device.laptop} {
    gap: 32px;
    scrollbar-width: ${({ isDesktopScrollbarVisible }) =>
      isDesktopScrollbarVisible ? "auto" : "none"};
  }

  @media ${device.mobileS}, ${device.mobileM}, ${device.mobileL} {
  flex-direction: column;
  }

  @media ${device.tablet}, ${device.laptop} {
  flex-direction: row;
  }
  
  @media ${device.tablet} {
    gap: 32px;
  }
`;

export default ScrollContainer;
