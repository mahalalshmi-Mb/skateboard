import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import Text from "./Text";
import styled from "styled-components";
import { colors } from "theme/colors";

function ReadMore(props) {
  const useStyles = makeStyles((theme) => ({
    hidden: {
      display: "-webkit-box",
      WebkitLineClamp: props.lineClamp,
      overflow: "hidden",
      WebkitBoxOrient: "vertical",
    },
  }));
  const classes = useStyles();
  const [isHidden, setIsHidden] = useState(true);
  return (
    <>
      <div style={props.style} className={isHidden ? classes.hidden : null}>
        {props.children}
      </div>
      <div
        className={props.readMoreTextClassName}
        onClick={(e) => {
          e.stopPropagation();
          setIsHidden(!isHidden);
        }}
      >
        {isHidden ? (
          <TextWrapper>
            <Text type="bold">Read More</Text>
          </TextWrapper>
        ) : (
          <TextWrapper>
            <Text type="bold">Read Less</Text>
          </TextWrapper>
        )}
      </div>
    </>
  );
}

const TextWrapper = styled.div`
  cursor: pointer;
  color: ${colors?.text?.actionTextColor};
`;

export default ReadMore;
