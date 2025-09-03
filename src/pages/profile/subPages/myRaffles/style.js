import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";
import { H2, H5 } from "../../../../theme/globalStyleSheet";

export const Wrapper = styled.div`
  overflow: hidden;
  @media ${device.mobileS} {
    padding: 24px 24px 0 24px;
  }
`;
export const Header = styled(H5)`
  @media ${device.mobileS} {
    color: #000;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 127%;
  }
`;

export const RafflesWrapper = styled.div`
  @media ${device.mobileS} {
  }
`;
export const RaffleImage = styled.div`
  @media ${device.mobileS} {
    height: 200px;
    width: 100%;
    margin-top: 20px;
    background-image: ${(props) => `url(${props?.bkImage})`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;
  }
`;

export const RaffleCount = styled(H2)`
  @media ${device.mobileS} {
    color: #273135;
    font-size: 62px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

export const RaffleTextWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
  padding-top: 30px;
`;

export const UserInfoLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
`;

export const UserInfoLabel = styled(H5)`
  color: #273135;
  font-size: 15px;
  font-weight: 500;
  line-height: normal;
  opacity: 0.8;
`;

export const UserName = styled(H5)`
  color: #273135;
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;
`;

export const RaffleText = styled(H5)`
  @media ${device.mobileS} {
    color: #273135;
    font-size: 18px;
    font-weight: 500;
    line-height: normal;
  }
`;

export const InfoLayout = styled.div`
  @media ${device.mobileS} {
    margin-top: 25px;
    display: flex;
    padding: 10px 24px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 8px;
    background: rgba(84, 85, 85, 0.1);
    min-height: 86px;
  }
`;
export const InfoText = styled(H5)`
  @media ${device.mobileS} {
    color: #000;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 127%;
  }
`;
export const BumperLayout = styled.div`
  @media ${device.mobileS} {
    margin-top: 40px;
  }
`;
export const BumperTitle = styled(H2)`
  @media ${device.mobileS} {
    color: #000;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 127%;
  }
`;
export const BumperImage = styled.img`
  @media ${device.mobileS} {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-shrink: 0;
    margin-top: 15px;
    border-radius: 6px;
    width: 100%;
    border: 1.5px dashed #c99913;
  }
`;
export const BumperInfo = styled(H5)`
  @media ${device.mobileS} {
    margin-top: 11px;
    color: #000;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 127%;
  }
`;
export const DailyLayout = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
  overflow-x: auto;
  justify-content: space-between;
  gap: 10px;
`;
export const DailyImage = styled.img`
  @media ${device.mobileS} {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-bottom: 15px;
    border: 1.5px dashed #c99913;
    border-radius: 6px;
  }
`;

export const DailyInfo = styled(H5)`
  padding-bottom: 20px;
  @media ${device.mobileS} {
    color: #000;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 127%;
    margin-top: 11px;
  }
`;
