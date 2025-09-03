import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
`;

export const Header = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
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

export const Title = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

export const Content = styled.div`
  padding: 30px 24px;
  overflow: scroll;

  @media ${device.tablet} {
    padding: 30px 48px;
  }

  @media ${device.laptop} {
    padding: 30px 72px;
  }

  @media ${device.laptopL} {
    padding: 30px 136px;
  }
`;
