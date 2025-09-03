import React from "react";
import styled from "styled-components";

const YouTubePlayer = (props) => {
  return (
    <Wrapper>
      <IFrame
        src={props.videoLink}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></IFrame>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border-radius: 8px;
  border-radius: 8px;
`;

const IFrame = styled.iframe`
  border-radius: 8px;
  aspect-ratio: 2 / 1;
  width: 100%;
`;

export default YouTubePlayer;
