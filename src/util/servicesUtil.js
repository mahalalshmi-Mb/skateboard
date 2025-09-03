import { capitalize } from "../commons/util/helperFunctions";

export const getGrandAncestorId = (data, flightData) => {
  let grandAncestorId;

  if (flightData) {
    let baseTerminal;
    if (flightData.baseTerminal) {
      baseTerminal = flightData.baseTerminal;
    } else {
      baseTerminal = flightData.srcDestTerminal;
    }
    grandAncestorId = data
      .reduce(
        (a, c) => [
          ...a,
          c[getTerminal(baseTerminal)]?.[capitalize(flightData?.sector)]?.[
            getMovementType(flightData?.movementType)
          ] ||
            c["off-terminal"][""][""] ||
            c[""][""] ||
            c[""]["undefined"] ||
            c[""],
        ],
        []
      )
      .join(",");

    return grandAncestorId || "";
  }

  grandAncestorId = data
    .reduce(
      (a, c) => [
        ...a,
        c["off-terminal"][""][""] || c[""][""] || c[""]["undefined"] || c[""],
      ],
      []
    )
    .join(",");

  return grandAncestorId || "";
};

export const getMovementType = (letter) => {
  if (letter === "D") {
    return "Departure";
  } else if (letter === "A") {
    return "Arrival";
  }
};

export const getTerminal = (letter) => {
  if (letter === "T1") {
    return "Terminal1";
  } else if (letter === "T2") {
    return "Terminal2";
  }
};

export const getLoungeServiceId = (data, flightData) => {
  let serviceId = data.find((item) => {
    let reqItem = "";
    let title = item.title.split("-");

    let baseTerminal;
    if (flightData.baseTerminal) {
      baseTerminal = flightData.baseTerminal;
    } else {
      baseTerminal = flightData.srcDestTerminal;
    }

    if (
      title.includes(baseTerminal) &&
      title.includes(capitalize(flightData.sector)) &&
      title.includes(getMovementType(flightData.movementType))
    ) {
      reqItem = item;
    }
    return reqItem;
  })?.id;

  if (serviceId) {
    return serviceId;
  }

  return false;
};
