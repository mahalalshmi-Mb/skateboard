import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import moment from "util/momentWrapper";
import { NavContext } from "../../../../context/navContext";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import { isMobile } from "react-device-detect";
import TerminalGrid from "../../components/molecules/TerminalGrid";
import FilterList from "../../components/molecules/FilterList";
import {
  device,
  fetchStoreFrontURL,
} from "../../../../commons/util/helperFunctions";
import Text from "../../../../components/atoms/Text";
import DirectoryCard from "../../components/molecules/directoryCard";
import FilterIcon from "../../../../assets/images/commons/filterIconBlack.svg";
import CrossIcon from "../../../../components/molecules/BottomDrawer/assets/cross.svg";
import FilterCarousel from "../../components/molecules/FilterCarousel";
import config, { channel } from "../../../../commons/config";
import callAPI from "../../../../commons/callAPI";
import PushAlert from "../../../../components/atoms/pushAlert";
import HeroBannerBg from "../../assets/directory-hero-bg.png";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import { colors } from "theme/colors";
import CustomCheckbox from "components/atoms/customCheckbox";
import { useConfig } from "context/configContext";
import Switch from "@mui/material/Switch";
import Loader from "components/atoms/loader";
import HorizontalLoader from "components/atoms/horizontalLoader";

const Directory = () => {
  const useNav = useContext(NavContext);
  const { pushHistory } = useCustomNavigation();
  const { timezone, appConfig } = useConfig();
  const [isDeliveryQrCode] = useState(
    getSessionStorage("qrCodeSource")
      ?.toLowerCase()
      ?.includes("deliver-to-gate")
  );
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);
  const [landingPageConstruct, setLandingPageConstruct] = useState([]);
  const [landingPageData, setLandingPageData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [globalFilterParams, setGlobalFilterParams] = useState({});
  const [sectionFilterParams, setSectionFilterParams] = useState({
    "terminal.value": ["All"],
  });
  const [storeCategorySelected, setStoreCategorySelected] = useState(
    sectionFilterParams["shopCategory.value"]
  );
  const [isCheckBox, setIsCheckBox] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(true);

  useEffect(() => {
    if (!isDeliveryQrCode) {
      if (isMobile) {
        useNav.hideFooterNavs();
        useNav.showHeaderGoBack();
      } else {
        useNav.hideFooterNavs();
        useNav.hideHeaderGoBack();
      }
    } else {
      useNav.hideAllNavs();
    }

    return () => {
      if (!isDeliveryQrCode) {
        useNav.showHeaderNavs();
        useNav.showFooterNavs();
        useNav.hideHeaderGoBack();
      } else {
        useNav.showAllNavs();
      }
    };
  }, []);

  useEffect(() => {
    getPageLayout();
  }, [window.location.pathname, globalFilterParams]);

  useEffect(() => {
    setStoreCategorySelected(sectionFilterParams["shopCategory.value"]);
  }, [sectionFilterParams]);

  const getPageLayout = async () => {
    try {
      const localSectionFilterData = getFilterFromUrl() || {};
      let apiURL = config.api.products.landingPageConstruct;
      const response = await callAPI.get(apiURL, {
        channel: channel,
        page: "Directory",
      });
      const regResponse = await response.json();
      if (regResponse.status === 200) {
        setLandingPageConstruct(regResponse.data);
        const promises = regResponse?.data?.sections?.map((x) =>
          getPageData(
            x.displayCollectionId,
            x?.sectionComponent?.noOfItemsToShow,
            x.filterComponentId,
            localSectionFilterData || {}
          )
        );
        await Promise.all(promises);
        setIsLoading(false);
      } else {
        PushAlert.error("Page layout not found");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const clearAllFilters = async () => {
    setIsLoading(true);
    setGlobalFilterParams({});
    setSectionFilterParams({ "terminal.value": ["All"] });
    const promises = landingPageConstruct?.sections?.map((x) =>
      getPageData(
        x.displayCollectionId,
        x?.sectionComponent?.noOfItemsToShow,
        x.filterComponentId,
        {}
      )
    );
    await Promise.all(promises);
    setShowMobileFilterModal(false);
    setIsLoading(false);
  };

  const getFilterFromUrl = () => {
    let urlParam = window?.location?.search || "";
    if (urlParam && urlParam !== "") {
      let filterParamObj = JSON.parse(JSON.stringify(sectionFilterParams));
      let urlParamArr = urlParam?.split("&");
      urlParamArr?.forEach((x) => {
        let filterValue = decodeURIComponent(x?.split("=")?.[1]) || "";
        let valueArray = [];
        let key = x?.split("=")?.[0]?.replaceAll("?", "");

        if (key === "isPresecurity" && filterValue === "true") {
          setIsCheckBox(true);
        }

        if (filterParamObj.hasOwnProperty(key)) {
          let value = filterParamObj[key];
          if (!value.includes(filterValue)) {
            value.splice(0, value.length);
            value.push(filterValue);
          }
        } else {
          valueArray.push(filterValue);
          filterParamObj[key] = valueArray;
        }
      });
      setSectionFilterParams(filterParamObj);
      return filterParamObj;
    }
  };

  const getPageData = async (
    displayCollectionId,
    noOfItemsToShow,
    filterComponentId,
    sectionFilterData
  ) => {
    try {
      let apiURL = config.api.products.displayCollection;
      let reqBody = {};
      reqBody = {
        collectionId: displayCollectionId,
        filterComponentId: filterComponentId,
        timezone: timezone,
        ...sectionFilterData,
      };
      const response = await callAPI.get(apiURL, reqBody);
      const regResponse = await response.json();
      if (regResponse.status === 200) {
        let limitedItems = regResponse?.data;
        if (noOfItemsToShow > 0) {
          limitedItems.items = (
            Array.isArray(limitedItems?.items)
              ? limitedItems?.items
              : limitedItems?.items?.data
          )?.filter((val, i) => i < noOfItemsToShow);
        }
        if (limitedItems?.items?.length > 0) {
          limitedItems?.items?.sort((a, b) =>
            a?.storeDisplayName?.toLowerCase() >
            b?.storeDisplayName?.toLowerCase()
              ? 1
              : -1
          );
        }
        setIsFilterLoading(false);
        setLandingPageData((oldValue) => {
          return { ...oldValue, [regResponse?.data?._id]: limitedItems };
        });
      }
    } catch (e) {
      console.log(e);
      setIsFilterLoading(false);
    }
  };

  const getDirectoryList = () => {
    const found = Object.values(landingPageData)?.find(
      (x) => x.label === "Directory"
    );
    if (found) {
      let directoryList = found?.items?.filter((x) => x?.active);
      return directoryList || [];
    } else {
      return [];
    }
  };

  const getTerminalList = () => {
    const found = Object.values(landingPageData)?.find(
      (x) => x.label === "Directory"
    );
    if (found) {
      const filterFound = found?.facets?.facets?.find(
        (x) => x.facetLayout === "terminalGrid"
      );
      if (filterFound) {
        return (
          { displayCollectionId: found?._id, filterData: filterFound } || {}
        );
      } else {
        return {};
      }
    } else {
      return {};
    }
  };

  const getFilterList = () => {
    const found = Object.values(landingPageData)?.find(
      (x) => x.label === "Directory"
    );
    if (found) {
      const filterFound = found?.facets?.facets?.filter(
        (x) => x.facetLayout === "filterList"
      );
      if (filterFound?.length > 0) {
        let arr = [];
        arr.push({ displayCollectionId: found?._id, filterData: filterFound });
        return (
          { displayCollectionId: found?._id, filterData: filterFound } || {}
        );
      } else {
        return {};
      }
    } else {
      return {};
    }
  };

  const getCheckBoxList = () => {
    const found = Object.values(landingPageData)?.find(
      (x) => x.label === "Directory"
    );
    if (found) {
      const filterFound = found?.facets?.facets?.find(
        (x) => x.facetLayout === "checkBox"
      );
      if (filterFound) {
        return (
          { displayCollectionId: found?._id, filterData: filterFound } || {}
        );
      } else {
        return {};
      }
    } else {
      return {};
    }
  };

  const handleFilter = (
    filterParam,
    filterValue,
    isMultiSelect,
    isFalseCheck
  ) => {
    const found = landingPageConstruct?.sections?.find(
      (x) => x.sectionComponent?.name === "Directory Section"
    );
    let displayCollectionId = found?.displayCollectionId || "";
    let item = found || {};

    let filterParamObj = JSON.parse(JSON.stringify(sectionFilterParams));
    let valueArray = [];
    let key = filterParam;

    if (filterParamObj.hasOwnProperty(key)) {
      let value = filterParamObj[key];
      if (value.includes(filterValue?.value)) {
        value.splice(value.indexOf(filterValue?.value), 1);
      } else {
        if (!isMultiSelect) {
          value.splice(0, value.length);
          value.push(filterValue?.value);
        } else {
          value.push(filterValue?.value);
        }
      }
    } else {
      valueArray.push(filterValue?.value);
      filterParamObj[key] = valueArray;
    }
    if (isFalseCheck && filterParamObj[filterParam]?.[0] === false) {
      delete filterParamObj[filterParam];
    }
    setIsFilterLoading(true);
    setSectionFilterParams(filterParamObj);
    getPageData(
      displayCollectionId,
      item?.sectionComponent?.noOfItemsToShow,
      item.filterComponentId,
      filterParamObj
    );
  };

  const handleStoreClick = (storeObj) => {
    const storeDetails = fetchStoreFrontURL(storeObj, storeObj?._id);
    const found = landingPageConstruct?.sections?.find(
      (x) => x.sectionComponent?.name === "Directory Section"
    );
    const filterComponentId = found?.filterComponentId || "";
    let data =
      JSON.parse(JSON.stringify(getSessionStorage("productsData"))) || {};
    let deliveryOptions = {};
    deliveryOptions.deliveryOption = config.deliveryOptions.takeaway;
    deliveryOptions.deliveryTime = moment(new Date(), "UTC", "UTC").format();
    deliveryOptions.isDelivery = false;
    deliveryOptions.isPackagingRequested = true;
    deliveryOptions.timezone = timezone;
    let terminalSelected = "";
    terminalSelected
      ? (data.terminal = storeObj?.terminal?.value?.replaceAll(" ", ""))
      : (data.terminal = storeObj?.terminal?.value?.replaceAll(" ", ""));
    data.movementType = storeObj?.movementType?.value;
    data.sector = storeObj?.sector?.value;
    data.displayLabel = storeObj?.terminal?.displayLabel;
    // data.domain = "Food and Beverages";
    data.deliveryOptions = deliveryOptions;
    setSessionStorage("productsData", data);
    pushHistory(
      `/storefront/${storeDetails}?filterComponentId=${filterComponentId}`
    );
  };

  const GreenSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: colors?.button?.primaryBackground,
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      background: colors?.button?.primaryBackground,
    },
    "& .MuiSwitch-sizeMedium": {
      padding: "7px",
      height: "36px",
    },
    "& .MuiSwitch-track": {
      borderRadius: "16px",
    },
    "& .MuiSwitch-switchBase:hover": {
      backgroundColor: "transparent",
    },
    "& .MuiSwitch-root.MuiSwitch-sizeMedium": {
      padding: "8px",
    },
  }));

  const CheckboxFilter = () => {
    return (
      <CheckboxWrapper>
        <CheckboxTitle>
          <Text type="bold">
            {getCheckBoxList()?.filterData?.facetDetails?.facetLabel}
          </Text>
        </CheckboxTitle>
        <CheckboxContainer>
          <Text type="regular">
            {
              getCheckBoxList()?.filterData?.facetDetails?.facetOptionValues[0]
                ?.displayLabel
            }
          </Text>
          {/* <CustomCheckbox
            checked={isCheckBox}
            checkedColor={colors?.primary}
            handleChange={(e) => {
              setIsCheckBox(e.target.checked);
              handleFilter(
                getCheckBoxList()?.filterData?.filterParam,
                e.target.checked,
                "",
                true
              );
            }}
          /> */}
          <GreenSwitch
            checked={isCheckBox}
            onChange={(e) => {
              setIsCheckBox(e.target.checked);
              handleFilter(
                getCheckBoxList()?.filterData?.filterParam,
                { value: e.target.checked },
                "",
                true
              );
            }}
            inputProps={{ "aria-label": "controlled" }}
          />
        </CheckboxContainer>
      </CheckboxWrapper>
    );
  };

  const getSelectedFilters = () => {
    const keyMap = {
      isPresecurity: "Pre-Security",
    };

    let filters = Object.entries(sectionFilterParams).map(([key, value]) => ({
      key: keyMap[key] || key,
      value,
    }));

    filters = filters?.filter((item) => !item.value.includes("All"));
    return filters || [];
  };

  const removeSelectedFilters = async (selFilter, key) => {
    Object.values(sectionFilterParams)?.forEach((x) => {
      if (x.includes(selFilter)) {
        x.splice(x.indexOf(selFilter), 1);
      }
    });
    if (key === "Pre-Security") {
      setIsCheckBox(false);
    }

    setIsLoading(true);
    const promises = landingPageConstruct?.sections?.map((x) =>
      getPageData(
        x.displayCollectionId,
        x?.sectionComponent?.noOfItemsToShow,
        x.filterComponentId,
        sectionFilterParams
      )
    );
    await Promise.all(promises);
    setShowMobileFilterModal(false);
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <Wrapper>
        {landingPageConstruct?.strapiPageComponent?.displayLabel && (
          <BannerContainer>
            <BannerWrapper
              backgroundColor={
                landingPageConstruct?.strapiPageComponent?.backgroundColor
              }
            >
              <BannerText>
                <Text type="bold" variant="heading">
                  {landingPageConstruct?.strapiPageComponent?.displayLabel}
                </Text>
              </BannerText>
            </BannerWrapper>
          </BannerContainer>
        )}
        <ContentContainer>
          <MobileFilterContainer>
            {Object.keys(getFilterList()).length > 0 && (
              <MobileFilterButton
                onClick={() => setShowMobileFilterModal(true)}
              >
                <MobileFilterButtonIcon src={FilterIcon} />
              </MobileFilterButton>
            )}
            <StoresCountMobile>
              <Text type="bold">{`Showing ${
                getDirectoryList()?.length
              } results${
                storeCategorySelected && storeCategorySelected?.length > 0
                  ? ` for ${storeCategorySelected.join(", ")}`
                  : ""
              }`}</Text>
            </StoresCountMobile>
          </MobileFilterContainer>
          {getSelectedFilters()?.length > 0 && (
            <SelectedFilterContainer>
              {getSelectedFilters()?.map((item, index) =>
                item?.value?.map((filterItem, subIndex) => (
                  <SelectedFilterButton
                    key={subIndex}
                    onClick={() => removeSelectedFilters(filterItem, item.key)}
                  >
                    <Text>
                      {filterItem === true || filterItem === "true"
                        ? item?.key
                        : filterItem}
                    </Text>
                    <RemoveFilterIcon
                      src={require(`../../../../assets/images/directory/${appConfig.locationId}/close-icon.svg`)}
                    />
                  </SelectedFilterButton>
                ))
              )}
            </SelectedFilterContainer>
          )}
          <FilterContainer>
            <ShowAllContainer>
              <ShowAllHeader>
                <Text type="bold">All Directory</Text>
              </ShowAllHeader>
              <ShowAllSubHeader onClick={() => clearAllFilters()}>
                <Text>Show All</Text>
              </ShowAllSubHeader>
            </ShowAllContainer>
            <HorizontalDivider />
            {Object.keys(getCheckBoxList()).length > 0 &&
              getCheckBoxList()?.filterData?.facetDetails?.facetOptionValues
                ?.length > 0 &&
              CheckboxFilter()}
            {Object.keys(getTerminalList()).length > 0 && (
              <>
                <TerminalGrid
                  data={getTerminalList() || {}}
                  handleFilterClick={handleFilter}
                  landingPageData={landingPageData}
                  selectedFilter={sectionFilterParams}
                />
              </>
            )}
            {getFilterList()?.filterData?.length > 0 && (
              <>
                <HorizontalDivider />
                {getFilterList()?.filterData?.map((filterItem, filterIndex) => (
                  <FilterList
                    index={filterIndex}
                    data={filterItem || {}}
                    handleFilterClick={handleFilter}
                    landingPageData={landingPageData}
                    selectedFilter={sectionFilterParams}
                    isLastItem={
                      filterIndex === getFilterList()?.filterData?.length - 1
                    }
                  />
                ))}
              </>
            )}
          </FilterContainer>
          {isFilterLoading ? (
            <LoaderContainer>
              <HorizontalLoader />
            </LoaderContainer>
          ) : (
            getDirectoryList()?.length > 0 && (
              <StoreListingContainer>
                <StoresCountDesktop>
                  <Text type="bold">{`Showing ${
                    getDirectoryList()?.length
                  } results${
                    storeCategorySelected && storeCategorySelected?.length > 0
                      ? ` for ${storeCategorySelected.join(", ")}`
                      : ""
                  }`}</Text>
                </StoresCountDesktop>
                <StoreListingWrapper>
                  {getDirectoryList()?.map((item, index) => (
                    <DirectoryCard
                      key={index}
                      data={item}
                      handleStoreClick={handleStoreClick}
                    />
                  ))}
                </StoreListingWrapper>
              </StoreListingContainer>
            )
          )}
        </ContentContainer>
        {showMobileFilterModal && (
          <MobileFilterModal>
            <MobileFilterModalTitle>
              <Text type="bold" variant="heading">
                Filter Your Results
              </Text>
            </MobileFilterModalTitle>
            <MobileFilterModalTitleCloseIcon
              src={CrossIcon}
              onClick={() => setShowMobileFilterModal(false)}
            />
            <ShowAllContainer>
              <ShowAllHeader>
                <Text type="bold">All Directory</Text>
              </ShowAllHeader>
              <ShowAllSubHeader onClick={() => clearAllFilters()}>
                <Text>Show All</Text>
              </ShowAllSubHeader>
            </ShowAllContainer>
            <HorizontalDivider />
            <TerminalContentContainer>
              {Object.keys(getCheckBoxList()).length > 0 && CheckboxFilter()}
              {Object.keys(getTerminalList()).length > 0 && (
                <TerminalGrid
                  data={getTerminalList() || {}}
                  handleFilterClick={handleFilter}
                  landingPageData={landingPageData}
                  selectedFilter={sectionFilterParams}
                />
              )}
              {getFilterList()?.filterData?.length > 0 && (
                <>
                  <HorizontalDivider />
                  {getFilterList()?.filterData?.map(
                    (filterItem, filterIndex) => (
                      <FilterList
                        index={filterIndex}
                        data={filterItem || {}}
                        handleFilterClick={handleFilter}
                        landingPageData={landingPageData}
                        selectedFilter={sectionFilterParams}
                        isLastItem={
                          filterIndex ===
                          getFilterList()?.filterData?.length - 1
                        }
                      />
                    )
                  )}
                </>
              )}
            </TerminalContentContainer>
          </MobileFilterModal>
        )}
      </Wrapper>
    );
  }
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;
const BannerContainer = styled.div`
  width: 100%;
`;
const BannerWrapper = styled.div`
  width: 100%;
  background-color: ${({ backgroundColor }) => backgroundColor};
  background-image: url(${HeroBannerBg});
  background-position: right;
  background-size: auto;
  padding: 24px 16px;
  background-repeat: no-repeat;

  @media ${device.laptop} {
    padding: 48px 136px;
  }
`;
const BannerText = styled.div`
  font-size: 32px;
  color: ${colors?.text?.white900};
`;
const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;

  @media ${device.laptop} {
    flex-direction: row;
    gap: 0px 56px;
    padding: 24px 72px;
    overflow-y: hidden;
    height: calc(100vh - 80px);
  }

  @media ${device.laptopL} {
    padding: 24px 136px;
  }
