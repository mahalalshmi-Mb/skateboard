import React, { Fragment, useEffect } from "react";
import { callAppConfigApi } from "../../commons/util/appConfigHelper";

const LoadEnv = (props) => {
  useEffect(() => {
    //on app load
    configureAppConfig();
  }, []);

  const configureAppConfig = async () => {
    const apiCalled = await callAppConfigApi();
    if (apiCalled) {
      props.setIsEnvLoaded(true);
    }
  };
  return <Fragment>{props.children}</Fragment>;
};

export default LoadEnv;
