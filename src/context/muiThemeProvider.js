import React from "react";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The properties to apply
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  },
});

const MuiThemeProviderContainer = (props) => {
  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
};

export default MuiThemeProviderContainer;
