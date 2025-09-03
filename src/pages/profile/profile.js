import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
  deleteAllCookies,
  getUserInfo,
  removeAppliedCoupon,
} from "../../commons/util/helperFunctions";
import { resetUserPermission } from "../../commons/util/permissionsConfig";

import Moengage from "@moengage/web-sdk";
import { isMobile } from "react-device-detect";
import UnknownUserImage from "../../assets/images/header/Profile-photo.svg";
import ArrowRight from "../../assets/images/profile/ArrowRightBlack.svg";
import EditImg from "../../assets/images/profile/editIcon.svg";
import BannerImg from "../../assets/images/profile/profileBanner.webp";
import Logo from "../../assets/images/profile/pulseLogo.svg";
import callAPI, { callTokenApi } from "../../commons/callAPI";
import config from "../../commons/config";
import Util from "../../commons/util/util";
import Text from "../../components/atoms/Text";
import Loader from "../../components/atoms/loader";
import { CartContext } from "../../context/cartContext";
import { NavContext } from "../../context/navContext";
import { Sign_Out_Event } from "../../util/FirebaseAnalyticsUtil";
import {
  removeLocalStorage,
  removeSessionStorage,
} from "../../util/storageUtil";
import LogoutConfirmationModal from "./components/LogoutConfirmationModal";
import { listConfig } from "./config";
import "./profile.css";
import {
  BannerWrapper,
  ContentContainer,
  EditIcon,
  MenuContainer,
  MenuIcon,
  MenuItemDivider,
  MenuItemWrapper,
  MenuItemsContainer,
  MenuLinkAwayIcon,
  MenuName,
  MenuNameWrapper,
  MenuTitle,
  PageWrapper,
  UserDetailsBox,
  UserDetailsContainer,
  UserEdit,
  UserEditWrapper,
  UserName,
  UserPhNo,
  UserProfileImage,
  UserProfileImageContainer,
  EmployeeLoginSuccessIcon,
  EmployeeUnRegister,
} from "./style";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import EmployeeValidationModal from "./components/EmployeeValidationModal";
import PushAlert from "components/atoms/pushAlert";
import { getLocalStorage } from "../../util/storageUtil";
import EmployeeLoginSuccess from "../../assets/images/profile/employeeLoginSuccess.svg";

