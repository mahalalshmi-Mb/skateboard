import React from "react";
import styled from "styled-components";
import Text from "../../../components/atoms/Text";
import Forward from "../assets/Forward.svg";
import { device } from "../../../commons/util/helperFunctions";

const TakeAwaySelectionItem = (props) => {
  return (
    <Wrapper banner={props.banner} onClick={props.onClick}>
      <BannerImage src={props.icon} />
      {props.showComingSoon && (
        <ComingSoonWrapper>
          <ComingSoonText>
            <Text type="extra-bold">COMING SOON</Text>
          </ComingSoonText>
        </ComingSoonWrapper>
      )}
      <ForwardMovementWrapper>
        <MovementTextWrapper>
          <Text type="bold">{props.moment}</Text>
        </MovementTextWrapper>
        {!props.showComingSoon && <ForwardImage src={Forward} />}
      </ForwardMovementWrapper>
    </Wrapper>
  );
};

const ForwardMovementWrapper = styled.div({
  display: "flex",
  justifyContent: "space-between",
});

const MovementTextWrapper = styled.div({
  fontSize: "13px",
  color: "#FFFFFF",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  lineHeight: "18px",
  fontWeight: 700,
});
const ForwardImage = styled.img``;

const BannerImage = styled.img({
  width: "fit-content",
});

const Wrapper = styled.div`
  background: Url(${({ banner }) => banner});
  display: flex;
  flex-direction: column;
  height: 99px;
  background-size: cover;
  overflow: hidden;
  justify-content: space-around;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 4px;
  margin-top: 16px;
  cursor: pointer;
  position: relative;

  @media ${device.laptop} {
    width: calc(50% - 12px);
    min-width: calc(50% - 12px);
  }
`;

const ComingSoonWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background-color: #f8cf46;
  border-radius: 2px;
  text-transform: uppercase;
`;

const ComingSoonText = styled.div`
  font-weight: 800;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.1em;
  color: #273135;
`;

export default TakeAwaySelectionItem;
