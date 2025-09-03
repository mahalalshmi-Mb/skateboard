import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import moment from "util/momentWrapper";
import config from "../../../../commons/config";
import Text from "../../../../components/atoms/Text";
import { CartContext } from "../../../../context/cartContext";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import { productFulfilmentType } from "../../pages/config/config";
import DisclaimerPrompt from "../../productComponents/organisms/DisclaimerPrompt";
import { useConfig } from "context/configContext";
import { colors } from "theme/colors";
import { device } from "commons/util/helperFunctions";
import { AddButton } from "theme/globalStyleSheet";
import PlusIcon from "../../../../assets/images/commons/plus_blue.svg";
import MinusIcon from "../../../../assets/images/commons/minus_blue.svg";
import PlusIconWhite from "../../../../assets/images/commons/plus_white.svg";
import MinusIconWhite from "../../../../assets/images/commons/minus_white.svg";

const AddToCartButton = (props) => {
  const { timezone, isMultiMerchantAllowed } = useConfig();
  const ClientCart = useContext(CartContext);

  const [showAgeVerificationPrompt, setShowAgeVerificationPrompt] =
    useState(false);
  const storeId = props?.item?.shopId?._id || props?.item?.shopId || "";
  const productId = props?.productId || "";
  const item = props?.item || {};

  // Just to Check if itemWithPreferences
  const product = props.product;
  const addOn = props.addOn;
  const customisationPreferences = props.customisationPreferences;

  const [itemQty, setItemQty] = useState(1);
  const [isAdded, setIsAdded] = useState(
    ClientCart.isAlreadyAdded({
      storeId: storeId,
      productId: productId,
      item: props.item,
      addOn: addOn,
      customisationPreferences: customisationPreferences,
    })
  );

  useEffect(() => {
    setItemQty(
      ClientCart.getItemQunatityUpdated({
        storeId: storeId,
        productId: productId,
        item: props.item,
        addOn: addOn,
        customisationPreferences: customisationPreferences,
      })
    );
    setIsAdded(
      ClientCart.isAlreadyAdded({
        storeId: storeId,
        productId: productId,
        item: props.item,
        addOn: addOn,
        customisationPreferences: customisationPreferences,
      })
    );
  });

  const handleAddClick = (e) => {
    e?.stopPropagation();
    if (!props.doNotUpdateId) {
      if (props.setSelectedItemId) {
        props.setSelectedItemId(productId);
      }
    }
    if (product?.itemWithPreference && !props.noCustomisation) {
      try {
        if (props?.setIsRecommendation) props.setIsRecommendation(true);
        props?.setShowCustomisationModal(true);
      } catch (e) {
        console.log(e);
      }
      try {
        props?.setShowDetailModal(false);
      } catch (e) {
        console.log(e);
      }
      try {
        props?.setShowRepeatSelectionModal(false);
      } catch (e) {
        console.log(e);
      }
    } else {
      handleQuickAdd();
    }
  };

  function handleIncrement(e) {
    e.stopPropagation();

    if (product?.itemWithPreference && !props.noCustomisation && itemQty >= 1) {
      const storeItems = ClientCart.getStoreItems(storeId);
      // props.onModalHide()
      props.setSelectedItemId(
        product._id || item._id || storeItems[storeItems.length - 1].itemId
      );

      if (props.reRender) {
        const currQty = itemQty + 1;
        setItemQty(currQty);
        ClientCart.updateProductItem({
          quantity: itemQty + 1,
          storeId: storeId,
          productId: productId,
          item: item,
          addOn: addOn || [],
          customisationPreferences: customisationPreferences || [],
        });
      } else {
        try {
          props?.setShowRepeatSelectionModal(true);
        } catch (e) {}
        try {
          props?.setShowCustomisationModal(false);
        } catch (e) {}
        try {
          props?.setShowDetailModal(false);
        } catch (e) {}
      }
    } else {
      const currQty = itemQty + 1;
      setItemQty(currQty);
      ClientCart.updateProductItem({
        quantity: itemQty + 1,
        storeId: storeId,
        productId: productId,
        item: item,
        addOn: addOn || [],
        customisationPreferences: customisationPreferences || [],
        pVariables: item?.pVariables?.length >= 1 ? item?.pVariables : [],
      });
    }
    if (props.reRender) {
      props.isReRender();
    }
  }

  function handleDecrement(e) {
    e?.stopPropagation();
    setItemQty(itemQty - 1);
    ClientCart.updateProductItem({
      quantity: itemQty - 1,
      storeId: storeId,
      productId: productId,
      item: item,
      addOn: addOn,
      customisationPreferences: customisationPreferences,
      pVariables: item?.pVariables?.length >= 1 ? item?.pVariables : [],
    });
    if (itemQty - 1 <= 0) {
      try {
        props.setChangeRepeatSelectionItem({});
      } catch (e) {}
      setIsAdded(false);
    }
    if (itemQty - 1 <= 0 && props.reRender) {
      try {
        props?.setShowRepeatSelectionModal(false);
      } catch (e) {}
      props?.setShowCustomisationModal(false);
      props?.setShowDetailModal(false);
    }
    if (props?.reRender && props?.isReRender) {
      props.isReRender();
    }
  }

  const handleQuickAdd = (qty) => {
    const sessionData = getSessionStorage("productsData");
    let selectedAddOns = [];
    const itemId = productId;
    const itemQuantity = qty || 1;
    const itemType = item.type || "product";
    const addOn = selectedAddOns;
    let movementType =
      sessionData?.movementType ||
      item?.movementType?.value ||
      props?.storeDetails?.movementType?.value ||
      "";
    let sector =
      sessionData?.sector ||
      item?.sector?.value ||
      props?.storeDetails?.sector?.value ||
      "";
    let terminal =
      sessionData?.terminal ||
      item?.terminal?.value ||
      props?.storeDetails?.terminal?.value ||
      "";
    let domain =
      sessionData?.domain || item?.domain || props?.storeDetails?.domain || "";
    let deliveryOptions = {};

    if (sessionData?.deliveryOptions) {
      deliveryOptions = sessionData?.deliveryOptions || {};
    } else {
      let qrCodeSrc = getSessionStorage("qrCodeSource");
      const productsData = {
        deliveryOptions: {
          deliveryOption: qrCodeSrc
            ?.toLowerCase()
            ?.includes?.("deliver-to-gate")
            ? config.deliveryOptions.deliveryAtGate
            : config.deliveryOptions.takeaway,
          deliveryTime: moment(new Date(), "UTC", "UTC").format(),
          timezone: timezone,
          isPackagingRequested: true,
          isDelivery: qrCodeSrc?.toLowerCase()?.includes?.("deliver-to-gate")
            ? true
            : false,
        },
        domain: domain || "",
        terminal: terminal || "",
        movementType: movementType || "",
        sector: sector || "",
      };
      setSessionStorage("productsData", productsData);
      deliveryOptions = productsData.deliveryOptions;
    }
    let flightId = "";
    let flightUid = "";
    let fulfilmentType = productFulfilmentType?.takeaway || "";

    if (sessionData?.deliveryOptions?.isDelivery) {
      flightUid = sessionData?.flightDetails?.UID || "";
      flightId = sessionData?.flightDetails?.flightId || "";
      fulfilmentType = productFulfilmentType?.delivery;
    }

    if (isAdded) {
      const updateParam = {
        storecode: storeId,
        productId: item.productId,
        quantity: itemQuantity,
      };

      ClientCart.updateItem(updateParam);
    } else {
      let addParam = {};
      addParam = {
        storecode: storeId,
        storename: item.shopName,
        movementType,
        sector,
        terminal,
        domain,
        fulfilmentType: fulfilmentType,
        item: {
          storeName: item.shopName,
          storeImage: item.shopImage || "",
          storeId: storeId,
          storeTerminal: terminal,
          productSKU: "",
          itemId,
          itemName: item.productName,
          itemPrice: item?.discountPct > 0 ? item?.offerPrice : item?.price,
          itemQuantity,
          itemType,
          addOn,
          deliveryOptions,
          flightId,
          flightUid,
          productSubCategory: item.productSubCategory || [],
          preferences: [],
          customisationPreferences: [],
          customisationAttributes: [],
          domain,
          fulfilmentType: fulfilmentType,
          movementType,
          sector,
          terminal,
        },
      };

      if (ClientCart.addItem(addParam)) {
        // setItemAdded(true);
        setIsAdded(!isAdded);
        if (props.setRecommendationModal) props.setRecommendationModal(true);
        if (props.setIsDrawerOpen) props.setIsDrawerOpen(false);
        if (props.setRecommendationList)
          props.setRecommendationList(props?.item?.recommendation || []);
      }
      if (props.reRender) {
        props.isReRender();
      }
    }
  };

  const handleAddButtonClick = (e) => {
    e?.stopPropagation();
    const data = ClientCart.hasMultiStoreItems(storeId, item.shopName);
    if (data?.hasMultiStoreItems && !isMultiMerchantAllowed) {
      if (props?.setMultiStoreData) {
        props?.setMultiStoreData({
          hasMultiStoreItems: data?.hasMultiStoreItems,
          oldStore: data?.oldStore,
          newStore: data?.newStore,
        });
      }
      if (props?.setShowMultiStoreCheckModal) {
        props?.setShowMultiStoreCheckModal(true);
      }
    } else {
      if (props.ageVerificationReq && !getSessionStorage("isAgeDeclared")) {
        setShowAgeVerificationPrompt(true);
      } else {
        handleAddClick(e);
      }
    }
  };

  if (isAdded) {
    return (
      <AddButton
        isAdded={isAdded}
        width={props.buttonWidth}
        style={props.addButtonStyle}
      >
        <ButtonIconWrapper onClick={(e) => handleDecrement(e)}>
          <ItemQtyIcon src={MinusIconWhite} />
        </ButtonIconWrapper>
        <ItemQuantityWrapper>
          <Text type="semi-bold">{itemQty}</Text>
        </ItemQuantityWrapper>
        <ButtonIconWrapper onClick={(e) => handleIncrement(e)}>
          <ItemQtyIcon src={PlusIconWhite} />
        </ButtonIconWrapper>
      </AddButton>
    );
  } else {
    if (props.isModal) {
      return (
        <>
          <ModalAddButton onClick={(e) => handleAddButtonClick(e)}>
            <Text type="bold">ADD</Text>
          </ModalAddButton>
          {showAgeVerificationPrompt && (
            <DisclaimerPrompt
              isDrawerOpen={showAgeVerificationPrompt}
              setIsDrawerOpen={setShowAgeVerificationPrompt}
              successHandler={handleAddClick}
            ></DisclaimerPrompt>
          )}
        </>
      );
    } else {
      return (
        <>
          <AddButton
            isAdded={isAdded}
            onClick={(e) => handleAddButtonClick(e)}
            style={props.addButtonStyle}
          >
            <Text type="medium">ADD</Text>
          </AddButton>
          {showAgeVerificationPrompt && (
            <DisclaimerPrompt
              isDrawerOpen={showAgeVerificationPrompt}
              setIsDrawerOpen={setShowAgeVerificationPrompt}
              successHandler={handleAddClick}
            ></DisclaimerPrompt>
          )}
        </>
      );
    }
  }
};

const ModalAddButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: ${colors?.button?.primaryBackground};
  border-radius: 60px;
  cursor: pointer;
  width: 192px;
  height: 44px;
  box-shadow: 0px 1px 12px rgba(5, 32, 61, 0.05);
  font-weight: 800;
  font-size: 18px;
  line-height: 21px;
  color: ${colors?.button?.primaryText};
`;

const ButtonIconWrapper = styled.div`
  display: flex;
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const ItemQuantityWrapper = styled.div`
  font-weight: 800;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.1px;
  color: ${colors?.text?.tertiaryText};

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
const ItemQtyIcon = styled.img`
  width: 100%;
  height: 100%;
`;

export default AddToCartButton;
