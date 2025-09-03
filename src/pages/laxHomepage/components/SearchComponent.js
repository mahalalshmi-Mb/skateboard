import React, { useState, useEffect } from "react";
import IconClose from "../assets/iconClose.svg";
import searchIconBlack from "../assets/searchIconBlack.svg";
import styled from "styled-components";

function SearchComponent(props) {
  const {
    label,
    setSearchField,
    placeholder,
    clearSearchInput,
    isSearchDisabled,
  } = props;
  const [search, setSearch] = useState("");

  useEffect(() => {
    clearSearchField();
  }, [clearSearchInput]);

  function handleClear() {
    setSearch("");
  }

  function clearSearchField() {
    setSearch("");
    setSearchField("");
  }

  return (
    <div
      className="search__component__withLabel__container"
      style={{
        minHeight: "40px",
        ...props.style,
      }}
    >
      {label && <span className="label">{label}</span>}
      <div
        className="search__field__wrapper"
        style={{
          position: "relative",
        }}
      >
        <input
          className="search__field"
          type="search"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          disabled={isSearchDisabled}
        />
        {search ? (
          <span
            style={isSearchDisabled ? { opacity: "0.3" } : {}}
            className="clearIcon"
            onClick={() => (!isSearchDisabled ? handleClear() : null)}
          >
            <img src={IconClose} />
          </span>
        ) : null}
        <SearchButton style={isSearchDisabled ? { opacity: "0.3" } : {}}>
          <img src={searchIconBlack} alt="search" />
        </SearchButton>
      </div>
    </div>
  );
}

export const SearchButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 70px;
`;

export default SearchComponent;
