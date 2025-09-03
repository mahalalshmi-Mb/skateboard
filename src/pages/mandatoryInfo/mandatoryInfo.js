import { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import styled from "styled-components";
import moment from "util/momentWrapper";
import callAPI from "../../commons/callAPI";
import config from "../../commons/config";
import Text from "../../components/atoms/Text";
import PushAlert from "../../components/atoms/pushAlert";
import RemoveFlightConfirmation from "../../components/molecules/removeFlightConfirmation/removeFlightConfirmation";
import AddFlight from "../../containers/addFlight/addFlight";
import { FlightContext } from "../../context/FlightsContext";
import { CartContext } from "../../context/cartContext";
import { NavContext } from "../../context/navContext";
import {
  getLocalStorage,
  getSessionStorage,
  setSessionStorage,
} from "../../util/storageUtil";
import "./mandatoryInfo.css";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { getAppConfig } from "../../commons/util/appConfigHelper";
import Util from "../../commons/util/util";
import CustomCheckbox from "../../components/atoms/customCheckbox";
import Loader from "../../components/atoms/loader";
import { triggerMandatoryInfoSubmit } from "../../util/analytics/cdp/Common";

function MandatoryInfo(props) {
  const history = useHistory();
  const useNav = useContext(NavContext);
  const ClientCart = useContext(CartContext);
  const ClientFlight = useContext(FlightContext);
  let prodData = getSessionStorage("productsData");
  const [isLoading, setIsLoading] = useState(true);
  const [mandatoryFields, setMandatoryFields] = useState([]);
  const [showRemoveFlightModal, setShowRemoveFlightModal] = useState(false);
  const [isFlightAdded, setIsFlightAdded] = useState(false);
  const [flightData, setFlightData] = useState({});
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [flightKey, setFlightKey] = useState("");
  const [type, setType] = useState("");
  const [selectedMovementType, setSelectedMovementType] = useState("");
  const [userData, setUserData] = useState({});
  const [consented, setConsented] = useState(false);

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      position: "relative",
    }),
  };

  useEffect(() => {
    if (isMobile) {
      useNav.hideFooterNavs();
      useNav.hideBottomNavs();
    } else {
      useNav.showFooterNavs();
    }
    if (!Util.isIosWebView()) {
      useNav.showHeaderGoBack();
    }

    getMandatoryInfo();

    return () => {
      useNav.showFooterNavs();
      useNav.hideHeaderGoBack();
      useNav.showBottomNavs();
    };
  }, [useNav]);

  useEffect(() => {
    if (showAddFlight) {
      useNav.hideHeaderNavs();
    } else {
      useNav.showHeaderNavs();
    }
  }, [showAddFlight]);

  const checkIfFlightExists = () => {
    let addedFlight = ClientFlight.myFlights();
    if (addedFlight?.length > 0) {
      const data = getSessionStorage("mandatoryInfoData");
      const found = data?.mandatory?.find((x) => x.key === "flightDetails");
      if (found) {
        setFlightKey(found.key);
        setType(found.type);
      }
      getFlightInfo(addedFlight[0]?.flightId, found?.key, found?.type);
    }
  };

  const getMandatoryInfo = () => {
    setSelectedMovementType(prodData?.movementType);
    const data = getSessionStorage("mandatoryInfoData");
    setMandatoryFields(data?.mandatory);
    checkIfFlightExists();
    const userDetails = getLocalStorage("userData");
    setUserData(userDetails);
    setIsLoading(false);
  };

  const handleMandatoryFieldsChange = (value, key, type) => {
    let subData = [];
    if (mandatoryFields?.length === 0) {
      subData = getSessionStorage("mandatoryInfoData");
      subData = subData?.mandatory;
    } else {
      subData = JSON.parse(JSON.stringify(mandatoryFields));
    }
    for (let mandatoryData of subData) {
      if (mandatoryData.key === key) {
        mandatoryData.value = type === "Fileinput" ? "" : value;
      }
    }
    setMandatoryFields([...subData]);
  };

  const handleAddFlightShow = (flightKey, type) => {
    setShowAddFlight(true);
    setFlightKey(flightKey);
    setType(type);
  };

  const handleAddFlightClose = (data) => {
    let flights = ClientFlight.myFlights();
    let existingFlight = [];
    if (typeof data === "object" && data !== null && data?.flight_unique_no) {
      if (flights?.length > 1) {
        existingFlight = flights.filter((flt) => flt.UID !== data?.uid);
        if (existingFlight[0]?.UID) {
          ClientFlight.removeFlight(existingFlight[0]?.UID, true);
        }
      }
      getFlightInfo(data?.flight_unique_no);
    }
    setShowAddFlight(false);
  };

  const handleAddFlight = async (data, key, flightType) => {
    const fKey = key || flightKey;
    const fType = flightType || type;
    setFlightData(data);
    handleMandatoryFieldsChange(data, fKey, fType);
    setIsFlightAdded(true);
    setIsLoading(false);
  };

  const getFlightInfo = async (flightId, key, type) => {
    setIsLoading(true);
    let flightData = ClientFlight.getFlightById(flightId);
    if (flightData) {
      let id = flightId;
      let flightDate = flightData?.scheduleDate;
      let flightMovementType = flightData?.movementType;
      let date = moment(flightDate, "UTC", "UTC").format();
      let movementType = "Departure";
      if (flightMovementType === "A") movementType = "Arrival";

      try {
        let apiURL = config.api.flightSearch
          .replace("{{date}}", date)
          .replace("{{movementType}}", movementType)
          .replace("{{flightNo}}", id);
        let apiResponse = await callAPI.get(apiURL);
        let regResponse = await apiResponse.json();
        if (regResponse.data.length > 0) {
          if (regResponse.data[0]?.terminal) {
            flightData.terminal = regResponse.data[0]?.terminal;
            flightData.estimatedDate = moment(
              regResponse.data[0]?.estimatedDate
            )
              .add(5, "hour")
              .add(30, "minute")
              .format("lll");

            handleAddFlight(flightData, key, type);

            // Parse the estimated delivery time from the flightData and format it using moment
            const estimatedDateTime = moment(flightData.estimatedDate).format(
              "lll"
            );
            // Get the current time using moment
            const currentTime = moment();

            // Calculate the difference in minutes between the estimated time and the current time
            const differenceInMinutes = estimatedDateTime.diff(
              currentTime,
              "minutes"
            );
          } else {
            throw Error();
          }
        } else {
          throw Error();
        }
      } catch (e) {
        setIsLoading(false);
        console.log(e);
      }
    } else {
      setIsLoading(false);
      console.log("No flights found");
    }
  };

  const handleEditFlightWithProducts = () => {
    let cartObject = ClientCart.getCart();
    Object.values(cartObject).forEach((x) => {
      x.items = x.items.filter((citem) => citem.flightUid !== flightData?.UID);
    });
    setShowRemoveFlightModal(false);
    handleAddFlightShow();
  };

  const handleRemoveFlightModalClose = () => {
    setShowRemoveFlightModal(false);
  };

  const handleEditFlight = (flightKey, type) => {
    handleAddFlightShow(flightKey, type);
  };

  const handleSubmit = () => {
    if (
      mandatoryFields.filter(function (e) {
        return e.value === "" && e.showOnUI === true;
      }).length === 0
    ) {
      const finalErrors = validateMandatoryFields();
      if (finalErrors.length === 0) {
        handleSaveDetails();
      } else {
        PushAlert.error(finalErrors[0]);
      }
    } else {
      PushAlert.error("Mandatory fields cannot be empty");
    }
  };

  const validateMandatoryFields = () => {
    let errorArray = [];
    mandatoryFields?.forEach((item) => {
      if (typeof item.value === "string") {
        item.value = item?.value?.trim();
      }
      item?.validations?.forEach((val) => {
        if (val.type === "Object") {
          val?.condition?.forEach((x) => {
            if (
              !x.key.includes("estimatedDate") &&
              !x?.value?.includes(item?.value[x.key]?.toLowerCase())
            ) {
              errorArray.push(x.message);
            }
            if (x?.key?.includes(prodData?.movementType)) {
              const leadTime = parseInt(x?.value[0]);

              let minTime = moment(new Date()).add(leadTime, "minutes");
              let flightTime = moment(flightData.estimatedDate);
              if (flightTime.isBefore(minTime)) {
                errorArray.push(x.message);
              }
            }
          });
        } else if (val.type === "String") {
          val?.condition?.forEach((x) => {
            if (x.key === "minLength") {
              if (item.value.length < x.value) {
                errorArray.push(x.message);
              }
            } else if (x.key === "maxLength") {
              if (item.value.length > x.value) {
                errorArray.push(x.message);
              }
            } else if (x.key === "patternMatch") {
              var re = new RegExp(x.value);
              if (!re?.test(item.value)) {
                errorArray.push(x.message);
              }
            }
          });
        } else if (val.type === "email") {
          if (!Util.isEmailValid(item.value)) {
            errorArray.push("Invalid Email Id");
          }
        }
      });
    });
    return errorArray;
  };

  const handleSaveDetails = async () => {
    try {
      const data = getSessionStorage("mandatoryInfoData");
      let productsData = getSessionStorage("productsData");
      data.mandatory = mandatoryFields;
      data.isMandatoryInfoRequired = false;
      setSessionStorage("mandatoryInfoData", data);
      if (isFlightAdded) {
        let deliveryTime = "";
        if (
          flightData?.movementType?.toLowerCase() === "d" ||
          flightData?.movementType?.toLowerCase() === "departure"
        ) {
          deliveryTime = moment(flightData?.estimatedDate, "UTC", "UTC")
            .subtract(
              parseInt(getAppConfig("DUTYFREE_DEPARTURE_LEAD_TIME_MINS")),
              "minutes"
            )
            .format();
        } else {
          deliveryTime = moment(
            flightData?.estimatedDate,
            "UTC",
            "UTC"
          ).format();
        }

        productsData.deliveryOptions.isScheduled = false;
        productsData.deliveryOptions.deliveryTime = deliveryTime;

        setSessionStorage("productsData", productsData);
        ClientCart.updateFnbItemDelAndFlight(
          productsData.deliveryOptions,
          flightData.flightId,
          flightData.UID
        );
      }
      triggerMandatoryInfoSubmit(data, productsData);
      history.goBack();
    } catch (err) {
      PushAlert.error("Something went wrong whilst completing your order");
      console.log(err);
    }
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <Wrapper className="mandatory-info-page">
        <ContentContainer>
          {mandatoryFields?.map((mandatoryItem, mIndex) =>
            mandatoryItem.showOnUI &&
            (mandatoryItem.isActive === "Y" ||
              mandatoryItem.isActive === "y") ? (
              <InputContainer key={mIndex}>
                <InputLabel>
                  <Text type="regular">
                    <span style={{ color: "#DB1E49" }}>* </span>
                    {mandatoryItem.label}
                  </Text>
                </InputLabel>
                {mandatoryItem.type === "Textbox" ? (
                  <>
                    <CustomTextField
                      type={
                        mandatoryItem.dataType ? mandatoryItem.dataType : "text"
                      }
                      value={mandatoryItem.value}
                      onChange={(e) =>
                        handleMandatoryFieldsChange(
                          e.target.value,
                          mandatoryItem.key,
                          mandatoryItem.type
                        )
                      }
                    />
                  </>
                ) : mandatoryItem.type === "Textarea" ? (
                  <>
                    <Textarea
                      value={mandatoryItem.value}
                      onChange={(e) =>
                        handleMandatoryFieldsChange(
                          e.target.value,
                          mandatoryItem.key,
                          mandatoryItem.type
                        )
                      }
                      placeholder={mandatoryItem.label}
                    />
                  </>
                ) : mandatoryItem.type === "Dropdown" ? (
                  <>
                    <InputContainer style={{ paddingTop: "0px" }}>
                      <div style={{ width: "100%" }}>
                        <Select
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder={mandatoryItem.label}
                          isSearchable={true}
                          value={{
                            value: mandatoryItem.value,
                            label: mandatoryItem.value,
                          }}
                          onChange={(e) =>
                            handleMandatoryFieldsChange(
                              e.value,
                              mandatoryItem.key,
                              mandatoryItem.type
                            )
                          }
                          options={mandatoryItem.applicableValues}
                          styles={customStyles}
                        />
                      </div>
                    </InputContainer>
                  </>
                ) : mandatoryItem.type === "AddFlightComponent" ? (
                  isFlightAdded ? (
                    <SelectedFlightContainer>
                      <SelectedFlightWrapper>
                        <SelectedFlightImg src={flightData?.airlineImg || ""} />
                        <SelectedFlightText>
                          <Text>
                            {`${flightData?.airlineName} ${flightData?.srcDestAirport} ${flightData?.flightId}`}
                          </Text>
                        </SelectedFlightText>
                      </SelectedFlightWrapper>
                      <SelectedFlightAction
                        onClick={() =>
                          handleEditFlight(
                            mandatoryItem.key,
                            mandatoryItem.type
                          )
                        }
                      >
                        <Text type="extra-bold">Edit</Text>
                      </SelectedFlightAction>
                    </SelectedFlightContainer>
                  ) : (
                    <AddFlightWrapper
                      onClick={() =>
                        handleAddFlightShow(
                          mandatoryItem.key,
                          mandatoryItem.type
                        )
                      }
                    >
                      <Text type="extra-bold">+ Add Flight</Text>
                    </AddFlightWrapper>
                  )
                ) : mandatoryItem.type === "DatePicker" ? (
                  <div className="date-time-picker">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DesktopDatePicker
                        label="Date"
                        disablePast
                        format="dd/MM/yyyy"
                        value={mandatoryItem.value}
                        onChange={(e) => {
                          handleMandatoryFieldsChange(
                            e.target.value,
                            mandatoryItem.key,
                            mandatoryItem.type
                          );
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        inputProps={{
                          style: {
                            fontFamily: "nunito",
                            color: "white",
                            width: "100%",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                ) : null}
              </InputContainer>
            ) : null
          )}
          {userData && Object.keys(userData).length > 0 && (
            <UserDetailsContainer>
              <UserDetailsContainerLabel>
                <Text type="bold">YOUR DETAILS</Text>
              </UserDetailsContainerLabel>
              <UserDetailsWrapper>
                <UserName>
                  <Text type="semi-bold">{userData?.data?.fullName}</Text>
                </UserName>
                <UserMetadata>
                  <Text>{userData?.data?.mobileMasked}</Text>
                </UserMetadata>
                <UserMetadata>
                  <Text>{userData?.data?.emailMasked}</Text>
                </UserMetadata>
              </UserDetailsWrapper>
            </UserDetailsContainer>
          )}
          <UserDetailsContainer>
            <UserDetailsWrapper>
              <Text>
                Travel details declared above are accurate and any mismatch with
                physical documents may lead to cancellation of order.
              </Text>
              <CheckboxContainer>
                <CustomCheckbox
                  checked={consented}
                  handleChange={(e) => {
                    setConsented(e.target.checked);
                  }}
                />
                <Text>I understand</Text>
              </CheckboxContainer>
            </UserDetailsWrapper>
          </UserDetailsContainer>
        </ContentContainer>
        <FooterContainer>
          <FooterButton disabled={!consented} onClick={() => handleSubmit()}>
            <Text type="extra-bold">Continue</Text>
          </FooterButton>
        </FooterContainer>
        {showRemoveFlightModal && (
          <RemoveFlightConfirmation
            modalText={`You have some items in your cart that are mapped to this flight.
              Editing this flight will remove those items from your cart. Do
              you wish to continue?`}
            handleRemoveFlight={handleEditFlightWithProducts}
            onClose={handleRemoveFlightModalClose}
          />
        )}
        <Modal
          show={showAddFlight}
          onHide={handleAddFlightClose}
          onExited={handleAddFlightClose}
          fullscreen={true}
        >
          <Modal.Header
            style={{
              fontStyle: "normal",
              fontSize: "21px",
              color: "#273135",
            }}
            closeButton
          >
            <Text type="regular">Add Flight Details</Text>
          </Modal.Header>
          <AddFlight
            handleOnAddFlight={handleAddFlightClose}
            isHotelAddFlight={false}
            flightSuccessHandler
            onlyDepartureFlights={selectedMovementType === "Departure"}
            onlyArrivalFlights={selectedMovementType === "Arrival"}
            disableTransitFlights={true}
          />
        </Modal>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #f9f9f9;
`;
const ContentContainer = styled.div`
  width: 100%;
  padding: 0px 24px 120px 24px;
`;
const InputContainer = styled.div`
  width: 100%;
  padding-top: 24px;
`;
const InputLabel = styled.div`
  font-size: 14px;
  color: #273135;
`;
const CustomTextField = styled.input`
  margin-top: 10px;
  display: flex;
  width: 100%;
  height: 54px;
  font-size: 16px;
  text-align: start;
  text-indent: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  text-transform: none;
  outline: none;
  color: #222222;
  background-color: #ffffff;
`;
const Textarea = styled.textarea`
  padding-top: 10px;
  padding-left: 10px;
  margin-top: 5px;
  display: flex;
  width: 100%;
  height: 80px;
  font-size: 12pt;
  text-align: start;
  border: 1px solid #e9e9e9;
  border-radius: 10pt;
  text-transform: none;
  background-color: #fff;
  outline: none;
`;
const AddFlightWrapper = styled.div`
  width: 100%;
  height: 53px;
  border-radius: 8px;
  border: 1px dashed #d7d7d7;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0px;
  color: #04adaa;
  font-size: 16px;
  font-weight: 800;
  line-height: 24px;
`;
const SelectedFlightContainer = styled.div`
  width: 100%;
  height: 53px;
  padding: 0px 16px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SelectedFlightWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const SelectedFlightImg = styled.img`
  width: 24px;
  height: 24px;
`;
const SelectedFlightText = styled.div`
  color: #273135;
  font-size: 14px;
  font-weight: 500;
`;
const SelectedFlightAction = styled.div`
  color: #04adaa;
  font-size: 14px;
  font-weight: 800;
  line-height: 21px;
`;
const FooterContainer = styled.div`
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 24px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
`;
const FooterButton = styled.button`
  width: 100%;
  margin: 0px 24px;
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};
  background-color: #04adaa;

  color: #fff;
  font-size: 16px;
  font-weight: 800;
  line-height: 21px;
`;
const UserDetailsContainer = styled.div`
  width: 100%;
  padding-top: 24px;
`;
const UserDetailsContainerLabel = styled.div`
  font-size: 13px;
  line-height: 18px;
  color: #273135;
`;
const UserDetailsWrapper = styled.div`
  width: 100%;
  margin-top: 16px;
  padding: 16px;
  border: 1.4px solid #e9e9e9;
  border-radius: 8px;
  background-color: #fff;
`;
const UserName = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: #273135;
`;
const UserMetadata = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: #273135;
  opacity: 0.7;
  padding-top: 4px;
`;
const CheckboxContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
`;

export default MandatoryInfo;
