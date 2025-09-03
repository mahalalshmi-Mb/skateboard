import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import moment from "util/momentWrapper";
import DateIcon from "../../assets/images/addFlightModal/dateIcon.svg";
import FromIcon from "../../assets/images/addFlightModal/fromFlightIcon.svg";
import ToIcon from "../../assets/images/addFlightModal/toFlightIcon.svg";
import callAPI from "../../commons/callAPI";
import config from "../../commons/config";
import Loader from "../../components/atoms/loader";
import "./addFlight.css";

import styled from "styled-components";
import IconNoFlightsAvailable from "../../assets/images/addNewFlight/alert_no_flights.svg";
import { getAppConfig } from "../../commons/util/appConfigHelper";
import { isMobileDevice } from "../../commons/util/helperFunctions";
import Util from "../../commons/util/util";
import Text from "../../components/atoms/Text";
import FlightResultCard from "../../components/atoms/flightResultCard";
import FlightSearchField from "../../components/atoms/flightSearchField";
import PushAlert from "../../components/atoms/pushAlert";
import AddFlightSearchField from "../../components/organisms/AddFlightModal/components/AddFlightSearchField";
import DesktopFlightInfoCard from "../../components/organisms/AddFlightModal/components/DesktopFlightInfoCard";
import CustomDesktopDatePicker from "../../components/organisms/DesktopDatePicker/CustomDesktopDatePicker";
import DesktopDateTextField from "../../components/organisms/DesktopDatePicker/components/DesktopDateTextField";
import calendarIcon from "../../components/organisms/DesktopDateTimePicker/assets/calendar.svg";
import { FlightContext } from "../../context/FlightsContext";
import DepartureIcon from "../../pages/edpFSTR/assets/DepartureBlack.svg";
import CloseIcon from "../../pages/edpFSTR/assets/cancel_prompt.svg";
import { Image, PrimaryButton } from "../../theme/globalStyleSheet";

