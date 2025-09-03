import React, { Fragment, useEffect } from "react";
import config from "commons/config";
import callAPI from "commons/callAPI";
import { setSessionStorage } from "util/storageUtil";
import { refactorSubMenus } from "containers/header/config";

const LoadHeaderAndFooter = (props) => {
  useEffect(() => {
    //on app load
    getHeaderData();
    getFooterData();
  }, []);

  const getHeaderData = async () => {
    try {
      let apiURL = config.api.navbar;
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();

      if (apiResponse.status === 200 && regResponse.length > 0) {
        const newHeaderData = refactorSubMenus(regResponse);
        setSessionStorage("header", newHeaderData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getFooterData = async () => {
    try {
      let apiURL = config.api.footer;
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (apiResponse.status === 200) {
        const data = regResponse?.data[0] || {};
        setSessionStorage("footer", data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return <Fragment>{props.children}</Fragment>;
};

export default LoadHeaderAndFooter;
