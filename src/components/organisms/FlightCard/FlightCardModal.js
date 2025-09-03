import "bootstrap/dist/css/bootstrap.min.css";
import React, { Fragment } from "react";
import { getAppConfig } from "../../../commons/util/appConfigHelper";
import Util from "../../../commons/util/util";
import useCustomNavigation from "../../../hooks/useCustomNavigation";
import Text from "../../atoms/Text";
import AddFlight from "../../../containers/addFlight/addFlight";
import AddFlightModal from "../AddFlightModal/AddFlightModal";

export default function FlightCardModal(props) {
  const { pushHistory } = useCustomNavigation();

  const handleBookButtonClick = () => {
    Util.triggerMoEngageEvent("home_book_flight_clicked");
    Util.sendMessageToReactNative("Flight Booking CTA Clicked");
    pushHistory("/flights");
  };
  React.useEffect(() => {
    window.onpopstate = (e) => {
      props.handleAddFlightOnExit();
    };
  });
  return (
    <Fragment>
      <div className="add-flight-button-container">
        {getAppConfig("SHOW_FLIGHT_BOOKING") ? (
          <div
            className="add-flight-button"
            onClick={handleBookButtonClick}
            style={{
              backgroundColor: props.enableTheme
                ? props.primaryBtn.bgColor
                : "",
            }}
          >
            <span
              className="add-flight-button-text"
              style={{
                color: props.enableTheme ? props.primaryBtn.fontColor : "",
              }}
            >
              <Text type="extra-bold">Book Flight</Text>
            </span>
          </div>
        ) : null}

        <div
          className="add-flight-button"
          onClick={props.handleAddFlightShow}
          style={{
            backgroundColor: props.enableTheme
              ? props.secondaryBtn.bgColor
              : "transparent",
            borderRadius: "100px",
            border: props.enableTheme
              ? `1px solid ${props.secondaryBtn.bgColor}`
              : "1px solid #037b79",
            alignItems: "center",
          }}
        >
          <span
            className="add-flight-button-text"
            style={{
              color: props.enableTheme
                ? props.secondaryBtn.fontColor
                : "#037b79",
            }}
          >
            <Text type="extra-bold">Track Flight</Text>
          </span>
        </div>
      </div>

      <AddFlightModal
        show={props.addFlightShow}
        setShow={props.setAddFlightShow}
        onHide={props.handleAddFlightClose}
        onExited={props.handleAddFlightOnExit}
        fullscreen={true}
      >
        <AddFlight
          handleOnAddFlight={props.handleOnAddFlight}
          disableTransitFlights={true}
        />
      </AddFlightModal>
    </Fragment>
  );
}
