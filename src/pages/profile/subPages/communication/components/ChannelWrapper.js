import React, { useState } from "react";

import { Switch } from "@mui/material";
import styled from "styled-components";
import ArrowRight from "../../../../../assets/images/profile/ArrowRightBlack.svg";
import { capitalize } from "../../../../../commons/util/helperFunctions";
import Text from "../../../../../components/atoms/Text";
import { colors } from "theme/colors";

const ChannelWrapper = (props) => {
  const [expanded, setExpanded] = useState(false);
  const handleChange = (segment, currentFlag) => {
    props.handleChange(props.data.channel, segment, !currentFlag);
  };
  return (
    <OptionsContainer>
      <OptionsWrapper onClick={() => setExpanded(!expanded)}>
        <OptionTitle>
          <Text type="semi-bold">{props.data.channel.toUpperCase()}</Text>
        </OptionTitle>

        <RightArrow src={ArrowRight} expanded={expanded} />
      </OptionsWrapper>
      <AccordionContentWrapper expanded={expanded}>
        {props.data.segments?.map((segment) => (
          <OptionsSubWrapper
            onClick={() => handleChange(segment.segment, segment.selection)}
          >
            <OptionSubTitle>
              <Text type="semi-bold">{capitalize(segment.segment)}</Text>
            </OptionSubTitle>

            <CustomSwitch
              checked={segment.selection}
              inputProps={{ "aria-label": "controlled" }}
            />
          </OptionsSubWrapper>
        ))}
      </AccordionContentWrapper>
    </OptionsContainer>
  );
};

export default ChannelWrapper;

const CustomSwitch = (props) => {
  return (
    <ToggleSwitch
      checked={props.checked}
      onChange={props.handleChange}
      inputProps={{ "aria-label": "controlled" }}
    />
  );
};

const ToggleSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#FFFFFF",
  },
  // Track color when checked
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: `${colors?.primary}`, // The teal color for the unchecked state
    opacity: 1, // Ensure it's solid and not transparent
  },
}));

const RightArrow = styled.img`
  width: 20px;
  height: 20px;
  transform: ${({ expanded }) =>
    expanded ? "rotate(-90deg)" : "rotate(90deg)"};
`;

const OptionsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0px 26px;
`;

const OptionsContainer = styled.div`
  width: 100%;
  margin-top: 30px;
`;

const OptionTitle = styled.div`
  font-size: 16px;
  line-height: 21px;
  color: #273135;
`;

const AccordionContentWrapper = styled.div`
  height: ${({ expanded }) => (expanded ? "auto" : 0)};
  overflow: hidden;
  transition: height ease 0.2s;
`;

const OptionsSubWrapper = styled(OptionsWrapper)`
  width: 100%;
  transition: height ease 0.2s;
  margin-top: 12px;
  padding-right: 14px;
`;

const OptionSubTitle = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: #273135;
  opacity: 0.8;
`;
