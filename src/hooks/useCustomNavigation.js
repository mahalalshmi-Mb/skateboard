import { useHistory } from "react-router-dom";
import { getLocalStorage } from "../util/storageUtil";
import { defaultLanguage } from "../commons/config";

const useCustomNavigation = () => {
  const history = useHistory();

  const pushHistory = (url, state) => {
    const lang = getLocalStorage("langCode");
    if (lang && lang !== defaultLanguage && !url.startsWith(`/${lang}`)) {
      history.push(`/${lang}${url}`, state);
    } else {
      history.push(`${url}`, state);
    }
  };

  const replaceHistory = (url, state) => {
    const lang = getLocalStorage("langCode");
    if (lang && lang !== defaultLanguage && !url.startsWith(`/${lang}`)) {
      history.replace(`/${lang}${url}`, state);
    } else {
      history.replace(`${url}`, state);
    }
  };

  const returnRedirectUrl = (url) => {
    const lang = getLocalStorage("langCode");
    if (lang && lang !== defaultLanguage && !url.startsWith(`/${lang}`)) {
      return `/${lang}${url}`;
    } else {
      return `${url}`;
    }
  };

  return {
    pushHistory,
    replaceHistory,
    returnRedirectUrl,
  };
};

export default useCustomNavigation;
