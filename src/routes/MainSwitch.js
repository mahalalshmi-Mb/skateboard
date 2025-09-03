/* eslint-disable react-hooks/exhaustive-deps */
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Suspense, lazy, useEffect } from "react";
import { useCookies } from "react-cookie";
import ReactGA from "react-ga";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import moment from "util/momentWrapper";
import {
  applicablepromo,
  getUserInfo,
} from "../commons/util/helperFunctions.js";
import { getSessionStorage, setSessionStorage } from "../util/storageUtil.js";
import { getAppConfig } from "../commons/util/appConfigHelper.js";
import { dateTimeFormats } from "../config/dateTimeConfig.js";
import Directory from "../pages/edpFSTR/pages/directory/directory.js";
import TakeAwaySelection from "../pages/edpFSTR/pages/takeAway/TakeAwaySelection.js";
import LaxHomepage from "../pages/laxHomepage/laxHomepage.js";
import Offers from "pages/edpFSTR/pages/Offers/Offers.js";
import Loader from "components/atoms/loader.js";
import MobilePayRedirect from "pages/paymentDropIn/MobilePayRedirect.js";
import Map from "pages/map/map.js";
const AddNewFlight = lazy(() =>
  import("../pages/addNewFlight/addNewFlight.js")
);
const Cart = lazy(() => import("../pages/cart/cart.js"));
const CartRedirect = lazy(() =>
  import("../pages/cart/cartRedirect/cartRedirect.js")
);
const CouponListing = lazy(() =>
  import("../pages/cart/pages/CouponListing/CouponListing.js")
);
const DineInEntry = lazy(() =>
  import("../pages/dineIn/pages/entry/DineInEntry.js")
);
const PayBill = lazy(() => import("../pages/dineIn/pages/payBill/PayBill.js"));
const DineInPaymentFail = lazy(() =>
  import("../pages/dineIn/pages/payment/DineInPaymentFail.js")
);
const DineInPaymentSuccess = lazy(() =>
  import("../pages/dineIn/pages/payment/DineInPaymentSuccess.js")
);
const DutyFreeEntry = lazy(() =>
  import("../pages/edpDutyFree/entry/DutyFreeEntry.js")
);
const StoreListing = lazy(() =>
  import("../pages/edpFSTR/pages/allStores/StoreListing.js")
);
const DeliveryFlightSelection = lazy(() =>
  import(
    "../pages/edpFSTR/pages/DeliveryFlightSelection/deliveryFlightSelection.js"
  )
);
const ProductDetails = lazy(() =>
  import("../pages/edpFSTR/pages/ProductDetails/ProductDetails.js")
);
const ProductListing = lazy(() =>
  import("../pages/edpFSTR/pages/ProductListing/ProductListing.js")
);
const ProductSearchResult = lazy(() =>
  import("../pages/edpFSTR/pages/storeFront/SearchResult.js")
);
const StoreFront = lazy(() =>
  import("../pages/edpFSTR/pages/storeFront/StoreFront.js")
);
const TakeAway = lazy(() =>
  import("../pages/edpFSTR/pages/takeAway/TakeAway.js")
);
const LogIn = lazy(() => import("../pages/logIn/signIn.js"));
const SignUp = lazy(() => import("../pages/logIn/signUp.js"));
const MandatoryInfo = lazy(() =>
  import("../pages/mandatoryInfo/mandatoryInfo.js")
);
const NotFound = lazy(() => import("../pages/notFound/notFound.js"));
const PaymentDropIn = lazy(() =>
  import("../pages/paymentDropIn/paymentDropIn.js")
);
const PaymentFail = lazy(() => import("../pages/paymentFail/paymentFail.js"));
const PaymentRedirect = lazy(() =>
  import("../pages/paymentRedirect/paymentRedirect.js")
);
const PaymentSuccess = lazy(() =>
  import("../pages/paymentSuccess/paymentSuccess.js")
);
const Sitemaps = lazy(() => import("../pages/sitemaps/sitemaps.js"));
const SureRoute = lazy(() => import("../pages/sureRoute/sureRoute.js"));
const Experience = lazy(() =>
  import("pages/edpFSTR/pages/Experience/Experience.js")
);
const AboutServy = lazy(() =>
  import("../containers/footer/footerLinks/AboutServy.js")
);
const FAQ = lazy(() => import("../containers/footer/footerLinks/FAQ.js"));
const PrivacyPolicy = lazy(() =>
  import("../containers/footer/footerLinks/PrivacyPolicy.js")
);
const TermsOfService = lazy(() =>
  import("../containers/footer/footerLinks/TermsOfService.js")
);
const HelpDeskForm = lazy(() =>
  import("../containers/footer/footerLinks/HelpDeskForm.js")
);

const TravellersSwitch = lazy(() => import("./TravellersSwitch.js"));

