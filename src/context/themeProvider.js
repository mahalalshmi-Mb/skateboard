import { Fragment, useEffect, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { useTheme } from "../hooks/useTheme";
import { GlobalStyles } from "../theme/globalStyleSheet";

const ThemeProvider = (props) => {
  const { theme, themeLoaded } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState();

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  return (
    <Fragment className="App">
      {themeLoaded && (
        <StyledThemeProvider theme={selectedTheme}>
          <GlobalStyles />
          {props.children}
        </StyledThemeProvider>
      )}
    </Fragment>
  );
};

export default ThemeProvider;
