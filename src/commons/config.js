import { getLocalStorageConfig } from "util/storageUtil";
const serverURL = process.env.REACT_APP_SERVER_URL + "/cms/api";
const serverURL_PAX = process.env.REACT_APP_SERVER_URL + "/pax";
const fisURL = process.env.REACT_APP_SERVER_URL + "/fis/v2/api";
const campaignURL = process.env.REACT_APP_CAMPAIGN_URL;
const reCaptchaSiteKey = process.env.REACT_APP_RECAPTCHAV2_SITE_KEY;
const reCaptchaSecretKey = process.env.REACT_APP_RECAPTCHAV2_SECRET_KEY;
const FACEBOOK_CONVERSATION_ID = process.env.REACT_APP_FACEBOOK_KEY;
const GOOGLE_CONVERSATION_ID = process.env.REACT_APP_GOOGLE_CONVERSION_KEY;
const TWITTER_KEY_ID = process.env.REACT_APP_TWITTER_KEY;
const TWITTER_CONVERSION_KEY_ID = process.env.REACT_APP_CONVERSION_TWITTER_KEY;
const v2ServerURL = process.env.REACT_APP_SERVER_URL + "/pax2";
const phiComDefaultMobileNumber = process.env.REACT_APP_PHICOM_DEFAULT_PH_NO;
const phiComDefaultEmailId = process.env.REACT_APP_PHICOM_DEFAULT_EMAILID;

//**Env*/
export const ENV = process.env.REACT_APP_ENVIRONMENT;
export const gatewayURL = process.env.REACT_APP_SERVER_URL;
export const TRACKING_ID = process.env.REACT_APP_GOOGLE_ANALYTICS;
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
export const INDOOR_MAP_AUTH_TOKEN =
  process.env.REACT_APP_INDOOR_MAP_AUTH_TOKEN;
export const R360_ENV = process.env.REACT_APP_R360_ENV;
export const CDN_URL = process.env.REACT_APP_CDN_URL;
export const PRODUCT_CDN_URL = process.env.REACT_APP_PRODUCT_CDN_URL;
export const SHOP_CDN_URL = process.env.REACT_APP_SHOP_CDN_URL;
export const AIRLINE_CDN_URL = process.env.REACT_APP_AIRLINE_CDN_URL;
export const POSTHOG_API_KEY = process.env.REACT_APP_POSTHOG_API_KEY;

export const LJI_SOURCE_PATH = process.env.REACT_APP_LJI_SOURCE_PATH;
export const LJI_X_API_KEY = process.env.REACT_APP_LJI_X_API_KEY;
export const GOOGLE_RECAPTCHA_SITE_KEY =
  process.env.REACT_APP_RECAPTCHA_SECRET_KEY;

export const ACCESSIBILITY_WIDGET_CLIENT_ID =
  process.env.REACT_APP_ACCESSIBILITY_WIDGET_CLIENT_ID;

export const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;
export const S3_URL = process.env.REACT_APP_S3_URL;

const configObj = getLocalStorageConfig("appConfig") || {};
const secondaryGatewayUrl = configObj?.gatewayURL || gatewayURL;

