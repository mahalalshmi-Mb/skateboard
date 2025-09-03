import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import callAPI from "../../../../commons/callAPI";
import config from "../../../../commons/config";
import {
  decode,
  encode,
  getUserInfo,
} from "../../../../commons/util/helperFunctions";
import { SnackbarContext } from "../../../../context/snackbarContext";

import { useHistory, useLocation } from "react-router-dom";
import Util from "../../../../commons/util/util";
import ButtonLoader from "../../../../components/atoms/buttonLoader";
import Loader from "../../../../components/atoms/loader";
import PushAlert from "../../../../components/atoms/pushAlert";
import { PrimaryButton } from "../../../../theme/globalStyleSheet";
import "./personalDetails.css";

import { getAppConfig } from "../../../../commons/util/appConfigHelper";
import Text from "../../../../components/atoms/Text";
import { otpTimeoutSeconds } from "../../../../containers/manualSignIn/util";
import { CartContext } from "../../../../context/cartContext";
import { NavContext } from "../../../../context/navContext";
import {
  BannerContainer,
  BannerWrapper,
  DatePickerContainer,
  ErrorText,
  FooterContainer,
  FormContainer,
  FormRow,
  FormTitle,
  FormUserInputContainer,
  FormWrapper,
  GoBackContainer,
  GoBackIcon,
  GoBackText,
  InputWrapper,
  PageWrapper,
  TextField,
  UserDetailsContainer,
  UserDetailsWrapper,
  UserNameContainer,
  UserPhNoContainer,
  UserProfileImage,
  UserProfileImageContainer,
} from "./style";

import MUITextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { isMobile } from "react-device-detect";
import moment from "moment";
import UnknownUserImage from "../../../../assets/images/header/Profile-photo.svg";

import Moengage from "@moengage/web-sdk";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/en-gb";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import { useConfig } from "context/configContext";
import BackArrowWhite from "../../../../assets/images/arrows/backArrow.svg";

