import { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { ENV , WEBSOCKET_URL} from "../commons/config";
import { getLocalStorage } from "../util/storageUtil";

const useWebsocket = (target, category, metadata) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [latestData, setLatestData] = useState();

  useEffect(() => {
    ENV === "DEV" &&
      console.log("Websocket key in hook:", target, category, metadata);

    const userInfo = getLocalStorage("userData");
    const client = new W3CWebSocket(WEBSOCKET_URL, [], {
      headers: { userId: userInfo.data.userId },
    });

    client.onopen = () => {
      if (!isRegistered) {
        client.send(
          JSON.stringify({
            action: "register",
            userId: userInfo.data.userId,
          })
        );
      }
    };

    client.onmessage = (message) => {
      handleMessage(message);
    };
  }, []);

  const handleMessage = (message) => {
    const responseFromWebsocket = JSON.parse(message.data);
    let status = responseFromWebsocket.status;

    ENV === "DEV" && console.log({ responseFromWebsocket });

    if (status === 201) {
      setIsRegistered(true);
    }

    if (
      status === 200 &&
      responseFromWebsocket.metadata.target === target &&
      responseFromWebsocket.data.type === category
    ) {
      setHistoricalData((data) => [...data, responseFromWebsocket]);
      setLatestData(responseFromWebsocket);
    }
  };

  return {
    historicalData,
    latestData,
    isRegistered,
  };
};

export default useWebsocket;
