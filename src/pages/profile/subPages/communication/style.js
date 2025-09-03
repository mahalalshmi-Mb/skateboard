import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";

export const PageWrapper = styled.section`
  width: 100%;
  height: 100%;
  position: relative;
`;
export const ContentContainer = styled.div`
  width: 100%;
  padding: 21px 0px;

  @media ${device.laptop} {
    padding: 21px 136px 48px 136px;
  }
`;
export const PageTitle = styled.div`
  font-size: 28px;
  line-height: 38px;
  color: #273135;
  padding: 0px 26px;
`;
