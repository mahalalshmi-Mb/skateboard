const CommonItemEventParams = {
  item_id: "itemId",
  item_name: ["itemName", "itemLabel"],
  item_price: "itemPrice",
  store_name: ["storeName", "productSKU"],
  store_id: ["storeId", "storeCode"],
  movement_type: "movementType",
  sector: "sector",
  terminal: "terminal",
  domain: "domain",
  fulfilment_type: "fulfilmentType",
  customLogic: {
    preference_available: (item) => item?.preferences && item?.preferences?.length > 0,
    preference_selected: (item) => getTitleArrayFromPreference(item.customisationPreferences),
    preference_price: (item) => getPriceArrayFromPreference(item.customisationPreferences),
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
  product_update: CommonItemEventParams,
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

export const getEventDataFromCart = (cartSummary) => {
  if (cartSummary?.length === 0) {
    return {};
  }

  const eventData = {
    item_names: [],
    item_prices: [],
    store_names: [],
    domain_types: [],
    movements: [],
    sectors: [],
    terminals: [],
    fulfilmentTypes: [],
  };

  for (const [key, itemSummary] of Object.entries(cartSummary)) {
    const fulfilmentType = itemSummary?.fulfilmentType;
    const domain = itemSummary?.domain;
    const storeName = itemSummary?.storeNm;

    let movement = itemSummary?.movementType;
    let sector = itemSummary?.sector;
    let terminal = itemSummary?.terminal;

    if (itemSummary?.items && itemSummary?.items.length > 0) {
      itemSummary.items.forEach((item) => {
        eventData.item_names.push(item?.itemName || item?.itemLabel);
        eventData.item_prices.push(item?.itemPrice);
        eventData.store_names.push(storeName);
        eventData.domain_types.push(domain);
        eventData.movements.push(movement);
        eventData.sectors.push(sector);
        eventData.terminals.push(terminal);
        eventData.fulfilmentTypes.push(fulfilmentType);
      });
    }
  }

  return eventData;
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
  };

  orderSummary.data.forEach((item) => {
    const store = item?.shopName;
    const itemName = item?.title;
    const price = item?.price?.amount;
    const storeInfo = item?.storeInfo || item?.vendorInfo;

    let domain = "Unknown";
    let movement = "Unknown";
    let sector = "Unknown";
    let terminal = "Unknown";
    let pickup = "Unknown";
    let drop = "Unknown";

    eventData.item_names.push(itemName);
    eventData.item_prices.push(price);
    eventData.store_names.push(store);

    if (storeInfo) {
      domain = storeInfo?.domain;

      if (storeInfo?.location) {
        movement = storeInfo?.location?.toLowerCase().includes("depart") ? "Departure" : "Arrival";
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
