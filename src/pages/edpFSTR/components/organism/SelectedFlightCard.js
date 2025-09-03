import { device } from "commons/util/helperFunctions";
import Text from "components/atoms/Text";
import { dateTimeFormats } from "config/dateTimeConfig";
import styled from "styled-components";
import moment from "util/momentWrapper";

function SelectedFlightCard(props) {
  const handleEditFlight = (flightUid) => {
    if (props.validateEditFlight && props.validateEditFlight(flightUid)) {
      props.setShowRemoveFlightModal(true);
    } else {
      props.handleAddFlightShow();
    }
  };
  return (
    <Wrapper>
      <ContentWrapper>
        <FlightDetailsWrapper>
          <FlightIcon
            src={props?.flightData?.airlineImg || ""}
            alt="airline-image"
          />
          <FlightInfo>
            <Title>
              <Text>
                <SemiBold>{`${props?.flightData?.airlineName} ${props?.flightData?.srcDestAirport}`}</SemiBold>{" "}
                {props?.flightData?.flightId}
              </Text>
            </Title>
            <Title>
              <Text>{`${props?.flightData?.baseAirportName} to ${
                props?.flightData?.srcDestAirportName
              } | ${moment(props?.flightData?.estimatedDate).format(
                dateTimeFormats.time.twentyFourHourMinute
              )}`}</Text>
            </Title>
          </FlightInfo>
        </FlightDetailsWrapper>
        <ActionWrapper onClick={() => handleEditFlight(props?.flightData?.UID)}>
          <Text type="extra-bold">Edit</Text>
        </ActionWrapper>
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  padding: 24px;
  background-color: #fff;

  @media ${device.laptop} {
    display: none;
  }
`;
const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const FlightDetailsWrapper = styled.div`
  display: flex;
  gap: 4px;
`;
const FlightIcon = styled.img`
  width: 24px;
  height: 24px;
`;
const FlightInfo = styled.div``;
const Title = styled.div`
  color: #273135;
  font-size: 16px;
`;
const SemiBold = styled.b`
  font-family: ManropeMedium;
`;
const ActionWrapper = styled.div`
  color: #037b79;
  font-size: 16px;
  line-height: 24px;
`;

export default SelectedFlightCard;
