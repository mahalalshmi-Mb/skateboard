import { useContext, useState } from "react";
import { createTheme } from "@mui/material";
import moment from "util/momentWrapper";
import PushAlert from "../../../components/atoms/pushAlert";
import Text from "../../../components/atoms/Text";
import { CartContext } from "../../../context/cartContext";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../util/storageUtil";
import {
  initialSlotBuffer,
} from "../../edpFSTR/pages/config/config";
import { colors } from "theme/colors";
import Styled from "styled-components";
import CustomDesktopDateTimePicker from "components/organisms/DesktopDateTimePicker/CustomDesktopDateTimePicker";

function TakeawaySummary(props) {
  const ClientCart = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleOnChange = (data) => {
    let selectedDay = data;

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
      if (sessData.deliveryOptions) {
        sessData.deliveryOptions.deliveryTime = selDateTime;
        sessData.deliveryOptions.isScheduled = true;
        ClientCart.updateFnbItemDelTime(selDateTime, true);
      }
      setSessionStorage("productsData", sessData);
      props.setValue(selectedDay);
    }
  };

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
      return customWidth * 0.45 
    } else {
      return customWidth * 0.25; 
    }
  };

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
            marginTop: "-56px",
          },
        },
      },
    },
  });



  return (
    <>
      <Wrapper>
        <TimeSection>
          <TimeHeaderContainer>
            <TimeInfo>
              <Text>Takeaway</Text>
              <Text type="bold">
                {`Scheduled for ${moment(props?.value).format("ddd DD MMM, HH:mm")}`}
              </Text>
            </TimeInfo>
            <ChangeButton onClick={() => setIsOpen(!isOpen)} id="trigger">
              <Text type="bold">Change</Text>
            </ChangeButton>
          </TimeHeaderContainer>
        </TimeSection>
      </Wrapper>
      {isOpen && (
        <CustomDesktopDateTimePicker
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleOnChange={handleOnChange}
          timeSteps={15}
          value={props?.value}
          ampmFormat={false}
          customTheme={customTheme}
        />
      )}
    </>
  );
}

const Wrapper = Styled.div`
  width: 100%;
  margin-top: 8px;
`;

const TimeSection = Styled.div`
  background: ${colors?.primaryForeground};
  border: 1px solid ${colors?.border};
  border-radius: 8px;
  padding: 16px;
  position: relative;
  z-index: 1;
`;

const TimeHeaderContainer = Styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TimeInfo = Styled.div`
  font-weight: 800;
  font-size: 16px;
  line-height: 21px;
  color: ${colors?.text?.black200};
`;

const ChangeButton = Styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: ${colors?.text?.actionTextColor};
  cursor: pointer;
`;

export default TakeawaySummary;
