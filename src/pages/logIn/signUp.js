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
import CustomTextField from "../../components/molecules/customTextField";
import ConsentCheckBox from "../../components/organisms/ConsentCheckbox";
import PrimaryButton from "../../containers/manualSignIn/components/primaryButton";
import "../../containers/manualSignIn/manualSIgnInStyle.css";
import { otpTimeoutSeconds } from "../../containers/manualSignIn/util";
import OtpInput from "../../containers/verifyOtp/components/CustomOtpInput/CustomOtpInput";
import { CartContext } from "../../context/cartContext";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { Sign_In_Event, Sign_Up_Event } from "../../util/FirebaseAnalyticsUtil";
import {
  getSessionStorage,
  removeSessionStorage,
  setSessionStorage,
} from "../../util/storageUtil";
import { colors } from "theme/colors";

function SignUp(props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ClientCart = useContext(CartContext);
  const { pushHistory } = useCustomNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(otpTimeoutSeconds);
  const [cookies, setCookie] = useCookies(["gwLoginData"]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState();
  const [isVaildEmail, setIsValidEmail] = useState(false);
  const [pseudoUserId, setPseudoUserId] = useState("");
  const [referral, setReferral] = useState("");

  const [isCampaign, setIsCampaign] = useState(false);
  const [campaignQueryString, setCampaignQueryString] = useState("");
  const [captiveQueryString, setcaptiveQueryString] = useState("");

  const [referralCodeError, setReferralCodeError] = useState(false);
  const [referralCodeSuccess, setReferralCodeSuccess] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);

  const [isClickDisabled, setIsClickDisabled] = useState(false);

  const [pulseProgramHasConsent, setPulseProgramHasConsent] = useState(false);

  useEffect(() => {
    if (email) {
      setIsValidEmail(Util.isEmailValid(email));
    }
  }, [email]);

  useEffect(() => {
    const page = document.location.href.split("/").pop();
    if (
      page === "signup" &&
      cookies.gwLoginData &&
      cookies.gwLoginData.mobile
    ) {
      pushHistory("/");
    }
    const urlParams = Util.getUrlParams(window.location.href);

    if (urlParams.source) {
      setcaptiveQueryString(document.location.href.split("source=")[1]);
      if (urlParams.source.toLowerCase() === "campaign") {
        setCampaignQueryString(document.location.href.split("?")[1]);
        setIsCampaign(true);
        if (cookies.gwLoginData && cookies.gwLoginData.mobile)
          pushHistory("/campaign?" + document.location.href.split("?")[1]);
      }
    }

    let tempSignUp = getSessionStorage("temp-signup");
    if (tempSignUp) {
      setFirstName(tempSignUp.firstName);
      setNumber(tempSignUp.number);
      removeSessionStorage("temp-signup");
    }
  }, []);

  const handleSignInRegistration = () => {
    if (isCampaign) pushHistory("/signin?" + campaignQueryString);
    else pushHistory("/signin");
  };

  useEffect(() => {
    if (referralCodeError) {
      setReferralCodeError(false);
    }
    if (referralCodeSuccess) {
      setReferralCodeSuccess(false);
    }
    const getDataTimerId = setTimeout(() => {
      if (referral) callReferralCheckApi();
    }, 1000);

    return () => clearTimeout(getDataTimerId);
  }, [referral]);

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

  useEffect(() => {
    //Snippet to handle referral code passed through params
    if (searchParams.get("enrollment_referrer")) {
      setReferral(searchParams.get("enrollment_referrer"));
    }

    setIsLoading(false);
  }, []);

  const callReferralCheckApi = async () => {
    try {
      let apiURL = `${config.api.user.referral_check}`;
      let apiResponse;
      apiResponse = await callAPI.get(apiURL, { referral });

      let regResponse = await apiResponse.json();

      if (regResponse.data.isValid) {
        PushAlert.success(
          "Code verified! Get ready to be rewarded, please proceed with registration"
        );
        setReferralCodeSuccess(true);
      } else {
        PushAlert.error(
          "Code not valid, please enter valid code or proceed without referral code"
        );
        setReferralCodeError(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const backTo = () => {
    if (isOtpModalOpen) setIsOtpModalOpen(false);
    else if (isCampaign) {
      pushHistory("/signin?" + campaignQueryString);
    } else pushHistory("/signin");
  };

  const handleResendOTP = async () => {
    setIsClickDisabled(true);
    setOtp("");
    if (seconds < 1 && minutes < 1) {
      let apiURL = isCampaign
        ? `${config.api.auth.initiate}?source=${captiveQueryString}`
        : config.api.auth.initiate;
      if (!pseudoUserId) {
        try {
          let apiResponse;
          let userObj = {
            firstName: firstName?.trim() || "",
            lastName: lastName?.trim() || "",
            email: email?.trim() || "",
            countryCode,
            mobile: number?.replace(countryCode, "") || "",
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
          } else {
            regResponse?.message && PushAlert.error(regResponse.message);
          }
        } catch (err) {
          setIsClickDisabled(false);
          PushAlert.error(err.response.message);
        }
      } else {
        setIsClickDisabled(false);
        setSeconds(otpTimeoutSeconds);
        PushAlert.info("Re-submit registration");
        setIsOtpModalOpen(false);
      }
    } else {
      setIsClickDisabled(false);
    }
  };
  const handleVerify = async () => {
    let apiResponse;
    if (otp) {
      try {
        setIsClickDisabled(true);
        if (number) {
          let source = "regular";
          if (isCampaign) {
            const urlParams = Util.getUrlParams(window.location.href);
            if (urlParams.source) {
              source = urlParams.source;
            }
          } else if (localStorage.getItem("subModule")) {
            source = localStorage.getItem("subModule");
          } else if (localStorage.getItem("module")) {
            source = localStorage.getItem("module");
          }

          const data = {
            source: searchParams.get("enrollment_source")
              ? searchParams.get("enrollment_source")
              : source,
            name: "signup",
          };
          const userAgentData = Util.getUserAgentData(data);
          const userMetadata = Util.getUsermetaData();
          let apiURL = config.api.auth.validate;
          deleteAllCookies();
          let userObj = {
            otp: otp || "",
          };
          let param = btoa(JSON.stringify(userObj));
          apiResponse = await callAPI.put(apiURL, { params: param });
        }
        let regResponse = await apiResponse.json();
        if (regResponse?.status?.toString()?.startsWith("20")) {
          let isSignUp = false;
          if (pseudoUserId) {
            isSignUp = true;
            Util.sendMessageToReactNative(Sign_Up_Event);
          } else {
            isSignUp = false;
            Util.sendMessageToReactNative(Sign_In_Event);
          }
          PushAlert.success(regResponse?.message);

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
            name: data.fullName,
            userId: data.userId,
          };

          try {
            Util.triggerMoEngageEvent("sign_up", {
              userId: data.userId,
              name: gwLoginData.name,
              type: isSignUp ? "register" : "login",
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

          if (localStorage.getItem("module") === "contactUs")
            pushHistory("/travellers/contact-us");
          else if (localStorage.getItem("module") === "myBooking")
            pushHistory("/travellers/profile/activeOrders");
          else if (isCampaign) {
            pushHistory("/campaign?" + campaignQueryString);
          } else if (localStorage.getItem("module") === "genericFeedback") {
            pushHistory("/feedback-form");
          } else if (localStorage.getItem("module") === "cart") {
            pushHistory("/cartRedirect");
          } else pushHistory("/");
        } else {
          regResponse?.message && PushAlert.warning(regResponse.message);
        }
        setIsClickDisabled(false);
      } catch (error) {
        setIsClickDisabled(false);
        if (error?.response?.message) {
          PushAlert.warning(error.response.message);
        }
      }
    } else {
      PushAlert.info("Enter OTP");
    }
  };

  const handleOpenVerifyOtp = async () => {
    if (firstName && firstName.trim() !== "" && number) {
      if (number.slice(0, 2) === "91") {
        if (number.length !== 12) {
          PushAlert.warning("Please enter your 10-digit mobile number");
          // setReferralCodeError(true);
          return false;
        }
      }

      let validityCheckPass = true;
      if (!email || !Util.isEmailValid(email)) {
        validityCheckPass = false;
        PushAlert.warning("Please Enter Valid Email ID");
      }

      if (validityCheckPass) {
        setIsClickDisabled(true);
        setSeconds(otpTimeoutSeconds);
        try {
          let apiURL = isCampaign
            ? `${config.api.auth.initiate}?source=${captiveQueryString}`
            : config.api.auth.initiate;

          let userObj = {
            firstName: firstName?.trim() || "",
            lastName: lastName?.trim() || "",
            email: email?.trim() || "",
            countryCode,
            mobile: number?.replace(countryCode, "") || "",
          };
          let param = btoa(JSON.stringify(userObj));
          let headers = Util.getAuthHeaders();
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
            setPseudoUserId(regResponse.data);
            setIsOtpModalOpen(true);
            PushAlert.warning(regResponse.message);

            const config = localStorage.getItem("appConfig");
            const parsedConfig = JSON.parse(config);

            if (parsedConfig.ENVIRONMENT.toLowerCase().includes("dev")) {
              Util.sendMessageToReactNative("User Signup - GET OTP", {
                "User Name": `${firstName.trim()} ${lastName.trim()}`,
                "Phone Number": number,
              });
            }
          } else if (regResponse.status === 429) {
            setPseudoUserId(regResponse.data);
            setIsOtpModalOpen(true);
            PushAlert.error(regResponse.message);
          } else {
            PushAlert.error(regResponse.message);
          }
        } catch (err) {
          setIsClickDisabled(false);
          PushAlert.error(err.response.message);
        }
      }
    } else {
      if (!firstName || firstName.trim() === "") {
        PushAlert.warning("Please Enter First Name");
        setFirstNameError(true);
      } else if (!number) {
        PushAlert.warning("Please Enter Mobile Number");
      }
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
                    <img width={"20px"} src={LeftArrow} alt="Back to login" />
                  </span>
                  <span>
                    Back to <strong>Login</strong>
                  </span>
                </div>
              )}
              <div
                className={`signup-parent-container ${
                  isOtpModalOpen
                    ? "verify-otp-parent-container margin-class"
                    : null
                }`}
              >
                <div className="manual-signin-content fromspa no-signing-page ">
                  <div className="content">
                    {!isOtpModalOpen && (
                      <>
                        <div className="title">
                          <Text type="medium">
                            Sign up to get real-time flight updates and a
                            personalised app experience
                          </Text>
                        </div>
                        <div className="custom-text-field">
                          <CustomTextField
                            value={firstName}
                            setValue={setFirstName}
                            placeholder={"Full Name"}
                            type="text"
                            error={firstNameError}
                            setError={setFirstNameError}
                            mandatory={true}
                          />
                        </div>
                        <div style={{ marginTop: 20 }}>
                          <PhoneInput
                            country={"in"}
                            value={number}
                            countryCodeEditable={false}
                            inputStyle={{ width: "87vw" }}
                            onChange={(phone, data) => {
                              setNumber(phone);
                              setCountryCode(
                                data.dialCode ? data.dialCode : ""
                              );
                            }}
                            style={{ marginTop: 5 }}
                          />
                        </div>
                        <div className="custom-text-field">
                          <CustomTextField
                            value={email}
                            setValue={setEmail}
                            placeholder={"Email"}
                            type="text"
                            mandatory={true}
                          />
                        </div>
                        <ConsentCheckBox
                          isChecked={pulseProgramHasConsent}
                          setIsChecked={setPulseProgramHasConsent}
                          number={number}
                          firstName={firstName}
                        />

                        {getAppConfig("SHOW_REWARDS_PROGRAM") ? (
                          <div
                            className="custom-referral-field"
                            style={{ marginTop: "30px" }}
                          >
                            <CustomTextField
                              value={referral}
                              setValue={setReferral}
                              placeholder={"Referral code"}
                              inputProps={{ maxLength: 50 }}
                              type="text"
                              disabled={false}
                              error={referralCodeError}
                              setError={setReferralCodeError}
                              success={referralCodeSuccess}
                            />
                          </div>
                        ) : null}

                        <PrimaryButton
                          className="otp-btn-mob"
                          style={{
                            backgroundColor: `${colors?.button?.primaryBackground}`,
                            fontFamily: "ManropeBold",
                            fontSize: "16px",
                            opacity: `${
                              firstName.length > 2 &&
                              number.length > 11 &&
                              isVaildEmail &&
                              pulseProgramHasConsent
                                ? 1
                                : 0.32
                            }`,
                            pointerEvents:
                              isClickDisabled || !pulseProgramHasConsent
                                ? "none"
                                : "",
                          }}
                          onClick={handleOpenVerifyOtp}
                        >
                          <Text type="bold"> Get OTP </Text>
                        </PrimaryButton>

                        <div className="social-login-link">
                          <span>
                            <Text type="semi-bold">
                              {" "}
                              Already have an account?
                            </Text>
                          </span>
                          <span
                            id="signup-button"
                            style={{
                              color: "#037B79",
                              cursor: "pointer",
                              marginLeft: "5px",
                            }}
                            onClick={handleSignInRegistration}
                          >
                            <Text type="bold"> Login </Text>
                          </span>
                        </div>
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
                          <Text type="extra-bold">+{number}</Text>
                        </div>
                        <div
                          data-id="otpContainer"
                          className="input-item otp-container mt-3"
                        >
                          <OtpInput
                            value={otp}
                            setValue={setOtp}
                            placeholder="0-0-0-0"
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
                                opacity: `${otp.length === 4 ? 1 : 0.32}`,
                                borderRadius: "100px",
                                width: "100%",
                                marginTop: "30px",
                                pointerEvents: isClickDisabled ? "none" : "",
                                // fontWeight:"800",
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
                  </div>
                </div>

                {!isOtpModalOpen && (
                  <>
                    <CustomPicture
                      className="lantern-design-signUp"
                      mobilePicture={indoorLanternRightMobile}
                      desktopPicture={indoorLanternRightDesktop}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default SignUp;
