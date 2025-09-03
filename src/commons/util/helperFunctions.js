import moment from "util/momentWrapper";
import {
  getLocalStorage,
  getSessionStorage,
  setSessionStorage,
} from "../../util/storageUtil";
import callAPI from "../callAPI";
import config from "../config";
import { getCookieCustom, setCookieCustom } from "./cookieUtil";

export const getUserInfo = async (type) => {
  try {
    let apiURL = config.api.user.info;
    let apiResponse;

    apiResponse = await callAPI.get(apiURL);

    let regResponse = await apiResponse.json();

    if (regResponse.status === 200) {
      //set-jwtToken-cookie and user-data-localStorage

      localStorage.setItem("userData", JSON.stringify(regResponse));
      if (regResponse.metadata?.status?.r360?.token) {
        setCookieCustom("jwtToken", regResponse.metadata.status.r360.token);
      }

      if (type === "metadata") {
        return regResponse.metadata;
      } else if (type === "both") {
        return regResponse;
      } else {
        return regResponse.data;
      }
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const decode = (item) => {
  let newItem = window.atob(item);
  return newItem;
};

export const encode = (item) => {
  let newItem = window.btoa(item);
  return newItem;
};

export const SCREEN_WIDTH = window.innerWidth;
export const SCREEN_HEIGHT = window.innerHeight;

export const isMobileDevice = () => {
  return SCREEN_WIDTH <= 768;
};

export const isTabletDevice = () => {
  return SCREEN_WIDTH > 768 && SCREEN_WIDTH < 1024;
};

export const isDesktopDevice = () => {
  return SCREEN_WIDTH >= 1024;
};

export const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileP: "390px",
  mobileX: "414px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopM: "1280px",
  laptopL: "1440px",
  laptopX: "1520px",
  desktop: "2560px",
};

export const convertSize = (reqSize) => {
  return parseInt(size[reqSize].slice(0, -2));
};

export const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileP: `(min-width: ${size.mobileP})`,
  mobileX: `(min-width: ${size.mobileX})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopM: `(min-width: ${size.laptopM})`,
  laptopL: `(min-width: ${size.laptopL})`,
  laptopX: `(min-width: ${size.laptopX})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktop})`,
};

export const sortByProperty = (ar, property) => {
  return ar.sort((a, b) => (a[property] > b[property] ? 1 : -1));
};

export const handleApiCaching = (key, data) => {
  if (data) {
    setSessionStorage(key, data);
  } else {
    let existingData = getSessionStorage(key);
    if (existingData) {
      return existingData;
    } else {
      return false;
    }
  }
};

export const deleteAllCookies = () => {
  let cookies = document.cookie.split(";");

  if (cookies) {
    for (const element of cookies) {
      let cookie = element;
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
};

export const capitalize = (word) => {
  if (word) {
    const loweredCase = word.toLowerCase();
    return word[0].toUpperCase() + loweredCase.slice(1);
  }
};

export const isLoggedIn = () => {
  let gwLoginData = getCookieCustom("gwLoginData");
  if (gwLoginData) {
    gwLoginData = JSON.parse(gwLoginData);
  }

  return !!(gwLoginData && gwLoginData?.userId);
};

export const toHoursAndMinutesFromMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
};

export const toHoursAndMinutesAndSecondsFromSeconds = (totalSeconds) => {
  //With seconds, minute rounded down
  const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { h: hours, m: minutes, s: seconds };
};

export const toHoursAndMinutesFromSeconds = (totalSeconds) => {
  //With seconds, minute rounded down
  const totalMinutes = Math.ceil(totalSeconds / 60);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { h: hours, m: minutes };
};

export const toMinutesFromSeconds = (totalSeconds) => {
  //Rounded off to the higher minute
  return Math.ceil(totalSeconds / 60);
};

//**Flight Information & Flight Card */
export const getGateInfo = (gates) => {
  let str = "";
  gates.forEach((gate, index) => {
    str = str + gate.gateNumber + `${index !== gates.length - 1 ? ", " : ""}`;
  });
  return str;
};

export const getBaggageInfo = (belts) => {
  let str = "";
  belts.forEach((belt, index) => {
    str = str + belt.beltNumber + `${index !== belts.length - 1 ? ", " : ""}`;
  });
  return str;
};

export const formatRupees = (number) => {
  if (number) {
    // Convert the number to a string
    const strNumber = number.toString();
    // Split the number into integer and decimal parts (if any)
    const parts = strNumber.split(".");
    let integerPart = parts[0];
    const decimalPart = parts[1] ? "." + parts[1] : "";

    // Add commas to the integer part
    const regex = /(\d)(?=(\d{3})+(?!\d))/g;
    integerPart = integerPart.replace(regex, "$1,");

    // Return the formatted rupees
    return integerPart + decimalPart;
  } else {
    return 0;
  }
};

export const getFlightInfo = async (flightData, dateFormat) => {
  if (flightData) {
    let id = flightData?.flightId;
    let flightDate = flightData?.scheduleDate;
    let flightMovementType = flightData?.movementType;

    let date = moment(flightDate, "UTC", "UTC").format();

    let movementType = "Departure";
    if (flightMovementType === "A") movementType = "Arrival";

    try {
      let apiURL = config.api.flightSearch
        .replace("{{date}}", date)
        .replace("{{movementType}}", movementType)
        .replace("{{flightNo}}", id);
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (regResponse.data.length > 0) {
        if (regResponse.data[0]?.terminal) {
          return regResponse.data[0];
        } else {
          throw Error();
        }
      } else {
        throw Error();
      }
    } catch (e) {
      return false;
    }
  }
};

export const getArtAndCultureInfo = async () => {
  try {
    let apiURL = config.api.pages.replace(
      "{{pageId}}",
      "pulse-art-and-culture"
    );
    let apiResponse = await callAPI.get(apiURL);
    let regResponse = await apiResponse.json();
    if (apiResponse.status === 200) {
      return regResponse;
    }
  } catch (e) {
    console.log(e);
  }
};

export const splitCamelCaseString = (input) => {
  let regex = /([a-z])([A-Z])/g;
  let result = input.replace(regex, "$1 $2");
  const words = result
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return words.join(" ");
};

export const goTop = () => {
  let timerId = setTimeout(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    clearTimeout(timerId);
  }, 100);
};

export const applicablepromo = async (userId, dateFormat) => {
  try {
    let obj = {};
    let apiURL = config.api.getapplicablepromo;
    let apiResponse = await callAPI.post(apiURL, {
      customerId: userId,
    });

    let regResponse = await apiResponse.json();

    if (regResponse.status === 200 && regResponse.data.length > 0) {
      let appliedCoupon = getSessionStorage("appliedCoupon");
      obj.data = regResponse?.data || [];
      obj.calledAt = moment(new Date()).format(dateFormat);
      if (appliedCoupon && appliedCoupon?.coupon) {
        let coupon = [];
        coupon?.push(appliedCoupon.coupon || "");
        obj.data[0].couponCode = coupon;
      }

      return obj;
    } else {
      let availablePromo = getSessionStorage("availablePromo");
      if (availablePromo) {
        return availablePromo;
      } else {
        return null;
      }
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const removeAppliedCoupon = () => {
  let promoData = JSON.parse(
    JSON.stringify(getSessionStorage("availablePromo"))
  );
  promoData?.data?.forEach((x) => {
    if (x.couponCode) {
      delete x.couponCode;
    }
  });
  setSessionStorage("availablePromo", promoData);
};

export const removeSpace = (str) => {
  return str.replace(" ", "");
};

export const formatPrice = (amount) => {
  const configData = getLocalStorage("config") || {};
  const countryCode = configData?.countryCode || "US";

  const optionsByCountry = {
    US: {
      locale: "en-US",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      truncate: true,
    },
    DK: {
      locale: "da-DK",
      currency: "DKK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      truncate: false,
    },
    GB: {
      locale: "en-GB",
      currency: "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      truncate: true,
    },
    // Add more countries as needed
  };

  const options = optionsByCountry[countryCode];
  let displayAmount = amount;
  if (options.truncate) {
    displayAmount = truncateTo2DecimalsStr(displayAmount);
  }

  const formatter = new Intl.NumberFormat(options.locale, {
    style: "currency",
    currency: options.currency,
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
  });

  let formatted = formatter.format(displayAmount);

  // Remove period from 'kr.' if country is Denmark
  if (countryCode === "DK") {
    formatted = formatted.replace("kr.", "kr");
  }

  return `${formatted}`;
};

export const truncateTo2DecimalsStr = (num) => {
  if (isNaN(num) || num === null || num === undefined) {
    return "";
  }
  const [intPart, decimalPart = ""] = num?.toString()?.split(".");
  const truncatedDecimal = decimalPart?.slice(0, 2)?.padEnd(2, "0");
  return `${intPart}.${truncatedDecimal}`;
};

export const isValidPrice = (val) => {
  if (val !== null && val !== undefined && val !== 0) {
    return true;
  } else {
    return false;
  }
};

export function sortByKey(array, key) {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
}

export const toLowerCaseObject = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key.toLowerCase()] =
      typeof obj[key] === "string" ? obj[key].toLowerCase() : obj[key];
    return acc;
  }, {});
};

export function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((sortedObj, key) => {
      sortedObj[key] = obj[key];
      return sortedObj;
    }, {});
}

export const fetchQueryURL = (url, urlParts, keyParts) => {
  const frontIndex = url.indexOf(keyParts);
  if (frontIndex === -1) return {};

  const path = url.substring(frontIndex + keyParts.length);
  const [pathPart, queryPart] = path.split("?");
  const decodedPath = decodeURIComponent(pathPart || "");

  if (!pathPart && !queryPart) return;

  const queryObject = {
    supportedFulfillmentTypes: "collect at store",
    domain: "",
  };

  if (urlParts.length > 0 && decodedPath) {
    const parts = decodedPath
      .split("-")
      .map((part) => part.replace(/_/g, "-").replace(/\|/g, "/"));

    urlParts.forEach((key, index) => {
      queryObject[key] = parts[index] || null;
    });
  }

  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    for (const [key, value] of params.entries()) {
      queryObject[key] = value;
    }
  }
  return queryObject;
};

export const hasAllValues = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (key === "domain" || key === "sector" || key === "section") {
        if (value === null || value === undefined || value === "") {
          return false;
        }
        continue;
      }

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        if (!hasAllValues(value)) {
          return false;
        }
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          return true;
        }
      } else if (value === undefined || value === null || value === "") {
        return true;
      }
    }
  }
  return false;
};

export const fetchStoreFrontURL = (storeObj, storeId) => {
  let terminal = storeObj?.terminal?.value?.replace(/-/g, "_");
  let sector = storeObj?.sector?.value?.replace(/-/g, "_");
  let movementType = storeObj?.movementType?.value?.replace(/-/g, "_");
  let storeName = storeObj?.storeDisplayName?.replace(/-/g, "_");

  if (
    terminal === "" ||
    terminal === null ||
    terminal === undefined ||
    terminal === "NA"
  ) {
    terminal = "";
  }
  if (
    sector === "" ||
    sector === null ||
    sector === undefined ||
    sector === "NA"
  ) {
    sector = "";
  }
  if (
    movementType === "" ||
    movementType === null ||
    movementType === undefined ||
    movementType === "NA"
  ) {
    movementType = "";
  }
  if (
    storeName === "" ||
    storeName === null ||
    storeName === undefined ||
    storeName === "NA"
  ) {
    storeName = "";
  }
  storeName = storeName?.replace(/\//g, "|");
  terminal = terminal?.replace(/\//g, "|");
  const storeDetails = `${storeName}-${terminal}-${sector}-${movementType}-${storeId}`;

  return storeDetails;
};
