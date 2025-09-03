import { createTheme, ThemeProvider } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "util/momentWrapper";

import { dateTimeFormats } from "config/dateTimeConfig";
import "./style.css";
import { colors } from "theme/colors";

const theme = createTheme({
  typography: {
    fontFamily: "Manrope",
  },
});

const CustomDesktopDatePicker = (props) => {
  const {
    value,
    label,
    isEdit,
    slots,
    slotProps,
    disabled,
    handleOnChange,
    isOpen,
    setIsOpen,
    TextFieldComponent,
    logo,
  } = props;

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={AdapterMoment}
        adapterLocale="en-gb"
        localeText={{
          dayOfWeekFormatter: (day) =>
            day.format(dateTimeFormats.date.shortWeekday).toUpperCase(),
        }}
      >
        <DesktopDatePicker
          value={value ? moment(value) : null}
          disabled={disabled}
          onAccept={(value) => {
            handleOnChange(value);
          }}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onOpen={() => setIsOpen(true)}
          slots={{ ...slots, textField: TextFieldComponent }}
          slotProps={{
            ...slotProps,
            textField: {
              label,
              valueLabel: moment(value).format("llll"),
              logo: logo,
              bottomDrawer: false,
              desktopPicker: true,
              setDesktopPickerIsOpen: setIsOpen,
              isEdit: isEdit,
              labelOnly: true,
              disabled,
            },
            actionBar: {
              sx: {
                "& .MuiButton-root": {
                  color: colors?.primary,
                  fontWeight: 800,
                  fontFamily: "Manrope",
                },
              },
            },
            day: {
              sx: {
                "&.MuiButtonBase-root": {
                  color: colors?.text?.black900,
                  fontFamily: "Manrope",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                },
                "&.Mui-selected": {
                  backgroundColor: colors?.primary,
                  color: colors?.text?.white900,
                  "&:hover": {
                    backgroundColor: colors?.primary,
                    color: colors?.text?.white900,
                  },
                  "&:focus": {
                    backgroundColor: colors?.primary,
                    color: colors?.text?.white900,
                  },
                },
              },
            },
            calendarHeader: {
              sx: {
                "& .MuiPickersCalendarHeader-label": {
                  color: colors?.text?.black900,
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "14px",
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default CustomDesktopDatePicker;
