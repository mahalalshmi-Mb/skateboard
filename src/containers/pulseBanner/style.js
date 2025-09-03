import styled from "styled-components";
import pulseBgDesktop from "../../assets/images/pulseBanner/pulse-bg-desktop.webp";
import pulseBgMobile from "../../assets/images/pulseBanner/pulse-bg-mobile.webp";
import { device } from "../../commons/util/helperFunctions";

export const Wrapper = styled.section`
  margin-top: 60px;
  padding: 0px 24px;

  @media ${device.tablet} {
    padding: 0px 48px;
  }

  @media ${device.laptop} {
    padding: 0px 72px;
  }

  @media ${device.laptopL} {
    padding: 0px 136px;
  }
`;

export const Container = styled.div`
  height: 400px;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${pulseBgMobile});
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding-top: 46px;
  cursor: pointer;

  @media ${device.tablet} {
    background-image: url(${pulseBgDesktop});
    height: 410px;
    background-size: contain;
    padding-top: 0px;
    justify-content: center;
  }
`;

export const Logo = styled.div``;

export const Title = styled.div`
  font-size: 24px;
  color: #ffffff;
  padding: 0px 40px;
  margin-top: 30px;

  @media ${device.tablet} {
    padding: 0px 180px;
    margin-top: 20px;
  }

  @media ${device.laptop} {
    font-size: 40px;
  }

  @media ${device.laptopL} {
    padding: 0px 250px;
  }

  @media ${device.desktop} {
    padding: 0px 800px;
  }
`;

export const Button = styled.div`
  width: 141px;
  height: 41px;
  background: #ffffff;
  border-radius: 45px;
  padding: 8px;
  color: #04adaa;
  font-size: 16px;
  margin-top: 30px;

  @media ${device.tablet} {
    margin-top: 20px;
  }
`;
