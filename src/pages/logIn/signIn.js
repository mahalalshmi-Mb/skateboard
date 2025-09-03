import Moengage from "@moengage/web-sdk";
import $ from "jquery";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import PhoneInput from "react-phone-input-2";
import { useLocation } from "react-router-dom";
import indoorLanternRightDesktop from "../../assets/images/indoorBgImages/indoor-lantern-right-desktop.svg";
import indoorLanternRightMobile from "../../assets/images/indoorBgImages/indoor-lantern-right-mobile.svg";
import LeftArrow from "../../assets/images/signIn/arrow-left.png";
import callAPI from "../../commons/callAPI";
import config from "../../commons/config";
import { getAppConfig } from "../../commons/util/appConfigHelper";
import {
  applicablepromo,
  deleteAllCookies,
  getUserInfo,
} from "../../commons/util/helperFunctions";
import { setUserPermission } from "../../commons/util/permissionsConfig";
import Util from "../../commons/util/util";
import Text from "../../components/atoms/Text";
import Loader from "../../components/atoms/loader";
import PushAlert from "../../components/atoms/pushAlert";
import CustomPicture from "../../components/molecules/customPicture";
import PrimaryButton from "../../containers/manualSignIn/components/primaryButton";
import CredentialsSignIn from "../../containers/manualSignIn/credentialsSignIn";
import "../../containers/manualSignIn/manualSIgnInStyle.css";
import Registration from "../../containers/manualSignIn/registration";
import { otpTimeoutSeconds } from "../../containers/manualSignIn/util";
import OtpInput from "../../containers/verifyOtp/components/CustomOtpInput/CustomOtpInput";
import { CartContext } from "../../context/cartContext";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { Sign_In_Event } from "../../util/FirebaseAnalyticsUtil";
import { setSessionStorage } from "../../util/storageUtil";
import { colors } from "theme/colors";

