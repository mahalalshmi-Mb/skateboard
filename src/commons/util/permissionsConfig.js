import config from "../config";
import callAPI from "../callAPI";
import { removeCookieCustom, setCookieCustom } from "./cookieUtil";

export const setUserPermission = async () => {
  //**get user permission by passing access token */
  try {
    let apiUrl = config.api.permission.userPermission.replace(
      "{{appType}}",
      "pax"
    );
    let apiResponse = await callAPI.get(apiUrl);
    let regResponse = await apiResponse.json();

    if (regResponse && regResponse.status === 200) {
      setCookieCustom("userPermissionData", regResponse.data);
      return regResponse.data;
    }
  } catch (error) {
    console.log("Log: error in fetching user permissions");
  }
};

export const resetUserPermission = () => {
  //**remove user permission by passing access token */
  try {
    removeCookieCustom("userPermissionData");
  } catch (error) {
    console.log("Log: error in fetching user permissions");
  }
};
