import styled from "styled-components";
import { device } from "../../../../../../commons/util/helperFunctions";
import { colors } from "theme/colors";
import { SpacedOutRow } from "theme/globalStyleSheet";

export const PageWrapper = styled.section`
  width: 100%;
  height: 100vh;
  background-color: #f4f4f4;
  position: relative;

  @media ${device.laptop} {
    height: 100%;
    overflow-y: hidden;
  }
`;
export const GoBackContainer = styled.div`
  width: 100%;
  padding: 24px 20px 0px 24px;

  @media ${device.laptop} {
    padding: 24px 136px 0px 136px;
  }
`;
export const ContentContainer = styled.div`
  width: 100%;
  background-color: #f4f4f4;
  padding: 12px 20px 48px 24px;

  @media ${device.laptop} {
    padding: 12px 136px 48px 136px;
    display: flex;
    gap: 32px;
    height: 100%;
    overflow-y: hidden;
  }
`;
export const ContentWrapper = styled.div`
  width: 100%;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }

  @media ${device.laptop} {
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow-y: scroll;
  }
`;
export const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;
export const PageTitle = styled.div`
  font-size: 26px;
  line-height: 32px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 34px;
  }
`;
export const OrderNumberWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 0.5px solid #dedddd;
  border-radius: 8px;
  margin-top: 24px;
  background-color: #fff;
`;
export const OrderNumberContainer = styled(SpacedOutRow)``;
export const OrderNumberText = styled.div``;
export const OrderNumberLabel = styled.div`
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.01em;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
export const OrderNumberValue = styled.div`
  font-size: 18px;
  line-height: 22px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 20px;
  }
`;
export const DownloadReceipt = styled.div`
  font-size: 12px;
  color: ${colors?.text?.actionTextColor};
  text-decoration: underline;
  word-break: break-all;
  cursor: pointer;

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
export const OrderStatusContainer = styled.div``;
export const OrderStatusWrapper = styled.div`
  padding: 4px 8px;
  border-radius: 2px;
  background-color: #cceff1;

  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.01em;
  color: #273135;
  text-transform: uppercase;
`;
export const OrderListingContainer = styled.div`
  width: 100%;
  margin-top: 24px;
  border: 0.5px solid #dedddd;
  border-radius: 8px;
  background-color: #fff;
`;
export const AccordianContentContainer = styled.div`
  width: 100%;
`;
export const ItemCardContainer = styled.div`
  width: 100%;
  padding: 16px 0px 0px 0px;
`;
export const OrderTotalContainer = styled.div`
  width: 100%;
  margin-top: 24px;

  @media ${device.laptop} {
    margin-top: 32px;
  }
`;
export const OrderTotalTitle = styled.div`
  font-size: 20px;
  line-height: 24px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    display: none;
  }
`;

export const OrderTotalTitleDesktop = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    font-size: 20px;
    line-height: 24px;
    color: ${colors?.text?.black200};
  }
`;

export const OrderTotalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 22px;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #fff;
  gap: 8px 0px;
`;
export const PriceSummaryItemWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const PriceSummaryLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 18px;
  color: ${colors?.text?.black300};

  @media ${device.laptop} {
    font-size: 18px;
  }
`;
export const PriceSummaryValue = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: ${colors?.text?.black300};

  @media ${device.laptop} {
    font-size: 18px;
  }
`;
export const TaxDownArrow = styled.img`
  width: 18px;
  height: 18px;
  margin-left: 4px;

  transform: ${({ expanded }) => !expanded && "rotate(-180deg)"};
`;
export const DashedBorder = styled.div`
  height: 1px;
  background: #f4f4f5;
  border: 0.5px dashed #000000;
  opacity: 0.3;
`;
export const PreviewImageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #000;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 9999;
`;
export const PreviewImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
`;
export const PreviewCloseIconWrapper = styled.div`
  position: absolute;
  top: 50px;
  right: 24px;
  cursor: pointer;
`;
export const PreviewCloseIcon = styled.img``;
export const PreviewImage = styled.img`
  width: 225px;
  height: 225px;
`;
export const SubOrderNumberContainer = styled.div`
  width: 100%;
  margin-top: 12px;
  display: flex;
  gap: 4px;
`;
export const SubOrderNumberLabel = styled.div`
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.01em;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
export const SubOrderNumberValue = styled.div`
  font-size: 18px;
  line-height: 22px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 20px;
  }
`;

export const ChargeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0px 8px;
`;
export const InfoEmployeeIcon = styled.img`
  width: 14px;
  height: 14px;
  cursor: pointer;
`;
export const TooltipBox = styled.div`
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 12px;
  color: #333;
  width: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
  border-radius: 4px;
  white-space: normal;
  text-align: left;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: #ccc transparent transparent transparent;
  }

  &::before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: #fff transparent transparent transparent;
  }
`;
export const IconWithTooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;
export const NoDataContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;

  @media ${device.laptop} {
    height: 100vh;
  }
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
