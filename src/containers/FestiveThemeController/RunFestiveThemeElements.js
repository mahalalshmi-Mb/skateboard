import React, { Fragment } from "react";
import { FestiveComponents } from "./FestiveComponents";
import { currentFestiveTheme } from "./festiveThemingUtil";

const RunFestiveThemeElements = (props) => {
  return (
    <Fragment>
      {currentFestiveTheme() && props.page && props.component && props.asset
        ? FestiveComponents[`${currentFestiveTheme()}`][`${props.page}`][
            `${props.component}`
          ][`${props.asset}`] || props.default
        : props.default}
    </Fragment>
  );
};

export default RunFestiveThemeElements;
