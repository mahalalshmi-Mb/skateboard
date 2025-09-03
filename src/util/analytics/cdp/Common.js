import Util from "../../../commons/util/util";

export const triggerMandatoryInfoSubmit = (mandatoryInfoData, productsData) => {
  const { deliveryOptions, ...rest } = productsData;
  const data = {
    ...rest,
    ...deliveryOptions,
  };

  if (deliveryOptions?.deliveryTime) {
    data["deliveryTimeMs"] = new Date(deliveryOptions.deliveryTime).getTime();
  }

  const flightDetails = mandatoryInfoData.mandatory.find(
    (info) => info.key === "flightDetails"
  ).value;

  Util.triggerMoEngageEvent("mandatory_info_submitted", flightDetails, data);
};
