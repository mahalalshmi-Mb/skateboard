import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import callAPI from "../../commons/callAPI";
import config, { channel } from "../../commons/config";
import { isDesktopDevice } from "../../commons/util/helperFunctions";
import Util from "../../commons/util/util";
import Loader from "../../components/atoms/loader";
import PushAlert from "../../components/atoms/pushAlert";
import { NavContext } from "../../context/navContext";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { triggerCategorySelected } from "../../util/analytics/cdp/DutyFree";
import { View_Item_Event } from "../../util/FirebaseAnalyticsUtil";
import { setSessionStorage } from "../../util/storageUtil";
import CardContainerController from "../edpFSTR/productComponents/organisms/CardContainerController";
import CardController from "../edpFSTR/productComponents/organisms/CardController";
import CollectionContainer from "../edpFSTR/productComponents/organisms/CollectionContainer";
import "./laxHomePage.css";
import { useConfig } from "context/configContext";

function LaxHomepage() {
  const useNav = useContext(NavContext);
  const { landingPageUrl } = useConfig();
  const { pushHistory, replaceHistory } = useCustomNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [landingPageConstruct, setLandingPageConstruct] = useState([]);
  const [landingPageData, setLandingPageData] = useState({});
  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
  };

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
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    checkLandingPage();
    useNav.showHeaderNavs();
    useNav.showFooterNavs();
    useNav.hideBottomNavs();
  }, []);

  useEffect(() => {
    if (landingPageUrl && landingPageUrl === "/") {
      getPageLayout();
    }
  }, [window.location.pathname]);

  const checkLandingPage = () => {
    if (landingPageUrl && landingPageUrl !== "/") {
      replaceHistory(landingPageUrl);
    }
  };

  const getPageLayout = async () => {
    try {
      let apiURL = config.api.products.landingPageConstruct;
      const response = await callAPI.get(apiURL, {
        channel: channel,
        page: "Home Page",
      });
      const regResponse = await response.json();
      if (regResponse.status === 200) {
        setLandingPageConstruct(regResponse.data);
        setIsLoading(false);
        regResponse?.data?.sections?.forEach((x) =>
          getPageData(
            x.displayCollectionId,
            x?.sectionComponent?.noOfItemsToShow,
            x.filterComponentId,
            {}
          )
        );
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
        let limitedItems = regResponse?.data;
        setLandingPageData((oldValue) => {
          return { ...oldValue, [regResponse?.data?._id]: limitedItems };
        });
      }
    } catch (e) {
      console.log(e);
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
          const storeDetails = `${paramsSourceObj?.storeDisplayName}-${paramsSourceObj?.terminal?.value}-${paramsSourceObj?.sector?.value}-${paramsSourceObj?.movementType?.value}-${id}`;
          const redirectLink = `${found.actionUrl}/${storeDetails}?${queryParams}`;

          Util.triggerMoEngageEvent("store_viewed", {
            store_id: id,
            store_name: paramsSourceObj?.storeDisplayName,
            terminal: paramsSourceObj?.terminal?.value,
            sector: paramsSourceObj?.sector?.value,
            movement_type: paramsSourceObj?.movementType?.value,
          });

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
      }
    }
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
          bannerCarouselSettings={bannerCarouselSettings}
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

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <Wrapper>
        {landingPageConstruct?.sections?.map((item, index) => (
          <CollectionContainer
            key={index}
            collectionType={
              item?.sectionComponent?.sectionType === "OrderContainer"
            }
            style={{
              background:
                item?.sectionComponent?.sectionType === "AllBrandsBox"
                  ? "transparent"
                  : item?.sectionComponent?.backgroundColor,
              padding:
                item?.sectionComponent?.sectionType === "HorizontalScroller"
                  ? isDesktopDevice()
                    ? "0px 100px"
                    : "0px 16px"
                  : "0px",
              margin:
                index === landingPageConstruct?.sections?.length - 1
                  ? "0px"
                  : index !== 0
                  ? "56px 0px"
                  : "0px",
            }}
          >
            <CardContainerController
              sectionType={item?.sectionComponent?.sectionType}
              data={
                Array.isArray(landingPageData[item?.displayCollectionId]?.items)
                  ? landingPageData[item?.displayCollectionId]?.items
                  : landingPageData[item?.displayCollectionId]?.items?.data
              }
              sectionData={item}
              items={landingPageData[item?.displayCollectionId]?.items}
              settings={settings}
              cardType={item?.sectionComponent?.cardComponent?.cardType}
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
            >
              {renderCardController(item?.displayCollectionId, item)}
            </CardContainerController>
          </CollectionContainer>
        ))}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  margin-top: -15px;
`;

export default LaxHomepage;
