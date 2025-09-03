import React, { useState, useEffect, useRef } from "react";
import "../addNewFlight.css";

//components
import UseOutsideClick from "../../../components/atoms/useOutsideClick";

//icons
import CalenderSmall from "../../../assets/images/addNewFlight/calendarSmall.svg";
import ArrowDown from "../../../assets/images/addNewFlight/arrowBigDown.svg";

//apicall
import config from "../../../commons/config";
import callAPI from "../../../commons/callAPI";

//packages
import DatePicker from "react-date-picker";

function FilterHeader({ flightSearchDate, setDate, setBaseAirport }) {
  const ref = useRef();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedHomeAirport, setSelectedHomeAirport] = useState("");
  const [homeAirportsList, setHomeAirportsList] = useState([]);

  UseOutsideClick(ref, () => {
    setIsDropdownOpen(false);
  });

  useEffect(() => {
    getHomeAirportsList();
  }, []);

  const getHomeAirportsList = async () => {
    try {
      const apiURL = config.api.addNewFlights.homeAirports;
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (regResponse && regResponse.data) {
        const homeFlightresponse = regResponse.data;
        setHomeAirportsList(homeFlightresponse);
        setSelectedHomeAirport(homeFlightresponse[0].airportcode);
        setBaseAirport({
          code: homeFlightresponse[0].airportcode,
          name: homeFlightresponse[0].airportname,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="date-baseAirport-wrapper">
      <div className="date-container">
        <span className="date-text">Date:</span>
        <span>
          <DatePicker
            onChange={setDate}
            value={flightSearchDate}
            calendarIcon={<img src={CalenderSmall} className="calenderIcon" />}
            clearIcon={null}
            dayAriaLabel="Day"
            className="react-date-picker__wrapper date-picker-font-styling"
            format="dd/MM/yyyy"
            minDate={new Date()}
            reduceAnimations={true}
          />
        </span>
      </div>
      <div className="baseAirport-container">
        <div
          className="dropdown"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          ref={ref}
        >
          <div className="baseAirport-text">Airport:</div>
          <div className="selectedAirport-text">{selectedHomeAirport}</div>
          {isDropdownOpen ? (
            <div className="dropdown-content">
              {homeAirportsList.map((item, index) => (
                <div
                  key={index}
                  className="dropdown-content-tile"
                  onClick={() => {
                    setSelectedHomeAirport(item.airportcode);
                    setBaseAirport({
                      code: item.airportcode,
                      name: item.airportname,
                    });
                  }}
                >
                  {item.airportname}
                  {"("}
                  {item.airportcode}
                  {")"}
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{ marginTop: 5 }}
        >
          <img
            src={ArrowDown}
            height="20"
            width="20"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterHeader;
