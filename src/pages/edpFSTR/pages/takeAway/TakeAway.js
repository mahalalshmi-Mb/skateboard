import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import moment from "util/momentWrapper";
import SearchIcon from "../../../../assets/images/header/search.png";
import callAPI from "../../../../commons/callAPI";
import config, { channel, gatewayURL } from "../../../../commons/config";
import { getAppConfig } from "../../../../commons/util/appConfigHelper";
import {
  device,
  fetchQueryURL,
  isDesktopDevice,
  isMobileDevice,
  hasAllValues,
  fetchStoreFrontURL,
} from "../../../../commons/util/helperFunctions";
import Util from "../../../../commons/util/util";
import Text from "../../../../components/atoms/Text";
import Loader from "../../../../components/atoms/loader";
import PushAlert from "../../../../components/atoms/pushAlert";
import { NavContext } from "../../../../context/navContext";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import { View_Item_Event } from "../../../../util/FirebaseAnalyticsUtil";
import { triggerCategorySelected } from "../../../../util/analytics/cdp/DutyFree";
import {
  getSessionStorage,
  removeSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import FloatingCart from "../../components/molecules/FloatingCart";
import SearchInput from "../../components/molecules/SearchInput";
import TerminalSectorWrapper from "../../components/molecules/TerminalSectorWrapper";
import ItemCustomizationModal from "../../components/organism/ItemCustomizationModal";
import ItemDetailModal from "../../components/organism/ItemDetailModal";
import RepeatSelectionModal from "../../components/organism/RepeatSelectionModal";
import CollectionSubTitle from "../../productComponents/atoms/CollectionSubTitle";
import CollectionTitle from "../../productComponents/atoms/CollectionTitle";
import CollectionViewAll from "../../productComponents/atoms/CollectionViewAll";
import BrandCard from "../../productComponents/molecules/BrandCard";
import FilterCard from "../../productComponents/molecules/FilterCard";
import CardContainerController from "../../productComponents/organisms/CardContainerController";
import CardController from "../../productComponents/organisms/CardController";
import CollectionContainer from "../../productComponents/organisms/CollectionContainer";
import EmbeddedFilters from "../../productComponents/organisms/EmbeddedFilters";
import GridContainer from "../../productComponents/organisms/GridContainer";
import HorzScrollContainer from "../../productComponents/organisms/HorzScrollContainer";
import { getPageName } from "../../util/util";
import "./TakeAway.css";
import RecommendationModal from "../Recommendation/Recommendation";
import { useConfig } from "context/configContext";
import FilterCarousel from "pages/edpFSTR/components/molecules/FilterCarousel";
import MultiStoreCheckModal from "pages/edpFSTR/productComponents/organisms/MultiStoreCheckModal";
import { CartContext } from "context/cartContext";
import { productDomain } from "../config/config";
import CrossIcon from "../../../../components/molecules/BottomDrawer/assets/cross.svg";
import { colors } from "theme/colors";
import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PreTimeIcon from "../../assets/pretime.svg";
import TerminalGrid from "pages/edpFSTR/components/molecules/TerminalGrid";
import { H6, T5 } from "theme/globalStyleSheet";
import NoResImage from "../../../../assets/images/searchResult/noResults.svg";
import DefaultSearchResImage from "../../../../assets/images/searchResult/defaultImage.svg";
import GoBack from "pages/edpFSTR/components/molecules/GoBack";

const TakeAway = () => {
  const URL = window.location.href;
  const urlParts = [];
  const urlKey = "/takeaway";
  const { pushHistory } = useCustomNavigation();
  const { pathname } = useLocation();
  let data = getSessionStorage("productsData") || {};
  const ClientCart = useContext(CartContext);
  const useNav = useContext(NavContext);
  const searchInputRef = useRef();
  const searchInputResultRef = useRef();
  const throttling = useRef(null);
  const cardRef = useRef();
  const modalRef = useRef(null);
  const inputRef = useRef();

  const { timezone, isMultiMerchantAllowed, skipOrderTerminalSelection } =
    useConfig();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Display Modal if Selected Item
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedItemId, setSelectedItemId] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCustomisationModal, setShowCustomisationModal] = useState(false);
  const [showRepeatSelectionModal, setShowRepeatSelectionModal] =
    useState(false);
  const [showMultiStoreCheckModal, setShowMultiStoreCheckModal] =
    useState(false);
  const [changeRepeatSelection, setChangeRepeatSelection] = useState(false);
  const [changeRepeatSelectionItem, setChangeRepeatSelectionItem] = useState(
    {}
  );
  const [landingPageConstruct, setLandingPageConstruct] = useState([]);
  const [landingPageData, setLandingPageData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [showSearchView, setShowSearchView] = useState(false);
  const [searchApiUrl, setSearchApiUrl] = useState("");
  const [searchText, setSearchText] = useState("");
  const [globalFilterParams, setGlobalFilterParams] = useState(
    getPageName(window.location.pathname, data?.domain) === "Food and Beverages"
      ? getSessionStorage("productFilters")?.[data?.domain] || {}
      : {}
  );
  const [sectionFilterParams, setSectionFilterParams] = useState({
    All: {
      All: ["All"],
    },
  });
  const [isDeliveryQrCode] = useState(
    getSessionStorage("qrCodeSource")
      ?.toLowerCase()
      ?.includes("deliver-to-gate")
  );
  const [recommendationModal, setRecommendationModal] = useState(false);
  const [recommendationList, setRecommendationList] = useState([]);
  const [selectedRecommendationItemId, setSelectedRecommendationItemId] =
    useState("");
  const [multiStoreData, setMultiStoreData] = useState({});
  const [terminal, setTerminal] = useState({
    location: ["All"],
  });
  const [areaData, setAreaData] = useState([]);
  const [showTerminalSelectionModal, setShowTerminalSelectionModal] =
    useState(false);
  const [isRerender, setIsRerender] = useState(false);
  const [isCardRef, setIsCardRef] = useState(false);
  const [displayCollectionLabel, setDisplayCollectionLabel] = useState([]);
  const [selectedTerminal, setSelectedTerminal] = useState({
    displayLabel: "All",
    terminal: "All",
  });
  const [addNewCustomisation, setAddNewCustomisation] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchActionObj, setSearchActionObj] = useState({});
  const [isStoreLoading, setIsStoreLoading] = useState(true);
  const [globalFilterLoader, setGlobalFilterLoader] = useState(true);

  const imageCarouselSettings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 3000,
    autoplay: true,
    autoplaySpeed: 0,
    slidesToScroll: 1,
    cssEase: "linear",
    pauseOnHover: false,
    slidesToShow: 5,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4.5,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3.5,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 1.5,
        },
      },
    ],
  };

  const bannerCarouselSettings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    fnbDataFallback();
    getAvailableAreas();
  }, []);

  useEffect(() => {
    if (!isDeliveryQrCode) {
      if (
        showCustomisationModal === false &&
        showDetailModal === false &&
        showRepeatSelectionModal === false
      ) {
        if (isMobile) {
          useNav.showHeaderNavs();
          useNav.showBottomNavs();
          if (
            !Util.isIosWebView() &&
            getPageName(window.location.pathname, data?.domain) === "Brand"
          ) {
            useNav.showHeaderGoBack();
          } else {
            setShowSearchView(false);
            useNav.hideHeaderGoBack();
          }
        } else {
          useNav.showHeaderNavs();
          useNav.hideHeaderGoBack();
        }
      }
    } else {
      useNav.hideAllNavs();
    }

    return () => {
      if (!isDeliveryQrCode) {
        useNav.showHeaderNavs();
      } else {
        useNav.showAllNavs();
      }
    };
  }, [
    showDetailModal,
    showCustomisationModal,
    showRepeatSelectionModal,
    pathname,
  ]);

  useEffect(() => {
    getPageLayout();
  }, [window.location.pathname, globalFilterParams, isRerender]);

  useEffect(() => {
    if (showSearchView) {
      if (searchInputResultRef.current) {
        searchInputResultRef.current?.focus();
      }
    }
  }, [showSearchView]);

  useEffect(() => {
    const wrapper = document.querySelector(".takeaway-wrapper");
    if (!wrapper) return;

    const blockClick = (e) => {
      if (modalRef.current && modalRef.current.contains(e.target)) {
        return;
      }
      e.stopPropagation();
      e.preventDefault();
    };

    if (showTerminalSelectionModal) {
      document.body.style.overflow = "hidden";
      wrapper.addEventListener("click", blockClick);
    } else {
      document.body.style.overflow = "auto";
      wrapper.removeEventListener("click", blockClick);
    }

    return () => {
      document.body.style.overflow = "auto";
      wrapper.removeEventListener("click", blockClick);
    };
  }, [showTerminalSelectionModal]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [showSearchModal]);

  const imageStyles = {
    width: isDesktopDevice() ? "147px" : "120px",
    height: isDesktopDevice() ? "97px" : "80px",
    borderRadius: "8px",
    objectFit: "cover",
    gap: "24px",
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

  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const fnbDataFallback = () => {
    let data = getSessionStorage("productsData");
    let URLQueryParams = fetchQueryURL(URL, urlParts, urlKey);
    if (
      data === null ||
      data === undefined ||
      (!data.deliveryOptions && !URLQueryParams)
    ) {
      let productsData = {
        deliveryOptions: {
          deliveryOption: config.deliveryOptions.takeaway,
          deliveryTime: moment(new Date(), "UTC", "UTC").format(),
          isPackagingRequested: true,
          timezone: timezone,
        },
        domain: productDomain.fnb,
        terminal: "",
        movementType: "",
        sector: "",
      };
      setSessionStorage("productsData", productsData);
    } else if (
      URLQueryParams &&
      Object.keys(URLQueryParams).length !== 0 &&
      !hasAllValues(URLQueryParams)
    ) {
      let productsData = {
        deliveryOptions: {
          deliveryOption: config.deliveryOptions.takeaway,
          deliveryTime: moment(new Date(), "UTC", "UTC").format(),
          isDelivery: false,
          isPackagingRequested: true,
          timezone: timezone,
        },
        domain: URLQueryParams?.domain,
        terminal: URLQueryParams?.terminal,
        movementType: URLQueryParams?.section,
        sector: URLQueryParams?.sector,
        displayLabel: URLQueryParams?.terminal,
      };
      setSessionStorage("productsData", productsData);
    } else {
      data.deliveryOptions.deliveryOption = config.deliveryOptions.takeaway;
      data.deliveryOptions.isDelivery = false;
      data.deliveryOptions.timezone = timezone;
      setSessionStorage("productsData", data);
    }
  };

  const getAvailableAreas = async () => {
    try {
      setIsLoading(true);
      let data = getSessionStorage("productsData");
      let URLQueryParams = {};
      if (!data) URLQueryParams = fetchQueryURL(URL, urlParts, urlKey);
      if (
        (!URLQueryParams ||
          Object.keys(URLQueryParams).length === 0 ||
          hasAllValues(URLQueryParams)) &&
        (!data || Object.keys(data).length === 0 || hasAllValues(data))
      ) {
        PushAlert.error("Please try again after sometime");
      } else {
        let apiURL = config.api.products.areaListing;
        const response = await callAPI.get(apiURL, {
          domain: data?.domain || URLQueryParams?.domain || "",
        });
        const regResponse = await response.json();
        if (regResponse.status === 200) {
          setAreaData(regResponse?.data);
        } else {
          PushAlert.error("Please try again after sometime");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getPageLayout = async () => {
    try {
      let data = getSessionStorage("productsData") || {};
      let URLQueryParams = {};
      if (!data) URLQueryParams = fetchQueryURL(URL, urlParts, urlKey);
      if (
        (!URLQueryParams ||
          Object.keys(URLQueryParams).length === 0 ||
          hasAllValues(URLQueryParams)) &&
        (!data || Object.keys(data).length === 0 || hasAllValues(data))
      ) {
        PushAlert.error("Page is not loading, try later!");
      } else {
        setIsStoreLoading(true);
        let reqBody = {};
        if (skipOrderTerminalSelection) {
          reqBody = {
            channel: channel,
            page: "FNB",
            locationFilter: skipOrderTerminalSelection
              ? selectedTerminal?.terminal === "All"
                ? ""
                : selectedTerminal?.terminal
              : "",
            supportedFulfillmentTypes: data?.deliveryOptions?.deliveryOption,
            orderDateTime:
              data?.deliveryOptions?.isScheduled ||
              data?.deliveryOptions?.isDelivery
                ? moment(
                    data?.deliveryOptions?.deliveryTime,
                    "UTC",
                    "UTC"
                  ).format()
                : moment(new Date(), "UTC", "UTC").format(),
            domain: data?.domain,
            timezone: timezone,
          };
        } else {
          reqBody = {
            channel: channel,
            page: getPageName(window.location.pathname, data?.domain),
            tags: selectedFilters.toString(),
            dietCategory: "",
            location: data?.terminal || URLQueryParams?.terminal || "",
            sector: data?.sector || URLQueryParams?.sector || "",
            section: data?.movementType || URLQueryParams?.section || "",
            supportedFulfillmentTypes:
              data?.deliveryOptions?.deliveryOption ||
              URLQueryParams?.supportedFulfillmentTypes,
            orderDateTime:
              data?.deliveryOptions?.isScheduled ||
              data?.deliveryOptions?.isDelivery
                ? moment(
                    data?.deliveryOptions?.deliveryTime,
                    "UTC",
                    "UTC"
                  ).format()
                : moment(new Date(), "UTC", "UTC").format(),
            domain: data?.domain || URLQueryParams?.domain || "",
            timezone: timezone,
          };
        }
        let apiURL = config.api.products.landingPageConstruct;
        const response = await callAPI.get(apiURL, reqBody);
        const regResponse = await response.json();
        if (regResponse.status === 200) {
          setLandingPageConstruct(regResponse.data);
          const found = regResponse?.data?.sections?.find(
            (x) => x?.sectionComponent?.sectionType === "SearchBox"
          );
          if (found) {
            const actionObj = found?.actions?.find(
              (x) => x?.actionType === "APICall"
            );
            setSearchActionObj(actionObj || {});
            setShowSearchBar(true);
          }
          setIsLoading(false);
          regResponse?.data?.sections?.forEach((x) => {
            if (x.displayCollectionId !== "") {
              getPageData(
                x.displayCollectionId,
                x?.sectionComponent?.noOfItemsToShow,
                x.filterComponentId,
                {},
                data
              );
            }
          });
        } else {
          PushAlert.error("Page layout not found");
          if (data?.deliveryOptions?.isDelivery) {
            pushHistory("/delivery-flight-selection");
          } else {
            if (data?.domain) {
              pushHistory(`/`);
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getPageData = async (
    displayCollectionId,
    noOfItemsToShow,
    filterComponentId,
    sectionFilterData,
    productsData
  ) => {
    try {
      const productsConfigData = productsData || data;
      let URLQueryParams = {};
      if (!productsConfigData)
        URLQueryParams = fetchQueryURL(URL, urlParts, urlKey);
      if (
        (!URLQueryParams ||
          Object.keys(URLQueryParams).length === 0 ||
          hasAllValues(URLQueryParams)) &&
        (!productsConfigData ||
          Object.keys(productsConfigData).length === 0 ||
          hasAllValues(productsConfigData))
      ) {
        PushAlert.error("Page is not loading, try later!");
      } else {
        let apiURL = config.api.products.displayCollection;
        let reqBody = {};
        if (sectionFilterData[displayCollectionId]) {
          reqBody = {
            collectionId: displayCollectionId,
            filterComponentId: filterComponentId,
            location: skipOrderTerminalSelection
              ? selectedTerminal?.terminal === "All"
                ? ""
                : selectedTerminal?.terminal
              : productsConfigData?.terminal === "All"
              ? ""
              : productsConfigData?.terminal || URLQueryParams?.terminal || "",
            sector: productsConfigData.sector || URLQueryParams?.sector || "",
            section:
              productsConfigData.movementType || URLQueryParams?.section || "",
            supportedFulfillmentTypes:
              productsConfigData?.deliveryOptions?.deliveryOption ||
              URLQueryParams?.supportedFulfillmentTypes,
            orderDateTime:
              productsConfigData?.deliveryOptions?.isScheduled ||
              productsConfigData?.deliveryOptions?.isDelivery
                ? moment(
                    productsConfigData?.deliveryOptions?.deliveryTime,
                    "UTC",
                    "UTC"
                  ).format()
                : moment(new Date(), "UTC", "UTC").format(),
            timezone: timezone,
            domain: productsConfigData?.domain || URLQueryParams?.domain || "",
            ...sectionFilterData[displayCollectionId],
            ...globalFilterParams,
          };
        } else {
          reqBody = {
            collectionId: displayCollectionId,
            filterComponentId: filterComponentId,
            location: skipOrderTerminalSelection
              ? selectedTerminal?.terminal === "All"
                ? ""
                : selectedTerminal?.terminal
              : productsConfigData?.terminal === "All"
              ? ""
              : productsConfigData?.terminal || "",
            sector: productsConfigData.sector || URLQueryParams?.sector || "",
            section:
              productsConfigData.movementType || URLQueryParams?.section || "",
            supportedFulfillmentTypes:
              productsConfigData?.deliveryOptions?.deliveryOption ||
              URLQueryParams?.supportedFulfillmentTypes,
            orderDateTime:
              productsConfigData?.deliveryOptions?.isScheduled ||
              productsConfigData?.deliveryOptions?.isDelivery
                ? moment(
                    productsConfigData?.deliveryOptions?.deliveryTime,
                    "UTC",
                    "UTC"
                  ).format()
                : moment(new Date(), "UTC", "UTC").format(),
            timezone: timezone,
            domain: productsConfigData?.domain || URLQueryParams?.domain || "",
            ...globalFilterParams,
          };
        }
        const response = await callAPI.get(apiURL, reqBody);
        const regResponse = await response.json();
        if (regResponse.status === 200) {
          let limitedItems = regResponse?.data;
          if (noOfItemsToShow > 0) {
            limitedItems.items = (
              Array.isArray(limitedItems?.items)
                ? limitedItems?.items
                : Array.isArray(limitedItems?.items?.data)
                ? limitedItems?.items?.data
                : Array.isArray(limitedItems?.items?.data?.attributes)
                ? limitedItems?.items?.data?.attributes
                : Array.isArray(limitedItems?.items?.data?.attributes?.images)
                ? limitedItems?.items?.data?.attributes?.images
                : limitedItems?.items?.data
            )?.filter((val, i) => i < noOfItemsToShow);
          }
          updateDisplayCollectionLabel(displayCollectionId, limitedItems);
          setLandingPageData((oldValue) => {
            return { ...oldValue, [regResponse?.data?._id]: limitedItems };
          });
          setIsStoreLoading(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleInfoPopupOpen = (id, source) => {
    let data = ClientCart.hasMultiStoreItems(
      source?.shopId?._id,
      source?.shopId?.name
    );
    if (data?.hasMultiStoreItems && !isMultiMerchantAllowed) {
      setMultiStoreData({
        hasMultiStoreItems: data?.hasMultiStoreItems,
        oldStore: data?.oldStore,
        newStore: data?.newStore,
      });
      setShowMultiStoreCheckModal(true);
    } else if (source?.itemWithPreference) {
      setSelectedItemId(id);
      setSelectedItem(source);
      setShowCustomisationModal(true);
      useNav.hideAllNavs();
    } else {
      setSelectedItemId(id);
      setSelectedItem(source);
      setShowDetailModal(true);
      useNav.hideAllNavs();
    }
  };

  const handleAction = (actionList, actionType, paramsSourceObj, e) => {
    e?.stopPropagation();
    if (actionList?.length <= 0) return;
    if (actionType === "") return;
    const found = actionList.find((x) => actionType?.includes(x.actionName));
    triggerCategorySelected(paramsSourceObj);
    if (found) {
      Util.sendMessageToReactNative(View_Item_Event);
      if (found.actionType === "redirect") {
        if (found.actionUrl === "/storefront") {
          let id = "";
          let queryParams = ``;
          found?.params?.forEach((p) => {
            id += `${paramsSourceObj[p]}`;
          });
          if (found.filterComponentId) {
            queryParams += `filterComponentId=${found.filterComponentId}`;
          }
          const storeDetails = fetchStoreFrontURL(paramsSourceObj, id);
          const redirectLink = `${found.actionUrl}/${storeDetails}?${queryParams}`;

          Util.triggerMoEngageEvent("store_viewed", {
            store_id: id,
            store_name: paramsSourceObj?.storeDisplayName,
            terminal: paramsSourceObj?.terminal?.value,
            sector: paramsSourceObj?.sector?.value,
            movement_type: paramsSourceObj?.movementType?.value,
          });
          let data = getSessionStorage("productsData");
          data.terminal = paramsSourceObj?.terminal?.value;
          data.movementType = paramsSourceObj?.movementType?.value;
          data.sector = paramsSourceObj?.sector?.value;
          if (
            data.terminal === "" ||
            data.terminal === "NA" ||
            data.terminal === null ||
            data.terminal === undefined
          ) {
            data.terminal = "";
          }
          if (
            data.movementType === "" ||
            data.movementType === "NA" ||
            data.movementType === null ||
            data.movementType === undefined
          ) {
            data.movementType = "";
          }
          if (
            data.sector === "" ||
            data.sector === "NA" ||
            data.sector === null ||
            data.sector === undefined
          ) {
            data.sector = "";
          }
          setSessionStorage("productsData", data);
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

          if (redirectLink.includes("store-listing")) {
            Util.triggerMoEngageEvent("view_all_stores", {
              redirect_link: "/store-listing",
              trigger_point: "takeaway",
            });
          }

          pushHistory(redirectLink);
          let obj = {
            displayCollectionId: paramsSourceObj?.displayCollectionId,
            actionList: actionList,
            actionType: actionType,
            paramsSourceObj: paramsSourceObj,
          };
          setSessionStorage("categoryData", obj);
        }
      } else if (found.actionType === "popup") {
        handleInfoPopupOpen(paramsSourceObj?._id, paramsSourceObj);
      }
    }
  };

  const getSmallImage = (imageArr) => {
    const image = imageArr?.filter(
      (x) =>
        (x?.platform?.toLowerCase() === "web" ||
          x?.platform?.toLowerCase() === "marketplace") &&
        x?.type?.toLowerCase() === "small"
    );
    if (image) {
      return image[0]?.imageUrl;
    }
  };

  const handleSearchBoxClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current?.focus();
    }
  };

  const handleThrottleSearch = (url) => {
    setSearchText(searchInputRef?.current?.value);
    if (throttling.current) {
      return;
    }
    if (!searchInputRef?.current?.value?.trim()) {
      return;
    }
    throttling.current = true;
    setTimeout(async () => {
      throttling.current = false;
      try {
        let data = getSessionStorage("productsData") || {};
        let apiURL = `${gatewayURL}/${url}`;
        let apiResponse = await callAPI.get(apiURL, {
          brandName: searchInputRef?.current?.value || "",
          domain: data?.domain,
        });
        let regResponse = await apiResponse.json();
        if (regResponse.status === 200) {
          let obj = {};
          obj.metadata = landingPageConstruct.sections[1];
          obj.data = regResponse.data;
          setFilteredData(obj);
          setShowSearchView(true);
        }
      } catch (e) {
        console.log(e);
      }
    }, 600);
  };

  const handleThrottleSearchResult = () => {
    if (throttling.current) {
      setSearchResults(null);
      return;
    }
    if (!inputRef?.current?.value?.trim()) {
      setSearchResults(null);
      return;
    }
    throttling.current = true;
    setTimeout(async () => {
      throttling.current = false;
      try {
        let data = getSessionStorage("productsData");
        const orderDateTime =
          data?.deliveryOptions?.isScheduled ||
          data?.deliveryOptions?.isDelivery
            ? moment(data?.deliveryOptions?.deliveryTime, "UTC", "UTC").format()
            : moment(new Date(), "UTC", "UTC").format();
        const domain = data?.domain;
        let apiURL = `${gatewayURL}/${searchActionObj?.APIUrl}?orderDateTime=${orderDateTime}&domain=${domain}&timezone=${timezone}`;
        let apiResponse = await callAPI.post(apiURL, {
          searchEle: inputRef?.current?.value?.trim() || "",
        });
        let regResponse = await apiResponse.json();
        if (regResponse.status === 200) {
          if (inputRef?.current?.value?.trim() === "") {
            setSearchResults(regResponse?.data || null);
          } else {
            setSearchResults(regResponse?.data || []);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }, 600);
  };

  const handleSectionFilter = (
    displayCollectionId,
    filterParam,
    filterValue,
    item
  ) => {
    let data = {};
    let valueObj = {};
    let valueArray = [];
    let key = filterParam || "All";

    if (valueObj.hasOwnProperty(key)) {
      let value = valueObj[key];
      if (value.includes(filterValue)) {
        value.splice(value.indexOf(filterValue));
      } else {
        value.push(filterValue);
      }
    } else {
      valueArray.push(filterValue);
      valueObj[key] = valueArray;
    }
    if (filterValue === "All") {
      data["All"] = valueObj;
    } else {
      data[displayCollectionId] = valueObj;
    }
    setSectionFilterParams(data);
    getPageData(
      displayCollectionId,
      item?.sectionComponent?.noOfItemsToShow,
      item.filterComponentId,
      data
    );
  };

  const updateDisplayCollectionLabel = (displayCollectionId, limitedItems) => {
    const collectionLabel = {
      displayId: displayCollectionId,
      isDisplayLabel: limitedItems.items.length > 0,
    };

    setDisplayCollectionLabel((prevState) => {
      const index = prevState.findIndex(
        (item) => item.displayId === collectionLabel.displayId
      );
      if (index !== -1) {
        return prevState.map((item) =>
          item.displayId === collectionLabel.displayId
            ? { ...item, isDisplayLabel: collectionLabel.isDisplayLabel }
            : item
        );
      } else {
        return [...prevState, collectionLabel];
      }
    });
  };

  const renderGlobalFilter = (layout) => {
    if (layout?.toLowerCase()?.includes("embedded")) {
      return (
        <EmbeddedFilterWrapper>
          <EmbeddedFilters
            data={landingPageConstruct?.facets.facets}
            globalFilterParams={globalFilterParams}
            setGlobalFilterParams={setGlobalFilterParams}
            layout={landingPageConstruct?.facets?.layout}
            domain={data?.domain}
          />
        </EmbeddedFilterWrapper>
      );
    } else if (layout === "FilterCarousel") {
      return (
        <FilterCarouselWrapper>
          <FilterCarousel
            data={landingPageConstruct?.facets.facets}
            globalFilterParams={globalFilterParams}
            setGlobalFilterParams={setGlobalFilterParams}
            layout={landingPageConstruct?.facets?.layout}
            domain={data?.domain}
            wrapperType={true}
            imageStyles={imageStyles}
            globalFilterLoader={globalFilterLoader}
            setGlobalFilterLoader={setGlobalFilterLoader}
          />
        </FilterCarouselWrapper>
      );
    } else {
      <EmbeddedFilterWrapper>
        <EmbeddedFilters
          data={landingPageConstruct?.facets.facets}
          globalFilterParams={globalFilterParams}
          setGlobalFilterParams={setGlobalFilterParams}
          layout={landingPageConstruct?.facets?.layout}
          domain={data?.domain}
        />
      </EmbeddedFilterWrapper>;
    }
  };

  const handleTerminalSelection = () => {
    setShowTerminalSelectionModal(true);
  };

  const handleTerminalClick = (filterParam, filterValue, isMultiSelect) => {
    setGlobalFilterLoader(true)
    let localTerminal = JSON.parse(JSON.stringify(terminal));
    let localTerminalValue = [];
    localTerminalValue?.push(filterValue?.value);
    let data = getSessionStorage("productsData");
    data.terminal = filterValue?.value?.trim();
    data.displayLabel = filterValue?.displayLabel?.trim();
    setSessionStorage("productsData", data);
    localTerminal[filterParam] = localTerminalValue;
    setTerminal(localTerminal);
    setSelectedTerminal({
      displayLabel: filterValue?.displayLabel?.trim(),
      terminal: filterValue?.value?.trim(),
    });
    setGlobalFilterParams(
      getPageName(window.location.pathname, data?.domain) ===
        "Food and Beverages"
        ? getSessionStorage("productFilters")?.[data?.domain] || {}
        : {}
    );
    setShowTerminalSelectionModal(false);
    setIsRerender(!isRerender);
  };

  const renderCardContainer = ({ item }) => {
    return (
      <CardContainerController
        sectionType={item?.sectionComponent?.sectionType}
        cardType={item?.sectionComponent?.cardComponent?.cardType}
        data={
          Array.isArray(landingPageData[item?.displayCollectionId]?.items)
            ? landingPageData[item?.displayCollectionId]?.items
            : landingPageData[item?.displayCollectionId]?.items?.data
        }
        settings={settings}
        sectionData={item}
        items={landingPageData[item?.displayCollectionId]?.items}
        handleSearchBoxClick={handleSearchBoxClick}
        searchInputRef={searchInputRef}
        handleChange={(e) =>
          handleAction(
            item?.actions,
            item?.sectionComponent?.sectionAction,
            "",
            e
          )
        }
        handleAction={(e) =>
          handleAction(
            item?.actions,
            item?.sectionComponent?.sectionAction,
            item,
            e
          )
        }
        handleCardAction={handleAction}
        gridStyles={{ gap: "24px 36px" }}
        cardRef={cardRef}
        setIsCardRef={setIsCardRef}
      >
        {(Array.isArray(landingPageData[item?.displayCollectionId]?.items)
          ? landingPageData[item?.displayCollectionId]?.items
          : landingPageData[item?.displayCollectionId]?.items?.data
        )?.map((subItem, subIndex) => (
          <CardController
            cardType={item?.sectionComponent?.cardComponent?.cardType}
            key={subIndex}
            data={subItem}
            index={subIndex}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            setShowDetailModal={setShowDetailModal}
            setShowCustomisationModal={setShowCustomisationModal}
            setShowRepeatSelectionModal={setShowRepeatSelectionModal}
            sectionData={item}
            setRecommendationModal={setRecommendationModal}
            setRecommendationList={setRecommendationList}
            setShowMultiStoreCheckModal={setShowMultiStoreCheckModal}
            setMultiStoreData={setMultiStoreData}
            onClick={(e) =>
              handleAction(
                item?.actions,
                item?.sectionComponent?.cardComponent?.cardAction,
                subItem,
                e
              )
            }
            setSelectedItem={(e) =>
              handleAction(
                item?.actions,
                item?.sectionComponent?.cardComponent?.cardAction,
                subItem,
                e
              )
            }
            handleAction={(e) =>
              handleAction(
                item?.actions,
                item?.sectionComponent?.cardComponent?.cardAction,
                subItem,
                e
              )
            }
          />
        ))}
        {isMobileDevice() && renderViewAllContainer(item, true)}
      </CardContainerController>
    );
  };

  const renderCardController = (displayCollectionId, item) => {
    if (Array.isArray(landingPageData[displayCollectionId]?.items)) {
      return landingPageData[displayCollectionId]?.items?.map(
        (subItem, subIndex) => (
          <CardController
            cardType={item?.sectionComponent?.cardComponent?.cardType}
            key={subIndex}
            data={subItem}
            index={subIndex}
            sectionData={item}
            onClick={(e) =>
              handleAction(
                item?.actions,
                item?.sectionComponent?.cardComponent?.cardAction,
                subItem,
                e
              )
            }
            setSelectedItem={(e) =>
              handleAction(
                item?.actions,
                item?.sectionComponent?.cardComponent?.cardAction,
                subItem,
                e
              )
            }
            handleAction={(e) =>
              handleAction(
                item?.actions,
                item?.sectionComponent?.cardComponent?.cardAction,
                subItem,
                e
              )
            }
          />
        )
      );
    } else if (
      Array.isArray(landingPageData[displayCollectionId]?.items?.data)
    ) {
      return landingPageData[displayCollectionId]?.items?.data?.map(
        (subItem, subIndex) => (
          <CardController
            cardType={item?.sectionComponent?.cardComponent?.cardType}
            key={subIndex}
            data={subItem}
            index={subIndex}
            sectionData={item}
            onClick={(e) =>
              handleAction(
                item?.actions,
                item?.sectionComponent?.cardComponent?.cardAction,
                subItem,
                e
              )
            }
            setSelectedItem={(e) =>
              handleAction(
                item?.actions,
                item?.sectionComponent?.cardComponent?.cardAction,
                subItem,
                e
              )
            }
            handleAction={(e) =>
              handleAction(
                item?.actions,
                item?.sectionComponent?.cardComponent?.cardAction,
                subItem,
                e
              )
            }
          />
        )
      );
    } else {
      return (
        <CardController
          cardType={item?.sectionComponent?.cardComponent?.cardType}
          data={landingPageData[displayCollectionId]?.items?.data}
          sectionData={item}
          settings={imageCarouselSettings}
          onClick={(e) =>
            handleAction(
              item?.actions,
              item?.sectionComponent?.cardComponent?.cardAction,
              landingPageData[displayCollectionId]?.items?.data,
              e
            )
          }
          setSelectedItem={(e) =>
            handleAction(
              item?.actions,
              item?.sectionComponent?.cardComponent?.cardAction,
              landingPageData[displayCollectionId]?.items?.data,
              e
            )
          }
          handleAction={(e) =>
            handleAction(
              item?.actions,
              item?.sectionComponent?.cardComponent?.cardAction,
              landingPageData[displayCollectionId]?.items?.data,
              e
            )
          }
        />
      );
    }
  };

  const renderViewAllContainer = (item, isMobile) => {
    return (
      item?.sectionComponent?.viewAll &&
      item?.sectionComponent?.sectionType !== "AllBrandsBox" && (
        <CollectionViewAll
          onClick={(e) =>
            handleAction(
              item?.actions,
              item?.sectionComponent?.sectionAction,
              item,
              e
            )
          }
          isMobile={isMobile}
        >
          <Text type="bold">View All</Text>
        </CollectionViewAll>
      )
    );
  };

  const handleRedirection = (redirectUrl, isExternal, redirectLabel) => {
    if (redirectLabel === "allTerminal") {
      setShowTerminalSelectionModal(true);
    }
    if (redirectUrl && redirectUrl !== "" && redirectUrl !== null) {
      if (isExternal) {
        window.open(redirectUrl, "_blank");
      } else {
        pushHistory(redirectUrl);
      }
    }
  };

  const handleSearchInputClick = () => {
    useNav.hideScrollToTop();
    setShowSearchModal(true);
  };

  const handleSearchResultClick = (item) => {
    const storeDetails = `${item?.storeDisplayName?.replace(
      "/",
      "-"
    )}-${item?.terminal?.value?.replace("/", "-")}-${item?.sector?.value}-${
      item?.movementType?.value
    }-${item?._id}`;
    const redirectLink = `storefront/${storeDetails}`;
    let data = getSessionStorage("productsData");
    data.terminal = item?.terminal?.value;
    data.movementType = item?.movementType?.value;
    data.sector = item?.sector?.value;
    setSessionStorage("productsData", data);
    pushHistory(redirectLink);
  };

  const getTerminalList = () => {
    const found = landingPageConstruct?.facets?.facets?.find(
      (x) => x?.facetLayout === "terminalGrid"
    );
    return found || {};
  };

  const searchNoResView = () => {
    if (searchResults === null) {
      return (
        <Fragment>
          <NoResultsImg src={DefaultSearchResImage} alt="no-results" />
          <NoResultsTitle>
            <Text type="bold">Hungry? Let's find something fast</Text>
          </NoResultsTitle>
          <NoResultsSubTitle>
            <Text>Search for your favorite restaurants.</Text>
          </NoResultsSubTitle>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <NoResultsImg src={NoResImage} alt="no-results" />
          <NoResultsTitle>
            <Text type="bold">No Results Found</Text>
          </NoResultsTitle>
          <NoResultsSubTitle>
            <Text>
              We couldn't find any matches. Please refine your search and try
              again
            </Text>
          </NoResultsSubTitle>
        </Fragment>
      );
    }
  };

  if (!isLoading) {
    return (
      <Wrapper
        className="takeaway-wrapper"
        style={{
          paddingBottom:
            getPageName(window.location.pathname, data?.domain) ===
              "Food and Beverages" || "spring-market"
              ? "120px"
              : "0px",
          // background:
          //   landingPageConstruct?.strapiPageComponent?.backgroundColor !== ""
          //     ? landingPageConstruct?.strapiPageComponent?.backgroundColor
          //     : "#fff",
        }}
      >
        {showDetailModal && (
          <ItemDetailModal
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            selectedItem={selectedItem}
            setShowCustomisationModal={setShowCustomisationModal}
            setShowRepeatSelectionModal={setShowRepeatSelectionModal}
            setShowMultiStoreCheckModal={setShowMultiStoreCheckModal}
            isDrawerOpen={showDetailModal}
            setIsDrawerOpen={setShowDetailModal}
            setMultiStoreData={setMultiStoreData}
            disableDrag={true}
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
            setRecommendationModal={setRecommendationModal}
            setRecommendationList={setRecommendationList}
            setChangeRepeatSelection={setChangeRepeatSelection}
            addNewCustomisation={addNewCustomisation}
            setChangeRepeatSelectionItem={setChangeRepeatSelectionItem}
            disableDrag={true}
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
        {showMultiStoreCheckModal && (
          <MultiStoreCheckModal
            isDrawerOpen={showMultiStoreCheckModal}
            setIsDrawerOpen={setShowMultiStoreCheckModal}
            multiStoreData={multiStoreData}
          ></MultiStoreCheckModal>
        )}
        {showTerminalSelectionModal && (
          <MobileFilterModal ref={modalRef}>
            <MobileFilterModalWrapper>
              <MobileFilterModalTitle>
                <Text type="bold">Select terminal</Text>
              </MobileFilterModalTitle>
              <MobileFilterModalTitleCloseIcon
                src={CrossIcon}
                onClick={() => setShowTerminalSelectionModal(false)}
              />
              <TerminalContentContainer>
                <TerminalGrid
                  showAllTerminalButton={true}
                  // data={areaData || {}}
                  data={getTerminalList() || {}}
                  handleFilterClick={handleTerminalClick}
                  selectedFilter={terminal}
                  selectedTerminal={selectedTerminal}
                />
              </TerminalContentContainer>
            </MobileFilterModalWrapper>
          </MobileFilterModal>
        )}
        {showSearchModal && (
          <SearchModal>
            <SearchModalWrapper>
              <GoBackContainer>
                <GoBack
                  mobileHeight={"52px"}
                  desktopHeight={"52px"}
                  onClick={() => {
                    useNav.showScrollToTop();
                    setShowSearchModal(false);
                    setSearchText("");
                    setSearchResults(null);
                  }}
                />
                <SearchInput
                  width={"100%"}
                  height={"52px"}
                  bgColor={"#EFEFEF"}
                  searchIcon={SearchIcon}
                  iconWidth={"20px"}
                  iconHeight={"20px"}
                  placeholder="Search"
                  inputRef={inputRef}
                  handleClick={() => handleSearchInputClick()}
                  handleChange={(e) => {
                    setSearchText(e?.target?.value);
                    handleThrottleSearchResult(e?.target?.value);
                  }}
                />
              </GoBackContainer>
              <SearchContainer>
                {searchResults?.length > 0 ? (
                  <SearchResultsContainer>
                    <SearchResultsWrapper>
                      {searchResults?.map((item, index) => (
                        <SearchResultsCard
                          key={index}
                          onClick={() => handleSearchResultClick(item)}
                        >
                          <SearchResultsTitle>
                            <Text type="medium">{item?.storeDisplayName}</Text>
                          </SearchResultsTitle>
                          <SearchResultsStoreLocation>
                            <Text type="medium">
                              {`${
                                item?.terminal?.displayLabel
                                  ? `${item?.terminal?.displayLabel?.trim()}`
                                  : ``
                              }${
                                item?.terminal?.displayLabel &&
                                item?.pickupLocation
                                  ? `, ${item?.pickupLocation?.trim()}`
                                  : item?.pickupLocation
                                  ? `${item?.pickupLocation?.trim()}`
                                  : ``
                              }
                            `}
                            </Text>
                          </SearchResultsStoreLocation>
                          {item?.prepTime && item?.orderingEnabled && (
                            <SearchResultsTimeContainer>
                              <SearchResultsTimeIcon src={PreTimeIcon} />
                              <SearchResultsPrepTime>
                                <Text>{`Pickup Time - ${item?.prepTime}`}</Text>
                              </SearchResultsPrepTime>
                            </SearchResultsTimeContainer>
                          )}
                        </SearchResultsCard>
                      ))}
                    </SearchResultsWrapper>
                  </SearchResultsContainer>
                ) : (
                  <NoResultsContainer>{searchNoResView()}</NoResultsContainer>
                )}
              </SearchContainer>
            </SearchModalWrapper>
          </SearchModal>
        )}
        {landingPageConstruct?.strapiPageComponent?.backgroundImage?.length >
          0 && (
          <PageBannerContainer>
            <Slider {...bannerCarouselSettings}>
              {Array.isArray(
                landingPageConstruct?.strapiPageComponent?.backgroundImage
              ) &&
                landingPageConstruct?.strapiPageComponent?.backgroundImage?.map(
                  (item, index) => (
                    <PageBannerImageContainer key={index}>
                      <PageBannerImage
                        src={item?.images?.[0]?.url || ""}
                        onClick={() =>
                          handleRedirection(
                            item?.RedirectLink,
                            item?.IsExternal,
                            item?.RedirectLinkLabel
                          )
                        }
                        alt="promotion"
                        style={{
                          cursor:
                            item?.RedirectLinkLabel === "allTerminal" ||
                            (item?.RedirectLink &&
                              item?.RedirectLink !== "" &&
                              item?.RedirectLink !== null)
                              ? "pointer"
                              : "auto",
                        }}
                      />
                    </PageBannerImageContainer>
                  )
                )}
            </Slider>
          </PageBannerContainer>
        )}
        {showSearchBar || areaData?.terminals?.length > 1 ? (
          <SearchInputContainer>
            {areaData?.terminals?.length > 1 && (
              <TerminalSectorContainer>
                <TerminalSectorWrapper
                  deliveryOption={data.deliveryOptions?.deliveryOption}
                  terminal={
                    selectedTerminal?.displayLabel || terminal?.displayLabel
                  }
                  movementType={data.movementType}
                  deliveryAddress={data?.deliveryOptions?.deliveryAddress}
                  domain={data?.domain}
                  handleClick={handleTerminalSelection}
                />
              </TerminalSectorContainer>
            )}
            {showSearchBar && (
              <SearchInputWrapper
                showSearchInFullWidth={areaData?.terminals?.length < 2}
              >
                <SearchInput
                  width={"100%"}
                  height={"52px"}
                  bgColor={"#EFEFEF"}
                  searchIcon={SearchIcon}
                  iconWidth={"20px"}
                  iconHeight={"20px"}
                  placeholder="Search"
                  handleClick={() => handleSearchInputClick()}
                  handleChange={() => null}
                />
              </SearchInputWrapper>
            )}
            {showSearchBar && (
              <SearchImg
                src={SearchIcon}
                onClick={() => handleSearchInputClick()}
                showSearchInFullWidth={areaData?.terminals?.length < 2}
              />
            )}
          </SearchInputContainer>
        ) : null}
        {Object.values(landingPageConstruct?.facets).length > 0 &&
          renderGlobalFilter(landingPageConstruct?.facets?.layout)}
        {landingPageConstruct?.strapiPageComponent?.displayLabel &&
          landingPageConstruct?.strapiPageComponent?.displayLabel !== "" && (
            <PageTitle>
              <Text type="bold" variant="heading">
                {landingPageConstruct?.strapiPageComponent?.displayLabel}
              </Text>
            </PageTitle>
          )}
        {landingPageConstruct?.strapiPageComponent?.backgroundImage?.url !==
          "" && (
          <IllustrationImageWrapper>
            <IllustrationImage
              src={
                landingPageConstruct?.strapiPageComponent?.backgroundImage?.url
              }
            />
          </IllustrationImageWrapper>
        )}
        {!showSearchView &&
          landingPageConstruct?.sections?.map((item, index) => (
            <CollectionContainer
              key={index}
              collectionType={true}
              // style={{
              //   background:
              //     item?.sectionComponent?.sectionType === "AllBrandsBox"
              //       ? "transparent"
              //       : item?.sectionComponent?.backgroundColor,
              //   margin:
              //     index === 0
              //       ? "16px 0px 0px 0px"
              //       : index === landingPageConstruct?.sections?.length - 1
              //       ? "32px 0px 0px 0px"
              //       : "32px 0px",
              //   padding:
              //     item?.sectionComponent?.sectionType === "ImageCarousel"
              //       ? "0px"
              //       : item?.sectionComponent?.backgroundColor === "#fff" ||
              //         item?.sectionComponent?.backgroundColor === null ||
              //         item?.sectionComponent?.sectionType === "SearchBox" ||
              //         item?.sectionComponent?.sectionType === "AllBrandsBox"
              //       ? isDesktopDevice()
              //         ? "0px 136px"
              //         : "0px 24px"
              //       : isDesktopDevice()
              //       ? "40px 136px 55px 136px"
              //       : "40px 24px 55px 24px",
              // }}
            >
              {item?.sectionComponent?.sectionType !== "SearchBox" && (
                <Row
                  isDisplayLabel={
                    displayCollectionLabel.some(
                      (label) => label.displayId === item.displayCollectionId
                    )
                      ? displayCollectionLabel.find(
                          (label) =>
                            label.displayId === item.displayCollectionId
                        ).isDisplayLabel
                      : true
                  }
                >
                  {!globalFilterLoader && (
                    <ViewAllWrapper>
                      {item?.sectionComponent?.name !== "" &&
                        item?.sectionComponent?.sectionType !==
                          "AllBrandsBox" && (
                          <CollectionTitle
                            // textStyle={{ color: item?.sectionComponent?.fontColor }}
                            title={item?.sectionComponent?.displayLabel}
                            count={
                              !isStoreLoading
                                ? Array.isArray(
                                    landingPageData[item?.displayCollectionId]
                                      ?.items
                                  )
                                  ? landingPageData[item?.displayCollectionId]
                                      ?.items?.length
                                  : landingPageData[item?.displayCollectionId]
                                      ?.items?.data?.length
                                : null
                            }
                            collectionLogo={
                              item?.sectionComponent?.displayLabelIcon?.data
                                ?.attributes?.url
                            }
                          />
                        )}
                      {!isMobileDevice() && renderViewAllContainer(item)}
                    </ViewAllWrapper>
                  )}
                </Row>
              )}

              {item?.sectionComponent?.description !== "" &&
                item?.sectionComponent?.description !== undefined &&
                item?.sectionComponent?.description !== null &&
                item?.sectionComponent?.sectionType !== "AllBrandsBox" && (
                  <CollectionSubTitle
                  // textStyle={{
                  //   color: item?.sectionComponent?.fontColor,
                  //   padding:
                  //     item?.sectionComponent?.displayLabel?.trim() ===
                  //     "The ultimate gift guide"
                  //       ? "8px 0px 32px 0px"
                  //       : "8px 0px",
                  // }}
                  // subTitle={item?.sectionComponent?.description}
                  />
                )}
              {item?.sectionComponent?.backgroundImage?.url &&
                item?.sectionComponent?.backgroundImage?.url !== "" &&
                item?.sectionComponent?.sectionType?.trim() !==
                  "AllBrandsBox" && (
                  <SectionIllustrationImageContainer>
                    <IllustrationImage
                      src={item?.sectionComponent?.backgroundImage?.url}
                    />
                  </SectionIllustrationImageContainer>
                )}
              {landingPageData[item?.displayCollectionId]?.facets?.facets
                ?.length > 0 &&
                landingPageData[item?.displayCollectionId]?.facets?.facets[0]
                  ?.facetDetails?.facetOptionValues.length > 0 && (
                  <HorzScrollContainer
                    style={{
                      paddingTop: "20px",
                      paddingRight: "40px",
                      paddingBottom: "24px",
                      gap: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FilterCard
                      title={"All"}
                      selected={
                        sectionFilterParams["All"] &&
                        sectionFilterParams["All"]["All"]?.includes("All")
                      }
                      onClick={() =>
                        handleSectionFilter(
                          item?.displayCollectionId,
                          landingPageData[item?.displayCollectionId]?.facets
                            ?.facets[0]?.facetDetails?.filterParam,
                          "All",
                          item
                        )
                      }
                    />
                    {landingPageData[item?.displayCollectionId]?.facets?.facets
                      ?.length > 0 &&
                      landingPageData[
                        item?.displayCollectionId
                      ]?.facets?.facets[0]?.facetDetails?.facetOptionValues?.map(
                        (filItem, filIndex) => (
                          <FilterCard
                            key={filIndex}
                            title={filItem.displayLabel}
                            selected={
                              sectionFilterParams[item?.displayCollectionId] &&
                              sectionFilterParams[item?.displayCollectionId][
                                landingPageData[item?.displayCollectionId]
                                  ?.facets?.facets[0]?.filterParam
                              ]?.includes(filItem.value)
                            }
                            onClick={() =>
                              handleSectionFilter(
                                item?.displayCollectionId,
                                landingPageData[item?.displayCollectionId]
                                  ?.facets?.facets[0]?.filterParam,
                                filItem.value,
                                item
                              )
                            }
                          />
                        )
                      )}
                  </HorzScrollContainer>
                )}
              {item?.sectionComponent?.sectionType === "HorizontalScroller" ? (
                <FilterCarouselWrapper>
                  <FilterCarousel
                    type={item?.sectionComponent?.cardComponent?.cardType}
                    component={renderCardContainer}
                    item={item}
                    wrapperType={true}
                    isCardRef={isCardRef}
                    isStoreLoading={isStoreLoading}
                    globalFilterLoader={globalFilterLoader}
                    setGlobalFilterLoader={setGlobalFilterLoader}
                  />
                </FilterCarouselWrapper>
              ) : (
                <CardContainerController
                  sectionType={item?.sectionComponent?.sectionType}
                  data={
                    Array.isArray(
                      landingPageData[item?.displayCollectionId]?.items
                    )
                      ? landingPageData[item?.displayCollectionId]?.items
                      : landingPageData[item?.displayCollectionId]?.items?.data
                  }
                  settings={settings}
                  sectionData={item}
                  items={landingPageData[item?.displayCollectionId]?.items}
                  handleSearchBoxClick={handleSearchBoxClick}
                  searchInputRef={searchInputRef}
                  handleChange={(e) =>
                    handleAction(
                      item?.actions,
                      item?.sectionComponent?.sectionAction,
                      "",
                      e
                    )
                  }
                  handleAction={(e) =>
                    handleAction(
                      item?.actions,
                      item?.sectionComponent?.sectionAction,
                      item,
                      e
                    )
                  }
                  handleCardAction={handleAction}
                  gridStyles={{ gap: "24px 36px" }}
                  cardType={item?.sectionComponent?.cardComponent?.cardType}
                >
                  {renderCardController(item?.displayCollectionId, item)}
                </CardContainerController>
              )}
            </CollectionContainer>
          ))}
        <FloatingCart />
        {recommendationModal &&
          Array.isArray(recommendationList) &&
          recommendationList?.length > 0 && (
            <RecommendationModal
              recommendationModal={recommendationModal}
              setRecommendationModal={setRecommendationModal}
              recommendationList={recommendationList}
              selectedRecommendationItemId={selectedRecommendationItemId}
              setSelectedRecommendationItemId={setSelectedRecommendationItemId}
            />
          )}
      </Wrapper>
    );
  } else {
    return <Loader />;
  }
};

const PageTitle = styled.div`
  color: ${colors?.text?.black200};
  font-size: 24px;
  font-weight: 700;
  line-height: 31px;
  padding: 32px 24px 0px 24px;

  @media ${device.laptop} {
    padding: 32px 136px 0px 136px;
  }
`;
const IllustrationImageWrapper = styled.div`
  position: absolute;
  right: 0px;
  top: -50px;
  mix-blend-mode: overlay;
`;
const SectionIllustrationImageContainer = styled.div`
  position: absolute;
  top: 18px;
  right: 0px;
`;
const IllustrationImage = styled.img``;
const Wrapper = styled.div`
  width: 100vw;
  position: relative;
  padding: 0px 24px;
  background: ${colors?.pageBackground?.secondary};

  @media ${device.laptop} {
    padding: 0px 75px;
  }
`;
const PageBannerContainer = styled.div`
  width: 100%;
  padding-top: 24px;
`;
const PageBannerImageContainer = styled.div`
  width: 100%;
  height: auto;
`;
const PageBannerImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;
const Row = styled.div`
  width: 100%;
  display: ${({ isDisplayLabel }) => (isDisplayLabel ? "flex" : "none")};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 0px;
  background: transparent;

  @media ${device.laptop} {
    padding: 32px 0px;
  }
`;
const ViewAllWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;
const SearchResultWrapper = styled.div`
  padding: 40px 24px 55px 24px;
`;
const FilterCarouselWrapper = styled.div`
  width: 100%;
`;
const EmbeddedFilterWrapper = styled.div`
  width: 100%;
  padding: 16px 0px 40px 0px;
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
  background: #fff;
  position: fixed;
  z-index: 99999999;
  box-shadow: 0 0 0 3em rgba(0, 0, 0, 0.4);
`;
const MobileFilterModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 32px 24px;

  @media ${device.laptop} {
    padding: 32px 136px;
  }
`;
const MobileFilterModalTitleCloseIcon = styled.img`
  position: absolute;
  right: 24px;
  top: 24px;
  width: 24px;
  height: 24px;
  cursor: pointer;
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
const SearchInputContainer = styled.div`
  width: 100%;
  padding-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px 0px;

  @media ${device.laptop} {
    flex-direction: row;
    align-items: center;
    gap: 0px 24px;
  }
`;
const SearchInputWrapper = styled.div`
  width: ${({ showSearchInFullWidth }) =>
    showSearchInFullWidth ? "100%" : "40%"};
  display: ${({ showSearchInFullWidth }) =>
    showSearchInFullWidth ? "flex" : "none"};

  @media ${device.laptop} {
    width: ${({ showSearchInFullWidth }) =>
      showSearchInFullWidth ? "50%" : "auto"};
    display: flex;
  }
`;
const SearchImg = styled.img`
  display: ${({ showSearchInFullWidth }) =>
    showSearchInFullWidth ? "none" : "flex"};

  @media ${device.laptop} {
    display: none;
  }
`;
const TerminalSectorContainer = styled.div`
  width: 80%;

  @media ${device.laptop} {
    width: auto;
  }
`;
const SearchModal = styled.div`
  position: relative;
  top: 0;
  left: 0;
  bottom: 0;
  height: calc(100%);
  max-width: 100%;
  width: calc(100%);
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  background: #fff;
  position: fixed;
  z-index: 99999;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }
`;
const SearchModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 32px 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 0px;
  gap: 24px;

  @media ${device.laptop} {
    padding: 32px 80px;
    width: 720px;
    max-width: 720px;
    margin: 0 auto;
  }

  @media ${device.laptop}, ${device.tablet} {
    margin-top: 24px;
  }
`;
const SearchResultsContainer = styled.div`
  width: 100%;
  margin-top: 16px;
  padding-bottom: 24px;
`;
const SearchResultsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px 0px;
`;
const SearchResultsCard = styled.div`
  width: 100%;
  cursor: pointer;
`;
const SearchResultsTitle = styled.div`
  font-size: 20px;
  color: ${colors?.text?.black800};
`;
const SearchResultsStoreLocation = styled.div`
  font-size: 16px;
  color: ${colors?.text?.black800};
  line-height: 18px;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-top: 4px;
`;
const SearchResultsTimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding-top: 4px;
`;
const SearchResultsTimeIcon = styled.img`
  width: 16px;
  height: 16px;
`;
const SearchResultsPrepTime = styled.div`
  font-size: 16px;
  color: ${colors?.text?.black800};
`;
const NoResultsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 48px;

  @media ${device.laptop} {
    height: calc(100vh - 200px);
  }
`;
const NoResultsImg = styled.img`
  width: 157px;
  height: 157px;
`;
const NoResultsTitle = styled(H6)`
  margin-top: 24px;
`;
const NoResultsSubTitle = styled(T5)`
  margin-top: 12px;
  text-align: center;
  max-width: 80%;

  @media ${device.laptop} {
    max-width: 415px;
  }
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
export const GoBackContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 18px;

  @media ${device.laptop}, ${device.tablet} {
    gap: 24px;
  }
`;

export default TakeAway;
