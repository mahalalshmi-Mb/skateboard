import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { device } from "../../commons/util/helperFunctions";
import { H6, Link, StyledButton } from "../../theme/globalStyleSheet";
import { colors } from "theme/colors";

export const HeaderWrapper = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  border-radius: 0px 0px 24px 24px;
  z-index: 999;
  padding: 24px;
  background-color: ${(props) => props.bgColor || "rgba(65, 136, 255, 0.2)"};
`;
export const Navbar = styled.div`
  width: 100%;
  padding: 12px 18px;
  border-radius: 8px;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);
  background-color: #fff;

  @media ${device.laptop} {
    padding: 0px 24px;
  }
`;
export const NavbarContentContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const NavbarMenuContainer = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const NavLogoContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;
export const HamburgerIcon = styled.img`
  display: flex;

  @media ${device.laptop} {
    display: none;
  }
`;
export const NavlinkLogo = styled(NavLink)`
  display: flex;
  height: 100%;
`;
export const Logo = styled.img`
  cursor: pointer;
`;
export const ProfileIconContainer = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0px 8px;
  justify-content: flex-end;
`;
export const PrimaryIconContainer = styled.div`
  display: flex;
  width: 44px;
  height: 44px;
  padding: 14px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: ${colors?.primary};
  position: relative;
  opacity: 1;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;
export const SecondaryIconContainer = styled.div`
  display: flex;
  width: 44px;
  height: 44px;
  padding: 14px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: #efefef;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: #ffffff;
    border: 2px solid ${colors?.primary};
  }
`;
export const HeaderIcon = styled.img``;
export const CartCountBadge = styled.div`
  position: absolute;
  right: -8px;
  top: -9px;
  width: 20px;
  height: 18px;
  border-radius: 100px;
  background-color: #4188ff;

  text-align: center;
  font-size: 8px;
  line-height: 18px;
  letter-spacing: 0.1px;
  text-transform: uppercase;
  color: #fff;
`;
export const MenuItemWrapper = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    flex: 1;
    justify-content: ${({ position }) =>
      position === "left"
        ? "flex-start"
        : position === "center"
        ? "center"
        : position === "right"
        ? "right"
        : "center"};
    margin: ${({ position }) =>
      position === "left"
        ? "0px 0px 0px 56px"
        : position === "right"
        ? "0px 56px 0px 0px"
        : "0px"};
    gap: 24px;
    overflow: scroll;
    scrollbar-width: none;
    width: 100%;
    max-width: 80%;
    min-width: 80%;
  }
`;
