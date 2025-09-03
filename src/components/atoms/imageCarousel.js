import React from "react";
import "react-alice-carousel/lib/alice-carousel.css";
import AliceCarousel from "react-alice-carousel";

function ImageCarousel(props) {
  return (
    <AliceCarousel
      duration={props.duration || 400}
      autoPlay={props.autoPlay || false}
      startIndex={1}
      fadeOutAnimation={props.fadeOutAnimation || true}
      mouseDragEnabled={props.mouseDragEnabled || true}
      disableDotsControls={props.disableDotsControls || false}
      autoPlayInterval={props.autoPlayInterval || 2000}
      autoPlayDirection={props.autoPlayDirection || "ltr"}
      autoPlayActionDisabled={props.autoPlayActionDisabled || false}
      disableButtonsControls={props.disableButtonsControls || true}
      keyboardNavigation={props.keyboardNavigation || true}
      infinite={props.infinite || true}
    >
      {props.children}
    </AliceCarousel>
  );
}

export default ImageCarousel;
