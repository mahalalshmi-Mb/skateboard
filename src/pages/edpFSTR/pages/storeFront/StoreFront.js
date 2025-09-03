import { Fragment, useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { useHistory, useLocation, useParams } from "react-router-dom";
import moment from "util/momentWrapper";
import SearchIcon from "../../../../assets/images/commons/searchGray.svg";
import callAPI from "../../../../commons/callAPI";
import config, { channel } from "../../../../commons/config";
import { getAppConfig } from "../../../../commons/util/appConfigHelper";
import {
  fetchQueryURL,
  isDesktopDevice,
  hasAllValues,
  fetchStoreFrontURL,
} from "../../../../commons/util/helperFunctions";
import Util from "../../../../commons/util/util";
import Text from "../../../../components/atoms/Text";
import Loader from "../../../../components/atoms/loader";
import { CartContext } from "../../../../context/cartContext";
import { NavContext } from "../../../../context/navContext";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import ETA from "../../assets/ETABlack.svg";
import Info from "../../assets/info.svg";
import StoreListMenuItem from "../../components/StoreListMenuItem";
import SearchInput from "../../components/molecules/SearchInput";
import ItemCustomizationModal from "../../components/organism/ItemCustomizationModal";
import ItemDetailModal from "../../components/organism/ItemDetailModal";
import RepeatSelectionModal from "../../components/organism/RepeatSelectionModal";
import { getPageName } from "../../util/util";
import { productDomain } from "../config/config";
import RecommendationModal from "../Recommendation/Recommendation";
import { useConfig } from "context/configContext";
import { colors } from "theme/colors";
import MultiStoreCheckModal from "pages/edpFSTR/productComponents/organisms/MultiStoreCheckModal";
import {
  CategoryCard,
  CategoryListingContainer,
  CategoryScrollerContainer,
  CategoryScrollerWrapper,
  ContentContainer,
  PrepTime,
  PrepTimeContainer,
  PrepTimeIcon,
  SearchBarContainer,
  StoreBanner,
  StoreBannerContainer,
  StoreDetailsContainer,
  StoreListMenuItemWrapper,
  StoreLocation,
  StoreLogo,
  StoreLogoContainer,
  StoreName,
  StoreSelectionContainer,
  Wrapper,
  MoreInfoContainer,
  MoreInfoIcon,
  Col,
  StoreActionContainer,
  Spacer,
  InfoBannerText,
  InfoBannerCloseIcon,
  InfoBannerContainerMobile,
  InfoBannerContainerDesktop,
  StoreSelectionWrapper,
  StoreDataContainer,
  Row,
  StoreSectionContainer,
} from "./style";
import StoreListMenuFoodItem from "pages/edpFSTR/components/molecules/StoreListMenuFoodItem";
import ShowMoreInfoModal from "pages/edpFSTR/components/organism/ShowMoreInfoModal";
import FloatingCart from "pages/edpFSTR/components/molecules/FloatingCart";
import PushAlert from "components/atoms/pushAlert";
import CloseIcon from "../../../../assets/images/commons/x-icon-black.svg";
import GoBack from "pages/edpFSTR/components/molecules/GoBack";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const StoreFront = (props) => {
  const getStoreId = () => {
    const paramsArr = params?.storeId?.split("-");
    return paramsArr[paramsArr?.length - 1];
  };
  const URL = window.location.href;
  const urlParts = ["storeName", "terminal", "sector", "section", "id"];
  const urlKey = "storefront/";
  const targetRef = useRef(null);
  const categoryRef = useRef([]);
  const storeNameRef = useRef(null);
  const useNav = useContext(NavContext);
  const ClientCart = useContext(CartContext);
  const params = useParams();
  let query = useQuery();
  const history = useHistory();
  const { state } = useLocation();
  const { pushHistory, replaceHistory } = useCustomNavigation();
  const { timezone, isMultiMerchantAllowed } = useConfig();
  const [dineInSessionData] = useState(getSessionStorage("dine-in"));
  const [tableNumber] = useState(dineInSessionData?.tableNumber);
  const [isDineIn] = useState(dineInSessionData?.storeId || "" !== "");
  const [sessionData, setSessionData] = useState(
    getSessionStorage("productsData")
  );
  const [storeList, setStoreList] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStoreId, setSelectedStoreId] = useState({});
  const [storeDetails, setStoreDetails] = useState({});
  const [filtersList, setFiltersList] = useState([]);
  const [expandedMenuIndex, setExpandedMenuIndex] = useState(0);
  const [selectedCategoryItems, setSelectedCategoryItems] = useState([]);

  const [selectedItem, setSelectedItem] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(state?.productId || "");
  const [showDetailModal, setShowDetailModal] = useState(
    state?.showDetailModal || false
  );
  const [showCustomisationModal, setShowCustomisationModal] = useState(false);
  const [subCategory, setSubCategory] = useState(
    sessionData?.selectedFoodType || ""
  );
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [showRepeatSelectionModal, setShowRepeatSelectionModal] =
    useState(false);
  const [changeRepeatSelection, setChangeRepeatSelection] = useState(false);
  const [changeRepeatSelectionItem, setChangeRepeatSelectionItem] = useState(
    {}
  );
  const [primaryContact, setPrimaryContact] = useState("");
  const [globalFilterParams, setGlobalFilterParams] = useState(
    getSessionStorage("productFilters")?.[sessionData?.domain] || {}
  );
  const [isDeliveryQrCode] = useState(
    getSessionStorage("qrCodeSource")
      ?.toLowerCase()
      ?.includes("deliver-to-gate")
  );
  const [isLoungeQrCode, setIsLoungeQrCode] = useState(false);
  const [recommendationModal, setRecommendationModal] = useState(false);
  const [recommendationList, setRecommendationList] = useState([]);
  const [selectedRecommendationItemId, setSelectedRecommendationItemId] =
    useState("");
  const [showMultiStoreCheckModal, setShowMultiStoreCheckModal] =
    useState(false);
  const [multiStoreData, setMultiStoreData] = useState({});
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [addNewCustomisation, setAddNewCustomisation] = useState(false);
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  useEffect(() => {
    if (!sessionData) {
      setProductDataSession();
    }
    Util.getQrCodeSource(window.location.href);
    let params = Util.getUrlParams(window.location.href);
    if (params?.QRCodescancampaign?.toLowerCase()?.includes("lounge-bar")) {
      handleQrCode();
    }
  }, []);

  const setProductDataSession = () => {
    let data = getSessionStorage("productsData") || {};
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
        displayLabel: "",
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

  const displayIds = (target) => {
    const id = target?.getAttribute("name");
    if (id) {
      const index = id?.replace("id_", "");
      setExpandedMenuIndex(Number(index));
    }
  };

  const myScrollHandler = () => {
    if (!isDesktopDevice()) {
      const storeArray = storeDetails?.categories?.entries() || [];
      for (const [index, item] of storeArray) {
        const name = `id_${index}`;
        const target = document.querySelector(`[name=${name}]`);
        const top = target?.getBoundingClientRect().top || 0;
        if (top >= 0 && top <= window.innerHeight) {
          displayIds(target);
          break;
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", myScrollHandler);
    return () => document.removeEventListener("scroll", myScrollHandler);
  }, [storeDetails]);

  useEffect(() => {
    let params = Util.getUrlParams(window.location.href);
    if (isDineIn) {
      useNav.setShowDineInBottomTab(true);
      useNav.hideAllNavs();
    } else if (
      params?.QRCodescancampaign?.toLowerCase()?.includes("deliver-to-gate") ||
      params?.QRCodescancampaign?.toLowerCase()?.includes("lounge-bar")
    ) {
      useNav.hideAllNavs();
    } else {
      if (isMobile) {
        useNav.showHeaderGoBack();
      } else {
        useNav.hideHeaderGoBack();
      }
    }

    return () => {
      if (isDineIn) {
        useNav.setShowDineInBottomTab(false);
        useNav.showAllNavs();
      } else if (
        params?.QRCodescancampaign?.toLowerCase()?.includes(
          "deliver-to-gate"
        ) ||
        params?.QRCodescancampaign?.toLowerCase()?.includes("lounge-bar")
      ) {
        useNav.showAllNavs();
      } else {
        useNav.showHeaderNavs();
        useNav.hideHeaderGoBack();
      }
    };
  }, [showCustomisationModal, showRepeatSelectionModal]);

  useEffect(() => {
    if (window?.location?.pathname?.includes("storefront")) {
      const storeId = getStoreId();
      try {
        let storeData = JSON.parse(JSON.stringify(storeList));
        const found = storeData?.find((item) => item?._id === storeId);
        if (found) {
          setSelectedStoreId({
            label: found?.storeDisplayName,
            value: storeId,
          });
        }
        if (!dineInSessionData) {
          getStores();
        } else {
          let URLQueryParams = {};
          if (!sessionData)
            URLQueryParams = fetchQueryURL(URL, urlParts, urlKey);
          getStoreDetails(URLQueryParams);
        }
      } catch (e) {}
    }
  }, [window.location.href]);

  useEffect(() => {
    if (categoryRef.current[expandedMenuIndex]) {
      categoryRef.current[expandedMenuIndex].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [expandedMenuIndex]);

  const getStores = async () => {
    setIsLoading(true);
    let URLQueryParams = {};
    if (!sessionData) URLQueryParams = fetchQueryURL(URL, urlParts, urlKey);
    try {
      if (
        (!URLQueryParams ||
          Object.keys(URLQueryParams).length === 0 ||
          hasAllValues(URLQueryParams)) &&
        (!sessionData ||
          Object.keys(sessionData).length === 0 ||
          hasAllValues(sessionData))
      ) {
        PushAlert.error("Page is not loading, try later!");
      } else {
        let apiURL = `${config.api.products.getStores}`;
        let apiResponse = await callAPI.get(apiURL, {
          location: sessionData?.terminal || URLQueryParams?.terminal,
          sector: sessionData?.sector || URLQueryParams?.sector,
          section: sessionData?.movementType || URLQueryParams?.section || "",
          supportedFulfillmentTypes:
            sessionData?.deliveryOptions?.deliveryOption ||
            URLQueryParams?.supportedFulfillmentTypes,
          orderDateTime:
            sessionData?.deliveryOptions?.isScheduled ||
            sessionData?.deliveryOptions?.isDelivery
              ? moment(
                  sessionData?.deliveryOptions?.deliveryTime,
                  "UTC",
                  "UTC"
                ).format()
              : moment(new Date(), "UTC", "UTC").format(),
          timezone: timezone,
          domain: sessionData?.domain || URLQueryParams?.domain || "",
          channel: channel,
          landingPage: getPageName(
            `/${window.location.pathname.split("/")[1]}`,
            sessionData?.domain
          ),
          platform: getAppConfig("platform") || "",
        });
        let regResponse = await apiResponse.json();
        if (regResponse.status === 200 && regResponse.data) {
          let completeStores = regResponse?.data?.indoor?.concat(
            regResponse?.data?.outdoor
          );
          completeStores = completeStores?.filter((x) => x?.orderingEnabled);
          let selectedValues = {};
          if (params.storeId === "") {
            selectedValues = {
              value: completeStores?.[0]?._id,
              label: completeStores?.[0]?.storeDisplayName,
            };
            setSelectedStoreId(selectedValues);
          } else {
            const storeId = getStoreId();
            const found = completeStores?.find((x) => x?._id === storeId);
            if (found) {
              selectedValues = {
                value: found._id,
                label: found.storeDisplayName,
              };
              setSelectedStoreId(selectedValues);
            }
          }
          let stores = [];
          completeStores?.forEach((x) => {
            stores.push({
              label: x?.storeDisplayName,
              value: x?._id,
              ...x,
            });
          });
          stores = stores?.filter(
            (item) => item?._id !== selectedValues?.value
          );
          setStoreList(stores);
          setMetaData(regResponse.metadata);
          getStoreDetails(URLQueryParams);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getStoreDetails = async (URLQueryParams) => {
    setIsLoading(true);
    try {
      if (
        (!URLQueryParams ||
          Object.keys(URLQueryParams).length === 0 ||
          hasAllValues(URLQueryParams)) &&
        (!sessionData ||
          Object.keys(sessionData).length === 0 ||
          hasAllValues(sessionData))
      ) {
        PushAlert.error("Page is not loading, try later!");
      } else {
        let paramObj = {};
        for (var value of query.keys()) {
          paramObj[value] = query.get(value);
        }
        let filParams = JSON.parse(JSON.stringify(globalFilterParams));
        Object.keys(filParams).forEach(function (key, index) {
          filParams[key] = filParams[key].join(",");
        });

        const params = {
          id: getStoreId() || URLQueryParams?.id,
          rule_id: [],
          tags: selectedFilters.toString(),
          dietCategory: subCategory,
          location: isDineIn
            ? ""
            : sessionData?.terminal || URLQueryParams?.terminal,
          sector: isDineIn ? "" : sessionData?.sector || URLQueryParams?.sector,
          section: isDineIn
            ? ""
            : sessionData?.movementType || URLQueryParams?.section || "",
          supportedFulfillmentTypes: isDineIn
            ? "DineIn"
            : sessionData?.deliveryOptions?.deliveryOption ||
              URLQueryParams?.supportedFulfillmentTypes,
          orderDateTime: isDineIn
            ? moment(new Date(), "UTC", "UTC").format()
            : sessionData?.deliveryOptions?.isScheduled ||
              sessionData?.deliveryOptions?.isDelivery
            ? moment(
                sessionData?.deliveryOptions?.deliveryTime,
                "UTC",
                "UTC"
              ).format()
            : moment(new Date(), "UTC", "UTC").format(),
          timezone: timezone,
          bookingSource: getAppConfig("CALL_PROMO_API")
            ? Util.getBookingSource()
            : "",
          filterComponentId:
            paramObj?.filterComponentId || URLQueryParams?.filterComponentId,
          ...filParams,
        };
        if (isDineIn) {
          params["filterComponentId"] = "globalFilterForFNB";
          Object.keys(dineInSessionData).forEach((key) => {
            params[key] = dineInSessionData[key];
          });
        }

        const apiURL =
          config.api.products.getProductsByStore + "?timezone=" + timezone;

        let storeDetailResponse = await callAPI.post(apiURL, params);

        let regStoreDetailResponse = await storeDetailResponse.json();
        if (regStoreDetailResponse.status === 200) {
          checkRoute(regStoreDetailResponse.data);
          setStoreDetails(regStoreDetailResponse.data);
          setFiltersList(regStoreDetailResponse.data?.filters);
          setExpandedMenuIndex(0);
          setSelectedCategoryItems(
            regStoreDetailResponse?.data?.categories?.[0]?.items || []
          );
          if (
            regStoreDetailResponse.data?.shopDetails &&
            regStoreDetailResponse.data?.shopDetails?.contact &&
            regStoreDetailResponse.data?.shopDetails?.contact.length > 0
          ) {
            const found =
              regStoreDetailResponse.data?.shopDetails?.contact.find(
                (x) =>
                  x?.primaryContactFlag &&
                  x?.isActive &&
                  x?.primaryContactFlag?.toLowerCase() === "yes" &&
                  x?.isActive?.toLowerCase() === "yes"
              );
            if (found) {
              setPrimaryContact(found.contactNo);
            }
          }
          setIsLoading(false);
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  const checkRoute = (data) => {
    const paramsArr = params?.storeId?.split("-");
    const queryParams = window?.location?.search;

    if (paramsArr?.length === 1) {
      const storeDetails = `${data?.shopDetails?.name}-${data?.shopDetails?.terminal?.value}-${paramsArr[0]}`;
      const redirectLink = `/storefront/${storeDetails}${queryParams}`;
      replaceHistory(redirectLink);
    }
  };

  const handleMenuClick = (index, sectionName, categoryItems) => {
    if (isDesktopDevice()) {
      setSelectedCategoryItems(categoryItems);
      setExpandedMenuIndex(Number(index));
      if (storeNameRef?.current) {
        storeNameRef?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    } else {
      if (sectionName && sectionName !== "") {
        scrollToTargetAdjusted(sectionName, 140);
      }
    }
    let eventName = "store_menu_expanded";
    Util.triggerMoEngageEvent(eventName, {
      store_id: selectedStoreId,
      store_name: storeDetails?.shopDetails?.name,
      section_name: sectionName,
    });
  };

  const showHeaders = () => {
    if (isMobile) {
      useNav.hideFooterNavs();
      useNav.showHeaderNavs();
      useNav.showBottomNavs();
    } else {
      useNav.showHeaderNavs();
      useNav.showFooterNavs();
    }
  };

  const handleQrCode = () => {
    setIsLoading(true);
    let params = Util.getUrlParams(window.location.href);
    if (params?.QRCodescancampaign?.toLowerCase()?.includes("lounge-bar")) {
      if (
        !getSessionStorage("qrCodeSource")
          ?.toLowerCase()
          ?.includes("lounge-bar")
      ) {
        ClientCart.reset();
        ClientCart.clearSavedLocalCart();
      }
      setIsLoungeQrCode(true);
      handleQRLounge(params?.tableNumber);
      setIsLoading(false);
    } else if (
      getSessionStorage("qrCodeSource")?.toLowerCase()?.includes("lounge-bar")
    ) {
      setIsLoungeQrCode(true);
      handleQRLounge(params?.tableNumber);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const handleQRLounge = (tableNumber) => {
    let productsData = {
      deliveryOptions: {
        deliveryOption: config.deliveryOptions.takeaway,
        deliveryTime: moment(new Date(), "UTC", "UTC").format(),
        deliveryAddress: tableNumber ? `Table ${tableNumber}` : ``,
        isPackagingRequested: false,
        isDelivery: false,
        timezone: timezone,
      },
      domain: productDomain.fnb,
    };
    setSessionStorage("productsData", productsData);
  };

  const handleFoodItemClick = (id, item) => {
    let data = ClientCart.hasMultiStoreItems(item?.shopId, item?.shopName);
    if (data?.hasMultiStoreItems && !isMultiMerchantAllowed) {
      setMultiStoreData({
        hasMultiStoreItems: data?.hasMultiStoreItems,
        oldStore: data?.oldStore,
        newStore: data?.newStore,
      });
      setShowMultiStoreCheckModal(true);
    } else if (item?.itemWithPreference) {
      setSelectedItem(item);
      setSelectedItemId(id);
      setShowCustomisationModal(true);
      useNav.hideAllNavs();
    } else {
      setSelectedItem(item);
      setSelectedItemId(id);
      setShowDetailModal(true);
      useNav.hideAllNavs();
    }
  };

  const handleSearchInputClick = () => {
    pushHistory(`/search-result/${selectedStoreId?.value}`);
  };

  const handleItemCustomisationHideClick = () => {
    setShowCustomisationModal(false);
    setAddNewCustomisation(false);
    if (!isDeliveryQrCode || !isLoungeQrCode) {
      showHeaders();
    }
  };

  const handleRepeatSelectionHideClick = () => {
    setShowRepeatSelectionModal(false);
    if (!isDeliveryQrCode || !isLoungeQrCode) {
      showHeaders();
    }
  };

  function scrollToTargetAdjusted(sectionName, heightOffset) {
    var element = document?.getElementById(sectionName);
    var headerOffset = isDesktopDevice() ? 300 : 240;
    var elementPosition = element?.getBoundingClientRect().top || 0;
    var offsetPosition =
      elementPosition + window.pageYOffset - headerOffset + (heightOffset || 0);
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  const handleStoreCardClick = (e) => {
    let storeData = JSON.parse(JSON.stringify(storeList));
    let storeDetails = ``;
    setSelectedFilters([]);
    const storeObj = storeData?.find((item) => item?._id === e?.value);
    if (storeObj) {
      storeDetails = fetchStoreFrontURL(storeObj, e?.value);
    }

    Util.triggerMoEngageEvent("store_viewed", {
      store_id: e?.value,
      store_name: storeObj?.storeDisplayName,
      terminal: storeObj?.terminal?.value,
      sector: storeObj?.sector?.value,
      movement_type: storeObj?.movementType?.value,
    });
    pushHistory(
      `/storefront/${storeDetails}?filterComponentId=${metaData.filterComponentId}`
    );
    setSelectedStoreId({ label: storeObj?.storeDisplayName, value: e?.value });
  };

  const handleGoBack = () => {
    if (history && history?.goBack()) {
      history.goBack();
    }
  };

  const getStoreFrontImage = (imageArray) => {
    const found = imageArray?.find(
      (x) =>
        x.isActive?.toLowerCase() === "y" &&
        x.imageType?.toLowerCase() === "large" &&
        (x?.platform?.toLowerCase() === "web" ||
          x?.platform?.toLowerCase() === "marketplace")
    );
    if (found) {
      return found?.imageURL;
    } else {
      return "";
    }
  };

  const IndicatorSeparator = () => {
    return <></>;
  };

  const getCategoryData = () => {
    if (isDesktopDevice()) {
      return selectedCategoryItems || [];
    } else {
      return storeDetails?.categories || [];
    }
  };

  const getShopCategory = () => {
    let categoryArr = [];
    storeDetails?.shopDetails?.shopCategory?.values?.forEach((x) => {
      categoryArr?.push(x?.name);
    });
    if (categoryArr?.length > 0) {
      return categoryArr?.join(", ");
    } else {
      return "";
    }
  };

  if (!isLoading) {
    return (
      <Wrapper>
        {showDetailModal && (
          <ItemDetailModal
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            selectedItem={selectedItem}
            setShowCustomisationModal={setShowCustomisationModal}
            setShowRepeatSelectionModal={setShowRepeatSelectionModal}
            isDrawerOpen={showDetailModal}
            setIsDrawerOpen={setShowDetailModal}
            isDineIn={isDineIn}
            setRecommendationModal={setRecommendationModal}
            setRecommendationList={setRecommendationList}
            setShowMultiStoreCheckModal={setShowMultiStoreCheckModal}
            setMultiStoreData={setMultiStoreData}
          ></ItemDetailModal>
        )}
        {recommendationModal &&
          Array.isArray(recommendationList) &&
          recommendationList?.length > 0 && (
            <RecommendationModal
              recommendationModal={recommendationModal}
              setRecommendationModal={setRecommendationModal}
              recommendationList={recommendationList}
              selectedRecommendationItemId={selectedRecommendationItemId}
              setSelectedRecommendationItemId={setSelectedRecommendationItemId}
              setShowDetailModal={setShowDetailModal}
              setShowCustomisationModal={setShowCustomisationModal}
              setSelectedItemId={setSelectedItemId}
              showRepeatSelectionModal={showRepeatSelectionModal}
              setShowRepeatSelectionModal={setShowRepeatSelectionModal}
              setChangeRepeatSelectionItem={setChangeRepeatSelectionItem}
            />
          )}
        {showCustomisationModal && (
          <ItemCustomizationModal
            selectedItemId={selectedItemId}
            onModalHide={() => handleItemCustomisationHideClick()}
            changeRepeatSelection={changeRepeatSelection}
            changeRepeatSelectionItem={changeRepeatSelectionItem}
            setChangeRepeatSelection={setChangeRepeatSelection}
            addNewCustomisation={addNewCustomisation}
            setChangeRepeatSelectionItem={setChangeRepeatSelectionItem}
            setShowRepeatSelectionModal={(val) =>
              setShowRepeatSelectionModal(val)
            }
            isDrawerOpen={showCustomisationModal}
            setIsDrawerOpen={setShowCustomisationModal}
            isDineIn={isDineIn}
            ItemCustomizationModal={setRecommendationModal}
            disableDrag={true}
          ></ItemCustomizationModal>
        )}
        {showRepeatSelectionModal && (
          <RepeatSelectionModal
            selectedItemId={selectedItemId}
            onModalHide={() => handleRepeatSelectionHideClick()}
            setSelectedItemId={setSelectedItemId}
            setShowCustomisationModal={setShowCustomisationModal}
            showRepeatSelectionModal={showRepeatSelectionModal}
            setShowRepeatSelectionModal={setShowRepeatSelectionModal}
            setChangeRepeatSelection={setChangeRepeatSelection}
            setChangeRepeatSelectionItem={setChangeRepeatSelectionItem}
            isDineIn={isDineIn}
            setAddNewCustomisation={setAddNewCustomisation}
            disableDrag={true}
          ></RepeatSelectionModal>
        )}
        {showMultiStoreCheckModal && (
          <MultiStoreCheckModal
            isDrawerOpen={showMultiStoreCheckModal}
            setIsDrawerOpen={setShowMultiStoreCheckModal}
            multiStoreData={multiStoreData}
          ></MultiStoreCheckModal>
        )}
        {!isDineIn && (
          <Fragment>
            {showInfoBanner && getAppConfig("SHOW_STOREFRONT_INFO_BANNER") && (
              <InfoBannerContainerMobile>
                <InfoBannerText>
                  <Text type="semi-bold">Explore more. Order together.</Text>
                </InfoBannerText>
                <InfoBannerCloseIcon
                  src={CloseIcon}
                  onClick={() => setShowInfoBanner(false)}
                />
              </InfoBannerContainerMobile>
            )}
            <Row>
              <GoBack
                onClick={() => handleGoBack()}
                mobileHeight={"36px"}
                desktopHeight={"52px"}
              />
              <StoreSelectionContainer>
                {showInfoBanner &&
                  getAppConfig("SHOW_STOREFRONT_INFO_BANNER") && (
                    <InfoBannerContainerDesktop>
                      <InfoBannerText>
                        <Text type="medium">Explore more. Order together.</Text>
                      </InfoBannerText>
                      <InfoBannerCloseIcon
                        src={CloseIcon}
                        onClick={() => setShowInfoBanner(false)}
                      />
                    </InfoBannerContainerDesktop>
                  )}
                <StoreSelectionWrapper>
                  <Select
                    isSearchable={true}
                    value={selectedStoreId}
                    onChange={(e) => handleStoreCardClick(e)}
                    options={storeList}
                    components={{
                      IndicatorSeparator,
                    }}
                    styles={{
                      container: (base) => ({
                        ...base,
                        width: "100%",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        fontSize: "16px",
                        fontWeight: "300",
                        color: colors?.text?.black200,
                        paddingLeft: "20px",
                        fontFamily: colors?.font?.primary,
                        cursor: "pointer",
                      }),
                      control: (base) => ({
                        ...base,
                        width: "100%",
                        minWidth: "100%",
                        height: isDesktopDevice() ? "52px" : "36px",
                        minHeight: "36px",
                        borderRadius: "6px",
                        border: `1px solid ${colors?.primary}`,
                        "&:hover": {
                          border: `1px solid ${colors?.primary}`,
                        },
                      }),
                      menu: (base) => ({
                        ...base,
                        boxShadow: "none",
                        borderRadius: "8px",
                        marginTop: "5px",
                        marginBottom: "8px",
                        maxHeight: "80px",
                      }),
                      menuList: (base) => ({
                        ...base,
                        maxHeight: "150px",
                      }),
                      option: (base) => ({
                        ...base,
                        border: `1px solid #e9e9e9`,
                        display: "flex",
                        alignItems: "center",
                        fontSize: "16px",
                        fontWeight: "300",
                        color: colors?.text?.black300,
                        backgroundColor: "#fff",
                        fontFamily: colors?.font?.primary,
                        cursor: "pointer",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        fontSize: "16px",
                        fontWeight: "300",
                        letterSpacing: "0.35px",
                        color: colors?.text?.black200,
                        fontFamily: colors?.font?.primary,
                      }),
                      noOptionsMessage: (base) => ({
                        ...base,
                        fontSize: "16px",
                        fontWeight: "300",
                        letterSpacing: "0.35px",
                        color: colors?.text?.black200,
                        fontFamily: colors?.font?.primary,
                      }),
                    }}
                    aria-label="Select Store"
                  />
                </StoreSelectionWrapper>
              </StoreSelectionContainer>
            </Row>
          </Fragment>
        )}
        <StoreBannerContainer>
          <StoreBanner
            src={getStoreFrontImage(storeDetails?.shopDetails?.shopImage)}
            alt="store-banner"
          />
        </StoreBannerContainer>
        <StoreDetailsContainer>
          <StoreSectionContainer>
            <StoreDataContainer>
              <StoreLogoContainer>
                {getAppConfig("SHOW_STORE_LOGO") &&
                  storeDetails?.shopDetails?.shopBrandImageUrl && (
                    <StoreLogo
                      src={storeDetails?.shopDetails?.shopBrandImageUrl || ""}
                      alt="store-logo"
                      showInGrayscale={
                        getAppConfig("SHOW_STORE_LOGO_GRAYSCALE") || false
                      }
                    />
                  )}
                <Col>
                  <StoreName ref={storeNameRef}>
                    <Text type="bold" variant="heading">
                      {storeDetails?.shopDetails?.name}
                    </Text>
                  </StoreName>
                  <StoreLocation>
                    <Text type="bold">
                      {`${
                        storeDetails?.shopDetails?.terminal?.displayLabel
                          ? `${storeDetails?.shopDetails?.terminal?.displayLabel?.trim()}`
                          : ``
                      }${
                        storeDetails?.shopDetails?.terminal?.displayLabel &&
                        storeDetails?.shopDetails?.pickupLocation
                          ? `, ${storeDetails?.shopDetails?.pickupLocation?.trim()}`
                          : storeDetails?.shopDetails?.pickupLocation
                          ? `${storeDetails?.shopDetails?.pickupLocation?.trim()}`
                          : ``
                      }
                `}
                    </Text>
                  </StoreLocation>
                  {getAppConfig("SHOW_SHOP_CATEGORY") &&
                    storeDetails?.shopDetails?.shopCategory?.values?.length >
                      0 && (
                      <PrepTimeContainer>
                        <PrepTime>
                          <Text>{getShopCategory()}</Text>
                        </PrepTime>
                      </PrepTimeContainer>
                    )}

                  {storeDetails?.shopDetails?.prepTime !== "" && (
                    <PrepTimeContainer>
                      <PrepTimeIcon src={ETA} alt="prep-time" />
                      <PrepTime>
                        <Text>{`Pickup Time - ${storeDetails?.shopDetails?.prepTime}`}</Text>
                      </PrepTime>
                    </PrepTimeContainer>
                  )}
                </Col>
              </StoreLogoContainer>
            </StoreDataContainer>
            <StoreActionContainer>
              <MoreInfoContainer
                onClick={() => {
                  setShowMoreInfoModal(!showMoreInfoModal);
                }}
              >
                <MoreInfoIcon src={Info} alt="more-info" />
              </MoreInfoContainer>
              <Spacer />
              {isDesktopDevice() && (
                <SearchBarContainer>
                  <SearchInput
                    width={isDesktopDevice() ? "280px" : "100%"}
                    height={"52px"}
                    bgColor={"#EFEFEF"}
                    searchIcon={SearchIcon}
                    iconWidth={"20px"}
                    iconHeight={"20px"}
                    placeholder="Search within menu"
                    handleClick={() => handleSearchInputClick()}
                    handleChange={() => null}
                  />
                </SearchBarContainer>
              )}
              {!isDesktopDevice() && (
                <SearchIconComponent
                  alt="search-icon"
                  src={SearchIcon}
                  onClick={() => {
                    setShowSearchBar(!showSearchBar);
                  }}
                />
              )}
            </StoreActionContainer>
          </StoreSectionContainer>
        </StoreDetailsContainer>
        {showSearchBar && (
          <SearchBarContainer>
            <SearchInput
              width={isDesktopDevice() ? "280px" : "100%"}
              height={"52px"}
              bgColor={"#EFEFEF"}
              searchIcon={SearchIcon}
              iconWidth={"20px"}
              iconHeight={"20px"}
              placeholder="Search within menu"
              handleClick={() => handleSearchInputClick()}
              handleChange={() => null}
            />
          </SearchBarContainer>
        )}
        <ContentContainer>
          <CategoryScrollerContainer isDineIn={isDineIn}>
            <CategoryScrollerWrapper>
              {storeDetails?.categories?.map((item, index) => (
                <CategoryCard
                  key={index}
                  ref={(el) => (categoryRef.current[index] = el)}
                  selected={index === expandedMenuIndex}
                  onClick={() =>
                    handleMenuClick(
                      index,
                      storeDetails?.categories[index]?.categoryId || "",
                      storeDetails?.categories[index]?.items || []
                    )
                  }
                >
                  <Text
                    type={index === expandedMenuIndex ? "bold" : "regular"}
                  >{`${item?.categoryName}${
                    item?.count ? ` (${item.count})` : ``
                  }`}</Text>
                </CategoryCard>
              ))}
            </CategoryScrollerWrapper>
          </CategoryScrollerContainer>
          {getCategoryData()?.length > 0 && (
            <CategoryListingContainer>
              {isDesktopDevice()
                ? selectedCategoryItems?.map((item, index) => {
                    return (
                      <StoreListMenuFoodItem
                        key={index}
                        index={index}
                        item={item}
                        storeDetails={storeDetails?.shopDetails || {}}
                        setSelectedItem={(id, item) =>
                          handleFoodItemClick(id, item)
                        }
                        setSelectedItemId={setSelectedItemId}
                        setShowDetailModal={setShowDetailModal}
                        setShowCustomisationModal={setShowCustomisationModal}
                        setShowRepeatSelectionModal={
                          setShowRepeatSelectionModal
                        }
                        setRecommendationModal={setRecommendationModal}
                        setRecommendationList={setRecommendationList}
                        setShowMultiStoreCheckModal={
                          setShowMultiStoreCheckModal
                        }
                        setMultiStoreData={setMultiStoreData}
                        lastItem={index === selectedCategoryItems?.length - 1}
                        ageVerificationReq={item?.ageVerificationRequired}
                        setChangeRepeatSelectionItem={
                          setChangeRepeatSelectionItem
                        }
                      ></StoreListMenuFoodItem>
                    );
                  })
                : storeDetails?.categories?.map((category, index) => {
                    return (
                      <StoreListMenuItemWrapper
                        id={category.categoryId}
                        data-index={index}
                        ref={targetRef}
                        name={`id_${index}`}
                      >
                        <StoreListMenuItem
                          data-ref={index}
                          key={index}
                          number={index}
                          expanded={index === expandedMenuIndex}
                          items={category?.items || []}
                          categoryName={category?.categoryName || ""}
                          count={category?.count || 0}
                          storeDetails={storeDetails?.shopDetails || {}}
                          setSelectedItem={(id, item) =>
                            handleFoodItemClick(id, item)
                          }
                          setSelectedItemId={setSelectedItemId}
                          setShowDetailModal={setShowDetailModal}
                          setShowCustomisationModal={setShowCustomisationModal}
                          setShowRepeatSelectionModal={
                            setShowRepeatSelectionModal
                          }
                          setRecommendationModal={setRecommendationModal}
                          setRecommendationList={setRecommendationList}
                          setShowMultiStoreCheckModal={
                            setShowMultiStoreCheckModal
                          }
                          setMultiStoreData={setMultiStoreData}
                          setChangeRepeatSelectionItem={
                            setChangeRepeatSelectionItem
                          }
                        ></StoreListMenuItem>
                      </StoreListMenuItemWrapper>
                    );
                  })}
            </CategoryListingContainer>
          )}
          {showMoreInfoModal && (
            <ShowMoreInfoModal
              data={storeDetails?.shopDetails || {}}
              isDrawerOpen={showMoreInfoModal}
              setIsDrawerOpen={setShowMoreInfoModal}
            />
          )}
        </ContentContainer>
        <FloatingCart />
      </Wrapper>
    );
  } else {
    return <Loader />;
  }
};

const SearchIconComponent = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  bottom: 0px;
  right: 0px;
`;

const StoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export default StoreFront;
