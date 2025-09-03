import { device } from "commons/util/helperFunctions";
import styled from "styled-components";

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