const MainSwitch = (props) => {
  const [cookies] = useCookies(["gwLoginData"]);
  const location = useLocation();

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
    handlePromoDateCheck();
  }, [location.pathname]);

  const handlePromoDateCheck = () => {
    const promoData = getSessionStorage("availablePromo");
    const promoCalledAt = moment(promoData?.calledAt).format(
      dateTimeFormats.date.day
    );
    const currentDate = moment(new Date()).format(dateTimeFormats.date.day);
    if (promoData && promoData?.calledAt) {
      if (promoCalledAt < currentDate) {
        getApplicablePromo();
      }
    }
  };

  const getApplicablePromo = async () => {
    if (cookies.gwLoginData && getAppConfig("CALL_PROMO_API")) {
      let data = await getUserInfo();
      if (data?.userId) {
        let getPromoData = await applicablepromo(window.atob(data.userId), "L");
        setSessionStorage("availablePromo", getPromoData);
      }
    }
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route path="/travellers">
            <TravellersSwitch {...props} title="Travellers" />
          </Route>
          <Route path="/:languageCode/travellers">
            <TravellersSwitch {...props} title="Travellers" />
          </Route>
          {/* <Route path="/sitemaps">
            <Sitemaps {...props} title="Sitemaps | BIAL" />
          </Route> */}
          {/* <Route path="/:languageCode/sitemaps">
            <Sitemaps {...props} title="Sitemaps | BIAL" />
          </Route>
          <Route path="/sitemaps/:tabId">
            <Sitemaps {...props} title="Sitemaps | BIAL" />
          </Route>
          <Route path="/:languageCode/sitemaps/:tabId">
            <Sitemaps {...props} title="Sitemaps | BIAL" />
          </Route> */}
          <Route exact path="/sureroute-test-object">
            <SureRoute {...props} />
          </Route>
          <Route exact path="/:languageCode/sureroute-test-object">
            <SureRoute {...props} />
          </Route>
          <Route exact path="/cart">
            <Cart {...props} />
          </Route>
          <Route exact path="/:languageCode/cart">
            <Cart {...props} />
          </Route>
          <Route exact path="/cartRedirect">
            <CartRedirect {...props} />
          </Route>
          <Route exact path="/:languageCode/cartRedirect">
            <CartRedirect {...props} />
          </Route>
          <Route exact path="/coupon-listing">
            <CouponListing {...props} />
          </Route>
          <Route exact path="/:languageCode/coupon-listing">
            <CouponListing {...props} />
          </Route>
          <Route exact path="/addNewFlight">
            <AddNewFlight {...props} />
          </Route>
          <Route exact path="/:languageCode/addNewFlight">
            <AddNewFlight {...props} />
          </Route>
          <Route exact path="/login/error">
            <div>Login Error</div>
          </Route>
          <Route exact path="/:languageCode/login/error">
            <div>Login Error</div>
          </Route>
          <Route exact path="/notFound">
            <NotFound {...props} title="404" />
          </Route>
          <Route exact path="/:languageCode/notFound">
            <NotFound {...props} title="404" />
          </Route>
          <Route exact path="/signin">
            <LogIn
              {...props}
              title="Log in page | Bangalore International Airport"
            />
          </Route>
          <Route exact path="/:languageCode/signin">
            <LogIn
              {...props}
              title="Log in page | Bangalore International Airport"
            />
          </Route>
          <Route exact path="/signup">
            <SignUp
              {...props}
              title="Sign up page | Bangalore International Airport"
            />
          </Route>
          <Route exact path="/:languageCode/signup">
            <SignUp
              {...props}
              title="Sign up page | Bangalore International Airport"
            />
          </Route>
          <Route exact path="/paymentRedir">
            <PaymentRedirect {...props} title="Payment" />
          </Route>
          <Route exact path="/:languageCode/paymentRedir">
            <PaymentRedirect {...props} title="Payment" />
          </Route>
          <Route exact path="/payment">
            <PaymentDropIn {...props} title="Payment" />
          </Route>
          <Route exact path="/mobilepay-redirect/:orderId">
            <MobilePayRedirect {...props} title="MobilePay" />
          </Route>
          <Route exact path="/delivery-flight-selection">
            <DeliveryFlightSelection {...props} title="Flight Selection" />
          </Route>
          <Route exact path="/:languageCode/delivery-flight-selection">
            <DeliveryFlightSelection {...props} title="Flight Selection" />
          </Route>
          <Route exact path="/takeaway-selection">
            <TakeAwaySelection {...props} title="Takeaway Selection" />
          </Route>
          <Route exact path="/:languageCode/takeaway-selection">
            <TakeAwaySelection {...props} title="Takeaway Selection" />
          </Route>
          <Route exact path="/spring-market">
            <TakeAway {...props} title="TakeAway" />
          </Route>
          <Route exact path="/:languageCode/spring-market">
            <TakeAway {...props} title="TakeAway" />
          </Route>
          <Route exact path="/takeaway">
            <TakeAway {...props} title="TakeAway" />
          </Route>
          <Route exact path="/:languageCode/takeaway">
            <TakeAway {...props} title="TakeAway" />
          </Route>
          <Route exact path="/storeFront/:storeId">
            <StoreFront {...props} title="StoreFront" />
          </Route>
          <Route exact path="/:languageCode/storeFront/:storeId">
            <StoreFront {...props} title="StoreFront" />
          </Route>
          <Route exact path="/store-listing">
            <StoreListing {...props} title="Store Listing" />
          </Route>
          <Route exact path="/:languageCode/store-listing">
            <StoreListing {...props} title="Store Listing" />
          </Route>
          <Route exact path="/search-result/:storeId">
            <ProductSearchResult {...props} title="Search Result" />
          </Route>
          <Route exact path="/:languageCode/search-result/:storeId">
            <ProductSearchResult {...props} title="Search Result" />
          </Route>
          <Route exact path="/directory">
            <Directory {...props} title="TakeAway" />
          </Route>
          <Route exact path="/:languageCode/directory">
            <Directory {...props} title="TakeAway" />
          </Route>
          <Route exact path="/product/viewall">
            <ProductListing {...props} />
          </Route>
          <Route exact path="/:languageCode/product/viewall">
            <ProductListing {...props} />
          </Route>
          <Route exact path="/brand-listing">
            <TakeAway {...props} />
          </Route>
          <Route exact path="/:languageCode/brand-listing">
            <TakeAway {...props} />
          </Route>
          <Route exact path="/product/info/:itemId">
            <ProductDetails {...props} />
          </Route>
          <Route exact path="/:languageCode/product/info/:itemId">
            <ProductDetails {...props} />
          </Route>
          <Route exact path="/mandatoryInfo">
            <MandatoryInfo {...props} />
          </Route>
          <Route exact path="/:languageCode/mandatoryInfo">
            <MandatoryInfo {...props} />
          </Route>
          <Route exact path="/dine-in">
            <DineInEntry {...props} title="Dine-In" />
          </Route>
          <Route exact path="/:languageCode/dine-in">
            <DineInEntry {...props} title="Dine-In" />
          </Route>
          <Route exact path="/dine-in/payBill">
            <PayBill {...props} title="Dine-In PayBill" />
          </Route>
          <Route exact path="/:languageCode/dine-in/payBill">
            <PayBill {...props} title="Dine-In PayBill" />
          </Route>
          <Route exact path="/dine-in/success/:orderId">
            <DineInPaymentSuccess {...props} title="Dine-In Payment Success" />
          </Route>
          <Route exact path="/:languageCode/dine-in/success/:orderId">
            <DineInPaymentSuccess {...props} title="Dine-In Payment Success" />
          </Route>
          <Route exact path="/dine-in/fail/:orderId">
            <DineInPaymentFail {...props} title="Dine-In Payment Fail" />
          </Route>
          <Route exact path="/:languageCode/dine-in/fail/:orderId">
            <DineInPaymentFail {...props} title="Dine-In Payment Fail" />
          </Route>
          <Route exact path={"/duty-free-entry"}>
            <DutyFreeEntry {...props} title="Duty Free Entry" />
          </Route>
          <Route exact path={"/:languageCode/duty-free-entry"}>
            <DutyFreeEntry {...props} title="Duty Free Entry" />
          </Route>
          <Route exact path="/">
            <LaxHomepage />
          </Route>
          <Route exact path="/notFound" title="Not Found">
            <NotFound {...props} title="404" />
          </Route>
          <Route exact path="/:languageCode/notFound" title="Not Found">
            <NotFound {...props} title="404" />
          </Route>
          <Route exact path="/success/:orderid">
            <PaymentSuccess {...props} />
          </Route>
          <Route exact path="/:languageCode/success/:orderid">
            <PaymentSuccess {...props} />
          </Route>
          <Route exact path="/fail/:orderid">
            <PaymentFail {...props} />
          </Route>
          <Route exact path="/:languageCode/fail/:orderid">
            <PaymentFail {...props} />
          </Route>
          <Route exact path="/offers">
            <Offers {...props} title="Offers" />
          </Route>
          <Route exact path="/experience">
            <Experience {...props} title="Experience" />
          </Route>
          <Route exact path="/about-servy">
            <AboutServy {...props} title="About Servy" />
          </Route>
          <Route exact path="/faqs">
            <FAQ {...props} title="FAQ" />
          </Route>
          <Route exact path="/privacy-policy">
            <PrivacyPolicy {...props} title="Privacy Policy" />
          </Route>
          <Route exact path="/terms-of-service">
            <TermsOfService {...props} title="Terms Of Service" />
          </Route>
          <Route exact path="/help-desk-inquiry">
            <HelpDeskForm {...props} title="Guest Help Form" />
          </Route>
          <Route exact path="/map">
            <Map {...props} title="Map" />
          </Route>
          <Redirect to="/notFound" />
        </Switch>
      </Suspense>
    </MuiPickersUtilsProvider>
  );
};

export default MainSwitch;
