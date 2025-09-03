import callAPI from "../commons/callAPI";
import config from "../commons/config";
import { getUserInfo } from "../commons/util/helperFunctions";
import PushAlert from "../components/atoms/pushAlert";

export const becomeMember = async (loggedIn) => {
  try {
    let apiURL = config.api.user.become_member;
    let apiResponse;
    if (loggedIn) {
      apiResponse = await callAPI.put(apiURL);
    } else {
      apiResponse = await callAPI.get(apiURL, {});
    }
    let regResponse = await apiResponse.json();

    if (regResponse.status === 200) {
      let data = await getUserInfo();
      if (data) {
        PushAlert.success(regResponse.message);
        return { becomeMember: true, infoApi: true };
      } else {
        return { becomeMember: true, infoApi: false };
      }
    } else {
      PushAlert.info(regResponse.message);
      return { becomeMember: false, infoApi: false };
    }
  } catch (e) {
    return { becomeMember: false, infoApi: false };
  }
};

export const isMember = async () => {
  let user_token = null;

  if (localStorage.getItem("userData")) {
    user_token =
      JSON.parse(localStorage.getItem("userData"))?.metadata?.status?.r360
        ?.token !== undefined
        ? JSON.parse(localStorage.getItem("userData"))?.metadata?.status?.r360
            ?.token
        : "";
  } else {
    let data = await getUserInfo("metadata");

    user_token =
      data?.status?.r360?.token !== undefined ? data?.status?.r360?.token : "";
  }

  if (user_token) {
    return user_token;
  } else {
    return false;
  }
};
