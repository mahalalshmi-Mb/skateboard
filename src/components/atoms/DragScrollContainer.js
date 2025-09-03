import React from "react";
import { ScrollContainer } from "react-indiana-drag-scroll";
import "react-indiana-drag-scroll/dist/style.css";

const DragScrollContainer = (props) => {
  return <ScrollContainer>{props.children}</ScrollContainer>;
};

export default DragScrollContainer;
