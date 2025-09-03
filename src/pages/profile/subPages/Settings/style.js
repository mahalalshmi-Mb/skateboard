import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";

export const PageWrapper = styled.section`
  width: 100%;
  height: 100%;
  position: relative;
`;
export const ContentContainer = styled.div`
  width: 100%;
  padding: 21px 26px;

  @media ${device.laptop} {
    padding: 21px 136px 48px 136px;
  }
`;
export const PageTitle = styled.div`
  font-size: 28px;
  line-height: 38px;
  color: #273135;
`;
export const OptionsContainer = styled.div`
  width: 100%;
  padding-top: 20px;
`;
export const OptionsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;
export const OptionData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
export const OptionTitle = styled.div`
  font-size: 16px;
  line-height: 21px;
  color: #273135;
`;
export const OptionSubTitle = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: #273135;
  opacity: 0.6;
`;
export const RightArrow = styled.img`
  width: 20px;
  height: 20px;
`;
