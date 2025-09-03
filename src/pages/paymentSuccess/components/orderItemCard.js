import React from "react";
import Text from "../../../components/atoms/Text";
import { device, formatPrice } from "commons/util/helperFunctions";
import styled from "styled-components";
import { colors } from "theme/colors";
import { SpacedOutRow } from "theme/globalStyleSheet";

function OrderItemCard(props) {
  const getItemName = (data) => {
    if (data.itemType !== "product") {
      return `${data.description?.shortDescription || data.description || ""} ${
        (data.itemSubDescription || data.subDescription) &&
        (data.itemSubDescription || data.subDescription) !== "unknown"
          ? data.itemSubDescription || data.subDescription
          : ""
      }`;
    } else {
      if (data.title) {
        return `${data?.title} ${
          data?.allAttributes?.length > 0
            ? `(${data?.allAttributes?.join(", ")})`
            : ``
        }`;
      }
    }
    return "";
  };

  return (
    <Wrapper style={props?.lastItem ? { borderBottom: "none" } : {}}>
      <ShopName>
        <Text type="bold">{props?.data?.shopDetails?.shopName || ""}</Text>
      </ShopName>
      {props?.data?.shopDetails?.pickupLocation &&
        props?.data?.shopDetails?.pickupLocation !== "" && (
          <ShopLocation>
            <Text type="bold">
              {`${
                props?.data?.shopDetails?.terminal?.displayLabel
                  ? `${props?.data?.shopDetails?.terminal?.displayLabel?.trim()}`
                  : ``
              }${
                props?.data?.shopDetails?.pickupLocation &&
                props?.data?.shopDetails?.terminal?.displayLabel
                  ? `, ${props?.data?.shopDetails?.pickupLocation?.trim()}`
                  : `${props?.data?.shopDetails?.pickupLocation?.trim()}`
              }
                  `}
            </Text>
          </ShopLocation>
        )}
        {props?.data?.shopDetails?.prepTime && (
          <StorePrepTimeContainer>
            <StorePrepTime>
              <Text>{`Pickup Time : ${props?.data?.shopDetails?.prepTime}`}</Text>
            </StorePrepTime>
          </StorePrepTimeContainer>
        )}
      {props?.data?.items?.map((item, index) => (
        <ItemListingContainer key={index}>
          <SpacedOutRow>
            <ItemNameWrapper>
              <OrderItem>
                <Text>
                  {getItemName(item)} {`x ${item?.quantity}`}
                </Text>
              </OrderItem>
              {item?.allPreferences?.length > 0 && (
                <OrderItemPref>
                  <Text type="medium">{item?.allPreferences?.join(", ")}</Text>
                </OrderItemPref>
              )}
            </ItemNameWrapper>
            <OrderItem>
              <Text>{formatPrice(item?.price?.reference?.priceToPay)}</Text>
            </OrderItem>
          </SpacedOutRow>
          {/* <div className="item-name-wrapper">
                    <div className="item-name-text">
                      <Text type="medium">
                        {getItemName(item)} {`x ${item?.quantity}`}
                      </Text>
                    </div>
                    {item?.allPreferences?.length > 0 && (
                      <div className="item-pref-text">
                        <Text type="medium">
                          {item?.allPreferences?.join(", ")}
                        </Text>
                      </div>
                    )}
                  </div>
                  <div className="item-price-text">
                    <Text type="medium">
                      {formatPrice(item?.price?.reference?.priceToPay)}
                    </Text>
                  </div> */}
        </ItemListingContainer>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding: 12px 0px;
  border-bottom: 1px solid ${colors?.border};
`;
const ShopName = styled.div`
  width: 100%;
  font-size: 14px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 16px;
  }
`;
const ShopLocation = styled.div`
  width: 100%;
  font-size: 12px;
  color: ${colors?.text?.gray200};

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
const ItemListingContainer = styled.div`
  width: 100%;
  padding-top: 8px;
  gap: 4px 0px;
`;
const OrderItem = styled.div`
  font-size: 12px;
  color: ${colors?.text?.black200};

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
const ItemNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const OrderItemPref = styled.div`
  font-size: 10px;
  color: ${colors?.text?.gray200};
  margin-top: 4px;

  @media ${device.laptop} {
    font-size: 12px;
  }
`;
const StorePrepTimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding-top: 4px;
  font-size: 12px;

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
const StorePrepTime = styled.div`
  font-size: 12px;
  color: ${colors?.text?.gray200};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

export default OrderItemCard;
