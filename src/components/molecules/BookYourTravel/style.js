import styled from "styled-components";
import { isFestiveTheme } from "containers/FestiveThemeController/festiveThemingUtil";
import { device } from "commons/util/helperFunctions";

export const GradientContainer = styled.div`
  background: ${isFestiveTheme()
    ? "linear-gradient(180deg, rgba(255, 239, 181, 0.5) 0%, rgba(255, 254, 250, 0) 100%)"
    : ""};
`;

export const StandardSectionWrapper = styled.section`
  margin-top: 40px;

  @media ${device.laptop} {
    margin-top: 80px;
  }
`;

export const Title = styled.div`
  padding: ${(props) => (props.disablePadding ? null : "0px 24px")};
  font-size: 24px;
  font-weight: 700;
  line-height: 32.78px;
  text-align: left;

  @media ${device.tablet} {
    padding: ${(props) => (props.disablePadding ? null : "0px 48px")};
  }

  @media ${device.laptop} {
    font-size: 28px;
    font-style: normal;
    line-height: normal;
    padding: ${(props) => (props.disablePadding ? null : "0px 72px")};
  }

  @media ${device.laptopL} {
    padding: ${(props) => (props.disablePadding ? null : "0px 136px")};
  }
`;

export const PaddingWrapper = styled.div`
  padding: ${(props) => (props.disablePadding ? null : "0px 24px")};

  @media ${device.tablet} {
    padding: ${(props) => (props.disablePadding ? null : "0px 48px")};
  }

  @media ${device.laptop} {
    padding: ${(props) => (props.disablePadding ? null : "0px 72px")};
  }

  @media ${device.laptopL} {
    padding: ${(props) => (props.disablePadding ? null : "0px 136px")};
  }
`;
