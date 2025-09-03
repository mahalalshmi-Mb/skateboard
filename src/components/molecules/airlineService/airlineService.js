import ExternalsManager from "./ExternalsManager";
import {
  GET_AIRLINE_CODES,
  GET_AIRPORT_DATA,
  GET_COUNTRY_CODE,
  GET_FARE_N_CLASS,
  GET_FARE_RULE,
  GET_SEARCH_FLIGHT,
} from "./endpoints";
import {
  getDateByDDMMYYYYFormate
} from "./dateTimeUtil";
import Pako from "pako";

const getAirportData = async (val = "") => {
  let payload = { prefix: val };
  let response = await ExternalsManager?.API.post(GET_AIRPORT_DATA, payload);
  if (response?.type === "failure") {
    window.alert(`Status Code: ${response.status}\nMessage: ${response.message}`);
  } else {
    return response?.data;
  }
};

const getFareRuleByPriceId = async (id) => {
  return ExternalsManager?.API.post(GET_FARE_RULE, {
    id,
    flowType: "SEARCH",
  });
};

const getFlightClassData = async () => {
  let payload = { type: "cc" };
  let response = await ExternalsManager?.API.post(GET_FARE_N_CLASS, payload);
  if (response?.type === "failure") {
    window.alert(`Status Code: ${response.status}\nMessage: ${response.message}`);
  } else {
    return response?.data;
  }
};

const getFareTypeData = async () => {
  let payload = { type: "pft" };
  let response = await ExternalsManager?.API.post(GET_FARE_N_CLASS, payload);
  if (response?.type === "failure") {
    window.alert(`Status Code: ${response.status}\nMessage: ${response.message}`);
  } else {
    return response?.data;
  }
};

const getCountryCode = async () => {
  let payload = {};
  let response = await ExternalsManager?.API.post(GET_COUNTRY_CODE, payload);
  if (response?.type === "failure") {
    window.alert(`Status Code: ${response.status}\nMessage: ${response.message}`);
  } else {
    return response?.data;
  }
};

const getAirlineCodes = async () => {
  let payload = {};
  let response = await ExternalsManager?.API.get(GET_AIRLINE_CODES, payload);
  if (response?.type === "failure") {
    const airlines = [
      {
        code: "I5",
      },
      {
        code: "AI",
      },
      {
        code: "9I",
      },
      {
        code: "IX",
      },
      {
        code: "S5",
      },
      {
        code: "6E",
      },
      {
        code: "SG",
      },
      {
        code: "UK",
      },
      {
        code: "H1",
      },
    ];
    return airlines;
  } else {
    return response?.data;
  }
};

const getFlightData = async (
  depCode,
  arrCode,
  passengers,
  fareType,
  flightClass,
  startDate,
  endDate = null,
  airlineCode,
  isCompressed = false
) => {
  let routeInfos = [
    {
      fromCityOrAirport: {
        code: depCode,
      },
      toCityOrAirport: {
        code: arrCode,
      },
      travelDate: getDateByDDMMYYYYFormate(startDate),
    },
  ];

  if (endDate) {
    routeInfos.push({
      fromCityOrAirport: {
        code: arrCode,
      },
      toCityOrAirport: {
        code: depCode,
      },
      travelDate: getDateByDDMMYYYYFormate(endDate),
    });
  }

  const payload = {
    searchQuery: {
      cabinClass: flightClass,
      paxInfo: {
        ADULT: passengers.adult,
        CHILD: passengers.child,
        INFANT: passengers.infant,
      },
      routeInfos,
      searchModifiers: {
        pft: fareType,
        isDirectFlight: true,
        isConnectingFlight: true,
      },
    },
    compressed: isCompressed,
  };

  if (airlineCode) {
    payload.searchQuery.preferredAirline = [
      {
        code: airlineCode,
      },
    ];
  }

  return ExternalsManager.API.post(GET_SEARCH_FLIGHT, payload);
};

const getFlightDataNew = async (
  depCode,
  arrCode,
  passengers,
  fareType,
  flightClass,
  startDate,
  endDate = null,
  airlineCode,
  isCompressed = false,
  isDirectFlight = true,
  isConnectingFlight = true
) => {
  let routeInfos = [
    {
      fromCityOrAirport: {
        code: depCode,
      },
      toCityOrAirport: {
        code: arrCode,
      },
      travelDate: getDateByDDMMYYYYFormate(startDate),
    },
  ];

  if (endDate) {
    routeInfos.push({
      fromCityOrAirport: {
        code: arrCode,
      },
      toCityOrAirport: {
        code: depCode,
      },
      travelDate: getDateByDDMMYYYYFormate(endDate),
    });
  }

  const payload = {
    searchQuery: {
      cabinClass: flightClass,
      paxInfo: {
        ADULT: passengers.adult,
        CHILD: passengers.child,
        INFANT: passengers.infant,
      },
      routeInfos,
      searchModifiers: {
        pft: fareType,
        isDirectFlight: isDirectFlight,
        isConnectingFlight: isConnectingFlight,
      },
    },
    compressed: isCompressed,
  };

  if (airlineCode) {
    payload.searchQuery.preferredAirline = [
      {
        code: airlineCode,
      },
    ];
  }

  let response = await ExternalsManager.API.post(GET_SEARCH_FLIGHT, payload);

  if (isCompressed) {
    const binaryString = atob(response?.data);
    const len = binaryString.length;
    const compressedBuffer = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      compressedBuffer[i] = binaryString.charCodeAt(i);
    }

    const decompressedBuffer = Pako.inflate(compressedBuffer);

    const originalData = new TextDecoder().decode(decompressedBuffer);
    const parsedData = JSON.parse(originalData);

    response.data = parsedData;
  }

  return response;
};

export {
  getAirportData,
  getFareTypeData,
  getFlightClassData,
  getCountryCode,
  getFlightData,
  getFareRuleByPriceId,
  getAirlineCodes,
  getFlightDataNew,
};
