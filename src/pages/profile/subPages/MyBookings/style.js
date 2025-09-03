import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";
import { colors } from "theme/colors";

export const PageWrapper = styled.section`
  width: 100%;
  background-color: #ffffff;
`;
export const ContentContainer = styled.div`
  width: 100%;
  padding: 24px 20px 84px 24px;

  @media ${device.laptop} {
    padding: 24px 136px 48px 136px;
  }
`;
export const PageTitle = styled.div`
  font-size: 26px;
  line-height: 32px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 34px;
  }
`;
export const TabContainer = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 15px;

  @media ${device.laptop} {
    padding-top: 24px;
  }
`;
export const Tab = styled.div`
  padding: 8px 12px;
  border-radius: 30px;
  background-color: ${({ isSelected }) =>
    isSelected ? "rgba(231, 242, 243, 0.8)" : "transparent"};

  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1em;
  color: ${({ isSelected }) =>
    isSelected ? `${colors?.text?.black200}` : "#A9ADAE"};
  cursor: pointer;

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
export const OrderListingContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 24px;
  gap: 24px;
`;
export const NoDataContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
`;
export const NoDataImg = styled.img``;
export const NoDataText = styled.div`
  font-size: 20px;
  line-height: 24px;
  color: ${colors?.text?.black200};
  max-width: 180px;
  text-align: center;
  padding-top: 16px;
`;
