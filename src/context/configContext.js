import callAPI from "commons/callAPI";
import config from "commons/config";
import { getAppConfig } from "commons/util/appConfigHelper";
import { timezoneConfig } from "config/timeZoneConfig";
import { createContext, useContext, useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "util/storageUtil";

const ConfigContext = createContext();

export const useConfig = () => {
  return useContext(ConfigContext);
};

export const ConfigLocalKey = "config";

export const defaultCurrencyConfig = {
  currencyCode: "INR",
  currencySymbol: "₹",
};

export const ConfigProvider = ({
  children,
  setIsCurrencyLoaded,
  isEnvLoaded,
}) => {
  const [appConfig, setAppConfig] = useState(
    getLocalStorage(ConfigLocalKey) || {}
  );
  const [userTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const fetchConfigs = async () => {
    try {
      const apiURL = config.api.appOperatingLocation.locationDetails;
      const apiResponse = await callAPI.get(apiURL);
      const regResponse = await apiResponse.json();

      if (regResponse?.status === 200) {
        const found = regResponse?.data?.platforms?.find(
          (x) => x?.platformName === getAppConfig("platform")
        );
        let configData = { ...regResponse?.data };
        if (found && found?.configs) {
          configData = { ...configData, ...found?.configs };
        }
        setConfigs(configData);
        return configData;
      } else {
        setConfigs({});
        return {};
      }
    } catch (e) {
      console.log(e);
      return {};
    } finally {
      setIsCurrencyLoaded(true);
    }
  };

  const setConfigs = (configs) => {
    const configObj = JSON.parse(JSON.stringify(configs));
    let timezone = timezoneConfig["in"];
    let locale = "en-US";

    if (configObj?.timezone) {
      timezone =
        configObj?.timezone ||
        timezoneConfig[configObj.countryCode.toLowerCase()];
    }
    if (configObj?.locale) {
      locale = configObj.locale;
    }

    configObj.timezone = timezone;
    configObj.locale = locale;

    setLocalStorage(ConfigLocalKey, configObj);
    setAppConfig(configObj);
  };

  useEffect(() => {
    if (isEnvLoaded) {
      fetchConfigs();
    }
  }, [isEnvLoaded]);

  const value = {
    currency: appConfig.currencySymbol || defaultCurrencyConfig.currencySymbol,
    userTimezone,
    timezone: appConfig.timezone || timezoneConfig["in"],
    appConfig,
    setAppConfig,
    preferencePreselection: appConfig?.isPreferencePreselectionAllowed || false,
    preOrderAvailable: appConfig?.isPreOrderAllowed || false,
    isMultiMerchantAllowed: appConfig?.isMultiMerchantAllowed || false,
    isPinVerificationRequired: appConfig?.isPinVerificationRequired || false,
    skipOrderTerminalSelection: appConfig?.skipOrderTerminalSelection || false,
    skipUserSessionRetention: appConfig?.skipUserSessionRetention || false,
    countryCode: appConfig?.countryCode || "us",
    landingPageUrl: appConfig?.landingPageUrl || "/",
    profileMandatoryFields: appConfig?.profileMandatoryFields || {},
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};
