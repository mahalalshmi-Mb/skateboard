import moment from "util/momentWrapper";
import { getSessionStorage } from "../../../util/storageUtil";

export const datePickerConfig = {
  defaultDatePickerTime: () => {
    let m = moment().add("30", "minutes");
    let r = 30 - (m.minute() % 30);

    const dateTime = moment(m).add(r, "minutes").format();

    return dateTime;
  },
  initialDatePosition: 0,
  maxDate: 90,
  dateFormat: "ddd DD MMM YYYY, HH:mm",
};

export const calculateCheckInTime = (flightTime, movementType) => {
  let m;
  let r;
  let dateTime;
  if (movementType && movementType === "A") {
    m = moment(flightTime);
    dateTime = moment(m).add("30", "minutes").format();
  } else {
    m = moment(flightTime).subtract("3", "hours");
    r = 30 - (m.minute() % 30);
    if (r < 30) {
      dateTime = moment(m).add(r, "minutes").format();
    } else {
      dateTime = moment(m).format();
    }
  }
  return dateTime;
};

export const durationConfig = {
  hoursOfStay: {
    Hotel: ["3", "6", "12"],
    Lounge: ["3"],
  },
};

export const flightCheckInTimeCap = {
  number: "30",
  unit: "minutes",
};

export const checkInTimeCap = {
  number: "30",
  unit: "minutes",
};

export const loungeCheckInWindow = {
  T1: {
    DOMESTIC: {
      startWindow: {
        number: "3",
        unit: "hours",
      },
      endWindow: { number: "30", unit: "minutes" },
    },
    INTERNATIONAL: {
      startWindow: {
        number: "3",
        unit: "hours",
      },
      endWindow: { number: "30", unit: "minutes" },
    },
  },
  T2: {
    DOMESTIC: {
      startWindow: {
        number: "3",
        unit: "hours",
      },
      endWindow: { number: "30", unit: "minutes" },
    },
    INTERNATIONAL: {
      startWindow: {
        number: "4",
        unit: "hours",
      },
      endWindow: { number: "30", unit: "minutes" },
    },
  },
  1: {
    DOMESTIC: {
      startWindow: {
        number: "3",
        unit: "hours",
      },
      endWindow: { number: "30", unit: "minutes" },
    },
    INTERNATIONAL: {
      startWindow: {
        number: "3",
        unit: "hours",
      },
      endWindow: { number: "30", unit: "minutes" },
    },
  },
  2: {
    DOMESTIC: {
      startWindow: {
        number: "3",
        unit: "hours",
      },
      endWindow: { number: "30", unit: "minutes" },
    },
    INTERNATIONAL: {
      startWindow: {
        number: "4",
        unit: "hours",
      },
      endWindow: { number: "30", unit: "minutes" },
    },
  },
};

//room config
export const useDummyData = false;
export const maxAdultPerRoom = 2;
export const maxChildPerRoom = 1;

//listing filter flags
export const durationFiltrationConfig = true;
export const roomAvailabilityCheckConfig = false;
export const totalPaxCheckConfig = false;

//keepinmind
export const contactNo = "980022282";
export const loungeContacts = {
  T2: {
    International: {
      D: ["9606087101"],
      A: ["9945528516"],
    },
    Domestic: {
      D: ["8105757092"],
      A: ["9945528516"],
    },
  },
  T1: {
    International: {
      D: ["8657541678"],
      A: ["8657541678"],
    },
    Domestic: {
      D: ["8657541678"],
      A: ["8657541678"],
    },
  },
};

//review pricing
export const calcTaxPercentage = false;
export const showServiceCharge = false;

//listingComponents
export const showStickySubmit = true;
export const showResetButton = false;

//helper functions
export const isHotelInCart = async (cartItems, hotelData) => {
  if (!hotelData || !cartItems) {
    return false;
  }

  let vendorId = hotelData.availableOptions[0].vendorId;

  if (!cartItems[vendorId] || !cartItems[vendorId].items?.length) {
    return false;
  }
  //if date pax or duration is different then return false

  return !(
    moment(hotelData.checkInTime).format(datePickerConfig.dateFormat) !==
      moment(cartItems[vendorId].items[0].serviceDateTime).format(
        datePickerConfig.dateFormat
      ) ||
    hotelData.adults !== cartItems[vendorId].items[0].metadata.nPaxAdult ||
    hotelData.children !== cartItems[vendorId].items[0].metadata.nPaxChild ||
    hotelData.duration !== cartItems[vendorId].items[0].metadata.duration
  );
};

export const CategoryNameHotels = "Aiport hotels";
export const CategoryNameLounge = "Airport Lounge";

export const getSessionData = (pageType) => {
  if (pageType === "Hotel") {
    return getSessionStorage("hotelData");
  } else if (pageType === "Lounge") {
    return getSessionStorage("loungeData");
  }
};

export const getAddressProofDocs = {
  Hotel: [
    {
      name: "Driving License",
    },
    {
      name: "Aadhar Card",
    },
    {
      name: "Passport",
    },
  ],
  Lounge: [
    {
      name: "Boarding Pass",
    },
  ],
};

export const CreditCardsData = ["visa", "mastercard", "rupay", "diners-club"];
