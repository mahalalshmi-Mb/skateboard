import { device } from "commons/util/helperFunctions";
import Text from "components/atoms/Text";
import useCustomNavigation from "hooks/useCustomNavigation";
import React from "react";
import styled from "styled-components";
import { colors } from "theme/colors";
import { H3, PrimaryButton } from "theme/globalStyleSheet";

function EmptyCart(props) {
  const { pushHistory } = useCustomNavigation();

  const handleQuickLinks = (url) => {
    if (url) {
      pushHistory(url);
    }
  };

  return (
    <Wrapper>
      <EmptyCartImage
        src={props?.data?.content_blocks?.[0]?.images?.[0]?.url}
      />
      <Title>
        <Text type="bold">{props?.data?.content_blocks?.[0]?.header}</Text>
      </Title>
      <Desc>
        <Text>{props?.data?.content_blocks?.[0]?.disclaimer}</Text>
      </Desc>
      <ActionText
        onClick={() =>
          handleQuickLinks(
            props?.data?.page_sub_menus?.[0]?.content_blocks?.[0]?.redirectLink
          )
        }
      >
        <Text type="extra-bold">
          {props?.data?.page_sub_menus?.[0]?.content_blocks?.[0]?.header}
        </Text>
      </ActionText>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px 24px;
  margin-top: 64px;

  @media ${device.laptop} {
    padding: 0px 160px;
  }
`;
const EmptyCartImage = styled.img``;
const Title = styled(H3)`
  margin-top: 20px;
  text-align: center;
  color: ${colors?.text?.black200};
  text-transform: capitalize;
`;
const Desc = styled.div`
  margin-top: 12px;
  text-align: center;
  font-size: 14px;
  color: ${colors?.text?.gray200};
`;
const ActionText = styled(PrimaryButton)`
  width: fit-content;
  padding: 0px 24px;
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: ${colors?.text?.white100};
  letter-spacing: 0.1px;
  text-transform: uppercase;
  cursor: pointer;
`;

export default EmptyCart;
