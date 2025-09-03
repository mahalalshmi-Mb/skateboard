const CommonItemEventParams = {
  item_id: "itemId",
  item_name: ["itemName", "itemLabel"],
  item_price: "itemPrice",
  store_name: ["storeName", "storename", "productSKU"],
  store_id: ["storeId", "storeCode"],
  movement_type: "movementType",
  sector: "sector",
  terminal: "terminal",
  domain: "domain",
  fulfilment_type: "fulfilmentType",
  customLogic: {
    delivery_time: (item) => item?.deliveryOptions?.deliveryTime,
    delivery_time_ms: (item) =>
      new Date(item?.deliveryOptions?.deliveryTime).getTime(),
    preference_available: (item) =>
      (item?.preferences && item?.preferences?.length > 0) || false,
    preference_selected: (item) =>
      getTitleArrayFromPreference(item.customisationPreferences),
    preference_price: (item) =>
      getPriceArrayFromPreference(item.customisationPreferences),
  },
  triggerPoint: {
    trigger_point: () => window.location.pathname.split("/")[1],
  },
};

export const EventParams = {
  product_viewed: {
    item_id: "_id",
    item_name: "productName",
    item_price: "price",
    store_name: "shopName",
    store_id: "shopId",
    preference_available: "itemWithPreference",
    triggerPoint: {
      trigger_point: () => window.location.pathname.split("/")[1],
    },
  },
  add_to_cart: CommonItemEventParams,
  cart_viewed: CommonItemEventParams,
  proceed_to_pay: CommonItemEventParams,
  product_update: CommonItemEventParams,

  // duty-free
  duty_free_product_viewed: {
    itemId: ["itemId", "productId"],
    itemName: "title",
    itemPrice: "price",
    storeName: ["shopName", "subTitle"],
    ageVerificationRequired: ["ageVerificationRequired", "ageVerificationReq"],
    itemWithPreference: "itemWithPreference",
    triggerPoint: {
      trigger_point: () => window.location.pathname.split("/")[1],
    },
  },
};

export const mapEventData = (event_name, data) => {
  const eventData = {};
  const eventParams = EventParams[event_name];

  if (!eventParams) {
    return data;
  }

  for (const [key, value] of Object.entries(eventParams)) {
    if (key === "customLogic") {
      for (const [customKey, customFunc] of Object.entries(value)) {
        eventData[customKey] = customFunc(data);
      }
    } else if (key === "triggerPoint") {
      for (const [triggerKey, triggerFunc] of Object.entries(value)) {
        eventData[triggerKey] = triggerFunc();
      }
    } else {
      if (Array.isArray(value)) {
        const foundValue = value.find((v) => data[v] !== undefined);
        if (foundValue) {
          eventData[key] = data[foundValue];
        }
      } else {
        eventData[key] = data[value];
      }
    }
  }
  return eventData;
};

export const getPriceArrayFromPreference = (preference) => {
  const priceArray = [];
  if (!preference || preference.length === 0) {
    return priceArray;
  }
  preference.forEach((pref) => {
    priceArray.push(pref?.selection[0]?.price);
  });
  return priceArray;
};

export const getTitleArrayFromPreference = (preference) => {
  const titleArray = [];
  if (!preference || preference.length === 0) {
    return titleArray;
  }
  preference.forEach((pref) => {
    titleArray.push(`${pref?.title}: ${pref?.selection[0]?.name}`);
  });
  return titleArray;
};

export const getEventDataFromOrderSummary = (orderSummary) => {
  const eventData = {
    item_names: [],
    item_prices: [],
    store_names: [],
    domains: [],
    movements: [],
    sectors: [],
    terminals: [],
    pickup: [],
    drop: [],
    delivery_times: [],
    delivery_times_ms: [],
  };

  orderSummary.data.forEach((item) => {
    const store = item?.shopName;
    const itemName = item?.title;
    const price = item?.price?.amount;
    const storeInfo = item?.storeInfo || item?.vendorInfo;
    const deliveryTime = item?.delivery?.itemEstimatedDeliveryTime;

    let domain = "Unknown";
    let movement = "Unknown";
    let sector = "Unknown";
    let terminal = "Unknown";
    let pickup = "Unknown";
    let drop = "Unknown";

    eventData.item_names.push(itemName);
    eventData.item_prices.push(price);
    eventData.store_names.push(store);
    eventData.delivery_times.push(deliveryTime);
    eventData.delivery_times_ms.push(new Date(deliveryTime).getTime());

    if (storeInfo) {
      domain = storeInfo?.domain;

      if (storeInfo?.location) {
        movement = storeInfo?.location?.toLowerCase().includes("depart")
          ? "Departure"
          : "Arrival";
        sector = storeInfo?.location?.toLowerCase().includes("domestic")
          ? "Domestic"
          : "International";
        terminal = storeInfo?.terminal?.value;
      }
    }

    if (item?.metadata?.drop) {
      drop = item?.metadata?.drop?.address;
    }
    if (item?.metadata?.pickup) {
      pickup = item?.metadata?.pickup?.address;
    }

    eventData.domains.push(storeInfo?.domain);
    eventData.movements.push(movement);
    eventData.sectors.push(sector);
    eventData.terminals.push(terminal);
    eventData.pickup.push(pickup);
    eventData.drop.push(drop);
  });

  const priceInfo = orderSummary?.metadata?.priceInfo;
  eventData["total"] = priceInfo?.total;
  eventData["sub_total"] = priceInfo?.subtotal;
  eventData["discounts"] = priceInfo?.discounts;
  eventData["taxes"] = priceInfo?.taxes;
  eventData["packaging_charges"] = priceInfo?.packagingCharges;

  return eventData;
};

export const flatAndMapEventData = (event_name, data) => {
  const processStore = (store) => {
    const { items, ...restFields } = store;
    return items.map((item) => ({
      ...item,
      ...restFields,
    }));
  };

  // Handle both array and JSON object cases
  const flattenedItems = Array.isArray(data)
    ? data.flatMap(processStore)
    : Object.values(data).flatMap(processStore);

  if (flattenedItems.length <= 1) {
    return mapEventData(event_name, flattenedItems[0]);
  }

  const combinedObject = {};
  flattenedItems.forEach((item) => {
    const mappedData = mapEventData(event_name, item);
    Object.entries(mappedData).forEach(([key, value]) => {
      if (!combinedObject[key]) {
        combinedObject[key] = [];
      }
      combinedObject[key].push(value);
    });
  });
  return combinedObject;
};

