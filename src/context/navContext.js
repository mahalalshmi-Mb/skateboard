import React, { useState } from "react";
import { setSessionStorage } from "../util/storageUtil";

//show or hide header and bottom nav(mobile)

const NavContext = React.createContext();

const NavProvider = (props) => {
  const [showHeaderNav, setShowHeaderNav] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [showFeedback, setShowFeedback] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [isHeaderGoBackVisible, setIsHeaderGoBackVisible] = useState(false);
  const [headerGoBackToRoute, setHeaderGoBackToRoute] = useState();
  const [isGlobalSearchVisible, setIsGlobalSearchVisible] = useState(false);
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(true);
  const [showDineInBottomTab, setShowDineInBottomTab] = useState(false);
  const [showGetAppPrompt, setShowGetAppPrompt] = useState(false);
  const [showLogoOnly, setShowLogoOnly] = useState(false);

  const hideAllNavs = () => {
    setShowHeaderNav(false);
    setShowBottomNav(false);
    setShowFeedback(false);
    setShowFooter(false);
    setSessionStorage("showBottomNav", false);
  };

  const showAllNavs = () => {
    setShowHeaderNav(true);
    setShowBottomNav(true);
    setShowFeedback(true);
    setShowFooter(true);
    setShowLogoOnly(false);
    setSessionStorage("showBottomNav", true);
  };

  const hideHeaderNavs = () => {
    setShowHeaderNav(false);
  };

  const showHeaderNavs = () => {
    setShowHeaderNav(true);
  };

  const hideBottomNavs = () => {
    setShowFeedback(false);
    setShowBottomNav(false);
    setSessionStorage("showBottomNav", false);
  };

  const showBottomNavs = () => {
    setShowFeedback(true);
    setShowBottomNav(true);
    setSessionStorage("showBottomNav", true);
  };

  const hideFooterNavs = () => {
    setShowFooter(false);
  };

  const showFooterNavs = () => {
    setShowFooter(true);
  };

  const showHeaderGoBack = (route) => {
    setIsHeaderGoBackVisible(true);
    if (route) {
      setHeaderGoBackToRoute(route);
    }
  };

  const hideHeaderGoBack = () => {
    setIsHeaderGoBackVisible(false);
    setHeaderGoBackToRoute("");
  };

  const showHeaderGlobalSearch = () => {
    setIsGlobalSearchVisible(true);
  };

  const hideHeaderGlobalSearch = () => {
    setIsGlobalSearchVisible(false);
  };

  const toggleHeaderGlobalSearch = () => {
    setIsGlobalSearchVisible(!isGlobalSearchVisible);
  };

  const showScrollToTop = () => {
    setIsScrollToTopVisible(true);
  };

  const hideScrollToTop = () => {
    setIsScrollToTopVisible(false);
  };

  const handleShowLogoOnly = () => {
    setShowHeaderNav(true);
    setShowLogoOnly(true);
  };

  return (
    <NavContext.Provider
      value={{
        showHeaderNav,
        setShowHeaderNav,
        showBottomNav,
        setShowBottomNav,
        showFeedback,
        setShowFeedback,
        hideAllNavs,
        showAllNavs,
        hideBottomNavs,
        showBottomNavs,
        hideHeaderNavs,
        showHeaderNavs,
        showFooter,
        setShowFooter,
        hideFooterNavs,
        showFooterNavs,
        isHeaderGoBackVisible,
        isGlobalSearchVisible,
        showHeaderGoBack,
        hideHeaderGoBack,
        headerGoBackToRoute,
        setHeaderGoBackToRoute,
        showHeaderGlobalSearch,
        hideHeaderGlobalSearch,
        toggleHeaderGlobalSearch,
        isScrollToTopVisible,
        showScrollToTop,
        hideScrollToTop,
        showDineInBottomTab,
        setShowDineInBottomTab,
        showGetAppPrompt,
        setShowGetAppPrompt,
        showLogoOnly,
        setShowLogoOnly,
        handleShowLogoOnly,
      }}
    >
      {props.children}
    </NavContext.Provider>
  );
};

export { NavContext, NavProvider };
