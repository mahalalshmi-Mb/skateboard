import React from "react";
import { Provider as AuthProvider } from "./AuthContext";
import { SnackbarProvider } from "./snackbarContext";
import { CookiesProvider } from "react-cookie";
import { BottomDrawerControllerProvider } from "./BottomDrawerController";
import { PremiumServiceProvider } from "./PremiumServiceProvider";
import { FlightAlertProvider } from "./flightAlertContext";
import MuiThemeProviderContainer from "./muiThemeProvider";
import { NavProvider } from "./navContext";
import { ShowAddFlightProvider } from "./showAddFlightContext";
import ThemeProvider from "./themeProvider";

const MainProvider = (props) => {
  return (
    <CookiesProvider>
      <MuiThemeProviderContainer>
        <AuthProvider>
          <FlightAlertProvider>
            <ShowAddFlightProvider>
              <NavProvider>
                <BottomDrawerControllerProvider>
                  <SnackbarProvider>
                    <PremiumServiceProvider>
                      <ThemeProvider>{props.children}</ThemeProvider>
                    </PremiumServiceProvider>
                  </SnackbarProvider>
                </BottomDrawerControllerProvider>
              </NavProvider>
            </ShowAddFlightProvider>
          </FlightAlertProvider>
        </AuthProvider>
      </MuiThemeProviderContainer>
    </CookiesProvider>
  );
};

export default MainProvider;
