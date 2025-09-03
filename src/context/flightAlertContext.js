import React, { useState } from 'react';

const FlightAlertContext = React.createContext();

const FlightAlertProvider = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [flightDetails, setFlightDetails] = useState({
    flightName: '',
    flightId: '',
    flightStatus: '',
    scheduledTime: '',
    estimatedTime: '',
    gate: '',
    belt: '',
    notificationMethod: ['', ''],
    user: {
      email: '',
      mobile: '',
      userId: '',
    },
  });
  const [callback, setCallback] = useState();

  const openFlightAlert = (flightData) => {
    setFlightDetails(flightData);
    setIsOpen(true);
  };

  const closeFlightAlert = () => {
    setIsOpen(false);
  };

  return (
    <FlightAlertContext.Provider
      value={{
        isOpen,
        setIsOpen,
        flightDetails,
        setFlightDetails,
        openFlightAlert,
        closeFlightAlert,
        callback,
        setCallback,
      }}
    >
      {props.children}
    </FlightAlertContext.Provider>
  );
};

export { FlightAlertProvider, FlightAlertContext };
