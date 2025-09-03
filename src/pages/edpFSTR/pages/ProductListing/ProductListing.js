import { useConfig } from "context/configContext";
import { useContext, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import moment from "util/momentWrapper";
import callAPI from "../../../../commons/callAPI";
import config from "../../../../commons/config";
import Loader from "../../../../components/atoms/loader";
import Text from "../../../../components/atoms/Text";
import { NavContext } from "../../../../context/navContext";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import {
  triggerCategorySelected,
  triggerFilterApplied,
  triggerFilterClosed,
  triggerFilterView,
  triggerSortClosed,
  triggerSortSelected,
  triggerSortView,
} from "../../../../util/analytics/cdp/DutyFree";
import {
  getSessionStorage,
  removeSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import SortImage from "../../assets/DownArrow.svg";
import FilterImage from "../../assets/filterIcon.svg";
import FloatingCart from "../../components/molecules/FloatingCart";
import TagButton from "../../components/molecules/TagButton";
import TerminalSectorWrapper from "../../components/molecules/TerminalSectorWrapper";
import ItemCustomizationModal from "../../components/organism/ItemCustomizationModal";
import ItemDetailModal from "../../components/organism/ItemDetailModal";
import RepeatSelectionModal from "../../components/organism/RepeatSelectionModal";
import CategoryBand from "../../productComponents/molecules/CategoryBand";
import ProductCard from "../../productComponents/molecules/ProductCard";
import FilterModal from "../../productComponents/organisms/FilterModal";
import GridContainer from "../../productComponents/organisms/GridContainer";
import HorzScrollContainer from "../../productComponents/organisms/HorzScrollContainer";
import SortModal from "../../productComponents/organisms/SortModal";
import SectionLoader from "./assets/sectionLoader.gif";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ProductListing = () => {
  const { pushHistory } = useCustomNavigation();
  let query = useQuery();
  const loaderRef = useRef(null);
  const useNav = useContext(NavContext);
  let productsData = getSessionStorage("productsData");
  const { timezone } = useConfig();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [filters, setFilters] = useState({});
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItem, setSelectedItem] = useState({});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCustomisationModal, setShowCustomisationModal] = useState(false);
  const [showRepeatSelectionModal, setShowRepeatSelectionModal] =
    useState(false);
  const [changeRepeatSelection, setChangeRepeatSelection] = useState(false);
  const [changeRepeatSelectionItem, setChangeRepeatSelectionItem] = useState(
    {}
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterParams, setFilterParams] = useState(
    getSessionStorage("productFilters")?.[productsData?.domain] || {}
  );
  const [productFilterParams, setProductFilterParams] = useState(
    getSessionStorage("productFilters")?.[productsData?.domain] || {}
  );
  const [sortValue, setSortValue] = useState("");

  const [pageNo, setPageNo] = useState(0);
  const [limit] = useState(6);
  const [listIsLoading, setListIsLoading] = useState(true);
  const [listHasMore, setListHasMore] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // const lastPastElement = useCallback(
  //   (node) => {
  //     if (listIsLoading) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       console.log("lastPastElement", entries, listHasMore);
  //       if (entries[0].isIntersecting && listHasMore) {
  //         setPageNo(pageNo + 1);
  //       }
  //     });
  //     if (node) observer.current.observe(node);
  //   },
  //   [listIsLoading, listHasMore]
  // );

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      listHasMore
    ) {
      setPageNo(pageNo + 1);
    }
  };

  useEffect(() => {
    // const handleScroll = () => {
    //   const { scrollTop, clientHeight, scrollHeight } =
    //     document.documentElement;
    //   if (scrollTop + clientHeight >= scrollHeight - 20 && listHasMore) {
    //     setPageNo(pageNo + 1);
    //   }
    // };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [listIsLoading, listHasMore]);

  useEffect(() => {
    let paramObj = {};
    for (var value of query.keys()) {
      paramObj[value] = encodeURIComponent(query.get(value));
    }
    if (paramObj["source"].includes("productCategory")) {
      getCategories();
    }
  }, [window.location.href]);

  useEffect(() => {
    useNav.hideFooterNavs();
    useNav.showHeaderNavs();
    useNav.showBottomNavs();
    useNav.showHeaderGoBack();

    if (pageNo === 0) {
      if (
        sortValue === "" &&
        Object.values(productFilterParams).length === 0 &&
        Object.values(filterParams).length === 0
      ) {
        getProducts();
      }
    } else {
      getProducts();
    }

    return () => {
      useNav.showHeaderNavs();
      useNav.showFooterNavs();
      useNav.hideHeaderGoBack();
    };
  }, [pageNo, window.location.href]);

  useEffect(() => {
    getFilteredProducts();
  }, [productFilterParams, sortValue, window.location.href]);

  useEffect(() => {
    getFilters();
  }, [filterParams, window.location.href]);

  const getCategories = async () => {
    try {
      const categoryMetaData = getSessionStorage("categoryData");
      let apiURL = config.api.products.displayCollection;
      let reqBody = {};
      reqBody = {
        collectionId: categoryMetaData?.displayCollectionId,
        filterComponentId: "",
        location: data.terminal,
        sector: data.sector,
        section: data.movementType,
        supportedFulfillmentTypes: data?.deliveryOptions?.deliveryOption,
        orderDateTime:
          data?.deliveryOptions?.isScheduled ||
          data?.deliveryOptions?.isDelivery
            ? moment(data?.deliveryOptions?.deliveryTime, "UTC", "UTC").format()
            : moment(new Date(), "UTC", "UTC").format(),
        timezone: timezone,
        domain: data?.domain,
      };
      const response = await callAPI.get(apiURL, reqBody);
      const regResponse = await response.json();
      if (regResponse.status === 200) {
        setCategoryData(regResponse?.data?.items);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getProducts = async () => {
    try {
      setListIsLoading(true);
      setListHasMore(false);
      let paramObj = {};
      for (var value of query.keys()) {
        paramObj[value] = encodeURIComponent(query.get(value));
      }
      paramObj.page = pageNo;
      paramObj.pageSize = limit;
      paramObj.isVisible = true;
      paramObj["shopId.domain"] = productsData?.domain;
      paramObj.location = productsData?.terminal;
      paramObj.sector = productsData?.sector;
      paramObj.section = productsData?.movementType;
      paramObj.orderDateTime =
        data?.deliveryOptions?.isScheduled || data?.deliveryOptions?.isDelivery
          ? moment(data?.deliveryOptions?.deliveryTime, "UTC", "UTC").format()
          : moment(new Date(), "UTC", "UTC").format();
      if (sortValue !== "") {
        paramObj.sort = sortValue;
      }
      let commonKey = "";
      Object.keys(paramObj).forEach((x) => {
        if (productFilterParams?.hasOwnProperty(x)) {
          commonKey = x;
        }
      });
      if (commonKey) {
        if (
          !productFilterParams[commonKey]?.includes(
            decodeURIComponent(paramObj[commonKey])
          )
        ) {
          productFilterParams[commonKey]?.push(
            decodeURIComponent(paramObj[commonKey])
          );
        }
      }
      let filterObj = JSON.parse(JSON.stringify(productFilterParams));
      Object.keys(filterObj).forEach((item) => {
        let arr = [];
        filterObj[item].forEach((x) => {
          arr.push(encodeURIComponent(x));
        });
        filterObj[item] = arr;
      });
      let reqBody = {
        ...paramObj,
        ...filterObj,
      };
      let apiURL = config.api.products.productListing;
      const response = await callAPI.get(apiURL, reqBody);
      const regResponse = await response.json();
      if (regResponse.status === 200) {
        setData([...data, ...regResponse?.data?.items]);
        if (regResponse?.data?.items?.length > 0) setListHasMore(true);
        setMetaData(regResponse.metadata);
        setFilters(regResponse.data.facets);
        setListIsLoading(false);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getFilters = async () => {
    try {
      let paramObj = {};
      for (var value of query.keys()) {
        paramObj[value] = encodeURIComponent(query.get(value));
      }
      paramObj.page = 0;
      paramObj.pageSize = 6;
      paramObj.isVisible = true;
      paramObj["shopId.domain"] = productsData?.domain;
      paramObj.location = productsData?.terminal;
      paramObj.sector = productsData?.sector;
      paramObj.section = productsData?.movementType;
      paramObj.orderDateTime =
        data?.deliveryOptions?.isScheduled || data?.deliveryOptions?.isDelivery
          ? moment(data?.deliveryOptions?.deliveryTime, "UTC", "UTC").format()
          : moment(new Date(), "UTC", "UTC").format();
      let commonKey = "";
      Object.keys(paramObj).forEach((x) => {
        if (filterParams?.hasOwnProperty(x)) {
          commonKey = x;
        }
      });
      if (commonKey) {
        if (
          !filterParams[commonKey].includes(
            decodeURIComponent(paramObj[commonKey])
          )
        ) {
          filterParams[commonKey].push(decodeURIComponent(paramObj[commonKey]));
        }
      }
      let filterObj = JSON.parse(JSON.stringify(filterParams));
      Object.keys(filterObj).forEach((item) => {
        let arr = [];
        filterObj[item].forEach((x) => {
          arr.push(encodeURIComponent(x));
        });
        filterObj[item] = arr;
      });
      let reqBody = {
        ...paramObj,
        ...filterObj,
      };
      let apiURL = config.api.products.productListing;
      const response = await callAPI.get(apiURL, reqBody);
      const regResponse = await response.json();
      if (regResponse.status === 200) {
        setFilters(regResponse.data.facets);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getFilteredProducts = async () => {
    try {
      setListIsLoading(true);
      setListHasMore(false);
      setPageNo(0);
      let paramObj = {};
      for (var value of query.keys()) {
        paramObj[value] = encodeURIComponent(query.get(value));
      }
      paramObj.page = 0;
      paramObj.pageSize = 6;
      paramObj.isVisible = true;
      paramObj["shopId.domain"] = productsData?.domain;
      paramObj.location = productsData?.terminal;
      paramObj.sector = productsData?.sector;
      paramObj.section = productsData?.movementType;
      paramObj.orderDateTime =
        data?.deliveryOptions?.isScheduled || data?.deliveryOptions?.isDelivery
          ? moment(data?.deliveryOptions?.deliveryTime, "UTC", "UTC").format()
          : moment(new Date(), "UTC", "UTC").format();
      if (sortValue !== "") {
        paramObj.sort = sortValue;
      }
      let commonKey = "";
      Object.keys(paramObj).forEach((x) => {
        if (productFilterParams?.hasOwnProperty(x)) {
          commonKey = x;
        }
      });
      if (commonKey) {
        if (
          !productFilterParams[commonKey].includes(
            decodeURIComponent(paramObj[commonKey])
          )
        ) {
          productFilterParams[commonKey].push(
            decodeURIComponent(paramObj[commonKey])
          );
        }
      }
      let preFillSelFilters = [];
      if (productFilterParams && Object.keys(productFilterParams).length > 0) {
        Object.values(productFilterParams)?.forEach((x) => {
          preFillSelFilters = preFillSelFilters.concat(x);
        });
        setSelectedFilters(preFillSelFilters);
      }
      let filterObj = JSON.parse(JSON.stringify(productFilterParams));
      Object.keys(filterObj).forEach((item) => {
        let arr = [];
        filterObj[item].forEach((x) => {
          arr.push(encodeURIComponent(x));
        });
        filterObj[item] = arr;
      });
      let reqBody = {
        ...paramObj,
        ...filterObj,
      };
      let apiURL = config.api.products.productListing;
      const response = await callAPI.get(apiURL, reqBody);
      const regResponse = await response.json();
      if (regResponse.status === 200) {
        setData([...regResponse?.data?.items]);
        if (regResponse?.data?.items?.length > 0) setListHasMore(true);
        setMetaData(regResponse.metadata);
        setFilters(regResponse.data.facets);
        setListIsLoading(false);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getImage = (imageArr, type) => {
    const image = imageArr?.filter(
      (x) =>
        (x.platform?.toLowerCase() === "web" ||
          x.platform?.toLowerCase() === "marketplace") &&
        x.type === type
    )[0]?.imageUrl;
    return image;
  };

  const handleModalHideClick = (modalType) => {
    if (modalType === 0) {
      setShowDetailModal(false);
    }
    if (modalType === 1) {
      setShowCustomisationModal(false);
    }
    if (modalType === 2) {
      setShowRepeatSelectionModal(false);
    }
    if (isMobile) {
      useNav.hideFooterNavs();
      useNav.showHeaderNavs();
      useNav.showBottomNavs();
    } else {
      useNav.showHeaderNavs();
      useNav.showFooterNavs();
    }
  };

  const removeFilterSelection = (e, filterValue) => {
    e?.stopPropagation();
    setPageNo(0);
    let data = JSON.parse(JSON.stringify(selectedFilters));
    if (data.includes(filterValue)) {
      data.splice(data.indexOf(filterValue), 1);
    }

    let subData = JSON.parse(JSON.stringify(filterParams));
    Object.values(subData).forEach((x) => {
      if (x.includes(filterValue)) {
        x.splice(x.indexOf(filterValue), 1);
      }
    });

    setSelectedFilters([...data]);
    setFilterParams(subData);
    setProductFilterParams(subData);

    let obj = {};
    obj[productsData?.domain] = subData;
    setSessionStorage("productFilters", obj);
  };

  const openFilterModal = () => {
    triggerFilterView();
    setShowFilterModal(true);
  };

  const closeFilterModal = () => {
    triggerFilterClosed();
    setShowFilterModal(false);
  };

  const openSortModal = () => {
    triggerSortView();
    setShowSortModal(true);
  };

  const closeSortModal = () => {
    triggerSortClosed();
    setShowSortModal(false);
  };

  const handleFilterModalSubmit = () => {
    setProductFilterParams(filterParams);
    let obj = {};
    obj[productsData?.domain] = filterParams;
    let paramObj = {};
    for (var value of query.keys()) {
      paramObj[value] = query.get(value);
    }
    obj["productCategory.categoryName"] =
      paramObj["productCategory.categoryName"];
    setSessionStorage("productFilters", obj);
    triggerFilterApplied({
      categoryName: paramObj["productCategory.categoryName"],
      ...filterParams,
    });
    closeFilterModal();
  };

  const handleSortModalSelection = (value) => {
    triggerSortSelected({ sort_option: value });
    setSortValue(value);
    closeSortModal();
  };

  const handleCategorySelection = (paramsSourceObj) => {
    const categoryMetaData = getSessionStorage("categoryData");

    if (categoryMetaData?.actionList?.length <= 0) return;
    if (categoryMetaData?.actionType === "") return;
    const found = categoryMetaData?.actionList.find((x) =>
      categoryMetaData?.actionType?.includes(x.actionName)
    );

    triggerCategorySelected(paramsSourceObj);
    if (found) {
      if (found.actionType === "redirect") {
        if (found.actionUrl === "/storefront") {
          let id = "";
          let queryParams = ``;
          found?.params?.forEach((p) => {
            id += `${categoryMetaData?.paramsSourceObj[p]}`;
          });
          if (found.filterComponentId) {
            queryParams += `filterComponentId=${found.filterComponentId}`;
          }
          const redirectLink = `${found.actionUrl}/${id}?${queryParams}`;
          pushHistory(redirectLink);
        } else if (found.actionUrl === "/product/info") {
          let queryParams = ``;
          if (paramsSourceObj) {
            found?.params?.forEach((p) => {
              if (p.includes(".")) {
                const x = p.split(".")[1];
                queryParams += `${p}=${encodeURIComponent(paramsSourceObj[x])}`;
              } else {
                queryParams += `${p}=${encodeURIComponent(paramsSourceObj[p])}`;
              }
            });
          }
          if (found.filterComponentId) {
            queryParams += `filterComponentId=${found.filterComponentId}`;
          }
          const itemDetails = `${paramsSourceObj?.productName?.replaceAll(
            " ",
            "-"
          )}-${paramsSourceObj?.productCategory?.categoryName?.replaceAll(
            " ",
            "-"
          )}-${paramsSourceObj?._id}`;
          const redirectLink = `${found.actionUrl}/${itemDetails}?${queryParams}`;
          pushHistory(redirectLink);
        } else {
          let queryParams = ``;
          if (paramsSourceObj) {
            found?.params?.forEach((p) => {
              if (p.includes(".")) {
                const x = p.split(".")[1];
                queryParams += `${p}=${encodeURIComponent(paramsSourceObj[x])}`;
              } else {
                queryParams += `${p}=${encodeURIComponent(paramsSourceObj[p])}`;
              }
            });

            let obj = getSessionStorage("productFilters");
            if (obj && Object.keys(obj).length > 0) {
              if (
                paramsSourceObj?.categoryName !==
                obj["productCategory.categoryName"]
              ) {
                removeSessionStorage("productFilters");
              }
            }
          }
          const source = found?.params[0];
          if (source) {
            queryParams += `&source=${source}`;
          }
          if (found.filterComponentId) {
            queryParams += `&filterId=${found.filterComponentId}`;
          }
          const redirectLink = `${found.actionUrl}?${queryParams}`;
          pushHistory(redirectLink);
          let obj = {
            displayCollectionId: paramsSourceObj?.displayCollectionId,
            actionList: categoryMetaData?.actionList,
            actionType: categoryMetaData?.actionType,
            paramsSourceObj: paramsSourceObj,
          };
          setSessionStorage("categoryData", obj);
          setData([]);
          setMetaData({});
          setFilters({});
          setSelectedItemId("");
          setSelectedItem("");
          setSelectedFilters([]);
          setFilterParams({});
          setProductFilterParams({});
          setSessionStorage("productFilters", {});
          setIsCategoryDropdownOpen(false);
        }
      }
    }
  };

  const getSelectedCategory = () => {
    let paramObj = {};
    for (var value of query.keys()) {
      paramObj[value] = encodeURIComponent(query.get(value));
    }
    return decodeURIComponent(paramObj["productCategory.categoryName"]) || "";
  };

  if (!isLoading) {
    return (
      <Wrapper
        style={
          isCategoryDropdownOpen
            ? { height: "calc(100vh - 170px)", overflowY: "hidden" }
            : {}
        }
      >
        <TerminalSectorWrapper
          deliveryOption={productsData.deliveryOptions?.deliveryOption}
          terminal={productsData.terminal}
          movementType={productsData.movementType}
          deliveryAddress={productsData?.deliveryOptions?.deliveryAddress}
          domain={productsData?.domain}
        ></TerminalSectorWrapper>
        {categoryData?.length > 0 && (
          <CategoryBand
            isCategoryDropdownOpen={isCategoryDropdownOpen}
            setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
            categoryData={categoryData}
            selectedCategory={getSelectedCategory()}
            handleAction={handleCategorySelection}
          />
        )}
        {metaData?.bannerImageUrl?.length > 0 &&
          getImage(metaData?.bannerImageUrl, "banner") !==
            ("" || undefined || null) && (
            <BannerContainer>
              <BannerImage
                bgImage={getImage(metaData?.bannerImageUrl, "banner")}
              />
            </BannerContainer>
          )}
        {filters?.sortOptions?.length > 0 || filters?.facets?.length > 0 ? (
          <FilterButtonContainer>
            <HorzScrollContainer>
              {filters?.sortOptions?.length > 0 && (
                <FilterButton onClick={() => openSortModal()}>
                  <FilterText>
                    <Text>Sort</Text>
                  </FilterText>
                  <FilterIcon
                    style={{ paddingBottom: "5px" }}
                    src={SortImage}
                  />
                </FilterButton>
              )}
              {filters?.facets?.length > 0 && (
                <FilterButton onClick={() => openFilterModal()}>
                  <FilterIcon src={FilterImage} />
                  <FilterText>
                    <Text>Filters</Text>
                  </FilterText>
                  {selectedFilters?.length > 0 && (
                    <FilterCount>
                      <Text>{selectedFilters.length}</Text>
                    </FilterCount>
                  )}
                </FilterButton>
              )}
            </HorzScrollContainer>
          </FilterButtonContainer>
        ) : null}
        {selectedFilters.length > 0 && (
          <SelectedFilterListContainer>
            <HorzScrollContainer>
              {selectedFilters?.map((item, index) => (
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
        )}
        <ProductListingContainer>
          <GridContainer>
            {data?.map((item, index) => (
              <ProductCardContainer
              // ref={lastPastElement}
              >
                <ProductCard
                  // ref={lastPastElement}
                  key={index}
                  index={index}
                  image={getImage(item?.productImageUrl, "Small")}
                  wrapperStyle={{
                    width: "100%",
                    minWidth: "100%",
                  }}
                  imageStyle={{
                    height: "194px",
                    minHeight: "194px",
                    borderRadius: "4px",
                    objectFit: "contain",
                  }}
                  imageWrapperStyle={{
                    height: "fit-content",
                    position: "inherit",
                  }}
                  imageContainerStyle={{
                    position: isCategoryDropdownOpen ? "inherit" : "relative",
                  }}
                  product={item}
                  productId={item._id}
                  item={item}
                  title={item.productName}
                  subTitle={item?.brand?.brandName || ""}
                  price={item.price}
                  discountPct={item?.discountPct}
                  offerPrice={item?.offerPrice}
                  strikeout={item?.strikeout}
                  attributeList={item?.attributeList || []}
                  showDiscount={!isCategoryDropdownOpen}
                  selectedItemId={selectedItemId}
                  setSelectedItemId={setSelectedItemId}
                  setShowDetailModal={setShowDetailModal}
                  setShowCustomisationModal={setShowCustomisationModal}
                  setShowRepeatSelectionModal={setShowRepeatSelectionModal}
                  handleAction={null}
                  ageVerificationReq={item?.ageVerificationRequired}
                />
              </ProductCardContainer>
            ))}
          </GridContainer>
          <div ref={loaderRef}>
            {listIsLoading && (
              <SectionLoaderContainer>
                <SectionLoaderImg src={SectionLoader} />
              </SectionLoaderContainer>
            )}
          </div>
        </ProductListingContainer>
        {showDetailModal && (
          <ItemDetailModal
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            selectedItem={selectedItem}
            setShowCustomisationModal={setShowCustomisationModal}
            setShowRepeatSelectionModal={setShowRepeatSelectionModal}
            isDrawerOpen={showDetailModal}
            setIsDrawerOpen={setShowDetailModal}
          ></ItemDetailModal>
        )}
        {showCustomisationModal && (
          <ItemCustomizationModal
            selectedItemId={selectedItemId}
            onModalHide={() => handleModalHideClick(1)}
            changeRepeatSelection={changeRepeatSelection}
            changeRepeatSelectionItem={changeRepeatSelectionItem}
            setShowRepeatSelectionModal={(val) =>
              setShowRepeatSelectionModal(val)
            }
            isDrawerOpen={showCustomisationModal}
            setIsDrawerOpen={setShowCustomisationModal}
          ></ItemCustomizationModal>
        )}
        {showRepeatSelectionModal && (
          <RepeatSelectionModal
            selectedItemId={selectedItemId}
            onModalHide={() => handleModalHideClick(2)}
            setSelectedItemId={setSelectedItemId}
            setShowCustomisationModal={setShowCustomisationModal}
            showRepeatSelectionModal={showRepeatSelectionModal}
            setShowRepeatSelectionModal={setShowRepeatSelectionModal}
            setChangeRepeatSelection={setChangeRepeatSelection}
            setChangeRepeatSelectionItem={setChangeRepeatSelectionItem}
          ></RepeatSelectionModal>
        )}
        {showFilterModal && (
          <FilterModal
            data={filters?.facets}
            isDrawerOpen={showFilterModal}
            setIsDrawerOpen={setShowFilterModal}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            filterParams={filterParams}
            setFilterParams={setFilterParams}
            productFilterParams={productFilterParams}
            setProductFilterParams={setProductFilterParams}
            closeHandler={closeFilterModal}
            applyHandler={handleFilterModalSubmit}
          ></FilterModal>
        )}
        {showSortModal && (
          <SortModal
            data={filters?.sortOptions}
            isDrawerOpen={showSortModal}
            sortValue={sortValue}
            setSortValue={setSortValue}
            setIsDrawerOpen={setShowSortModal}
            closeHandler={closeSortModal}
            handleSortSelection={handleSortModalSelection}
          ></SortModal>
        )}
        <FloatingCart />
      </Wrapper>
    );
  } else {
    return <Loader />;
  }
};

const Wrapper = styled.div({
  width: "100vw",
  position: "relative",
  paddingBottom: "50px",
});
const BannerContainer = styled.div`
  width: 100%;
  height: 194px;
`;
const BannerImage = styled.div`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: ${(props) =>
    `linear-gradient(73deg, rgba(0, 0, 0, 0.70) 25.69%, rgba(9, 11, 12, 0.66) 45.58%, rgba(20, 25, 28, 0.34) 72.99%, rgba(39, 49, 53, 0.00) 100.94%), url(${props?.bgImage}), lightgray 50% / cover no-repeat`};
  mix-blend-mode: multiply;
`;
const SelectedFilterListContainer = styled.div`
  width: 100%;
  padding: 0px 0px 16px 24px;
`;
const ProductListingContainer = styled.div`
  width: 100%;
  padding: 24px 24px 120px 24px;
`;
const ProductCardContainer = styled.div`
  width: min(45%, 160px);
  min-width: min(45%, 160px);
`;
const SectionLoaderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 32px;
`;
const SectionLoaderImg = styled.img`
  width: 40px;
  height: 40px;
`;
const FilterButtonContainer = styled.div`
  width: 100%;
  padding: 24px 0px 36px 24px;
`;
const FilterButton = styled.div`
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border-radius: 18px;
  background: #f4f5f5;
`;
const FilterIcon = styled.img``;
const FilterText = styled.div`
  color: #273435;
  font-size: 14px;
  font-weight: 500;
`;
const FilterCount = styled.div`
  padding: 1px 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #273135;
  border-radius: 50%;

  color: #fff;
  font-size: 12px;
`;

export default ProductListing;