function Profile(props) {
  const ClientCart = useContext(CartContext);
  const useNav = useContext(NavContext);
  const rootPath = useRouteMatch();
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();
  const [cookies, setCookie, removeCookie] = useCookies(["gwLoginData"]);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phNo, setPhNo] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState();
  const [profileData, setProfileData] = useState();
  const [showAddInfoPrompt, setShowAddInfoPrompt] = useState(true);
  const [addInfoPromptSlideOut, setAddInfoPromptSlideOut] = useState(false);

  const [isClickDisabled, setIsClickDisabled] = useState(false);
  const [showLogoutConfirmationModal, setShowLogoutConfirmationModal] =
    useState(false);
  const [showEmpValidationModal, setShowEmpValidationModal] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const userType = getLocalStorage("userData") || {};
  const [showRemoveValidationModal, setShowRemoveValidationModal] =
    useState(false);
  useEffect(() => {
    document.title = props.title || "";
  }, [props.title]);

  useEffect(() => {
    if (isMobile) {
      useNav.hideFooterNavs();
      useNav.showHeaderGoBack();
    } else {
      useNav.hideFooterNavs();
      useNav.hideHeaderGoBack();
    }

    return () => {
      useNav.showFooterNavs();
      useNav.hideHeaderGoBack();
    };
  }, []);

  useEffect(() => {
    if (cookies.gwLoginData && cookies.gwLoginData.userId) {
      getProfileInfo();
    } else {
      pushHistory("/");
    }
  }, []);

  const getProfileInfo = async () => {
    try {
      let data = await getUserInfo();
      if (data) {
        setProfileImageUrl(
          data.profileImage && data.profileImage.absolutePath
            ? data.profileImage.absolutePath
            : ""
        );

        setFirstName(
          data.firstName !== null && data.firstName !== undefined
            ? data.firstName
            : ""
        );
        setLastName(
          data.lastName !== null && data.lastName !== undefined
            ? data.lastName
            : ""
        );
        setEmail(
          data.emailMasked !== null && data.emailMasked !== undefined
            ? data.emailMasked
            : ""
        );
        setPhNo(
          data.mobileMasked !== null && data.mobileMasked !== undefined
            ? data.mobileMasked
            : ""
        );
        setProfileData(data);

        if (data.emailMasked) {
          setShowAddInfoPrompt(false);
        } else {
          setShowAddInfoPrompt(true);
        }

        let menus = JSON.parse(JSON.stringify(listConfig));
        menus.forEach((x) => {
          x.subMenu = x.subMenu.filter((f) => f.isActive);
        });
        menus = menus.filter(
          (menu) => Array.isArray(menu.subMenu) && menu.subMenu.length > 0
        );
        if (data?.segment?.code?.toLowerCase() === "g") {
          menus.forEach((x) => {
            x.subMenu = x.subMenu.filter((f) => f?.menuName !== "Settings");
          });
        }
        setMenuItems(menus);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const signOut = async () => {
    try {
      setIsClickDisabled(true);
      let apiURL = config.api.logout;
      let apiResponse = await callAPI.put(apiURL);
      let regResponse = await apiResponse.json();

      if (regResponse.status === 200) {
        Util.sendMessageToReactNative(Sign_Out_Event);
        removeCookie("gwLoginData", { path: "/" });
        removeCookie("profileVerifiedMobileNumber", { path: "/" });
        removeCookie("jwtToken", { path: "/" });
        removeSessionStorage("hotelData");
        removeSessionStorage("productsData");
        removeSessionStorage("isAgeDeclared");
        removeSessionStorage("productFilters");
        removeSessionStorage("appliedCoupon");
        removeAppliedCoupon();
        removeSessionStorage("mandatoryInfoData");
        removeSessionStorage("tipData");
        localStorage.removeItem("module");
        localStorage.removeItem("flightInfo");
        localStorage.removeItem("userData");
        removeLocalStorage("guestUserData");
        ClientCart.reset();
        deleteAllCookies();
        resetUserPermission();

        try {
          Util.triggerMoEngageEvent("sign_out");
          if (!window.ReactNativeWebView) {
            Moengage.destroy_session();
          }
        } catch (e) {}

        const success = await callTokenApi.guest();
        if (success) {
          pushHistory("/");
        }
      }
      setIsClickDisabled(false);
    } catch (e) {
      setIsClickDisabled(false);
      console.log(e);
    }
  };

  const validateEmployee = async (empCode) => {
    try {
      let apiURL = `${config.api.employeeRegister}`;
      let apiResponse = await callAPI.put(apiURL, {
        value: empCode ? empCode?.trim() : "",
      });
      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        PushAlert.success(regResponse.message);
        setShowEmpValidationModal(false);
        getProfileInfo();
      } else {
        PushAlert.error(regResponse.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const removeEmployee = async () => {
    try {
      let apiURL = `${config.api.employeeUnRegister}`;
      let apiResponse = await callAPI.put(apiURL);
      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        PushAlert.success(regResponse.message);
        setShowRemoveValidationModal(false);
        setShowEmpValidationModal(false);
        getProfileInfo();
      } else {
        PushAlert.error(regResponse.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleUserDetailsEdit = () => {
    pushHistory(`${rootPath.url}/personalDetails`);
  };

  const handleMenuClick = (menuName, linkTo) => {
    if (menuName === "Logout") {
      setShowLogoutConfirmationModal(true);
    } else if (menuName === "Enroll as employee") {
      setShowEmpValidationModal(true);
    } else {
      pushHistory(linkTo);
    }
  };

  const checkEnrollAsEmployee = (isShowEnrollEmployee) => {
    return (
      isShowEnrollEmployee &&
      userType?.data?.segment?.code?.toLowerCase() === "e" &&
      userType?.data?.segment?.type?.toLowerCase() === "employee"
    );
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <PageWrapper>
        <BannerWrapper>
          {profileData?.segment?.code?.toLowerCase() !== "g" && (
            <UserDetailsBox>
              <UserProfileImageContainer>
                <UserProfileImage
                  src={profileImageUrl}
                  onError={(e) => {
                    e.target.src = UnknownUserImage;
                  }}
                  alt="profile-image"
                />
              </UserProfileImageContainer>
              <UserDetailsContainer>
                <UserName>
                  <Text type="bold">
                    {firstName?.trim()?.length > 15
                      ? firstName?.trim().slice(0, 16) + ".."
                      : firstName}
                  </Text>
                </UserName>
                <UserPhNo>
                  <Text>{phNo}</Text>
                </UserPhNo>
                <UserEditWrapper onClick={() => handleUserDetailsEdit()}>
                  <EditIcon src={EditImg} alt="edit-icon" />
                  <UserEdit>
                    <Text type="bold">Edit</Text>
                  </UserEdit>
                </UserEditWrapper>
              </UserDetailsContainer>
            </UserDetailsBox>
          )}
        </BannerWrapper>
        <ContentContainer
          editProfileHidden={profileData?.segment?.code?.toLowerCase() === "g"}
        >
          {menuItems?.map((menuItem, menuIndex) => (
            <MenuContainer key={menuIndex}>
              <MenuTitle>
                <Text type="medium">{menuItem.mainMenu}</Text>
              </MenuTitle>
              <MenuItemsContainer>
                {menuItem?.subMenu?.map((item, index) => (
                  <>
                    <MenuItemWrapper
                      key={index}
                      onClick={() => {
                        !checkEnrollAsEmployee(
                          item?.isShowEnrollEmployee || false
                        ) && handleMenuClick(item.menuName, item.linkTo);
                      }}
                      isShowEnrollEmployee={checkEnrollAsEmployee(
                        item?.isShowEnrollEmployee || false
                      )}
                    >
                      <MenuNameWrapper>
                        <MenuIcon
                          src={item.menuIcon}
                          alt={`${item.menuName}-icon`}
                        />
                        <MenuName
                          isShowEnrollEmployee={checkEnrollAsEmployee(
                            item?.isShowEnrollEmployee || false
                          )}
                        >
                          <Text type="semi-bold">{item.menuName}</Text>
                        </MenuName>
                        {checkEnrollAsEmployee(item?.isShowEnrollEmployee) && (
                          <EmployeeLoginSuccessIcon
                            src={EmployeeLoginSuccess}
                            alt="arrow-right"
                          />
                        )}
                      </MenuNameWrapper>
                      {checkEnrollAsEmployee(item?.isShowEnrollEmployee) ? (
                        <EmployeeUnRegister>
                          <Text
                            onClick={() => {
                              setShowEmpValidationModal(true);
                              setShowRemoveValidationModal(true);
                            }}
                          >
                            Unenroll
                          </Text>
                        </EmployeeUnRegister>
                      ) : (
                        <MenuLinkAwayIcon src={ArrowRight} alt="arrow-right" />
                      )}
                    </MenuItemWrapper>
                    {index !== menuItem?.subMenu?.length - 1 && (
                      <MenuItemDivider />
                    )}
                  </>
                ))}
              </MenuItemsContainer>
            </MenuContainer>
          ))}
          {/* <PulseLogoContainer>
            <PulseLogo src={Logo} alt="pulse-logo" />
          </PulseLogoContainer> */}
        </ContentContainer>
        {showLogoutConfirmationModal && (
          <LogoutConfirmationModal
            isDrawerOpen={showLogoutConfirmationModal}
            setIsDrawerOpen={setShowLogoutConfirmationModal}
            successHandler={signOut}
          />
        )}
        {showEmpValidationModal && (
          <EmployeeValidationModal
            isDrawerOpen={showEmpValidationModal}
            setIsDrawerOpen={setShowEmpValidationModal}
            successHandler={validateEmployee}
            showRemoveValidationModal={showRemoveValidationModal}
            removeHandler={removeEmployee}
          />
        )}
      </PageWrapper>
    );
  }
}

export default Profile;
