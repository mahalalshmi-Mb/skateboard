import { getLocalStorage, setLocalStorage } from "../../util/storageUtil";
import callAPI from "../callAPI";
import config from "../config";

//**Compare if config version is same as in local storage */
export const shouldUpdateEnvProps = (configVersion) => {
  const data = getLocalStorage("appConfig");
  if (data && data?.configVer) {
    if (
      configVersion !== null &&
      configVersion !== undefined &&
      data?.configVer !== configVersion
    ) {
      callAppConfigApi();
    } else {
      return false;
    }
  }
};

//**Get App Config from strapi */
export const callAppConfigApi = async () => {
  try {
    let apiURL = config.api.appEnvProps.envProps;
    let apiResponse = await callAPI.get(apiURL);
    let regResponse = await apiResponse.json();
    if (apiResponse.status === 200) {
      const data = regResponse?.data?.[0]?.attributes || {};
      const updated = updateEnvProps(data);
      const found = regResponse?.data?.[0]?.attributes?.props?.find(
        (x) => x?.title === "gatewayURL"
      );
      if (found && found?.value !== "") {
        updateProtectedApis(found?.value);
      }

      return updated;
    } else {
      return true;
    }
  } catch (e) {
    console.log(e);
    return true;
  }
};

export const updateProtectedApis = (secondaryGatewayUrl) => {
  config.api.logout = `${secondaryGatewayUrl}/gw/api/logout`;
  config.api.user.info = `${secondaryGatewayUrl}/gw/api/user/info`;
  config.api.user.update = `${secondaryGatewayUrl}/pax2/v2/api/user/updateUser`;
  config.api.user.updateAccount = `${secondaryGatewayUrl}/pax2/v2/api/user/updateAccount`;
  config.api.user.updateProfileImage = `${secondaryGatewayUrl}/pax2/v2/api/user/image/profile/save`;
  config.api.user.delete = `${secondaryGatewayUrl}/gw/api/user/delete`;
  config.api.user.referral_check = `${secondaryGatewayUrl}/pax2/v2/api/user/lms/referral/check`;
  config.api.user.become_member = `${secondaryGatewayUrl}/pax2/v2/api/user/lms/membership/apply`;
  config.api.user.membership_status = `${secondaryGatewayUrl}/pax2/v2/api/user/lms/membership/status`;
  config.api.user.requestOtpUpdateEmail = `${secondaryGatewayUrl}/gw/api/user/request/update/email/= email`;
  config.api.user.updateEmail = `${secondaryGatewayUrl}/gw/api/user/update/email`;
  config.api.user.requestOtpUpdateMobile = `${secondaryGatewayUrl}/gw/api/user/request/update/mobile/= mobile`;
  config.api.user.updateMobile = `/gw/api/user/update/mobile`;
  config.api.user.communication.channels = `${secondaryGatewayUrl}/pax2/v2/api/user/communication/channels`;
  config.api.user.communication.preferences = `${secondaryGatewayUrl}/pax2/v2/api/user/communication/preferences`;
  config.api.cart.myCart = `${secondaryGatewayUrl}/pax2/v2/api/cart/mycart`;
  config.api.cart.saveCart = `${secondaryGatewayUrl}/pax2/v2/api/cart/save`;
  config.api.cart.summary = `${secondaryGatewayUrl}/pax2/v2/api/cart/summary`;
  config.api.payment.gatewayConfiguration = `${secondaryGatewayUrl}/pax2/v2/api/payment/gatewayConfiguration`;
  config.api.payment.completeOrder = `${secondaryGatewayUrl}/pax2/v2/api/order/complete`;
  config.api.payment.orderSummaryV2 = `${secondaryGatewayUrl}/pax2/v2/api/order/summary`;
  config.api.checkout.checkout = `${secondaryGatewayUrl}/pax2/v2/api/cart/checkout`;
  config.api.myOrders.activeOrders = `${secondaryGatewayUrl}/pax2/v2/api/order/active`;
  config.api.myOrders.pastOrders = `${secondaryGatewayUrl}/pax2/v2/api/order/past`;
  config.api.myOrders.cancelService = `${secondaryGatewayUrl}/pax2/v2/api/order/cancel`;
  config.api.helpAndSupport.assistMe = `${secondaryGatewayUrl}/helpdesk/api/assist/me`;
  config.api.helpAndSupport.createTicket = `${secondaryGatewayUrl}/helpdesk/api/ticket/create`;
  config.api.helpAndSupport.ticketListing = `${secondaryGatewayUrl}/helpdesk/api/ticket/list`;
  config.api.auth.initiate = `${secondaryGatewayUrl}/register/initiate`;
  config.api.auth.validate = `${secondaryGatewayUrl}/register/validate`;
  config.api.braintreePayment.paymentProcess = `${secondaryGatewayUrl}/pax2/v2/api/payment/braintree/processPayment`;
  config.api.employeeRegister = `${secondaryGatewayUrl}/gw/api/employee/enroll/empId`;
  config.api.employeeUnRegister = `${secondaryGatewayUrl}/gw/api/employee/delist`;
};

//**Update local storage */
export const updateEnvProps = (data) => {
  let configObj = { ...data };
  data?.flags?.forEach((x) => {
    configObj[x.title] = x.value;
  });
  data?.props?.forEach((x) => {
    configObj[x.title] = x.value;
  });
  setLocalStorage("appConfig", configObj);

  return true;
};

//**Check app config */
export const getAppConfig = (key) => {
  let appConfig = getLocalStorage("appConfig");

  if (appConfig) {
    return appConfig[key];
  } else {
    let config = false;
    config = process.env[`REACT_APP_${key}`];
    if (config === "true") {
      config = true;
    } else if (config === "false") {
      config = false;
    }
    return config;
  }
};

//is app config available
export const isAppConfigLoaded = () => {
  let appConfig = getLocalStorage("appConfig");
  if (appConfig) {
    return true;
  }
};
