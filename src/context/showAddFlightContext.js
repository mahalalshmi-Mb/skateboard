import React, { useState } from 'react';

const ShowAddFlightContext = React.createContext();

const ShowAddFlightProvider = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ShowAddFlightContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {props.children}
    </ShowAddFlightContext.Provider>
  );
};

export { ShowAddFlightProvider, ShowAddFlightContext };
