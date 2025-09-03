import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import DownArrow from "../../../../../../assets/images/header/ChevronDown.svg";
import Text from "../../../../../../components/atoms/Text";
import { Image } from "../../../../../../theme/globalStyleSheet";
import { canShow, getPageName } from "../../config";
import DesktopSubMenuItem from "./components/DesktopSubMenuItem";
import { DropdownWrapper, MenuIcon, TextStyle, Wrapper } from "./style";
import "./style.css";
import useCustomNavigation from "../../../../../../hooks/useCustomNavigation";
import { colors } from "theme/colors";

const DesktopMenuItem = (props) => {
  const { pathname } = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const isActive = () => {
    const pathWithoutQuery = props?.data?.name
      ?.replace("/", "")
      ?.replace("-", " ")
      ?.toLowerCase();
    const formattedPathname = pathname?.split("/")?.[1] || pathname;
    const pageName = getPageName(formattedPathname);
    const isActive = pageName?.trim()?.includes(pathWithoutQuery?.trim());

    return isActive;
  };

  const handleHeaderClick = () => {
    if (props?.data?.isSwitch) {
      closeDropdown();
      if (props?.data?.name?.toLowerCase() === "corporate") {
        pushHistory(`/${props?.data?.name?.toLowerCase()}`);
      } else {
        pushHistory("/");
      }
    } else if (props?.data?.redirectLink) {
      if (props?.data?.isExternal) {
        window.open(props?.data?.redirectLink, "_blank").focus();
      } else {
        pushHistory(props?.data?.redirectLink);
        closeDropdown();
      }
    }
  };
  return (
    <>
      {canShow(props.data.showOnApp, props.data.showOnWeb) && (
        <Wrapper
          className="desktop-menu-item-wrapper"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
          style={{
            ...props.style,
            backgroundColor: isActive() ? props?.bgColor : "",
          }}
        >
          <TextStyle
            onClick={handleHeaderClick}
            style={
              isActive()
                ? { color: props?.activeFontColor }
                : { color: props?.inactiveFontColor }
            }
            flexPosition={props?.flexPosition}
          >
            <MenuIcon
              src={
                isActive()
                  ? props?.data?.image?.[1]?.url
                  : props?.data?.image?.[0]?.url
              }
            />
            <Text type="medium">{props.data.name.toUpperCase()}</Text>
            {props.data.sub_menus && props.data.sub_menus.length ? (
              <DropdownMenuItemIcon src={DownArrow} alt="open" />
            ) : null}
          </TextStyle>

          {props.data.hooverSubmenu &&
          props.data.sub_menus &&
          props.data.sub_menus.length &&
          showDropdown ? (
            <DropdownWrapper
              className="dropdown-wrapper"
              id={props.data.id}
              style={{
                width: props.data.innerMenuCount > 6 ? "360px" : "auto",
                maxHeight: props.data.innerMenuCount > 0 ? null : "none",
              }}
            >
              {props.data.sub_menus.map((subMenuItem, index) => (
                <DesktopSubMenuItem
                  key={subMenuItem._id}
                  parentMenuLength={props.data.sub_menus.length}
                  subMenuItem={subMenuItem}
                  index={index}
                  marginTopControl={false}
                  marginBottomControl={true}
                  bold={true}
                  closeDropdown={closeDropdown}
                />
              ))}
            </DropdownWrapper>
          ) : null}
        </Wrapper>
      )}
    </>
  );
};

const DropdownMenuItemIcon = styled(Image)`
  margin-left: 2px;
`;

export default DesktopMenuItem;
