import homeFilled from "../../assets/images/bottomNav/home-filled.svg";
import homeOutlined from "../../assets/images/bottomNav/home-outlined.svg";
import myTripsFilled from "../../assets/images/bottomNav/mytrips-filled.svg";
import myTripsOutlined from "../../assets/images/bottomNav/mytrips-outlined.svg";
import profileFilled from "../../assets/images/bottomNav/profile-filled.svg";
import profileOutlined from "../../assets/images/bottomNav/profile-outlined.svg";
import servicesFilled from "../../assets/images/bottomNav/services-filled.svg";
import servicesOutlined from "../../assets/images/bottomNav/services-outlined.svg";
import transportFilled from "../../assets/images/bottomNav/transport-filled.svg";
import transportOutlined from "../../assets/images/bottomNav/transport-outlined.svg";
import foodFilled from "../../assets/images/bottomNav/food-filled.svg";
import foodOutlined from "../../assets/images/bottomNav/food-outlined.svg";
import rewardsFilled from "../../assets/images/bottomNav/rewards-filled.svg";
import rewardsOutlined from "../../assets/images/bottomNav/rewards-outlined.svg";
import { productDomain } from "../../pages/edpFSTR/pages/config/config";
import { getAppConfig } from "../../commons/util/appConfigHelper";

export const tabList = [
  {
    id: "TAB01",
    tabName: "Home",
    tabImage: homeOutlined,
    tabImageSelected: homeFilled,
    alt: "Home",
    linkTo: "",
  },
  {
    id: "TAB02",
    tabName: "Flights",
    tabImage: myTripsOutlined,
    tabImageSelected: myTripsFilled,
    alt: "FLIGHTS",
    linkTo: "travellers/flights/flight-information",
  },
  {
    id: "TAB03",
    tabName: "Food",
    tabImage: foodOutlined,
    tabImageSelected: foodFilled,
    alt: "Food",
    linkTo: "takeaway-selection",
    search: `?domain=${productDomain.fnb}`,
    hide: () => getAppConfig("SHOW_FOOD_BOTTOM_TAB"),
  },
  {
    id: "TAB03",
    tabName: "Rewards",
    tabImage: rewardsOutlined,
    tabImageSelected: rewardsFilled,
    alt: "Rewards",
    linkTo: "travellers/profile/wallet",
    loginReq: false,
    hide: () => getAppConfig("SHOW_REWARDS_BOTTOM_TAB"),
  },
  {
    id: "TAB04",
    tabName: "Services",
    tabImage: servicesOutlined,
    tabImageSelected: servicesFilled,
    alt: "Services",
    linkTo: "travellers/services/all-services",
    hide: () => getAppConfig("SHOW_SERVICES_BOTTOM_TAB"),
  },
  {
    id: "TAB05",
    tabName: "Transport",
    tabImage: transportOutlined,
    tabImageSelected: transportFilled,
    alt: "Transport",
    linkTo: "travellers/transport-parking",
    hide: () => getAppConfig("SHOW_TRANSPORT_BOTTOM_TAB"),
  },
  {
    id: "TAB06",
    tabName: "Profile",
    tabImage: profileOutlined,
    tabImageSelected: profileFilled,
    alt: "Profile",
    linkTo: "travellers/profile",
    orLinkTo: "signin",
  },
];
