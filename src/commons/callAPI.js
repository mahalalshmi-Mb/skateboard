import PushAlert from "../components/atoms/pushAlert";
import { edpApi } from "./apiGodFile";
import config from "./config";
import { shouldUpdateEnvProps } from "./util/appConfigHelper";
import { deleteAllCookies, isLoggedIn } from "./util/helperFunctions";

const options = {
  withCredentials: true,
  credentials: "include",
};

const callAPI = {
  get: async (url, params, headers, counter = 0) => {
    // void 0 === params && (params = {});

    const headerParams = JSON.parse(
      localStorage.getItem("headerParams") || "{}"
    );
    let apiResponse = {};
    let reqURL = url;

    if (params) {
      const queryParams = Object.entries(params)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return value
              .map(
                (val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
              )
              .join("&");
          }
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .join("&");

      reqURL += `?${queryParams}`;
    }

    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headerParams,
        },
        ...options,
      };

      apiResponse = await fetch(reqURL, requestOptions);

      apiResponse = await handleResponse(
        apiResponse,
        callAPI.get,
        url,
        params,
        null,
        counter
      );

      return apiResponse;
    } catch (e) {
      console.log("ERROR in fetching request => ", e);
      throw Error;
    }
  },
  post: async (url, body, headers, params, counter = 0) => {
    const headerParams = JSON.parse(
      localStorage.getItem("headerParams") || "{}"
    );
    let apiResponse = {};

    try {
      // Construct the URL with query parameters
      const urlObj = new URL(url);
      if (params) {
        Object.keys(params).forEach((key) =>
          urlObj.searchParams.append(key, params[key])
        );
      }

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
          ...headerParams,
        },
        body: JSON.stringify(body),
        ...options,
      };

      apiResponse = await fetch(urlObj.toString(), requestOptions);

      apiResponse = await handleResponse(
        apiResponse,
        callAPI.post,
        url,
        body,
        headers,
        counter
      );

      return apiResponse;
    } catch (e) {
      console.log("ERROR in fetching request => ", e);
      throw Error;
    }
  },
  upload: async (url, dataObj, accountId = "", counter = 0) => {
    const headerParams = JSON.parse(
      localStorage.getItem("headerParams") || "{}"
    );
    let apiResponse = {};
    let formData = new FormData();

    try {
      for (let key in dataObj) {
        formData.append(key, dataObj[key]);
      }

      const requestOptions = {
        method: "POST",
        headers: {
          accountId,
          ...headerParams,
        },
        body: formData,
        ...options,
      };

      apiResponse = await fetch(url, requestOptions);

      apiResponse = await handleResponse(
        apiResponse,
        callAPI.upload,
        url,
        dataObj,
        accountId,
        counter
      );
      return apiResponse;
    } catch (e) {
      console.log("ERROR in fetching request => ", e);
      throw Error;
    }
  },
  put: async (url, body, counter = 0, params, headers) => {
    const headerParams = JSON.parse(
      localStorage.getItem("headerParams") || "{}"
    );
    let apiResponse = {};

    try {
      // Construct the URL with query parameters
      const urlObj = new URL(url);
      if (params) {
        Object.keys(params).forEach((key) =>
          urlObj.searchParams.append(key, params[key])
        );
      }

      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headerParams,
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
        ...options,
      };

      apiResponse = await fetch(urlObj.toString(), requestOptions);
      apiResponse = await handleResponse(
        apiResponse,
        callAPI.put,
        url,
        body,
        null,
        counter
      );
      return apiResponse;
    } catch (e) {
      console.log("ERROR in fetching request => ", e);
      throw Error;
    }
  },
  putFormData: async (url, dataObj, counter = 0) => {
    const headerParams = JSON.parse(
      localStorage.getItem("headerParams") || "{}"
    );
    let apiResponse = {};
    let formData = new FormData();

    try {
      for (let key in dataObj) {
        formData.append(key, dataObj[key]);
      }

      const requestOptions = {
        method: "PUT",
        headers: {
          Accept: "*/*",
          ...headerParams,
        },
        body: formData,
        ...options,
      };

      apiResponse = await fetch(url, requestOptions);

      apiResponse = await handleResponse(
        apiResponse,
        callAPI.putFormData,
        url,
        dataObj,
        null,
        counter
      );
      return apiResponse;
    } catch (e) {
      console.log("ERROR in fetching request => ", e);
      throw Error;
    }
  },
  delete: async (url, params, body, counter = 0) => {
    const headerParams = JSON.parse(
      localStorage.getItem("headerParams") || "{}"
    );
    let apiResponse;

    void 0 === params && (params = {});

    let reqURL = Object.keys(params).reduce(
      (acc, curr) => `${acc}${curr}=${encodeURIComponent(params[curr])}&`,
      url + "?"
    );

    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...headerParams,
        },
        body: body ? JSON.stringify(body) : null,
        ...options,
      };

      apiResponse = await fetch(reqURL, requestOptions);
      apiResponse = await handleResponse(
        apiResponse,
        callAPI.delete,
        url,
        params,
        null,
        counter
      );
      return apiResponse;
    } catch (e) {
      console.log("ERROR in fetching request => ", e);
      throw Error;
    }
  },
  patch: async (url, body, headers, counter = 0, params) => {
    const headerParams = JSON.parse(
      localStorage.getItem("headerParams") || "{}"
    );
    let apiResponse = {};

    try {
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...headers,
          ...headerParams,
        },
        body: JSON.stringify(body),
        ...options,
      };

      apiResponse = await fetch(url, requestOptions);
      apiResponse = await handleResponse(
        apiResponse,
        callAPI.patch,
        url,
        body,
        headers,
        counter
      );
      return apiResponse;
    } catch (e) {
      console.log("ERROR in fetching request => ", e);
      throw Error;
    }
  },
  getS3: async (url, params, counter = 0) => {
    void 0 === params && (params = {});

    let apiResponse = {};

    let reqURL = Object.keys(params).reduce(
      (acc, curr) => `${acc}${curr}=${encodeURIComponent(params[curr])}&`,
      url
    );

    try {
      const requestOptions = {
        method: "GET",
      };

      apiResponse = await fetch(reqURL, requestOptions);

      return apiResponse;
    } catch (e) {
      console.log("ERROR in fetching request => ", e);
      throw Error;
    }
  },
  postFormData: async (url, dataObj, headers, counter = 0) => {
    const headerParams = JSON.parse(
      localStorage.getItem("headerParams") || "{}"
    );
    let apiResponse = {};
    let formData = new FormData();

    try {
      for (let key in dataObj) {
        formData.append(key, dataObj[key]);
      }

      const requestOptions = {
        method: "POST",
        headers: {
          ...headerParams,
          ...headers,
        },
        body: formData,
        ...options,
      };

      apiResponse = await fetch(url, requestOptions);

      apiResponse = await handleResponse(
        apiResponse,
        callAPI.postFormData,
        url,
        dataObj,
        null,
        counter
      );
      return apiResponse;
    } catch (e) {
      console.log("ERROR in fetching request => ", e);
      throw Error;
    }
  },
  formData: async (url, dataObj, headers, counter = 0) => {
    const headerParams = JSON.parse(
      localStorage.getItem("headerParams") || "{}"
    );
    let apiResponse = {};

    try {
      const requestOptions = {
        method: "POST",
        headers: {
          ...headerParams,
          ...headers,
        },
        body: dataObj,
        ...options,
      };

      apiResponse = await fetch(url, requestOptions);

      apiResponse = await handleResponse(
        apiResponse,
        callAPI.formData,
        url,
        dataObj,
        null,
        counter
      );
      return apiResponse;
    } catch (e) {
      console.log("ERROR in fetching request => ", e);
      throw Error;
    }
  },
};

