import React, { useContext, useEffect } from "react";
import { CartContext } from "../../../context/cartContext";
import { useHistory } from "react-router-dom";
import { NavContext } from "../../../context/navContext";
import Loader from "../../../components/atoms/loader";
import useCustomNavigation from "../../../hooks/useCustomNavigation";

function CartRedirect(props) {
  const history = useHistory();
  const { replaceHistory } = useCustomNavigation();
  const useNav = useContext(NavContext);
  const ClientCart = useContext(CartContext);

  useEffect(() => {
    useNav.hideAllNavs();

    return () => {
      useNav.showAllNavs();
    };
  }, [props.location]);

  useEffect(() => {
    handleCartRedirect();
  }, []);

  const handleCartRedirect = async () => {
    const saved = await ClientCart.saveCart(false);
    replaceHistory("/cart");
  };

  return <Loader></Loader>;
}

export default CartRedirect;
