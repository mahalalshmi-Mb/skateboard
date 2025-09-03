import React, { Fragment } from "react";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Text from "../../../../../../components/atoms/Text";

import { getAppConfig } from "../../../../../../commons/util/appConfigHelper";
import "./card.css";
import useCustomNavigation from "../../../../../../hooks/useCustomNavigation";

const Card = (props) => {
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();

  const handleCardClick = (item) => {
    if (!props.cardClick) {
      if (
        item.details.find((item) => item.key === "ancestors").value ===
          "Airport cabs" && isMobile
      ) {
        pushHistory(`/cabs/booking-details`, {
          orderId: props.orderId,
          type: props.type,
          details: props.item,
        });
      } else {
        pushHistory(`/travellers/profile/myOrders/${props.orderId}`, {
          orderId: props.orderId,
          subOrderId: getSubOrderId(props?.item?.header, "full"),
          type: props.type,
          details: item,
          orderQrCode: props.orderQrCode,
          cancellationPolicy: props.cancellationPolicy,
        });
      }
    }
  };

  const openMenu = (e, url) => {
    if (url) {
      e.stopPropagation();
      window.open(url);
    }
  };

  const getProductImage = () => {
    const found = props?.item?.details?.find((x) =>
      x?.key?.startsWith("storeInfo.brandingImageURL")
    );
    if (found) {
      return found.value;
    } else {
      return "";
    }
  };

  const getStatusColor = (value, key) => {
    if (key === "orderStatus") {
      const status = value?.toLowerCase();
      if (status.includes("open")) {
        return "#ffa500";
      } else if (
        status.includes("abort") ||
        status.includes("cancel") ||
        status.includes("fail")
      ) {
        return "#ff0000";
      } else {
        return "#008000";
      }
    } else {
      return "#273135";
    }
  };

  const getSubOrderId = (headerArr, orderIdType) => {
    let found;
    if (orderIdType === "full") {
      found = headerArr?.find((x) => x.display?.startsWith("Full-Suborder#"));
    } else {
      found = headerArr?.find((x) => x.display?.startsWith("Suborder#"));
    }
    if (found) {
      return found.value;
    } else {
      return "";
    }
  };

  return (
    <div
      className={`booking-card-container ${
        props.noBackground ? "card-noBackground" : ""
      } card-wrapper`}
      style={{
        borderRadius: "12px",
      }}
    >
      <div className="booking-card-content">
        {getProductImage() !== "" && (
          <div className="image-wrapper">
            <img
              src={getProductImage()}
              style={{ borderRadius: "16pt", width: "80px", height: "80px" }}
              alt="icon"
            />
          </div>
        )}
        <div className="card-info-wrapper">
          {props?.item?.header?.map((item, index) =>
            item?.type?.startsWith("text") &&
            item?.priority <= 5 &&
            item?.value !== "" &&
            item?.value !== null &&
            item?.value !== undefined &&
            item?.value !== 0 ? (
              <div className="text-row" key={index}>
                <div className="text-label">
                  <Text>{item?.display || ""}:</Text>
                </div>
                <div className="text-value">
                  <Text>&nbsp; {item?.value}</Text>
                </div>
              </div>
            ) : null
          )}
          {props?.item?.details?.map((item, index) =>
            item?.type?.startsWith("text") &&
            item?.priority <= 5 &&
            item?.value !== "" &&
            item?.value !== null &&
            item?.value !== undefined &&
            item?.value !== 0 ? (
              <div className="text-row" key={index}>
                <div className="text-label">
                  <Text>{item?.display || ""}:</Text>
                </div>
                <div
                  className="text-value"
                  style={{ color: getStatusColor(item.value, item?.key) }}
                >
                  <Text type={item?.key === "orderStatus" ? "bold" : "regular"}>
                    &nbsp; {item?.value}
                  </Text>
                </div>
              </div>
            ) : item?.type?.startsWith("link") &&
              item?.priority <= 5 &&
              item?.value !== "" &&
              item?.value !== null &&
              item?.value !== undefined &&
              item?.value !== 0 ? (
              <InvoiceText onClick={(e) => openMenu(e, item?.value)}>
                <Text type="semi-bold">Click to View Invoice</Text>
              </InvoiceText>
            ) : item?.type?.startsWith("object") &&
              item?.display.startsWith("Documents") &&
              item?.priority <= 5 &&
              item?.value !== "" &&
              item?.value !== null &&
              item?.value !== undefined &&
              item?.value?.length !== 0 ? (
              item?.value?.map((valItem, valIndex) => (
                <InvoiceText
                  key={valIndex}
                  onClick={(e) => openMenu(e, valItem?.reference)}
                >
                  <Text type="semi-bold">{`Click to View ${valItem.title}`}</Text>
                </InvoiceText>
              ))
            ) : null
          )}
          {props?.item?.children?.length > 0 && (
            <div className="item-box">
              {props?.item?.children?.map((subItem, subIndex) => (
                <div
                  className="item-wrapper"
                  key={subIndex}
                  style={{
                    borderBottom:
                      subIndex !== props?.item?.children?.length - 1
                        ? "1px solid #dddddd"
                        : "none",
                  }}
                >
                  {subItem?.details?.map((itemInfo, itemIndex) =>
                    itemInfo?.type?.startsWith("text") &&
                    itemInfo?.priority <= 5 &&
                    itemInfo?.value !== "" &&
                    itemInfo?.value !== null &&
                    itemInfo?.value !== undefined &&
                    itemInfo?.value !== 0 ? (
                      <div className="text-row" key={itemIndex}>
                        <div className="text-label">
                          <Text>{itemInfo?.display || ""}:</Text>
                        </div>
                        <div
                          className="text-value"
                          style={{
                            color: getStatusColor(
                              itemInfo.value,
                              itemInfo?.key
                            ),
                          }}
                        >
                          <Text
                            type={
                              itemInfo?.key === "orderStatus"
                                ? "bold"
                                : "regular"
                            }
                            isEllipsis
                            style={{ maxWidth: "180px" }}
                          >
                            &nbsp; {itemInfo?.value || ""}
                          </Text>
                        </div>
                      </div>
                    ) : null
                  )}
                  <div
                    className="details-button-wrapper"
                    onClick={() => handleCardClick(subItem)}
                  >
                    More Details
                  </div>
                </div>
              ))}
            </div>
          )}
          {props.caller === "booking-details" &&
            props.item?.details?.find((item) => item.key === "ancestors")
              ?.value === "Airport cabs" && (
              <Fragment>
                <div className="text-row" style={{ alignItems: "flex-start" }}>
                  <div className="text-label">
                    <Text>{"Pickup"}:</Text>
                  </div>
                  <div className="text-value" style={{ marginLeft: "5px" }}>
                    <Text>
                      {props.item.details.find(
                        (item) => item.key === "metadata"
                      ).value?.pickup?.address || ""}
                    </Text>
                  </div>
                </div>
                <div className="text-row" style={{ alignItems: "flex-start" }}>
                  <div className="text-label">
                    <Text>{"Drop"}:</Text>
                  </div>
                  <div className="text-value" style={{ marginLeft: "5px" }}>
                    <Text>
                      {props.item.details.find(
                        (item) => item.key === "metadata"
                      ).value?.drop?.address || ""}
                    </Text>
                  </div>
                </div>
              </Fragment>
            )}
        </div>
      </div>
    </div>
  );
};

const InvoiceText = styled.div`
  font-family: ManropeRegular;
  margin-top: 5px;
  text-decoration: underline;
  opacity: 0.7;
  padding-bottom: 10px;
`;

export default Card;
