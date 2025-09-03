import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import airplane from "../assets/fly.png";
import moment from "util/momentWrapper";

export const FlightInformationCard = (props) => {
  const { data } = props;
  const [value, setValue] = React.useState("Today");
  const tabsName = ["Today", "Tomorrow"];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const returnValidString = (val1, val2) => {
    return val1 || val2 || "";
  };

  const convertToDateString = (date) => {
    return date
      ? moment(date).add(5, "hour").add(30, "minute").format("L")
      : "TBD";
  };

  return (
    <div className="chat-text chatFlightInformation">
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs">
            {tabsName.map((val) => (
              <Tab
                key={`nav-${val}`}
                className="tab-nav"
                label={val}
                value={val}
              />
            ))}
          </TabList>
        </Box>
        {tabsName.map((val) => (
          <TabPanel className="tabPanel" key={`TabPanel-${val}`} value={val}>
            <div className="searchBox">
              <input
                className="form-control"
                name="search"
                placeholder="Search airline, flight number, city, status"
                type="text"
              />
            </div>
            <div className="flight-list">
              {data[val]?.map((flightData, index) => {
                return (
                  <div className="flight-card" key={`val-${index}`}>
                    <header className="">
                      <span className="airline-name">
                        {returnValidString(
                          flightData?.airline?.name,
                          flightData.airline_name
                        )}
                      </span>
                      <div className="airlineNo">
                        <small>flight No.</small>
                        <strong>
                          {returnValidString(
                            flightData.flightNumber,
                            flightData.flight_unique_no
                          )}
                        </strong>
                      </div>
                    </header>
                    <div
                      className={`status-bar ${returnValidString(
                        flightData.flightStatus?.name,
                        flightData.flight_status_id
                      )}`}
                    >
                      {returnValidString(
                        flightData.flightStatus?.displayName,
                        flightData.flight_status_id
                      )}
                    </div>

                    <div className="cities">
                      <div className="city">
                        <small>
                          {returnValidString(
                            flightData.originAirport?.city,
                            flightData.base_airport_name
                          )}
                        </small>
                        <strong>
                          {returnValidString(
                            flightData.originAirport?.code,
                            flightData.org_airport_id
                          )}
                        </strong>
                      </div>
                      <div className="city">
                        <small>
                          {returnValidString(
                            flightData.destinationAirport?.city,
                            flightData.srcdest_airport_name
                          )}
                        </small>
                        <strong>
                          {returnValidString(
                            flightData.destinationAirport?.code,
                            flightData.dest_airport_id
                          )}
                        </strong>
                      </div>
                      <div className="">
                        <img
                          className="airplane"
                          src={airplane}
                          alt="airplane"
                        />
                      </div>
                    </div>

                    <div className="terminals">
                      <div className="departure">
                        <div className="box">
                          <small>Terminal</small>
                          <strong>
                            <em>
                              {returnValidString(
                                flightData.originAirport?.terminal,
                                flightData.baseTerminal
                              )}
                            </em>
                          </strong>
                        </div>
                        <div className="box">
                          <small>Gate</small>
                          <strong>
                            <em>
                              {flightData.gates
                                ? flightData.gates[0]?.gateNumber
                                : ""}
                            </em>
                          </strong>
                        </div>
                      </div>
                      <div className="arrival">
                        <div className="box">
                          <small>Terminal</small>
                          <strong>
                            {returnValidString(flightData.srcDestTerminal)}
                          </strong>
                        </div>
                        <div className="box">
                          <small>Belt</small>
                          <strong></strong>
                        </div>
                      </div>
                    </div>

                    <div className="timingBox">
                      <div className="scheduled">
                        <small>Scheduled</small>
                        <strong>
                          <em>
                            {flightData.scheduledDate
                              ? convertToDateString(flightData.scheduledDate)
                              : convertToDateString(
                                  flightData?.schedule_hour_id
                                )}
                          </em>
                        </strong>
                      </div>
                      <div className="estimated">
                        <small>Estimated</small>
                        <strong>
                          {flightData.estimatedDate
                            ? convertToDateString(flightData.estimatedDate)
                            : convertToDateString(flightData.estimated_hour_id)}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabPanel>
        ))}
      </TabContext>
    </div>
  );
};
