import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ArrowBlack from "../../../assets/images/cart/arrowUpBlack.svg";
import Text from "../../../components/atoms/Text";
import { device } from "../../../commons/util/helperFunctions";
import { colors } from "theme/colors";

function Accordian(props) {
  const contentEl = useRef();
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    setExpandedIndex(props.isOpen);
  }, [props.isOpen]);

  return (
    <AccordianItem key={props.index}>
      <AccordianHeaderWrapper
        onClick={() => props.handleAccordianToggle(props.domain)}
        expanded={expandedIndex}
      >
        <AccordianHeader>
          <Text type="bold">{props.headerText || ""}</Text>
        </AccordianHeader>
        <AccordianArrowIcon src={ArrowBlack} expanded={expandedIndex} />
      </AccordianHeaderWrapper>
      <AccordianContentWrapper
        ref={contentEl}
        style={expandedIndex ? { height: "fit-content" } : { height: "0px" }}
      >
        <AccordianContent style={props.accordianContentStyle}>
          {props.children}
        </AccordianContent>
      </AccordianContentWrapper>
    </AccordianItem>
  );
}

const AccordianItem = styled.div`
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
  border-radius: 8px;
`;
const AccordianHeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 21px 14px 20px 20px;
  border-bottom: ${({ expanded }) => expanded && "1px solid #d9d9d9"};
  cursor: pointer;
`;
const AccordianHeader = styled.div`
  width: 80%;
  max-width: 80%;
  text-transform: capitalize;

  color: ${colors?.text?.black200};
  font-size: 16px;
  line-height: 18px;
`;
const AccordianArrowIcon = styled.img`
  transition: all 0.4s ease;
  transform: ${({ expanded }) => !expanded && "rotate(-180deg)"};
`;
const AccordianContentWrapper = styled.div`
  height: 0;
  overflow: hidden;
  transition: height ease 0.2s;
`;
const AccordianContent = styled.div`
  width: 100%;
  transition: height ease 0.2s;
`;

export default Accordian;
