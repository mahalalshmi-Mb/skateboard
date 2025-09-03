import { device } from "commons/util/helperFunctions";
import styled from "styled-components";
import { colors } from "theme/colors";
import { AddButton, PrimaryButton } from "theme/globalStyleSheet";

export const PageWrapper = styled.div`
  width: 100%;
  background-color: ${colors?.pageBackground?.secondary};
`;
export const ContentContainer = styled.div`
  width: 100%;
  padding: 24px 24px 150px 24px;

  @media ${device.laptop} {
    padding: 0px;
    max-width: 720px;
    margin: 0 auto;
  }
`;
export const HeaderWrapper = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px 38px;
`;
export const OrderConfirmedImage = styled.img`
  width: 130px;
  height: 130px;

  @media ${device.laptop} {
    width: 186px;
    height: 186px;
  }
`;
export const Title = styled.div`
  margin-top: 16px;
  font-size: 24px;
  color: ${colors?.text?.black200};
  text-align: center;

  @media ${device.laptop} {
    font-size: 40px;
  }
`;
export const Desc = styled.div`
  margin-top: 16px;
  font-size: 14px;
  color: ${colors?.text?.gray200};
  text-align: center;

  @media ${device.laptop} {
    margin-top: 20px;
    font-size: 16px;
  }
`;
export const OrderDetailsContainer = styled.section`
  width: 100%;
  margin-top: 42px;
  border-radius: 8px;
  border: 1px solid ${colors?.text?.white200};
`;
export const OrderDetailsWrapper = styled.div`
  width: 100%;
  padding: 16px;
  background-color: #efefef;
  border-radius: 8px 8px 0px 0px;
`;
export const OrderDetailsText = styled.div`
  color: ${colors?.text?.black200};
  font-size: 12px;

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
export const OrderItemsContainer = styled.div`
  width: 100%;
  padding: 4px 16px;
  background-color: ${colors?.text?.white300};
`;
export const InvoiceTextContainer = styled.div`
  width: 100%;
  margin-top: 24px;
  padding: 12px 16px;
  background-color: #dcfce8;
  border: 1px solid #4ade80;
  border-radius: 8px;

  font-size: 12px;
  color: #16a34a;

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
export const ActionButtonContainer = styled.div`
  position: fixed;
  bottom: 0px;
  display: flex;
  gap: 0px 10px;
  justify-content: center;
  padding: 20px 24px;
  width: 100%;
  z-index: 9;
  background-color: #fff;

  @media ${device.laptop} {
    max-width: 720px;
    margin: 0 auto;
    position: relative;
    margin-top: 40px;
    justify-content: flex-end;
    z-index: inherit;
    background-color: transparent;
    padding: 0px 0px 70px 0px;
  }
`;
export const ActionButtonSecondary = styled(AddButton)`
  width: 100%;
  text-align: center;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;
  text-transform: uppercase;

  @media ${device.laptop} {
    max-width: 166px;
  }
`;
export const ActionButtonPrimary = styled(PrimaryButton)`
  text-align: center;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;
  text-transform: uppercase;

  @media ${device.laptop} {
    max-width: 166px;
  }
`;
