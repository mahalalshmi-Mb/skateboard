import Util from "../../../commons/util/util";
import { getSessionStorage } from "../../storageUtil";

export const triggerCategorySelected = (categoryData) => {
  if (categoryData?.type === "product") {
    triggerProductViewed(categoryData);
    return;
  }
  let eventData = {
    ageVerificationRequired: categoryData?.ageVerificationRequired || false,
  };

  if (categoryData?.categoryName) {
    eventData["parentId"] = categoryData?.parentId;
    eventData["categoryName"] = categoryData.categoryName;
    eventData["productCategory"] = categoryData?.productCategory;
  }
  if (categoryData?.brandName) {
    eventData["brandName"] = categoryData.brandName;
    eventData["brand"] = categoryData?.brand;
  }
  if (categoryData?.sectionComponent) {
    eventData["sectionSelected"] = categoryData.sectionComponent?.displayLabel;
  }

  const productsData = getStorageProductsData();
  Util.triggerMoEngageEvent("category_selected", eventData, productsData);
};

export const triggerProductViewed = (productData) => {
  const productsData = getStorageProductsData();
  Util.triggerMoEngageEvent(
    "duty_free_product_viewed",
    productData,
    productsData
  );
};

export const triggerSortView = () => {
  const productsData = getStorageProductsData();
  Util.triggerMoEngageEvent("duty_free_sort_view", productsData);
};

export const triggerSortSelected = (sortValue) => {
  const productsData = getStorageProductsData();
  Util.triggerMoEngageEvent("duty_free_sort_selected", sortValue, productsData);
};

export const triggerSortClosed = () => {
  const productsData = getStorageProductsData();
  Util.triggerMoEngageEvent("duty_free_sort_closed", productsData);
};

export const triggerFilterView = () => {
  const productsData = getStorageProductsData();
  Util.triggerMoEngageEvent("duty_free_filter_view", productsData);
};

export const triggerFilterApplied = (eventParams) => {
  console.log("event tracked: ", eventParams);
  const productsData = getStorageProductsData();
  Util.triggerMoEngageEvent(
    "duty_free_filter_applied",
    eventParams,
    productsData
  );
};

export const triggerFilterClosed = () => {
  const productsData = getStorageProductsData();
  Util.triggerMoEngageEvent("duty_free_filter_closed", productsData);
};

export const getStorageProductsData = () => {
  const productsData = getSessionStorage("productsData");
  const { deliveryOptions, ...rest } = productsData;
  const data = {
    ...rest,
    ...deliveryOptions,
  };

  if (deliveryOptions?.deliveryTime) {
    data["deliveryTimeMs"] = new Date(deliveryOptions.deliveryTime).getTime();
  }
  return data;
};
