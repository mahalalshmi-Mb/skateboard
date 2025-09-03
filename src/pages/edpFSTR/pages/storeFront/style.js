import { device } from "commons/util/helperFunctions";
import styled from "styled-components";
import { colors } from "theme/colors";
import { H4, SpacedOutRow, T4, T5 } from "theme/globalStyleSheet";

export const Wrapper = styled.div`
  width: 100%;
  position: relative;
  padding: 24px 24px 48px 24px;
  background-color: ${colors?.pageBackground?.primary};

  @media ${device.laptop} {
    padding: 48px 160px 75px 160px;
  }
`;
export const InfoBannerContainerMobile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px;
  margin-bottom: 24px;
  border-radius: 4px;
  background-color: #ededed;

  @media ${device.laptop} {
    display: none;
  }
`;
export const InfoBannerContainerDesktop = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: fit-content;
    height: 52px;
    padding: 8px;
    border-radius: 4px;
    background-color: #ededed;
    gap: 24px;
  }
`;
export const InfoBannerText = styled.div`
  font-size: 12px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
export const InfoBannerCloseIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;
export const GoBackContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 18px;

  @media ${device.laptop}, ${device.tablet} {
    gap: 24px;
  }
`;
export const StoreSelectionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;

  @media ${device.laptop} {
    flex: none;
  }
`;
export const StoreSelectionWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;

  width: 100%;
  height: 36px;

  @media ${device.laptop} {
    width: 280px;
    min-width: 280px;
    max-width: 280px;
    height: 52px;
  }
`;
export const StoreBannerContainer = styled.section`
  width: 100%;
  height: 160px;
  margin-top: 24px;
  border-radius: 8px;

  @media ${device.tablet} {
    height: 320px;
  }

  @media ${device.laptop} {
    height: 460px;
  }
`;
export const StoreBanner = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;
export const StoreDetailsContainer = styled.section`
  width: 100%;
  margin-top: 24px;
  position: relative;
`;
export const StoreSectionContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
`;
export const StoreDetailsWrapper = styled(SpacedOutRow)`
  width: 100%;
  align-items: flex-start;
  margin-top: 24px;
`;
export const StoreLogoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;
export const StoreLogo = styled.img`
  width: 40px;
  height: 40px;
  filter: ${({ showInGrayscale }) =>
    showInGrayscale ? "grayscale(100%)" : "none"};

  @media ${device.laptop} {
    width: 80px;
    height: 80px;
  }
`;
export const StoreMetaDataContainer = styled.div`
  width: 100%;
`;
export const StoreName = styled(H4)``;
export const StoreLocation = styled(T4)`
  margin-top: 4px;
`;
export const PrepTimeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 2px;
`;
export const PrepTimeIcon = styled.img`
  width: 16px;
  height: 16px;
`;
export const PrepTime = styled(T5)``;
export const SearchBarContainer = styled.section`
  width: 100%;
  margin-top: 24px;

  @media ${device.laptop} {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;
export const SearchImage = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;
export const ContentContainer = styled.section`
  width: 100%;
  margin-top: 36px;

  @media ${device.laptop} {
    margin-top: 24px;
    border-top: 1px solid ${colors?.border};
    display: flex;
    align-items: flex-start;
    gap: 0px 39px;
  }
`;
export const CategoryScrollerContainer = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: ${({ isDineIn }) => (isDineIn ? `0px` : "116px")};
  z-index: 9;
  margin-left: -24px;
  width: calc(100% + 48px);
  display: flex;
  align-items: center;
  gap: 16px;

  @media ${device.laptop} {
    top: 126px;
    padding-top: 4px;
    z-index: 1;
    width: auto;
    gap: 0px;
  }
`;
export const CategoryScrollerWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background: #fff;
  overflow-x: auto;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }

  @media ${device.laptop} {
    width: 280px;
    min-width: 280px;
    max-width: 280px;
    flex-direction: column;
    align-items: flex-start;
  }
`;
export const CategoryCard = styled.div`
  white-space: nowrap;
  font-size: 16px;
  padding: 12px 20px 12px 12px;
  color: ${colors?.text?.black200};
  cursor: pointer;
  border-bottom: ${(props) =>
    props.selected ? `2px solid ${colors?.primary}` : "none"};

  @media ${device.laptop} {
    width: 100%;
    border-right: 1px solid ${colors?.border};
    color: ${(props) =>
      props.selected ? colors?.text?.white300 : colors?.text?.black200};
    background-color: ${(props) =>
      props.selected ? colors?.primary : "transparent"};
    white-space: normal;

    &:hover {
      background-color: ${(props) =>
        props.selected ? colors?.primary : "#efefef"};
      opacity: ${(props) => (props.selected ? 0.7 : 1)};
    }
  }
`;
export const CategoryListingContainer = styled.div`
  width: 100%;

  @media ${device.laptop} {
    padding-top: 4px;
  }
`;
export const StoreListMenuItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
export const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
export const MoreInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  cursor: pointer;
  position: absolute;
  top: 0px;
  right: 0px;
`;
export const MoreInfo = styled.div`
  font-size: 12px;
  color: ${colors?.text?.black200};
  text-decoration: underline;

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
export const MoreInfoIcon = styled.img`
  width: 24px;
  height: 24px;
`;
export const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;
export const Spacer = styled.div`
  margin-top: auto;
`;
export const StoreActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;
export const StoreDataContainer = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;
export const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;

  @media ${device.laptop} {
    justify-content: space-between;
  }
`;
