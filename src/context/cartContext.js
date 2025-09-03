import React, { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import {
  getLocalStorage,
  getSessionStorage,
  setLocalStorage,
  setSessionStorage,
} from "../util/storageUtil";
import Util from "../commons/util/util";
import config from "../commons/config";
import callAPI from "../commons/callAPI";
import { getAppConfig } from "../commons/util/appConfigHelper";

import {
  isLoggedIn,
  sortByKey,
  toLowerCaseObject,
} from "../commons/util/helperFunctions";
import {
  getPriceArrayFromPreference,
  getTitleArrayFromPreference,
} from "../util/analytics/cdp/Constant";

const CartContext = React.createContext();

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

const CartProvider = (props) => {
  const debounceSaveLocalCart = useCallback(debounce(saveLocalCart, 200), []);
  const [cart, setCart] = useState(getLocalStorage("cart") || {});
  const [dineInCart, setDineInCart] = useState(
    getLocalStorage("dineInCart") || {}
  );

  useEffect(() => {
    /* Runs when cart object changes */
    setLocalStorage("cart", cart);
  }, [cart]);

  useEffect(() => {
    /* Runs when cart object changes */
    setLocalStorage("dineInCart", dineInCart);
  }, [dineInCart]);

  function set(obj, skipSaveCart) {
    let cartObj = JSON.parse(JSON.stringify(obj));
    setCart(cartObj);
    setLocalStorage("cart", cartObj);
    if (isLoggedIn() && !skipSaveCart) {
      debounceSaveLocalCart(cartObj);
    }
    handleTipping(cartObj);
  }

  function handleTipping(cartObj) {
    const cartStoreIds = Object.keys(cartObj);
    let tipData = getSessionStorage("tipData") || [];
    tipData = tipData?.filter((x) => cartStoreIds?.includes(x?.storeId));
    setSessionStorage("tipData", tipData);
  }

  function setCartDineIn(obj) {
    let cartObj = JSON.parse(JSON.stringify(obj));
    setDineInCart(cartObj);
    setLocalStorage("dineInCart", cartObj);
  }

  function reset() {
    const dineInSessionData = getSessionStorage("dine-in");
    const isDineIn = dineInSessionData?.storeId || "" !== "";
    if (isDineIn) {
      setDineInCart({});
      setLocalStorage("dineInCart", {});
    } else {
      setCart({});
      setLocalStorage("cart", {});
      clearSavedLocalCart();
    }
  }

  function getCartObj() {
    const dineInSessionData = getSessionStorage("dine-in");
    const isDineIn = dineInSessionData?.storeId || "" !== "";
    return isDineIn ? dineInCart : cart;
  }

  function updateCartAndStorage(cartObj, skipSaveCart) {
    const dineInSessionData = getSessionStorage("dine-in");
    const isDineIn = dineInSessionData?.storeId || "" !== "";
    if (isDineIn) {
      setCartDineIn(cartObj);
      setLocalStorage("dineInCart", cartObj);
    } else {
      set(cartObj, skipSaveCart);
      setLocalStorage("cart", cartObj);
    }
  }

  function addItem(params, skipSaveCart) {
    const storeId = params.storecode;
    const storeNm = params.storename;

    const movementType = params?.movementType;
    const sector = params?.sector;
    const terminal = params?.terminal;
    const domain = params?.domain;
    let fulfilmentType = params?.fulfilmentType;

    const dineInSessionData = getSessionStorage("dine-in");
    const isDineIn = dineInSessionData?.storeId || "" !== "";
    if (isDineIn) {
      fulfilmentType = "DineIn";
    }

    let newItem = params.item;

    if (!newItem.deliveryOptions) {
      newItem.deliveryOptions = {};
    }

    let cartObj = getCartObj();

    if (cartObj) {
      if (void 0 === cartObj[storeId]) {
        cartObj[storeId] = {
          storeId,
          storeNm,
          movementType,
          sector,
          terminal,
          domain,
          fulfilmentType,
          items: [],
        };
      }
      if (!hasItem(params)) {
        cartObj[storeId].items.push(newItem);
      }
      updateCartAndStorage(cartObj, skipSaveCart);

      Util.sendMessageToReactNative("Added To Cart", newItem);
      Util.triggerMoEngageEvent("add_to_cart", params.item);

      return true;
    } else {
      reset();
      return false;
    }
  }

  function removeItem(params) {
    const storeId = params.storecode;

    let cartObj = getCartObj();

    if (cartObj && cartObj[storeId]) {
      cartObj[storeId].items = cartObj[storeId].items.filter(
        (x) => x.itemId !== params.productId
      );
      updateCartAndStorage(cartObj);
    }
  }

  function updateItem(params) {
    const cartObj = getCartObj();
    if (cartObj && cartObj[params.storecode]) {
      cartObj[params.storecode].items.forEach(
        (x) =>
          x.itemId === params.productId && (x.itemQuantity = params.quantity)
      );
      updateCartAndStorage(cartObj);
    }

    0 === params.quantity && removeItem(params);
  }

  function updateSelectedFlight(params) {
    const cartObj = getCartObj();
    if (cartObj && cartObj[params.storecode]) {
      cart[params.storecode].items.forEach((x) => {
        if (params.flightId && params.flightUid) {
          x.flightId = params.flightId;
          x.flightUid = params.flightUid;
        }
      });
      updateCartAndStorage(cartObj);
    }
  }

  function updateSelectedAddon(params) {
    const cartObj = getCartObj();
    if (cartObj && cartObj[params.storecode]) {
      cartObj[params.storecode].items.forEach(
        (x) => x.itemId === params.productId && (x.addOn = params.addOn)
      );
      updateCartAndStorage(cartObj);
    }
  }

  function getCart() {
    const dineInSessionData = getSessionStorage("dine-in");
    const isDineIn = dineInSessionData?.storeId || "" !== "";
    return isDineIn ? dineInCart : cart;
  }

  function getItem(params) {
    let cItem;
    const storeId = params.storecode;

    const cartObj = getCartObj();
    if (cartObj && cartObj[storeId]) {
      cartObj[storeId].items.forEach(
        (x) => x.itemId === params.productId && (cItem = x)
      );
    }

    return cItem;
  }

  function getItems(_obj) {
    let items = [];
    const dineInSessionData = getSessionStorage("dine-in");
    const isDineIn = dineInSessionData?.storeId || "" !== "";
    const obj = _obj ? _obj : isDineIn ? dineInCart : cart;

    obj && Object.values(obj).forEach((x) => (items = items.concat(x.items)));

    return items;
  }

  function getStoreItems(storeId) {
    const dineInSessionData = getSessionStorage("dine-in");
    const isDineIn = dineInSessionData?.storeId || "" !== "";
    if (isDineIn) {
      return dineInCart && dineInCart[storeId] ? dineInCart[storeId].items : [];
    } else {
      return cart && cart[storeId] ? cart[storeId].items : [];
    }
  }

  function isEmpty(_obj) {
    let flag = true;
    const dineInSessionData = getSessionStorage("dine-in");
    const isDineIn = dineInSessionData?.storeId || "" !== "";
    const obj = _obj ? _obj : isDineIn ? dineInCart : cart;

    if (obj) {
      for (let store in obj) {
        if (obj[store]) {
          0 < obj[store].items.length && (flag = false);
        }
      }
    }

    return flag;
  }

  function hasItem(params) {
    const storeId = params.storecode;
    let flag = false;

    if (cart && cart[storeId]) {
      cart[storeId].items.forEach(
        (x) => x.itemId === params.productId && (flag = true)
      );
    }

    return flag;
  }

  function hasService(params) {
    const storeId = params.storecode;
    let flag = false;
    if (cart && cart[storeId]) {
      if (params.flightUid && params.flightUid !== "") {
        cart[storeId].items.forEach((x) => {
          if (
            x.itemId === params.productId &&
            x.flightUid === params.flightUid
          ) {
            flag = true;
          }
        });
      } else {
        cart[storeId].items.forEach(
          (x) => x.itemId === params.productId && (flag = true)
        );
      }
    }
    return flag;
  }

  function removeService(params) {
    const storeId = params.storecode;

    let cartObj = cart;
    if (cartObj && cartObj[storeId]) {
      if (params.flightUid && params.flightUid !== "") {
        cartObj[storeId].items = cartObj[storeId].items.filter((x) => {
          return (
            x.itemId !== params.productId || x.flightUid !== params.flightUid
          );
        });
      } else {
        cartObj[storeId].items = cartObj[storeId].items.filter(
          (x) => x.itemId !== params.productId
        );
      }
      set(cartObj);
      setLocalStorage("cart", cartObj);
    }
  }

  function updateService(params, skipSaveCart) {
    if (cart && cart[params.storecode]) {
      if (params.flightUid && params.flightUid !== "") {
        cart[params.storecode].items.forEach((x) => {
          if (
            x.itemId === params.productId &&
            x.flightUid === params.flightUid
          ) {
            x.itemQuantity = params.quantity;
          }
        });
      } else {
        cart[params.storecode].items.forEach(
          (x) =>
            x.itemId === params.productId && (x.itemQuantity = params.quantity)
        );
      }
      set(cart, skipSaveCart);
      setLocalStorage("cart", cart);
    }

    0 === params.quantity && removeService(params);
  }

  function isAlreadyAdded(params) {
    const storeId = params.storeId;

    const cartObj = getCartObj();
    if (cartObj && cartObj[storeId]) {
      const items = cartObj[storeId].items;

      const isAddOnPreferencesAvailable =
        params.addOn !== undefined ||
        params.customisationPreferences !== undefined;

      let variablesMatched = false;

      for (const item of items) {
        if (params?.item?.pVariables) {
          variablesMatched = params.item.pVariables.includes(item.itemId);
        }
        if (isAddOnPreferencesAvailable) {
          if (variablesMatched || item.itemId === params.productId) {
            let addOnMatched = false;
            let customisationPreferencesMatched = false;
            if (params.addOn && item.addOn) {
              addOnMatched = compareArrayOfObjects(item.addOn, params.addOn);
            }
            if (
              params.customisationPreferences &&
              item.customisationPreferences
            ) {
              customisationPreferencesMatched = compareArrayOfObjects(
                params.customisationPreferences,
                item.customisationPreferences
              );
            }
            if (addOnMatched && customisationPreferencesMatched) {
              return true;
            } else {
              return false;
            }
          }
        } else {
          if (variablesMatched || item.itemId === params.productId) {
            return true;
          }
        }
      }
      return false;
    }
  }

  function isAlreadyAddedUpdated(params) {
    const cartObj = getCartObj();
    if (cartObj && cartObj[params.storeId]) {
      const items = cartObj[params.storeId].items;
      let matchingItems;
      if (
        params?.item?.pVariables?.length > 0 &&
        params?.item?.pVariables !== undefined
      ) {
        matchingItems = items.filter((item) =>
          params?.item?.pVariables.includes(item.itemId)
        );
      } else {
        matchingItems = items.filter(
          (item) => item.itemId === params.productId
        );
      }

      if (params.addOn || params.customisationPreferences) {
        for (const item of matchingItems) {
          const addOnMatched = compareArrayOfObjects(
            item.addOn,
            params.addOn || []
          );
          const itemCustomisationPreferences = getSortedItemPreferences(
            item?.customisationPreferences
          );
          const updatedCustomisationPreferences = getSortedItemPreferences(
            params?.customisationPreferences
          );

          const customisationPreferencesMatched = compareArrayOfObjects(
            itemCustomisationPreferences,
            updatedCustomisationPreferences || []
          );
          if (addOnMatched && customisationPreferencesMatched) {
            return true;
          }
        }
        return false;
      } else {
        return false;
      }
    }
  }

  // Used in Cart Only
  function isPresentInCart(params) {
    const storeId = params.storeId;

    const cartObj = getCartObj();
    if (cartObj && cartObj[storeId]) {
      const items = cartObj[storeId].items;

      for (const item of items) {
        const itemCustomisationPreferences = getSortedItemPreferences(
          item?.customisationPreferences
        );
        const updatedCustomisationPreferences = getSortedItemPreferences(
          params?.customisationPreferences
        );

        if (
          item.itemId === params.productId &&
          compareArrayOfObjects(item.addOn, params.addOn) &&
          compareArrayOfObjects(
            itemCustomisationPreferences,
            updatedCustomisationPreferences
          )
        ) {
          return true;
        }
      }
      return false;
    }
  }

  function updateProductItem(params, skipSaveCart) {
    let addOnUpdated = false;
    let preferenceUpdated = false;

    let updateAddOnPreferences =
      params?.addOn !== undefined ||
      params?.customisationPreferences !== undefined;

    const cartObj = getCartObj();

    let eventName = "product_update";
    let type = "update";

    const additionData = {
      updated_quantity: params.quantity,
    };

    if (cartObj && cartObj[params.storeId]) {
      const items = cartObj[params.storeId].items;
      let matchingItems;
      if (params?.pVariables?.length > 0 && params?.pVariables !== undefined) {
        matchingItems = items.filter((item) =>
          params?.pVariables.includes(item.itemId)
        );
      } else {
        matchingItems = items.filter(
          (item) => item.itemId === params.productId
        );
      }

      if (updateAddOnPreferences) {
        type = "update";

        additionData["type"] = type;
        additionData["updated_preference_selected"] =
          getTitleArrayFromPreference(params.customisationPreferences);
        additionData["updated_preference_price"] = getPriceArrayFromPreference(
          params.customisationPreferences
        );

        for (const item of items) {
          let variablesMatched = false;
          if (params?.item?.pVariables) {
            variablesMatched = params.item.pVariables.includes(item.itemId);
          }

          const addOnMatched = compareArrayOfObjects(
            item.addOn,
            params.item.addOn || []
          );

          const itemCustomisationPreferences =
            item?.customisationPreferences?.map((item) => {
              let { category, title, selection } = item;
              selection = selection?.map(
                ({
                  _id,
                  name,
                  price,
                  preferenceDietCategory,
                  preferenceSku,
                }) => ({
                  preferenceSku,
                  name,
                  price: price,
                })
              );
              selection?.map((item) => toLowerCaseObject(item));
              selection = sortByKey(selection, "name");
              return { title, selection };
            });
          const updatedCustomisationPreferences =
            params?.item?.customisationPreferences?.map((item) => {
              let { category, title, selection } = item;
              selection = selection?.map(
                ({
                  _id,
                  name,
                  price,
                  preferenceDietCategory,
                  preferenceSku,
                }) => ({
                  preferenceSku,
                  name,
                  price: price,
                })
              );
              selection?.map((item) => toLowerCaseObject(item));
              selection = sortByKey(selection, "name");
              return { title, selection };
            });
          const customisationPreferencesMatched = compareArrayOfObjects(
            itemCustomisationPreferences,
            updatedCustomisationPreferences || []
          );

          if (
            (variablesMatched || item.itemId === params.productId) &&
            addOnMatched &&
            customisationPreferencesMatched
          ) {
            if (item.addOn && params.addOn && params.item.addOn) {
              addOnUpdated = compareArrayOfObjects(item.addOn, params.addOn)
                ? false
                : true;
            }
            if (
              item.customisationPreferences &&
              params.customisationPreferences &&
              params.item.customisationPreferences
            ) {
              preferenceUpdated = compareArrayOfObjects(
                item.customisationPreferences,
                params.customisationPreferences
              )
                ? false
                : true;
            }
            if (addOnUpdated) {
              item.addOn = params.addOn;
            }
            if (preferenceUpdated) {
              item.customisationPreferences = params.customisationPreferences;
            }
            if (!addOnUpdated || !preferenceUpdated) {
              if (params.quantity <= 0) {
                const index = items.indexOf(item);
                items.splice(index, 1);
                cartObj[params.storeId].items = items;
                if (items.length === 0) {
                  delete cartObj[params.storeId];
                }
                updateCartAndStorage(cartObj);
                Util.triggerMoEngageEvent(eventName, item, additionData);
                return;
              } else {
                item.itemQuantity = params.quantity;
              }
            }
          }
        }
      } else {
        for (const item of matchingItems) {
          let variablesMatched = false;
          if (
            params?.pVariables?.length > 0 &&
            params?.pVariables !== undefined
          ) {
            variablesMatched = params.pVariables.includes(item.itemId);
          }
          if (variablesMatched) {
            if (params.quantity <= 0) {
              const removedItem = matchingItems.pop();
              const index = items.indexOf(removedItem);
              items.splice(index, 1);
              cartObj[params.storeId].items = items;
              if (items.length === 0) {
                delete cartObj[params.storeId];
              }
              updateCartAndStorage(cartObj);

              type = "remove";

              additionData["type"] = type;
              Util.triggerMoEngageEvent(eventName, removedItem, additionData);

              return;
            } else {
              const item = matchingItems[matchingItems.length - 1];
              const quantity = item.itemQuantity;

              matchingItems[matchingItems.length - 1].itemQuantity =
                params.quantity;

              if (quantity < params.quantity) {
                type = "increment";
              } else {
                type = "decrement";
              }

              additionData["type"] = type;
              Util.triggerMoEngageEvent(eventName, item, additionData);
            }
          } else if (item.itemId === params.productId) {
            if (params.quantity <= 0) {
              const removedItem = matchingItems.pop();
              const index = items.indexOf(removedItem);
              items.splice(index, 1);
              cartObj[params.storeId].items = items;
              if (items.length === 0) {
                delete cartObj[params.storeId];
              }
              updateCartAndStorage(cartObj);

              type = "remove";

              additionData["type"] = type;
              Util.triggerMoEngageEvent(eventName, removedItem, additionData);

              return;
            } else {
              const item = matchingItems[matchingItems.length - 1];
              const quantity = item.itemQuantity;

              matchingItems[matchingItems.length - 1].itemQuantity =
                params.quantity;

              if (quantity < params.quantity) {
                type = "increment";
              } else {
                type = "decrement";
              }

              additionData["type"] = type;
              Util.triggerMoEngageEvent(eventName, item, additionData);
            }
          }
        }
      }

      updateCartAndStorage(cartObj, skipSaveCart);
    }
  }

  function updateRepatedItem(params, skipSaveCart) {
    let updated = false;
    let addOnUpdated = false;
    let preferenceUpdated = false;

    const cartObj = getCartObj();

    if (cartObj && cartObj[params.storeId]) {
      let eventName = "product_update";
      let type = "update";

      const additionData = {
        updated_quantity: params.quantity,
      };

      cartObj[params.storeId].items.forEach((x) => {
        const addOnMatched = compareArrayOfObjects(x.addOn, params.item.addOn);

        const itemCustomisationPreferences = getSortedItemPreferences(
          x?.customisationPreferences
        );
        const previousCustomisationPreferences = getSortedItemPreferences(
          params?.previousPreference
        );

        const customisationPreferencesMatched = compareArrayOfObjects(
          itemCustomisationPreferences,
          previousCustomisationPreferences || []
        );

        if (
          x.itemId === params.productId &&
          addOnMatched &&
          customisationPreferencesMatched
        ) {
          updated = false;
          if (x.addOn && params.item.addOn) {
            if (x.addOn && params.addOn) {
              addOnUpdated = compareArrayOfObjects(x.addOn, params.addOn)
                ? false
                : true;
            }
          }
          if (
            x.customisationPreferences &&
            params.item.customisationPreferences &&
            customisationPreferencesMatched
          ) {
            if (x.customisationPreferences && params.customisationPreferences) {
              preferenceUpdated = compareArrayOfObjects(
                x.customisationPreferences,
                params.customisationPreferences
              )
                ? false
                : true;
            }
          }
          if (addOnUpdated) {
            x.addOn = params.addOn;
          }

          if (Array.isArray(params?.customisationPreferences)) {
            params.customisationPreferences =
              params?.customisationPreferences?.filter(
                (item) =>
                  Array.isArray(item?.selection) && item?.selection?.length > 0
              );
          } else {
            params.customisationPreferences = [];
          }

          if (Array.isArray(params?.preferences)) {
            params.preferences = params?.preferences?.filter(
              (item) => Array.isArray(item?.values) && item?.values?.length > 0
            );
          } else {
            params.preferences = [];
          }

          if (preferenceUpdated) {
            x.customisationPreferences = params.customisationPreferences;
            if (params.preferences !== undefined) {
              x.preferences = params.preferences;
            }
          }
          if (addOnUpdated || preferenceUpdated) {
            updated = true;
          } else {
            updated = false;
          }
          if (updated) {
            additionData["type"] = "update";
            additionData["previous_preference_selected"] =
              getTitleArrayFromPreference(itemCustomisationPreferences);
            additionData["previous_preference_price"] =
              getPriceArrayFromPreference(itemCustomisationPreferences);

            Util.triggerMoEngageEvent(eventName, x, additionData);

            if (params?.quantity <= 0) {
              removeProductItem(params);
            } else {
              x.itemQuantity = params.quantity;
            }
            if (params?.itemPrice && params?.itemPrice > 0) {
              x.itemPrice = params.itemPrice;
            }
          }
        }
      });
      updateCartAndStorage(cartObj, skipSaveCart);
    }
  }

  function removeProductItem(params, skipSaveCart) {
    const storeId = params.storeId;
    let addOnFlag = false;
    let preferenceFlag = false;

    const cartObj = getCartObj();

    if (cartObj && cartObj[storeId]) {
      cartObj[storeId].items = cartObj[storeId].items.filter((x) => {
        if (x.itemId === params.productId) {
          if (x.addOn && params.addOn) {
            addOnFlag = compareArrayOfObjects(x.addOn, params.addOn)
              ? false
              : true;
          }
          if (
            x.customisationPreferences > 0 &&
            params.customisationPreferences > 0
          ) {
            preferenceFlag = compareArrayOfObjects(
              x.customisationPreferences,
              params.customisationPreferences
            )
              ? false
              : true;
          }
          if (addOnFlag || preferenceFlag) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      updateCartAndStorage(cartObj, skipSaveCart);
    }
  }

  function getItemQunatityUpdated(params) {
    let qty = 1;

    const cartObj = getCartObj();
    if (cartObj && cartObj[params.storeId]) {
      const items = cartObj[params.storeId].items;
      let matchingItems;
      if (
        params?.item?.pVariables?.length > 0 &&
        params?.item?.pVariables !== undefined
      ) {
        matchingItems = items.filter((item) =>
          params?.item?.pVariables.includes(item.itemId)
        );
      } else {
        matchingItems = items.filter(
          (item) => item.itemId === params.productId
        );
      }

      if (params.addOn || params.customisationPreferences) {
        for (const item of matchingItems) {
          const addOnMatched = compareArrayOfObjects(
            item.addOn,
            params.addOn || []
          );

          const itemCustomisationPreferences = getSortedItemPreferences(
            item?.customisationPreferences
          );
          const paramsCustomisationPreferences = getSortedItemPreferences(
            params?.customisationPreferences
          );

          const customisationPreferencesMatched = compareArrayOfObjects(
            itemCustomisationPreferences,
            paramsCustomisationPreferences || []
          );

          if (addOnMatched && customisationPreferencesMatched) {
            return item.itemQuantity;
          }
        }
      } else {
        if (matchingItems.length > 0) {
          return matchingItems[matchingItems.length - 1].itemQuantity;
        }
      }
    }
    return qty;
  }

  function getItemQunatity(params) {
    let qty;
    const storeId = params.storeId;
    let flag = false;
    let addOnFlag = false;
    let preferenceFlag = false;

    const cartObj = getCartObj();

    if (cartObj && cartObj[storeId]) {
      try {
        qty =
          cartObj[storeId].items[cartObj[storeId].items.length - 1]
            .itemQuantity;
      } catch (error) {}

      cartObj[storeId].items.forEach((x) => {
        let variablesMatched = false;
        if (params?.item?.pVariables) {
          variablesMatched = params.item.pVariables.includes(x.itemId);
        }
        if (variablesMatched || x.itemId === params.productId) {
          flag = false;
          if (x.addOn !== undefined && params.addOn !== undefined) {
            addOnFlag = compareArrayOfObjects(x.addOn, params.addOn)
              ? true
              : false;
          }
          if (
            x.customisationPreferences !== undefined &&
            params.customisationPreferences !== undefined
          ) {
            preferenceFlag = compareArrayOfObjects(
              x.customisationPreferences,
              params.customisationPreferences
            )
              ? true
              : false;
          }
          if (addOnFlag && preferenceFlag) {
            flag = true;
          } else {
            flag = false;
          }
          if (flag) {
            qty = x.itemQuantity;
          }
        }
      });
    }
    return qty;
  }

  function getCartItem(params) {
    const cartObj = getCartObj();

    if (cartObj && cartObj[params.storeId]) {
      const items = cartObj[params.storeId].items;
      let matchingItems = items.filter((item) => item.itemId === params.itemId);

      if (params.addOn || params.customisationPreferences) {
        for (const item of matchingItems) {
          const addOnMatched = compareArrayOfObjects(
            item.addOn,
            params.addOn || []
          );

          const itemCustomisationPreferences = getSortedItemPreferences(
            item?.customisationPreferences
          );
          const updatedCustomisationPreferences = getSortedItemPreferences(
            params?.customisationPreferences
          );

          const customisationPreferencesMatched = compareArrayOfObjects(
            itemCustomisationPreferences,
            updatedCustomisationPreferences || []
          );

          if (addOnMatched && customisationPreferencesMatched) {
            return item;
          }
        }
        return matchingItems[matchingItems.length - 1];
      } else {
        return matchingItems[matchingItems.length - 1];
      }
    }
  }

  function getCartItemVariables(params) {
    const cartObj = getCartObj();

    if (cartObj && cartObj[params.storeId]) {
      const items = cartObj[params.storeId].items;
      let matchingItems;
      if (params?.pVariables?.length > 0 && params?.pVariables !== undefined) {
        matchingItems = items.filter((item) =>
          params.pVariables.includes(item.itemId)
        );
      } else {
        matchingItems = items.filter((item) => item.itemId === params.itemId);
      }

      return matchingItems[matchingItems.length - 1];
    }
  }

  const compareArrayOfObjects = (arr1, arr2) => {
    const sortObjectKeys = (obj) => {
      const sortedObj = {};
      Object.keys(obj)
        .sort()
        .forEach((key) => {
          sortedObj[key] = obj[key];
        });
      return sortedObj;
    };

    arr1.sort(function (a, b) {
      if (a.addonId < b.addonId) {
        return -1;
      }
      if (a.addonId > b.addonId) {
        return 1;
      }
      return 0;
    });
    arr2.sort(function (a, b) {
      if (a.addonId < b.addonId) {
        return -1;
      }
      if (a.addonId > b.addonId) {
        return 1;
      }
      return 0;
    });

    if (arr1.length > 0 && "title" in arr1[0]) {
      arr1.forEach((item) => {
        item.selection = item.selection.map(sortObjectKeys);
      });

      arr1.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });

      arr2.forEach((item) => {
        item.selection = item.selection.map(sortObjectKeys);
      });

      arr2.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
    }

    if (arr1.length !== arr2.length) {
      return false;
    } else {
      if (JSON.stringify(arr1) === JSON.stringify(arr2)) {
        return true;
      } else {
        return false;
      }
    }
  };

  function updateFnbItemDelTime(time, isScheduledOrder) {
    if (cart) {
      getItems().forEach((x) => {
        if (x.itemType === "product") {
          x.deliveryOptions.deliveryTime = time;
          x.deliveryOptions.isScheduled = isScheduledOrder;
        }
      });
      set(cart);
      setLocalStorage("cart", cart);
    }
  }

  function updateFnbItemDelAndFlight(delObj, flightId, flightUid) {
    if (cart) {
      getItems().forEach((x) => {
        if (x.itemType === "product") {
          x.deliveryOptions = delObj;
          x.flightUid = flightUid;
          x.flightId = flightId;
        }
      });
      set(cart);
      setLocalStorage("cart", cart);
    }
  }

  function updateFnbFlight(flightId, flightUid, skipSaveCart) {
    if (cart) {
      getItems().forEach((x) => {
        if (x.itemType === "product") {
          x.flightUid = flightUid;
          x.flightId = flightId;
        }
      });
      set(cart, skipSaveCart);
      setLocalStorage("cart", cart);
    }
  }

  function isServiceInCart(serviceId) {
    return !!(
      cart &&
      cart[serviceId] &&
      cart[serviceId].items &&
      cart[serviceId].items.length
    );
  }

  function hasHotelServiceItem(params) {
    let storeId = params.storecode;
    let flag = false;
    if (cart && cart[storeId]) {
      cart[storeId].items.forEach(
        (x) => x.itemId === params.item.itemId && (flag = true)
      );
    }
    return flag;
  }

  function removeServiceTypeTwo(id) {
    let newCart = cart;
    delete newCart[id];

    set(newCart);
    setLocalStorage("cart", newCart);
  }

  async function saveCart(calledFromLogin) {
    if (isLoggedIn()) {
      try {
        let apiURL = config.api.cart.saveCart;
        let reqBody = {};
        let cartArray = await myCart(calledFromLogin);
        let ruleId = "";
        cartArray.forEach((ele) => {
          ele.ruleId = ruleId;
        });
        reqBody.promo = "";
        reqBody.ruleId = "";
        reqBody.items = cartArray;
        reqBody.rules = getAppConfig("CALL_PROMO_API")
          ? getSessionStorage("availablePromo") || []
          : [];
        reqBody.bookingSource = getAppConfig("CALL_PROMO_API")
          ? Util.getBookingSource()
          : "";
        if (reqBody?.items?.length > 0) {
          let apiResponse = await callAPI.post(apiURL, reqBody);
          let regResponse = await apiResponse.json();
        }
        return true;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }

  async function myCart(calledFromLogin) {
    try {
      let apiURL = config.api.cart.myCart;
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (regResponse?.status === 200) {
        if (regResponse?.data?.cart) {
          const data = JSON.parse(regResponse?.data?.cart);
          if (data?.items && data?.items?.length > 0) {
            const localCartUpdated = await updateLocalCart(data?.items);
            if (localCartUpdated) {
              return getItems();
            }
          } else {
            if (calledFromLogin) {
              if (isEmpty()) {
                set({}, true);
              } else {
                return getItems();
              }
            } else {
              set({}, true);
            }
          }
        } else {
          if (calledFromLogin) {
            if (isEmpty()) {
              set({}, true);
            } else {
              return getItems();
            }
          } else {
            set({}, true);
          }
          set({}, true);
        }
        return true;
      }
    } catch (e) {
      console.log(e);
      return true;
    }
  }

  const updateLocalCart = async (cartItems) => {
    let cartObj = {};
    let itemObj = {};
    cartItems.forEach((x) => {
      if (void 0 === itemObj[x?.storeId || x?.storecode]) {
        itemObj[x?.storeId || x?.storecode] = {
          items: [],
        };
      }
      itemObj[x?.storeId || x?.storecode].items.push(x);
    });
    cartItems.forEach((x) => {
      if (cartObj) {
        if (void 0 === cartObj[x?.storeId || x?.storecode]) {
          cartObj[x?.storeId || x?.storecode] = {
            storeId: x?.storeId || x?.storecode || "",
            storeNm: x?.storeName || x?.storename || "",
            movementType: x?.movementType || "",
            sector: x?.sector || "",
            terminal: x?.storeTerminal || x?.terminal || "",
            domain: x?.domain,
            fulfilmentType: x?.fulfilmentType || "",
            items: [],
          };
        }
        cartObj[x?.storeId || x?.storecode].items =
          itemObj[x?.storeId || x?.storecode].items;
      }
    });
    set(cartObj, true);
    return true;
  };

  async function saveLocalCart(cartObj) {
    if (isLoggedIn()) {
      try {
        let apiURL = config.api.cart.saveCart;
        let reqBody = {};
        let cartArray = getItems(cartObj);
        let ruleId = "";
        cartArray.forEach((ele) => {
          ele.ruleId = ruleId;
        });
        reqBody.promo = "";
        reqBody.ruleId = "";
        reqBody.items = cartArray;
        reqBody.rules = getAppConfig("CALL_PROMO_API")
          ? getSessionStorage("availablePromo") || []
          : [];
        reqBody.bookingSource = getAppConfig("CALL_PROMO_API")
          ? Util.getBookingSource()
          : "";
        let apiResponse = await callAPI.post(apiURL, reqBody);
        let regResponse = await apiResponse.json();
        return true;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }

  async function clearSavedLocalCart() {
    if (isLoggedIn()) {
      try {
        let apiURL = config.api.cart.saveCart;
        let apiResponse = await callAPI.post(apiURL, {});
        let regResponse = await apiResponse.json();
        return true;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
  }

  function updateItemNotes(itemNotes, skipSaveCart) {
    if (cart) {
      getItems().forEach((x) => {
        if (itemNotes[x.itemId]) {
          x.itemNotes = itemNotes[x.itemId]?.notes;
        }
      });
      set(cart, skipSaveCart);
      setLocalStorage("cart", cart);
    }
  }

  function hasMultiStoreItems(storeId, storeName) {
    if (!isEmpty()) {
      let items = JSON.parse(JSON.stringify(getItems()));
      let filteredItems = items?.filter((x) => x?.storeId !== storeId);

      if (filteredItems?.length > 0) {
        return {
          hasMultiStoreItems: true,
          oldStore: filteredItems?.[0]?.storeName || "",
          newStore: storeName,
        };
      } else {
        return { hasMultiStoreItems: false, oldStore: "", newStore: "" };
      }
    }
  }

  function getSortedItemPreferences(preferences) {
    if (preferences && Array.isArray(preferences)) {
      const itemPreferences = preferences?.map((item) => {
        let { category, title, selection } = item;
        selection = selection?.map(
          ({ _id, name, price, preferenceDietCategory, preferenceSku }) => ({
            preferenceSku,
            name,
            price: price,
          })
        );
        selection?.map((item) => toLowerCaseObject(item));
        selection = sortByKey(selection, "name");
        return { title, selection };
      });
      return itemPreferences;
    }
    return preferences;
  }

  return (
    <CartContext.Provider
      value={{
        set,
        reset,
        addItem,
        removeItem,
        updateItem,
        updateSelectedFlight,
        updateSelectedAddon,
        getCart,
        getItem,
        getItems,
        getStoreItems,
        isEmpty,
        hasItem,
        hasService,
        removeService,
        updateService,
        isAlreadyAdded,
        isAlreadyAddedUpdated,
        isPresentInCart,
        updateProductItem,
        removeProductItem,
        getItemQunatity,
        getItemQunatityUpdated,
        updateRepatedItem,
        isServiceInCart,
        hasHotelServiceItem,
        removeServiceTypeTwo,
        updateFnbItemDelTime,
        updateFnbItemDelAndFlight,
        updateFnbFlight,
        updateItemNotes,
        getCartItem,
        getCartItemVariables,
        saveCart,
        myCart,
        clearSavedLocalCart,
        hasMultiStoreItems,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export { CartProvider, CartContext };
