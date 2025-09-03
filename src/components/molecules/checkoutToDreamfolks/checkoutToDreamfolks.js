import moment from "util/momentWrapper";
import callAPI from "../../../commons/callAPI";
import config from "../../../commons/config";
import PushAlert from "../../../components/atoms/pushAlert";

export const checkoutToDreamfolks = async () => {
  try {
    let data = DreamfolksCheckoutData;
    data.items[0].items[0].serviceDate = moment(new Date(), "UTC", "UTC").format();
    data.items[0].items[0].serviceDateTime = moment(new Date(), "UTC", "UTC").format();
    data.items[0].items[0].deliveryOptions.deliveryTime = moment(new Date(), "UTC", "UTC").format();

    let apiResponse = await callAPI.post(
      config.api.checkout.checkout,
      data,
      false,
      {
        stateless: "Y",
      }
    );

    let regResponse = await apiResponse.json();

    if (
      "success" !== regResponse.type ||
      201 === regResponse.status ||
      200 === regResponse.status
    ) {
      if (!window.ReactNativeWebView) {
        window.open(regResponse.data.redirectUrl, "_blank");
      } else {
        window.location.href = regResponse.data.redirectUrl;
      }
    } else {
      PushAlert.error("Feature not working right now, try later!");
    }
  } catch (error) {
    PushAlert.error("Feature not working right now, try later!");
  }
};

const DreamfolksCheckoutData = {
  items: [
    {
      storeId: "",
      storeNm: "Lounge",
      merchantId: "dreamfolks",
      movementType: "",
      sector: "",
      terminal: "",
      domain: "Lounge",
      fulfilmentType: "takeaway",
      items: [
        {
          itemId: "",
          productSKU: "",
          productImageURL: "/lounge/T1-domestic-adult.webp",
          itemLabel: "Lounge Booking",
          itemDescription:
            "Lounge access - entry valid up to 3 hours prior to the flight departure",
          itemPrice: 0,
          itemQuantity: 1,
          itemType: "stateless",
          flightId: "",
          flightUid: "",
          serviceDate: "2024-09-18", //current datetime
          serviceDateTime: "2024-09-18 18:30:00", //current datetime
          addOn: [],
          deliveryOptions: {
            deliveryTime: "2024-09-18 18:30:00", //current datetime
            deliveryOption: "lounge at store",
          },
          storecode: "",
          storename: "Lounge",
          movementType: "",
          terminal: "",
          fulfilmentType: "takeaway",
          domain: "Lounge",
          sector: "",
          airport: {
            iata: "BLR",
            icao: "VOBL",
          },
        },
      ],
    },
  ],
  promo: "",
  paymentGateWayService: "dreamfolks",
  paymentGateway: "dreamfolks",
  posAppId: "online",
  channel: "online",
  input: null,
  bookingSource: "edp-web",
  payoption: "now",
  refId: "",
  source: "",
};
