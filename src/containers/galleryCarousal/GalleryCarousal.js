import React from "react";
import Slider from "react-slick";
import arrowRight from "../../assets/images/arrowRight.svg";
import { settings } from "./config";

import {
  ArrowImage,
  CarousalImage,
  CarousalImageWrapper,
  SampleNextArrowWrapper,
  SamplePrevArrowWrapper,
  Wrapper,
} from "./style";
import "./style.css";

export const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <SampleNextArrowWrapper onClick={onClick}>
      <ArrowImage src={arrowRight} />
    </SampleNextArrowWrapper>
  );
};

export const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <SamplePrevArrowWrapper onClick={onClick}>
      <ArrowImage src={arrowRight} />{" "}
    </SamplePrevArrowWrapper>
  );
};

const GalleryCarousal = (props) => {
  const buttonSettings = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  return (
    <Wrapper>
      <Slider {...buttonSettings} {...settings} {...props?.settings}>
        {props?.data?.map((image) => (
          <div key={image._id}>
            <CarousalImageWrapper>
              <CarousalImage src={image?.url} />
            </CarousalImageWrapper>
          </div>
        ))}
      </Slider>
    </Wrapper>
  );
};

export default GalleryCarousal;
