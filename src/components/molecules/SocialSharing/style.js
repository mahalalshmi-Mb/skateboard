import styled from "styled-components";
import { device } from "../../../commons/util/helperFunctions";
import Slider from "react-slick";

export const ModalContainer = styled.div`
  @media ${device.mobileS} {
    padding: 60px 0 0 24px;
  }
  @media ${device.tablet} {
    padding: 0;
  }
  @media ${device.laptop} {
    padding: 0;
  }
`;
export const ModalTitle = styled.div`
  width: 275px;
  height: 31px;
  font-family: "Manrope";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 130%;
  color: #273135;
  padding: 32px 0 0 40px;
`;
export const ModalHeaderLine = styled.div`
  border: 1px solid #9aa5b1;
  width: 90%;
  margin: 24.5px 0 0 0;
  opacity: 0.5;

  @media ${device.mobileS} {
    margin: 27px 0 0 0;
  }
  @media ${device.tablet} {
    margin: 50px 0 0 40px;
  }
  @media ${device.laptop} {
    margin: 55px 0 0 40px;
  }
`;
export const ModalCloseButton = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px;
  cursor: pointer;

  @media ${device.mobileS} {
    padding: 24px 24px 0 0;
  }
  @media ${device.tablet} {
    padding: 10px;
  }
  @media ${device.laptop} {
    padding: 10px;
  }
`;
export const SocialShareLinks = styled.div`
  margin: 34px 0 0 40px;

  @media ${device.mobileS} {
    margin: 34px 0 0 0;
  }
  @media ${device.tablet} {
    margin: 34px 0 0 40px;
  }
  @media ${device.laptop} {
    margin: 34px 0 0 40px;
  }
`;
export const SocialIcon = styled.img`
  cursor: pointer;
  width: 71px !important;
  height: 71px !important;

  @media ${device.mobileS} {
    width: 81px !important;
    height: 101px !important;
  }
  @media ${device.tablet} {
    width: 75px !important;
    height: 107px !important;
  }
  @media ${device.laptop} {
    width: 75px !important;
    height: 107px !important;
  }
`;
export const ModalHeader = styled.div`
  padding: 0 26px 0 8px;
`;

export const ModalHeaderImage = styled.img`
  width: 94px;
  height: 94px;
`;

export const ModalHeaderTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  padding: 0 0 0 20px;

  @media ${device.mobileS} {
    padding: 0 0 0 40px;
  }
  @media ${device.mobileM} {
    padding: 0 0 0 20px;
  }
`;
export const ModalHeaderSubTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  color: #000000;
  opacity: 0.5;
  padding: 8px 0 0 20px;

  @media ${device.mobileS} {
    padding: 8px 0 0 40px;
  }
  @media ${device.mobileM} {
    padding: 8px 0 0 20px;
  }
`;
export const CustomSlider = styled(Slider)`
  .slick-list {
    overflow: unset !important;
  }
`;
