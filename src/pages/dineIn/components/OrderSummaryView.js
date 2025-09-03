import { useConfig } from "context/configContext";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Text from "../../../components/atoms/Text";
import OrderItemView from "./OrderItemView";
import { formatPrice } from "commons/util/helperFunctions";

const OrderSummaryView = ({ orderId, orderSummary }) => {
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [taxBreakUp, setTaxBreakUp] = useState([]);

  const [combinedOrderSummary, setCombinedOrderSummary] = useState([]);

  useEffect(() => {
    let grandTotalAmount = 0;
    let subTotalAmount = 0;
    let discountAmount = 0;
    let taxBreakUpAmount = [];

    const combinedItems = [];

    orderSummary.forEach((order) => {
      const existingItem = combinedItems.find(
        (combinedItem) =>
          combinedItem.productId === order.productId &&
          JSON.stringify(removeIdFromPreferences(combinedItem.preferences)) ===
            JSON.stringify(removeIdFromPreferences(order.preferences))
      );

      if (existingItem) {
        existingItem.quantity += order.quantity;

        Object.keys(existingItem.price.reference).forEach((key) => {
          existingItem.price.reference[key] +=
            order.price.reference[key] * order.quantity;
        });

        existingItem.taxBreakUp.forEach((existingTax, index) => {
          existingTax.amount += order.taxBreakUp[index].amount;
          existingTax.value += order.taxBreakUp[index].value;
        });
      } else {
        combinedItems.push({
          ...order,
          price: {
            ...order.price,
            reference: { ...order.price.reference },
          },
        });
      }
    });

    combinedItems.forEach((order, index) => {
      const priceReference = order.price.reference;

      grandTotalAmount += order?.price?.amount;
      subTotalAmount += priceReference?.totalPrice;
      discountAmount += priceReference?.discounts;

      if (index === 0) {
        taxBreakUpAmount = JSON.parse(JSON.stringify(order.taxBreakUp));
      } else {
        order.taxBreakUp.forEach((tax) => {
          const existingTax = taxBreakUpAmount.find((t) => t.key === tax.key);
          if (existingTax) {
            existingTax.amount += tax.amount;
            existingTax.value += tax.value;
          } else {
            taxBreakUpAmount.push({ ...tax });
          }
        });
      }
      setTaxBreakUp(taxBreakUpAmount);
    });

    setCombinedOrderSummary(combinedItems);
    setSubTotal(subTotalAmount);
    setDiscount(discountAmount);
  }, [orderSummary]);

  function removeIdFromPreferences(preferences) {
    return preferences.map(({ _id, ...rest }) => rest);
  }

  return (
    <>
      <OrderIdAndItemsWrapper>
        <OrderIdTextWrapper>
          <Text type="bold">Order #{orderId.slice(-5)}</Text>
        </OrderIdTextWrapper>
        {combinedOrderSummary.length > 0 &&
          combinedOrderSummary.map((order, index) => {
            return (
              <OrderItemView
                itemName={order?.title}
                key={index}
                itemQuantity={order?.quantity}
                itemPrice={order?.price?.reference?.priceToPay}
                strikeoutPrice={order?.price?.reference?.strikeout}
                itemCategory={order?.dietCategory}
              />
            );
          })}
      </OrderIdAndItemsWrapper>
      <Divider></Divider>
      <SubTotalMainWrapper>
        <HorizontalWrapper>
          <SubTotalTextWrapper>
            <Text type="bold">Sub Total</Text>
          </SubTotalTextWrapper>
          <SubTotalAmountTextWrapper>
            <Text type="bold">{formatPrice(subTotal)}</Text>
          </SubTotalAmountTextWrapper>
        </HorizontalWrapper>
        <HorizontalWrapper>
          <SubTotalKeyTextWrapper>
            <Text type="semi-bold">Discount</Text>
          </SubTotalKeyTextWrapper>
          <SubTotalValueTextWrapper>
            <Text
              type="semi-bold"
              style={{
                color: "#419A46",
              }}
            >
              -{formatPrice(discount)}
            </Text>
          </SubTotalValueTextWrapper>
        </HorizontalWrapper>
        {taxBreakUp.length > 0 &&
          taxBreakUp.map((tax, index) => {
            return (
              <HorizontalWrapper key={index}>
                <SubTotalKeyTextWrapper>
                  <Text type="semi-bold">
                    {tax?.key} ({tax?.rate}%)
                  </Text>
                </SubTotalKeyTextWrapper>
                <SubTotalAmountTextWrapper>
                  <Text type="semi-bold">{formatPrice(tax?.value)}</Text>
                </SubTotalAmountTextWrapper>
              </HorizontalWrapper>
            );
          })}
      </SubTotalMainWrapper>
    </>
  );
};

const OrderIdTextWrapper = styled.div`
  color: #273135;
  font-size: 13px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 1.3px;
  text-transform: uppercase;
  opacity: 0.5;
`;

const OrderIdAndItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(223, 223, 226, 0.3);
  width: -webkit-fill-available;
`;

const SubTotalMainWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HorizontalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SubTotalTextWrapper = styled.div`
  color: #273135;
  font-size: 14px;
  font-weight: 700;
  line-height: normal;
`;

const SubTotalAmountTextWrapper = styled.div`
  color: #273135;
  text-align: right;
  font-size: 14px;
  font-weight: 700;
  line-height: normal;
`;

const SubTotalKeyTextWrapper = styled.div`
  color: #273135;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
`;

const SubTotalValueTextWrapper = styled.div`
  color: #273135;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
`;

export default OrderSummaryView;
