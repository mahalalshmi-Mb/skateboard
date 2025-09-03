import React, { useEffect, useState } from "react";
import callAPI from "../../../commons/callAPI";
import config from "../../../commons/config";
import Text from "../../atoms/Text";
import "./WeatherIcon.css";

function WetherFlight(props) {
  const [weatherIcon, setWeatherIcon] = useState();
  const [weatherTemp, setWeatherTemp] = useState();
  const [weatherDescription, setWeatherDescription] = useState();

  const getWeatherInfo = async () => {
    try {
      let apiURL = config.api.weather;
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (apiResponse.status === 200 && regResponse.cod === 200) {
        setWeatherIcon(
          "https://openweathermap.org/img/wn/" +
            regResponse.weather[0].icon +
            ".png"
        );
        setWeatherTemp(parseInt(regResponse.main.temp) + " °C");
        setWeatherDescription(regResponse.weather[0].main);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getWeatherInfo();
  }, []);

  return (
    <div
      className={`weather-link-homepage ${props.weatherBg}`}
      style={{ backgroundColor: props.themeStyle.bgColor }}
    >
      <img src={weatherIcon} className="weather-temp-icon" alt="" />
      <span
        className="weather-temperature"
        style={{
          color: props.enableTheme
            ? props.themeStyle.fontColor
            : props.weatherBg === "weather-bg-white"
            ? { color: "273135" }
            : { color: "#fff" },
          opacity: props.themeStyle.opacity,
        }}
      >
        <Text type="semi-bold">{weatherTemp}</Text>
      </span>

      {/* <span
        style={{
          color: props.enableTheme
            ? props.themeStyle.fontColor
            : props.weatherBg === "weather-bg-white"
            ? { color: "273135" }
            : { color: "#fff" },
          opacity: props.themeStyle.opacity,
        }}
        className="weather-description"
      >
        <Text type="semi-bold">{weatherDescription}</Text>
      </span> */}
    </div>
  );
}

export default WetherFlight;
