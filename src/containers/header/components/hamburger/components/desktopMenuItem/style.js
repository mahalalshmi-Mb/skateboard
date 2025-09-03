import styled from "styled-components";
import { device } from "../../../../../../commons/util/helperFunctions";

import { colors } from "../../../../../../theme/colors";
import {
  StyledButton,
  UnorderedList,
} from "../../../../../../theme/globalStyleSheet";

export const Wrapper = styled(StyledButton)`
  position: relative;
  height: 100%;
  padding: 0px 24px;
  transition: background-color 0.3s;
`;

export const MenuIcon = styled.img`
  /* width: 42px; */
  height: 26px;
`;

export const TextStyle = styled.div`
  display: flex;
  flex-direction: ${({ flexPosition }) =>
    flexPosition ? flexPosition : "column"};
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0px;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.05em;
  letter-spacing: 1px;
  text-align: center;
  text-transform: uppercase;
  height: 100%;
  max-height: 80px;
  min-height: 80px;
`;

export const DropdownWrapper = styled(UnorderedList)`
  display: flex;
  height: auto;
  align-items: flex-start;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 400px;

  padding: 20px 16px 20px 16px;
  gap: 24px;
  border-radius: 4px 0px 0px 0px;

  background: #ffffff;
  border: 1px solid #2731351a;
  box-shadow: 0px 0px 16px 0px #00000014;
  left: 0px;
  position: absolute;
  top: 60px;
  border-radius: 6px;
  z-index: 9999;

  @media ${device.laptopL} {
    max-height: 400px;
  }
`;

export const SubMenuWrapper = styled.li`
  list-style-type: none;
  white-space: nowrap;
  text-align: left;
`;

export const SubMenuTextStyle = styled.div`
  text-transform: ${({ isSubItem }) =>
    isSubItem ? "capitalize" : "uppercase"};
  color: ${colors.text.primaryText};
  font-size: 12px;
  line-height: 19.12px;
  letter-spacing: ${({ isSubItem }) => (isSubItem ? "0em" : "0.1em")};
  text-align: left;

  @media ${device.laptopL} {
    font-size: 14px;
  }
`;
