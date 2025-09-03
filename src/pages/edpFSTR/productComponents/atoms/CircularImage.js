import React from "react";
import styled from "styled-components";
import LoadingSkeleton from "./LoadingSkeleton";

function CircularImage(props) {
  return (
    <CategoryImageWrapper style={props.wrapperStyle}>
      {props.image ? (
        <CategoryImage src={props.image} />
      ) : (
        <LoadingSkeleton variant="circular" />
      )}
    </CategoryImageWrapper>
  );
}

const CategoryImageWrapper = styled.div`
  width: 92px;
  height: 92px;
  border-radius: 92px;
  background: lightgray -0.374px -1.228px / 110.42% 138.136% no-repeat;
`;
const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 100%;
`;

export default CircularImage;
