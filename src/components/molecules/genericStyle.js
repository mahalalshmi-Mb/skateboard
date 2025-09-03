import styled from "styled-components";
import { device } from "../../commons/util/helperFunctions";

export const CarousalImageContainer = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 8px;
  background-image: ${(props) => `url(${props.mobileImage})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  @media ${device.tablet} {
    background-image: ${(props) => `url(${props.desktopImage})`};
  }
`;

export const SliderWrapper = styled.div`
  padding-bottom: 40px;
  padding-top: 20px;
`;
