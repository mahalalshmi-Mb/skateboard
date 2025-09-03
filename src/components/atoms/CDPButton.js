import React from "react";
import Util from "../../commons/util/util";
import { useHistory } from "react-router-dom";
import useCustomNavigation from "../../hooks/useCustomNavigation";

export default function CDPButton({
  children,
  onClick,
  redirectLink,
  redirectState,
  isExternal,
}) {
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();

  const redirect = () => {
    if (isExternal) {
      window.open(redirectLink, "_blank");
    } else {
      if (redirectState) {
        pushHistory(redirectLink, redirectState);
      } else {
        pushHistory(redirectLink);
      }
    }
  };

  const handleClick = () => {
    const eventData = onClick();

    if (eventData?.event_name) {
      const event_name = eventData.event_name;
      const event_data = eventData.event_data;
      Util.sendMessageToReactNative(event_name, event_data);
    }

    if (redirectLink) {
      redirect();
    }
  };

  return (
    <div
      style={{
        all: "inherit",
        margin: 0,
        padding: 0,
      }}
      onClick={() => {
        handleClick();
      }}
    >
      {children}
    </div>
  );
}
