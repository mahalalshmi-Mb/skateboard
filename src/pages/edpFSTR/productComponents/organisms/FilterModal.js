import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import BottomDrawer from "../../../../components/molecules/BottomDrawer/BottomDrawer";
import Loader from "../../../../components/atoms/loader";
import Text from "../../../../components/atoms/Text";

import GreyTickIcon from "../../assets/greyTickIcon.svg";
import HorzScrollContainer from "./HorzScrollContainer";
import TagButton from "../../components/molecules/TagButton";

function FilterModal(props) {
  const sheetRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState(
    props?.data[0]?.facetDetails?.facetLabel
  );
  const [filterList, setFilterList] = useState([]);
  const [selFilters, setSelFilters] = useState(props.selectedFilters);

  const closeModal = () => {
    document.body.style.overflow = "auto";
    handleOnClose();
    props.setIsDrawerOpen(false);
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
  };

  useEffect(() => {
    getFilterList();
  }, [selectedFilterCategory]);

  const handleFilterCategoryClick = (selectedCategory) => {
    setSelectedFilterCategory(selectedCategory);
  };

  const getFilterList = () => {
    const found = props?.data?.find(
      (x) => x?.facetDetails?.facetLabel === selectedFilterCategory
    );
    if (found) {
      setFilterList([...found?.facetDetails?.facetOptionValues]);
    }
  };

  const handleFilterSelection = (filterValue) => {
    let data = JSON.parse(JSON.stringify(selFilters));
    if (data.includes(filterValue)) {
      data.splice(data.indexOf(filterValue), 1);
    } else {
      data.push(filterValue);
    }
    setSelFilters([...data]);
    createFilterParams(filterValue);
  };

  const createFilterParams = (filterValue) => {
    let filterParamObj = JSON.parse(JSON.stringify(props.filterParams));
    let valueArray = [];
    const found = props?.data?.find(
      (x) => x?.facetDetails?.facetLabel === selectedFilterCategory
    );
    if (found) {
      let key = found.filterParam;
      if (filterParamObj.hasOwnProperty(key)) {
        let value = filterParamObj[key];
        if (value.includes(filterValue)) {
          value.splice(value.indexOf(filterValue), 1);
        } else {
          value.push(filterValue);
        }
      } else {
        valueArray.push(filterValue);
        filterParamObj[key] = valueArray;
      }
    }
    props.setFilterParams(filterParamObj);
  };

  const handleClearAll = () => {
    setSelectedFilterCategory(props?.data[0]?.facetDetails?.facetLabel);
    setFilterList(props?.data[0]?.facetDetails?.facetOptionValues);
    setSelFilters([]);
    props.setFilterParams({});
  };

  const removeFilterSelection = (e, filterValue) => {
    e?.stopPropagation();
    let data = JSON.parse(JSON.stringify(selFilters));
    if (data.includes(filterValue)) {
      data.splice(data.indexOf(filterValue), 1);
    }

    let subData = JSON.parse(JSON.stringify(props.filterParams));
    Object.values(subData).forEach((x) => {
      if (x.includes(filterValue)) {
        x.splice(x.indexOf(filterValue), 1);
      }
    });

    setSelFilters([...data]);
    props.setFilterParams(subData);
  };

  const handleOnClose = () => {
    handleClearAll();
    if (props.closeHandler) {
      props.closeHandler();
      closeModal();
    }
  };

  const handleOnSubmit = () => {
    props.setSelectedFilters([...selFilters]);
    if (props.applyHandler) {
      props.applyHandler();
      closeModal();
    }
  };

  return (
    <BottomDrawer
      sheetRef={sheetRef}
      isOpen={props.isDrawerOpen}
      setIsOpen={props.setIsDrawerOpen}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F4F4F5",
        borderRadius: "8px 8px 0px 0px",
        maxHeight: "80vh",
      }}
      snapPoints={[1, 0]}
      initialSnap={0}
      disableDrag
      hideHeader={true}
      hideCloseIcon={true}
      handleClose={closeModal}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Wrapper>
          <ContentWrapper>
            <HeaderWrapper>
              <HeaderText>
                <Text type="bold">Filter By</Text>
              </HeaderText>
              <ClearText onClick={() => handleClearAll()}>
                <Text type="extra-bold">Clear All</Text>
              </ClearText>
            </HeaderWrapper>
            <SelectedFilterListContainer>
              <HorzScrollContainer>
                {selFilters?.map((item, index) => (
                  <TagButton
                    key={index}
                    text={item}
                    showIcon={false}
                    selected={true}
                    clearFilter={(e) => removeFilterSelection(e, item)}
                  />
                ))}
              </HorzScrollContainer>
            </SelectedFilterListContainer>
            <FilterListContainer>
              <FilterCategoryContainer>
                {props?.data?.map((item, index) => (
                  <FilterCategoryCard
                    key={index}
                    selected={
                      selectedFilterCategory === item?.facetDetails?.facetLabel
                    }
                    onClick={() =>
                      handleFilterCategoryClick(item?.facetDetails?.facetLabel)
                    }
                  >
                    {selectedFilterCategory ===
                      item?.facetDetails?.facetLabel && (
                      <SelectedFilterCategoryMarker />
                    )}
                    <FilterCategoryCardWrapper>
                      <FilterCategoryText>
                        <Text type="bold">
                          {item?.facetDetails?.facetLabel}
                        </Text>
                      </FilterCategoryText>
                    </FilterCategoryCardWrapper>
                  </FilterCategoryCard>
                ))}
              </FilterCategoryContainer>
              <FiltersContainer>
                {filterList?.map((filItem, filIndex) => (
                  <FilterListCard
                    key={filIndex}
                    style={filIndex === 0 ? { paddingTop: "16px" } : {}}
                    selected={selFilters?.includes(filItem.value)}
                    onClick={() => handleFilterSelection(filItem.value)}
                  >
                    <FilterListCardTitleWrapper>
                      {selFilters?.includes(filItem.value) && (
                        <TickIcon src={GreyTickIcon} />
                      )}
                      <FilterListCardTitle>
                        <Text>{filItem.displayLabel}</Text>
                      </FilterListCardTitle>
                    </FilterListCardTitleWrapper>
                    <FilterListCardCount>
                      <Text>{filItem.count}</Text>
                    </FilterListCardCount>
                  </FilterListCard>
                ))}
              </FiltersContainer>
            </FilterListContainer>
          </ContentWrapper>
          <FooterWrapper>
            <FooterButton onClick={() => handleOnClose()}>
              <Text type="extra-bold">Close</Text>
            </FooterButton>
            <VerticalDivider></VerticalDivider>
            <FooterButton onClick={() => handleOnSubmit()}>
              <Text type="extra-bold">Apply</Text>
            </FooterButton>
          </FooterWrapper>
        </Wrapper>
      )}
    </BottomDrawer>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f9f9f9;
  border-radius: 8px 8px 0px 0px;
  overflow-y: hidden;
