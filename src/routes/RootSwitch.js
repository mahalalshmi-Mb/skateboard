import React, { useState, useEffect } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import ScrollToTop from "../components/atoms/scrollRestoration";

import MainProvider from "../context/MainProvider";
import AppPageWrapper from "../pages/AppPageWrapper";

import ReactGA from "react-ga";

import { getAppConfig } from "../commons/util/appConfigHelper";
import { ENV, TRACKING_ID } from "../commons/config";
import moengage from "@moengage/web-sdk";

// import { browserName, fullBrowserVersion, osName, osVersion } from "react-device-detect";

ReactGA.initialize(TRACKING_ID);

const RootSwitch = () => {
  const [isRerender, setIsRerender] = useState(false);

  const setMoEngageUniqueId = () => {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    try {
      const memberId = userInfo?.metadata?.status?.membership?.mmid;
      if (memberId) {
        moengage.add_unique_user_id(memberId);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (getAppConfig("MOENGAGE_ENABLED") === true) {
      const environment = getAppConfig("ENVIRONMENT");
      const appId = getAppConfig("MOENGAGE_APP_ID");
      const cluster = getAppConfig("MOENGAGE_CLUSTER");

      if (!window.ReactNativeWebView) {
        moengage.initialize({
          app_id: appId,
          debug_logs: environment === "PROD" ? 0 : 1,
          cluster: cluster,
          enableSPA: true,
        });

        setTimeout(() => {
          setMoEngageUniqueId();
        }, 2000);
      }
    }

    const GTM_ID = getAppConfig("GTM_ID");
    const GTM_ENABLED = getAppConfig("ENABLED_GTM");

    if (GTM_ID && GTM_ENABLED) {
      if (document.getElementById("gtm-script")) return;

      const script = document.createElement("script");
      script.id = "gtm-script";
      script.setAttribute("nonce", "NGINX_CSP_NONCE");
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];
          w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;
          j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);
        })(window, document, 'script', 'dataLayer', '${GTM_ID}');
      `;
      document.head.appendChild(script);

      if (document.getElementById("gtm-noscript")) return;

      const noscript = document.createElement("noscript");
      noscript.id = "gtm-noscript";
      noscript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
            height="0" width="0"
            style="display:none;visibility:hidden"></iframe>
      `;
      document.body.appendChild(noscript);
    }
  }, []);

  // Used for Pulse Tablet Payment Flow
  useEffect(() => {
    function handleEvent(message) {
      const data = message.data;
      localStorage.setItem("DATA_REFERENCE", data);
      setIsRerender(!isRerender);
    }
    document.addEventListener("message", handleEvent);

    return () => document.removeEventListener("message", handleEvent);
  }, [isRerender]);

  // MoEngage OnSite Message Click Event
  useEffect(() => {
    window.addEventListener("MOE_AUTOMATED_EVENTS", function (event) {
      if (
        event.detail.name === "MOE_ONSITE_MESSAGE_CLICKED" &&
        event.detail.data &&
        event.detail.data.length
      ) {
      }
      console.log("MoEngage event: ", event);
    });
  }, []);

  return (
    <MainProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Switch>
          <Route path="/" render={(props) => <AppPageWrapper {...props} />} />
          <Redirect from="/" to="/" />
        </Switch>
      </BrowserRouter>
    </MainProvider>
  );
};

export default RootSwitch;
