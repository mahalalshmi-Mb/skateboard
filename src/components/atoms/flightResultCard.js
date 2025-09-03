import { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import moment from "util/momentWrapper";
import Util from "../../commons/util/util";
import { FlightContext } from "../../context/FlightsContext";
import "./flightResultCard.css";
import PushAlert from "./pushAlert";
import Text from "./Text";

function FlightResultCard({
  flightDetails,
  handleTransitSwap,
  clearSearchInput,
  setClearSearchInput,
  setDestIsDisabled,
  isDestDisabled,
  intermediateSelectedFlight,
  setIntermediateSelectedFlight,
  handleOnAddFlight,
  isHotelAddFlight,
  setFlightId,
  setTransitMode,
  disableTransitFlights,
}) {
  const ClientFlight = useContext(FlightContext);

  const [modalIsVisible, setModalIsVisible] = useState(false);

  function checkTransitFlight() {
    if (disableTransitFlights) {
      addNewFlight();
    } else {
      if (
        flightDetails.bound_id &&
        (flightDetails.bound_id === "a" || flightDetails.bound_id === "A")
      ) {
        let arr = [];
        arr.push(flightDetails);
        setIntermediateSelectedFlight(arr);
        setModalIsVisible(true);
      } else if (isDestDisabled && intermediateSelectedFlight.length > 0) {
        addNewFlightWithTransit();
      } else {
        addNewFlight();
      }
    }
  }

  function addTransitFlight() {
    setDestIsDisabled(true);
    setClearSearchInput(!clearSearchInput);
    setModalIsVisible(false);
    handleTransitSwap();
    setTransitMode(true);
  }

  function addNewFlight() {
    let transitFlight = [];
    if (moment(flightDetails.estimated_hour_id).isAfter(new Date())) {
      if (ClientFlight.addFlight(flightDetails, transitFlight)) {
        Util.sendMessageToReactNative("Track Flight Selected", flightDetails);
        handleOnAddFlight(flightDetails);
      } else {
        PushAlert.error("Oops! Something went wrong, please try again later");
      }
    }

    if (isHotelAddFlight) {
      setFlightId(flightDetails.flight_unique_no);
    }
  }

  function addNewFlightWithTransit() {
    if (
      moment(flightDetails.estimated_hour_id).isAfter(new Date()) &&
      moment(flightDetails.estimated_hour_id).isAfter(
        moment(intermediateSelectedFlight[0]?.estimated_hour_id)
      )
    ) {
      if (ClientFlight.addFlight(flightDetails, intermediateSelectedFlight)) {
        handleOnAddFlight(flightDetails, intermediateSelectedFlight);
        setTransitMode(false);
      } else {
        PushAlert.error("Oops! Something went wrong, please try again later");
      }
    }
    if (isHotelAddFlight) {
      setFlightId(flightDetails.flight_unique_no);
    }
  }

  return (
    <div className="flight-result-transit-wrapper">
      <div
        className="flight-result-card-wrapper"
        onClick={() => checkTransitFlight()}
      >
        <div className="flight-details-wrapper">
          <div className="flight-meta-details">
            <img className="airline-image" src={flightDetails.airline_img} />
            <div className="flight-name-from-wrapper">
              <span className="flight-name-code">
                <Text type="semi-bold">{`${flightDetails.airline_name} ${flightDetails.flight_unique_no}`}</Text>
              </span>
              <span className="flight-to-from">
                <Text type="regular">{`${flightDetails.base_airport_name} to ${flightDetails.srcdest_airport_name}`}</Text>
              </span>
            </div>
          </div>
          <div className="flight-time">
            <Text type="semi-bold">
              {moment(flightDetails.schedule_hour_id).format("LT")}
            </Text>
          </div>
        </div>
      </div>
      <Modal
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          height: "300px",
          background: "none",
        }}
        show={modalIsVisible}
        onHide={() => setModalIsVisible(false)}
        className="transit-flights-container"
      >
        <div className="transit-flights" id="content">
          <div className="modal-content-container">
            <div className="transit-modal-header">
              <Text type="bold">Flight Added</Text>
            </div>
            <div className="transit-modal-sub-header">
              <Text type="regular">
                Would you like to add a connecting flight?
              </Text>
            </div>
            <div
              className="action-buttons-container"
              style={{ width: "100%", marginTop: "1rem" }}
            >
              <div className="transit-submit-button-container">
                <button
                  className="transit-submit-button"
                  onClick={() => addTransitFlight()}
                >
                  <Text type="bold">Add connecting flight</Text>
                </button>
              </div>
              <div className="transit-submit-button-container">
                <button
                  className="transit-not-now-button"
                  onClick={() => {
                    addNewFlight();
                  }}
                >
                  <Text type="bold">Not now</Text>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FlightResultCard;
