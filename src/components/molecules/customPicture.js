import React from "react";
import styled from "styled-components";

const CustomPicture = (props) => {
  return (
    <Picture className={props.className || props?.style} onClick={props.onClick}>
      <source
        media="(min-width:1440px)"
        srcSet={props.desktopPicture}
        style={props.desktopStyle}
      />
      <source
        media="(min-width:1024px)"
        srcSet={props.laptopPicture || props.desktopPicture}
        style={props.laptopStyle}
      />
      <source
        media="(min-width:768px)"
        srcSet={props.tabletPicture || props.laptopPicture || props.desktopPicture}
        style={props.tabletStyle}
      />
      <img
        alt={props.alt || "img-not-found"}
        src={props.mobilePicture}
        style={props.style}
      />
    </Picture>
  );
};

const Picture = styled.picture``;

export default CustomPicture;
