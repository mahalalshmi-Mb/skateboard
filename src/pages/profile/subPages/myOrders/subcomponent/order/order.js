import React, { Fragment, useEffect, useState } from "react";
import Card from "../card/card";
import "./order.css";
const Order = ({
  orderItem,
  type,
  orderQrCode,
  ppgInvoice,
  productInvoice,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [flightItems, setFlightItems] = useState([]);
  const [others, setOthers] = useState([]);

  useEffect(() => {
    let newFlightItems = [];
    let newOthers = [];

    orderItem.items.forEach((item) => {
      if (item.flight.id) {
        let flightFlag = false;
        //**check if array contains flight */
        newFlightItems.length &&
          newFlightItems.forEach((oldFlightItem) => {
            if (oldFlightItem.id === item.flight.id) {
              flightFlag = true;
              if (item.itemType !== "product") {
                oldFlightItem.items.push(item);
              } else {
                //**check if store already exists */
                let storeFlag = false;
                oldFlightItem.items.forEach((oldItem) => {
                  if (oldItem.storeId === item.storeId) {
                    storeFlag = true;
                    oldItem.items.push(item);
                    oldItem.itemQuantity = oldItem.itemQuantity + 1;
                  }
                });
                if (!storeFlag) {
                  oldFlightItem.items.push({
                    ...item,
                    storeId: item.storeId,
                    itemName: item.storeName,
                    productImageUrl: item.shopBrandingImageURL
                      ? [item.shopBrandingImageURL]
                      : item.productImageUrl, //this will change to store image
                    itemType: "product",
                    variant: item.variant,
                    rating: item.rating ? item.rating : null,
                    itemQuantity: item.itemQuantity,
                    delivery: item.delivery,
                    flight: item.flight,
                    items: [item],
                    itemDescription: item.itemDescription,
                    itemSubDescription:
                      item.itemSubDescription || item.subDescription || "",
                    info: item.info || {},
                  });
                }
              }
            }
          });
        //**if absent create new flight item */
        if (!flightFlag) {
          if (item.itemType !== "product")
            newFlightItems.push({
              id: item.flight.id,
              details: item.flight,
              items: [item],
            });
          else {
            newFlightItems.push({
              id: item.flight.id,
              details: item.flight,
              items: [
                {
                  ...item,
                  storeId: item.storeId,
                  itemName: item.storeName,
                  productImageUrl: item.shopBrandingImageURL
                    ? [item.shopBrandingImageURL]
                    : item.productImageUrl, //this will change to store image
                  itemType: "product",
                  variant: item.variant,
                  rating: item.rating ? item.rating : null,
                  itemQuantity: item.itemQuantity,
                  delivery: item.delivery,
                  flight: item.flight,
                  items: [item],
                  itemDescription: item.itemDescription,
                  itemSubDescription:
                    item.itemSubDescription || item.subDescription || "",
                  partnerInfo: item.partnerInfo || {},
                  info: item.info || {},
                },
              ],
            });
          }
        }
      } else {
        newOthers.push({
          ...item,
          storeId: item.storeId,
          storeName: item.storeName,
          itemName: item.itemName,
          productImageUrl: item.shopBrandingImageURL
            ? [item.shopBrandingImageURL]
            : item.productImageUrl, //this will change to store image
          itemType: item.itemType,
          variant: item.variant,
          rating: item.rating || null,
          itemQuantity: item.itemQuantity,
          delivery: item.delivery,
          items: [item],
          contact: item.contact || [],
          cancellationFlag: item.policy?.cancellation?.cancellable || false,
          cancellationPolicy: item.policy || {},
          itemId: item.itemId || "",
          orderStatus: item.orderStatus || "",
          serviceDateTime: item.serviceDateTime || null,
          serviceFeedback: item.serviceFeedback || {},
          serviceProviderInfo: item.serviceProviderInfo
            ? item.serviceProviderInfo
            : {},
          statusDetails: item.statusDetails || [],
          price: item.price || [],
          addOns: item.addOns || [],
          itemDescription: item.itemDescription || "",
          itemSubDescription:
            item.itemSubDescription || item.subDescription || "",
          partnerInfo: item.partnerInfo || {},
          suborderId: item.suborderId || "",
          info: item.info || {},
        });
      }
    });

    setFlightItems(newFlightItems);
    setOthers(newOthers);
    setIsLoading(false);
  }, []);

  return (
    <Fragment>
      {isLoading ? null : (
        <div className="order-wrapper">
          <div className="order-header">
            <h5 className="bold">{`Order Id - ${
              orderItem.ppgOrderId && orderItem.ppgOrderId !== ""
                ? orderItem.ppgOrderId
                : orderItem.orderId.slice(-5)
            }`}</h5>
          </div>
          {flightItems.length
            ? flightItems.map((flightItem) => (
                <Fragment key={flightItem.id}>
                  <div className="card-wrapper">
                    {flightItem.items.map((item, index) => (
                      <Card
                        item={item}
                        key={`${item.itemId}${index}`}
                        status={orderItem.status}
                        orderId={orderItem.orderId}
                        type={type}
                        orderQrCode={orderQrCode}
                        ppgInvoice={ppgInvoice}
                        productInvoice={item?.invoiceUrl}
                      />
                    ))}
                  </div>
                </Fragment>
              ))
            : null}
          {others.length ? (
            <Fragment>
              {others.map((otherItem, index) => (
                <Fragment key={index}>
                  <div className="card-wrapper">
                    <Card
                      item={otherItem}
                      key={`${otherItem.itemId}`}
                      status={orderItem.status}
                      orderId={orderItem.orderId}
                      type={type}
                      orderQrCode={orderQrCode}
                      ppgInvoice={ppgInvoice}
                      productInvoice={otherItem?.invoiceUrl}
                    />
                  </div>
                </Fragment>
              ))}
            </Fragment>
          ) : null}
        </div>
      )}
    </Fragment>
  );
};

export default Order;
