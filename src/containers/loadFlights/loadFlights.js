import React, { Fragment, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { FlightContext } from "../../context/FlightsContext";

const LoadFlight = (props) => {
  const ClientFlight = useContext(FlightContext);
  const [cookies] = useCookies(["gwLoginData"]);

  useEffect(() => {
    //on app load
    if (cookies.gwLoginData) {
      syncFlights();
    } else {
      props.setIsFlightLoaded(true);
    }
  }, []);

  const syncFlights = async () => {
    const apiCalled = await ClientFlight.syncFlightsFromUserProfile();
    if (apiCalled) {
      props.setIsFlightLoaded(true);
    }
  };

  return <Fragment>{props.children}</Fragment>;
};

export default LoadFlight;
