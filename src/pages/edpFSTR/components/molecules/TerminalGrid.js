import React from "react";
import styled from "styled-components";
import { device } from "../../../../commons/util/helperFunctions";
import Text from "../../../../components/atoms/Text";
import { colors } from "theme/colors";

const TerminalGrid = (props) => {
  const data = props?.data?.filterData || props?.data;
  const terminalList =
    props?.data?.filterData?.facetDetails?.facetOptionValues ||
    props?.data?.facetDetails?.facetOptionValues;

  const sortedTerminalList = terminalList?.sort((a, b) =>
    a.displayLabel.localeCompare(b.displayLabel)
  );

  return (
    <>
      <Wrapper>
        <TitleText>
          <Text type="bold">Terminals</Text>
        </TitleText>
        <AllTerminalsButton
          onClick={() =>
            props.handleFilterClick(data?.filterParam, {
              value: "All",
              displayLabel: "All",
            })
          }
          selected={
            props.selectedFilter[data?.filterParam] &&
            props.selectedFilter[data?.filterParam]?.includes("All")
          }
        >
          <Text type="bold">All Terminals</Text>
        </AllTerminalsButton>
        {sortedTerminalList?.map((item, index) => (
          <TerminalButton
            key={index}
            selected={
              props.selectedFilter[data?.filterParam] &&
              props.selectedFilter[data?.filterParam][0] === item.value
            }
            onClick={() => props.handleFilterClick(data?.filterParam, item)}
          >
            <Text>{item?.displayLabel}</Text>
          </TerminalButton>
        ))}
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
  gap: 8px 0px;
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
  word-break: break-word;

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
  max-width: 49%;
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
  font-size: 14px;
  color: ${({ selected }) =>
    selected
      ? `${`${colors?.button?.primaryText}`}`
      : `${`${colors?.text?.gray300}`}`};
  text-align: center;
  cursor: pointer;
  word-break: break-word;

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
