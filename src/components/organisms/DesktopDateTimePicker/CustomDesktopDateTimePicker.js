import { createTheme, ThemeProvider } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "util/momentWrapper";
import { datePickerConfig } from "./config";
import CustomTimeFieldActionBar from "../CustomTimeField/CustomTimeField";
import { colors } from "theme/colors";

const defaultTheme = createTheme({
  typography: {
    fontFamily: colors?.font?.primary,
  },
});

const CustomDesktopDateTimePicker = (props) => {
  const {
    value,
    initialValue,
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
    textFieldProps,
    timeSteps,
    views,
    useTimeField,
    valueLabel,
    handleTimeChange,
    handleOnClose,
    ampmFormat,
    customTheme,
  } = props;

  // Function to check if the selected date is today
  const isToday = (date) => {
    return moment(date).isSame(currentDateTime, "day");
  };
  const currentDateTime = moment();

  return (
    <ThemeProvider theme={customTheme || defaultTheme}>
      <LocalizationProvider
        dateAdapter={AdapterMoment}
        adapterLocale="en-gb"
        localeText={{
          dayOfWeekFormatter: (day) => day.format("ddd").toUpperCase(),
        }}
      >
        <DesktopDateTimePicker
          value={
            value ? moment(value) : initialValue ? moment(initialValue) : null
          }
          disabled={disabled}
          onChange={(value) => handleOnChange(value)}
          views={views || ["day", "hours", "minutes"]} // Disable the year view
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            if (!value && initialValue) {
              handleOnChange(moment(initialValue));
            } else {
              handleOnClose && handleOnClose();
            }
          }}
          onOpen={() => setIsOpen(true)}
          timeSteps={{ minutes: timeSteps || 30 }} // Show 30-minute intervals
          minDate={initialValue ? moment(initialValue) : currentDateTime}
          minTime={
            isToday(value) ? moment(initialValue) || currentDateTime : null
          }
          slots={{
            ...slots,
            textField: TextFieldComponent,
            actionBar: useTimeField ? CustomTimeFieldActionBar : null,
          }}
          ampm={ampmFormat || false}
          slotProps={{
            ...slotProps,
            textField: {
              label,
              valueLabel:
                valueLabel || moment(value).format(datePickerConfig.dateFormat),
              logo: logo,
              bottomDrawer: false,
              desktopPicker: true,
              setDesktopPickerIsOpen: setIsOpen,
              isEdit: isEdit,
              labelOnly: true,
              disabled,
              ...textFieldProps,
            },
            actionBar: {
              timeValue: moment(value),
              onTimeChange: handleTimeChange,
              disabled,
              timeSteps,
              sx: {
                "& .MuiButton-root": {
                  color: colors?.primary,
                  fontWeight: 800,
                  fontFamily: colors?.font?.primary,
                },
              },
            },
            day: {
              sx: {
                "&.MuiButtonBase-root": {
                  color: colors?.text?.black900,
                  fontFamily: colors?.font?.primary,
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
            digitalClockSectionItem: {
              sx: {
                "&.MuiButtonBase-root": {
                  color: colors?.text?.black900,
                  fontFamily: colors?.font?.primary,
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
                },
              },
            },
            calendarHeader: {
              sx: {
                "& .MuiPickersCalendarHeader-label": {
                  color: colors?.text?.black900,
                  fontFamily: colors?.font?.primary,
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

export default CustomDesktopDateTimePicker;
