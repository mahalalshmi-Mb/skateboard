import React, { useState } from 'react';

const SnackbarContext = React.createContext();

const SnackbarProvider = (props) => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [duration, setDuration] = useState(5000);

  const showMessage = (message, duration) => {
    setMessage(message);
    setVisible(true);

    if (duration) setDuration(duration);
    else setDuration(5000);
  };

  return (
    <SnackbarContext.Provider
      value={{
        message,
        setMessage,
        visible,
        setVisible,
        showMessage,
        duration,
        setDuration,
      }}
    >
      {props.children}
    </SnackbarContext.Provider>
  );
};

export { SnackbarContext, SnackbarProvider };
