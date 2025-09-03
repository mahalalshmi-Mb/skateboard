import _ from "lodash";
import { useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "../util/storageUtil";

export const useTheme = () => {
  const themes = getLocalStorage("all-themes");
  const [theme, setTheme] = useState(themes?.data?.default);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const setMode = (mode) => {
    setLocalStorage("theme", mode);
    setTheme(mode);
  };

  const getFonts = () => {
    const allFonts = _.values(_.mapValues(themes?.data, "font"));
    return allFonts;
  };

  useEffect(() => {
    const localTheme = getLocalStorage("theme");
    localTheme && setTheme(localTheme);
    setThemeLoaded(true);
  }, []);

  return { theme, themeLoaded, setMode, getFonts };
};
