import { useConfig } from "context/configContext";
import { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import moment from "util/momentWrapper";
import callAPI from "../../../../commons/callAPI";
import config, { channel } from "../../../../commons/config";
import { device, fetchQueryURL, hasAllValues, fetchStoreFrontURL } from "../../../../commons/util/helperFunctions";
import Util from "../../../../commons/util/util";
import Loader from "../../../../components/atoms/loader";
import Text from "../../../../components/atoms/Text";
import { NavContext } from "../../../../context/navContext";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import { getSessionStorage, setSessionStorage } from "../../../../util/storageUtil";
import BackArrowIcon from "../../assets/BackArrow.svg";
import FloatingCart from "../../components/molecules/FloatingCart";
import StoreListItem from "../../components/molecules/StoreListItem";
import TerminalSectorWrapper from "../../components/molecules/TerminalSectorWrapper";
import { getPageName } from "../../util/util";
import { colors } from "theme/colors";
import DirectoryCard from "pages/edpFSTR/components/molecules/directoryCard";
import { getAppConfig } from "commons/util/appConfigHelper";
import PushAlert from "components/atoms/pushAlert";
import { productDomain } from "../config/config";

const StoreListing = () => {
  const URL = window.location.href;
  const urlParts = [];
  const urlKey = '/store-listing'
  const history = useHistory();
  const useNav = useContext(NavContext);
  const { pushHistory } = useCustomNavigation();
  const { timezone } = useConfig();
  let data = getSessionStorage("productsData") || {};
  const [isLoading, setIsLoading] = useState(true);
  const [storeList, setStoreList] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [isDeliveryQrCode] = useState(
    getSessionStorage("qrCodeSource")
      ?.toLowerCase()
      ?.includes("deliver-to-gate")
  );

  useEffect(() => {
    if (!isDeliveryQrCode) {
      if (isMobile) {
        useNav.showHeaderGoBack();
      } else {
        useNav.hideHeaderGoBack();
      }
    } else {
      useNav.hideAllNavs();
    }
    fnbDataFallback();
    getStores();

    return () => {
      if (!isDeliveryQrCode) {
        useNav.showHeaderNavs();
        useNav.hideHeaderGoBack();
      } else {
        useNav.showAllNavs();
      }
    };
  }, []);


  const fnbDataFallback = () => {
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

  const getStores = async () => {
    try {
      let URLQueryParams = {};
      if(!data) URLQueryParams = fetchQueryURL(URL, urlParts, urlKey);
      if (
        (!URLQueryParams ||
          Object.keys(URLQueryParams).length === 0 ||
          hasAllValues(URLQueryParams)) &&
        (!data ||
          Object.keys(data).length === 0 ||
          hasAllValues(data))
      ) {
        PushAlert.error("Page is not loading, try later!");
      } else {
        let apiURL = `${config.api.products.getStores}`;
        const response = await callAPI.get(apiURL, {
          location: data?.terminal || URLQueryParams?.terminal || "",
          sector: data?.sector || URLQueryParams?.sector || "",
          section: data?.movementType || URLQueryParams?.section || "",
          supportedFulfillmentTypes:
            data?.deliveryOptions?.deliveryOption ||
            URLQueryParams?.supportedFulfillmentTypes ||
            "",
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
          domain: data?.domain || URLQueryParams?.domain || "",
          channel: channel,
          landingPage: getPageName(window.location.pathname, data?.domain),
          platform: getAppConfig("platform") || "",
        });
        const regResponse = await response.json();
        if (regResponse.status === 200) {
          const completeStores = regResponse?.data?.indoor?.concat(
            regResponse?.data?.outdoor
          );
          setStoreList(completeStores);
          setMetaData(regResponse.metadata);
          setIsLoading(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleStoreClick = (storeId, storeObj) => {
    const storeDetails = fetchStoreFrontURL(storeObj, storeId);

    Util.triggerMoEngageEvent("store_viewed", {
      store_id: storeId,
      store_name: storeObj?.storeDisplayName,
      terminal: storeObj?.terminal?.value,
      sector: storeObj?.sector?.value,
      movement_type: storeObj?.movementType?.value,
    });

    pushHistory(
      `/storefront/${storeDetails}?filterComponentId=${metaData.filterComponentId}`
    );
  };

  const handleGoBack = () => {
    if (history && history?.goBack()) {
      history.goBack();
    } else {
      window.location.href = '/';
    }
  };

  if (!isLoading) {
    return (
      <Wrapper>
        <SectionWrapper>
          <Container>
            <HeaderWrapper>
              <HeaderBackWrapper onClick={() => handleGoBack()}>
                {<BackArrow src={BackArrowIcon} />}
                <HeaderText>
                  <Text>Go Back</Text>
                </HeaderText>
              </HeaderBackWrapper>
            </HeaderWrapper>
            <HeaderTextWrapper>
              <Text type="bold" variant="heading">
                {storeList?.length} restaurants to explore
              </Text>
            </HeaderTextWrapper>
          </Container>
          <ContentWrapper>
            <StoreListContainer>
              {storeList?.map((store, index) => {
                return (
                  <DirectoryCard
                    key={index}
                    data={store}
                    handleStoreClick={() => handleStoreClick(store._id, store)}
                  ></DirectoryCard>
                );
              })}
            </StoreListContainer>
          </ContentWrapper>
        </SectionWrapper>
        <FloatingCart />
      </Wrapper>
    );
  } else {
    return <Loader />;
  }
};

const HeaderTextWrapper = styled.div`
  font-size: 26px;
  color: ${colors?.text?.black200};
  line-height: 31px;
`;

const SectionWrapper = styled.div`
  padding: 0px;

  @media ${device.laptop}, ${device.tablet} {
    padding: 36px;
  }
`;

const ContentWrapper = styled.div`
  padding: 0px 24px 89px 24px;

  @media ${device.laptop} {
    padding: 0px 136px 89px 136px;
  }

  @media ${device.laptopL} {
    padding: 0px 136px 89px 136px;
  }
`;
const Wrapper = styled.div``;
export const HeaderWrapper = styled.section`
  width: fit-content;
  background-color: #fff;
`;
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  height: auto;
  align-items: flex-start;
  padding: 24px 24px 0px 24px;

  @media ${device.laptop}, ${device.tablet} {
    flex-direction: row;
    align-items: center;
    padding: 0px;
  }
`;
export const HeaderBackWrapper = styled.div`
  width: fit-content;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0px 10px;
  border: 1px solid #5d5d5d;
  border-radius: 6px;
  cursor: pointer;

  @media ${device.laptop} {
    padding: 0px 20px;
    height: 52px;
  }
`;
export const BackArrow = styled.img`
  width: 16px;
  height: 16px;
`;
export const HeaderText = styled.div`
  font-size: 12px;
  width: max-content;
  color: ${colors?.text?.gray200};

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
const StoreListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  gap: 32px 0px;

  @media ${device.laptop} {
    flex-wrap: wrap;
    flex-direction: row;
    margin-top: 40px;
    gap: 32px;
  }
`;

export default StoreListing;
