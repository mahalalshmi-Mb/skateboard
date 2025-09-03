import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useParams, useHistory } from "react-router-dom";
import styled from "styled-components";
import moment from "util/momentWrapper";
import SearchIcon from "../../../../assets/images/header/search.png";
import callAPI from "../../../../commons/callAPI";
import config from "../../../../commons/config";
import { getAppConfig } from "../../../../commons/util/appConfigHelper";
import { device } from "../../../../commons/util/helperFunctions";
import Util from "../../../../commons/util/util";
import { NavContext } from "../../../../context/navContext";
import { getSessionStorage } from "../../../../util/storageUtil";
import SearchInput from "../../components/molecules/SearchInput";
import StoreListMenuFoodItem from "../../components/molecules/StoreListMenuFoodItem";
import ItemCustomizationModal from "../../components/organism/ItemCustomizationModal";
import ItemDetailModal from "../../components/organism/ItemDetailModal";
import RepeatSelectionModal from "../../components/organism/RepeatSelectionModal";
import { useConfig } from "context/configContext";
import { H6, T5 } from "theme/globalStyleSheet";
import NoResImage from "../../../../assets/images/searchResult/noResults.svg";
import DefaultSearchResImage from "../../../../assets/images/searchResult/defaultImage.svg";
import Text from "components/atoms/Text";
import GoBack from "pages/edpFSTR/components/molecules/GoBack";

function SearchResult() {
  const useNav = useContext(NavContext);
  const { timezone } = useConfig();
  const params = useParams();
  const inputRef = useRef();
  const history = useHistory();
  const [storeId] = useState(params.storeId);
  const [searchResults, setSearchResults] = useState(null);

  const [selectedItem, setSelectedItem] = useState({});
  const [selectedItemId, setSelectedItemId] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCustomisationModal, setShowCustomisationModal] = useState(false);
  const [showRepeatSelectionModal, setShowRepeatSelectionModal] =
    useState(false);
  const [changeRepeatSelection, setChangeRepeatSelection] = useState(false);
  const [changeRepeatSelectionItem, setChangeRepeatSelectionItem] = useState(
    {}
  );

  const throttling = useRef(false);

  const [dineInSessionData] = useState(getSessionStorage("dine-in"));
  const [isDineIn] = useState(dineInSessionData?.storeId || "" !== "");
  const [isDeliveryQrCode] = useState(
    getSessionStorage("qrCodeSource")
      ?.toLowerCase()
      ?.includes("deliver-to-gate")
  );

  useEffect(() => {
    if (isDineIn || isDeliveryQrCode) {
      useNav.hideAllNavs();
    } else {
      useNav.hideFooterNavs();
      useNav.hideBottomNavs();
      useNav.showHeaderGoBack();
      useNav.hideHeaderGlobalSearch();
    }

    if (inputRef.current) {
      inputRef.current?.focus();
    }
    return () => {
      if (isDineIn || isDeliveryQrCode) {
        useNav.showAllNavs();
      } else {
        useNav.showFooterNavs();
        useNav.showBottomNavs();
        useNav.hideHeaderGoBack();
        useNav.showHeaderGlobalSearch();
      }
    };
  }, [showDetailModal, showCustomisationModal, showRepeatSelectionModal]);

  const handleThrottleSearch = () => {
    if (throttling.current) {
      return;
    }
    if (!inputRef.current.value.trim()) {
      setSearchResults(null);
      return;
    }
    throttling.current = true;
    setTimeout(async () => {
      throttling.current = false;
      try {
        let data = getSessionStorage("productsData");
        let apiURL = `${config.api.products.productSearch}`;
        let apiResponse = await callAPI.post(apiURL, {
          searchEle: inputRef?.current?.value?.trim(),
          id: storeId,
          location: data?.terminal,
          sector: data?.sector,
          section: data?.movementType,
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
          timezone: timezone,
          bookingSource: getAppConfig("CALL_PROMO_API")
            ? Util.getBookingSource()
            : "",
        });
        let regResponse = await apiResponse.json();
        if (regResponse.status === 200) {
          if (inputRef?.current?.value?.trim() === "") {
            setSearchResults(regResponse?.data || null);
          } else {
            setSearchResults(regResponse?.data || []);
          }
          Util.triggerMoEngageEvent("product_searched", {
            query: inputRef.current.value,
            store_id: storeId,
            terminal: data?.terminal,
            sector: data?.sector,
            movement_type: data?.movementType,
            fulfilment_type: data?.deliveryOptions?.deliveryOption,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }, 600);
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

  const handleGoBack = () => {
    history.goBack();
  };

  const handleItemCustomisationHideClick = () => {
    setShowCustomisationModal(false);
    if (!isDeliveryQrCode) {
      showHeaders();
    }
  };

  const handleRepeatSelectionHideClick = () => {
    setShowRepeatSelectionModal(false);
    if (!isDeliveryQrCode) {
      showHeaders();
    }
  };

  const handleFoodItemClick = (id, item) => {
    setSelectedItem(item);
    setSelectedItemId(id);
    setShowCustomisationModal(true);
    useNav.hideAllNavs();
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
            <Text>Search for quick meals, snacks, and drinks.</Text>
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

  return (
    <SearchPageWrapper>
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
          onModalHide={() => handleItemCustomisationHideClick()}
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
          onModalHide={() => handleRepeatSelectionHideClick()}
          setSelectedItemId={setSelectedItemId}
          setShowCustomisationModal={setShowCustomisationModal}
          showRepeatSelectionModal={showRepeatSelectionModal}
          setShowRepeatSelectionModal={setShowRepeatSelectionModal}
          setChangeRepeatSelection={setChangeRepeatSelection}
          setChangeRepeatSelectionItem={setChangeRepeatSelectionItem}
        ></RepeatSelectionModal>
      )}
      <ContentContainer>
        <SearchWrapper>
          <GoBack
            onClick={() => handleGoBack()}
            mobileHeight={"44px"}
            desktopHeight={"44px"}
          />
          <SearchInput
            width={"100%"}
            height={"44px"}
            searchIcon={SearchIcon}
            iconWidth={"20px"}
            iconHeight={"20px"}
            handleClick={() => null}
            inputRef={inputRef}
            handleChange={handleThrottleSearch}
          />
        </SearchWrapper>
        {searchResults?.length > 0 ? (
          inputRef?.current?.value && (
            <SearchResultsContainer>
              {searchResults?.map((item, index) => (
                <StoreListMenuFoodItem
                  key={index}
                  item={item}
                  index={index}
                  setSelectedItem={() => handleFoodItemClick(item._id, item)}
                  setSelectedItemId={setSelectedItemId}
                  setShowDetailModal={setShowDetailModal}
                  setShowCustomisationModal={setShowCustomisationModal}
                  setShowRepeatSelectionModal={setShowRepeatSelectionModal}
                />
              ))}
            </SearchResultsContainer>
          )
        ) : (
          <NoResultsContainer>{searchNoResView()}</NoResultsContainer>
        )}
      </ContentContainer>
    </SearchPageWrapper>
  );
}

const SearchPageWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  width: 100%;
  padding: 24px;

  @media ${device.laptop} {
    padding: 24px 120px 48px 120px;
  }

  @media ${device.laptopL} {
    padding: 24px 136px 48px 136px;
  }
`;

const SearchResultsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media ${device.laptop} {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 60px 32px;
    padding-top: 32px;
  }
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
const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 18px;

  @media ${device.laptop}, ${device.tablet} {
    gap: 24px;
  }
`;

export default SearchResult;