function PersonalDetails(props) {
  const { pathname } = useLocation();
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();
  const useNav = useContext(NavContext);
  const useSnackbar = useContext(SnackbarContext);
  const { countryCode } = useConfig();
  const [cookies, setCookie, removeCookie] = useCookies(["gwLoginData"]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phNo, setPhNo] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState();
  const [editMode, setEditMode] = useState(
    props.location.state !== undefined
      ? props.location.state.showEditMode
      : false
  );

  const [profileData, setProfileData] = useState();
  const [isEditEmail, setIsEditEmail] = useState(false);
  const [isEditMobile, setIsEditMobile] = useState(false);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditDob, setIsEditDob] = useState(false);
  const [isEditNationality, setIsEditNationality] = useState(false);

  const [inputProfileImage, setInputProfileImage] = useState(null);
  const [rawInputImage, setRawInputImage] = useState(null);
  const [saveIsLoading, setSaveIsLoading] = useState(false);
  const [disabledFields, setDisabledFields] = useState([]);

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [seconds, setSeconds] = useState(otpTimeoutSeconds);
  const [otp, setOtp] = useState("");
  const [number, setNumber] = useState("");
  const [dob, setDob] = useState(null);
  const [nationality, setNationality] = useState("");
  const [errorCode, setErrorCode] = useState({});

  const ClientCart = useContext(CartContext);

  const [isClickDisabled, setIsClickDisabled] = useState(false);

  useEffect(() => {
    document.title = props.title || "";
  }, [props.title]);

  useEffect(() => {
    getProfileInfo();
  }, []);

  useEffect(() => {
    if (isMobile) {
      useNav.hideFooterNavs();
      useNav.hideBottomNavs();
      useNav.showHeaderGoBack();
    } else {
      useNav.hideFooterNavs();
      useNav.hideBottomNavs();
      useNav.hideHeaderGoBack();
    }

    return () => {
      useNav.showFooterNavs();
      useNav.showBottomNavs();
      useNav.hideHeaderGoBack();
    };
  }, []);

  useEffect(() => {
    if (isOtpModalOpen) {
      const myInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
      }, 1000);
      return () => {
        clearInterval(myInterval);
      };
    } else {
      setSeconds(otpTimeoutSeconds);
    }
  }, [seconds, isOtpModalOpen]);

  const getProfileInfo = async () => {
    try {
      // Todo: Update acccording to getUserInfo from Develop
      let apiData = await getUserInfo("both");
      let data = apiData.data;
      if (apiData.metadata?.uac?.immutable) {
        setDisabledFields(apiData.metadata.uac.immutable);
      }
      if (data) {
        setProfileData(data);
        setProfileImageUrl(
          data.profileImage && data.profileImage.absolutePath
            ? data.profileImage.absolutePath
            : ""
        );
        setUserId(
          cookies.gwLoginData && cookies.gwLoginData.userId
            ? cookies.gwLoginData.userId
            : ""
        );
        setFirstName(
          data.firstName !== null && data.firstName !== undefined
            ? data.firstName
            : ""
        );
        setLastName(
          data.lastName !== null && data.lastName !== undefined
            ? data.lastName
            : ""
        );

        if (data.email !== null && data.email !== undefined) {
          setEmail(decode(data.email));
        }

        if (data.mobileMasked !== null && data.mobileMasked !== undefined) {
          setPhNo(data.mobileMasked);
        }

        setDob(
          data.dob !== null && data.dob !== undefined && data.dob !== ""
            ? moment(data.dob)
            : ""
        );

        setNationality(
          data.nationality !== null && data.nationality !== undefined
            ? data.nationality
            : ""
        );

        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSave = () => {
    let errors = {};
    if (isEditEmail && email !== decode(profileData.email)) {
      setIsClickDisabled(true);
      setSaveIsLoading(true);
      if (Util.isEmailValid(email)) {
        handleVerifyEmail(email);
      } else {
        PushAlert.error("Invalid email format, please try again!");
        setEmail("");
        setSaveIsLoading(false);
        setIsClickDisabled(false);
      }
    } else if (isEditMobile && phNo !== profileData.mobileMasked) {
      setIsClickDisabled(true);
      setSaveIsLoading(true);
      // handleVerifyMobile();
    } else if (isEditName || isEditDob || isEditNationality) {
      if (firstName.trim() === "") {
        PushAlert.error("Please Enter First Name");
        setIsClickDisabled(false);
        setSaveIsLoading(false);
      }
      if (firstName?.trim()?.length > 20) {
        errors["firstName"] = "Maximum of 20 characters allowed";
        setIsClickDisabled(false);
        setSaveIsLoading(false);
      }
      if (lastName?.trim()?.length > 20) {
        errors["lastName"] = "Maximum of 20 characters allowed";
        setIsClickDisabled(false);
        setSaveIsLoading(false);
      }
      if (moment(dob)?.isAfter(moment())) {
        errors["dob"] = "Invalid Date of birth";
        PushAlert.error("Invalid Date of birth");
        setIsClickDisabled(false);
        setSaveIsLoading(false);
        return;
      }
      if (
        firstName.trim() !== "" &&
        firstName?.trim()?.length <= 20 &&
        lastName?.trim()?.length <= 20
      ) {
        setIsClickDisabled(true);
        setSaveIsLoading(true);
        submitPersonalDetails();
      }
    }
    if (rawInputImage !== null) {
      setIsClickDisabled(true);
      setSaveIsLoading(true);
      saveProfileImage();
    }
    setErrorCode(errors);
    setTimeout(() => {
      setErrorCode({});
    }, [3000]);
  };

  const saveProfileImage = async () => {
    let apiURL = config.api.user.updateProfileImage;
    try {
      let apiResponse = await callAPI.putFormData(apiURL, {
        image: rawInputImage,
      });

      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        useSnackbar.showMessage("Profile Image Updated Successfully");
        setEditMode(false);
      } else {
        useSnackbar.showMessage("Something went wrong, please try again.");
      }
      setIsClickDisabled(false);
      setSaveIsLoading(false);
    } catch (err) {
      console.log("error", err);
      setIsClickDisabled(false);
      setSaveIsLoading(false);
    }
  };

  const handleVerifyEmail = async (email) => {
    try {
      let apiURL = `${config.api.user.requestOtpUpdateEmail.replace(
        ":email",
        encode(email)
      )}`;
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        PushAlert.success(regResponse.message);
        pushHistory(`${pathname}/verify/email`, {
          type: "email",
          email: email,
          mobile: phNo,
          id: userId,
          isEditName: isEditName,
          isEditDob: isEditDob,
          isEditNationality: isEditNationality,
          firstName: firstName,
          lastName: lastName,
          fullName: firstName + " " + lastName,
          dob: moment(dob).format("lll"),
          nationality: nationality,
        });
      } else {
        PushAlert.error(regResponse.message);
      }
    } catch (error) {
      PushAlert.error("Something went wrong");
    }
    setIsClickDisabled(false);
    setSaveIsLoading(false);
  };

  const submitPersonalDetails = async () => {
    try {
      let dateOfBirth = profileData?.dob || "";
      let nation = profileData?.nationality || "";

      if (dob !== null && dob !== undefined && dob !== "") {
        dateOfBirth = moment(dob).format("lll");
      }
      if (
        nationality !== null &&
        nationality !== undefined &&
        nationality !== ""
      ) {
        nation = nationality;
      }
      let phNo = "";
      let countryCode = "";
      if (profileData?.mobile) {
        phNo = atob(profileData?.mobile);
      }
      if (profileData?.countryCode) {
        countryCode = profileData?.countryCode;
      }
      let apiURL = config.api.auth.initiate;
      let userObj = {
        countryCode,
        mobile: phNo,
        firstName,
        lastName,
        nationality: nation,
        dob: dateOfBirth,
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
      if (apiResponse.status === 202 || apiResponse.status === 200) {
        if (regResponse.status?.toString()?.startsWith("20")) {
          PushAlert.success("Personal Details Updated Successfully");
          setEditMode(false);
          updateUserInfo();
          try {
            Util.triggerMoEngageEvent("profile_updated", {
              firstName: firstName,
              lastName: lastName,
              email: email,
              mobile: atob(profileData?.mobile),
              dob: dateOfBirth,
              nationality: nation,
            });
            if (!window.ReactNativeWebView) {
              Moengage.add_first_name(firstName);
              Moengage.add_last_name(lastName);
              Moengage.add_email(email);
              Moengage.add_mobile(atob(profileData?.mobile));
              Moengage.add_user_attribute("dob", dateOfBirth);
              Moengage.add_user_attribute("nationality", nation);
            }
          } catch (e) {}
        } else {
          PushAlert.error("Something went wrong, please try again.");
        }
      } else {
        PushAlert.error("Something went wrong, please try again.");
      }
      setIsClickDisabled(false);
      setSaveIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const updateUserInfo = async () => {
    let data = await getUserInfo();

    let gwLoginData = {
      ...cookies.gwLoginData,
      profileImageURL: "",
      email: data.email,
      mobile: data.mobile,
      name:
        data.fullName !== null && data.fullName !== undefined
          ? data.fullName
          : data.firstName + " " + data.lastName,
    };
    setCookie("gwLoginData", JSON.stringify(gwLoginData), {
      path: "/",
      maxAge: 86400 * getAppConfig("LOGIN_COOKIE_EXPIRY_DAYS"),
    });
  };

  const handleEmailChange = (event) => {
    setIsEditEmail(true);
    setEmail(event.target.value);
  };

  const handleMobileChange = (event) => {
    setIsEditMobile(true);
    setPhNo(event.target.value);
  };

  const handleSendOtp = async () => {
    if (number.length !== 12) {
      PushAlert.warning("Please enter your 10-digit mobile number");
      // setReferralCodeError(true);
      return false;
    }
    setIsClickDisabled(true);
    let apiURL = config.api.login.otp;
    try {
      let apiResponse = await callAPI.patch(apiURL, {
        username: number,
      });
      let regResponse = await apiResponse.json();
      setIsClickDisabled(false);
      if (regResponse.status === 201) {
        PushAlert.success("OTP Generation Successful");
        setIsOtpModalOpen(true);
        setIsMobileModalOpen(false);
      } else if (regResponse.status === 429) {
        PushAlert.warning("Previous OTP still alive, please re-use");
        setIsOtpModalOpen(true);
        setIsMobileModalOpen(false);
      } else {
        PushAlert.error(regResponse.message);
      }
    } catch (err) {
      setIsClickDisabled(false);
      PushAlert.error("OTP Generation Unsuccessful");
      console.log("error", err.response.status);
    }
  };

  const handleImageChange = async (e) => {
    if (e.target.files.length > 0) {
      setInputProfileImage(URL.createObjectURL(e.target.files[0]));
      setRawInputImage(e.target.files[0]);
    }
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <PageWrapper className="personal-details-container">
        <BannerContainer>
          <GoBackContainer onClick={() => history.goBack()}>
            <GoBackIcon src={BackArrowWhite} alt="back-arrow" />
            <GoBackText>
              <Text>Go Back</Text>
            </GoBackText>
          </GoBackContainer>
          <BannerWrapper>
            <UserDetailsContainer>
              <UserProfileImageContainer>
                {/* <input
                  type="file"
                  accept="image/*"
                  style={{
                    position: "absolute",
                    width: "113px",
                    height: "113px",
                    opacity: "0",
                  }}
                  onChange={handleImageChange}
                /> */}
                <UserProfileImage
                  src={inputProfileImage || profileImageUrl}
                  onError={(e) => {
                    e.target.src = UnknownUserImage;
                  }}
                />
              </UserProfileImageContainer>
              <UserDetailsWrapper>
                <UserNameContainer>
                  <Text type="bold">
                    {profileData?.firstName?.trim()?.length > 15
                      ? profileData?.firstName?.trim().slice(0, 16) + ".."
                      : profileData?.firstName}
                  </Text>
                </UserNameContainer>
                <UserPhNoContainer>
                  <Text type="medium">{profileData?.mobileMasked}</Text>
                </UserPhNoContainer>
              </UserDetailsWrapper>
            </UserDetailsContainer>
          </BannerWrapper>
        </BannerContainer>
        <FormContainer>
          <FormWrapper>
            <FormTitle>
              <Text type="bold">My Profile</Text>
            </FormTitle>
            <FormUserInputContainer>
              <FormRow>
                <InputWrapper>
                  <TextField
                    placeholder="First Name"
                    type="text"
                    value={firstName}
                    onChange={(event) => {
                      setFirstName(
                        event.target.value.replace(/[^ a-zA-Z]+/gi, "")
                      );
                      setIsEditName(true);
                    }}
                    autoComplete="off"
                  />
                  <ErrorText>
                    <Text>{errorCode["firstName"]}</Text>
                  </ErrorText>
                </InputWrapper>
                <InputWrapper>
                  <TextField
                    placeholder="Last Name"
                    type="text"
                    value={lastName}
                    onChange={(event) => {
                      setLastName(
                        event.target.value.replace(/[^ a-zA-Z]+/gi, "")
                      );
                      setIsEditName(true);
                    }}
                    autoComplete="off"
                  />
                  <ErrorText>
                    <Text>{errorCode["lastName"]}</Text>
                  </ErrorText>
                </InputWrapper>
              </FormRow>
              <FormRow>
                <InputWrapper>
                  <TextField
                    placeholder="Phone Number"
                    type="text"
                    maxLength="15"
                    value={phNo}
                    onChange={(event) => handleMobileChange(event)}
                    autoComplete="off"
                    disabled={disabledFields.includes("mobile") ? true : false}
                  />
                </InputWrapper>
                <InputWrapper>
                  <TextField
                    placeholder="Email"
                    type="text"
                    maxLength="62"
                    value={email}
                    onChange={(event) => handleEmailChange(event)}
                    autoComplete="off"
                    disabled={disabledFields.includes("email") ? true : false}
                  />
                </InputWrapper>
              </FormRow>
              <FormRow>
                <InputWrapper>
                  <DatePickerContainer>
                    <LocalizationProvider
                      dateAdapter={AdapterMoment}
                      adapterLocale="en-gb"
                    >
                      <DesktopDatePicker
                        label="Date of birth"
                        disableFuture
                        maxDate={moment()}
                        format={
                          countryCode === "US" ? "MM/DD/YYYY" : "DD/MM/YYYY"
                        }
                        value={dob ? moment(dob) : null}
                        onChange={(value) => {
                          setDob(value);
                          setIsEditDob(true);
                        }}
                        renderInput={(params) => (
                          <MUITextField {...params} className="dob-picker" />
                        )}
                      />
                    </LocalizationProvider>
                  </DatePickerContainer>
                </InputWrapper>
                {/* <InputWrapper>
                  <TextField
                    placeholder="Nationality"
                    type="text"
                    maxLength="62"
                    value={nationality}
                    onChange={(event) => {
                      setNationality(
                        event.target.value.replace(/[^ a-zA-Z]+/gi, "")
                      );
                      setIsEditNationality(true);
                    }}
                    autoComplete="off"
                  />
                </InputWrapper> */}
              </FormRow>
            </FormUserInputContainer>
          </FormWrapper>
        </FormContainer>
        <FooterContainer>
          <PrimaryButton
            disabled={
              !!(
                (!isEditName &&
                  !isEditEmail &&
                  !isEditMobile &&
                  !isEditDob &&
                  !isEditNationality &&
                  rawInputImage === null) ||
                isClickDisabled
              )
            }
            onClick={() => handleSave()}
            style={{ width: "100%", maxWidth: "365px", cursor: "pointer" }}
          >
            {saveIsLoading ? <ButtonLoader /> : "Save"}
          </PrimaryButton>
        </FooterContainer>
      </PageWrapper>
    );
  }
}

export default PersonalDetails;
