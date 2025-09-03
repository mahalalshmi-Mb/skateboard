import React, { useContext, useState } from "react";
import downArrow from "../../../../../../assets/images/header/hamburger/down-arrow.svg";
import upArrow from "../../../../../../assets/images/header/hamburger/up-arrow.svg";
import {
  ContentWrapper,
  HeaderContentIcon,
  HeaderMenuContentWrapper,
  HeaderWrapper,
  ImageWrapper,
  Wrapper,
} from "./style";

import { useHistory, useLocation } from "react-router-dom";
import Text from "../../../../../../components/atoms/Text";
import { NavContext } from "../../../../../../context/navContext";
import { colors } from "../../../../../../theme/colors";
import { canShow, getPageName } from "../../config";
import SubMenuItem from "./components/SubMenuItem";
import { isFestiveTheme } from "../../../../../FestiveThemeController/festiveThemingUtil";
import RunFestiveThemeElements from "../../../../../FestiveThemeController/RunFestiveThemeElements";
import Util from "../../../../../../commons/util/util";
import useCustomNavigation from "../../../../../../hooks/useCustomNavigation";

const MenuItem = (props) => {
  const { pathname } = useLocation();
  const useNav = useContext(NavContext);
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = () => {
    const pathWithoutQuery = props?.data?.name
      ?.replace("/", "")
      ?.replace("-", " ")
      ?.toLowerCase();
    const formattedPathname = pathname?.split("/")?.[1] || pathname;
    const pageName = getPageName(formattedPathname);
    const isActive = pageName?.includes(pathWithoutQuery);

    return isActive;
  };

  const handleHeaderClick = () => {
    if (props?.data?.isSwitch) {
      props.setIsOpen(false);
      useNav.showBottomNavs();
      if (props?.data?.name?.toLowerCase() === "corporate") {
        pushHistory(`/${props?.data?.name?.toLowerCase()}`);
      } else {
        pushHistory("/");
      }
    } else {
      if (props?.data?.redirectLink) {
        if (props?.data?.sub_menus?.length && props?.data?.hooverSubmenu) {
          setIsOpen(!isOpen);
        } else {
          props.setIsOpen(false);
          Util.triggerMoEngageEvent("header_menu_click", {
            menu_name: props?.data?.name?.toLowerCase(),
            menu_link: props?.data?.redirectLink,
          });

          if (props?.data?.isExternal) {
            window.open(props?.data?.redirectLink, "_blank").focus();
          } else {
            pushHistory(props?.data?.redirectLink);
            useNav.showBottomNavs();
          }
        }
      } else {
        setIsOpen(!isOpen);
      }
    }
  };

  const handleSubMenuRedirect = (link) => {
    Util.triggerMoEngageEvent("header_menu_click", {
      menu_name: props.data.name.toLowerCase(),
      menu_link: link,
    });
    props.setIsOpen(false);
    pushHistory(link);
    useNav.showBottomNavs();
  };

  return (
    <>
      {canShow(props.data.showOnApp, props.data.showOnWeb) ? (
        <Wrapper>
          <HeaderWrapper onClick={handleHeaderClick}>
            <HeaderMenuContentWrapper>
              <HeaderContentIcon src={props.data.image?.[0]?.url} />
              <Text
                style={{
                  textTransform: "uppercase",
                  color: props?.inactiveFontColor,
                  fontSize: "14px",
                }}
              >
                {props.data.name.toLowerCase()}
              </Text>
            </HeaderMenuContentWrapper>
            {props.data.hooverSubmenu && props.data.sub_menus.length ? (
              <ImageWrapper>
                {isFestiveTheme() ? (
                  <>
                    {isOpen ? (
                      <RunFestiveThemeElements
                        page="header"
                        component="hamburger"
                        asset="upArrow"
                      />
                    ) : (
                      <RunFestiveThemeElements
                        page="header"
                        component="hamburger"
                        asset="downArrow"
                      />
                    )}
                  </>
                ) : (
                  <img
                    src={isOpen ? upArrow : downArrow}
                    alt="down-arrow-not-found"
                    style={{ height: "20px", width: "20px" }}
                  />
                )}
              </ImageWrapper>
            ) : null}
          </HeaderWrapper>
          {isOpen && props.data.hooverSubmenu && props.data.sub_menus && (
            <ContentWrapper>
              {props.data.sub_menus.map((subMenuItem, index) => (
                <SubMenuItem
                  key={subMenuItem._id}
                  onClick={handleSubMenuRedirect}
                  parentMenuLength={props.data.sub_menus.length}
                  subMenuItem={subMenuItem}
                  index={index}
                  marginTopControl={false}
                  marginBottomControl={true}
                  bold={true}
                  data={props.displayData}
                />
              ))}
            </ContentWrapper>
          )}
        </Wrapper>
      ) : null}
    </>
  );
};

export default MenuItem;
