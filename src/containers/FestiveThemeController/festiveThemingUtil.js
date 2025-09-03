import { getAppConfig } from "../../commons/util/appConfigHelper";
import { getLocalStorage } from "../../util/storageUtil";

export const getImage = (source) => {
  if (source) {
    try {
      return `${getAppConfig("FESTIVE_THEMING_BASE_URL")}/${source}`;
    } catch (error) {
      return source;
    }
  }
};

//**For testing on local -> add all assets for testing this out. */
// export const getImage = (source) => {
//   if (source) {
//     try {
//       return require(`./assets/${source}`);
//     } catch (error) {
//       return source;
//     }
//   }
// };

export const isFestiveTheme = () => {
  let theme = getLocalStorage("festiveTheme");
  if (theme) {
    return theme.enableTheme;
  }
  return false;
};

export const currentFestiveTheme = () => {
  let theme = getLocalStorage("festiveTheme");
  if (theme) {
    return theme.currentTheme;
  }
  return false;
};
