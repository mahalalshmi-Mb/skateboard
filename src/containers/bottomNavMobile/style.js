import styled from "styled-components";
import { device } from "../../commons/util/helperFunctions";
import { isFestiveTheme } from "../FestiveThemeController/festiveThemingUtil";

export const Wrapper = styled.div`
  height: 60px;
  display: flex;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #ffffff;
  box-shadow: 0px 1px 12px rgb(5 32 61 / 5%);
  z-index: 99;
  justify-content: space-around;

  @media ${device.laptop} {
    display: none;
  }
  @media screen (orientation: landscape) {
    display: flex;
  }
`;

export const TabButton = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  width: ${(props) => `calc(100% / ${props.numberOfTabs})`};
  opacity: ${(props) => (props.selected ? 1 : 0.5)};
`;
export const TabImage = styled.div`
  height: 60%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;
export const TabText = styled.div`
  height: 40%;
  color: ${(props) =>
    props.selected ? (isFestiveTheme() ? "#BA1120" : "#0A6B71") : "#273135"};
  font-size: 10px;
  margin-top: 2px;

  display: flex;
  align-items: flex-start;
  justify-content: center;

  line-height: normal;
  text-transform: uppercase;
`;