function SignIn(props) {
  const ClientCart = useContext(CartContext);
  const { pushHistory } = useCustomNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [countryCode, setCountryCode] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isCredentialSignInOpen, setIsCredentialSignInOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(otpTimeoutSeconds);
  const [cookies, setCookie] = useCookies(["gwLoginData"]);

  const [isSocialLogin, setIsSocialLogin] = useState(false);
  const [isCampaign, setIsCampaign] = useState(false);
  const [campaignQueryString, setCampaignQueryString] = useState("");
  const { state } = useLocation();

  const [isClickDisabled, setIsClickDisabled] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("module") === "flightAlert") {
      localStorage.removeItem("module");
      localStorage.setItem("subModule", "flightAlert");
    }
    const page = document.location.href.split("/").pop();
    if (
      page === "signin" &&
      cookies.gwLoginData &&
      cookies.gwLoginData.mobile
    ) {
      pushHistory("/");
    }
    const urlParams = Util.getUrlParams(window.location.href);
    if (urlParams.source) {
      if (urlParams.source.toLowerCase() === "campaign") {
        setCampaignQueryString(document.location.href.split("?")[1]);
        setIsCampaign(true);
        if (cookies.gwLoginData && cookies.gwLoginData.mobile)
          pushHistory("/campaign?" + document.location.href.split("?")[1]);
      }
    }
  }, []);

  useEffect(() => {
    document.title = props.title;
    $("html, body").animate({ scrollTop: 0 });
  }, [props.title]);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(otpTimeoutSeconds);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [seconds, minutes]);

  const handleLogin = () => {
    setIsSocialLogin(!isSocialLogin);
  };

  const handleOpenRegistration = () => {
    if (isCampaign) pushHistory("/signup?" + campaignQueryString);
    else pushHistory("/signup");
  };

  const backTo = () => {
    setIsOtpModalOpen(!isOtpModalOpen);
  };

  const handleResendOTP = async () => {
    setIsClickDisabled(true);
    setOtp("");
    if (seconds < 1 && minutes < 1) {
      let apiURL = config.api.auth.initiate;
      if (!props.pseudoUserId) {
        try {
          let apiResponse;
          let userObj = {
            countryCode,
            mobile: phoneValue?.replace(countryCode, "") || "",
          };
          let param = btoa(JSON.stringify(userObj));
          let headers = Util.getAuthHeaders();
          apiResponse = await callAPI.put(
            apiURL,
            { params: param },
            0,
            {},
            headers
          );

          let regResponse = await apiResponse.json();
          setIsClickDisabled(false);
          if (regResponse.status?.toString()?.startsWith("20")) {
            regResponse?.message && PushAlert.success(regResponse.message);
            setSeconds(otpTimeoutSeconds);
          } else if (regResponse.status === 429) {
            regResponse?.message && PushAlert.info(regResponse.message);
          } else {
            PushAlert.error(regResponse.message);
          }
        } catch (err) {
          setIsClickDisabled(false);
          PushAlert.error(err.response.message);
        }
      } else {
        setIsClickDisabled(false);
        setSeconds(otpTimeoutSeconds);
        PushAlert.info("Re-submit registration");
        props.setIsOpen(false);
      }
    } else {
      setIsClickDisabled(false);
    }
  };
  const handleVerify = async () => {
    if (otp) {
      try {
        setIsClickDisabled(true);
        let apiURL = config.api.auth.validate;
        deleteAllCookies();
        let userObj = {
          otp: otp || "",
        };
        let param = btoa(JSON.stringify(userObj));
        let apiResponse = await callAPI.put(apiURL, { params: param });
        let regResponse = await apiResponse.json();
        if (regResponse.status?.toString()?.startsWith("20")) {
          Util.sendMessageToReactNative(Sign_In_Event);
          const userInfo = await getUserInfo("both");
          let data = userInfo.data;
          let metadata = userInfo.metadata;

          const memberId =
            metadata?.status?.membership?.loyalty?.mmid ||
            metadata?.status?.membership?.mmid;

          let gwLoginData = {
            profileImageURL: "",
            email: data.email,
            mobile: data.mobile,
            userId: data.userId,
            name:
              data.fullName !== null && data.fullName !== undefined
                ? data.fullName
                : data.firstName + " " + data.lastName,
          };

          try {
            Util.triggerMoEngageEvent("sign_in", {
              userId: data.userId,
              name: gwLoginData.name,
              type: "login",
              lmsmemberid: memberId,
            });
            if (!window.ReactNativeWebView) {
              Moengage.add_unique_user_id(memberId);
              Moengage.add_user_name(gwLoginData.name);
              Moengage.add_user_attribute("lmsmemberid", memberId);
              Moengage.add_user_attribute("userId", data.userId);
            }
          } catch (e) {}

          if (getAppConfig("CALL_PROMO_API") && data?.userId) {
            let getPromoData = await applicablepromo(
              window.atob(data.userId),
              "L"
            );
            setSessionStorage("availablePromo", getPromoData);
          }
          setCookie("gwLoginData", JSON.stringify(gwLoginData), {
            path: "/",
            maxAge: 86400 * getAppConfig("LOGIN_COOKIE_EXPIRY_DAYS"),
          });

          await setUserPermission();
          await ClientCart.saveCart(true);
          // await ClientFlight.saveFlight();

          if (localStorage.getItem("subModule") === "flightAlert") {
            localStorage.setItem("module", "flightAlert");
            localStorage.removeItem("subModule");
            pushHistory("/travellers/flights/flight-information");
          } else if (localStorage.getItem("module") === "contactUs")
            pushHistory("/travellers/contact-us");
          else if (localStorage.getItem("module") === "tender")
            pushHistory("/corporate/engage-with-us/tenders");
          else if (localStorage.getItem("module") === "claim")
            pushHistory("/travellers/passenger-services/lost-found");
          else if (localStorage.getItem("module") === "myBooking")
            pushHistory("/travellers/profile/activeOrders");
          else if (localStorage.getItem("module") === "rewards") {
            localStorage.setItem("module", null);
            pushHistory("/travellers/rewards");
          } else if (isCampaign) {
            pushHistory("/campaign?" + campaignQueryString);
          } else if (
            localStorage.getItem("module") === "campaignRegistrationList"
          ) {
            pushHistory("/campaignRegistrationListing");
          } else if (localStorage.getItem("module") === "transitHotel") {
            pushHistory("/travellers/at-the-airport/relax/080-Transit-Hotel");
          } else if (localStorage.getItem("module") === "cabs") {
            pushHistory("/cabs/results");
          } else if (localStorage.getItem("module") === "paymentRedir") {
            pushHistory("/cartRedirect");
          } else if (localStorage.getItem("module") === "survey") {
            pushHistory("/");
          } else if (localStorage.getItem("module") === "genericFeedback") {
            pushHistory("/feedback-form");
          } else if (localStorage.getItem("module") === "flight-booking") {
            localStorage.setItem("module", null);
            pushHistory("/review", state);
          } else if (localStorage.getItem("module") === "cart") {
            pushHistory("/cartRedirect");
          } else pushHistory("/");

          regResponse?.message && PushAlert.success(regResponse.message);
        } else {
          regResponse?.message && PushAlert.warning(regResponse.message);
        }
        setIsClickDisabled(false);
      } catch (error) {
        setIsClickDisabled(false);
        if (error?.response?.message !== "") {
          PushAlert.warning(error?.response?.message);
        }
        console.log(error);
      }
    } else {
      PushAlert.info("Enter OTP");
    }
  };

  const handleNumberSubmit = async () => {
    setIsClickDisabled(true);
    setSeconds(otpTimeoutSeconds);
    if (phoneValue) {
      let apiURL = config.api.auth.initiate;
      let userObj = {
        countryCode,
        mobile: phoneValue?.replace(countryCode, "") || "",
      };
      let param = btoa(JSON.stringify(userObj));
      let headers = Util.getAuthHeaders();
      try {
        let apiResponse = await callAPI.put(
          apiURL,
          { params: param },
          0,
          {},
          headers
        );
        let regResponse = await apiResponse.json();
        setIsClickDisabled(false);
        if (regResponse.status?.toString()?.startsWith("20")) {
          regResponse?.message && PushAlert.success(regResponse.message);
          setIsOtpModalOpen(true);
        } else if (regResponse.status === 429) {
          regResponse?.message && PushAlert.info(regResponse.message);
          setIsOtpModalOpen(true);
        } else {
          PushAlert.error(regResponse.message);
        }
      } catch (err) {
        setIsClickDisabled(false);
        PushAlert.error(err.response.message);
      }
    } else {
      setIsClickDisabled(false);
      PushAlert.info("Enter Phone Number");
    }
  };

  return (
    <>
      {!isLoading ? (
        <>
          <div>
            <p>&nbsp;</p>
          </div>
          <div className="responsivegrid aem-GridColumn aem-GridColumn--default--12">
            <div className="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
              {isOtpModalOpen && (
                <div className="back-to-btn" onClick={backTo}>
                  <span style={{ marginRight: "10px" }}>
                    <img width={"20px"} src={LeftArrow} alt="" />
                  </span>
                  Back to <strong> Sign In</strong>
                </div>
              )}

              <div
                className={`signin-parent-container ${
                  isOtpModalOpen
                    ? "verify-otp-parent-container margin-class"
                    : null
                }`}
              >
                <div className="manual-signin-content fromspa no-signing-page">
                  <div className="content">
                    {!isOtpModalOpen && !isSocialLogin && (
                      <>
                        <div className="title">
                          <Text type="medium">
                            Login to get real-time flight updates and a
                            personalised app experience
                          </Text>
                        </div>

                        <div className="phone-input">
                          <PhoneInput
                            country={"in"}
                            value={phoneValue}
                            countryCodeEditable={false}
                            inputStyle={{ width: "87vw" }}
                            onChange={(phone, data) => {
                              setPhoneValue(phone);
                              setCountryCode(
                                data.dialCode ? data.dialCode : ""
                              );
                            }}
                            style={{ marginTop: 10 }}
                          />
                        </div>

                        <div className="get-otp-btn">
                          <PrimaryButton
                            className="sign_in_button"
                            style={{
                              marginTop: 36,
                              backgroundColor: `${
                                phoneValue.length >= 10 ? `${colors?.button?.primaryBackground}` : "#b2e4e3"
                              }`,
                              borderRadius: "100px",
                              width: "100%",
                              height: "54px",
                              pointerEvents: isClickDisabled ? "none" : "",
                              fontSize: "16px",
                            }}
                            onClick={handleNumberSubmit}
                          >
                            <Text type="bold"> Get OTP </Text>
                          </PrimaryButton>
                        </div>
                      </>
                    )}
                    {!isOtpModalOpen && isSocialLogin && (
                      <>
                        <a
                          style={{
                            color: "unset",
                          }}
                          href={config.api.login.social.google}
                        >
                          <div className="social-login-button">
                            <span class="google-icon"></span>
                            <span class="social-label">
                              Continue with Google
                            </span>
                          </div>
                        </a>

                        <a
                          style={{
                            color: "unset",
                          }}
                          href={config.api.login.social.twitter}
                        >
                          <div className="social-login-button">
                            <div className="twitter-icon"></div>
                            <span class="social-label">
                              {" "}
                              Continue with Twitter
                            </span>
                          </div>
                        </a>
                      </>
                    )}

                    {isOtpModalOpen && (
                      <>
                        <div className="title-otp">
                          <Text type="bold">Verify your OTP</Text>
                        </div>
                        <div className="code-instruction">
                          <Text type="regular">
                            Enter the 4 digit code sent to
                          </Text>
                        </div>
                        <div
                          className="otp-phn-number"
                          style={{
                            fontFamily: "Manrope",
                            fontStyle: "normal",
                            fontWeight: "800",
                            fontSize: "16px",
                            color: "#273135",
                          }}
                        >
                          <Text type="extra-bold"> +{phoneValue} </Text>
                        </div>
                        <div
                          data-id="otpContainer"
                          className="input-item otp-container mt-3"
                        >
                          <OtpInput
                            value={otp}
                            setValue={setOtp}
                            placeholder=""
                          />
                        </div>

                        <div style={{ marginTop: 10, marginLeft: 5 }}>
                          {seconds > 0 && (
                            <span className="time-remaining">
                              {`Time remaining  00:${seconds} secs`}
                            </span>
                          )}
                          {seconds < 1 && (
                            <span
                              className="additional-option"
                              onClick={() => handleResendOTP(false)}
                              style={{
                                pointerEvents: isClickDisabled ? "none" : "",
                              }}
                            >
                              <Text type="bold"> Resend OTP </Text>
                            </span>
                          )}
                        </div>
                        <div className="verify-wrapper">
                          <div className="verify-mobile-number">
                            <PrimaryButton
                              className="sign-up-verify-num"
                              style={{
                                backgroundColor: `${colors?.button?.primaryBackground}`,
                                borderRadius: "100px",
                                width: "100%",
                                marginTop: "40px",
                                pointerEvents: isClickDisabled ? "none" : "",
                              }}
                              onClick={handleVerify}
                            >
                              <Text type="extra-bold">
                                {" "}
                                Verify Mobile Number
                              </Text>
                            </PrimaryButton>
                          </div>
                        </div>
                      </>
                    )}

                    {!isOtpModalOpen && (
                      <>
                        {getAppConfig("SHOW_SOCIAL_LOGIN") ? ( //! change it to true for social login
                          <div className="social-login-link">
                            {isSocialLogin ? (
                              <Text type="regular">Have a local sim?</Text>
                            ) : (
                              <Text type="regular">
                                Don't have a local sim?
                              </Text>
                            )}{" "}
                            <span
                              id={
                                isSocialLogin
                                  ? "sign-in-mobile"
                                  : "sign-in-email"
                              }
                              style={{
                                color: "#04ADAA",
                                cursor: "pointer",
                                marginLeft: "5px",
                              }}
                              onClick={handleLogin}
                            >
                              {isSocialLogin
                                ? "Sign in with mobile number"
                                : "Sign in with e-mail"}
                            </span>
                          </div>
                        ) : null}
                        <div className="social-login-link">
                          <Text type="semi-bold"> Don't have an account?</Text>{" "}
                          <span
                            id="signup-button"
                            style={{
                              color: "#037B79",
                              cursor: "pointer",
                              marginLeft: "5px",
                            }}
                            onClick={handleOpenRegistration}
                          >
                            <Text type="bold">Sign up</Text>
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  {!isOtpModalOpen && (
                    <>
                      <CustomPicture
                        className="lantern-design-signIn"
                        mobilePicture={indoorLanternRightMobile}
                        desktopPicture={indoorLanternRightDesktop}
                      />
                    </>
                  )}
                </div>
              </div>

              {isCredentialSignInOpen && (
                <CredentialsSignIn
                  isOpen={isCredentialSignInOpen}
                  setIsOpen={setIsCredentialSignInOpen}
                  prevIsOpen={props.isOpen}
                  setPrevIsOpen={props.setIsOpen}
                />
              )}
              {props.registerIsOpen && (
                <Registration
                  isOpen={props.registerIsOpen}
                  setIsOpen={props.setRegisterIsOpen}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default SignIn;
