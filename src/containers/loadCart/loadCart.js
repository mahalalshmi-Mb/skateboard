import React, { Fragment, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { CartContext } from "../../context/cartContext";

const LoadCart = (props) => {
  const ClientCart = useContext(CartContext);
  const [cookies] = useCookies(["gwLoginData"]);

  useEffect(() => {
    //on app load
    if (cookies.gwLoginData) {
      syncCart();
    } else {
      props.setIsCartLoaded(true);
    }
  }, []);

  const syncCart = async () => {
    const apiCalled = await ClientCart.myCart();
    if (apiCalled) {
      props.setIsCartLoaded(true);
    }
  };

  return <Fragment>{props.children}</Fragment>;
};

export default LoadCart;
