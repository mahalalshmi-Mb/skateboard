import { useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import { device, formatPrice } from "../../../../commons/util/helperFunctions";
import Text from "../../../../components/atoms/Text";
import { CartContext } from "../../../../context/cartContext";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import LoginWithoutOtp from "components/organisms/LoginWithoutOtp/LoginWithoutOtp";
import { colors } from "theme/colors";
import { isDesktopDevice } from "commons/util/helperFunctions";

function FloatingCart(props) {
  const ClientCart = useContext(CartContext);

  const { pushHistory } = useCustomNavigation();
  const [cookies] = useCookies(["gwLoginData"]);
  const [isQuickSignInOpen, setIsQuickSignInOpen] = useState(false);

  useEffect(() => {
    if (!isDesktopDevice()) {
      const widgetElement =
        document.getElementsByClassName("userway_buttons_wrapper") || [];
      if (widgetElement.length > 0) {
        const widget = widgetElement[0];
        if (!ClientCart.isEmpty()) {
          widget.style.visibility = "hidden";
        } else {
          widget.style.visibility = "visible";
        }
      }
    }
  }, [ClientCart]);

  const getCartCount = () => {
    var count = 0;
    var totalPrice = 0;
    ClientCart.getItems().forEach((x) => {
      let customizationPrice = 0;
      if (x?.itemQuantity !== undefined && x.itemQuantity !== null) {
        count = count + parseInt(x.itemQuantity);
        if (x?.itemQuantity !== undefined && x.itemQuantity !== null) {
          if (x?.customisationPreferences?.length > 0) {
            customizationPrice = getCustomizationPrice(
              x?.customisationPreferences
            );
          }
          totalPrice +=
            (x.itemPrice + customizationPrice) * parseInt(x.itemQuantity);
        }
      } else {
        if (x?.itemQuantity !== undefined && x.itemQuantity !== null) {
          customizationPrice = getCustomizationPrice(
            x?.customisationPreferences
          );
          totalPrice += x.itemPrice + customizationPrice;
        }
      }
    });
    if (count > 0) {
      if (parseFloat(totalPrice)) {
        return `${parseFloat(count)} ${
          count > 1 ? `items` : `item`
        } | ${formatPrice(totalPrice)}`;
      } else {
        return `${parseFloat(count)} ${count > 1 ? `items` : `item`}`;
      }
    } else {
      return "";
    }
  };

  const getCustomizationPrice = (custArr) => {
    let price = 0;
    custArr.forEach((x) => {
      x.selection.forEach((y) => {
        if (y.pricing) {
          price += y.pricing;
        } else if (y.price) {
          price += y.price;
        }
      });
    });
    return price;
  };

  const handleOpenCart = () => {
    goToCart();
  };

  const goToCart = () => {
    pushHistory("/cartRedirect");
  };

  return (
    !ClientCart.isEmpty() && (
      <>
        <FloatingCartWrapper style={props.wrapperStyle}>
          <FloatingCartButton
            style={props.buttonStyle}
            onClick={() => handleOpenCart()}
          >
            <Text type="bold">{getCartCount()}</Text>
            <Text type="bold">View Cart</Text>
          </FloatingCartButton>
        </FloatingCartWrapper>
        <LoginWithoutOtp
          isDrawerOpen={isQuickSignInOpen}
          setIsDrawerOpen={setIsQuickSignInOpen}
          successHandler={goToCart}
        />
      </>
    )
  );
}

const FloatingCartWrapper = styled.div`
  position: fixed;
  bottom: 0px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0px;
  z-index: 99;

  @media ${device.laptop} {
    display: none;
  }
`;

const FloatingCartButton = styled.div`
  width: 100%;
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 0px 24px;
  background-color: ${colors?.floatCard?.background};
  box-shadow: 0px 4px 27px 0px rgba(0, 0, 0, 0.15);

  color: ${colors?.floatCard?.text};
  border: 1px solid ${colors?.floatCard?.border};
  font-size: 18px;
  line-height: 21px;
  & > div:nth-child(2) {
    text-transform: uppercase;
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default FloatingCart;
