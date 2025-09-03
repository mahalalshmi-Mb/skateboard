import React from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import styled from "styled-components";
import { device } from "../../../commons/util/helperFunctions";
import Util from "../../../commons/util/util";
import useCustomNavigation from "../../../hooks/useCustomNavigation";

function SectionAccordian(props) {
  const rootPath = useRouteMatch();
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();
  return (
    <Wrapper
      showMobile={props.item.showMobile}
      showDesktop={props.item.showDesktop}
      className="section-item"
      style={
        props.item.showOnlyOnApp
          ? {
              display: Util.isWebView() ? "flex" : "none",
            }
          : { display: "flex" }
      }
      onClick={() => pushHistory(`${rootPath.url}/${props.item.linkTo}`)}
    >
      <div className="section-item-name-wrapper">
        <span className="section-item-title">{props.item.title}</span>
        <span className="section-item-details">{props.item.details}</span>
      </div>
      <div className="section-right-arrow"></div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0px 20px 0px;
  border-bottom: 1px solid #ededed;

  display: ${({ showMobile }) => (!showMobile ? "none" : "flex")};

  @media ${device.laptop} {
    display: ${({ showDesktop }) => (!showDesktop ? "none" : "flex")};
  }
`;

export default SectionAccordian;
