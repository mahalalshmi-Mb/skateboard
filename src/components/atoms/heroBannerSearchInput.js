import { dateTimeFormats } from "config/dateTimeConfig";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import moment from "util/momentWrapper";
import AirlineIcon from "../../assets/images/flights/airline_icon.svg";
import AirlinePathIcon from "../../assets/images/flights/airline_path.svg";
import CrossRedIcon from "../../assets/images/flights/cross_red.svg";
import AirlineFallbackIcon from "../../assets/images/flights/flight-status.svg";
import callAPI from "../../commons/callAPI";
import config from "../../commons/config";
import {
  getBaggageInfo,
  getGateInfo,
} from "../../commons/util/helperFunctions";
import AirlineDetails from "../../data/airlineLogoAndBg";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import useOutsideClick from "./useOutsideClick";

function HeroBannerSearchInput(props) {
  const { returnRedirectUrl } = useCustomNavigation();
  const inputRef = useRef();
  const searchResultsRef = useRef();
  const throttling = useRef(false);
  const [searchText, setSearchText] = useState("");
  const [flightSuggestions, setFlightSuggestions] = useState([]);
  const [showNoResultsFound, setShowNoResultsFound] = useState(false);
  const [showSuggestionsLoading, setShowSuggestionsLoading] = useState(false);
  const [movementType, setMovementType] = useState("");

  let placeholder = "Search by Flight Number.";

  useOutsideClick(searchResultsRef, () => {
    setSearchText("");
    setShowNoResultsFound(false);
    setFlightSuggestions([]);
  });

  const handleFlightSearch = () => {
    setSearchText(inputRef.current.value);
    if (!inputRef.current.value.trim()) {
      setShowNoResultsFound(false);
    }
    setShowNoResultsFound(false);
    if (throttling.current) {
      return;
    }
    let found;
    if (props.flightData.flightIds) {
      found = props.flightData.flightIds.find(
        (element) =>
          element.flightId.toLowerCase() ===
          inputRef.current.value.toLowerCase()
      );
    }
    if (inputRef.current.value.trim() && found === undefined)
      setShowNoResultsFound(true);
    if (!inputRef.current.value.trim() || found === undefined) {
      setFlightSuggestions([]);
      return;
    }
    setMovementType(found.movementType);
    throttling.current = true;
    setTimeout(() => {
      throttling.current = false;
      setShowSuggestionsLoading(true);
      let date = moment(new Date(), "UTC", "UTC").format();

      let apiURL = config.api.flightSearch
        .replace("{{date}}", date)
        .replace("{{movementType}}", found.movementType)
        .replace("{{flightNo}}", inputRef.current.value);
      callAPI
        .get(apiURL)
        .then(async (response) => {
          if (response.status === 200) {
            let regResponse = await response.json();
            if (regResponse.length > 0) {
              regResponse.forEach((flightItem) => {
                flightItem.estimatedDate = moment(flightItem.estimatedDate)
                  .add(5, "hours")
                  .add(30, "minutes")
                  .format("lll");
                flightItem.scheduledDate = moment(flightItem.scheduledDate)
                  .add(5, "hours")
                  .add(30, "minutes")
                  .format("lll");
              });
              setFlightSuggestions(regResponse);
              setShowSuggestionsLoading(false);
            } else {
              setFlightSuggestions([]);
              setShowSuggestionsLoading(false);
              setShowNoResultsFound(true);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }, 1000);
  };

  const getFlightStatusClassName = (name, isFont) => {
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
        className = "re-scheduled";
        break;
      case "FINALCALL":
        className = "final-call";
        break;
      case "GATECLOSED":
        return (className = "gate-closed");
        break;
      case "SECURITY":
        className = "security";
        break;
      case "CHECKIN":
        className = "check-in";
        break;
      default:
        return "";
    }
    if (isFont) return `${className}_font`;
    else return className;
  };

  return (
    <>
      <div>
        <div
          className={
            props.pageKey === "corporateHomePage"
              ? "component heroBanner_search margin_no_quick_links"
              : "component heroBanner_search "
          }
          data-flightstatuspage="/travellers/flights/flight-information.html"
          data-searchresultspage="/search-results.html"
        >
          <div className="container">
            <div className="row">
              <div className="col-12 offset-lg-2 col-lg-8 col-md-12 col-sm-12 search_parent">
                <div className="search_form">
                  <input
                    className="search_input"
                    type="text"
                    placeholder={placeholder}
                    aria-label="Search"
                    spellCheck="false"
                    value={searchText}
                    ref={inputRef}
                    onChange={handleFlightSearch}
                  />
                  <span
                    className="search_icon"
                    style={
                      searchText === ""
                        ? { display: "inline" }
                        : { display: "none" }
                    }
                  ></span>
                  <span
                    className="close_icon"
                    style={
                      searchText !== ""
                        ? { display: "inline" }
                        : { display: "none" }
                    }
                    onClick={() => {
                      setSearchText("");
                      setShowNoResultsFound(false);
                      setFlightSuggestions([]);
                    }}
                  ></span>
                </div>
                {showSuggestionsLoading ? (
                  <div className="search__wrapper" style={{ display: "block" }}>
                    <ul
                      className="search__option__list"
                      data-link="/bial/services/searchSuggestions.json"
                    ></ul>
                    <a
                      title="result"
                      className="result__link"
                      style={{ textTransform: "none", borderBottom: "none" }}
                    >
                      Loading...
                    </a>
                  </div>
                ) : null}
                {showNoResultsFound ? (
                  <div className="search__wrapper" style={{ display: "block" }}>
                    <ul
                      className="search__option__list"
                      data-link="/bial/services/searchSuggestions.json"
                    ></ul>
                    <a
                      title="result"
                      className="result__link"
                      style={{ textTransform: "none", borderBottom: "none" }}
                    >
                      No Results Found...
                    </a>
                  </div>
                ) : null}
                {inputRef.current?.value && flightSuggestions.length > 0 ? (
                  <div
                    className="search-result"
                    style={{ display: "block" }}
                    ref={searchResultsRef}
                  >
                    <div
                      className="search-result-cards"
                      data-link="/bial/services/flightStatus.json"
                    >
                      <div className="component flight_status_cards">
                        <div className="container">
                          <div className="row flight-card-no-gutter">
                            <div className="flight_status_cards-wrapper">
                              {flightSuggestions.map((item, index) => (
                                <Link
                                  to={returnRedirectUrl(
                                    `/travellers/flights/flight-information?selectedFlight=${item.flightNumber}&movementType=${movementType}`
                                  )}
                                  className="flight_status_card"
                                  key={index}
                                >
                                  <div
                                    className={`flight_status ${getFlightStatusClassName(
                                      item.flightStatus.name
                                    )}`}
                                  >
                                    {item.flightStatus.displayName}
                                  </div>
                                  <div className="flight_status_logo_wrapper">
                                    <div
                                      className="flight_owner_logo"
                                      style={
                                        item.airline.code &&
                                        AirlineDetails[item.airline.code]
                                          ? {
                                              borderBottom: `195px solid ${
                                                AirlineDetails[
                                                  item.airline.code
                                                ].brandColor
                                              }`,
                                            }
                                          : {
                                              borderBottom: `195px solid #fff`,
                                            }
                                      }
                                    >
                                      <img
                                        className="flight_owner_logo_image"
                                        alt=""
                                        onError={(e) => {
                                          e.target.src = AirlineFallbackIcon;
                                        }}
                                        src={
                                          item.airline.code &&
                                          AirlineDetails[item.airline.code]
                                            ? config.imageUrlDomain.imageURL +
                                              AirlineDetails[item.airline.code]
                                                .logo
                                            : ""
                                        }
                                      />
                                    </div>
                                    <div className="flight_status_description_wrapper">
                                      <div className="flight_status_description_wrapper_column1">
                                        <div className="flight_status_flight_details">
                                          <p className="flight__number">
                                            {item.flightNumber}
                                          </p>
                                          <p className="flight__name small_heading">
                                            {item.airline.displayName}
                                          </p>
                                        </div>
                                        <div className="horizontal_line"></div>
                                        <div className="flight_status_schedule_details">
                                          <p className="flight__scheduled_label small_heading">
                                            Scheduled
                                          </p>
                                          <p className="flight__scheduled">
                                            {item.scheduledDate.slice(8, 10) +
                                              ":" +
                                              item.scheduledDate.slice(10, 12)}
                                            &nbsp; &nbsp;
                                            {item.scheduledDate.slice(6, 8) +
                                              ", " +
                                              moment(item.scheduledDate).format(
                                                dateTimeFormats.date.shortMonth
                                              ) +
                                              "."}
                                          </p>
                                          <p className="flight__estimated_label small_heading">
                                            Estimated
                                          </p>
                                          <p
                                            className={`flight__estimated ${getFlightStatusClassName(
                                              item.flightStatus.name,
                                              true
                                            )}`}
                                          >
                                            {item.estimatedDate.slice(8, 10) +
                                              ":" +
                                              item.estimatedDate.slice(10, 12)}
                                            &nbsp; &nbsp;
                                            {item.estimatedDate.slice(6, 8) +
                                              ", " +
                                              moment(item.estimatedDate).format(
                                                dateTimeFormats.date.shortMonth
                                              ) +
                                              "."}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flight_status_description_wrapper_column2">
                                        <div className="flight_status_source_and_destination_details">
                                          <div className="flight_status_source_wrapper">
                                            <p className="flight_status_source big_heading">
                                              {item.originAirport.city}
                                              <label className="small_heading">
                                                {" "}
                                                &nbsp; (
                                                {item.originAirport.code})
                                              </label>
                                            </p>
                                            <div className="flight_status_gates_terminal_wrapper">
                                              <div className="flight_status_gate_wrapper">
                                                <p className="flight__gate_title small_heading">
                                                  Gate{" "}
                                                </p>
                                                {item.gates.length > 0 ? (
                                                  <p className="flight__gate">
                                                    {item.gates &&
                                                      getGateInfo(item.gates)}
                                                  </p>
                                                ) : (
                                                  <div className="empty-data">
                                                    -
                                                  </div>
                                                )}
                                              </div>
                                              <div className="flight_status_terminal_wrapper">
                                                <p className="flight__terminal_title small_heading">
                                                  Terminal{" "}
                                                </p>
                                                {item.terminal ? (
                                                  <p className="flight__terminal"></p>
                                                ) : (
                                                  <div className="empty-data">
                                                    -
                                                  </div>
                                                )}
                                                <p></p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flight_status_distination_wrapper">
                                            <p className="flight_status_destination big_heading">
                                              {item.destinationAirport.city}
                                              <label className="small_heading">
                                                {" "}
                                                &nbsp;(
                                                {item.destinationAirport.code})
                                              </label>
                                            </p>
                                            <div className="flight_status_gates_terminal_wrapper">
                                              <div className="flight_status_gate_wrapper">
                                                <p className="flight__gate_title small_heading">
                                                  {" "}
                                                  Belt{" "}
                                                </p>
                                                {item.baggageBelts.length >
                                                0 ? (
                                                  <p className="flight__gate">
                                                    {item.baggageBelts &&
                                                      getBaggageInfo(
                                                        item.baggageBelts
                                                      )}
                                                  </p>
                                                ) : (
                                                  <div className="empty-data">
                                                    -
                                                  </div>
                                                )}
                                                <p></p>
                                              </div>
                                              <div className="flight_status_terminal_wrapper">
                                                <p className="flight__terminal_title small_heading">
                                                  Terminal{" "}
                                                </p>
                                                {item.terminal ? (
                                                  <p className="flight__terminal"></p>
                                                ) : (
                                                  <div className="empty-data">
                                                    -
                                                  </div>
                                                )}
                                                <p></p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flight_status_icon">
                                      <img
                                        className="flight_status_icon_airpath"
                                        src={AirlinePathIcon}
                                        alt=""
                                      />
                                      <img
                                        className="flight_status_icon_airplane"
                                        src={AirlineIcon}
                                        alt=""
                                      />
                                      <img
                                        className={`flight_status_icon_airplane_cross ${getFlightStatusClassName(
                                          item.flightStatus.name,
                                          true
                                        )}`}
                                        src={CrossRedIcon}
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroBannerSearchInput;
