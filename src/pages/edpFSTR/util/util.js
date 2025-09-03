import { getSessionStorage } from "../../../util/storageUtil";
import { productDomain } from "../pages/config/config";

export const getPageName = (pageUrl, domain) => {
  let pageName = "";
  switch (pageUrl) {
    case "/takeaway":
      if (domain === "Food and Beverages" || domain === "Gift Shop") {
        pageName = domain;
      } else {
        pageName = "Food and Beverages";
      }
      break;
    case "/spring-market":
      pageName = "spring-market";
      break;
    case "/store-listing":
      if (domain === "Food and Beverages" || domain === "Gift Shop") {
        pageName = domain;
      } else {
        pageName = "";
      }
      break;
    case "/storefront":
      if (domain === "Food and Beverages" || domain === "Gift Shop") {
        pageName = domain;
      } else {
        pageName = "";
      }
      break;
    case "/brand-listing":
      pageName = "Brand";
      break;
    default:
      pageName = "";
  }
  return pageName;
};

export const filterCartItems = (ClientCart, conflictingStoreId) => {
  const cartCopy = { ...ClientCart.getCart() };

  let _cartObjects = {};

  const data = JSON.parse(JSON.stringify(getSessionStorage("productsData")));

  if (data?.domain?.includes(productDomain.dutyFree)) {
    Object.keys(cartCopy).forEach((key) => {
      if (
        cartCopy[key]?.storeNm?.includes(productDomain.dutyFree) &&
        cartCopy[key]?.items?.length > 0
      ) {
        _cartObjects[key] = cartCopy[key];
      }
    });
  } else {
    Object.keys(cartCopy).forEach((key) => {
      if (
        !cartCopy[key]?.storeNm?.includes(productDomain.dutyFree) &&
        cartCopy[key]?.items?.length > 0
      ) {
        _cartObjects[key] = cartCopy[key];
      }
    });
  }

  if (conflictingStoreId.length > 0) {
    conflictingStoreId.forEach((storeId) => {
      delete _cartObjects[storeId];
    });
  }
  ClientCart.set(_cartObjects);
};

export const checkForConflictingStore = (
  data,
  ClientCart,
  setCartConfirmationPromptOpen,
  setConflictingStoreId,
  history,
  proceedForTakeaway
) => {
  if (data?.domain?.includes(productDomain.dutyFree)) {
    const cartObjects = ClientCart.getCart();
    let containsFnbItems = false;

    let dutyFreeItem = {};
    Object.keys(cartObjects).forEach((key) => {
      if (
        cartObjects[key]?.domain?.includes(productDomain.dutyFree) &&
        cartObjects[key]?.items?.length > 0
      ) {
        dutyFreeItem = cartObjects[key];
      }
      if (cartObjects[key]?.domain?.includes(productDomain.fnb)) {
        containsFnbItems = true;
      }
    });

    if (Object.keys(dutyFreeItem).length !== 0) {
      if (
        dutyFreeItem.movementType !== data.movementType ||
        dutyFreeItem.sector !== data.sector ||
        dutyFreeItem.terminal !== data.terminal
      ) {
        setCartConfirmationPromptOpen(true);
        setConflictingStoreId([dutyFreeItem.storeId]);
      } else {
        if (containsFnbItems) {
          setCartConfirmationPromptOpen(true);
          setConflictingStoreId([]);
        } else {
          proceedForTakeaway();
        }
      }
    } else {
      if (containsFnbItems) {
        setCartConfirmationPromptOpen(true);
        setConflictingStoreId([]);
      } else {
        proceedForTakeaway();
      }
    }
  } else {
    const cartObjects = ClientCart.getCart();
    let fnbItems = {};
    let containsDutyFreeItems = false;

    Object.keys(cartObjects).forEach((key) => {
      if (
        cartObjects[key]?.domain?.includes(productDomain.fnb) &&
        cartObjects[key]?.items?.length > 0
      ) {
        fnbItems[key] = cartObjects[key];
      }
      if (cartObjects[key]?.domain?.includes(productDomain.dutyFree)) {
        containsDutyFreeItems = true;
      }
    });

    if (Object.keys(fnbItems).length !== 0) {
      let _conflictingStoreId = [];
      Object.keys(fnbItems).forEach((key) => {
        if (
          fnbItems[key]?.movementType !== data.movementType ||
          fnbItems[key]?.sector !== data.sector ||
          fnbItems[key]?.terminal !== data.terminal
        ) {
          _conflictingStoreId.push(fnbItems[key].storeId);
        }
      });

      if (_conflictingStoreId.length === 0) {
        if (containsDutyFreeItems) {
          setCartConfirmationPromptOpen(true);
          setConflictingStoreId([]);
        } else {
          proceedForTakeaway();
        }
      } else {
        setConflictingStoreId(_conflictingStoreId);
        setCartConfirmationPromptOpen(true);
      }
    } else {
      if (containsDutyFreeItems) {
        setCartConfirmationPromptOpen(true);
        setConflictingStoreId([]);
      } else {
        proceedForTakeaway();
      }
    }
  }
};