export const handleResponse = async (
  response,
  callback,
  url,
  data,
  headers,
  counter = 0
) => {
  //**code to handle appConfig env's from strapi */
  handleEnvVersionCheck(response, url);
  if (counter > 1) {
    PushAlert.error("Something went wrong");
    window.location.href = `${window.location.origin}/`;
    return;
  }
  if (response.status === 498 || response.status === 401) {
    let refreshResponse = await handleToken();
    if (refreshResponse) {
      const callbackResponse = await callback(url, data, headers, counter + 1);
      if (callbackResponse) {
        return callbackResponse;
      }
    }
  } else {
    return response;
  }
};

export const handleEnvVersionCheck = async (res, url) => {
  let version = await res.headers.get("X-Custom-Appconfig-Version");
  if (!url.includes("/api/config")) {
    shouldUpdateEnvProps(version);
  }
};

export const handleToken = async () => {
  //referCookieDirectly

  if (isLoggedIn()) {
    const success = await callTokenApi.refresh();
    if (success) {
      return success;
    } else {
      PushAlert.info("You have been logged out");
      deleteAllCookies();
      const guestSuccess = await callTokenApi.guest();
      if (guestSuccess) {
        return guestSuccess;
      } else {
        PushAlert.info("Something went wrong, please refresh");
        window.location.reload();
      }
    }
  } else {
    const success = await callTokenApi.guest();
    if (success) {
      return success;
    } else {
      PushAlert.info("Something went wrong, please refresh");
      window.location.reload();
    }
  }
  return true;
};

export const callTokenApi = {
  guest: async () => {
    try {
      const response = await edpApi({
        method: "GET",
        url: config.api.guest.guestLogin,
      });

      const { data } = response;
      return data.status === 200;
    } catch (error) {
      return false;
    }
  },
  refresh: async () => {
    try {
      const response = await edpApi({
        method: "PUT",
        url: config.api.login.refresh,
      });
      const { data } = response;
      return data.status === 200;
    } catch (error) {
      return false;
    }
  },
};

export default callAPI;
