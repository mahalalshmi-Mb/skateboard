import { ConfigProvider } from "context/configContext";
import { useEffect, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useLocation } from "react-router-dom";
import { fetchAgeRestrictionPromptData } from "util/Util";
import "./App.css";
import config, { GOOGLE_RECAPTCHA_SITE_KEY, languages } from "./commons/config";
import Util from "./commons/util/util";
import LoadApplicablePromo from "./containers/loadApplicablePromo/loadApplicablePromo";
import LoadCart from "./containers/loadCart/loadCart";
import LoadEnv from "./containers/loadEnv/loadEnv";
import { CartProvider } from "./context/cartContext";
import { FlightProvider } from "./context/FlightsContext";
import RootSwitch from "./routes/RootSwitch";
import {
  removeLocalStorage,
  setLocalStorage,
  setSessionStorage,
} from "./util/storageUtil";
import LoadHeaderAndFooter from "containers/loadHeaderAndFooter/loadHeaderAndFooter";
import { isDesktopDevice } from "commons/util/helperFunctions";
import callAPI from "commons/callAPI";
import MetaTags from "components/atoms/metaTags";
import Loader from "components/atoms/loader";

function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [metadata, setMetadata] = useState();
  const [isEnvLoaded, setIsEnvLoaded] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isCurrencyLoaded, setIsCurrencyLoaded] = useState(false);
  const [isHeaderAndFooterLoaded, setIsHeaderAndFooterLoaded] = useState(false);

  useEffect(() => {
    fetchAgeRestrictionPromptData();
    fetchSeoMetadata();
  }, []);

  useEffect(() => {
    if (!isDesktopDevice()) {
      const observer = new MutationObserver(() => {
        const menu = document?.getElementsByClassName("uwif userway_p5") || [];

        if (menu && menu?.length > 0) {
          const widget = menu[0];
          if (widget) {
            widget.style.height = "calc(100% - 98px)";
            widget.style.maxHeight = "calc(100% - 98px)";
            widget.style.top = "98px";
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    if (!location) {
      return;
    }
    const params = new URLSearchParams(location.search);
    const qrCodeScanCampaign = params.get("QRCodescancampaign");

    if (qrCodeScanCampaign) {
      setSessionStorage("campaignId", qrCodeScanCampaign);
    }
  }, [location]);

  useEffect(() => {
    const langCode = location?.pathname?.split("/")[1];
    if (languages?.includes(langCode)) {
      setLocalStorage("langCode", langCode);
    } else {
      removeLocalStorage("langCode");
    }

    if (!Util.isWebView()) {
      document.getElementById("viewport").content =
        "width=device-width, initial-scale=1";
    }
  }, []);

  const fetchSeoMetadata = async () => {
    try {
      let apiURL = config.api.pages.replace("{{pageId}}", "seo");
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (apiResponse.status === 200) {
        setMetadata(regResponse);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <GoogleReCaptchaProvider reCaptchaKey={GOOGLE_RECAPTCHA_SITE_KEY}>
      <LoadEnv isEnvLoaded={isEnvLoaded} setIsEnvLoaded={setIsEnvLoaded}>
        <MetaTags data={metadata?.html} />
        <ConfigProvider
          setIsCurrencyLoaded={setIsCurrencyLoaded}
          isEnvLoaded={isEnvLoaded}
        >
          <CartProvider>
            <FlightProvider>
              <LoadCart
                isCartLoaded={isCartLoaded}
                setIsCartLoaded={setIsCartLoaded}
              />
              <LoadHeaderAndFooter
                isHeaderAndFooterLoaded={isHeaderAndFooterLoaded}
                setIsHeaderAndFooterLoaded={setIsHeaderAndFooterLoaded}
              />
              {/* <LoadFlight
            isFlightLoaded={isFlightLoaded}
            setIsFlightLoaded={setIsFlightLoaded}
          /> */}
              {/* <LoadCurrency
                isCurrencyLoaded={isCurrencyLoaded}
                setIsCurrencyLoaded={setIsCurrencyLoaded}
              /> */}
              {isEnvLoaded && <LoadApplicablePromo />}
              {/* {isEnvLoaded && isCartLoaded && isFlightLoaded && <RootSwitch />} */}
              {!isLoading && isEnvLoaded && isCartLoaded && isCurrencyLoaded ? (
                <RootSwitch />
              ) : (
                <Loader />
              )}
            </FlightProvider>
          </CartProvider>
        </ConfigProvider>
      </LoadEnv>
    </GoogleReCaptchaProvider>
  );
}

export default App;
