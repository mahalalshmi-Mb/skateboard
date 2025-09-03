import styled from "styled-components";
import { device } from "../../commons/util/helperFunctions";

export const Wrapper = styled.div``;

export const CarousalImageWrapper = styled.div``;

export const CarousalImage = styled.img`
  height: 100%;
  width: 100%;
  padding: 0px 10px;
  object-fit: cover;

  @media ${device.tablet} {
    width: 90%;
    padding: 0px;
  }
`;

export const SampleNextArrowWrapper = styled.div`
  display: none;
  cursor: pointer;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  position: absolute;

  top: calc(50% - 20px);
  align-items: center;
  justify-content: center;

  @media ${device.tablet} {
    display: flex;
    right: calc(-40px - 0px);
  }

  @media ${device.laptop} {
    display: flex;
    right: calc(-40px - 10px);
  }

  @media ${device.laptopL} {
    display: flex;
    right: calc(-40px - 20px);
  }
`;

export const ArrowImage = styled.img``;

export const SamplePrevArrowWrapper = styled(SampleNextArrowWrapper)`
  transform: rotate(180deg);

  @media ${device.tablet} {
    display: flex;
    left: calc(-40px - 0px);
  }

  @media ${device.laptop} {
    display: flex;
    left: calc(-40px - 10px);
  }

  @media ${device.laptopL} {
    display: flex;
    left: calc(-40px - 20px);
  }
`;
