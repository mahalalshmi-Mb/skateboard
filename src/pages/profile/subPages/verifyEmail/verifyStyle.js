import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";

export const Wrapper = styled.div`
  padding: 30px 24px;
  max-width: 1440px;
`;
export const Header = styled.div`
  display: flex;
`;
export const Body = styled.div`
  @media ${device.tablet} {
    display: flex;
    width: 100%;
    justify-content: center;
  }
`;
