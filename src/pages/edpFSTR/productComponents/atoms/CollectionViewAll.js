import React from "react";
import styled from "styled-components";
import Text from "../../../../components/atoms/Text";
import { colors } from "theme/colors";
import { useConfig } from "context/configContext";

function CollectionViewAll(props) {
  const { appConfig } = useConfig();
  return (
    <Wrapper
      style={props.textStyle}
      onClick={props.onClick}
      isMobile={props?.isMobile || false}
    >
      <TextWrapper>
        <Text type={props.textType || "bold"}>{props.label || "View All"}</Text>
      </TextWrapper>
      <CollectionViewAllIcon src={require(`../../../../assets/images/locationImg/${appConfig.locationId}/viewAll.svg`)} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ isMobile }) => (isMobile ? "center" : "space-between")};
  width: ${({ isMobile }) => (isMobile ? "100%" : "auto")};
  gap: 4px;
`;
const TextWrapper = styled.div`
  color: ${colors?.text?.actionTextColor};
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
`;

const CollectionViewAllIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export default CollectionViewAll;
