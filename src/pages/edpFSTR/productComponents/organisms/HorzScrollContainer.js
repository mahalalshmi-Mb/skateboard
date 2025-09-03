import React, { useEffect} from "react";
import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";

function HorzScrollContainer(props) {

  useEffect(() => {
    if (props?.setIsCardRef) {
      props.setIsCardRef(
        props?.cardRef?.current == undefined ||
        props.cardRef.current?.childElementCount === 0
      );
    }
  }, [props?.cardRef]);

  return (
    <Wrapper
      style={props.style}
      isDesktopScrollbarVisible={props?.isDesktopScrollbarVisible}
      cardType={
        props?.cardType === "ProductCardTwo" ||
        props?.cardType === "ShopCardTwo" ||
        false
      }
      wrapType={props?.cardType === "ShopCardTwo" || false}
      ref={props?.cardType === "ProductCardTwo" ? props?.cardRef : null}
    >
      {props.children}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  overflow: ${({ cardType }) => (cardType ? "unset" : "scroll")};
  gap: 24px;
  flex-direction: ${({ cardType }) => (cardType ? "row" : "column")};
  align-items: center;
  scrollbar-width: none;
  flex-wrap: ${({ wrapType }) => (wrapType ? "wrap" : "nowrap")};

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }

  @media ${device.laptop}, ${device.tablet} {
    gap: ${({ cardType }) => (cardType ? "24px" : "32px")};
    scrollbar-width: ${({ isDesktopScrollbarVisible }) =>
      isDesktopScrollbarVisible ? "auto" : "none"};
    flex-direction: row;
  }
`;

export default HorzScrollContainer;
