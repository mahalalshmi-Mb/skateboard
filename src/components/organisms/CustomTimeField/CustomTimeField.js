import { Box, styled } from "@mui/material";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import React from "react";
import Text from "../../atoms/Text";

const StyledTimeField = styled(TimeField)(() => ({
  width: "68px",
  height: "32px",
  border: "none",
  backgroundColor: "rgba(240, 243, 247, 1)",
  borderRadius: "5px",
  "& .MuiOutlinedInput-root": {
    padding: "0px", // Adjust padding if needed
    "& fieldset": {
      border: "none", // Remove the border
    },
    "& input": {
      textAlign: "center", // Optional: center the text if needed
      padding: "5px", // Adjust padding if needed
    },
  },
  "& .MuiInputBase-root": {
    fontFamily: "Manrope",
    fontSize: "16px",
    fontWeight: 400,
  },
}));

const CustomTimeFieldActionBar = ({
  timeValue,
  onTimeChange,
  disabled,
  timeSteps,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "10px 16px",
      }}
    >
      <Text type="medium">Time</Text>
      <StyledTimeField
        disabled={disabled}
        value={timeValue}
        onChange={onTimeChange}
        format="HH:mm"
        formatDensity="spacious"
        minutesStep={timeSteps ? timeSteps : 1}
      />
    </Box>
  );
};

export default CustomTimeFieldActionBar;
