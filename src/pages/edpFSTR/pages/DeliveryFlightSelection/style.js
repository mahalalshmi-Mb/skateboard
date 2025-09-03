import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";

export const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  @media ${device.laptop} {
    height: 100vh;
    padding-bottom: 100px;
  }
`;
export const HeaderWrapper = styled.section`
  width: 100%;
  padding: 45px 24px 29px 24px;
  background-color: #fff;

  @media ${device.laptop} {
    display: none;
  }
`;
export const HeaderBackWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
export const BackArrow = styled.img``;
export const HeaderText = styled.div`
  color: #273135;
  font-size: 16px;
  font-weight: 500;
`;
export const ContentWrapper = styled.section`
  width: 100%;
  height: 100%;
  position: relative;
`;
export const OptForTakeawayWrapper = styled.section`
  width: 100%;
  padding: 32px 24px 0px 24px;

  @media ${device.laptop} {
    width: 50%;
    padding: 40px 136px 0px 136px;
  }
`;
export const FooterWrapper = styled.section`
  width: 100%;
  height: 77px;
  padding: 16px 24px;
  position: fixed;
  bottom: 0px;
  left: 0px;
  background-color: #fff;
  z-index: 1;

  @media ${device.laptop} {
    display: none;
  }
`;
export const FooterButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  border-radius: 100px;
  background: #037b79;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;
export const FooterButtonText = styled.div`
  color: #fff;
  font-size: 16px;
  line-height: 21px;
`;
export const ScheduleOrderBannerWrapper = styled.div`
  width: 100%;
  padding: 32px 24px 0px 24px;
  display: none;

  @media ${device.laptop} {
    display: block;
    width: 50%;
    padding: 40px 136px 0px 136px;
  }
`;
