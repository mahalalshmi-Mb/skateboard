import Moengage from "@moengage/web-sdk";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import callAPI from "../../../../../commons/callAPI";
import config from "../../../../../commons/config";
import { getAppConfig } from "../../../../../commons/util/appConfigHelper";
import {
  applicablepromo,
  device,
  getUserInfo,
} from "../../../../../commons/util/helperFunctions";
import { setUserPermission } from "../../../../../commons/util/permissionsConfig";
import Util from "../../../../../commons/util/util";
import CustomOtpInput from "../../../../../containers/verifyOtp/components/CustomOtpInput/CustomOtpInput";
import { CartContext } from "../../../../../context/cartContext";
import ButtonWithLoading from "components/atoms/ButtonWithLoading";
import {
  Sign_In_Event,
  Sign_Up_Event,
} from "../../../../../util/FirebaseAnalyticsUtil";
import { setSessionStorage } from "../../../../../util/storageUtil";
import Text from "../../../../atoms/Text";
import PushAlert from "../../../../atoms/pushAlert";
import "./ViewTwo.css";

function ViewTwo(props) {
  const ClientCart = useContext(CartContext);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const [otp, setOtp] = useState("");
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["gwLoginData"]);
  const [error, setError] = useState(false);

  const [isClickDisabled, setIsClickDisabled] = useState(false);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(60);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [seconds, minutes]);

  const handleResendOtp = async () => {
    setIsClickDisabled(true);
    setOtp("");
    const splitArray = props.fullName.split(" ");
    const firstName = splitArray[0] || "";
    const lastName = splitArray[1] || "";

    if (seconds < 1 && minutes < 1) {
      let apiURL = config.api.auth.initiate;

      const splitArray = props.fullName.split(" ");
      const firstName = splitArray[0] || "";
      const lastName = splitArray[1] || "";
      const email = props.email || "";

      let userObj = {
        firstName: firstName?.trim() || "",
        lastName: lastName?.trim() || "",
        email: email?.trim() || "",
        countryCode: props.countryCode,
        mobile: props.phNumber?.replace(props.countryCode, "") || "",
      };
      let param = btoa(JSON.stringify(userObj));
      let headers = Util.getAuthHeaders();

      if (!props.pseudoUserId) {
        try {
          let regResponse = await callAPI.put(
            apiURL,
            { params: param },
            0,
            {},
            headers
          );
          setIsClickDisabled(false);

          if (regResponse.status?.toString()?.startsWith("20")) {
            PushAlert.success(regResponse.message);
            setSeconds(60);
          } else if (regResponse.status === 429) {
            PushAlert.warning(regResponse.message);
          } else {
            PushAlert.error(regResponse.message);
          }
        } catch (err) {
          setIsClickDisabled(false);
          console.log(err.response.message);
          PushAlert.error("Something went wrong, please try again!");
        }
      } else {
        setIsClickDisabled(false);
        setSeconds(60);
        PushAlert.error("Re-submit registration");
        goToViewSignUp();
      }
    } else {
      setIsClickDisabled(false);
    }
  };

  const goToViewSignUp = () => {
    props.setViewIndex(3);
  };

  const handleVerifyOtp = async () => {
    if (otp) {
      try {
        setIsClickDisabled(true);
        if (props.phNumber) {
          setVerifyOtpLoading(true);
          const data = {
            source: "regular",
            name: props.pseudoUserId ? "signup" : "signin",
          };
          const userAgentData = Util.getUserAgentData(data);
          const userMetadata = Util.getUsermetaData();
          let apiURL = config.api.auth.validate;
          let userObj = {
            otp: otp || "",
          };
          let param = btoa(JSON.stringify(userObj));
          // deleteAllCookies();
          let apiResponse = await callAPI.put(apiURL, { params: param });
          let regResponse = await apiResponse.json();
          if (regResponse.status?.toString()?.startsWith("20")) {
            let isSignUp = false;
            if (props.pseudoUserId) {
              isSignUp = true;
              Util.sendMessageToReactNative(Sign_Up_Event);
            } else {
              isSignUp = false;
              Util.sendMessageToReactNative(Sign_In_Event);
            }
            regResponse?.message && PushAlert.success(regResponse.message);

            const userInfo = await getUserInfo("both");
            let data = userInfo.data;
            let metadata = userInfo.metadata;

            const memberId =
              metadata?.status?.membership?.loyalty?.mmid ||
              metadata?.status?.membership?.mmid;

            let gwLoginData = {
              profileImageURL: "",
              email: data?.email || "",
              mobile: data?.mobile || "",
              name: data?.fullName || "",
              userId: data?.userId || "",
            };

            try {
              Util.triggerMoEngageEvent("quick_sign_in", {
                userId: data.userId,
                name: gwLoginData.name,
                type: isSignUp ? "register" : "login",
                lmsmemberid: memberId,
              });
              Moengage.add_unique_user_id(memberId);
              Moengage.add_user_name(gwLoginData.name);
              Moengage.add_user_attribute("lmsmemberid", memberId);
              Moengage.add_user_attribute("userId", data.userId);
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
            goToStageTwo();
          } else {
            regResponse?.message && PushAlert.warning(regResponse.message);
            setVerifyOtpLoading(false);
            setOtp("");
            setError(true);
            setTimeout(() => {
              setError(false);
            }, 5000);
            // console.log("OTP Verification Unsuccessful, re-enter OTP");
          }
        }
        setIsClickDisabled(false);
      } catch (error) {
        setIsClickDisabled(false);
        console.log(error);
        setVerifyOtpLoading(false);
        setOtp("");
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
        PushAlert.error("Something went wrong, please try again");
      }
    } else {
      setVerifyOtpLoading(false);
      PushAlert.error("Enter OTP");
    }
  };

  const goToStageTwo = () => {
    props.setViewIndex(2);
  };

  return (
    <div className="view-two-container">
      <HeaderText>
        <Text type="extra-bold">Verify your OTP</Text>
      </HeaderText>
      <SubHeaderText>
        <Text>
          Enter the 4 digit code sent to your email id and to your phone
        </Text>
      </SubHeaderText>
      <UserInputContainer>
        <CustomOtpInput
          containerStyleObj={{ backgroundColor: "#000" }}
          value={otp}
          setValue={setOtp}
          placeholder="0-0-0-0"
          inputContainerClassname={
            error ? "verify-otp-input error" : "verify-otp-input"
          }
        />
      </UserInputContainer>
      <ResendOtpTimerContainer>
        {seconds > 0 && (
          <ResendOtpTimerText>
            <Text>{`Time remaining  00:${
              seconds > 9 ? seconds : `0${seconds}`
            } secs`}</Text>
          </ResendOtpTimerText>
        )}
      </ResendOtpTimerContainer>
      <UserActionContainer>
        <ButtonWithLoading
          isLoading={verifyOtpLoading}
          disabled={otp.length !== 4 || isClickDisabled || verifyOtpLoading}
          onClick={() => handleVerifyOtp()}
          buttonLabel="Verify OTP"
        />
        <ResendOtpButton
          disabled={seconds > 1}
          onClick={() => handleResendOtp()}
          style={{
            pointerEvents: isClickDisabled ? "none" : "",
          }}
        >
          <Text type="bold">Resend OTP</Text>
        </ResendOtpButton>
      </UserActionContainer>
    </div>
  );
}

const HeaderText = styled.div`
  width: 100%;
  color: #273135;
  font-size: 21px;
  padding-top: 8px;

  @media ${device.laptop} {
    margin: 0 auto;
    text-align: center;
    font-size: 24px;
  }
`;

const SubHeaderText = styled.div`
  max-width: 80%;
  color: #888;
  font-size: 16px;
  line-height: 25px;
  padding-top: 16px;

  @media ${device.laptop} {
    margin: 0 auto;
    text-align: center;
  }
`;

const UserInputContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
  margin-top: 4px;
`;
const UserActionContainer = styled.div`
  width: 100%;
  margin-top: 30px;

  @media ${device.laptop} {
    max-width: 210px;
    margin: 0px auto;
    margin-top: 30px;
  }
`;

const ResendOtpTimerContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 32px;

  @media ${device.laptop} {
    margin-top: 8px;
  }
`;
const ResendOtpTimerText = styled.div`
  color: #4d5055;
  font-size: 16px;
  opacity: 0.8;
`;
const ResendOtpButton = styled.div`
  width: 100%;
  background-color: transparent;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
  font-weight: 800;
  font-size: 16px;
  color: #037b79;
  margin-top: 16px;
  cursor: pointer;
`;
export default ViewTwo;