function AddFlight(props) {
  const mainContainerRef = useRef();
  const ClientFlight = useContext(FlightContext);

  const [isLoading, setIsLoading] = useState(false);
  const [baseAirport, setBaseAirport] = useState({ code: "", name: "" });

  const [flightSearchDestination, setFlightSearchDestination] = useState({
    code: "",
    name: "",
  });
  const [flightSearchSource, setFlightSearchSource] = useState({
    code: "",
    name: "",
  });
  const [flightSearchDate, setFlightSearchDate] = useState(new Date());
  const [flightData, setFlightData] = useState([]);
  const [flightLoading, setFlightLoading] = useState(false);

  const [intermediateSelectedFlight, setIntermediateSelectedFlight] = useState(
    []
  );
  const [clearSearchInput, setClearSearchInput] = useState(false);
  const [isDestDisabled, setDestIsDisabled] = useState(false);
  const [showFlightInfoBox, setShowFlightInfoBox] = useState(true);
  const [transitMode, setTransitMode] = useState(false);

  const [desktopDateTimePickerIsOpen, setDesktopDateTimePickerIsOpen] =
    useState(false);
  const [desktopFlightCardSelected, setDesktopFlightCardSelected] = useState();

  useEffect(() => {
    getHomeAirportsList();

    return () => {
      setTransitMode(false);
    };
  }, []);

  useEffect(() => {
    if (flightSearchSource.name !== "" && flightSearchDestination.name !== "") {
      Util.sendMessageToReactNative("Track Flight Searched", {
        From: flightSearchSource.name,
        To: flightSearchDestination.name,
        Date: moment(flightSearchDate).format("L"),
      });
    }

    if (isMobileDevice()) {
      handleFlightSearch();
    }
  }, [flightSearchSource, flightSearchDestination, flightSearchDate]);

  useEffect(() => {
    if (baseAirport.code) {
      setFlightSearchSource(baseAirport);
      setFlightSearchDestination({ code: "", name: "" });
      if (flightSearchSource.code !== "" && flightSearchDestination.code !== "")
        getFlightListing("dep");
    }
  }, [baseAirport]);

  const handleFlightSearch = () => {
    if (props.setShowDesktopFlightListingView) {
      props.setShowDesktopFlightListingView(true);
    }
    if (flightSearchSource.code !== "" && flightSearchDestination.code !== "") {
      if (
        flightSearchSource.code === baseAirport.code &&
        flightSearchSource.code !== flightSearchDestination.code
      ) {
        getFlightListing("dep");
      } else if (
        flightSearchDestination.code === baseAirport.code &&
        flightSearchSource.code !== flightSearchDestination.code
      ) {
        getFlightListing("arr");
      } else if (flightSearchSource.code === flightSearchDestination.code) {
        setFlightData([]);
        PushAlert.info("Source and destination cannot be same");
      } else {
        setFlightData([]);
        PushAlert.info("Bangalore should either be source or destination");
      }
    }
  };

  async function getFlightListing(boundId) {
    setFlightLoading(true);
    setFlightData([]);
    let flDate = moment(flightSearchDate, "UTC", "UTC").format();
    let orgAirport = flightSearchSource;
    let destAirport = flightSearchDestination;

    if (baseAirport) {
      if (boundId === "dep") orgAirport = baseAirport;
      else destAirport = baseAirport;
    }

    try {
      const apiURL = config.api.addNewFlights.flightListing;

      let apiResponse = await callAPI.get(apiURL, {
        orgAirport: orgAirport.code,
        destAirport: destAirport.code,
        boundId,
        flDate,
      });
      let regResponse = await apiResponse.json();
      if (regResponse && regResponse.data) {
        const listResponse = regResponse.data;
        if (boundId === "dep") {
          setFlightData(listResponse.dep);
        } else if (boundId === "arr") {
          listResponse.arr.forEach((item) => {
            let orgAirportName = item.base_airport_name;
            let destAirportName = item.srcdest_airport_name;
            item.srcdest_airport_name = destAirportName;
            item.base_airport_name = orgAirportName;
          });
          setFlightData(listResponse.arr);
        }
        setFlightLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleSwap(srcName, srcCode, destName, destCode, caller) {
    let sourceName = "";
    let sourceCode = "";
    let destinationName = "";
    let destinationCode = "";
    if (caller === "initial") {
      sourceName = srcName !== "" ? srcName : flightSearchSource.name;
      sourceCode = srcCode !== "" ? srcCode : flightSearchSource.code;
      destinationName =
        destName !== "" ? destName : flightSearchDestination.name;
      destinationCode =
        destCode !== "" ? destCode : flightSearchDestination.code;
    } else {
      sourceName = srcName === "" ? srcName : flightSearchSource.name;
      sourceCode = srcCode === "" ? srcCode : flightSearchSource.code;
      destinationName =
        destName === "" ? destName : flightSearchDestination.name;
      destinationCode =
        destCode === "" ? destCode : flightSearchDestination.code;
    }
    setFlightSearchSource({ code: destinationCode, name: destinationName });
    setFlightSearchDestination({ code: sourceCode, name: sourceName });
  }

  function handleTransitSwap() {
    const destinationName = flightSearchDestination.name;
    const destinationCode = flightSearchDestination.code;
    setFlightSearchDestination({ code: "", name: "" });
    setFlightSearchSource({ code: destinationCode, name: destinationName });
    if (mainContainerRef.current) mainContainerRef.current.scrollTo(0, 0);
  }

  const getHomeAirportsList = async () => {
    try {
      const apiURL = config.api.addNewFlights.homeAirports;
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (regResponse && regResponse.data) {
        const homeFlightresponse = regResponse.data;
        setBaseAirport({
          code: homeFlightresponse[0].airportcode,
          name: homeFlightresponse[0].airportname,
        });
        setFlightSearchSource({
          code: homeFlightresponse[0].airportcode,
          name: homeFlightresponse[0].airportname,
        });
        if (props.onlyArrivalFlights) {
          handleSwap(
            homeFlightresponse[0].airportname,
            homeFlightresponse[0].airportcode,
            "",
            "",
            "initial"
          );
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (newValue) => {
    setFlightSearchDate(newValue);
  };

  const getFlightListingContent = () => {
    return flightData.map((item, index) => (
      <FlightResultCard
        key={index}
        flightDetails={item}
        handleTransitSwap={handleTransitSwap}
        clearSearchInput={clearSearchInput}
        setClearSearchInput={setClearSearchInput}
        setDestIsDisabled={setDestIsDisabled}
        isDestDisabled={isDestDisabled}
        intermediateSelectedFlight={intermediateSelectedFlight}
        setIntermediateSelectedFlight={setIntermediateSelectedFlight}
        handleOnAddFlight={props.handleOnAddFlight}
        isHotelAddFlight={props.isHotelAddFlight}
        setFlightId={props.setFlightId}
        setTransitMode={setTransitMode}
        disableTransitFlights={props.disableTransitFlights}
        closeModal={props.closeModal}
      />
    ));
  };

  const handleDesktopDateTimePickerChange = (value) => {
    setFlightSearchDate(moment(value).format());
  };

  const addNewFlight = (flightDetails) => {
    if (moment(flightDetails.estimated_hour_id).isAfter(new Date())) {
      if (ClientFlight.addFlight(flightDetails)) {
        Util.sendMessageToReactNative("Track Flight Selected", flightDetails);
        props.handleOnAddFlight(flightDetails);
        props.setShowDesktopFlightListingView(false);
        props.closeModal();
      } else {
        PushAlert.error("Something went wrong, please try again later");
      }
    }

    if (props.isHotelAddFlight) {
      props.setFlightId(flightDetails.flight_unique_no);
    }
  };

  if (isLoading) {
    return <Loader />;
  } else if (isMobileDevice()) {
    return (
      <div className="add-flight-content-container" ref={mainContainerRef}>
        {showFlightInfoBox && (
          <div className="info-box-container">
            <div className="info-box-content">
              <img src={DepartureIcon} alt="flightIcon" />
              <div className="info-text-wrapper">
                <Text>Stay updated on your flight! </Text>{" "}
                {getAppConfig("ADD_FLIGHT_DATE_PICKER_MAX_DATE") > 0 && (
                  <Text>
                    {getAppConfig("ADD_FLIGHT_DATE_PICKER_MAX_DATE") > 2
                      ? `Track flights upto ${getAppConfig(
                          "ADD_FLIGHT_DATE_PICKER_MAX_DATE"
                        )} days.`
                      : `Track flights within the next ${Math.floor(
                          getAppConfig("ADD_FLIGHT_DATE_PICKER_MAX_DATE") * 24
                        )} hours.`}
                  </Text>
                )}
              </div>
            </div>
            <img
              src={CloseIcon}
              alt="closeIcon"
              style={{ cursor: "pointer" }}
              onClick={() => setShowFlightInfoBox(false)}
            />
          </div>
        )}
        <div className="flight-search-inputs-container">
          <div className="input-container">
            <div className="input-label-wrapper">
              <img
                src={DateIcon}
                width="21px"
                height="21px"
                alt="image"
                className="label-icon"
              />
              <div className="label-text">
                <Text type="bold">Date</Text>
              </div>
            </div>
            <div className="input-wrapper">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Date"
                  disablePast
                  format="dd/MM/yyyy"
                  value={flightSearchDate}
                  maxDate={new Date().setDate(
                    new Date().getDate() +
                      parseInt(getAppConfig("ADD_FLIGHT_DATE_PICKER_MAX_DATE"))
                  )}
                  minDate={new Date()}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                  inputProps={{
                    style: { fontFamily: "nunito", color: "white" },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <FlightSearchField
            label={"From"}
            labelIcon={FromIcon}
            placeholder={"Search Flight Origin"}
            searchFieldName={flightSearchSource.name}
            setSearchField={setFlightSearchSource}
            setDestIsDisabled={setDestIsDisabled}
            isDestDisabled={props.onlyDepartureFlights || isDestDisabled}
          />
          <FlightSearchField
            label={"To"}
            labelIcon={ToIcon}
            placeholder={"Search Flight Destination"}
            searchFieldName={flightSearchDestination.name}
            setSearchField={setFlightSearchDestination}
            clearSearchInput={clearSearchInput}
            setClearSearchInput={setClearSearchInput}
            handleSwap={handleSwap}
            transitMode={transitMode}
            hideSwapButton={
              props.onlyDepartureFlights || props.onlyArrivalFlights
            }
            isDestDisabled={props.onlyArrivalFlights}
          />
        </div>
        {flightLoading && (
          <div className="flight-loader-container">
            <Loader />
          </div>
        )}
        {!flightLoading &&
          flightData.length === 0 &&
          flightSearchSource.code !== "" &&
          flightSearchDestination.code !== "" && (
            <div className="no-flights-found-container">
              <img
                style={{ width: "200px" }}
                src={IconNoFlightsAvailable}
                alt="no-flight"
              />
              <span>
                <Text type="regular">No Flights Available</Text>
              </span>
            </div>
          )}
        {flightData.length > 0 && (
          <div className="flight-listing-wrapper">
            <div className="flight-listing-header">
              <Text type="bold">{`Showing results for ${flightSearchDestination.name} ${flightSearchDestination.code}`}</Text>
            </div>
            <div className="flight-listing-content">
              {getFlightListingContent()}
            </div>
          </div>
        )}
      </div>
    );
  } else if (!isMobileDevice()) {
    return (
      <Fragment>
        {props.showDesktopFlightListingView ? (
          <FlightListingContent>
            {flightLoading && <Loader height="100%" />}
            {!flightLoading && flightData.length === 0 && (
              <NoFlightFoundView>
                <Image
                  style={{ width: "200px" }}
                  src={IconNoFlightsAvailable}
                  alt="no-flight"
                />

                <Text type="regular">No Flights Available</Text>
              </NoFlightFoundView>
            )}
            {!flightLoading && flightData.length !== 0 && (
              <Fragment>
                <FlightListingWrapper>
                  {flightData.map((flight) => (
                    <DesktopFlightInfoCard
                      data={flight}
                      key={flight?.uid}
                      isDeparture={flightSearchSource?.code === "BLR"}
                      isSelected={
                        desktopFlightCardSelected?.uid === flight?.uid
                      }
                      setSelected={setDesktopFlightCardSelected}
                    />
                  ))}
                </FlightListingWrapper>
                <ProceedButton
                  disabled={!desktopFlightCardSelected}
                  onClick={() => addNewFlight(desktopFlightCardSelected)}
                >
                  Confirm And Proceed
                </ProceedButton>
              </Fragment>
            )}
          </FlightListingContent>
        ) : (
          <AddFlightDetailsContent>
            <InputFieldsWrapper>
              <InputFieldContainer>
                <InputFieldLabel>Date</InputFieldLabel>
                <CustomDesktopDatePicker
                  value={flightSearchDate}
                  setValue={setFlightSearchDate}
                  isOpen={desktopDateTimePickerIsOpen}
                  setIsOpen={setDesktopDateTimePickerIsOpen}
                  handleOnChange={handleDesktopDateTimePickerChange}
                  TextFieldComponent={DesktopDateTextField}
                  logo={calendarIcon}
                  disabled={false}
                  label="Date"
                />
              </InputFieldContainer>
              <InputFieldContainer>
                <InputFieldLabel>From</InputFieldLabel>
                <AddFlightSearchField
                  placeholder={"From Origin"}
                  searchFieldName={flightSearchSource.name}
                  setSearchField={setFlightSearchSource}
                />
              </InputFieldContainer>
              <InputFieldContainer>
                <InputFieldLabel>To</InputFieldLabel>
                <AddFlightSearchField
                  placeholder={"To Destination"}
                  searchFieldName={flightSearchDestination.name}
                  setSearchField={setFlightSearchDestination}
                />
              </InputFieldContainer>
            </InputFieldsWrapper>
            <SearchFlightButton
              disabled={
                flightSearchSource.code === "" ||
                flightSearchDestination.code === ""
              }
              onClick={handleFlightSearch}
            >
              Search Flight
            </SearchFlightButton>
          </AddFlightDetailsContent>
        )}
      </Fragment>
    );
  }
}

const AddFlightDetailsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
  padding: 32px;
  padding-top: 0px;
`;
const FlightListingContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 32px;
`;
const InputFieldsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 24px;
`;
const InputFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 12px;
`;
const InputFieldLabel = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  line-height: 19.12px;
  text-align: left;
`;
const SearchFlightButton = styled(PrimaryButton)`
  width: 240px;
  height: 46px;
  border-radius: 100px;

  font-size: 16px;
  font-weight: 700;
  line-height: 21.86px;
  text-align: left;
  color: #fff;
`;

const NoFlightFoundView = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
`;

const FlightListingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 445px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0px 32px;
  gap: 20px;
`;

const ProceedButton = styled(PrimaryButton)`
  width: 240px;
  height: 46px;
  border-radius: 100px;

  align-self: center;
  margin-top: 24px;
`;

export default AddFlight;
