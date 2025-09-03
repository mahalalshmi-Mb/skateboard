import { useContext, useEffect, useRef, useState } from "react";
import {
  CartCountBadge,
  HamburgerIcon,
  HeaderWrapper,
  Logo,
  MenuItemWrapper,
  Navbar,
  NavbarContentContainer,
  NavlinkLogo,
  PrimaryIconContainer,
  HeaderIcon,
  ProfileIconContainer,
  SecondaryIconContainer,
} from "./style";
import "./style.css";

import userIcon from "../../assets/images/header/user.svg";
import LoginWithoutOtp from "components/organisms/LoginWithoutOtp/LoginWithoutOtp";
import cartIcon from "../../assets/images/header/cart.svg";
import hamBurgerIcon from "../../assets/images/header/hamburgerIcon.svg";

import { useCookies } from "react-cookie";
import { isMobile } from "react-device-detect";
import { useHistory, useLocation } from "react-router-dom";
import Util from "../../commons/util/util";
import Text from "../../components/atoms/Text";
import PushAlert from "../../components/atoms/pushAlert";
import UseOutsideClick from "../../components/atoms/useOutsideClick";
import LanguageChangeModal from "../../components/organisms/MultiLanguage/LanguageChangeModal";
import { CartContext } from "../../context/cartContext";
import { NavContext } from "../../context/navContext";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { getSessionStorage } from "../../util/storageUtil";
import DesktopMenuItem from "./components/hamburger/components/desktopMenuItem/DesktopMenuItem";
import Hamburger from "./components/hamburger/hamburger";
import { useConfig } from "context/configContext";

