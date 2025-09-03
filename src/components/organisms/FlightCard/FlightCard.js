import { Fragment, useContext, useEffect, useState } from "react";
import moment from "util/momentWrapper";
import { FlightContext } from "../../../context/FlightsContext";
import { CartContext } from "../../../context/cartContext";

import { useCookies } from "react-cookie";
import AirplaneImg from "../../../assets/images/home/flightCard/Airplane.svg";
import CloseIcon from "../../../assets/images/profile/close-icon.svg";
import callAPI from "../../../commons/callAPI";
import config from "../../../commons/config";
import { getAppConfig } from "../../../commons/util/appConfigHelper";
import {
  decode,
  getBaggageInfo,
  getGateInfo,
  sortByProperty,
} from "../../../commons/util/helperFunctions";
import Util from "../../../commons/util/util";
import { dateTimeFormats } from "config/dateTimeConfig";
import { FlightAlertContext } from "../../../context/flightAlertContext";
import { NavContext } from "../../../context/navContext";
import useCustomNavigation from "../../../hooks/useCustomNavigation";
import { formatCounterArray } from "components/atoms/formatCounterArray";
import { ADD_Flight_Event } from "../../../util/FirebaseAnalyticsUtil";
import Text from "../../atoms/Text";
import Loader from "../../atoms/loader";
import PushAlert from "../../atoms/pushAlert";
import RemoveFlightConfirmation from "../../molecules/removeFlightConfirmation/removeFlightConfirmation";
import "./FlightCard.css";
import { removeFlightIfStatus } from "./config";

