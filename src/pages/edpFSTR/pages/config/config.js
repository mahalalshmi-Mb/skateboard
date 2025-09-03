import moment from "util/momentWrapper";
import { PRODUCT_CDN_URL } from "../../../../commons/config";

//   <-  Scheduled Order  ->   //
export const noOfDays = 4;
export const initialSlotBuffer = 30;
export const slotInterval = 15;
export const initialDatePosition = 0;
export const maxDate = 90;
export const dateFormat = "ddd DD MMM YYYY, HH:mm";

//   <-  Delivery to gate  ->   //
export const delLeadTimeDom = 60;
export const delLeadTimeInt = 60;
export const delTimePerStore = 5;
export const futureFlightLeadTime = 180;
export const maxDeliveryTime = 75;

//   <-  Domain of products  ->   //
export const productDomain = {
  dutyFree: "Duty Free",
  fnb: "",
};

export const productFulfilmentType = {
  takeaway: "Takeaway",
  delivery: "Delivery",
};

export const defaultDatePickerTime = () => {
  let m = moment().add(initialSlotBuffer, "minutes");
  let r = slotInterval - (m.minute() % slotInterval);

  const dateTime = moment(m).add(r, "minutes").format();
  return dateTime;
};

export const DietCategoryIcon = {
  veg: PRODUCT_CDN_URL + "/appAssests/VegIcon.svg",
  nonVeg: PRODUCT_CDN_URL + "/appAssests/NonVegIcon.svg",
};
