import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";

export const PageWrapper = styled.div`
  width: 100%;
  background-color: #fff7ef;
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

  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.1em;
  color: ${({ isSelected }) => (isSelected ? "#273135" : "#A9ADAE")};
  cursor: pointer;

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
export const OrderListingWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  gap: 16px;
`;
export const NoDataContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
`;
export const NoDataText = styled.div`
  font-size: 18px;
  line-height: 24px;
  color: #273135;
  max-width: 180px;
  text-align: center;
  padding-top: 16px;
`;
