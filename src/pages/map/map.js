import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { getAppConfig } from "commons/util/appConfigHelper";
import PushAlert from "components/atoms/pushAlert";
import Loader from "components/atoms/loader";

const Map = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    getMapUrl();
  }, []);

  const getMapUrl = () => {
    try {
      const url = getAppConfig("MAP_URL") || "";
      if (url && url !== "") {
        setMapUrl(url);
        setIsLoading(false);
      } else {
        PushAlert.error("Map not available at the moment");
        history.goBack();
      }
    } catch (e) {
      PushAlert.error("Map not available at the moment");
      history.goBack();
    }
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <Wrapper>
        <iframe
          title="JFK T8"
          width="100%"
          height="100%"
          src={mapUrl}
          allow="clipboard-read; clipboard-write; accelerometer; geolocation; gyroscope; web-share"
          style={{ border: "none", overflow: "auto" }}
        />
      </Wrapper>
    );
  }
};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default Map;
