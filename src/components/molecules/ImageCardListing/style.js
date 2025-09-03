import styled from "styled-components";
import { device } from "../../../commons/util/helperFunctions";
import { H5, PrimaryButton } from "../../../theme/globalStyleSheet";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export const ArtistImagesLayout = styled.div`
  display: flex;
  margin-top: 40px;
  flex-wrap: ${(props) => props?.wrap};
  width: 100%;
  overflow-x: ${(props) => props?.scroll};

  @media ${device.mobileS} {
    padding: ${(props) => (props?.isPadded ? `0` : `0 0 0 24px`)};
  }
  @media ${device.laptop} {
    padding: ${(props) => (props?.isPadded ? `0` : `16px 0 0 50px`)};
  }
  @media ${device.laptopL} {
    padding: ${(props) => (props?.isPadded ? `0` : `16px 0 0 134px`)};
  }
`;
export const ImageBlock = styled.div`
  flex-shrink: 0;
  margin-bottom: 40px;
  cursor: ${(props) => props?.cursor};
`;

export const ArtistImage = styled(LazyLoadImage)`
  height: 235.856px;
  width: 212px;
  border-radius: 8px;
  background: ${(props) => `linear-gradient(
    180deg,
    rgba(152, 190, 193, 0.4) 0%,
    rgba(0, 4, 4, 0.01) 78.15%,
    rgba(39, 49, 53, 0) 100%
  ),
  ${props?.bcolor || "#fff"}`};

  @media ${device.mobileS} {
    width: 145px;
    height: 170px;
    margin: 0 22px 0 0;
  }

  @media ${device.mobileM} {
    width: 152px;
    height: 175px;
  }

  @media ${device.mobileP} {
    width: 160px;
    height: 182px;
  }

  @media ${device.mobileX} {
    width: 170px;
    height: 200px;
  }
  @media ${device.mobileL} {
    width: 185px;
    height: 200px;
  }
  @media ${device.tablet} {
    width: 162px;
    height: 180px;
  }
  @media ${device.laptop} {
    height: 240.856px;
    width: 212.8px;
    margin: 0 20px 0 0;
  }

  @media ${device.laptopM} {
    height: 240.856px;
    width: 216.8px;
    margin: 0 20px 0 0;
  }

  @media ${device.laptopL} {
    height: 250.856px;
    width: 217.8px;
    margin: 0 22px 0 0;
  }

  @media ${device.laptopX} {
    height: 250.856px;
    width: 228.8px;
    margin: 0 28px 0 0;
  }
`;
export const ArtistName = styled(H5)`
  flex-shrink: 0;
  color: #1e1e1e;
  font-size: 21px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-top: 20px;
  width: 212px;

  @media ${device.mobileS} {
    font-size: 16px;
    width: 160px;
    margin-top: 12px;
  }

  @media ${device.laptop} {
    font-size: 21px;
    width: 212px;
    margin-top: 20px;
  }
`;
export const ArtistInfo = styled(H5)`
  flex-shrink: 0;
  color: #1e1e1e;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  opacity: 0.6;
  width: 212px;

  @media ${device.mobileS} {
    font-size: 14px;
    width: 160px;
    opacity: 1;
  }

  @media ${device.laptop} {
    font-size: 18px;
    width: 212px;
    opacity: 0.6;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

export const Title = styled.div`
  color: #1e1e1e;
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  @media ${device.mobileS} {
    font-size: 21px;
    font-weight: 700;
  }
  @media ${device.laptop} {
    font-size: 32px;
    font-weight: 600;
  }
`;

export const ViewAllBtn = styled(PrimaryButton)`
  display: flex;
  width: 130px;
  height: 49px;
  padding: 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 58px;
  background: #037b79;
`;
export const MobileViewAllBtn = styled(H5)`
  width: 100px;
  height: 21.972px;
  flex-shrink: 0;
  color: #037b79;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding-top: 3px;
`;

export const BtnText = styled(H5)`
  color: #fff;
  font-size: 18px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
`;
export const ArtistCount = styled(H5)`
  color: #1e1e1e;
  font-size: 21px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px;
  opacity: 0.7;

  @media ${device.mobileS} {
    font-size: 18px;
    font-weight: 500;
  }
  @media ${device.laptop} {
    font-size: 21px;
    font-weight: 600;
  }
`;

export const Break = styled(H5)`
  flex-basis: 100%;
  width: 0px;
  height: 0px;
  overflow: hidden;
`;
