import { createTheme } from "@mui/material";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { dateTimeFormats } from "config/dateTimeConfig";
import { useConfig } from "context/configContext";
import { useContext, useEffect, useRef, useState } from "react";
import Styled from "styled-components";
import moment from "util/momentWrapper";
import { device } from "../../../../commons/util/helperFunctions";
import Text from "../../../../components/atoms/Text";
import CustomCheckbox from "../../../../components/atoms/customCheckbox";
import PushAlert from "../../../../components/atoms/pushAlert";
import CustomDesktopDateTimePicker from "../../../../components/organisms/DesktopDateTimePicker/CustomDesktopDateTimePicker";
import { CartContext } from "../../../../context/cartContext";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import ScheduledOrderImage from "../../assets/scheduledOrder.svg";
import ScheduleOrderMeal from "../../../../../src/assets/images/takeaway/ScheduleOrderMeal.svg";
import {
  initialDatePosition,
  initialSlotBuffer,
  maxDate,
} from "../../pages/config/config";
import { colors } from "theme/colors";

const roundToNextHalfHour = (date) => {
  date.setMinutes(date.getMinutes() + 30);

  const minutes = date.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;

  date.setMinutes(roundedMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};

const ScheduledOrderPicker = (props) => {
  const { userTimezone, timezone } = useConfig();
  const ClientCart = useContext(CartContext);

  let dateTimePickerRef = useRef();
  const [checked, setChecked] = useState(
    getSessionStorage("productsData")?.deliveryOptions?.isScheduled
      ? true
      : false
  );
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState();
  const [initialValue, setInitialValue] = useState();

  useEffect(() => {
    if (!value && isOpen) {
      const currentTimeRounded = roundToNextHalfHour(new Date());
      setInitialValue(currentTimeRounded);
    }
  }, [isOpen]);

  const handleOnChange = (data) => {
    let selectedDay = data[0];
    if (data && data[0] === "Today") {
      selectedDay = moment().set({
        hour: data[1],
        minute: data[2],
      });
    } else {
      selectedDay = data;
    }

    if (selectedDay.isBefore(moment().add(initialSlotBuffer, "minutes"))) {
      PushAlert.error(
        `Please select a time which is at least ${initialSlotBuffer}mins from current time`
      );
      return;
    } else {
      let sessData = JSON.parse(
        JSON.stringify(getSessionStorage("productsData"))
      );
      let selDateTime = moment(selectedDay, "UTC", "UTC").format();
      if (sessData?.deliveryOptions) {
        sessData.deliveryOptions.deliveryTime = selDateTime;
        sessData.deliveryOptions.isScheduled = true;
        ClientCart.updateFnbItemDelTime(selDateTime, true);
        setChecked(true);
      }
      setSessionStorage("productsData", sessData);
      props.setValue(selectedDay);
      setValue(selDateTime);
    }
  };

  const handleChange = (event) => {
    if (!event.target.checked) {
      let sessData = JSON.parse(
        JSON.stringify(getSessionStorage("productsData"))
      );
      let currDateTime = moment(new Date(), "UTC", "UTC").format();
      if (sessData?.deliveryOptions) {
        sessData.deliveryOptions.deliveryTime = currDateTime;
        sessData.deliveryOptions.isScheduled = false;
        ClientCart.updateFnbItemDelTime(currDateTime, false);
        props.setValue(currDateTime);
      }
      setSessionStorage("productsData", sessData);
      setChecked(false);
      setIsOpen(false);
      setValue(currDateTime);
    } else {
      setChecked(true);
      setIsOpen(true);
      setValue();
    }
  };

  const GreenSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#FFFFFF",
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      background: "linear-gradient(180deg, #303C41 0%, #076066 100%)",
    },
  }));

  const getDynamicWidth = (width) => {
    let customWidth = window.innerWidth * 0.5;
    if (width <= 320) {
      return customWidth * 1.25;
    } else if (width <= 375) {
      return customWidth * 1.28;
    } else if (width <= 425) {
      return customWidth * 1.3;
    } else if (width <= 768) {
      return customWidth * 0.8;
    } else if (width <= 1024) {
      return customWidth * 0.6;
    } else if (width <= 1440) {
      return customWidth * 0.45;
    } else {
      return customWidth * 0.25;
    }
  };

  // Custom Theme
  const customTheme = createTheme({
    typography: {
      fontFamily: "Manrope",
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            visibility: "hidden",
          },
        },
      },
      MuiDateCalendar: {
        styleOverrides: {
          root: {
            width: `${getDynamicWidth(window.innerWidth)}px`,
          },
        },
      },
      MuiPickersLayout: {
        styleOverrides: {
          root: {
            marginTop: getSessionStorage("productsData")?.deliveryOptions
              ?.isScheduled
              ? "0px"
              : "-56px",
          },
        },
      },
    },
  });

  return (
    <>
      <BannerWrapper
        borderRadius={
          checked ||
          getSessionStorage("productsData")?.deliveryOptions?.isScheduled
            ? "8px 8px 0px 0px"
            : "8px"
        }
      >
        <BannerTitleContainer>
          <BannerTitleWrapper>
            <div
              id="trigger"
              ref={dateTimePickerRef}
              style={props.triggerStyle}
            >
              <ScheduledOrderCheckbox>
                <CustomCheckbox
                  handleChange={(e) => {
                    handleChange(e);
                    if (e.target.checked) {
                      setIsOpen(true);
                      setValue();
                    } else {
                      setIsOpen(false);
                    }
                  }}
                  ariaLabel={"Terms & Conditions"}
                  checked={
                    getSessionStorage("productsData")?.deliveryOptions
                      ?.isScheduled
                  }
                  unCheckedColor={colors?.text?.white900}
                  checkedColor={colors?.text?.white900}
                />
              </ScheduledOrderCheckbox>
            </div>
            <SwitchContainer>
              <div
                id="trigger"
                ref={dateTimePickerRef}
                style={props.triggerStyle}
              >
                <CustomCheckbox
                  handleChange={(e) => {
                    handleChange(e);
                    if (e.target.checked) {
                      setIsOpen(true);
                      setValue();
                    } else {
                      setIsOpen(false);
                    }
                  }}
                  ariaLabel={"Terms & Conditions"}
                  checked={
                    getSessionStorage("productsData")?.deliveryOptions
                      ?.isScheduled
                  }
                  unCheckedColor={colors?.text?.white900}
                  checkedColor={colors?.text?.white900}
                />
              </div>
            </SwitchContainer>
            <BannerTitleText>
              <Text>I want to pre-order my meal</Text>
            </BannerTitleText>
          </BannerTitleWrapper>
        </BannerTitleContainer>
        <BannerSubTitle>
          <Text>Order now, pick it up later, at your convenience</Text>
        </BannerSubTitle>
        {window.innerWidth > 768 && (
          <IllustrationImageContainer>
            <IllustrationImage
              src={ScheduleOrderMeal}
              alt="scheduled-order-image"
            />
          </IllustrationImageContainer>
        )}
      </BannerWrapper>
      {isOpen ? (
        <CustomDesktopDateTimePicker
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleOnChange={handleOnChange}
          timeSteps={15}
          value={value}
          initialValue={initialValue}
          ampmFormat={false}
          customTheme={customTheme}
        />
      ) : null}
      {getSessionStorage("productsData")?.deliveryOptions?.isScheduled ? (
        <SelectedTimeWrapper style={{ marginTop: isOpen ? "-56px" : "0px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <SelectedTimeValue>
              <Text type="bold">
                {`${moment(
                  getSessionStorage("productsData")?.deliveryOptions
                    ?.deliveryTime
                ).format("ddd DD MMM, HH:mm")}`}
              </Text>
            </SelectedTimeValue>
            <div onClick={() => setIsOpen(!isOpen)} id="trigger">
              <ActionText>
                <Text type="bold">Change slot</Text>
              </ActionText>
            </div>
          </div>
          {/* {userTimezone !== timezone && (
            <NoteTextWrapper>
              <Text>Time shown is in Los Angeles timezone (PST/PDT)</Text>
            </NoteTextWrapper>
          )} */}
        </SelectedTimeWrapper>
      ) : null}
    </>
  );
};

const BannerWrapper = Styled.div`
  width: 100%;
  padding: 16px;
  background-color: ${colors?.primary};
  border: ${`1px solid ${colors?.primary}`};
  border-radius: ${(props) => props.borderRadius || "8px"};
  position: relative;
  z-index: 9;
`;

const BannerTitleContainer = Styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const BannerTitleWrapper = Styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const BannerTitleText = Styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 25px;
  color: ${colors?.text?.white900};
`;

const BannerSubTitle = Styled.div`
  max-width: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  color: ${colors?.text?.white900};
  opacity: 0.8;
`;

const IllustrationImageContainer = Styled.div`
  position: absolute;
  bottom: 0px;
  right: 16px;
  display: block; 
`;

const IllustrationImage = Styled.img``;

const SelectedTimeWrapper = Styled.div`
  margin-top: 0px;
  width: 100%;
  background: ${colors?.primaryForeground};
  border: ${`1px solid ${colors?.border}`};
  border-radius: 0px 0px 8px 8px;
  padding: 16px;
  position: relative;
  z-index: 1;

  align-items: center;
  justify-content: space-between;
`;

const NoteTextWrapper = Styled.div`
  margin-top: 8px;
`;

const SelectedTimeValue = Styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  color: ${colors?.text?.black200};
`;

const ActionText = Styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: ${colors?.text?.actionTextColor};
  cursor: pointer;
`;
const SwitchContainer = Styled.div`
  display: block;

  @media ${device.laptop} {
    display: none;
  }
`;
const ScheduledOrderCheckbox = Styled.div`
  display: none;

  @media ${device.laptop} {
    display: block;
  }
`;
export default ScheduledOrderPicker;
