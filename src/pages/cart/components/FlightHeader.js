import { useHistory } from "react-router-dom";
import styled from "styled-components";
import moment from "util/momentWrapper";
import Text from "../../../components/atoms/Text";
import useCustomNavigation from "../../../hooks/useCustomNavigation";

const FlightHeader = (props) => {
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();

  const handleOnEdit = () => {
    pushHistory("/mandatoryInfo");
  };

  return (
    <Wrapper>
      <FlightDetails>
        <FlightTitle>
          <Text>
            <span
              style={{
                fontFamily: "ManropeMedium",
              }}
            >{`${props?.data?.airline?.displayName}`}</span>
            <span
              style={{ fontSize: "16px" }}
            >{` ${props?.data?.flight?.iata}`}</span>
            <span>{` | ${moment(props?.data?.timeline?.departure?.estimated)
              .add(5, "hours")
              .add(30, "minutes")
              .format("lll")}`}</span>
          </Text>
        </FlightTitle>
        <FlightSubTitle>
          <Text>
            <span>{`${props?.data?.journey?.origin?.city} to ${props?.data?.journey?.destination?.city}`}</span>
          </Text>
        </FlightSubTitle>
      </FlightDetails>
      {props?.showEditOption && (
        <EditWrapper onClick={() => handleOnEdit()}>
          <Text type="extra-bold">Edit</Text>
        </EditWrapper>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 22px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #273135;
`;
const FlightDetails = styled.div`
  width: 100%;
`;
const EditWrapper = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: #04adaa;
`;
const FlightTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #fff;
`;
const FlightSubTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;
  color: #fff;
  padding-top: 8px;
  opacity: 0.7;
`;
export default FlightHeader;
