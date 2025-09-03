import { timezoneConfig } from "config/timeZoneConfig";
import { ConfigLocalKey } from "context/configContext";
import momentTimezone from "moment-timezone";
import { getLocalStorage } from "util/storageUtil";

import momentMain from "moment";
import "moment/min/locales";

export const defaultTimezone = timezoneConfig["us"];
export const defaultLocale = "en-US";

export const moment = (
  input = new Date(),
  overridedTimeZone = null,
  overridedLocale = null
) => {
  const localStorageConfig = getLocalStorage(ConfigLocalKey) || {};
  const { timezone, locale } = localStorageConfig;

  const _timezone = overridedTimeZone || timezone || defaultTimezone;
  const _locale = overridedLocale || locale || defaultLocale;

  momentMain.locale(_locale);
  const _moment = momentMain(input);

  return momentTimezone.tz(_moment, _timezone);
};

export default moment;
