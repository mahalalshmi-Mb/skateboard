import React from "react";
import styled from "styled-components";

function BrandCard(props) {
  return (
    <Wrapper key={props.index} onClick={props.handleAction}>
      <Image src={props.image} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 80px;
  height: 80px;
  min-width: 80px;
  min-height: 80px;
  border-radius: 45px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(2.5px);
  border: 3px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
`;
const Image = styled.img`
  object-fit: contain;
  width: 100%;
  height: 100%;
`;

export default BrandCard;
