import { dateTimeFormats } from "config/dateTimeConfig";
import styled, { css } from "styled-components";
import moment from "util/momentWrapper";
import { Bold, Image } from "../../../../theme/globalStyleSheet";
import Text from "../../../atoms/Text";

const DesktopFlightInfoCard = (props) => {
  const { data, isDeparture, isSelected, setSelected } = props;

  return (
    <Wrapper isSelected={isSelected} onClick={() => setSelected(data)}>
      <Description>
        <AirlineLogo src={data.airline_img} />
        <AirlineDetails>
          <Title>
            <Bold>{data.airline_name}</Bold>
            {` ${data.flight_unique_no}`}
          </Title>
          <OriginDest>{`${data.base_airport_name} to ${data.srcdest_airport_name}`}</OriginDest>
        </AirlineDetails>
      </Description>
      <TimeContainer>
        <TimeTitle>{isDeparture ? "Departure Time" : "Arrival Time"}</TimeTitle>
        <Time>
          {moment(data.schedule_hour_id).format(
            dateTimeFormats.time.twentyFourHourMinute
          )}
        </Time>
      </TimeContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  border: 1px solid #27313533;
  padding: 20px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;

  ${(props) =>
    props.isSelected &&
    css`
      background: rgba(9, 107, 113, 0.1);
      border: 1px solid rgba(9, 107, 113, 0.6);
    `}
`;
const Description = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;
const AirlineLogo = styled(Image)`
  height: 32px;
  width: 32px;
`;
const AirlineDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Title = styled(Text)`
  font-family: Manrope;

  font-size: 16px;
  font-weight: 400;
  line-height: 21.86px;
  text-align: left;
`;
const OriginDest = styled(Text)`
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  text-align: left;
`;
const TimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const TimeTitle = styled(Text)`
  font-size: 12px;
  font-weight: 600;
  line-height: 16.39px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 50%;
`;
const Time = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  line-height: 21.86px;
  text-align: right;
`;

export default DesktopFlightInfoCard;
