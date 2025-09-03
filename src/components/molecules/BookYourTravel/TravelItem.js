import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Text from "../../atoms/Text";
import Util from "../../../commons/util/util";
import useCustomNavigation from "../../../hooks/useCustomNavigation";

const TravelItem = (props) => {
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();

  const handleOnClick = () => {
    Util.triggerMoEngageEvent("category_click", {
      type: props.header,
      categoryName: props?.item?.header || "",
      redirectLink: props?.item?.redirectLink || "",
    });
    if (props?.item?.group1?.toLowerCase() !== "active") {
      return;
    }
    if (props?.item?.isExternal) {
      window.open(props?.item?.redirectLink, "_blank");
    } else {
      pushHistory(props?.item?.redirectLink);
    }
  };
  return (
    <ItemWrapper onClick={handleOnClick}>
      <ItemImageWrapper>
        <ItemImage src={props?.item?.images?.[0]?.url} alt="item" />
        {props?.item?.group1?.toLowerCase() !== "active" && (
          <ComingSoonBand>
            <Text type="extra-bold">COMING SOON</Text>
          </ComingSoonBand>
        )}
      </ItemImageWrapper>
      <ItemText>
        <Text type={"semi-bold"}>{props?.item?.header || ""}</Text>
      </ItemText>
    </ItemWrapper>
  );
};

const ItemWrapper = styled.div`
  width: 100px;
  white-space: normal;
  cursor: pointer;
`;
const ItemImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  border-radius: 8px;
`;
const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;
const ComingSoonBand = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100px;
  padding: 2px 4px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  background-color: #f8cf46;

  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.1em;
  color: #273135;
`;
const ItemText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 8px 4px 0px 4px;
  margin-bottom: 0px;

  font-size: 14px;
  font-style: normal;
  line-height: normal;
  color: #273135;
`;

export default TravelItem;
