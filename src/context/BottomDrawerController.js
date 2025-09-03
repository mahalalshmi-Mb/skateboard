import React, { useEffect, useState } from "react";
import callAPI from "../commons/callAPI";
import config from "../commons/config";
import {
  getItemTypeForIcon,
  getOrderTypeForTitle,
} from "../util/Util";

const BottomDrawerControllerContext = React.createContext();

const BottomDrawerControllerProvider = (props) => {
  //Cabs
  const [showCabs, setShowCabs] = useState(false);

  //RatingFeedback
  const [showFeedbackRating, setShowFeedbackRating] = useState(false);
  const [feedbackRatingData, setFeedbackRatingData] = useState({});

  //RfqFeedback
  const [showFeedbackRfq, setShowFeedbackRfq] = useState(false);
  const [feedbackRfqData, setFeedbackRfqData] = useState();

  //thankYouFeedback
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFeedbackThanks, setShowFeedbackThanks] = useState(false);

  useEffect(() => {
    if (feedbackRatingData?.rating) {
      setSelectedRating(feedbackRatingData.rating);
    }
  }, [feedbackRatingData]);

  const onHomepageLoad = () => {
    getPendingFeedbackRating();
  };

  //**Handle Rating Feedback */
  const getPendingFeedbackRating = async (itemId, orderId) => {
    try {
      let apiURL = config.api.npsFeedback.pendingItem;
      let apiResponse;
      if (itemId && orderId) {
        apiResponse = await callAPI.get(apiURL, { itemId, orderId });
      } else if (!itemId && !orderId) {
        apiResponse = await callAPI.get(apiURL);
      }
      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        if (regResponse.data?.length > 0) {
          const item = regResponse.data[regResponse.data.length - 1];
          const res = await getPendingFeedbackTitle(
            item.orderId,
            item.suborderId || item.storeId,
            item.storeId,
            item.storeName,
            item.itemId,
            item.itemName
          );
          if (res) {
            handleShowFeedbackRating();
          } else {
            throw Error();
          }
        } else {
          throw Error();
        }
      } else {
        throw Error();
      }
    } catch (e) {
      console.log(e);
      setShowCabs(true);
    }
  };

  //**Call Past Booking to get title */
  const getPendingFeedbackTitle = async (
    orderId,
    subOrderId,
    storeId,
    storeName,
    itemId,
    itemName
  ) => {
    let apiURL = `${config.api.myOrders.pastOrders}/${orderId}/${subOrderId}`;
    let pastApiResponse = await callAPI.patch(apiURL, {
      pageNo: 0,
      limit: 5,
    });
    let pastRegResponse = await pastApiResponse.json();
    if (pastRegResponse.status === 200) {
      let subOrder = pastRegResponse?.data?.children;
      let storeCategory = "";
      let orderCategory = pastRegResponse.data.header.find(
        (item) => item.display === "Order Category"
      ).value;
      const foundStoreCategory = subOrder[0]?.header.find(
        (sub) => sub.key === "storeInfo.domain"
      );
      if (foundStoreCategory) {
        storeCategory = foundStoreCategory.value;
      }
      let found = {};
      subOrder[0]?.children.forEach((subItem) => {
        subItem?.header?.forEach((y) => {
          if (y.value === itemId) {
            found = subItem?.header;
          }
        });
      });
      if (found) {
        const hasFb = found?.find(
          (x) => x.display === "Options" && x.key === "hasGivenFeedback"
        );
        if (hasFb) {
          const itemFb = hasFb?.value?.find((x) => x.type === "item");
          if (itemFb) {
            let reqObj = {};
            let orderType;

            //get flag which determines icon
            let itemType = getItemTypeForIcon(itemFb.value.title.toLowerCase());

            //get flag which determines f&b order type text in title
            if (itemType === "food-feedback-title") {
              let itemDeliveryOption = subOrder[0]?.details.find(
                (item) =>
                  item.display === "Delivery" &&
                  item.key === "delivery" &&
                  item.group === "Merchant"
              ).value.itemDeliveryOption;

              orderType = getOrderTypeForTitle(itemDeliveryOption);
            }

            //define object
            let dataObj = {
              ...itemFb.value,
              orderId: orderId,
              itemId: itemId,
              storeId: storeId,
              itemName: itemName,
              storeName: storeName,
              storeCategory: storeCategory,
              orderCategory,
              itemTypeForIcon: itemType,
              orderType,
            };
            let arr = [];
            arr.push(dataObj);
            reqObj.data = arr;
            reqObj.rating = 0;
            setFeedbackRatingData(reqObj);
          }
          if (itemFb?.value?.title) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  };

  const handleShowFeedbackRating = () => {
    setShowFeedbackRating(true);

    //Cabs
    setShowCabs(false);
  };

  const handleHideFeedbackRating = () => {
    setShowFeedbackRating(false);
    setFeedbackRatingData({});

    //Cabs
    setShowCabs(true);
  };

  //**Handle RFQ Feedback */
  const getPendingFeedbackRfq = async (
    data,
    baseRating,
    setBlurbsAreLoading,
    handleSave
  ) => {
    let itemId = data.data[0].itemId;
    let storeId = data.data[0].storeId;
    let storeCategory = data.data[0].storeCategory;
    let orderCategory = data.data[0].orderCategory;

    try {
      let apiURL = config.api.npsFeedback.pendingRapidfire;
      let apiResponse;

      apiResponse = await callAPI.get(apiURL, {
        itemId,
        storeId,
        storeCategory,
        baseRating,
        tag: orderCategory,
        type: "item",
      });

      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        if (regResponse.data && regResponse.metadata) {
          setFeedbackRfqData({
            data: regResponse.data,
            metadata: regResponse.metadata,
          });
          handleShowFeedbackRfq();
        } else {
          handleSave && handleSave(baseRating);
          handleShowFeedbackThanks();
        }
      } else {
        handleSave && handleSave(baseRating);
        handleShowFeedbackThanks();
      }
    } catch (e) {
      console.log(e);
      handleSave && handleSave(baseRating);
      handleShowFeedbackThanks();
    }

    setBlurbsAreLoading && setBlurbsAreLoading(false);
  };

  const updateRfq = async (
    itemId,
    storeId,
    lastQuestionRef,
    nextQuestionRef,
    depth
  ) => {
    try {
      let apiURL = config.api.npsFeedback.pendingRapidfire;
      let apiResponse;

      apiResponse = await callAPI.get(apiURL, {
        itemId,
        storeId,
        lastQuestionRef,
        nextQuestionRef: nextQuestionRef || "",
        depth,
      });

      let regResponse = await apiResponse.json();
      if (regResponse.status === 200 && regResponse.data) {
        setFeedbackRfqData({
          data: regResponse.data,
          metadata: regResponse.metadata,
        });
      } else {
        throw Error();
      }
    } catch (e) {
      console.log(e);
      handleShowFeedbackThanks();
    }
  };

  const handleShowFeedbackRfq = () => {
    setShowFeedbackRating(false);

    setShowFeedbackRfq(true);

    //Cabs
    setShowCabs(false);
  };

  const handleHideFeedbackRfq = () => {
    setFeedbackRatingData({});

    setShowFeedbackRfq(false);
    setFeedbackRfqData({});

    //Cabs
    setShowCabs(true);
  };

  //**Handle Thanks after Feedback */
  const handleShowFeedbackThanks = () => {
    setShowFeedbackRating(false);
    setFeedbackRatingData({});

    setShowFeedbackRfq(false);
    setFeedbackRfqData({});

    setShowFeedbackThanks(true);

    //Cabs
    setShowCabs(false);
  };

  const handleHideFeedbackThanks = () => {
    setShowFeedbackRating(false);
    setFeedbackRatingData({});

    setShowFeedbackRfq(false);
    setFeedbackRfqData({});

    setShowFeedbackThanks(false);

    setShowCabs(true);
  };

  const setFeedbackRating = (obj) => {
    setFeedbackRatingData(obj);
  };

  //util-functions

  return (
    <BottomDrawerControllerContext.Provider
      value={{
        showCabs,
        setShowCabs,
        showFeedbackRating,
        setShowFeedbackRating,
        feedbackRatingData,
        showFeedbackRfq,
        setShowFeedbackRfq,
        feedbackRfqData,
        onHomepageLoad,
        getPendingFeedbackRating,
        handleShowFeedbackRating,
        handleHideFeedbackRating,
        getPendingFeedbackRfq,
        handleShowFeedbackRfq,
        handleHideFeedbackRfq,
        showFeedbackThanks,
        setShowFeedbackThanks,
        handleShowFeedbackThanks,
        handleHideFeedbackThanks,
        updateRfq,
        setFeedbackRating,
        selectedRating,
      }}
    >
      {props.children}
    </BottomDrawerControllerContext.Provider>
  );
};

export { BottomDrawerControllerContext, BottomDrawerControllerProvider };
