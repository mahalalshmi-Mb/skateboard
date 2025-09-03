import { useEffect, useState } from "react";
import Text from "../../components/atoms/Text";
import Loader from "../../components/atoms/loader";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { getSessionStorage } from "../../util/storageUtil";
import {
  ContentContainer,
  Copyright,
  DescWrapper,
  Logo,
  LogoWrapper,
  NavLinksCard,
  NavLinksContainer,
  NavLinksIcon,
  NavLinksSectionTitle,
  NavLinksTextWrapper,
  NavLinksWrapper,
  OtherLinksText,
  OtherLinksWrapper,
  SectionOne,
  SectionThree,
  SectionTwo,
  SectionWrapperOne,
  SocialLink,
  SocialLogo,
  SocialMediaLinksWrapper,
  Wrapper,
} from "./style";
import CustomPicture from "components/molecules/customPicture";

function Footer(props) {
  const { pushHistory } = useCustomNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [footerData, setFooterData] = useState([]);

  useEffect(() => {
    let newFooterData = getSessionStorage("footer");
    if (newFooterData) {
      setFooterData(newFooterData);
      setIsLoading(false);
    }
  }, []);

  const handleRedirection = (redirectUrl, isExternal) => {
    if (isExternal) {
      window.open(redirectUrl, "_blank");
    } else {
      pushHistory(redirectUrl);
    }
  };

  const fetchImageURL = (mobileImage, desktopImage) => {
    return (
      <CustomPicture
        mobilePicture={mobileImage}
        desktopPicture={desktopImage}
      />
    );
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <Wrapper
        bgColor={footerData?.attributes?.bgcolor || "transparent"}
        color={footerData?.attributes?.font || "#273135"}
      >
        <ContentContainer>
          <SectionWrapperOne
            hasContent={footerData?.attributes?.NavigationLinks?.length > 0}
          >
            {footerData?.attributes?.NavigationLinks?.length > 0 && (
              <SectionOne>
                <NavLinksContainer>
                  <NavLinksSectionTitle>
                    <Text type="bold">Shop Smart. Travel Easy.</Text>
                  </NavLinksSectionTitle>
                  <NavLinksWrapper>
                    {footerData?.attributes?.NavigationLinks?.map(
                      (item, index) => (
                        <NavLinksCard
                          borderColor={footerData?.attributes?.font || "#fff"}
                          key={index}
                          onClick={() =>
                            handleRedirection(item?.url, item?.IsExternal)
                          }
                        >
                          <NavLinksIcon
                            src={item?.image?.data?.attributes?.url || ""}
                            alt="nav-links"
                          />
                          <NavLinksTextWrapper>
                            <Text type="bold">{item?.name}</Text>
                            <Text>{item?.subtitle}</Text>
                          </NavLinksTextWrapper>
                        </NavLinksCard>
                      )
                    )}
                  </NavLinksWrapper>
                </NavLinksContainer>
              </SectionOne>
            )}
            <SectionTwo
              hasContent={footerData?.attributes?.NavigationLinks?.length > 0}
            >
              <LogoWrapper>
                {fetchImageURL(
                  footerData?.attributes?.logo?.data?.[0]?.attributes?.url,
                  footerData?.attributes?.logo?.data?.[1]?.attributes?.url
                )}
                {footerData?.attributes?.secondaryLogo?.data?.[0]?.attributes
                  ?.url &&
                  fetchImageURL(
                    footerData?.attributes?.secondaryLogo?.data?.[0]?.attributes
                      ?.url,
                    footerData?.attributes?.secondaryLogo?.data?.[1]?.attributes
                      ?.url
                  )}
              </LogoWrapper>
              {footerData?.attributes?.socialSectionHeader !== "" && (
                <DescWrapper>
                  <Text>
                    {footerData?.attributes?.socialSectionHeader || ""}
                  </Text>
                </DescWrapper>
              )}
              {footerData?.attributes?.SocialMedia?.length > 0 && (
                <SocialMediaLinksWrapper>
                  {footerData?.attributes?.SocialMedia?.map((item, index) => (
                    <SocialLink
                      key={index}
                      onClick={() =>
                        handleRedirection(item?.url, item?.IsExternal || true)
                      }
                    >
                      <SocialLogo
                        src={item.logo?.data?.attributes?.url || ""}
                        alt="social"
                      />
                    </SocialLink>
                  ))}
                </SocialMediaLinksWrapper>
              )}
              {(footerData?.attributes?.OtherLinks?.length > 0 ||
                footerData?.attributes?.DownloadLinks?.length > 0) && (
                <OtherLinksWrapper>
                  {footerData?.attributes?.OtherLinks?.map((item, index) => (
                    <OtherLinksText
                      key={index}
                      color={footerData?.attributes?.font || "#273135"}
                      onClick={() =>
                        handleRedirection(item?.url, item?.IsExternal)
                      }
                    >
                      <Text>{item?.name}</Text>
                    </OtherLinksText>
                  ))}
                  {footerData?.attributes?.DownloadLinks?.map((item, index) => (
                    <OtherLinksText
                      key={index}
                      onClick={() =>
                        handleRedirection(item?.url, item?.IsExternal)
                      }
                      color={footerData?.attributes?.font || "#273135"}
                    >
                      <Text>{item?.name}</Text>
                    </OtherLinksText>
                  ))}
                </OtherLinksWrapper>
              )}
            </SectionTwo>
          </SectionWrapperOne>
          {footerData?.attributes?.copyright !== "" && (
            <SectionThree>
              <Copyright>
                <Text type="medium">
                  {footerData?.attributes?.copyright || ""}
                </Text>
              </Copyright>
            </SectionThree>
          )}
        </ContentContainer>
      </Wrapper>
    );
  }
}

export default Footer;