export const config = {
  api: {
    chatBotSearch: `${v2ServerURL}/v2/api/chatbot/process`,
    homepage: `${serverURL}/homepages`,
    homepageStores: `${serverURL_PAX}/api/getStores?page=0&limit=150&isHomePage=true`,
    navbar: `${serverURL}/navbars`,
    pages: `${serverURL}/pages/{{pageId}}`,
    campaignPages: `${serverURL}/campaigns/{{pageId}}`,
    footer: `${serverURL}/footer-v2s?populate[logo]=*&populate[secondaryLogo]=*&populate[DownloadLinks]=*&populate[SocialMedia][populate][logo]=*&populate[NavigationLinks][populate][image]=*&populate[NavigationLinks][populate][pages]=*&populate[OtherLinks]=*`,
    weather: `${serverURL}/weathers`,
    flightNumberMaster: `${fisURL}/aodb/flight-infos`,
    flightInfo: `${fisURL}/aodb/flight-infos/{{date}}/{{movementType}}`,
    flightSearch: `${fisURL}/aodb/flight-info/{{date}}/{{movementType}}/{{flightNo}}`,
    profileInterest: `${serverURL}/profile-interests`,
    profileInfo: `${serverURL}/profiles/{{userId}}`,
    vayuVajraStops: `${serverURL}/vayuvajras/stops`,
    vayuVajraServices: `${serverURL}/vayuvajras/services`,
    vayuVajraServicesSearch: `${serverURL}/vayuvajras/search`,
    flyBusStops: `${serverURL}/flybuses/stops`,
    flyBusSearch: `${serverURL}/flybuses/search`,
    lostAndFoundSearch: `${serverURL}/lost-and-founds/search`,
    claimSubmit: `${serverURL}/lost-and-founds/claim`,
    feedback: `${serverURL}/lost-and-founds/feedback`,
    tendersList: `${serverURL}/tenders`,
    tendersSearch: `${serverURL}/tenders/search`,
    tendersCategory: `${serverURL}/tender-categories`,
    tendersDownload: `${serverURL}/tenders/download`,
    tendersDocUpload: `${serverURL}/tenders/bid`,
    googleSignIn: `${serverURL}/connect/google`,
    fbSignIn: `${serverURL}/connect/facebook`,
    twitterSignIn: `${serverURL}/connect/twitter`,
    sugesstionSearch: `${gatewayURL}/gw/api/search/v3/suggestions`,
    globalSearch: `${gatewayURL}/gw/api/search/v2/all`,
    userFeedback: `${serverURL}/feedbacks`,
    estimatedWaitTime: `${fisURL}/qms/status?selection=summary`,
    flightTrack: `${fisURL}/flightAlert/create`,
    stopFlightTrack: `${fisURL}/flightAlert/stop`,
    getFlightTrackData: `${fisURL}/flightAlert/getData`,
    validateOtp_v2: `${v2ServerURL}/v2/api/user/validateOtp`,
    genOtp_v2: `${v2ServerURL}/v2/api/user/genOtp`,
    register: `${gatewayURL}/pax2/v2/api/user/register`,
    validateRegistration: `${gatewayURL}/pax2/v2/api/user/validateToReg`,
    serviceListing: `${gatewayURL}/pax2/v2/api/service/list`,
    serviceCategories: `${gatewayURL}/pax2/v2/api/service/category`,
    campaignConfig: `${campaignURL}/campaign/getconfigdata?key=jpPXrzgiXyE3FdwKT7OiYQ==`,
    getRaffles: `${campaignURL}/campaign/raffles/{{user_id}}?key=jpPXrzgiXyE3FdwKT7OiYQ==`,

    // ServiceDetails
    serviceVariants: `${gatewayURL}/pax2/v2/api/service/variant`,
    serviceInfo: `${gatewayURL}/pax2/v2/api/service/info`,
    serviceGrandAncestor: `${gatewayURL}/pax2/v2/api/service/grandAncestor`,

    // promotion
    getapplicablepromo: `${gatewayURL}/promotions/v1/api/promotion/getapplicablepromo`,
    getCoupons: `${gatewayURL}/promotions/v1/api/promotion/getCoupons`,

    //flights
    homeAirports: `${fisURL}/aodb/homeAirports`,
    flightListing: `${fisURL}/aodb/flights`,
    airportSearchResults: `${fisURL}/aodb/airports`,
    campaignRegister: `${gatewayURL}/pax2/v2/api/campaign/register`,
    campaignRegisterList: `${gatewayURL}/pax2/v2/api/campaign/getRegData`,
    campaignValidation: `${gatewayURL}/pax2/v2/api/campaign/approve`,
    landingPageConstruct: `${gatewayURL}/pax2/v2/api/products/landingPage`,
    feedback_v2: {
      save: {
        overall: `${gatewayURL}/feedback/api/save/overall`,
      },
    },
    login: {
      social: {
        google: `${gatewayURL}/login/google`,
        facebook: `${gatewayURL}/login/facebook`,
        twitter: `${gatewayURL}/login/twitter`,
      },
      local: `${gatewayURL}/login/local`,
      otp: `${gatewayURL}/login/otp`,
      refresh: `${gatewayURL}/login/refresh`,
    },
    logout: `${secondaryGatewayUrl}/gw/api/logout`,
    user: {
      info: `${secondaryGatewayUrl}/gw/api/user/info`,
      update: `${secondaryGatewayUrl}/pax2/v2/api/user/updateUser`,
      updateAccount: `${secondaryGatewayUrl}/pax2/v2/api/user/updateAccount`,
      updateProfileImage: `${secondaryGatewayUrl}/pax2/v2/api/user/image/profile/save`,
      delete: `${secondaryGatewayUrl}/gw/api/user/delete`,
      referral_check: `${secondaryGatewayUrl}/pax2/v2/api/user/lms/referral/check`,
      become_member: `${secondaryGatewayUrl}/pax2/v2/api/user/lms/membership/apply`,
      membership_status: `${secondaryGatewayUrl}/pax2/v2/api/user/lms/membership/status`,
      requestOtpUpdateEmail: `${secondaryGatewayUrl}/gw/api/user/request/update/email/:email`,
      updateEmail: `${secondaryGatewayUrl}/gw/api/user/update/email`,
      requestOtpUpdateMobile: `${secondaryGatewayUrl}/gw/api/user/request/update/mobile/:mobile`,
      updateMobile: `/gw/api/user/update/mobile`,
      communication: {
        channels: `${secondaryGatewayUrl}/pax2/v2/api/user/communication/channels`,
        preferences: `${secondaryGatewayUrl}/pax2/v2/api/user/communication/preferences`,
      },
    },
    addNewFlights: {
      flightListing: `${fisURL}/aodb/flights`,
      homeAirports: `${fisURL}/aodb/homeAirports`,
      airportSearchResults: `${fisURL}/aodb/airports`,
      flightLocate: `${fisURL}/aodb/flight/track?aircraftRegNo=`,
      addFlight: `${gatewayURL}/pax2/v2/api/user/flight`,
      myFlights: `${gatewayURL}/pax2/v2/api/user/flight`,
      removeFlight: `${gatewayURL}/pax2/v2/api/user/flight`,
    },
    cart: {
      summary: `${secondaryGatewayUrl}/pax2/v2/api/cart/summary`,
      myCart: `${secondaryGatewayUrl}/pax2/v2/api/cart/mycart`,
      saveCart: `${secondaryGatewayUrl}/pax2/v2/api/cart/save`,
    },
    moreInfo: {
      moreInfo: `${gatewayURL}/pax2/v2/api/service/mandatoryfields`,
    },
    payment: {
      gatewayConfiguration: `${secondaryGatewayUrl}/pax2/v2/api/payment/gatewayConfiguration`,
      completeOrder: `${secondaryGatewayUrl}/pax2/v2/api/order/complete`,
      orderSummaryV2: `${secondaryGatewayUrl}/pax2/v2/api/order/summary`,
    },
    checkout: {
      checkout: `${secondaryGatewayUrl}/pax2/v2/api/cart/checkout`,
    },
    guest: {
      guestLogin: `${gatewayURL}/login/guest`,
      updateUser: `${gatewayURL}/pax2/v2/api/user/updateUser`,
    },
    captive: {
      getOtp: `${gatewayURL}/login/captive/otp`,
      local: `${gatewayURL}/login/captive/local`,
    },
    myOrders: {
      activeOrders: `${secondaryGatewayUrl}/pax2/v2/api/order/active`,
      pastOrders: `${secondaryGatewayUrl}/pax2/v2/api/order/past`,
      cancelService: `${secondaryGatewayUrl}/pax2/v2/api/order/cancel`,
    },
    permission: {
      userPermission: `${gatewayURL}/gw/api/user/permissions/v2/{{appType}}`,
    },
    qms: {
      cumulative: `${gatewayURL}/fis/v2/api/qms/cumulative`,
      general: `${gatewayURL}/fis/v2/api/qms/general`,
    },
    flightbooking: {
      getSearchFilters: `${gatewayURL}/flightbooking/v2/api/flight/getsearchfilters`,
      getAirports: `${gatewayURL}/flightbooking/v2/api/flight/getairports`,
      searchFlight: `${gatewayURL}/flightbooking/v2/api/flight/searchflight`,
      getconvenienceconfig: `${gatewayURL}/flightbooking/v2/api/flight/getconvenienceconfig`,
    },
    flightGate: {
      gateListing: `${gatewayURL}/fis/v2/api/aodb/gates`,
    },
    products: {
      getProductsByStore: `${gatewayURL}/pax2/v2/api/products/category`,
      productDetails: `${gatewayURL}/pax2/v2/api/products/item`,
      productSearch: `${gatewayURL}/pax2/v2/api/products/search`,
      getProductId: `${gatewayURL}/pax2/v2/api/products/productId`,
      displayCollectionProducts: `${gatewayURL}/pax2/v2/api/products/landingPage`,
      getStores: `${gatewayURL}/pax2/v2/api/shops/getStores`,

      landingPageConstruct: `${gatewayURL}/pax2/v2/api/products/landingPageConstruct`,
      displayCollection: `${gatewayURL}/pax2/v2/api/products/displayCollection`,
      productListing: `${gatewayURL}/pax2/v2/api/products/list`,
      areaListing: `${gatewayURL}/pax2/v2/api/products/areaList`,
    },
    npsFeedback: {
      pendingItem: `${gatewayURL}/feedback/api/pending/item`,
      saveItem: `${gatewayURL}/feedback/api/save/item`,
      pendingRapidfire: `${gatewayURL}/feedback/api/pending/rapidfire/item`,
      saveRapidfireItem: `${gatewayURL}/feedback/api/save/rapidfire/item`,
      askLater: `${gatewayURL}/feedback/api/later`,
    },
    eventAccess: {
      saveEmpId: `${gatewayURL}/pax2/v2/api/user/storeBialEmp`,
    },
    appEnvProps: {
      envProps: `${gatewayURL}/cms/api/config-v2s?populate=*`,
    },
    cabs: {
      rescheduleCab: `${gatewayURL}/pax2/v2/api/order/reschedule`,
    },
    helpAndSupport: {
      assistMe: `${secondaryGatewayUrl}/helpdesk/api/assist/me`,
      createTicket: `${secondaryGatewayUrl}/helpdesk/api/ticket/create`,
      ticketListing: `${secondaryGatewayUrl}/helpdesk/api/ticket/list`,
    },
    appOperatingLocation: {
      locationDetails: `${gatewayURL}/pax2/v2/api/location/locationDetails`,
    },
    auth: {
      initiate: `${secondaryGatewayUrl}/register/initiate`,
      validate: `${secondaryGatewayUrl}/register/validate`,
    },
    braintreePayment: {
      paymentProcess: `${secondaryGatewayUrl}/pax2/v2/api/payment/braintree/processPayment`,
    },
    cms: {
      alcoholAlert: `${serverURL}/alcohol-alerts?populate=*`,
    },
    order: {
      orderCheckin: `${gatewayURL}/pax2/v2/api/order/checkin`,
    },
    //Register
    employeeRegister: `${secondaryGatewayUrl}/gw/api/employee/enroll/empId`,
    employeeUnRegister: `${secondaryGatewayUrl}/gw/api/employee/delist`,
  },
  DisabledFlightStatus: [
    "CANCELLED",
    "GATEOPEN",
    "GATECLOSED",
    "FINALCALL",
    "DEPARTED",
    "ARRIVED",
  ],
  date: {},
  ux: {
    throttleControl: 500,
  },
  appDetails: {},
  auth: {},
  url: {
    serverURL,
  },
  imageUrlDomain: {
    imageURL: "",
  },
  reCaptchaV2: {
    siteKey: reCaptchaSiteKey,
    secretKey: reCaptchaSecretKey,
  },
  pixel: {
    FACEBOOK_CONVERSATION_ID,
    GOOGLE_CONVERSATION_ID,
    TWITTER_KEY_ID,
    TWITTER_CONVERSION_KEY_ID,
  },
  ewt: {
    Departure: {
      Domestic: {
        terminalEntrance1To4: "T1DE_1-4",
        terminalEntrance5aTo9: "T1DE_5a-9",
        checkinCounter1To33: "T1CI_01-33",
        checkinCounter34To86: "T1CI_34-86",
        domLeft: "T1DS_Left",
        domRight: "T1DS_Right",
      },
      International: {
        terminalEntrance1To4: "T1DE_1-4",
        terminalEntrance5aTo9: "T1DE_5a-9",
        checkinCounter1To33: "T1CI_01-33",
        checkinCounter34To86: "T1CI_34-86",
        domLeft: "T1DS_Left",
        domRight: "T1DS_Right",
        internationSecurity: "T1IS",
        immigration: "T1IM",
      },
    },
    Arrival: {
      International: {
        visaOnArrival: "T1VI",
        emigration: "T1EM",
      },
    },
  },
  cart: {
    emptyMessage: [
      `Let's revamp your inventory!!!`,
      `Amazing products are just a click away...`,
      `I heard there's this superb deal going on...`,
      `Have you seen our latest collection !?`,
      `Not able to decide, let's take a walk on listing page :)`,
    ],
  },
  moreInfo: {
    relationType: [
      { value: "Father", label: "Father" },
      { value: "Mother", label: "Mother" },
      { value: "Spouse", label: "Spouse" },
      { value: "Sibling", label: "Sibling" },
      { value: "Friend", label: "Friend" },
      { value: "Others", label: "Others" },
    ],
  },
  phiCom: {
    defaultPhNo: phiComDefaultMobileNumber,
    defaultEmailId: phiComDefaultEmailId,
  },
  myBooking: {
    cancellationReason: [
      { value: "r01", label: "Item not required" },
      { value: "r02", label: "Item booked by mistake" },
      { value: "r03", label: "Need to change payment method" },
      { value: "r04", label: "Others" },
    ],
  },
  travelParams: {
    area: [
      {
        id: 1,
        value: "Arrival",
        label: "Arrival",
      },
      {
        id: 2,
        value: "Departure",
        label: "Departure",
      },
      {
        id: 3,
        value: "Kerb Side",
        valueTwo: "Quad",
        label: "Kerb Side",
      },
    ],
    zone: [
      {
        id: 1,
        value: "Domestic",
        label: "Domestic",
      },
      {
        id: 2,
        value: "International",
        label: "International",
      },
    ],
  },
  deliveryOptions: {
    takeaway: "collect at store",
    deliveryAtGate: "collect at gate",
  },
  currency: {
    currencyCode: "INR",
    currencySymbol: "₹",
  },
};

export const otpTimeout = 60;
export const resource = "paxapp";
export const channel = "SKATEBOARD";
export const defaultLanguage = "en";
export const languages = ["kn"];

export default config;
