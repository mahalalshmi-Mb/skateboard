const domain = window.location.href;

const laxColors = {
  primary: "#00a6ce",
  primaryForeground: "#ffffff",
  primaryHover: "#017592",

  secondary: "#ffffff",
  secondaryForeground: "#00a6ce",
  secondaryHover: "#f3f4f6",
  secondaryLightForeground: "#D9EAFF",

  tertiary: "#ffffff",
  tertiaryForeground: "#017e9b",
  tertiaryHover: "#f3f4f6",

  background: "#ffffff",
  foreground: "#00a6ce",

  input: "#ffffff",
  border: "#DCDCDC",

  text: {
    primaryText: "#1A1A1A",
    secondaryText: "#888888",
    tertiaryText: "#ffffff",
    primaryLightText: "#1E1E1E",
    actionTextColor: "#00a6ce",
    actionTextColorSecondary: "#ffffff",
    errorText: "#DA272E",

    black200: "#1A1A1A",
    black300: "#333333",
    black900: "#000000",

    gray200: "#595959",
    gray300: "#717171",
    gray400: "#ACACAC",
    gray500: "#c9c9c9",
    gray900: "#808080",

    white900: "#ffffff",
  },
  state: {
    success: "#16A34A",
    warning: "#EA670C",
    error: "#DA272E",
  },
  button: {
    primaryBackground: "#00a6ce",
    primaryText: "#ffffff",
  },
  pageBackground: {
    primary: "#ffffff",
    secondary: "#f7f7f7",
  },
  font: {
    primary: "Poppins",
    secondary: "Poppins",
    fallback: "sans-serif",
  },
  floatCard: {
    background: "#16A34A",
    text: "#ffffff",
    border: "#16A34A",
  },
};

const jfkColors = {
  primary: "#022DB7",
  primaryForeground: "#ffffff",
  primaryHover: "#003264",

  secondary: "#ffffff",
  secondaryForeground: "#1E9FOC",
  secondaryHover: "#f3f4f6",

  tertiary: "#ffffff",
  tertiaryForeground: "#1E9FOC",
  tertiaryHover: "#f3f4f6",

  background: "#ffffff",
  foreground: "#022DB7",

  input: "#ffffff",
  border: "#DCDCDC",

  text: {
    primaryText: "#1A1A1A",
    secondaryText: "#888888",
    tertiaryText: "#ffffff",
    primaryLightText: "#1E1E1E",
    actionTextColor: "#022DB7",
    actionTextColorSecondary: "#ffffff",
    errorText: "#DA272E",

    black200: "#1A1A1A",
    black300: "#333333",
    black900: "#000000",

    gray200: "#545456",
    gray300: "#545456",
    gray400: "#545456",
    gray500: "#545456",
    gray600: "#EFEFEF",
    gray900: "#545456",

    white100: "#FFFFFF",
    white200: "#FFFFFF",
    white300: "#ffffff",
    white900: "#FFFFFF",
  },
  state: {
    success: "#16A34A",
    warning: "#EA670C",
    error: "#DA272E",
  },
  button: {
    primaryBackground: "#022DB7",
    primaryText: "#ffffff",
  },
  pageBackground: {
    primary: "#ffffff",
    secondary: "#ffffff",
  },
  font: {
    primary: "Poppins",
    secondary: "Poppins",
    fallback: "sans-serif",
  },
  floatCard: {
    background: "#16A34A",
    text: "#ffffff",
    border: "#16A34A",
  },
};

const cphColors = {
  primary: "#060E4D",
  primaryForeground: "#ffffff",
  primaryHover: "#40658b",

  secondary: "#ffffff",
  secondaryForeground: "#88A8ED",
  secondaryHover: "#f3f4f6",
  secondaryLightForeground: "#D9EAFF",

  tertiary: "#ffffff",
  tertiaryForeground: "#88A8ED",
  tertiaryHover: "#f3f4f6",

  background: "#ffffff",
  foreground: "#060E4D",

  input: "#ffffff",
  border: "#DCDCDC",

  text: {
    primaryText: "#171717",
    secondaryText: "#888888",
    tertiaryText: "#ffffff",
    primaryLightText: "#1E1E1E",
    actionTextColor: "#060E4D",
    actionTextColorSecondary: "#ffffff",
    errorText: "#DA272E",

    black200: "#171717",
    black300: "#333333",
    black800: "#131313",
    black900: "#000000",

    gray200: "#595959",
    gray300: "#707070",
    gray400: "#ACACAC",
    gray500: "#c9c9c9",
    gray600: "#EFEFEF",
    gray800: "#5D5D5D",
    gray900: "#888888",

    white100: "#FCFBFA",
    white200: "#FCFBFA",
    white300: "#ffffff",
    white900: "#FCFBFA",

    blue500: "#4188FF",
    blue600: "#150764",
  },
  state: {
    success: "#16A34A",
    warning: "#EA670C",
    error: "#DA272E",
  },
  button: {
    primaryBackground: "#060E4D",
    primaryText: "#ffffff",
  },
  pageBackground: {
    primary: "#ffffff",
    secondary: "#f7f7f7",
  },
  font: {
    primary: "Frutiger",
    secondary: "CPH",
    fallback: "sans-serif",
  },
  floatCard: {
    background: "#4188FF",
    text: "#150764",
    border: "#ffffff",
  },
};

const phlColors = {
  primary: "#072C62",
  primaryForeground: "#ffffff",
  primaryHover: "#1DA8E0",

  secondary: "#ffffff",
  secondaryForeground: "#1DA8E0",
  secondaryHover: "#f3f4f6",
  secondaryLightForeground: "#D9EAFF",

  tertiary: "#ffffff",
  tertiaryForeground: "#1DA8E0",
  tertiaryHover: "#f3f4f6",

  background: "#ffffff",
  foreground: "#072C62",

  input: "#ffffff",
  border: "#DCDCDC",

  text: {
    primaryText: "#171717",
    secondaryText: "#888888",
    tertiaryText: "#ffffff",
    primaryLightText: "#1E1E1E",
    actionTextColor: "#072C62",
    actionTextColorSecondary: "#ffffff",
    errorText: "#DC2626",

    black200: "#171717",
    black300: "#333333",
    black800: "#131313",
    black900: "#000000",

    gray200: "#595959",
    gray300: "#707070",
    gray400: "#ACACAC",
    gray500: "#c9c9c9",
    gray600: "#EFEFEF",
    gray800: "#5D5D5D",
    gray900: "#888888",

    white100: "#FCFBFA",
    white200: "#FCFBFA",
    white300: "#ffffff",
    white900: "#FCFBFA",

    blue500: "#4188FF",
  },
  state: {
    success: "#16A34A",
    warning: "#EA670C",
    error: "#DC2626",
  },
  button: {
    primaryBackground: "#072C62",
    primaryText: "#ffffff",
  },
  pageBackground: {
    primary: "#ffffff",
    secondary: "#f7f7f7",
  },
  font: {
    primary: "CenturyGothic",
    secondary: "CenturyGothic",
    fallback: "sans-serif",
  },
  floatCard: {
    background: "#16A34A",
    text: "#ffffff",
    border: "#16A34A",
  },
};

export const colors = domain?.toLowerCase()?.includes("lax")
  ? laxColors
  : domain?.toLowerCase()?.includes("jfk")
  ? jfkColors
  : domain?.toLowerCase()?.includes("cph")
  ? cphColors
  : domain?.toLowerCase()?.includes("phl")
  ? phlColors
  : jfkColors;