`;
const ContentWrapper = styled.div`
  width: 100%;
  padding-top: 36px;
  height: calc(100% - 62px);
  max-height: calc(100% - 62px);
  padding-bottom: 62px;
  overflow-y: hidden;
`;
const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 24px 16px 24px;
`;
const HeaderText = styled.div`
  color: #273135;
  font-size: 24px;
  font-weight: 700;
  line-height: 31px;
`;
const ClearText = styled.div`
  color: #93989a;
  font-size: 14px;
  font-weight: 800;
`;
const SelectedFilterListContainer = styled.div`
  width: 100%;
  padding: 0px 0px 16px 24px;
`;
const FilterListContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  border-radius: 12px;
  background-color: #fff;
`;
const FilterCategoryContainer = styled.div`
  width: 30%;
  height: calc(500px - 62px);
  background: rgba(4, 173, 170, 0.08);
  overflow-y: scroll;
`;
const FilterCategoryCard = styled.div`
  width: 100%;
  height: 54px;
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.selected ? "#fff" : "transparent")};
  gap: ${(props) => (props.selected ? "20px" : "0px")};
  padding-left: ${(props) => (props.selected ? "0px" : "24px")};
  padding-right: 12px;
`;
const FilterCategoryCardWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const FilterCategoryText = styled.div`
  color: #273135;
  font-size: 14px;
`;
const SelectedFilterCategoryMarker = styled.div`
  width: 4px;
  height: 54px;
  background: #04adaa;
`;
const FiltersContainer = styled.div`
  width: 70%;
  height: calc(500px - 62px);
  overflow-y: scroll;
`;
const FilterListCard = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 20px 20px;
  background: transparent;
`;
const FilterListCardTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const TickIcon = styled.img`
  width: 14px;
  height: 12px;
`;
const FilterListCardTitle = styled.div`
  color: #273135;
  font-size: 14px;
  font-weight: 400;
`;
const FilterListCardCount = styled.div`
  color: #273135;
  font-size: 12px;
  font-weight: 400;
`;
const FooterWrapper = styled.div`
  width: 100%;
  height: 62px;
  position: fixed;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
`;
const FooterButton = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  color: #93989a;
  font-size: 16px;
  font-weight: 800;
  line-height: 21px;
`;
const VerticalDivider = styled.div`
  width: 1px;
  height: 28px;
  background: #d9d9d9;
`;
export default FilterModal;
