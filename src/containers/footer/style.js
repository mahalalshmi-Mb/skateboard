import styled from "styled-components";
import { device } from "../../commons/util/helperFunctions";
import { Link } from "react-router-dom";

export const Wrapper = styled.section`
  width: 100%;
  background: ${(props) => props?.bgColor || "#D9E7FF"};
  color: ${(props) => props?.color || "#150764"};
`;
export const ContentContainer = styled.div`
  width: 100%;
  padding: 24px 24px 60px 24px;

  @media ${device.laptop} {
    padding: 29px 48px 24px 48px;
  }
`;
export const SectionWrapperOne = styled.div`
  display: flex;
  flex-direction: column;

  @media ${device.laptop} {
    flex-direction: ${(props) => (props?.hasContent ? "row-reverse" : "row")};
    border-bottom: 1px solid #a5b9da;
  }
`;
export const SectionOne = styled.div`
  width: 100%;
  padding-bottom: 24px;
  border-bottom: 1px solid #a5b9da;

  @media ${device.laptop} {
    width: 50%;
    padding-left: 58px;
    border-bottom: none;
  }
`;
export const NavLinksContainer = styled.div`
  width: 100%;
`;
export const NavLinksSectionTitle = styled.div`
  font-size: 28px;
`;
export const NavLinksWrapper = styled.div`
  width: 100%;
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;

  @media ${device.laptop} {
    margin-top: 35px;
    gap: 35px 58px;
  }
`;
export const NavLinksCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(50% - 24px);
  height: fit-content;
  padding: 20px 12px;
  gap: 16px;

  border-radius: 20px;
  border: ${(props) => `2px solid ${props?.borderColor}` || `2px solid #fff`};
  cursor: pointer;

  @media ${device.tablet} {
    width: 156px;
    height: fit-content;
  }

  @media ${device.laptop} {
    width: 156px;
    height: fit-content;
  }
`;
export const NavLinksIcon = styled.img`
  display: flex;
  width: 50px;
  height: 50px;
`;
export const NavLinksTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 12px;
  line-height: 22px;
`;
export const NavLinksTitle = styled.div`
  text-align: center;
  font-size: 12px;
  line-height: 22px;
`;
export const NavLinksSubTitle = styled.div`
  text-align: center;
  font-size: 12px;
  line-height: 22px;
`;
export const SectionTwo = styled.div`
  margin-top: 24px;
  padding-bottom: 24px;

  @media ${device.laptop} {
    width: 100%;
    padding-right: 24px;
    border-right: ${(props) =>
      props?.hasContent ? "1px solid #a5b9da" : "none"};
    border-bottom: none;
  }
`;
export const LogoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const Logo = styled.img``;
export const DescWrapper = styled.div`
  margin-top: 16px;
  font-size: 12px;

  @media ${device.laptop} {
    font-size: 18px;
  }
`;
export const SocialMediaLinksWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 0px 8px;
`;
export const SocialLink = styled.ul`
  padding: 0px;
  margin: 0px;
  cursor: pointer;
`;
export const SocialLogo = styled.img`
  width: 18px;
  height: 18px;

  @media ${device.laptop} {
    width: 20px;
    height: 20px;
  }
`;
export const OtherLinksWrapper = styled.ul`
  margin: 32px 0px 0px 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px 0px;
  margin: 32px 0px 0px 0px;
  padding: 0px;

  @media ${device.laptop} {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 32px 40px;
  }
`;
export const OtherLinksText = styled.li`
  font-size: 14px;
  list-style: none;
  margin: 0px;
  padding: 0px;
  cursor: pointer;
  text-decoration: none;
  color: ${(props) => props.color || "#150764"};

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
export const SectionThree = styled.div`
  padding-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-top: 1px solid #a5b9da;
`;
export const Copyright = styled.div`
  text-align: center;
  font-size: 15px;
  line-height: 24px;

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
