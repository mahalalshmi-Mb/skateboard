import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import { device } from "../../../../commons/util/helperFunctions";
import TerminalGrid from "pages/edpFSTR/components/molecules/TerminalGrid";
import FilterList from "../../components/molecules/FilterList";
import config, { channel } from "../../../../commons/config";
import callAPI from "../../../../commons/callAPI";
import PushAlert from "../../../../components/atoms/pushAlert";
import CrossIcon from "../../../../components/molecules/BottomDrawer/assets/cross.svg";
import { colors } from "theme/colors";
import Loader from "components/atoms/loader";
import HorizontalLoader from "components/atoms/horizontalLoader";

const Offers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(true);
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);
  const [sectionFilterParams, setSectionFilterParams] = useState({
    terminal: ["All"],
  });
  const [landingPageConstruct, setLandingPageConstruct] = useState([]);
  const [offersDetail, setOffersDetail] = useState([]);
  const [allTerminalCount, setAllTerminalCount] = useState();
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    getPageLayout();
  }, [window.location.pathname]);

  const getPageLayout = async () => {
    try {
      let apiURL = config.api.products.landingPageConstruct;
      const response = await callAPI.get(apiURL, {
        channel: channel,
        page: "Offers",
      });
      const regResponse = await response.json();
      if (regResponse.status === 200) {
        setLandingPageConstruct(regResponse.data);
        const promises = regResponse?.data?.sections?.map((x) =>
          getPageData(
            x.displayCollectionId,
            x?.sectionComponent?.noOfItemsToShow,
            x.filterComponentId,
            {}
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
        ...sectionFilterData,
      };
      const response = await callAPI.get(apiURL, reqBody);
      const regResponse = await response.json();
      if (regResponse.status === 200) {
        setOffersDetail(regResponse.data);
        setIsFilterLoading(false);
        setLandingPageData((oldValue) => {
          return { ...oldValue, [regResponse?.data?._id]: regResponse?.data };
        });
        setAllTerminalCount(regResponse?.data?.pagination?.totalElements);
      }
    } catch (e) {
      console.log(e);
      setIsFilterLoading(false);
    }
  };

  const setImageListHandler = () => {
    const data = offersDetail?.items?.data?.attributes?.offerList || [];
    const urls = data?.map((item) => {
      return item?.offerImage?.data?.map((image) => image.attributes.url);
    });
    return (urls && urls.flat()) || [];
  };

  const getTerminalList = () => {
    const found = Object.values(landingPageData)?.find(
      (x) => x.label === "Offers"
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
      (x) => x.label === "Offers"
    );
    if (found) {
      const filterFound = found?.facets?.facets?.find(
        (x) => x.facetLayout === "filterList"
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
      (x) => x.sectionComponent?.name === "OfferSection"
    );
    let displayCollectionId = found?.displayCollectionId || "";
    let item = found || {};

    let filterParamObj = JSON.parse(JSON.stringify(sectionFilterParams));
    let valueArray = [];
    let key = filterParam;

    if (filterParamObj.hasOwnProperty(key)) {
      let value = filterParamObj[key];
      if (value.includes(filterValue?.value) && filterValue?.value !== "All") {
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
    if (filterParamObj?.terminal?.length === 0) {
      filterParamObj?.terminal?.push("All");
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

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <Wrapper>
        <ContentContainer>
          <MobileFilterContainer>
            <MobileFilterButton onClick={() => setShowMobileFilterModal(true)}>
              <Text type="bold">
                {`Showing `}
                <span
                  style={{
                    textDecoration: "underline",
                    color: "#00a6ce",
                    fontSize: "1rem",
                  }}
                >
                  {Array.isArray(sectionFilterParams?.terminal) &&
                  sectionFilterParams?.terminal.includes("All")
                    ? "All Terminals"
                    : sectionFilterParams?.terminal || "All Terminal"}
                </span>
              </Text>
            </MobileFilterButton>
          </MobileFilterContainer>
          <FilterContainer>
            <TerminalGrid
              data={getTerminalList() || []}
              selectedFilter={sectionFilterParams}
              handleFilterClick={handleFilter}
              allTerminalCount={allTerminalCount}
              isCount={true}
            />
            <FilterList
              data={getFilterList() || {}}
              selectedFilter={sectionFilterParams}
              handleFilterClick={handleFilter}
            />
          </FilterContainer>
          {isFilterLoading ? (
            <LoaderContainer>
              <HorizontalLoader />
            </LoaderContainer>
          ) : setImageListHandler()?.length > 0 ? (
            <ImageContainer>
              <Text type="bold">
                {`Showing ${setImageListHandler()?.length} results for `}
                {Array.isArray(sectionFilterParams?.offerCategory) &&
                sectionFilterParams?.offerCategory.length > 0
                  ? sectionFilterParams?.offerCategory?.[0] || ""
                  : "All Offers"}
              </Text>
              {setImageListHandler()?.map((url, index) => (
                <ImageWrapper key={index}>
                  <StyledImage src={url} />
                </ImageWrapper>
              ))}
            </ImageContainer>
          ) : (
            <NoOffersContainer>
              <NoOffersText>
                <Text type="bold">No Offers found</Text>
              </NoOffersText>
            </NoOffersContainer>
          )}
        </ContentContainer>
        {showMobileFilterModal && (
          <MobileFilterModal>
            <MobileFilterModalTitle>
              <Text type="bold">Terminals</Text>
            </MobileFilterModalTitle>
            <MobileFilterModalTitleCloseIcon
              src={CrossIcon}
              onClick={() => setShowMobileFilterModal(false)}
            />
            <TerminalContentContainer>
              <TerminalGrid
                data={getTerminalList() || []}
                selectedFilter={sectionFilterParams}
                handleFilterClick={handleFilter}
                allTerminalCount={allTerminalCount}
                showMobileFilterModal={showMobileFilterModal}
                setShowMobileFilterModal={setShowMobileFilterModal}
                isCount={true}
              />
              <FilterList
                data={getFilterList() || {}}
                selectedFilter={sectionFilterParams}
                handleFilterClick={handleFilter}
              />
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
const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;

  @media ${device.laptop} {
    flex-direction: row;
    gap: 0px 70px;
    padding: 36px;
  }

  @media ${device.laptop} {
    padding: 36px;
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
const MobileFilterModalTitle = styled.div`
  font-size: 24px;
  color: #273135;
`;
const MobileFilterModalTitleCloseIcon = styled.img`
  position: absolute;
  right: 24px;
  top: 24px;
  width: 24px;
  height: 24px;
`;
const MobileFilterButton = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 0px 8px;
  color: ${colors?.text?.black900};
  font-size: 16px;
  font-weight: 500;
  border: 1px solid;
  padding: 16px;
  border-radius: 8px;
  margin-right: 16px;
  margin-bottom: 16px;

  @media ${device.laptop} {
    display: none;
  }
`;

const MobileFilterContainer = styled.div`
  display: flex;

  @media ${device.laptop} {
    display: none;
  }
`;

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

const MobileFilterModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  height: calc(100% - 9rem);
  max-width: 100%;
  width: calc(100% - 2rem);
  margin: 1rem;
  border-radius: 0.5rem;
  background: #fff;
  position: fixed;
  padding: 2rem 2rem 0;
  z-index: 9999;
  box-shadow: 0 0 0 3em rgba(0, 0, 0, 0.4);
  overflow-x: hidden;
  overflow-y: scroll;
  margin-top: 8rem;

  @media ${device.laptop} {
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
  }
`;

const TerminalContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px 0px;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 440px;
  overflow: scroll;
  scrollbar-width: none;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  transition: filter 0.3s ease, opacity 0.3s ease;
`;
const NoOffersContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const NoOffersText = styled.div`
  font-size: 16px;
  color: ${colors?.text?.black200};
`;
export default Offers;
