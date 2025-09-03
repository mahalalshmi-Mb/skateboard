import CloseIcon from "assets/images/cart/closeIcon.svg";
import InfoIcon from "assets/images/cart/info_icon.svg";
import { device, formatPrice } from "commons/util/helperFunctions";
import Text from "components/atoms/Text";
import PushAlert from "components/atoms/pushAlert";
import { CartContext } from "context/cartContext";
import { useContext, useState } from "react";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import moment from "util/momentWrapper";
import { colors } from "theme/colors";
import { convertSpelling } from "commons/util/spellingHelper";
import PlusIcon from "../../../assets/images/commons/plus_blue.svg";
import MinusIcon from "../../../assets/images/commons/minus_blue.svg";
import PlusIconWhite from "../../../assets/images/commons/plus_white.svg";
import MinusIconWhite from "../../../assets/images/commons/minus_white.svg";

function CartItem(props) {
  const ClientCart = useContext(CartContext);
  const [tooltipOverlay, setTooltipOverlay] = useState(false);

  const triggerReRender = () => {
    props.onChange(!props.changeFlag);
  };

  const increaseItemQuantity = () => {
    const itemId = props.itemId;
    const flightUid =
      props.flight && Object.values(props.flight).length > 0
        ? props.flight.uid
          ? props.flight.uid
          : ""
        : "";

    let cartContents = ClientCart.getCart();

    // update cart quantity
    if (props.itemType === "product") {
      const inventoryQty = props.inventoryQuantity || 99999999;
      if (props.itemQuantity < inventoryQty) {
        let localAddon = [];
        if (props.addOns) {
          localAddon = JSON.parse(JSON.stringify(props.addOns));
          localAddon = localAddon.map((x) => {
            x.selected = true;
            delete x.quantity;
            delete x.priceToPay;
            return x;
          });
        }
        let item = props.item;
        item.addOn = localAddon;

        const requiredPreferences = props.item.preferences.map(
          ({ title, selection }) => ({
            title,
            selection,
          })
        );

        item.customisationPreferences = requiredPreferences;

        if (props.showCustomisation) {
          try {
            props.setSelectedItemId(item.itemId);
            props.setChangeRepeatSelectionItem(item);
            props.setShowRepeatSelectionModal(true);
          } catch (e) {}
        } else {
          const updateParam = {
            storeId: props.storeInfo.storeId,
            productId: props.itemId,
            quantity: parseInt(props.itemQuantity) + 1,
            addOn: localAddon || [],
            customisationPreferences: props.preferences || [],
            item: item,
          };
          ClientCart.updateProductItem(updateParam, true);
        }
      } else {
        PushAlert.info("Not in stock");
      }
    } else if (props.itemType === "variant") {
      cartContents[props.vendorInfo?.vendorId] &&
        cartContents[props.vendorInfo?.vendorId].items.forEach((x) => {
          if (flightUid !== "") {
            if (x.itemId === itemId && x.flightUid === flightUid) {
              let found = props.uom.find(
                (ele) => ele.primaryFlag === "Y" || ele.primaryFlag === "y"
              );
              if (found) {
                if (x.itemQuantity < found.maxValue) {
                  const updateParam = {
                    storecode: props.vendorInfo?.vendorId,
                    productId: x.itemId,
                    quantity: parseInt(x.itemQuantity) + found.endValue,
                    flightUid: flightUid,
                  };
                  ClientCart.updateService(updateParam, true);
                } else {
                  PushAlert.warning("Maximum Quantity Limit Reached");
                }
              } else {
                const updateParam = {
                  storecode: props.vendorInfo?.vendorId,
                  productId: x.itemId,
                  quantity: parseInt(x.itemQuantity) + 1,
                  flightUid: flightUid,
                };
                ClientCart.updateService(updateParam, true);
              }
            }
          } else {
            if (x.itemId === itemId) {
              let found = props.uom.find(
                (ele) => ele.primaryFlag === "Y" || ele.primaryFlag === "y"
              );
              if (found) {
                if (x.itemQuantity < found.maxValue) {
                  const updateParam = {
                    storecode: props.vendorInfo?.vendorId,
                    productId: x.itemId,
                    quantity: parseInt(x.itemQuantity) + found.endValue,
                    flightUid: "",
                  };
                  ClientCart.updateService(updateParam, true);
                } else {
                  PushAlert.warning("Maximum Quantity Limit Reached");
                }
              } else {
                const updateParam = {
                  storecode: props.vendorInfo?.vendorId,
                  productId: x.itemId,
                  quantity: parseInt(x.itemQuantity) + 1,
                  flightUid: "",
                };
                ClientCart.updateService(updateParam, true);
              }
            }
          }
        });
    }

    // increaseAddOnQuantity();
    // trigger cart re-rendering
    triggerReRender();
  };

  const decreaseItemQuantity = () => {
    const itemId = props.itemId;
    const flightUid =
      props.flight && Object.values(props.flight).length > 0
        ? props.flight.uid
          ? props.flight.uid
          : ""
        : "";

    let cartContents = ClientCart.getCart();

    // update cart quantity
    if (props.itemType === "product") {
      let localAddon = [];
      if (props.addOns) {
        localAddon = JSON.parse(JSON.stringify(props.addOns));
        localAddon = localAddon.map((x) => {
          x.selected = true;
          delete x.quantity;
          delete x.priceToPay;
          return x;
        });
      }

      let localCustomisationPreferences = [];
      if (props.preferences) {
        for (const [key, value] of Object.entries(props.preferences)) {
          const { title, selection } = value;
          const preference = {
            title,
            selection: selection.map(
              ({
                _id,
                name,
                price,
                preferenceDietCategory,
                preferenceSku,
              }) => ({
                _id: _id || preferenceSku,
                preferenceSku,
                name,
                price: price,
                preferenceDietCategory,
              })
            ),
          };

          localCustomisationPreferences.push(preference);
        }
      }

      let item = props.item;
      item.addOn = localAddon;
      item.customisationPreferences = localCustomisationPreferences;

      const updateParam = {
        storeId: props.storeInfo.storeId,
        productId: props.itemId,
        quantity: parseInt(props.itemQuantity) - 1,
        addOn: localAddon || [],
        customisationPreferences: localCustomisationPreferences || [],
        item: item,
      };
      ClientCart.updateProductItem(updateParam, true);
    } else {
      cartContents[props.vendorInfo?.vendorId] &&
        cartContents[props.vendorInfo?.vendorId].items.forEach((x) => {
          if (flightUid !== "") {
            if (x.itemId === itemId && x.flightUid === flightUid) {
              let found = props.uom.find(
                (ele) => ele.primaryFlag === "Y" || ele.primaryFlag === "y"
              );
              if (found) {
                const updateParam = {
                  storecode: props.vendorInfo?.vendorId,
                  productId: x.itemId,
                  quantity: parseInt(x.itemQuantity) - found.endValue,
                  flightUid: flightUid,
                };
                ClientCart.updateService(updateParam, true);
              } else {
                const updateParam = {
                  storecode: props.vendorInfo?.vendorId,
                  productId: x.itemId,
                  quantity: parseInt(x.itemQuantity) - 1,
                  flightUid: flightUid,
                };
                ClientCart.updateService(updateParam, true);
              }
            }
          } else {
            if (x.itemId === itemId) {
              let found = props.uom.find(
                (ele) => ele.primaryFlag === "Y" || ele.primaryFlag === "y"
              );
              if (found) {
                const updateParam = {
                  storecode: props.vendorInfo?.vendorId,
                  productId: x.itemId,
                  quantity: parseInt(x.itemQuantity) - found.endValue,
                  flightUid: "",
                };
                ClientCart.updateService(updateParam, true);
              } else {
                const updateParam = {
                  storecode: props.vendorInfo?.vendorId,
                  productId: x.itemId,
                  quantity: parseInt(x.itemQuantity) - 1,
                  flightUid: "",
                };
                ClientCart.updateService(updateParam, true);
              }
            }
          }
        });
    }

    // decreaseAddOnQuantity();
    // trigger cart re-rendering
    triggerReRender();
  };

  const deleteItem = (event) => {
    const itemId = props.itemId;
    const flightUid =
      props.flight && Object.values(props.flight).length > 0
        ? props.flight.uid
          ? props.flight.uid
          : ""
        : "";
    let cartContents = ClientCart.getCart();

    if (props.itemType === "product") {
      let localAddon = [];
      if (props.addOns) {
        localAddon = JSON.parse(JSON.stringify(props.addOns));
        localAddon = localAddon.map((x) => {
          x.selected = true;
          delete x.quantity;
          delete x.priceToPay;
          return x;
        });
      }

      let localCustomisationPreferences = [];
      if (props.preferences) {
        for (const [key, value] of Object.entries(props.preferences)) {
          const { title, selection } = value;
          const preference = {
            title,
            selection: selection.map(
              ({
                _id,
                name,
                price,
                preferenceDietCategory,
                preferenceSku,
              }) => ({
                _id: _id || preferenceSku,
                preferenceSku,
                name,
                price: price,
                preferenceDietCategory,
              })
            ),
          };

          localCustomisationPreferences.push(preference);
        }
      }

      let item = props.item;
      item.addOn = localAddon;
      item.customisationPreferences = localCustomisationPreferences;

      const updateParam = {
        storeId: props.storeInfo.storeId,
        productId: props.itemId,
        quantity: 0,
        addOn: localAddon || [],
        customisationPreferences: localCustomisationPreferences || [],
        item: item,
      };
      ClientCart.updateProductItem(updateParam, true);
    } else {
      cartContents[props.vendorInfo?.vendorId] &&
        cartContents[props.vendorInfo?.vendorId].items.forEach((x) => {
          if (flightUid !== "") {
            if (x.itemId === itemId && x.flightUid === flightUid) {
              let found = props.uom.find(
                (ele) => ele.primaryFlag === "Y" || ele.primaryFlag === "y"
              );
              if (found) {
                const updateParam = {
                  storecode: props.vendorInfo?.vendorId,
                  productId: x.itemId,
                  quantity: 0,
                  flightUid: flightUid,
                };
                ClientCart.updateService(updateParam, true);
              } else {
                const updateParam = {
                  storecode: props.vendorInfo?.vendorId,
                  productId: x.itemId,
                  quantity: 0,
                  flightUid: flightUid,
                };
                ClientCart.updateService(updateParam, true);
              }
            }
          } else {
            if (x.itemId === itemId) {
              let found = props.uom.find(
                (ele) => ele.primaryFlag === "Y" || ele.primaryFlag === "y"
              );
              if (found) {
                const updateParam = {
                  storecode: props.vendorInfo?.vendorId,
                  productId: x.itemId,
                  quantity: 0,
                  flightUid: "",
                };
                ClientCart.updateService(updateParam, true);
              } else {
                const updateParam = {
                  storecode: props.vendorInfo?.vendorId,
                  productId: x.itemId,
                  quantity: 0,
                  flightUid: "",
                };
                ClientCart.updateService(updateParam, true);
              }
            }
          }
        });
    }
    // trigger cart re-rendering
    triggerReRender();
  };

  const getItemName = () => {
    if (props.itemType !== "product") {
      if (props.ancestors === "Airport cabs") {
        return `${props.vendorInfo?.vendorCode || ""} ${
          props.itemDescription || ""
        }`;
      } else {
        return `${props.itemDescription || ""} ${
          (props.itemSubDescription || props.subDescription) &&
          (props.itemSubDescription || props.subDescription) !== "unknown"
            ? props.itemSubDescription || props.subDescription
            : ""
        }`;
      }
    } else {
      if (props.itemName) {
        return `${props?.itemName} ${
          props?.allAttributes?.length > 0
            ? `(${props?.allAttributes?.join(", ")})`
            : ``
        }`;
      }
    }
    return "";
  };

  return (
    <>
      <Wrapper
        style={
          props.isExpired || !props.isAvailable
            ? { opacity: "0.7", alignItems: "center" }
            : { opacity: "1" }
        }
      >
        <ContentContainer>
          <ProductDetailsWrapper>
            <ItemDeleteIconWrapper onClick={deleteItem}>
              <ItemDeleteIcon src={CloseIcon} />
            </ItemDeleteIconWrapper>
            <ItemDetailsWrapper>
              <ItemName>
                <Text>{getItemName()}</Text>
              </ItemName>
              {props?.allPreferences?.length > 0 && (
                <ItemPreferences>
                  <Text>{props?.allPreferences?.join(", ")}</Text>
                </ItemPreferences>
              )}
              <SpacedBetweenRow>
                <ItemDetails>
                  {!props.isExpired && (
                    <ItemPriceWrapper>
                      <FinalPrice>
                        <Text type="medium">
                          {formatPrice(props?.price?.priceToPay)}
                        </Text>
                      </FinalPrice>
                      {props?.price?.discounts > 0 && (
                        <DiscountedPrice>
                          <Text>{formatPrice(props?.price?.baseTotal)}</Text>
                        </DiscountedPrice>
                      )}
                    </ItemPriceWrapper>
                  )}
                  {props.showDetailButton && (
                    <ItemDetailsText onClick={() => props.onDetailClick()}>
                      <Text type="semi-bold">
                        {props.showCustomisation
                          ? convertSpelling("Customize")
                          : convertSpelling("Details")}
                      </Text>
                    </ItemDetailsText>
                  )}
                </ItemDetails>
                <ItemQty>
                  {!props.isExpired && (
                    <ItemQuantityWrapper>
                      <div className="cart-item-qty-container">
                        <div
                          className="cart-item-counter"
                          onClick={decreaseItemQuantity}
                        >
                          <img
                            className="cart-item-qty-icon"
                            src={MinusIconWhite}
                            alt="minus"
                          />
                        </div>
                        <div className="cart-item-qty">
                          <Text type="semi-bold">{props.itemQuantity}</Text>
                        </div>
                        <div
                          className="cart-item-counter"
                          style={{
                            opacity: props.metadata?.isReadOnly ? "0.5" : "1",
                          }}
                          onClick={
                            props.metadata?.isReadOnly
                              ? null
                              : increaseItemQuantity
                          }
                        >
                          <img
                            className="cart-item-qty-icon"
                            src={PlusIconWhite}
                            alt="minus"
                          />
                        </div>
                      </div>
                    </ItemQuantityWrapper>
                  )}
                </ItemQty>
              </SpacedBetweenRow>
            </ItemDetailsWrapper>
            {props.isExpired ? (
              <div className="item-unavailable-box">
                <Text>Unavailable</Text>
              </div>
            ) : null}
          </ProductDetailsWrapper>
        </ContentContainer>
      </Wrapper>
      {props?.price?.possibleOffers &&
      props?.price?.possibleOffers?.length > 0 ? (
        <div
          className="possible-offers-container"
          style={tooltipOverlay ? { zIndex: "20" } : { zIndex: "0" }}
        >
          <div className="offers-wrapper">
            <img
              className="offers-info-icon"
              src={InfoIcon}
              alt="offers-info-icon"
              data-tip
              data-for={`itemlevel-${props?.itemId}`}
            />
            <div className="possible-offers-text-wrapper">
              <Text type="semi-bold">
                {props?.price?.possibleOffers?.[0]?.message}
              </Text>
            </div>
          </div>
          <ReactTooltip
            id={`itemlevel-${props?.itemId}`}
            place="right"
            className="tooltip-layout"
            backgroundColor="#096b71"
            afterShow={() => setTooltipOverlay(!tooltipOverlay)}
            afterHide={() => setTooltipOverlay(!tooltipOverlay)}
          >
            <div className="tooltip-container">
              <div className="tooltip-title">
                <Text>
                  {props?.price?.possibleOffers?.[0]?.promoDescription}
                </Text>
              </div>
              <div className="tooltip-content">
                <div className="tooltip-start-date">
                  <Text type="semi-bold">
                    Start:{" "}
                    {props?.price?.possibleOffers?.[0]?.startDate
                      ? moment(props?.price?.possibleOffers?.[0]?.startDate)
                          .utc()
                          .format("L")
                      : null}
                  </Text>
                </div>
                <div
                  className="tooltip-end-date"
                  style={{ paddingLeft: "8px" }}
                >
                  <Text type="semi-bold">
                    End:{" "}
                    {props?.price?.possibleOffers?.[0]?.endDate
                      ? moment(props?.price?.possibleOffers?.[0]?.endDate)
                          .utc()
                          .format("L")
                      : null}
                  </Text>
                </div>
              </div>
            </div>
          </ReactTooltip>
        </div>
      ) : null}
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;
const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;

  @media ${device.laptop} {
    gap: 20px;
  }
`;
const ProductImageWrapper = styled.div`
  width: 80px;
  min-width: 80px;
  height: 53px;
  border-radius: 8px;

  @media ${device.laptop} {
    width: 180px;
    min-width: 180px;
    height: 120px;
  }
`;
const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: contain;
`;
const ProductDetailsWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const ItemDeleteIconWrapper = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;
`;
const ItemDeleteIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const ItemDetailsWrapper = styled.div`
  width: 90%;
`;
const SpacedBetweenRow = styled.div`
  width: calc(100% + 10%);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;
const ItemDetails = styled.div``;
const ItemQty = styled.div``;
const ItemName = styled.div`
  width: 90%;
  max-width: 100%;
  font-size: 14px;
  line-height: 19px;
  color: ${colors?.text?.black200};
  word-break: break-word;

  @media ${device.laptop} {
    font-size: 20px;
  }
`;
const ItemPreferences = styled.div`
  width: 85%;
  max-width: 85%;
  font-size: 12px;
  line-height: 19px;
  color: ${colors?.text?.gray200};
  word-break: break-word;
  padding-top: 4px;

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
const StoreName = styled.div`
  font-size: 14px;
  line-height: 18px;
  padding-top: 4px;

  @media ${device.laptop} {
    padding-top: 8px;
    font-size: 18px;
  }
`;
const ItemPriceWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding-top: 8px;
`;
const FinalPrice = styled.div`
  font-size: 14px;
  line-height: 22px;
  color: ${colors?.text?.black300};

  @media ${device.laptop} {
    font-size: 20px;
  }
`;
const DiscountedPrice = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: ${colors?.text?.black200};
  padding-left: 8px;
  text-decoration: line-through;

  @media ${device.laptop} {
    font-size: 18px;
  }
`;
const ItemQuantityWrapper = styled.div`
  width: 100%;
`;
const ItemDetailsText = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: ${colors?.text?.actionTextColor};

  @media ${device.laptop} {
    padding-top: 8px;
    font-size: 14px;
    cursor: pointer;
  }
`;
export default CartItem;