`;
const MobileFilterButton = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0px 8px;
  color: ${colors?.text?.black900};
  font-size: 16px;
  font-weight: 500;
  border: 1px solid;
  width: 44px;
  height: 44px;
  border-radius: 12px;

  @media ${device.laptop} {
    display: none;
  }
`;
const MobileFilterButtonIcon = styled.img``;
const FilterContainer = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    flex-direction: column;
    max-height: 70vh;
    gap: 16px 0px;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    min-width: 290px;
    max-width: 290px;
    padding: 24px;
    align-items: center;
    border-radius: 16px;
    border: 1px solid ${colors?.border};
    background: #f6f6f6;
    height: fit-content;

    ::-webkit-scrollbar {
      width: 0;
      background: transparent;
      scrollbar-width: none;
    }
  }
`;
const StoreListingContainer = styled.div`
  @media ${device.laptop} {
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;

    ::-webkit-scrollbar {
      width: 0;
      background: transparent;
      scrollbar-width: none;
    }
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;

  @media ${device.laptop} {
    height: 50vh;
  }
`;

const StoresCountMobile = styled.div`
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    display: none;
  }
`;
const StoresCountDesktop = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.1px;
    color: ${colors?.text?.black200};
  }
`;
const StoreListingWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 69px 0px;
  margin-top: 16px;

  @media ${device.laptop} {
    gap: 48px 0px;
  }
