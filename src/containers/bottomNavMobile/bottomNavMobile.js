import React, { Fragment, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import Util from "../../commons/util/util";
import Text from "../../components/atoms/Text";
import { tabList } from "./config";

import PushAlert from "../../components/atoms/pushAlert";
import QuickSignIn from "../../components/organisms/QuickSignInDrawer/QuickSignIn";
import { isFestiveTheme } from "../FestiveThemeController/festiveThemingUtil";
import RunFestiveThemeElements from "../FestiveThemeController/RunFestiveThemeElements";
import { TabButton, TabImage, TabText, Wrapper } from "./style";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import LoginWithoutOtp from "components/organisms/LoginWithoutOtp/LoginWithoutOtp";

function BottomNavMobile() {
  const [cookies] = useCookies(["gwLoginData"]);
  const { pathname, search } = useLocation();
  const history = useHistory();
  const { url } = useRouteMatch();
  const { pushHistory } = useCustomNavigation();

  const tabs = tabList;
  const [numberOfTabs, setNumberOfTabs] = useState(5);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isQuickSignInOpen, setIsQuickSignInOpen] = useState(false);
  const [tempQuickSignInData, setTempQuickSignInData] = useState(null);

  useEffect(() => {
    let newNumberOfTabs = numberOfTabs;
    tabs.forEach((item) => {
      if (item.hide && item.hide()) {
        newNumberOfTabs -= 1;
      }
    });

    setNumberOfTabs(newNumberOfTabs);
  }, []);

  const tabClick = (linkTo, orLinkTo, tabIndex, search, loginReq) => {
    if (loginReq && !checkIfLoggedIn(linkTo, orLinkTo, tabIndex, search)) {
      return;
    }
    Util.triggerMoEngageEvent("bottom_nav_clicked", {
      linkTo: linkTo,
      tabIndex: tabIndex,
    });
    setSelectedTab(tabIndex);
    let letsLinkTo = linkTo;

    if (orLinkTo) {
      if (!cookies.gwLoginData) {
        localStorage.removeItem("module");
        letsLinkTo = orLinkTo;
      }
    }

    pushHistory(`${url}${letsLinkTo}`, {
      search: search,
    });
  };

  const isItemSelected = (pathname, linkTo, orLinkTo, tabSearch) => {
    if (orLinkTo) {
      if (
        Util.getSlug(pathname) === Util.getSlug(linkTo) ||
        Util.getSlug(pathname) === Util.getSlug(orLinkTo)
      ) {
        return true;
      }
    }

    if (search && tabSearch) {
      return (
        Util.getSlug(pathname) === Util.getSlug(linkTo) && search === tabSearch
      );
    }

    return Util.getSlug(pathname) === Util.getSlug(linkTo);
  };

  const checkIfLoggedIn = (linkTo, orLinkTo, tabIndex, search) => {
    //Login data
    if (!cookies.gwLoginData) {
      setTempQuickSignInData({
        linkTo: linkTo,
        orLinkTo: orLinkTo,
        tabIndex: tabIndex,
        search: search,
      });
      PushAlert.info("Please login to continue");
      setIsQuickSignInOpen(true);
      return false;
    }
    return true;
  };

  const handleJoinIn = () => {
    tabClick(
      tempQuickSignInData?.linkTo,
      tempQuickSignInData?.orLinkTo,
      tempQuickSignInData?.tabIndex,
      tempQuickSignInData?.search
    );
    setTempQuickSignInData(null);
  };

  return (
    <Wrapper>
      {tabs &&
        tabs.map((tabItem, index) => (
          <Fragment key={index}>
            <LoginWithoutOtp
              isDrawerOpen={isQuickSignInOpen}
              setIsDrawerOpen={setIsQuickSignInOpen}
              successHandler={handleJoinIn}
            />
            {tabItem.hide && !tabItem.hide() ? null : (
              <TabButton
                onClick={() =>
                  tabClick(
                    tabItem.linkTo,
                    tabItem.orLinkTo,
                    index,
                    tabItem?.search,
                    tabItem.loginReq
                  )
                }
                key={index}
                selected={isItemSelected(
                  pathname,
                  tabItem.linkTo,
                  tabItem.orLinkTo,
                  tabItem?.search
                )}
                numberOfTabs={numberOfTabs}
              >
                <TabImage>
                  {isFestiveTheme() ? (
                    <>
                      {isItemSelected(
                        pathname,
                        tabItem.linkTo,
                        tabItem.orLinkTo,
                        tabItem?.search
                      ) ? (
                        <RunFestiveThemeElements
                          page="bottomNav"
                          component="bottomNav"
                          asset={`${tabItem.tabName.toLowerCase()}Fill`}
                        />
                      ) : (
                        <RunFestiveThemeElements
                          page="bottomNav"
                          component="bottomNav"
                          asset={`${tabItem.tabName.toLowerCase()}Outline`}
                        />
                      )}
                    </>
                  ) : (
                    <img
                      src={
                        isItemSelected(
                          pathname,
                          tabItem.linkTo,
                          tabItem.orLinkTo,
                          tabItem?.search
                        )
                          ? tabItem.tabImageSelected
                          : tabItem.tabImage
                      }
                      alt={tabItem.alt}
                      style={
                        tabItem.imageStyle ?? { height: "20px", width: "20px" }
                      }
                    />
                  )}
                </TabImage>
                <TabText
                  selected={isItemSelected(
                    pathname,
                    tabItem.linkTo,
                    tabItem.orLinkTo,
                    tabItem?.search
                  )}
                >
                  <Text>{tabItem.tabName.toUpperCase()}</Text>
                </TabText>
              </TabButton>
            )}
          </Fragment>
        ))}
    </Wrapper>
  );
}

export default BottomNavMobile;
