export const getLocalStorage = (key) => {
  return JSON.parse(window.localStorage.getItem(key));
};

export const getLocalStorageConfig = (key) => {
  try {
    const value = localStorage.getItem(key);
    console.log("getLocalStorageConfig", value);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const setLocalStorage = (key, data) => {
  return window.localStorage.setItem(key, JSON.stringify(data));
};

export const removeLocalStorage = (key) => {
  window.localStorage.removeItem(key);
};

export const removeLocalStorageMultiple = (keys) => {
  keys.forEach((key) => {
    window.localStorage.removeItem(key);
  });
};

export const clearLocalStorage = (key) => {
  window.localStorage.clear();
};

export const getSessionStorage = (key) => {
  const item = window?.sessionStorage?.getItem(key);
  if (item === null || item === "undefined" || item === "") {
    return null;
  }
  return JSON.parse(item);
};

export const setSessionStorage = (key, data) => {
  return window.sessionStorage.setItem(key, JSON.stringify(data));
};

export const removeSessionStorage = (key) => {
  window.sessionStorage.removeItem(key);
};

export const clearSessionStorage = (key) => {
  window.sessionStorage.clear();
};
