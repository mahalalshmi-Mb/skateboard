import React from "react";
import { useHistory } from "react-router-dom";
import Text from "../../../../../../../components/atoms/Text";
import { SubMenuTextStyle, SubMenuWrapper } from "../style";
import styled from "styled-components";
import useCustomNavigation from "../../../../../../../hooks/useCustomNavigation";

const DesktopSubMenuItem = (props) => {
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();

  const getMarginBottom = () => {
    if (props.marginBottomControl) {
      if (props.index === props.parentMenuLength - 1) {
        if (props.marginBottom) {
          return props.marginBottom;
        }
        return 0;
      } else {
        return null;
      }
    }
  };
  const handleSubMenuRedirect = (link) => {
    props.closeDropdown();
    pushHistory(link);
  };
  return (
    <SubMenuWrapper
      style={{
        marginTop: props.marginTopControl && props.index === 0 ? "12px" : null,
        marginBottom: getMarginBottom(),
      }}
    >
      <SubMenuTextStyle isSubItem={props.isSubItem}>
        <Text
          type={props.bold ? "semi-bold" : "regular"}
          onClick={() => handleSubMenuRedirect(props.subMenuItem.redirectLink)}
        >
          {props.subMenuItem.name.toLowerCase()}
        </Text>
        <TinySubWrapper>
          {props.subMenuItem.sub_menus
            ? props.subMenuItem.sub_menus.map((subMenuItem, index) => (
                <DesktopSubMenuItem
                  {...props}
                  key={subMenuItem._id}
                  subMenuItem={subMenuItem}
                  index={index}
                  marginTopControl={true}
                  marginBottomControl={true}
                  marginBottom={"12px"}
                  bold={false}
                  marginLeftControl={false}
                  parentMenuLength={props.subMenuItem.sub_menus.length}
                  isSubItem={true}
                />
              ))
            : null}
        </TinySubWrapper>
      </SubMenuTextStyle>
    </SubMenuWrapper>
  );
};

const TinySubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default DesktopSubMenuItem;
