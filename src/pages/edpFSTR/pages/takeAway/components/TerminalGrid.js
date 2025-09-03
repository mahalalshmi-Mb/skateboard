import { device } from "commons/util/helperFunctions";
import Text from "components/atoms/Text";
import styled from "styled-components";
import { colors } from "theme/colors";
import { getSessionStorage } from "util/storageUtil";

const TerminalGrid = (props) => {
  let productsData = getSessionStorage("productsData");

  return (
    <>
      <Wrapper>
        <TitleText>
          <Text type="bold">Terminals</Text>
        </TitleText>
        {props?.showAllTerminalButton ? (
          <AllTerminalsButton
            onClick={() =>
              props.handleFilterClick(props?.data?.terminals, {
                displayLabel: "All Terminals",
                terminal: "All Terminals",
              })
            }
            selected={props?.selectedTerminal?.terminal === "All Terminals"}
          >
            <Text type="bold">All Terminals</Text>
          </AllTerminalsButton>
        ) : (
          <AllTerminalsButton
            onClick={() =>
              props.handleFilterClick(
                props?.data?.terminals,
                props?.data?.terminals?.[0]
              )
            }
            selected={
              props.selectedFilter[props?.data?.filterData?.filterParam] &&
              props.selectedFilter[
                props?.data?.filterData?.filterParam
              ]?.includes("All")
            }
          >
            <Text type="bold">{props?.data?.terminals[0]?.displayLabel}</Text>
          </AllTerminalsButton>
        )}

        {props?.data?.terminals?.map((item, index) =>
          index === 0 ? null : (
            <TerminalButton
              key={index}
              selected={props?.selectedTerminal?.terminal === item.terminal}
              onClick={() =>
                props.handleFilterClick(props?.data?.terminals, item)
              }
            >
              <Text>{item?.displayLabel}</Text>
            </TerminalButton>
          )
        )}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  list-style: none;
  line-height: 2;
  padding-left: 0;
`;
const TitleText = styled.div`
  font-size: 16px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 18px;
  }
`;
const AllTerminalsButton = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 43px;
  padding: 10px 4px;
  flex-basis: 100%;
  margin: 0.1em 0;
  background-color: ${({ selected }) =>
    selected ? `${`${colors?.primary}`}` : `${`${colors?.primaryForeground}`}`};
  border: ${({ selected }) =>
    selected ? `1px solid ${colors?.primary}` : `1px solid ${colors?.border}`};
  border-radius: 6px;
  font-size: 14px;
  color: ${({ selected }) =>
    selected
      ? `${`${colors?.button?.primaryText}`}`
      : `${`${colors?.text?.gray300}`}`};
  cursor: pointer;

  @media ${device.laptop} {
    &:hover {
      background-color: ${({ selected }) =>
        selected ? `${`${colors?.primary}`}` : "#D9EAFF"};
      opacity: ${({ selected }) => (selected ? "0.7" : "1")};
    }
  }
`;
const TerminalButton = styled.li`
  flex-basis: 49%;
  background-color: ${({ selected }) =>
    selected ? `${`${colors?.primary}`}` : `${`${colors?.primaryForeground}`}`};
  border: ${({ selected }) =>
    selected ? `1px solid ${colors?.primary}` : `1px solid ${colors?.border}`};
  border-radius: 6px;
  min-height: 64px;
  padding: 0px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.1em 0;
  font-size: 14px;
  color: ${({ selected }) =>
    selected
      ? `${`${colors?.button?.primaryText}`}`
      : `${`${colors?.text?.gray300}`}`};
  text-align: center;
  cursor: pointer;

  @media ${device.laptop} {
    &:hover {
      background-color: ${({ selected }) =>
        selected ? `${`${colors?.primary}`}` : "#D9EAFF"};
      opacity: ${({ selected }) => (selected ? "0.7" : "1")};
    }
  }

  &:nth-last-child(2) {
    flex-basis: 49%;
  }

  &:last-child {
    flex-basis: 49%;
  }
`;

export default TerminalGrid;
