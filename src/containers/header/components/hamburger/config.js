import twitter from "../../../../assets/images/header/hamburger/footer/Twitter.svg";
import facebook from "../../../../assets/images/header/hamburger/footer/Facebook.svg";
import instagram from "../../../../assets/images/header/hamburger/footer/Instagram.svg";
import linkedin from "../../../../assets/images/header/hamburger/footer/LinkedIn.svg";
import youtube from "../../../../assets/images/header/hamburger/footer/YouTube.svg";
import Util from "../../../../commons/util/util";

export const socialMediaConfig = [
  {
    name: "Twitter",
    logo: twitter,
    url: "https://twitter.com/BLRAirport",
  },
  {
    name: "LinkedIn",
    logo: linkedin,
    url: "https://in.linkedin.com/company/bangalore-international-airport-ltd",
  },
  {
    name: "YouTube",
    logo: youtube,
    url: "https://www.youtube.com/channel/UC2fIg9APtXsqDDFYeA7p9FA?view_as=subscriber",
  },
  {
    name: "Facebook",
    logo: facebook,
    url: "https://www.facebook.com/BLRairport/",
  },
  {
    name: "Instagram",
    logo: instagram,
    url: "https://www.instagram.com/blrairport/",
  },
];

export const canShow = (showOnApp, showOnWeb) => {
  //if on app
  if (Util.isWebView()) {
    return showOnApp;
  }

  //if on web
  if (!Util.isWebView()) {
    return showOnWeb;
  }
};

export const getPageName = (pathname) => {
  let pageName = "";
  switch (pathname) {
    case "takeaway-selection":
      pageName = "order";
      break;
    case "takeaway":
      pageName = "order";
      break;
    case "spring-market":
      pageName = "spring-market";
      break;
    case "store-listing":
      pageName = "order";
      break;
    case "storefront":
      pageName = "order";
      break;
    case "cart":
      pageName = "order";
      break;
    case "paymentRedir":
      pageName = "order";
      break;
    case "payment":
      pageName = "order";
      break;
    default:
      pageName = pathname;
  }
  return pageName?.replace("/", "")?.replace("-", " ");
};
