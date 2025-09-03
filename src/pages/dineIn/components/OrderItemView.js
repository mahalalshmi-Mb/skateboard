import { useConfig } from "context/configContext";
import styled from "styled-components";
import Text from "../../../components/atoms/Text";
import { DietCategoryIcon } from "../../edpFSTR/pages/config/config";
import { formatPrice } from "commons/util/helperFunctions";

const OrderItemView = ({
  itemName = "",
  itemCategory = "veg",
  itemQuantity = 1,
  itemPrice = 0,
  strikeoutPrice = 0,
}) => {
  return (
    <Wrapper>
      <NameTypeWrapper>
        <ItemNameWrapper>
          <Text type="semi-bold">{itemName}</Text>
        </ItemNameWrapper>
      </NameTypeWrapper>
      <QuantityPriceWrapper>
        <ItemQuantityWrapper>
          <Text type="semi-bold">{itemQuantity}x</Text>
        </ItemQuantityWrapper>
        <ItemPriceMainWrapper>
          <ItemPriceWrapper>
            <Text type="semi-bold">{formatPrice(itemPrice)}</Text>
          </ItemPriceWrapper>
          {strikeoutPrice && strikeoutPrice !== itemPrice ? (
            <ItemStrikePriceWrapper>
              <Text type="semi-bold">{formatPrice(strikeoutPrice)}</Text>
            </ItemStrikePriceWrapper>
          ) : null}
        </ItemPriceMainWrapper>
      </QuantityPriceWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NameTypeWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 5px;
`;

const QuantityPriceWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 16px;
`;

const ItemNameWrapper = styled.div`
  color: #273135;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
`;

const ItemTypeImage = styled.img`
  width: 12px;
  height: 12px;
`;

const ItemQuantityWrapper = styled.div`
  color: rgba(39, 49, 53, 0.6);
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
`;

const ItemPriceMainWrapper = styled.div``;

const ItemPriceWrapper = styled.div`
  color: #273135;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
`;

const ItemStrikePriceWrapper = styled.div`
  color: #222222;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  line-height: normal;
  text-decoration: line-through;
  opacity: 0.7;
`;

export default OrderItemView;
