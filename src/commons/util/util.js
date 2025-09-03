import fbq from "react-facebook-pixel";
import validator from "validator";
//@ts-ignore
import Moengage from "@moengage/web-sdk";
import parse from "html-react-parser";
import {
  browserName,
  fullBrowserVersion,
  isDesktop,
  isMobile,
  isMobileOnly,
  osName,
  osVersion,
  mobileModel,
  mobileVendor,
} from "react-device-detect";
import tbq from "react-twitter-pixel";
import config from "../../commons/config";
import { getSessionStorage, setSessionStorage } from "../../util/storageUtil";
import { getAppConfig } from "./appConfigHelper";
import {
  flatAndMapEventData,
  mapEventData,
} from "../../util/analytics/cdp/Constant";

const options = {
  autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
  debug: false, // enable logs
};

const Util = {
  isWebView() {
    // return true;

    var standalone = window.navigator.standalone,
      userAgent = window.navigator.userAgent.toLowerCase(),
      safari = /safari/.test(userAgent),
      ios = /iphone|ipod|ipad/.test(userAgent);
    if (ios) {
      if (!standalone && safari) {
        // Safari
      } else if (!standalone && !safari) {
        // iOS webview
        return true;
      }
    } else {
      if (userAgent.includes("wv")) {
        // Android webview
        return true;
      } else {
        // Chrome
      }
    }
    return false;
  },
  getSlug(pathName) {
    let slug;
    if (pathName) {
      slug = pathName.split("/")[pathName.split("/").length - 1];
    } else {
      slug = "";
    }
    return slug;
  },
  isEmailValid(email) {
    let res;
    if (validator.isEmail(email)) {
      res = true;
    } else {
      res = false;
    }
    return res;
  },
  pixelNammaShikshana() {
    fbq.init(config.pixel.FACEBOOK_CONVERSATION_ID, options);
    fbq.pageView();
    fbq.track("PageView");
  },
  twitterPixel() {
    tbq.init(config.pixel.TWITTER_KEY_ID, options);
    tbq.pageView();
    tbq.track("PageView");
  },
  twitterConversionPixel() {
    tbq.init(config.pixel.TWITTER_CONVERSION_KEY_ID, options);
    tbq.track("PageView");
  },
  googlePixel() {
    if (typeof window.gtag !== "undefined") {
      window.gtag("config", "AW-315543967");
      window.gtag("track", "PageView");
    }
  },
  gtag_report_conversion(url) {
    // console.log(url+"GTAG");
    var callback = function () {
      if (typeof url != "undefined") {
        window.location = url;
        //  console.log(url + "GTAG");
      }
    };
    // window.gtag("config", "AW-315543967");
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "conversion", {
        send_to: config.pixel.GOOGLE_CONVERSATION_ID,
        transaction_id: "DonateNow",
        event_callback: callback,
      });
    }
  },
  fnBrowserDetect() {
    let userAgent = navigator.userAgent;
    if (userAgent.match(/chrome|chromium|crios/i)) {
      return "chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
      return "firefox";
    } else if (userAgent.match(/safari/i)) {
      return "safari";
    } else if (userAgent.match(/opr\//i)) {
      return "opera";
    } else if (userAgent.match(/edg/i)) {
      return "edge";
    } else {
      return "No browser detection";
    }
  },
  getUrlParams(t) {
    var r = {};
    if (t) {
      let i = t.split("?")[1];
      if (i) {
        if (i.includes("%26")) {
          i = i.replaceAll("%26", "&");
        }
        const t = i.split("&");
        t &&
          t.forEach((t) => {
            var i = t.split("=");
            r[i[0]] = i[1];
          });
      }
    }
    return r;
  },
  chatBot(url, path) {
    let corover = document.getElementById("corover-cb-widget");
    let floatingAvatar = document.getElementById("floating-avatar");
    let coroverChatbox = document.getElementById("corover-chatbox");
    document.addEventListener("click", () => {
      // console.log('Floating avatar clicked!');
      Util.sendMessageToReactNative("MICROPHONE_PERMISSION_CHECK");
    });

    if (path === "/") {
      let script = document.createElement("script");
      script.src = url;
      script.type = "text/javascript";
      script.id = "chatbot";

      if (document.getElementById("chatbot")) {
        if (corover) corover.style.visibility = "visible";
        if (floatingAvatar) floatingAvatar.style.visibility = "visible";
        if (coroverChatbox) coroverChatbox.style.visibility = "visible";
      } else {
        document.getElementsByTagName("head")[0].appendChild(script);
      }
    } else {
      if (corover) corover.style.visibility = "hidden";
      if (floatingAvatar) floatingAvatar.style.visibility = "hidden";
      if (coroverChatbox) coroverChatbox.style.visibility = "hidden";
    }
  },
  isDesktop() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    const mobileRegex =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    if (mobileRegex.test(userAgent.toLowerCase())) {
      return false;
    }

    return true;
  },
  isMobile() {
    // Returns true is user is using mobile device
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile =
      /android|iphone|ipad|ipod|blackberry|windows phone|webos/i.test(
        userAgent
      );
    return isMobile;
  },
  isMobileBrowser() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return true;
    } else {
      return false;
    }
  },
  isIosWebView() {
    let standalone = window.navigator.standalone,
      userAgent = window.navigator.userAgent.toLowerCase(),
      safari = /safari/.test(userAgent),
      ios = /iphone|ipod|ipad/.test(userAgent);
    if (ios) {
      if (!standalone && safari) {
        // Safari
      } else if (!standalone && !safari) {
        // iOS webview
        return true;
      }
    }
    return false;
  },
  isAndroidWebView() {
    let userAgent = window.navigator.userAgent.toLowerCase(),
      ios = /iphone|ipod|ipad/.test(userAgent);
    if (!ios) {
      if (userAgent.includes("wv")) {
        // Android webview
        return true;
      } else {
        // Chrome
      }
    }
    return false;
  },
  getUserAgentData(data) {
    let { source, name } = data;
    source = source || "EDP";
    name = name || "Sign Up";
    let browser = browserName || "";

    let ref = "";
    if (isMobileOnly) ref = `Mobile ${browser}`;
    else if (isMobile) ref = `Tablet ${browser}`;
    else if (isDesktop) ref = `Desktop ${browser}`;

    let channel = "";
    if (this.isIosWebView()) channel = "iOS Mobile App";
    else if (this.isAndroidWebView()) channel = "Android Mobile App";
    else channel = "Web Application";

    const qParams = `?source=${source}&name=${name}&channel=${channel}&ref=${ref}`;
    return qParams;
  },

  getUsermetaData() {
    const osname = osName || "";
    const osversion = osVersion || "";
    const browsername = browserName || "";
    const browserversion = fullBrowserVersion || "";

    const metadata = {
      os: `${osname}|${osversion}`,
      platform: `${browsername}|${browserversion}`,
    };

    // Campaign Source: Passing as Agent (temporary)
    const campaignId = getSessionStorage("campaignId");
    if (campaignId) {
      metadata.agent = campaignId;
    }
    return metadata;
  },

  triggerMoEngageEvent(
    eventName,
    data,
    additionalData = {},
    flattenItems = false
  ) {
    try {
      const moEngageEnabled = getAppConfig("MOENGAGE_ENABLED");

      if (moEngageEnabled) {
        let eventData = {};
        if (flattenItems) {
          eventData = flatAndMapEventData(eventName, data);
        } else {
          eventData = mapEventData(eventName, data);
        }
        eventData = { ...eventData, ...additionalData };

        if (Object.keys(eventData).length === 0) {
          eventData = data;
        }

        if (window.ReactNativeWebView) {
          let reactMsg = JSON.stringify({
            msg: eventName,
            data: eventData || {},
            type: "MoEngageEvent",
          });
          window.ReactNativeWebView.postMessage(reactMsg);
        } else {
          Moengage.track_event(eventName, eventData || {});
        }
        return;
      }
    } catch (e) {
      console.log("Error in triggerMoEngageEvent: ", e);
    }
  },

  sendMessageToReactNative(msg, data) {
    try {
      if (msg.toLowerCase().includes("moengage")) {
        const config = localStorage.getItem("appConfig");
        const parsedConfig = JSON.parse(config);
        let message = msg;

        if (msg.includes("moengage-user")) {
          message = msg.slice(14);
        } else {
          message = msg.slice(9);
        }

        if (parsedConfig.ENVIRONMENT.toLowerCase().includes("dev")) {
          if (window.ReactNativeWebView) {
            let reactMsg = JSON.stringify({
              msg: msg,
              data: data || {},
            });
            window.ReactNativeWebView.postMessage(reactMsg);
          } else {
            Moengage.track_event(message, data || {});
          }
          return;
        }
      }
      if (window.ReactNativeWebView) {
        if (msg !== undefined) {
          window.ReactNativeWebView.postMessage(msg);
        }
      }
    } catch (e) {}
  },

  triggerGTMConversion(eventName, conversion, data) {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag(eventName, conversion, data || {});
    }
  },

  htmlParse(data) {
    if (data) return parse(data.split('<div class="raw-html-embed">')[1]);
  },
  checkMarketingPage(slug) {
    if (
      slug === "/bial-marketing-1" ||
      slug === "/bial-marketing-2" ||
      slug === "/bial-marketing-3" ||
      slug === "/bial-marketing-4" ||
      slug === "/bial-marketing-5"
    ) {
      return true;
    } else {
      return false;
    }
  },
  truncatingSentence(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  },

  getBookingSource() {
    if (Util.isAndroidWebView()) {
      return `${getAppConfig("BOOKING_SOURCE")}-android-app`;
    } else if (Util.isIosWebView()) {
      return `${getAppConfig("BOOKING_SOURCE")}-ios-app`;
    } else {
      return `${getAppConfig("BOOKING_SOURCE")}-web`;
    }
  },
  getQrCodeSource(url) {
    let params = Util.getUrlParams(url);
    let source = [];

    if (params["QRCodescancampaign"]) {
      source.push(
        `QRCodescancampaign=${decodeURIComponent(params["QRCodescancampaign"])}`
      );
    }
    if (params["GAAdCampaign"]) {
      source.push(`GAAdCampaign=${decodeURIComponent(params["GAAdCampaign"])}`);
    }
    if (params["SMAdCampaign"]) {
      source.push(`SMAdCampaign=${decodeURIComponent(params["SMAdCampaign"])}`);
    }

    if (source?.length > 0) {
      source = JSON.stringify(source);
      setSessionStorage("qrCodeSource", source);
    }
  },
  getAuthHeaders(category) {
    let region = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let platform = "NA";
    if (this.isWebView()) platform = "App";
    else platform = "Web";

    let os = "NA";
    if (this.isIosWebView()) os = "IOS";
    else if (this.isAndroidWebView()) os = "Android";
    else os = "Web";

    let cat = category || "";
    let deviceName = mobileModel || "";
    let deviceManufacturer = mobileVendor || "";
    let browser = browserName || "";

    let headers = {
      "x-app-region": region,
      "x-app-platform": platform,
      "x-app-category": cat,
      "x-device-name": deviceName,
      "x-device-manufacturer": deviceManufacturer,
      "x-device-operating-system": os,
      "x-device-browser-agent": browser,
    };
    return headers;
  },
};
export default Util;