function FlightCard(props) {
  const useFlightAlert = useContext(FlightAlertContext);
  const ClientCart = useContext(CartContext);

  const [cookies] = useCookies(["gwLoginData"]);
  const ClientFlight = useContext(FlightContext);
  const { pushHistory } = useCustomNavigation();
  const [flightInfo, setFlightInfo] = useState(null);
  const [flightInfoIsLoading, setFlightInfoIsLoading] = useState(true);
  const [stopTrackingFlightIsLoading, setStopTrackingFlightIsLoading] =
    useState(false);

  const [isFlightTracked, setIsFlightTracked] = useState(false);
  const [showRemoveFlightModal, setShowRemoveFlightModal] = useState(false);
  const [isRedirectUrl, setIsRedirectUrl] = useState(false);
  const [showLocateFlightModal, setShowLocateFlightModal] = useState(false);
  const useNav = useContext(NavContext);

  useEffect(() => {
    getFlightInfo(
      props.flightData.flightId,
      props.flightData.scheduleDate,
      props.flightData.movementType
    );
  }, []);

  const getFlightInfo = async (id, flightDate, flightMovementType) => {
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
        Util.sendMessageToReactNative(ADD_Flight_Event);
        setFlightInfo(regResponse.data[0]);
        if (regResponse.data[0].airline.checkinUrl.length > 0)
          setIsRedirectUrl(true);
        if (cookies.gwLoginData) {
          checkFlightTrackStatus(regResponse.data[0]);
        } else {
          setFlightInfoIsLoading(false);
          setIsFlightTracked(false);
        }
        if (
          regResponse.data[0].estimatedDate &&
          regResponse.data[0].flightStatus &&
          regResponse.data[0].flightStatus.name
        ) {
          checkFlightRemove(
            regResponse.data[0].estimatedDate,
            regResponse.data[0].flightStatus
          );
        }
      } else {
        throw Error("Flight details have not been updated");
      }
    } catch (e) {
      console.log(e);
      PushAlert.info(e.message);
      handleRemoveFlight();
    }
  };

  const checkFlightTrackStatus = async (flightInfoApi) => {
    let newIsFlightTracked = false;
    let apiUrl = config.api.getFlightTrackData;

    let apiResponse = await callAPI.get(apiUrl);
    let regResponse = await apiResponse.json();
    if (regResponse.status === 200 || regResponse.status === 201) {
      regResponse.data.forEach((flightBeingTracked) => {
        if (
          flightInfoApi.flightNumber === flightBeingTracked.flightId &&
          flightInfoApi.estimatedDate === flightBeingTracked.estimatedTime
        ) {
          newIsFlightTracked = true;
        }
      });
    }

    if (localStorage.getItem("module") === "homepage") {
      handleTrackFlight(flightInfoApi, newIsFlightTracked);
      localStorage.setItem("module", null);
    }

    setIsFlightTracked(newIsFlightTracked);
    setFlightInfoIsLoading(false);
  };

  const checkFlightRemove = (estimatedDate, flightStatus) => {
    let today = moment();
    let estimatedTime = moment(estimatedDate).add(5, "hour").add(30, "minute");
    if (
      moment(today).isAfter(estimatedTime) ||
      removeFlightIfStatus.includes(flightStatus.name.toLowerCase())
    ) {
      props.setAirportData([]);
      ClientFlight.removeFlight(props.flightData.UID);
    }
  };

  function toDaysMinutesSeconds(totalSeconds) {
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const days = Math.floor(totalSeconds / (3600 * 24));

    const minutesStr = makeHumanReadable(minutes, "min");
    const hoursStr = makeHumanReadable(hours, "hr");
    const daysStr = makeHumanReadable(days, "day");

    return `${daysStr}${hoursStr}${minutesStr} until flight`.replace(
      /,\s*$/,
      ""
    );
  }

  function makeHumanReadable(num, singular) {
    return num > 0
      ? num +
          (num === 1
            ? `${singular === "min" ? " " + singular : " " + singular + ","} `
            : `${
                singular === "min"
                  ? " " + singular + "s"
                  : " " + singular + "s,"
              } `)
      : "";
  }

  const triggerFlightAlertContext = (data) => {
    useFlightAlert.openFlightAlert({
      flightName: data.airline.name,
      flightId: data.flightNumber,
      flightStatus: data.flightStatus.name,
      scheduledTime: data.scheduledDate,
      estimatedTime: data.estimatedDate,
      gate: data.gates.length
        ? sortByProperty(data.gates, "sequenceNumber")[0].gateNumber
        : "",
      belt: data.baggageBelts.length
        ? sortByProperty(data.baggageBelts, "sequenceNumber")[0].beltNumber
        : "",
    });
  };

  const handleTrackFlight = async (flightInfoData, isFlightTracked) => {
    const handleSignIn = () => {
      localStorage.setItem("module", "homepage");
      pushHistory("/signin");
    };
    if (!isFlightTracked) {
      if (cookies.gwLoginData) {
        triggerFlightAlertContext(flightInfoData);
      } else {
        handleSignIn();
      }
    } else {
      setStopTrackingFlightIsLoading(true);
      if (cookies.gwLoginData) {
        let notificationMethod = [];

        if (cookies.gwLoginData.mobile) {
          notificationMethod.push("SMS");
        }
        if (cookies.gwLoginData.email) {
          notificationMethod.push("EMAIL");
        }

        let apiURL = config.api.stopFlightTrack;
        let apiData = {
          flightName: flightInfoData.airline.name,
          flightId: flightInfoData.flightNumber,
          flightStatus: flightInfoData.flightStatus.name,
          scheduledTime: flightInfoData.scheduledDate,
          estimatedTime: flightInfoData.estimatedDate,
          gate: flightInfoData.gates.length
            ? sortByProperty(flightInfoData.gates, "sequenceNumber")[0]
                .gateNumber
            : "",
          belt: flightInfoData.baggageBelts.length
            ? sortByProperty(flightInfoData.baggageBelts, "sequenceNumber")[0]
                .beltNumber
            : "",
          notificationMethod: notificationMethod,
          user: {
            email: cookies.gwLoginData.email
              ? decode(cookies.gwLoginData.email)
              : "",
            mobile: cookies.gwLoginData.mobile
              ? decode(cookies.gwLoginData.mobile)
              : "",
            userId: cookies.gwLoginData.userId,
          },
        };

        Util.triggerMoEngageEvent("stop_flight_updates", {
          flight_name: flightInfoData.airline.name,
          flight_id: flightInfoData.flightNumber,
          flight_status: flightInfoData.flightStatus.name,
          scheduled_time: flightInfoData.scheduledDate,
          estimated_time: flightInfoData.estimatedDate,
          gate: flightInfoData.gates.length
            ? sortByProperty(flightInfoData.gates, "sequenceNumber")[0]
                .gateNumber
            : "",
        });

        try {
          let apiResponse = await callAPI.post(apiURL, apiData);
          let regResponse = await apiResponse.json();
          if (regResponse.status === 200 || regResponse.status === 201) {
            setIsFlightTracked(false);
            PushAlert.info("Your have now stopped tracking your flight!");
            setStopTrackingFlightIsLoading(false);
          } else {
            PushAlert.info("Stop tracking failed, try re-logging in");
            setStopTrackingFlightIsLoading(false);
          }
        } catch (e) {
          console.log(e);
          PushAlert.info("Stop tracking failed, try re-logging in");
          setStopTrackingFlightIsLoading(false);
        }
      } else {
        handleSignIn();
      }
    }
  };

  function checkIfServiceMapped() {
    let showPopUp = false;
    let cartObject = ClientCart.getCart();
    Object.values(cartObject).forEach((x) => {
      x.items.forEach((citem) => {
        if (citem.flightUid === props.flightData.UID) {
          showPopUp = true;
        }
      });
    });
    Util.triggerMoEngageEvent("remove_flight_clicked");
    if (showPopUp) {
      setShowRemoveFlightModal(true);
    } else {
      handleRemoveFlight();
    }
  }

  const handleRemoveFlight = () => {
    props.setAirportData([]);
    ClientFlight.removeFlight(props.flightData.UID);

    if (isFlightTracked) {
      handleTrackFlight();
    }
  };

  const handleRemoveFlightWithService = () => {
    props.setAirportData([]);
    ClientFlight.removeFlight(props.flightData.UID);
    let cartObject = ClientCart.getCart();
    Object.values(cartObject).forEach((x) => {
      x.items = x.items.filter(
        (citem) =>
          citem.storeTerminal !== `Terminal${props?.flightData?.terminal}`
      );
    });

    if (isFlightTracked) {
      handleTrackFlight();
    }
    setShowRemoveFlightModal(false);
  };

  const handleRemoveFlightModalClose = () => {
    setShowRemoveFlightModal(false);
  };

  const checkingRedirect = (itemInfo) => {
    Util.triggerMoEngageEvent("checkin_clicked", {
      flight_name: itemInfo.airline.displayName,
      flight_id: itemInfo.flightNumber,
      flight_status: itemInfo.flightStatus.displayName,
      scheduled_time: itemInfo.scheduledDate,
      estimated_time: itemInfo.estimatedDate,
      flight_type: itemInfo.flightType,
      origin_airport: itemInfo?.originAirport?.code,
      origin_terminal: itemInfo?.originAirport?.terminal,
      destination_airport: itemInfo?.destinationAirport?.code,
      destination_terminal: itemInfo?.destinationAirport?.terminal,
    });
    if (itemInfo.airline.checkinUrl.length > 0) {
      itemInfo.airline.checkinUrl.map((item) => {
        if (!Util.isWebView() && item.channel.toLowerCase() === "web") {
          window.open(item.href, "_blank");
        } else if (
          Util.isWebView() &&
          item.channel.toLowerCase() === "mobile"
        ) {
          window.open(item.href, "_blank");
        } else {
          window.open(item.href, "_blank");
        }
      });
    }
  };

  const handleLocateFlightClose = () => {
    setShowLocateFlightModal(false);
    useNav.showAllNavs();
  };

  const onLocateFlightClick = () => {
    setShowLocateFlightModal(true);
    useNav.hideAllNavs();
  };

  const getFlightEstimate = () => {
    if (flightInfo?.estimatedDate) {
      const estimatedTime = moment(flightInfo?.estimatedDate)
        .add(5, "hour")
        .add(30, "minute")
        .format();
      let end = moment(estimatedTime);
      let startTime = moment(new Date());
      let duration = moment.duration(end.diff(startTime));
      let mins = duration.asSeconds();
      const flightEstimate = toDaysMinutesSeconds(mins);
      return flightEstimate;
    }
  };

  const getCheckinInfo = () => {
    if (flightInfo.checkInCounters && flightInfo.checkInCounters !== null) {
      let newCheckInCounters = flightInfo?.checkInCounters;

      if (Array.isArray(newCheckInCounters)) {
        newCheckInCounters.forEach((counter) => {
          if (Array.isArray(counter.id)) {
            counter.id = formatCounterArray(counter.id);
          }
        });

        let modifiedCheckInCounterTitle = [];

        newCheckInCounters.forEach((counter) => {
          let label = "";
          if (counter.group?.toUpperCase().includes("ROW-")) {
            label = counter.group?.toUpperCase()?.replace("ROW-", "")?.trim();
          } else if (counter.group?.toUpperCase().includes("COUNTER")) {
            label = counter.group?.toUpperCase()?.replace("COUNTER", "").trim();
          }
          modifiedCheckInCounterTitle.push(`${label} ${counter.id}`);
        });
        modifiedCheckInCounterTitle = modifiedCheckInCounterTitle.slice(0, 3);
        return modifiedCheckInCounterTitle?.join(",");
      }
    } else {
      return "TBA";
    }
  };

  const getFlightStatusClassName = (name) => {
    let className = "";
    switch (name.toUpperCase()) {
      case "ONTIME":
        className = "ontime";
        break;
      case "BOARDING":
        className = "boarding";
        break;
      case "GATEOPEN":
        className = "gate-open";
        break;
      case "ARRIVED":
        className = "arrived";
        break;
      case "DEPARTED":
        className = "departed";
        break;
      case "DELAYED":
        className = "delayed";
        break;
      case "IMMIGRATION":
        className = "immigration";
        break;
      case "DIVERTED":
        className = "diverted";
        break;
      case "RESCHEDULED":
        className = "rescheduled";
        break;
      case "CANCELLED":
        className = "cancelled";
        break;
      case "FINALCALL":
        className = "final-call";
        break;
      case "GATECLOSED":
        className = "gate-closed";
        break;
      case "SECURITY":
        className = "security";
        break;
      case "CHECKIN":
        className = "check-in";
        break;
      case "ARRIVING EARLY":
        className = "arriving-early";
        break;
      default:
        return "";
    }
    return className;
  };

  return (
    <Fragment>
      {!flightInfoIsLoading ? (
        <div className="flight-card-wrapper">
          {!props.hideCloseIcon && (
            <div
              style={{
                position: "absolute",
                right: "5px",
                top: 0,
                cursor: "pointer",
              }}
              onClick={() => checkIfServiceMapped()}
            >
              <img src={CloseIcon} alt="close-icon" />
            </div>
          )}
          <div className="flight-info-container">
            <div className="bottom-border"></div>
            <div className="flight-src-dest-container">
              <div className="airline-date-container">
                <div className="airline-container">
                  <img
                    className="airline-tail-image"
                    src={props.flightData.airlineImg}
                  />
                  <span className="flight-airline-text">
                    <Text type="semi-bold">{`${props.flightData.airlineName} ${props.flightData.flightId}`}</Text>
                  </span>
                </div>
                <div className="flight-date-container">
                  <Text type="regular">
                    {moment(props.flightData.scheduleDate).format("llll")}
                  </Text>
                </div>
              </div>
              <div className="src-dest-wrapper">
                <div className="src-container">
                  <div className="src-text">
                    <Text type="bold">{props.flightData.baseAirport}</Text>
                  </div>
                  <div className="src-content">
                    {flightInfo.terminal && flightInfo.terminal !== "" ? (
                      <div className="terminal-text">
                        <Text type="regular">{`Terminal ${flightInfo.terminal}`}</Text>
                      </div>
                    ) : null}
                    {(props.flightData.movementType === "D" ||
                      props.flightData.movementType === "Departure") && (
                      <div className="arr-dep-time-text">
                        <Text type="bold">
                          {moment(props.flightData.scheduleTime).format(
                            dateTimeFormats.time.twentyFourHourMinute
                          )}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flight-icon-container">
                  <img
                    src={AirplaneImg}
                    onClick={() =>
                      getAppConfig("LOCATE_ME_ENABLE")
                        ? flightInfo?.aircraftRegistrationNumber
                          ? onLocateFlightClick()
                          : null
                        : null
                    }
                  />
                  {getAppConfig("LOCATE_ME_ENABLE") &&
                    flightInfo?.aircraftRegistrationNumber && (
                      <Text type="extra-bold">Live Location</Text>
                    )}
                </div>
                <div className="dest-container">
                  <div className="src-text">
                    <Text type="bold">{props.flightData.srcDestAirport}</Text>
                  </div>
                  <div className="src-content">
                    {flightInfo.terminal && flightInfo.terminal !== "" ? (
                      <div className="terminal-text">
                        <Text type="regular">{`Terminal ${flightInfo.terminal}`}</Text>
                      </div>
                    ) : null}
                    {(props.flightData.movementType === "A" ||
                      props.flightData.movementType === "Arrival") && (
                      <div className="arr-dep-time-text">
                        <Text type="bold">
                          {moment(props.flightData.scheduleTime).format(
                            dateTimeFormats.time.twentyFourHourMinute
                          )}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="vertical-divider"></div>
            </div>
            <div className="flight-meta-data-container">
              <div className="meta-label-value-container">
                <div className="value-text">
                  <Text type="bold">
                    {flightInfo && flightInfo.estimatedDate
                      ? moment(flightInfo.estimatedDate)
                          .add(5, "hour")
                          .add(30, "minute")
                          .format(dateTimeFormats.time.twentyFourHourMinute)
                      : "TBD"}
                  </Text>
                </div>
                <div className="label-text">
                  <Text>ESTIMATED</Text>
                </div>
              </div>
              <div className="meta-label-value-divider"></div>
              <div className="meta-label-value-container">
                <div className="value-text check-in">
                  {props.flightData.movementType === "D" ||
                  props.flightData.movementType === "Departure" ? (
                    <Text type="bold">{getCheckinInfo()}</Text>
                  ) : (
                    <Text type="bold">NA</Text>
                  )}
                </div>
                <div className="label-text">
                  <Text>Check-in</Text>
                </div>
              </div>
              <div className="meta-label-value-divider"></div>
              <div className="meta-label-value-container">
                <div className="value-text">
                  {props.flightData.movementType === "D" ? (
                    <Text type="bold">
                      {flightInfo && flightInfo.gates
                        ? getGateInfo(flightInfo.gates)
                        : "TBD"}
                    </Text>
                  ) : (
                    <Text type="bold">
                      {flightInfo && flightInfo.baggageBelts
                        ? getBaggageInfo(flightInfo.baggageBelts)
                        : "TBD"}
                    </Text>
                  )}
                </div>
                <div className="label-text">
                  <Text>
                    {props.flightData.movementType === "D" ? "GATE" : "BELT"}
                  </Text>
                </div>
              </div>
              <div className="meta-label-value-divider"></div>
              <div className="meta-label-value-container">
                <div
                  className={`status-wrapper ${getFlightStatusClassName(
                    flightInfo?.flightStatus?.name
                  )}`}
                >
                  <Text type="bold">
                    {flightInfo &&
                    flightInfo.flightStatus &&
                    flightInfo.flightStatus.displayName
                      ? flightInfo.flightStatus.displayName
                      : "TBD"}
                  </Text>
                </div>
                <div className="label-text">
                  <Text>STATUS</Text>
                </div>
              </div>
            </div>
          </div>
          <div className="flight-action-container">
            <div className="until-flight-container">
              <span className="until-flight-text">
                <Text type="extra-bold">{getFlightEstimate()}</Text>
              </span>
            </div>
            <div className="action-item-container">
              {!props.showChangeFlight && (
                <>
                  <div
                    className="track-flight-button"
                    onClick={() =>
                      handleTrackFlight(flightInfo, isFlightTracked)
                    }
                  >
                    <Text type="extra-bold">
                      {isFlightTracked ? "Stop Updates" : "Get Updates"}
                    </Text>
                  </div>
                  <div
                    className={`track-flight-button ${
                      isRedirectUrl ? null : "ui-state-disabled"
                    }`}
                    onClick={() => checkingRedirect(flightInfo)}
                  >
                    <Text type="extra-bold">Check-In</Text>
                  </div>
                </>
              )}
              {props.showChangeFlight && (
                <div
                  className="track-flight-button"
                  onClick={() =>
                    props.handleChangeFlight(props?.flightData?.UID || "")
                  }
                >
                  <Text type="extra-bold">Change flight</Text>
                </div>
              )}
            </div>
          </div>
          {showRemoveFlightModal && (
            <RemoveFlightConfirmation
              handleRemoveFlight={handleRemoveFlightWithService}
              onClose={handleRemoveFlightModalClose}
            />
          )}
        </div>
      ) : (
        <Loader height="100%" loaderWidth="auto" maxHeight="80px" />
      )}
    </Fragment>
  );
}

export default FlightCard;
