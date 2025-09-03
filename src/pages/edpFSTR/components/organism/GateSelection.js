import React from "react";
import styled from "styled-components";
import IllustrationImage from "../../assets/addFlightIllustration.svg";
import Text from "../../../../components/atoms/Text";
import Select from "react-select";
import ScheduledOrderPicker from "./ScheduledOrderPicker";
import { defaultDatePickerTime } from "../../pages/config/config";
import { device } from "../../../../commons/util/helperFunctions";
import FlightCard from "../../../../components/organisms/FlightCard/FlightCard";
import { PrimaryButton } from "../../../../theme/globalStyleSheet";
import BackArrowWhite from "../../../../assets/images/terminalTwo/backArrow.svg";

function GateSelection(props) {
  const IndicatorSeparator = () => {
    return <></>;
  };

  const handleEditFlight = (flightUid) => {
    if (props.validateEditFlight && props.validateEditFlight(flightUid)) {
      props.setShowRemoveFlightModal(true);
    } else {
      props.handleAddFlightShow();
    }
  };

  return (
    <Wrapper>
      <GateAndFlightDetailsContainer>
        <GateSelectionWrapper>
          <DesktopGoBackWrapper onClick={() => props.handleGoBack()}>
            <BackArrowImg src={BackArrowWhite} />
            <GoBackText>
              <Text>Go Back</Text>
            </GoBackText>
          </DesktopGoBackWrapper>
          <Title>
            <SubTitle>
              <Text>We will be delivering your food at:</Text>
            </SubTitle>
            <Text type="bold">Please confirm your delivery location</Text>
          </Title>
          <GateSelectionContainer>
            <DropdownContainer>
              <div style={{ width: "100%", position: "relative" }}>
                <Select
                  components={{
                    IndicatorSeparator,
                  }}
                  styles={{
                    valueContainer: (base) => ({
                      ...base,
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#222",
                      paddingLeft: "20px",
                      fontFamily: "ManropeRegular",
                    }),
                    control: (base) => ({
                      ...base,
                      minHeight: "54px",
                      borderRadius: "8px",
                      border: "1px solid #DCDCDC",
                      "&:hover": {
                        border: "1px solid #DCDCDC",
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      boxShadow: "none",
                      borderRadius: "8px",
                      marginTop: "5px",
                      marginBottom: "8px",
                      maxHeight: "80px",
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: "150px",
                    }),
                    option: (base) => ({
                      ...base,
                      border: `1px solid #DCDCDC`,
                      display: "flex",
                      alignItems: "center",
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#222",
                      backgroundColor: "#fff",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      fontSize: "16px",
                      fontWeight: "500",
                      letterSpacing: "0.35px",
                      color: "#222",
                      fontFamily: "ManropeRegular",
                    }),
                    noOptionsMessage: (base) => ({
                      ...base,
                      fontSize: "16px",
                      fontWeight: "500",
                      letterSpacing: "0.35px",
                      color: "#181818",
                      fontFamily: "ManropeRegular",
                    }),
                  }}
                  aria-label="Boarding Gate"
                  placeholder={"Your boarding gate e.g. 34A"}
                  value={props.selectedGate}
                  onChange={(e) => props.setSelectedGate(e)}
                  options={props.gates}
                />
              </div>
            </DropdownContainer>
          </GateSelectionContainer>
          <StartOrderingWrapper>
            <StartOrderingButton
              onClick={() => props.handleStartOrdering()}
              disabled={
                props.selectedGate === null ||
                props.selectedGate === undefined ||
                props.disableStartOrdering === true
              }
            >
              <Text type="bold">Start Ordering Now</Text>
            </StartOrderingButton>
          </StartOrderingWrapper>
        </GateSelectionWrapper>
        <FlightCardWrapper>
          <FlightCard
            flightData={props.flightData}
            setAirportData={props.setFlightData}
            handleChangeFlight={handleEditFlight}
            enableTheme={false}
            hideCloseIcon={true}
            showChangeFlight={true}
          />
        </FlightCardWrapper>
      </GateAndFlightDetailsContainer>
      {props?.preOrderAvailable && (
        <ScheduleOrderBannerWrapper>
          <ScheduledOrderPicker
            value={props.time}
            setValue={props.setTime}
            minTime={defaultDatePickerTime()}
            label="Want to pre-order?"
            triggerStyle={{ zIndex: 998 }}
          />
        </ScheduleOrderBannerWrapper>
      )}
      <IllustrationWrapper>
        <Illustration src={IllustrationImage} alt="floral-image" />
      </IllustrationWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  padding: 24px;
  background: var(
    --grey,
    linear-gradient(139deg, #60678b -35.77%, #1f2131 140.71%)
  );
  height: 100%;
  position: relative;

  @media ${device.laptop} {
    height: fit-content;
    padding: 32px 136px 52px 136px;
  }
`;
const GateAndFlightDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media ${device.laptop} {
    flex-direction: row;
    align-items: center;
    gap: 142px;
  }
`;
const GateSelectionWrapper = styled.div`
  width: 100%;

  @media ${device.laptop} {
    width: 40%;
  }
`;
const FlightCardWrapper = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    width: 60%;
    z-index: 1;
  }
`;
const Title = styled.div`
  color: #fff;
  font-size: 20px;
  line-height: 26px;

  @media ${device.laptop} {
    padding-top: 24px;
  }
`;
const SubTitle = styled.div`
  color: #fff;
  font-size: 14px;
  line-height: 26px;
  padding-top: 8px;

  @media ${device.laptop} {
    padding-top: 16px;
  }
`;
const GateSelectionContainer = styled.div`
  width: 100%;
  margin-top: 24px;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #dcdcdc;
`;
const DropdownContainer = styled.div`
  width: 100%;
  position: relative;
  z-index: 999;
  pointer-events: auto;
`;
const ScheduleOrderBannerWrapper = styled.div`
  width: 100%;
  padding: 32px 0px 0px 0px;
  display: block;

  @media ${device.laptop} {
    display: none;
    width: 50%;
  }
`;
const IllustrationWrapper = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
`;
const Illustration = styled.img``;
const StartOrderingWrapper = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    width: 100%;
    margin-top: 24px;
  }
`;
const StartOrderingButton = styled(PrimaryButton)`
  width: 100%;
  height: 54px;
`;
const DesktopGoBackWrapper = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }
`;
const BackArrowImg = styled.img``;
const GoBackText = styled.div`
  font-size: 16px;
  color: #fff;
`;
export default GateSelection;
