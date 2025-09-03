import Text from "components/atoms/Text";
import styled from "styled-components";
import { colors } from "theme/colors";
import { getSessionStorage } from "util/storageUtil";

const SectorGrid = (props) => {
  const terminals = props.data.terminals;
  let productsData = getSessionStorage("productsData");

  return (
    <>
    <Wrapper>
      <Text type="bold">
        Service Type
    </Text>
      <AllSectorsButton
        onClick={() => {
          props.handleFilterClick(
            terminals,
            terminals?.[0]
          );
        }}
      >
        <Text type="bold">{terminals[0]?.sectors[0]?.sector}</Text>
      </AllSectorsButton>

      {terminals?.length > 1 && (
        terminals?.map((item, index) =>(
            <SectorButton
              key={index}
              selected={
                (props.selectedFilter[terminals] &&
                  props.selectedFilter[terminals]?.includes(
                    item.sectors[0].sector
                  )) ||
                productsData?.sector === item.sectors[0].sector
              }
              onClick={() =>
                props.handleFilterClick(terminals, item)
              }
            >
              <Text>{item?.sectors[0]?.sector}</Text>
            </SectorButton>
          )
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
  padding-top:8px;
  & > div:nth-child(1) {
    font-size: 18px;
  }
`;
const AllSectorsButton = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 43px;
  padding: 10px 4px;
  flex-basis: 100%;
  margin: 0.1em 0;
  background-color: ${({ selected }) =>
    selected
      ? `${`${colors?.tertiaryForeground}`}`
      : `${`${colors?.primaryForeground}`}`};
  border: ${({ selected }) =>
    selected
      ? `1px solid ${colors?.tertiaryForeground}`
      : `1px solid ${colors?.border}`};
  border-radius: 6px;
  font-size: 14px;
  color: ${({ selected }) =>
    selected
      ? `${`${colors?.button?.primaryText}`}`
      : `${`${colors?.text?.gray300}`}`};
  cursor: pointer;
`;
const SectorButton = styled.li`
  flex-basis: 23%;
  background-color: ${({ selected }) =>
    selected
      ? `${`${colors?.tertiaryForeground}`}`
      : `${`${colors?.primaryForeground}`}`};
  border: ${({ selected }) =>
    selected
      ? `1px solid ${colors?.tertiaryForeground}`
      : `1px solid ${colors?.border}`};
  border-radius: 6px;
  min-height: 64px;
  padding: 0px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.1em 0;
  font-size: 1em;
  color: ${({ selected }) =>
    selected
      ? `${`${colors?.button?.primaryText}`}`
      : `${`${colors?.text?.gray300}`}`};
  text-align: center;
  cursor: pointer;

  &:nth-last-child(2) {
    flex-basis: 49%;
  }

  &:last-child {
    flex-basis: 49%;
  }
`;
export default SectorGrid;
