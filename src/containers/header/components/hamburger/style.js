import styled from "styled-components";
import { colors } from "../../../../theme/colors";
import { H3, SpacedOutRow } from "theme/globalStyleSheet";

export const HamburgerWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding: 24px;
`;
export const HeaderWrapper = styled(SpacedOutRow)`
  padding-bottom: 18px;
  border-bottom: 1px solid #bdbdbd;
`;
export const HeaderText = styled(H3)`
  text-transform: capitalize;
  color: ${colors?.text?.actionTextColor};
`;
export const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding-top: 24px;
  background-color: #ffffff;
  position: sticky;
  top: 0;
  padding-right: 24px;
`;
export const CloseIconContainer = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  padding: 14px;
  justify-content: center;
  align-items: center;
  border-radius: 36px;
  background: #dbdbdb;
  cursor: pointer;
`;
export const CloseIcon = styled.img``;
export const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  padding-top: 20px;
`;
export const MenuItemsWrapper = styled.div`
  margin-top: 24px;
  gap: 22px 0px;
  display: flex;
  flex-direction: column;
`;
