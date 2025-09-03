import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import callAPI from "../../../commons/callAPI";
import config from "../../../commons/config";
import { getAppConfig } from "../../../commons/util/appConfigHelper";
import Text from "../../../components/atoms/Text";
import Loader from "../../../components/atoms/loader";
import UseOutsideClick from "../../../components/atoms/useOutsideClick";
import "./AutoSuggestion.css";
import useCustomNavigation from "../../../hooks/useCustomNavigation";

const AutoSugesstion = (props) => {
  const [searchValueResults, setSearchValueResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const history = useHistory();
  const ref = useRef();
  const { pushHistory } = useCustomNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [delayTime, setDelayTime] = useState(500);

  useEffect(() => {
    const config = localStorage.getItem("appConfig");
    const parsedConfig = JSON.parse(config);

    if (parsedConfig?.GlobalSearchDelayTime) {
      setDelayTime(Number(parsedConfig?.GlobalSearchDelayTime));
    }
    if (getAppConfig("GLOBAL_SEARCH_DELAY_TIME")) {
      setDelayTime(getAppConfig("GLOBAL_SEARCH_DELAY_TIME"));
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      // Make sure we have a value (user has entered something in input)

      if (props.searchValue && props.searchValue.slice(-1) != " ") {
        setIsLoading(true);
        const apiURL = config.api.sugesstionSearch;
        // Fire off our API call
        callAPI
          .get(apiURL, { search: window.btoa(props.searchValue.toLowerCase()) })
          .then((response) => {
            // console.log(response.status) --> 401
            setIsLoading(false);
            return response.json();
          })
          .then((response) => {
            response = cleanSearchData(response);
            if (response) {
              setSearchValueResults(response);
              setIsDropdownOpen(true);
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setSearchValueResults([]);
            setIsLoading(false);
          });
      } else {
        if (props.searchValue.slice(-1) != " ") {
          setSearchValueResults([]);
        }
      }
    }, delayTime);
    return () => clearTimeout(handler);
  }, [props.searchValue]);

  function handleListItemClick(item) {
    const searchItem = item.text.toLowerCase();

    props.setSearchValue("");
    setIsDropdownOpen(false);
    pushHistory(`/search-results?search=${searchItem}`, {
      type: item?.type,
    });
  }
  function cleanSearchData(d) {
    let included = [];
    return (d.data || [])
      .reduce(
        (a, c) => [
          ...a,
          !included.includes(c.text) ? (included.push(c.text), c) : null,
        ],
        []
      )
      .filter((x) => x);
  }
  UseOutsideClick(ref, () => {
    setIsDropdownOpen(!isDropdownOpen);
  });

  const ProductsRender = (searchValueResults) =>
    searchValueResults.productss && searchValueResults.productss !== "" ? (
      <>
        {searchValueResults.value.productss.map((item, index) => (
          <div
            className="search-dropdown-content-tile"
            key={index}
            style={{
              borderBottom:
                index === searchValueResults.length - 1
                  ? "0pt solid #e9e9e9"
                  : "",
            }}
            onClick={() => handleListItemClick(item)}
          >
            {(item.title || item.text) != "NEWS & PRESS RELEASE" ? (
              <Text type="semi-bold">{`${(item.title || item.text).substring(
                0,
                40
              )}`}</Text>
            ) : null}
          </div>
        ))}
      </>
    ) : null;
  const shopRender = (searchValueResults) =>
    searchValueResults.shopss && searchValueResults.shopss !== "" ? (
      <>
        {searchValueResults.value.shopss.map((item, index) => (
          <div
            className="search-dropdown-content-tile"
            key={index}
            style={{
              borderBottom:
                index === searchValueResults.length - 1
                  ? "0pt solid #e9e9e9"
                  : "",
            }}
            onClick={() => handleListItemClick(item)}
          >
            {(item.title || item.text) != "NEWS & PRESS RELEASE" ? (
              <Text type="semi-bold">{`${(item.title || item.text).substring(
                0,
                40
              )}`}</Text>
            ) : null}
          </div>
        ))}
      </>
    ) : null;
  const serviceRender = (searchValueResults) =>
    searchValueResults.services_v3s &&
    searchValueResults.services_v3s !== "" ? (
      <>
        {searchValueResults.value.services_v3s.map((item, index) => (
          <div
            className="search-dropdown-content-tile"
            key={index}
            style={{
              borderBottom:
                index === searchValueResults.length - 1
                  ? "0pt solid #e9e9e9"
                  : "",
            }}
            onClick={() => handleListItemClick(item)}
          >
            {(item.title || item.text) != "NEWS & PRESS RELEASE" ? (
              <Text type="semi-bold">{`${(item.title || item.text).substring(
                0,
                40
              )}`}</Text>
            ) : null}
          </div>
        ))}
      </>
    ) : null;
  const newsRender = (searchValueResults) =>
    searchValueResults["gs-pages"] && searchValueResults["gs-pages"] !== "" ? (
      <>
        {searchValueResults["gs-pages"]
          .filter((s) => "NEWS & PRESS RELEASE" !== s.title)
          .filter((x) => x)
          .map((item, index) => (
            <div
              className="search-dropdown-content-tile"
              key={index}
              style={{
                borderBottom:
                  index === searchValueResults.length - 1
                    ? "0pt solid #e9e9e9"
                    : "",
              }}
              onClick={() => handleListItemClick(item)}
            >
              <Text type="semi-bold">{`${
                "NEWS & PRESS RELEASE" ||
                "Efficient Travel Choices" === (item.title || item.text).trim()
                  ? item.subtitle[0] ||
                    (item.title || item.text).substring(0, 40)
                  : (item.title || item.text).substring(0, 40)
              }`}</Text>
            </div>
          ))}
      </>
    ) : null;

  const renderList = function (list) {
    return list.map((item, index) => (
      <div
        className="search-dropdown-content-tile"
        key={index}
        style={{
          borderBottom:
            index === searchValueResults.length - 1 ? "0pt solid #e9e9e9" : "",
        }}
        onClick={() => handleListItemClick(item)}
      >
        <Text type="semi-bold">{`${item.text}`}</Text>
      </div>
    ));
  };

  const configRender = {
    productss: ProductsRender,
    shopss: shopRender,
    services_v3s: serviceRender,
    "gs-pages": newsRender,
    generic: renderList,
  };

  return (
    <>
      {isDropdownOpen && searchValueResults.length ? (
        <div className="search-dropdown-content" ref={ref}>
          {isLoading ? (
            <div className="search-dropdown-content-tile">
              <Loader height={"200px"} />
            </div>
          ) : (
            configRender.generic(searchValueResults)
          )}
        </div>
      ) : (
        <>{isDropdownOpen ? <>{props.searchValue ? null : null}</> : null}</>
      )}
    </>
  );
};

export default AutoSugesstion;
