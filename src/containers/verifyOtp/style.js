import styled from "styled-components";
import { device } from "../../commons/util/helperFunctions";

export const Wrapper = styled.div`
  margin-top: 40px;

  @media ${device.tablet} {
    width: 366px;
    text-align: center;
  }
`;
export const Title = styled.div`
  font-weight: 800;
  font-size: 21px;

  @media ${device.tablet} {
    font-size: 28px;
  }
`;
export const Subtitle = styled.div`
  font-size: 16px;
  line-height: 25px;
`;
export const Section = styled.div`
  margin-top: 30px;
`;
export const OtpWrapper = styled.div``;

export const Footer = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
