export const getCookieCustom = (cName) => {
  const name = cName + '=';
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split('; ');
  let res;
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });

  return res;
};

export const setCookieCustom = (key, value) => {
  document.cookie = `${key}=${JSON.stringify(
    value
  )};max-age=${cookieValidity};path='/'`;
};

export const removeCookieCustom = (name) => {
  document.cookie = `${name}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const cookieValidity = 60 * 60 * 24 * 30;
