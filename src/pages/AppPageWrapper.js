import { Fragment, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { device } from "../commons/util/helperFunctions";
import Util from "../commons/util/util";
import Footer from "../containers/footer/footer";

import CustomSnackbar from "../components/organisms/customSnackbar";
import CustomFlightAlert from "../containers/customFlightAlert/customFlightAlert";
import Header from "../containers/header/header";
import { FlightAlertContext } from "../context/flightAlertContext";
import { NavContext } from "../context/navContext";

import { isMobile } from "react-device-detect";
import { Toaster } from "react-hot-toast";
import { getAppConfig } from "../commons/util/appConfigHelper";
import CookieBanner from "../components/molecules/CookieBanner";
import ScrollToTopButton from "../components/molecules/ScrollToTopButton";
import DineInBottomNav from "../containers/bottomNavMobile/DineInBottomNav";
import MainSwitch from "../routes/MainSwitch";
import "./AppPageWrapperStyle.css";
import AccessibilityWidget from "./accessibilityWidget/accessibilityWidget";
import CustomChatBot from "./chatBot/customChatBot";
import SoftLaunchPrompt from "./edpFSTR/productComponents/organisms/SoftLaunchPrompt";
import { getSessionStorage } from "util/storageUtil";
import { fetchDarkSitePromptData, fetchSoftLaunchPromptData } from "util/Util";
import DarkSitePrompt from "./edpFSTR/productComponents/organisms/DarkSitePrompt";

export default function AppPageWrapper(props) {
  const useNav = useContext(NavContext);
  const useFlightAlert = useContext(FlightAlertContext);
  const [showSoftLaunchPrompt, setShowSoftLaunchPrompt] = useState(false);
  const [softLaunchData, setSoftLaunchData] = useState({});
  const [showDarkSitePrompt, setShowDarkSitePrompt] = useState(false);
  const [darkSiteData, setDarkSiteData] = useState({});

  const { pathname } = useLocation();

  useEffect(() => {
    getSoftLaunchPromptData();
    getDarkSiteData();
  }, []);

  const getSoftLaunchPromptData = async () => {
    const isCheckinPage = pathname?.includes("/travellers/checkin");
    if (
      getAppConfig("SHOW_SOFT_LAUNCH_PROMPT") &&
      !getSessionStorage("hideSoftLaunchPrompt") &&
      !isCheckinPage
    ) {
      const data = await fetchSoftLaunchPromptData();
      setSoftLaunchData(data);
      setShowSoftLaunchPrompt(true);
    }
  };

  const getDarkSiteData = async () => {
    if (getAppConfig("SHOW_DARK_SITE_PROMPT")) {
      const data = await fetchDarkSitePromptData();
      setDarkSiteData(data);
      setShowDarkSitePrompt(true);
    }
  };

  const handleSoftLaunchPromptClick = () => {
    setShowSoftLaunchPrompt(false);
  };

  const handleDarkSitePromptClick = () => {};

  return (
    <AppWrapper>
      <Toaster
        containerStyle={{
          top: 100,
          zIndex: 999,
        }}
      />
      {/* {!Util.checkMarketingPage(pathname) ? (
        <ChatBot
          showChatBot={getAppConfig("ENABLED_CHATBOT")}
          chatBotUrl={getAppConfig("CHATBOT_URL")}
          path={pathname}
        />
      ) : null} */}

      {pathname === "/" && getAppConfig("ENABLED_CHATBOT") ? (
        <CustomChatBot path={pathname} />
      ) : null}
      {getAppConfig("ENABLED_ACCESSIBILITY_WIDGET") && <AccessibilityWidget />}

      {pathname !== "/sureroute-test-object" &&
      !Util.checkMarketingPage(pathname) &&
      useNav.showHeaderNav ? (
        <Header {...props} />
      ) : null}

      <CustomSnackbar />
      <PageContainer
        showHeader={useNav.showHeaderNav}
        page={pathname}
        showGlobalSearch={useNav.isGlobalSearchVisible}
        showGetAppPrompt={useNav.showGetAppPrompt}
      >
        <MainSwitch {...props} />
        {!Util.isWebView() &&
        pathname !== "/sureroute-test-object" &&
        !Util.checkMarketingPage(pathname) &&
        pathname !== "/travellers/profile/referral" &&
        useNav.showFooter ? (
          pathname === "/" && getAppConfig("SHOW_HOMEPAGE_SOS_BANNER") ? (
            <div className="sos-footer-wrapper">
              <Footer {...props} />
            </div>
          ) : (
            <Footer {...props} />
          )
        ) : null}
        {/* {useNav.showBottomNav && getSessionStorage("showBottomNav") && (
          <PaddingBottomSubstitute />
        )} */}
      </PageContainer>
      {useFlightAlert.isOpen ? <CustomFlightAlert /> : null}
      {/* {pathname !== "/sureroute-test-object" &&
      !Util.checkMarketingPage(pathname) &&
      useNav.showBottomNav &&
      getSessionStorage("showBottomNav") ? (
        <BottomNavMobile {...props} />
      ) : null} */}
      {useNav.showDineInBottomTab ? <DineInBottomNav {...props} /> : null}
      {!Util.isWebView() &&
      pathname !== "/sureroute-test-object" &&
      pathname !== "/travellers/checkin" ? (
        <CookieBanner />
      ) : null}
      {useNav.isScrollToTopVisible && (
        <ScrollToTopContainer>
          <ScrollToTopButton />
        </ScrollToTopContainer>
      )}
      {showSoftLaunchPrompt && (
        <SoftLaunchPrompt
          isDrawerOpen={showSoftLaunchPrompt}
          setIsDrawerOpen={setShowSoftLaunchPrompt}
          successHandler={handleSoftLaunchPromptClick}
          data={softLaunchData}
        />
      )}
      {showDarkSitePrompt && (
        <DarkSitePrompt
          isDrawerOpen={showDarkSitePrompt}
          setIsDrawerOpen={setShowDarkSitePrompt}
          successHandler={handleDarkSitePromptClick}
          data={darkSiteData}
        />
      )}
    </AppWrapper>
  );
}

const ScrollToTopContainer = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    position: fixed;
    z-index: 9999999;
    bottom: 50px;
    right: 24px;
    left: auto;
  }
`;

const AppWrapper = styled.div`
  height: 100%;
`;

const PageContainer = styled.div`
  height: 100%;
  padding-top: ${(props) =>
    props.showHeader && !Util.checkMarketingPage(props.page) ? "116px" : null};

  @media ${device.laptop} {
    padding-top: ${(props) =>
      props.showHeader && !Util.checkMarketingPage(props.page)
        ? "126px"
        : null};
  }
`;

const PaddingBottomSubstitute = styled.div`
  padding-bottom: ${(props) =>
    !Util.checkMarketingPage(props.page) ? "60px" : "30px"};

  @media ${device.laptop} {
    padding-bottom: ${(props) =>
      !Util.checkMarketingPage(props.page) ? "0px" : "30px"};
  }
`;
