import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory, useLocation } from "react-router-dom";
import HeroBanner_810 from "../../assets/images/signIn/Sign-up03.jpg";
import { getAppConfig } from "../../commons/util/appConfigHelper";
import { getUserInfo } from "../../commons/util/helperFunctions";
import Loader from "../../components/atoms/loader";
import HeroBanner from "../../components/molecules/heroBanner";
import useCustomNavigation from "../../hooks/useCustomNavigation";

const LoginRedirect = (props) => {
  const [heroBannerHeight, setHeroBannerHeight] = useState("500px");
  const [authSuccess, setAuthSuccess] = useState(false);
  const [cookies, setCookie] = useCookies([
    "user",
    "flightInfo",
    "gwLoginData",
  ]);
  const location = useLocation();
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();

  useEffect(() => {
    document.title = props.title || "";
  }, [props.title]);

  useEffect(() => {
    setBannerHeight();
  }, []);

  const setBannerHeight = () => {
    if (window.innerWidth <= 992) {
      setHeroBannerHeight("278px");
    } else {
      setHeroBannerHeight("500px");
    }
  };

  useEffect(() => {
    handleLoginCookies();
  }, [history, location.search]);

  const handleLoginCookies = async () => {
    const params = new URLSearchParams(location.search);
    if (params) {
      let data = await getUserInfo();
      let email = "";
      if (data) {
        email = data.email;
      }

      let gwLoginData = {
        profileImageURL: params.get("profileImageURL"),
        email,
        mobile: data.mobile,
        name: data.fullName,
      };

      setCookie("gwLoginData", JSON.stringify(gwLoginData), {
        path: "/",
        maxAge: 86400 * getAppConfig("LOGIN_COOKIE_EXPIRY_DAYS"),
      });
      setAuthSuccess(true);

      if (localStorage.getItem("subModule") === "flightAlert") {
        localStorage.setItem("module", "flightAlert");
        localStorage.removeItem("subModule");
        pushHistory("/travellers/flights/flight-information");
      } else if (localStorage.getItem("module") === "contactUs")
        pushHistory("/travellers/contact-us");
      else if (localStorage.getItem("module") === "tender")
        pushHistory("/corporate/engage-with-us/tenders");
      else if (localStorage.getItem("module") === "claim")
        pushHistory("/travellers/passenger-services/lost-found");
      else if (localStorage.getItem("module") === "myBooking")
        pushHistory("/travellers/profile/activeOrders");
      else if (localStorage.getItem("module") === "cart") {
        pushHistory("/cartRedirect");
      } else pushHistory("/");
    }
  };

  window.addEventListener("resize", setBannerHeight);

  return (
    <>
      <HeroBanner
        isHomePage={false}
        heroBannerImageMobile={HeroBanner_810}
        heroBannerImage={HeroBanner_810}
        height={heroBannerHeight}
      />
      <Loader />
    </>
  );
};

export default LoginRedirect;
