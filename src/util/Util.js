import callAPI from "commons/callAPI";
import config, { ENV } from "../commons/config";
import { getSessionStorage, setSessionStorage } from "./storageUtil";

export const devConsole = (message) => {
  if (ENV === "DEV") {
    console.log(message);
  }
};

export const fetchAgeRestrictionPromptData = async () => {
  try {
    let configData = {};

    const apiUrl = config.api.cms.alcoholAlert;

    const response = await callAPI.get(apiUrl);
    const regResponse = await response.json();

    if (regResponse?.data) {
      configData.ageRestrictionPromptData = regResponse?.data?.[0]?.attributes;
      setSessionStorage("configData", configData);
    }

    return response.data !== null;
  } catch (e) {}
};

export const fetchSoftLaunchPromptData = async () => {
  try {
    let configData = {};
    let apiURL = config.api.pages.replace("{{pageId}}", "soft-launch");
    let apiResponse = await callAPI.get(apiURL);
    let regResponse = await apiResponse.json();
    if (apiResponse.status === 200) {
      configData.softLaunchPromptData = regResponse || {};
      setSessionStorage("softLaunchData", configData);
      return configData || {};
    }
    return {};
  } catch (e) {
    console.log(e);
    return {};
  }
};

export const fetchDarkSitePromptData = async () => {
  try {
    let configData = {};
    let apiURL = config.api.pages.replace("{{pageId}}", "dark-site");
    let apiResponse = await callAPI.get(apiURL);
    let regResponse = await apiResponse.json();
    if (apiResponse.status === 200) {
      configData.darkSitePromptData = regResponse || {};
      setSessionStorage("darkSiteData", configData);
      return configData || {};
    }
    return {};
  } catch (e) {
    console.log(e);
    return {};
  }
};

export const getItemTypeForIcon = (title) => {
  if (title.includes("cab")) {
    return "cab-feedback-title";
  } else if (title.includes("food") || title.includes("takeaway")) {
    return "food-feedback-title";
  } else if (title.includes("stay")) {
    return "stay-feedback-title";
  } else if (title.includes("lounge")) {
    return "lounge-feedback-title";
  } else if (title.includes("dining")) {
    return "dinein-feedback-title";
  } else if (
    title.includes("Duty-Free") ||
    title.includes("Duty Free") ||
    title.includes("duty-free") ||
    title.includes("duty free")
  ) {
    return "dutyfree-feedback-title";
  } else if (title.includes("Flight") || title.includes("flight")) {
    return "flight-feedback-title";
  }

  return "";
};

export const getOrderTypeForTitle = (string) => {
  if (string.includes("dinein")) {
    return "dinein";
  } else if (string.includes("store")) {
    return "store";
  } else if (string.includes("gate")) {
    return "gate";
  } else {
    return "";
  }
};
