import React from "react";
import Text from "../../../../../../../components/atoms/Text";
import { colors } from "../../../../../../../theme/colors";
import { SubMenuWrapper } from "../style";
const SubMenuItem = (props) => {
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
  return (
    <SubMenuWrapper
      style={{
        marginBottom: getMarginBottom(),
        marginTop: props.marginTopControl && props.index === 0 ? "16px" : null,
      }}
    >
      <Text
        style={{
          textTransform: "capitalize",
          color: props.data.font || colors.text.primaryText,
          fontWeight: props.bold ? 700 : 500,
          fontSize: "16px",
        }}
        onClick={() => props.onClick(props.subMenuItem.redirectLink)}
      >
        {props.subMenuItem.name.toLowerCase()}
      </Text>
      {props.subMenuItem.sub_menus
        ? props.subMenuItem.sub_menus.map((subMenuItem, index) => (
            <SubMenuItem
              key={subMenuItem._id}
              onClick={props.onClick}
              subMenuItem={subMenuItem}
              index={index}
              marginTopControl={true}
              marginBottomControl={true}
              marginBottom={"32px"}
              bold={false}
              marginLeftControl={false}
              parentMenuLength={props.subMenuItem.sub_menus.length}
            />
          ))
        : null}
    </SubMenuWrapper>
  );
};

export default SubMenuItem;