`;
const MobileFilterModal = styled.div`
  position: relative;
  top: 0;
  left: 0;
  bottom: 0;
  height: calc(100% - 2rem);
  max-width: 100%;
  width: calc(100% - 2rem);
  margin: 1rem;
  border-radius: 0.5rem;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  background: #efefef;
  position: fixed;
  padding: 2rem 2rem 0;
  z-index: 99999;
  box-shadow: 0 0 0 3em rgba(0, 0, 0, 0.4);
`;
const MobileFilterModalTitleCloseIcon = styled.img`
  position: absolute;
  right: 24px;
  top: 24px;
  width: 24px;
  height: 24px;
`;
const MobileFilterModalTitle = styled.div`
  font-size: 24px;
  color: ${colors?.text?.black200};
  margin-bottom: 32px;
`;
const TerminalContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px 0px;
`;
const CheckboxWrapper = styled.div`
  width: 100%;
  display: flex;
  padding-top: 8px;
  flex-direction: column;
`;
const CheckboxTitle = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${colors?.text?.black300};
`;
const CheckboxContainer = styled.div`
  width: 100%;
  display: flex;
  padding-top: 8px;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  justify-content: space-between;
`;

const HorizontalDivider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0px;
  color: ${colors?.border};
  opacity: 1;
`;
const MobileFilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0px 12px;

  @media ${device.laptop} {
    display: none;
  }
`;
const ShowAllContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;

  @media ${device.laptop} {
    padding: 0px;
  }
`;
const ShowAllHeader = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${colors?.text?.black300};
`;
const ShowAllSubHeader = styled.div`
  width: fit-content;
  margin-top: 6px;
  font-size: 14px;
  color: ${colors?.text?.gray300};
  cursor: pointer;

  @media ${device.laptop} {
    &:hover {
      text-decoration: underline;
    }
  }
`;
const SelectedFilterContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 12px;

  @media ${device.laptop} {
    display: none;
  }
`;
const SelectedFilterButton = styled.div`
  width: max-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0px 6px;
  border-radius: 36px;
  border: 1px solid ${colors?.primary};
  background-color: ${colors?.text?.white100};
  padding: 4px 12px;

  font-size: 10px;
  color: ${colors?.primary};
  line-height: 18px;
`;
const RemoveFilterIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export default Directory;
