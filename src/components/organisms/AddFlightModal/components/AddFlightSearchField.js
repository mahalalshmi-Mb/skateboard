import TextField from "@mui/material/TextField";
import React, { useEffect, useRef, useState } from "react";

//apicall
import callAPI from "../../../../commons/callAPI";
import config from "../../../../commons/config";

//components
import useOutsideClick from "../../../atoms/useOutsideClick";

//icons
import styled from "styled-components";
import { Image } from "../../../../theme/globalStyleSheet";
import downArrow from "../assets/down-arrow.svg";
import DropdownMenu from "./DropdownMenu";

function AddFlightSearchField(props) {
  const { setSearchField, searchFieldName, clearSearchInput, placeholder } =
    props;
  const dropdownRef = useRef();
  const [flightSearch, setFlightSearch] = useState(
    searchFieldName ? searchFieldName : ""
  );
  const [flightSearchResults, setFlightSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setFlightSearch(searchFieldName);
  }, [searchFieldName]);

  useOutsideClick(dropdownRef, () => {
    setIsDropdownOpen(!isDropdownOpen);
  });

  useEffect(() => {
    clearAndDisableInput();
  }, [clearSearchInput]);

  useEffect(() => {
    const handler = setTimeout(() => {
      // Make sure we have a value (user has entered something in input)
      if (flightSearch && isSearching && flightSearch?.slice(-1) !== " ") {
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
        if (flightSearch?.slice(-1) !== " ") {
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
    <ParentWrapper>
      <TextFieldWrapper
        disabled={props.disabled}
        style={{ ...props.style }}
        ref={dropdownRef}
      >
        <CssTextField
          error={props.error}
          value={flightSearch}
          placeholder={`${placeholder}${props.mandatory ? "*" : ""}`}
          fullWidth={props.fullWidth || true}
          type={props.type}
          id="custom-css-outlined-input"
          size="medium"
          onChange={(e) => {
            if (e?.target?.value?.slice(-2) !== "  ") {
              setFlightSearch(e.target.value);
              setIsSearching(true);
            }
          }}
          inputProps={{
            autoComplete: "off",
            ...{ maxLength: props.maxLength || null },
            ...props.inputProps,
          }}
          InputLabelProps={{
            style: { color: "#222222", opacity: 0.3 },
          }}
          onFocus={() => {
            if (flightSearchResults.length > 0 || isSearching) {
              setIsDropdownOpen(true);
            }
          }}
          multiline={props.multiline}
          minRows={props.minRows}
          maxRows={props.maxRows}
          maxLength={props.maxLength}
        />

        <ArrowIcon src={downArrow} alt="down" />
      </TextFieldWrapper>
      <DropdownMenu
        isOpen={isDropdownOpen && flightSearchResults.length}
        setIsOpen={setIsDropdownOpen}
        selected={props.value}
        setSelected={handleListItemClick}
        data={flightSearchResults}
        onSelectionCallback={handleListItemClick}
      />
    </ParentWrapper>
  );
}

const ParentWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 54px;
`;

const TextFieldWrapper = styled.div``;

const CssTextField = styled(TextField)(({ error, success }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "8px",
    fontFamily: "ManropeRegular",
    paddingRight: "30px",
  },
  "& label.Mui-focused": {
    color: `${error ? "#EDBEC4" : success ? "#04ADAA" : "#222222"}`,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: `${error ? "#EDBEC4" : success ? "#04ADAA" : "#dcdcdc"}`,
    },
    "&:hover fieldset": {
      borderColor: `${error ? "#EDBEC4" : success ? "#04ADAA" : "#dcdcdc"}`,
    },
    "&.Mui-focused fieldset": {
      borderColor: `${error ? "#EDBEC4" : success ? "#04ADAA" : "#dcdcdc"}`,
    },
  },
}));

const ArrowIcon = styled(Image)`
  margin-right: 16px;
  position: absolute;
  right: 0;
  top: 50%;
`;

export default AddFlightSearchField;