const Header = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  const useNav = useContext(NavContext);
  const ClientCart = useContext(CartContext);
  const { skipUserSessionRetention } = useConfig();
  const { pushHistory, returnRedirectUrl } = useCustomNavigation();

  const [searchValue, setSearchValue] = useState("");
  const [cookies] = useCookies(["gwLoginData"]);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [headerData, setHeaderData] = useState([]); //data contains both t&c
  const [displayData, setDisplayData] = useState(); //data shown in header
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isQuickSignInOpen, setIsQuickSignInOpen] = useState(false);
  const ref = useRef();

  const [showLanguageChangeModal, setShowLanguageShowModal] = useState(false);

  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    let newHeaderData = getSessionStorage("header");
    if (newHeaderData) {
      setHeaderData(newHeaderData);
      setDisplayData(newHeaderData[0]);
      handleHeaderCheck(pathname.slice(1), newHeaderData, newHeaderData[0]);
    }
  }, []);

  UseOutsideClick(ref, () => {
    setIsDropdownOpen(!isDropdownOpen);
  });

  useEffect(() => {
    handleHeaderCheck(pathname.slice(1), headerData, displayData);
  }, [pathname]);

  const handleHeaderCheck = (path, headerData, displayData) => {
    if (headerData?.length && displayData) {
      let firstPartOfPath = path?.split("/")[0];
      if (path?.includes("kn")) {
        firstPartOfPath = path?.split("/")[1] || "";
      }

      if (
        firstPartOfPath === "" ||
        firstPartOfPath === headerData?.[1]?.name?.toLowerCase() ||
        firstPartOfPath === headerData?.[0]?.name?.toLowerCase()
      ) {
        //if empty or equal to traveller and displayData name is qual to corporate
        //or if path is corporate and displayData.name is not corporate
        if (
          ((firstPartOfPath === "" ||
            firstPartOfPath === headerData?.[0]?.name?.toLowerCase()) &&
            displayData.name.toLowerCase() ===
              headerData?.[1]?.name?.toLowerCase()) ||
          (firstPartOfPath === headerData?.[1]?.name?.toLowerCase() &&
            displayData.name !== headerData?.[1]?.name?.toLowerCase())
        ) {
          handleHeaderSwitch(headerData, displayData);
        }
      }
    }
  };

  const handleHeaderSwitch = (newHeaderData, newDisplayData) => {
    let localHeaderData;
    let localDisplayData;
    if (newHeaderData && newDisplayData) {
      localHeaderData = newHeaderData;
      localDisplayData = newDisplayData;
    } else {
      localHeaderData = headerData;
      localDisplayData = displayData;
    }
    if (pathname.includes("corporate")) {
      setDisplayData(localHeaderData[1]);
    } else {
      setDisplayData(localHeaderData[2]);
    }
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleShowSearchResult = (value) => {
    setSearchValue("");
    if (value.length > 2) {
      pushHistory(`/search-results?search=${value}`);
    } else {
      PushAlert.info("Please type at least 3 characters to search");
    }
  };

  const handleInAppNotificationView = () => {
    pushHistory("/travellers/notifications");
  };

  const handleOpenSignIn = () => {
    if (cookies.gwLoginData) {
      pushHistory("/travellers/profile");
    } else {
      setIsQuickSignInOpen(true);
    }
  };

  const handleOpenCart = () => {
    goToCart();
  };

  const handleListClick = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  const handleHamburgerOpen = () => {
    // useNav.hideBottomNavs();
  };

  const handleHamburgerClose = () => {
    // useNav.showBottomNavs();
  };

  history.listen((location, action) => {
    if (action === "POP") {
      if (location.pathname === "/paymentRedir" && pathname === "/cart") {
        pushHistory("/");
        return;
      }
    }
  });

  const handleGoBack = () => {
    Util.triggerMoEngageEvent("header_go_back_clicked");

    if (useNav.headerGoBackToRoute) {
      let route = useNav.headerGoBackToRoute;
      useNav.setHeaderGoBackToRoute("");
      pushHistory(route);
    } else {
      if (history?.location?.state?.from === "payment-status") {
        pushHistory("/");
      } else {
        history.goBack();
      }
    }
  };

  const handleShowGlobalSearch = () => {
    if (isMobile) {
      return useNav.isGlobalSearchVisible;
    } else {
      return true;
    }
  };

  const handleGlobalSearch = () => {
    setShowSearch(!showSearch);
    if (isMobile) {
      useNav.toggleHeaderGlobalSearch();
    }
  };

  const getCartCount = () => {
    var count = 0;
    ClientCart.getItems().forEach((x) => {
      if (x.itemQuantity) {
        count = count + parseInt(x.itemQuantity);
      }
    });
    if (count > 0) {
      if (count > 9) {
        return "9+";
      } else {
        return parseFloat(count);
      }
    } else {
      return "";
    }
  };

  const goToCart = () => {
    pushHistory("/cartRedirect");
  };

  const goToProfile = () => {
    pushHistory("/travellers/profile");
  };

  return (
    <HeaderWrapper
      className="header-wrapper"
      // style={isHamburgerOpen ? { zIndex: 99999 } : { zIndex: 999 }}
      isGoBackVisible={useNav.isHeaderGoBackVisible}
      isGlobalSearchVisible={useNav.isGlobalSearchVisible}
      isGetAppPromptVisible={useNav.showGetAppPrompt}
      bgColor={displayData?.bgcolor}
    >
      <Navbar>
        <NavbarContentContainer>
          <HamburgerIcon
            src={hamBurgerIcon}
            alt="mobile-menu"
            onClick={handleListClick}
          />
          <NavlinkLogo to={returnRedirectUrl("/")}>
            <Logo src={displayData?.lightLogo?.url || ""} alt="logo" />
          </NavlinkLogo>
          <MenuItemWrapper
            position={displayData?.MenuPosition?.toLowerCase() || "center"}
          >
            {displayData &&
              displayData.menus.map((menuItem, index) => (
                <DesktopMenuItem
                  key={`${menuItem._id} - ${index}`}
                  data={menuItem}
                  bgColor={displayData?.bgcolor}
                  activeFontColor={displayData?.fontActive}
                  inactiveFontColor={displayData?.fontInactive}
                  flexPosition={displayData?.MenuLayout?.toLowerCase() || "column"}
                />
              ))}
          </MenuItemWrapper>
          <ProfileIconContainer>
            {!skipUserSessionRetention && (
              <SecondaryIconContainer onClick={() => handleOpenSignIn()}>
                <HeaderIcon src={userIcon} alt="profile" />
              </SecondaryIconContainer>
            )}
            <PrimaryIconContainer onClick={() => handleOpenCart()}>
              <HeaderIcon src={cartIcon} alt="cart" />
              {!ClientCart.isEmpty() && (
                <CartCountBadge>
                  <Text type="extra-bold">{getCartCount()}</Text>
                </CartCountBadge>
              )}
            </PrimaryIconContainer>
          </ProfileIconContainer>
        </NavbarContentContainer>
      </Navbar>
      <Hamburger
        isOpen={isHamburgerOpen}
        onHide={handleHamburgerClose}
        onExited={handleHamburgerClose}
        onShow={handleHamburgerOpen}
        setIsOpen={setIsHamburgerOpen}
        displayData={displayData}
        handleHeaderSwitch={handleHeaderSwitch}
      />
      <LoginWithoutOtp
        isDrawerOpen={isQuickSignInOpen}
        setIsDrawerOpen={setIsQuickSignInOpen}
        successHandler={goToProfile}
      />

      <LanguageChangeModal
        showLanguageChangeModal={showLanguageChangeModal}
        setShowLanguageShowModal={setShowLanguageShowModal}
      />
    </HeaderWrapper>
  );
};

export default Header;
