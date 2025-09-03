import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";

//apicall
import config from "../../commons/config";
import callAPI from "../../commons/callAPI";

//components
import UseOutsideClick from "./useOutsideClick";
import Text from "./Text";

//icons
import SwapArrow from "../../assets/images/addNewFlight/swapArrow.svg";

function FlightSearchField({
  label,
  labelIcon,
  setSearchField,
  placeholder,
  searchFieldName,
  clearSearchInput,
  isDestDisabled,
  handleSwap,
  transitMode,
  hideSwapButton,
}) {
  const ref = useRef();
  const [flightSearch, setFlightSearch] = useState(
    searchFieldName ? searchFieldName : ""
  );
  const [flightSearchResults, setFlightSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setFlightSearch(searchFieldName);
  }, [searchFieldName]);

  UseOutsideClick(ref, () => {
    setIsDropdownOpen(!isDropdownOpen);
  });

  useEffect(() => {
    clearAndDisableInput();
  }, [clearSearchInput]);

  useEffect(() => {
    const handler = setTimeout(() => {
      // Make sure we have a value (user has entered something in input)
      if (flightSearch && isSearching && flightSearch?.slice(-1) != " ") {
        const apiURL = config.api.addNewFlights.airportSearchResults;
        // Fire off our API call
        callAPI
          .get(apiURL, { apName: flightSearch })
          .then((response) => {
            // console.log(response.status) --> 401
            return response.json();
          })
          .then((response) => {
            if (response.data) {
              const searchResponse = response.data;
              setFlightSearchResults(searchResponse);
              setIsDropdownOpen(true);
            }
          })
          .catch((error) => {
            console.log(error);
            setFlightSearchResults([]);
          });
      } else {
        if (flightSearch?.slice(-1) != " ") {
          setFlightSearchResults([]);
        }
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [flightSearch]);

  function handleListItemClick(item) {
    setFlightSearch(item.airportname);
    setSearchField({ code: item.airportcode, name: item.airportname });
    setIsDropdownOpen(false);
    setIsSearching(false);
  }

  function clearAndDisableInput() {
    setFlightSearch("");
    setIsDropdownOpen(false);
    setSearchField({ code: "", name: "" });
  }
  return (
    <div className="input-container">
      <div
        className={`input-label-container ${
          label === "To" ? `space-between` : ``
        }`}
      >
        <div className="input-label-wrapper">
          <img
            src={labelIcon}
            width="24px"
            height="22px"
            alt="label"
            className="label-icon"
          />
          <div className="label-text">
            <Text type="bold">{label}</Text>
          </div>
        </div>
        {label === "To" && !hideSwapButton && !transitMode && (
          <div className="swap-arrow-wrapper">
            <img src={SwapArrow} alt="swap" onClick={() => handleSwap()} />
          </div>
        )}
      </div>
      <div className="input-wrapper">
        <TextField
          autoComplete="off"
          id="outlined-basic"
          label={label}
          placeholder={placeholder}
          variant="outlined"
          value={flightSearch}
          onChange={(e) => {
            if (e?.target?.value?.slice(-2) != "  ") {
              setFlightSearch(e.target.value);
              setIsSearching(true);
            }
          }}
          disabled={isDestDisabled}
        />
        {isDropdownOpen && flightSearchResults.length ? (
          <div className="search-dropdown-content" ref={ref}>
            {flightSearchResults.map((item, index) => (
              <div
                className="search-dropdown-content-tile"
                key={index}
                style={{
                  borderBottom:
                    index === flightSearchResults.length - 1
                      ? "0pt solid #e9e9e9"
                      : "",
                }}
                onClick={() => handleListItemClick(item)}
              >
                <Text type="semi-bold">{`${item.airportname}(${item.airportcode})`}</Text>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default FlightSearchField;
