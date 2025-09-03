import styled from "styled-components";
import { H3, Image, SecondaryButton } from "theme/globalStyleSheet";
import { device } from "commons/util/helperFunctions";
import Text from "components/atoms/Text";

export const Page = styled.div``;

export const BookingSection = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: 0px;
  background: linear-gradient(139.33deg, #60678b -35.77%, #1f2131 140.71%);
  padding-bottom: 40px;
`;

export const BookingHeader = styled(H3)`
  font-size: 28px;
  line-height: 130%;
  text-align: center;
  color: #ffffff;
  padding-top: 40px;
`;

export const BookingDetailsWrapper = styled.div`
  background: #ffffff;
  border: 2px solid #dcdcdc;
  box-shadow: -4px 4px 27px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin: 0px 24px;
  margin-top: 24px;
  padding: 16px 20px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const BgImageRight = styled.div`
  position: absolute;
  right: -58%;
  top: -35%;
  opacity: 0.8;
  mix-blend-mode: overlay;
`;
export const BgImageLeft = styled.div`
  position: absolute;
  bottom: -35%;
  opacity: 0.8;
  mix-blend-mode: overlay;
  left: -10px;
`;

export const RelaxationSection = styled.section`
  width: 100%;
  background: linear-gradient(
    180deg,
    rgba(231, 242, 243, 0) 18.94%,
    rgba(231, 242, 243, 0.888446) 33.56%,
    #e7f2f3 91.07%
  );
  border-radius: 0px;
  padding: 32px 0px 40px 0px;
`;
export const SectionHeader = styled.div`
  font-weight: 700;
  font-size: 21px;
  line-height: 27px;
  color: #222222;
  padding-left: 24px;
  max-width: 300px;
`;
export const CarouselContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 0px 24px;
  padding: 24px 24px 0px 24px;
  overflow-x: auto;
`;
export const RelaxationCard = styled.div`
  width: 225px;
  height: 265px;
  min-width: 225px;
  min-height: 265px;
  background: ${(props) =>
    `linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 148.97%),url(${props.image})`};
  border-radius: 6px;
  padding: 20px 16px 16px 16px;
`;
export const CardContentContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const CardTitleWrapper = styled.div`
  width: 100%;
`;
export const CardTitleImage = styled.img``;
export const CardTitle = styled.div`
  padding-top: 5px;
  font-weight: 700;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
  max-width: 40px;
`;
export const CardMetaDataWrapper = styled.div`
  width: 100%;
`;
export const CardLocationWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0px 8px;
`;
export const LocationIcon = styled.img``;
export const LocationText = styled.div`
  font-weight: 700;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
`;
export const CardSubTitle = styled.div`
  font-weight: 500;
  font-size: 11px;
  line-height: 15px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
  padding-top: 6px;
`;
export const CardSubDesc = styled.div`
  font-weight: 300;
  font-size: 12px;
  line-height: 16px;
  color: #ffffff;
  opacity: 0.9;
  padding-top: 4px;

  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const InfoContainer = styled.div`
  width: 100%;
  padding: 41px 24px 0px 24px;
`;
export const InfoTitle = styled.div`
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #222222;
`;
export const InfoItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px 0px;
  width: 100%;
  padding: 24px 0px 0px 4px;
`;
export const InfoItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0px 24px;
`;
export const InfoImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
`;
export const InfoImage = styled.img``;
export const InfoText = styled.div``;
export const InfoSubTitleText = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
  color: #273135;
`;
export const InfoDescText = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  color: #273135;
  opacity: 0.6;
  padding-top: 8px;
`;

export const CreditCardEntrySection = styled.section`
  margin: 30px 0px;
  display: flex;
  flex-direction: column;
  gap: 28px;

  @media ${device.laptop} {
    gap: 16px;
    align-items: center;
    margin-bottom: 0px;
    margin-top: 20px;
  }
`;
export const CCEntryTitle = styled(Text)`
  width: 250px;
  font-size: 20px;
  font-style: normal;
  line-height: 130%; /* 26px */
  font-weight: 700;

  @media ${device.laptop} {
    font-size: 16px;
    font-weight: 600;
    line-height: 21.86px;
    width: auto;
  }
`;
export const CCCardsWrapper = styled.div`
  display: flex;
  gap: 16px;

  @media ${device.laptop} {
    width: 100%;
    justify-content: space-between;
  }
`;
export const CCImage = styled(Image)``;
export const CCBookButton = styled(SecondaryButton)``;

export const LoungeProvisionsWrapper = styled.div`
  margin: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const LoungeProvisionsTitle = styled.div`
  width: 250px;
  font-size: 20px;
  font-style: normal;
  line-height: 130%; /* 26px */
`;

export const LPCarouselContainer = styled.div`
  width: 100%;
  overflow: auto;
  display: flex;
  gap: 24px;
`;

export const LPCardImage = styled.div`
  width: 224px;
  height: 266px;
  min-width: 225px;
  min-height: 265px;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
`;

export const LPImage = styled.div`
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  background: ${(props) =>
    `linear-gradient(180deg, rgba(0, 0, 0, 0.50) 8.07%, rgba(0, 0, 0, 0.00) 100%), url(${props.image}) lightgray 100% / cover no-repeat`};
  border-radius: 6px;
`;

export const CardImageContentWrapper = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column; /* Stack content vertically */
  justify-content: space-between;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, #000 100%);
  border-radius: 6px;
`;

export const CardImageIconTitleWrapper = styled.div``;

export const CardImageIcon = styled.div`
  width: 20px;
  height: 22px;
  flex-shrink: 0;
  background-image: ${(props) => (props.icon ? `url(${props.icon})` : "none")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const CardImageTitle = styled.div`
  padding-top: 15px;
  max-width: 70px;
  color: #fff;
  font-size: 13px;
  line-height: normal;
  letter-spacing: 1.3px;
  text-transform: uppercase;
`;

export const CardImageTerminalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-shrink: 0;
`;

export const CardImageTerminalLocationIcon = styled.div`
  width: 10.67px;
  height: 14.77px;
  flex-shrink: 0;
  background-image: ${(props) => (props.icon ? `url(${props.icon})` : "none")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
`;

export const CardImageTerminal = styled.div`
  color: #fff;
  font-family: Manrope;
  font-size: 14px;
  line-height: 130%; /* 18.2px */
  z-index: 0;
`;
export const FAQWrapper = styled.div`
  padding: 0 24px;
  display: flex;
  flex-direction: column;
`;

export const FAQTitle = styled.div`
  color: #000;
  font-size: 20px;
  line-height: 26px;
`;

export const AccordionContainer = styled.div`
  width: 100%;
  margin-top: 8px;
`;
