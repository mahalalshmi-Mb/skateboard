import moment from "util/momentWrapper";
import callAPI from "../../../commons/callAPI";
import config from "../../../commons/config";
import PushAlert from "../../../components/atoms/pushAlert";

export const getStores = async (storeId, dateTimeFormat) => {
  try {
    const apiURL = `${config.api.products.getStores}`;
    const apiResponse = await callAPI.get(apiURL, {
      isRetail: true,
      location: "",
      sector: "",
      section: "",
      supportedFulfillmentTypes: "",
      orderDateTime: moment(new Date(), "UTC", "UTC").format(),
    });
    const regResponse = await apiResponse.json();
    if (regResponse.status === 200 || regResponse.status === 201) {
      const completeStores = regResponse.data.indoor.concat(
        regResponse.data.outdoor
      );
      const currentStore = completeStores.filter(
        (storeData) => storeData._id === storeId
      );

      if (currentStore.length > 0) {
        return currentStore[0];
      } else {
        PushAlert.info("Store Details not available!!");
      }
    } else {
      PushAlert.error("Something went wrong!! Please refresh");
    }
  } catch (e) {
    PushAlert.error("Something went wrong!! Please refresh");
    console.log(e);
  }
};

export const getOrderSummaryResponseData = async (dineInRefId) => {
  try {
    if (dineInRefId) {
      let apiURL = config.api.payment.orderSummaryV2;
      let apiResponse = await callAPI.get(apiURL, {
        orderId: dineInRefId,
      });

      let regResponse = await apiResponse.json();
      if (
        regResponse.statusCode === 200 ||
        regResponse.statusCode === 201 ||
        regResponse.status === 200 ||
        regResponse.status === 201
      ) {
        return regResponse?.data;
      } else {
        PushAlert.error("Something went wrong!! Please refresh");
      }
    }
  } catch (error) {
    PushAlert.error("Something went wrong!! Please refresh");
    console.log(error);
  }
};
