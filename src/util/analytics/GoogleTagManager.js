import Util from "../../commons/util/util";

export const triggerOrderSuccessEvent = (summaryData) => {
  summaryData.forEach((data) => {
    const domain = data?.vendorInfo?.domain || "";
    const eventData = {
      order_id: data?._id,
      item_sku: data?.productSKU,
      shop_id: data?.shopId,
      shop_name: data?.shopName,
      domain: domain,
      price: data?.price?.amount,
    };

    if (domain && domain.toLowerCase().includes("cab")) {
      eventData["send_to"] = "AW-16583852778/WJZmCMeruNMZEOqF5uM9";
    }
    if (domain && domain.toLowerCase().includes("duty")) {
      eventData["send_to"] = "AW-16583852778/DjxLCJLtv9MZEOqF5uM9";
    }
    if (domain && domain.toLowerCase().includes("lounge")) {
      eventData["send_to"] = "AW-16583852778/bIreCODnv9MZEOqF5uM9";
    }

    if (eventData["send_to"]) {
      Util.triggerGTMConversion("payment_success", "payment_success", eventData);
    }
  });
};
