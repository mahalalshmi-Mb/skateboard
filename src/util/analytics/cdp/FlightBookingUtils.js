import Util from "../../../commons/util/util";
import numberToIndCurr from "../../../pages/flight-booking/commons/util/priceUtil";
import { calculateFare } from "../../../pages/flight-booking/commons/util/priceUtil";
import { getLocalStorage } from "../../storageUtil";

export const triggerSortSelected = (type) => {
  const formStateData = getFormStateData();
  Util.triggerMoEngageEvent(
    "sort_flight_clicked",
    {
      type: type,
    },
    formStateData
  );
};

export const triggerFilterSelected = (type) => {
  const formStateData = getFormStateData();
  Util.triggerMoEngageEvent(
    "filter_flight_clicked",
    {
      type: type,
    },
    formStateData
  );
};

export const triggerFilterTabChanged = (selectedTab) => {
  const formStateData = getFormStateData();
  Util.triggerMoEngageEvent(
    "flight_filter_tab_changed",
    {
      tab: selectedTab,
    },
    formStateData
  );
};

export const triggerResetFilter = () => {
  const formStateData = getFormStateData();
  Util.triggerMoEngageEvent("flight_reset_filter_clicked", formStateData);
};

export const triggerApplyFilter = (filterState, type) => {
  const formStateData = getFormStateData();

  const aircraftSelected = Array.from(filterState?.aircraft);

  const stops = ["0 Stop", "1 Stop", "2 Stop"];
  const stopsSelected = stops.filter(
    (stop, index) => filterState?.stops[index]
  );

  Util.triggerMoEngageEvent(
    "flight_apply_filter_clicked",
    {
      airlinesSelected: aircraftSelected,
      arrivalTime: filterState?.arrivalTime,
      departureTime: filterState?.departureTime,
      maxPriceRange: filterState?.priceRange?.max,
      minPriceRange: filterState?.priceRange?.min,
      stopsSelected: stopsSelected,
      type: type,
    },
    formStateData
  );
};

export const triggerViewFareAndDetails = (eventData) => {
  const formStateData = getFormStateData();
  Util.triggerMoEngageEvent(
    "view_fare_and_details_clicked",
    formStateData,
    eventData
  );
};

export const getEventDataFromFlightDetails = (flightDetails) => {
  const resultLength = flightDetails?.length;
  let arrivalData = flightDetails?.aa;
  let departureData = flightDetails?.da;
  let arrivalTime = flightDetails?.at;
  let departureTime = flightDetails?.dt;
  let airline = flightDetails?.fD?.aI?.name;
  let flightDuration = flightDetails?.duration;

  if (flightDetails?.length >= 1) {
    departureData = flightDetails[0]?.da;
    arrivalData = flightDetails[resultLength - 1]?.aa;
  } else {
    arrivalData = flightDetails?.aa;
    departureData = flightDetails?.da;
  }

  if (flightDetails?.length >= 1) {
    arrivalTime = flightDetails[resultLength - 1]?.at;
    departureTime = flightDetails[0]?.dt;
    airline = flightDetails[resultLength - 1]?.fD?.aI?.name;
    flightDuration = flightDetails[0]?.duration;
  } else {
    arrivalTime = flightDetails?.at;
    departureTime = flightDetails?.dt;
    airline = flightDetails?.fD?.aI?.name;
    flightDuration = flightDetails?.duration;
  }

  return {
    arrivalCity: arrivalData?.city,
    arrivalCode: arrivalData?.code,
    arrivalCountry: arrivalData?.country,
    arrivalTerminal: arrivalData?.terminal,
    arrivalTime: arrivalTime,
    departureCity: departureData?.city,
    departureCode: departureData?.code,
    departureCountry: departureData?.country,
    departureTerminal: departureData?.terminal,
    departureTime: departureTime,
    flightDuration: flightDuration,
    airline: airline,
  };
};

export const triggerBookFlight = (
  item,
  selectedFare,
  passengers,
  mgtFee,
  type
) => {
  const eventData = getEventDataFromFlightDetails(item);
  const formStateData = getFormStateData();

  if (type) {
    eventData["type"] = type;
  }

  if (selectedFare && passengers) {
    eventData["grandTotal"] = numberToIndCurr(
      calculateFare(selectedFare, passengers, mgtFee)
    );
  }

  Util.triggerMoEngageEvent("book_flight_clicked", eventData, formStateData);
};

export const triggerFlightDetailsViewed = (item, detailType) => {
  const eventData = getEventDataFromFlightDetails(item);
  const formStateData = getFormStateData();

  if (detailType) {
    eventData["detailType"] = detailType;
  }

  Util.triggerMoEngageEvent("flight_details_viewed", eventData, formStateData);
};

const getEventDataFromBookingDetail = (detail) => {
  return {
    source: detail?.sourceCode,
    destination: detail?.destinationCode,
    cabinClass: detail?.cabinClass,
    searchType: detail?.searchType,
    isDomestic: detail?.isDomestic,
    isOneWay: detail?.isOneWay,
    isDomesticReturn: detail?.isDomesticReturn,
    bookingId: detail?.bookingId,
    totalAmount: detail?.totalAmount,
    convFee: detail?.convFee,
  };
};

export const triggerPaymentInitiated = (payload) => {
  const eventData = getEventDataFromBookingDetail(payload);
  const formStateData = getFormStateData();

  Util.triggerMoEngageEvent(
    "flight_booking_payment_initiated",
    eventData,
    formStateData
  );
};

export const triggerPaymentSuccess = (bookingDetails, invoiceId) => {
  const eventData = getEventDataFromBookingDetail(bookingDetails);
  const formStateData = getFormStateData();

  if (invoiceId) {
    eventData["orderId"] = invoiceId;
  }
  eventData["send_to"] = "AW-16583852778/XaHgCNTP9LsZEOqF5uM9";
  Util.triggerGTMConversion(
    "flight_booking_payment_success",
    "payment_success",
    eventData
  );
  Util.triggerMoEngageEvent(
    "flight_booking_payment_success",
    eventData,
    formStateData
  );
};

export const triggerPaymentFailed = (
  response,
  invoiceId,
  isRebooking = false,
  reBookingType = null
) => {
  const eventData = {
    reason: response?.message?.errorMsg,
    totalAmount: response?.data?.payments?.amount,
    orderId: invoiceId,
  };

  if (reBookingType) {
    eventData["reBookingType"] = reBookingType;
  }

  const formStateData = getFormStateData();

  const eventName = isRebooking
    ? "flight_rebooking_payment_failed"
    : "flight_booking_payment_failed";

  Util.triggerMoEngageEvent(eventName, eventData, formStateData);
};

export const getFormStateData = () => {
  const formState = getLocalStorage("formState");
  if (!formState) {
    return {};
  }

  let journey = !formState?.endDate ? "Onward" : "Return";
  let type =
    formState?.departPlace.country === "India" &&
    formState?.arrivalPlace.country === "India"
      ? "Domestic"
      : "International";
  return {
    from: formState?.departPlace?.city,
    to: formState?.arrivalPlace?.city,
    departDate: formState?.startDate,
    departDateMs: new Date(formState?.startDate).getTime(),
    returnDate: formState?.endDate,
    returnDateMs: formState?.endDate
      ? new Date(formState.endDate).getTime()
      : null,
    fareType: formState?.fareType,
    travelClass: formState?.flightClass,
    adults: formState?.passengers?.adult,
    childrens: formState?.passengers?.child,
    infants: formState?.passengers?.infant,
    journey: journey,
    type: type,
  };
};
