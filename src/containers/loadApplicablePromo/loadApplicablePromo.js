import { Fragment, useEffect } from "react";
import { useCookies } from "react-cookie";
import { getAppConfig } from "../../commons/util/appConfigHelper";
import {
  applicablepromo,
  getUserInfo,
} from "../../commons/util/helperFunctions";
import { setSessionStorage } from "../../util/storageUtil";

const LoadApplicablePromo = (props) => {
  const [cookies] = useCookies(["gwLoginData"]);

  useEffect(() => {
    //on app load
    getApplicablePromo();
  }, []);

  const getApplicablePromo = async () => {
    if (cookies.gwLoginData && getAppConfig("CALL_PROMO_API")) {
      let data = await getUserInfo();
      if (data?.userId) {
        let getPromoData = await applicablepromo(window.atob(data.userId), "L");
        setSessionStorage("availablePromo", getPromoData);
      }
    }
  };

  return <Fragment>{props.children}</Fragment>;
};

export default LoadApplicablePromo;
