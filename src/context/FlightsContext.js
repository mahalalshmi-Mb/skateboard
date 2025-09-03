import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import moment from "util/momentWrapper";
import callAPI from "../commons/callAPI";
import config from "../commons/config";
import { getAppConfig } from "../commons/util/appConfigHelper";
import { isLoggedIn } from "../commons/util/helperFunctions";
import {
  getSessionStorage,
  removeSessionStorage,
  setSessionStorage,
} from "../util/storageUtil";

const FlightContext = React.createContext();

const FlightProvider = (props) => {
  const [cookies, setCookie] = useCookies(["userFlight"]);
  const [flightData, setFlightData] = useState(cookies.userFlight || []);

  useEffect(() => {
    /* Runs when flight object changes */
    setCookie("userFlight", JSON.stringify(flightData), {
      path: "/",
      maxAge: 86400 * getAppConfig("FLIGHT_COOKIE_EXPIRY_DAYS"),
    });
  }, [flightData]);

  function reset() {
    setFlightData([]);
    setCookie("userFlight", JSON.stringify(flightData), {
      path: "/",
      maxAge: 86400 * getAppConfig("FLIGHT_COOKIE_EXPIRY_DAYS"),
    });
  }

  function getConnectingFlight(flightDetails) {
    let connectingFlight = {};
    connectingFlight.UID = flightDetails.uid;
    connectingFlight.flightId = flightDetails.flight_unique_no;
    connectingFlight.baseAirport = flightDetails.org_airport_id;
    connectingFlight.srcDestAirport =
      flightDetails.bound_id === "A"
        ? flightDetails.dest_airport_id
        : flightDetails.orgdest_airport_id;
    connectingFlight.baseAirportName = flightDetails.base_airport_name;
    connectingFlight.srcDestAirportName = flightDetails.srcdest_airport_name;
    connectingFlight.movementType = flightDetails.bound_id;
    connectingFlight.sector = flightDetails.flight_id;
    connectingFlight.scheduleDate = flightDetails.schedule_date;
    connectingFlight.scheduleTime = flightDetails.schedule_hour_id
      ? moment(flightDetails.schedule_hour_id).format("LTS")
      : "";
    connectingFlight.scheduleDateTime = flightDetails.schedule_hour_id
      ? moment(flightDetails.schedule_hour_id).format("llll")
      : "";
    connectingFlight.estimatedDateTime = flightDetails.estimated_hour_id
      ? moment(flightDetails.estimated_hour_id).format("llll")
      : "";
    connectingFlight.baseTerminal =
      flightDetails.baseTerminal &&
      flightDetails.baseTerminal !== undefined &&
      flightDetails.baseTerminal !== null
        ? flightDetails.baseTerminal
        : "";
    connectingFlight.srcDestTerminal =
      flightDetails.srcDestTerminal &&
      flightDetails.srcDestTerminal !== undefined &&
      flightDetails.srcDestTerminal !== null
        ? flightDetails.srcDestTerminal
        : "";
    connectingFlight.airlineId = flightDetails.airline_iata_id;
    connectingFlight.airlineName = flightDetails.airline_name;
    connectingFlight.airlineImg = flightDetails.airline_img;
    return connectingFlight;
  }

  function addFlight(flightDetails, connectingFlightDetails) {
    let flightsArray = [];
    let flightObj = [];
    let reqBody = {};
    if (connectingFlightDetails && connectingFlightDetails.length > 0) {
      let transitFlight = getConnectingFlight(flightDetails);
      flightsArray.push({
        UID: connectingFlightDetails[0].uid,
        flightId: connectingFlightDetails[0].flight_unique_no,
        baseAirport: connectingFlightDetails[0].org_airport_id,
        srcDestAirport:
          connectingFlightDetails[0].bound_id === "A"
            ? connectingFlightDetails[0].dest_airport_id
            : connectingFlightDetails[0].orgdest_airport_id,
        baseAirportName: connectingFlightDetails[0].base_airport_name,
        srcDestAirportName: connectingFlightDetails[0].srcdest_airport_name,
        movementType: connectingFlightDetails[0].bound_id,
        sector: connectingFlightDetails[0].flight_id,
        scheduleDate: connectingFlightDetails[0].schedule_date,
        scheduleTime: connectingFlightDetails[0].schedule_hour_id
          ? moment(connectingFlightDetails[0].schedule_hour_id).format("LTS")
          : "",
        scheduleDateTime: connectingFlightDetails[0].schedule_hour_id
          ? parseInt(
              moment(connectingFlightDetails[0].schedule_hour_id).format("llll")
            )
          : "",
        estimatedDateTime: connectingFlightDetails[0].estimated_hour_id
          ? parseInt(
              moment(connectingFlightDetails[0].estimated_hour_id).format(
                "llll"
              )
            )
          : "",
        baseTerminal:
          connectingFlightDetails[0].baseTerminal &&
          connectingFlightDetails[0].baseTerminal !== undefined &&
          connectingFlightDetails[0].baseTerminal !== null
            ? connectingFlightDetails[0].baseTerminal
            : "",
        srcDestTerminal:
          connectingFlightDetails[0].srcDestTerminal &&
          connectingFlightDetails[0].srcDestTerminal !== undefined &&
          connectingFlightDetails[0].srcDestTerminal !== null
            ? connectingFlightDetails[0].srcDestTerminal
            : "",
        airlineId: connectingFlightDetails[0].airline_iata_id,
        airlineName: connectingFlightDetails[0].airline_name,
        airlineImg: connectingFlightDetails[0].airline_img,
        connectingFlight: transitFlight,
      });
    } else {
      flightsArray.push({
        UID: flightDetails.uid,
        flightId: flightDetails.flight_unique_no,
        baseAirport: flightDetails.org_airport_id,
        srcDestAirport:
          flightDetails.bound_id === "A"
            ? flightDetails.dest_airport_id
            : flightDetails.orgdest_airport_id,
        baseAirportName: flightDetails.base_airport_name,
        srcDestAirportName: flightDetails.srcdest_airport_name,
        movementType: flightDetails.bound_id,
        sector: flightDetails.flight_id,
        scheduleDate: flightDetails.schedule_date,
        scheduleTime: flightDetails.schedule_hour_id
          ? moment(flightDetails.schedule_hour_id).format("LTS")
          : "",
        scheduleDateTime: flightDetails.schedule_hour_id
          ? parseInt(moment(flightDetails.schedule_hour_id).format("LTS"))
          : "",
        estimatedDateTime: flightDetails.estimated_hour_id
          ? parseInt(moment(flightDetails.estimated_hour_id).format("LTS"))
          : "",
        baseTerminal:
          flightDetails.baseTerminal &&
          flightDetails.baseTerminal !== undefined &&
          flightDetails.baseTerminal !== null
            ? flightDetails.baseTerminal
            : "",
        srcDestTerminal:
          flightDetails.srcDestTerminal &&
          flightDetails.srcDestTerminal !== undefined &&
          flightDetails.srcDestTerminal !== null
            ? flightDetails.srcDestTerminal
            : "",
        airlineId: flightDetails.airline_iata_id,
        airlineName: flightDetails.airline_name,
        airlineImg: flightDetails.airline_img,
        gateId: flightDetails.gate_id,
        status: flightDetails.flight_status_id,
        beltId: flightDetails.belt_id,
      });
    }
    flightData.push(flightsArray[0]);
    flightObj = JSON.parse(JSON.stringify(flightsArray[0]));
    flightObj.scheduleDateTime = flightObj?.scheduleDateTime?.toString();
    flightObj.estimatedDateTime = flightObj?.estimatedDateTime?.toString();
    reqBody.flight = flightObj;
    setCookie("userFlight", JSON.stringify(flightData), {
      path: "/",
      maxAge: 86400 * getAppConfig("FLIGHT_COOKIE_EXPIRY_DAYS"),
    });
    // addFlightToProfile(reqBody);
    return true;
  }

  function removeFlight(uid, dontRemoveMandatoryInfo) {
    if (flightData.length > 0) {
      let filteredFlightArray = flightData.filter((x) => x.UID !== uid);
      setFlightData([...filteredFlightArray]);
      setCookie("userFlight", JSON.stringify(filteredFlightArray), {
        path: "/",
        maxAge: 86400 * getAppConfig("FLIGHT_COOKIE_EXPIRY_DAYS"),
      });
      const fnbStorage = getSessionStorage("productsData");
      if (fnbStorage) {
        delete fnbStorage["flightDetails"];
      }
      setSessionStorage("productsData", fnbStorage);
      if (!dontRemoveMandatoryInfo) {
        removeSessionStorage("mandatoryInfoData");
      }
      // if (isLoggedIn()) {
      //   try {
      //     let apiURL = config.api.addNewFlights.removeFlight;
      //     let apiResponse = await callAPI.delete(
      //       apiURL,
      //       {},
      //       {
      //         UID: uid,
      //       }
      //     );
      //     let regResponse = await apiResponse.json();
      //   } catch (e) {
      //     console.log(e);
      //   }
      // }
    }
  }

  function myFlights() {
    if (flightData.length > 0) {
      let sortedFlightArray = flightData.sort(
        (a, b) => moment(a.estimatedDateTime) - moment(b.estimatedDateTime)
      );
      sortedFlightArray = sortedFlightArray.filter((x) =>
        moment(x.estimatedDateTime).isAfter(moment(new Date()))
      );
      setCookie("userFlight", JSON.stringify(sortedFlightArray), {
        path: "/",
        maxAge: 86400 * getAppConfig("FLIGHT_COOKIE_EXPIRY_DAYS"),
      });
      return sortedFlightArray;
    } else {
      return flightData;
    }
  }

  function getFlightById(id) {
    let allFlightsData = myFlights();
    let currentFlight;

    allFlightsData.forEach((flight) => {
      if (flight.flightId === id) {
        currentFlight = flight;
      }
    });

    return currentFlight;
  }

  async function syncFlightsFromUserProfile() {
    let flights = [];
    if (isLoggedIn()) {
      try {
        let apiURL = config.api.addNewFlights.myFlights;
        let apiResponse = await callAPI.get(apiURL);
        let regResponse = await apiResponse.json();
        if (regResponse?.status === 200) {
          if (regResponse?.data?.flights?.length > 0) {
            flights = regResponse?.data?.flights;
          }
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      flights = flightData;
    }
    if (flights.length > 0) {
      flights.forEach((x) => {
        x.scheduleDateTime = parseInt(x?.scheduleDateTime);
        x.estimatedDateTime = parseInt(x?.estimatedDateTime);
      });
      let sortedFlightArray = flights.sort(
        (a, b) => moment(a.estimatedDateTime) - moment(b.estimatedDateTime)
      );
      sortedFlightArray = sortedFlightArray.filter((x) =>
        moment(x.estimatedDateTime).isAfter(moment(new Date()))
      );
      setFlightData([...sortedFlightArray]);
      setCookie("userFlight", JSON.stringify(sortedFlightArray), {
        path: "/",
        maxAge: 86400 * getAppConfig("FLIGHT_COOKIE_EXPIRY_DAYS"),
      });
    } else {
      setFlightData([...flights]);
      setCookie("userFlight", JSON.stringify(flights), {
        path: "/",
        maxAge: 86400 * getAppConfig("FLIGHT_COOKIE_EXPIRY_DAYS"),
      });
    }
    return true;
  }

  async function addFlightToProfile(reqBody) {
    if (isLoggedIn()) {
      try {
        let apiURL = config.api.addNewFlights.addFlight;
        let apiResponse = await callAPI.post(apiURL, reqBody);
        let regResponse = await apiResponse.json();
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function saveFlight() {
    let flightObj = {};
    let reqBody = {};
    if (flightData?.length > 0) {
      flightObj = JSON.parse(JSON.stringify(flightData[0]));
      flightObj.scheduleDateTime = flightObj?.scheduleDateTime?.toString();
      flightObj.estimatedDateTime = flightObj?.estimatedDateTime?.toString();
    }
    reqBody.flight = flightObj;
    addFlightToProfile(reqBody);
  }

  return (
    <FlightContext.Provider
      value={{
        reset,
        addFlight,
        removeFlight,
        myFlights,
        getFlightById,
        syncFlightsFromUserProfile,
        saveFlight,
        flightData,
      }}
    >
      {props.children}
    </FlightContext.Provider>
  );
};

export { FlightContext, FlightProvider };
