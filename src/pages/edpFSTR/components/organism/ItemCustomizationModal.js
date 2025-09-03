import { useConfig } from "context/configContext";
import { useContext, useEffect, useRef, useState } from "react";
import { isDesktop, isMobile } from "react-device-detect";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";
import moment from "util/momentWrapper";
import callAPI from "../../../../commons/callAPI";
import config from "../../../../commons/config";
import { getAppConfig } from "../../../../commons/util/appConfigHelper";
import {
  device,
  formatPrice,
  isDesktopDevice,
  isValidPrice,
  sortObject,
} from "../../../../commons/util/helperFunctions";
import Util from "../../../../commons/util/util";
import Text from "../../../../components/atoms/Text";
import Loader from "../../../../components/atoms/loader";
import PushAlert from "../../../../components/atoms/pushAlert";
import BottomDrawer from "../../../../components/molecules/BottomDrawer/BottomDrawer";
import CustomModal from "../../../../containers/customModal/customModal";
import { CartContext } from "../../../../context/cartContext";
import { NavContext } from "../../../../context/navContext";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import CancelBlack from "../../assets/CancelBlack.svg";
import { productFulfilmentType } from "../../pages/config/config";
import CustomisationView from "../molecules/CustomisationView";
import { ErrorText } from "pages/profile/subPages/personalDetails/style";
import { colors } from "theme/colors";
import { AddButton } from "theme/globalStyleSheet";
import ProductFallbackImg from "../../assets/Fallback Images/product-fallback-large.svg";
import ReadMore from "components/atoms/readMore";
import { convertSpelling } from "commons/util/spellingHelper";

const ItemCustomizationModal = (props) => {
  const ClientCart = useContext(CartContext);
  const sheetRef = useRef();
  const useNav = useContext(NavContext);
  const { preferencePreselection: _preferencePreselection, timezone } =
    useConfig();

  const [preferencePreselection] = useState(!_preferencePreselection);

  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState({});
  const [itemDetails, setItemDetails] = useState({});
  const [itemPreferences, setItemPreferences] = useState([]);
  const [initialPreferences, setInitialPreferences] = useState([]);
  const [selectedAddOn, setSelectedAddOn] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [selectedPreference, setSelectedPreference] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const [currentItemId, setCurrentItemId] = useState(props.selectedItemId);
  const [itemQty, setItemQty] = useState(1);

  const [isAdded, setIsAdded] = useState(false);

  const [repeatSelectionChangedVariant, setRepeatSelectionChangedVariant] =
    useState(false);

  const [customizedError, setCustomizedError] = useState("");
  const [isAddButtonLoading, setIsAddButtonLoading] = useState(false);
  const [pVariable, setPVariable] = useState([]);
  const [previousPreference, setPreviousPreference] = useState(
    props?.changeCartItem?.customisationPreferences ||
      props?.changeRepeatSelectionItem?.customisationPreferences ||
      []
  );

  const closeModal = () => {
    document.body.style.overflow = "auto";
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    props.onModalHide();
  };

  useEffect(() => {
    // document.getElementsByTagName("body")[0].style.overflow = "hidden";
    useNav.hideAllNavs();

    return () => {
      // useNav.showAllNavs();
      // useNav.showFooterNavs();

      if (props.isDineIn) {
        useNav.setShowDineInBottomTab(true);
        useNav.hideAllNavs();
      } else {
        useNav.setShowHeaderNav(true);
        useNav.setShowBottomNav(true);
        useNav.setShowFeedback(true);
        useNav.setShowFooter(false);
      }
    };
  }, []);

  useEffect(() => {
    const prevItemPreference =
      props?.changeCartItem?.customisationPreferences?.length > 0
        ? props?.changeCartItem?.customisationPreferences
        : props?.changeRepeatSelectionItem?.customisationPreferences?.length > 0
        ? props?.changeRepeatSelectionItem?.customisationPreferences
        : [];
    if (prevItemPreference) {
      setPreviousPreference(
        prevItemPreference?.map((preference) => ({
          title: preference?.title,
          selection: preference?.selection,
        }))
      );
    }
  }, []);

  useEffect(() => {
    props?.changeCartItem?.attributeList?.forEach((attribute) => {
      const key = attribute?.attributeName;

      let arr = [];
      arr.push({
        attributeValue: attribute?.attributeValues?.[0]?.attributeValue || "",
        attributeDietCategory:
          attribute?.attributeValues?.[0]?.attributeDietCategory || "",
      });

      setSelectedVariant((prevState) => ({
        ...prevState,
        [key]: [...arr],
      }));
    });
    props?.changeCartItem?.customisationAttributes?.forEach((attribute) => {
      const key = attribute?.type;

      let arr = [];
      arr.push({
        attributeValue: attribute?.value[0],
        attributeDietCategory: props?.changeCartItem?.productSubCategory,
      });
      setSelectedVariant((prevState) => ({
        ...prevState,
        [key]: [...arr],
      }));
    });
  }, []);

  useEffect(() => {
    getProductDetails(props.selectedItemId, true);
    let addOn = selectedAddOn.map((item) => ({ ...item, selected: true }));

    const customisationPreferences = [];

    for (const [title, selection] of Object.entries(selectedPreference)) {
      // const preferenceId = selection[0].preferenceId;

      const preference = {
        // _id: preferenceId,
        title,
        selection: selection.map(
          ({ _id, name, price, preferenceDietCategory, preferenceSku }) => ({
            _id: _id || preferenceSku,
            preferenceSku,
            name,
            price: price,
            preferenceDietCategory,
          })
        ),
      };

      customisationPreferences.push(preference);
    }
    setItemQty(
      ClientCart.getItemQunatityUpdated({
        storeId: itemDetails.shopId,
        productId: itemDetails._id,
        addOn: addOn,
        customisationPreferences: customisationPreferences,
        item: itemDetails,
      })
    );
  }, []);

  useEffect(() => {
    if (
      itemDetails &&
      itemDetails?.shopId &&
      itemDetails?._id &&
      itemDetails?.ancestorId
    ) {
      getProductId();
    }
    if (props.changeCartItem !== undefined) {
      let arr = props?.changeCartItem?.addOn || [];
      let updatedSelectedItem = selectedAddOn;
      for (var i = 0; i < arr.length; i++) {
        delete arr[i].selected;
      }

      for (var i = 0; i < arr.length; i++) {
        var existingItem = updatedSelectedItem.find(function (item) {
          return item.addonId === arr[i].addonId;
        });

        if (!existingItem) {
          updatedSelectedItem.push(arr[i]);
        }
      }
      setSelectedAddOn((prevState) => ([...prevState], updatedSelectedItem));
    }
  }, [selectedVariant]);

  useEffect(() => {
    if (props.changeCartItem !== undefined && itemPreferences.length > 0) {
      const customisationPreferences = {};

      props.changeCartItem?.customisationPreferences &&
        Array.isArray(props.changeCartItem?.customisationPreferences) &&
        props.changeCartItem?.customisationPreferences?.forEach(
          (preference) => {
            const preferenceValue = itemPreferences.find(
              (pref) => pref.type === preference.title
            );
            const preferenceItems = preference.selection.map(
              ({ _id, name, price, preferenceDietCategory, preferenceSku }) => {
                if (preferenceValue?.preferenceValues?.[0]?._id) {
                  return {
                    preferenceSku,
                    name,
                    price,
                    preferenceId: preferenceValue?.preferenceId,
                  };
                } else {
                  return {
                    preferenceSku,
                    name,
                    price,
                    preferenceId: preferenceValue?.preferenceId,
                  };
                }
              }
            );
            customisationPreferences[preference.title] = preferenceItems;
          }
        );
      setSelectedPreference(customisationPreferences);
    }
    if (
      props.changeRepeatSelectionItem !== undefined &&
      Object.keys(props.changeRepeatSelectionItem).length !== 0 &&
      itemPreferences.length > 0
    ) {
      const customisationPreferences = {};

      props.changeRepeatSelectionItem?.customisationPreferences?.forEach(
        (preference) => {
          const preferenceValue = itemPreferences.find(
            (pref) => pref.type === preference.title
          );
          const preferenceItems = preference.selection.map(
            (preferenceSelection) => {
              if (preferenceValue?.preferenceValues?.[0]?._id) {
                return {
                  ...preferenceSelection,
                  preferenceId: preferenceValue?.preferenceId,
                };
              } else {
                delete preferenceSelection._id;
                return {
                  ...preferenceSelection,
                  preferenceId: preferenceValue?.preferenceId,
                };
              }
            }
          );
          customisationPreferences[preference.title] = preferenceItems;
        }
      );
      setSelectedPreference(customisationPreferences);
    }
  }, [props.changeRepeatSelectionItem, itemDetails]);

  useEffect(() => {
    checkIsItemAdded(itemDetails);
    const addonPrice = selectedAddOn.reduce(
      (total, item) => total + item.price,
      0
    );

    let preferencePrice = 0;
    for (let key in selectedPreference) {
      if (selectedPreference.hasOwnProperty(key)) {
        let choice = selectedPreference[key];
        for (let i = 0; i < choice.length; i++) {
          preferencePrice += choice[i].price;
        }
      }
    }

    const price = itemDetails.price + addonPrice + preferencePrice;
    setTotalPrice(Math.round(price * 100) / 100);
  }, [itemDetails, selectedAddOn, selectedPreference, selectedVariant]);

  useEffect(() => {
    if (
      itemDetails &&
      itemDetails?._id &&
      Object.keys(itemDetails).length > 0
    ) {
      Util.sendMessageToReactNative("product_customized", itemDetails);
      Util.triggerMoEngageEvent("product_viewed", itemDetails, {
        trigger_modal: "item_customization",
      });
    }
    const cartItem = ClientCart.getCartItemVariables({
      storeId: itemDetails.shopId,
      itemId: itemDetails._id,
      pVariables: pVariable,
    });
    if (
      !props?.addNewCustomisation &&
      props?.setChangeRepeatSelectionItem &&
      cartItem
    ) {
      props.setChangeRepeatSelectionItem(cartItem);
    }
    if (
      !props?.addNewCustomisation &&
      cartItem &&
      Array.isArray(
        cartItem?.customisationPreferences ||
          (cartItem?.customisationAttributes &&
            Object.keys(cartItem?.customisationAttributes))
      ) &&
      props?.setChangeRepeatSelection
    ) {
      props.setChangeRepeatSelection(true);
    }
  }, [itemDetails]);

  useEffect(() => {
    if (
      !props?.addNewCustomisation &&
      props?.changeRepeatSelectionItem &&
      props?.changeRepeatSelectionItem?.customisationAttributes &&
      props?.changeRepeatSelectionItem?.customisationAttributes?.length > 0
    ) {
      props?.changeRepeatSelectionItem?.customisationAttributes?.forEach(
        (attribute) => {
          const key = attribute?.type;

          let arr = [];
          arr.push({
            attributeValue: attribute?.value[0],
            attributeDietCategory:
              props?.changeRepeatSelectionItem?.productSubCategory,
          });
          setSelectedVariant((prevState) => ({
            ...prevState,
            [key]: [...arr],
          }));
          setRepeatSelectionChangedVariant(true);
        }
      );
    }
  }, [props?.changeRepeatSelectionItem]);

  const getProductId = async () => {
    try {
      setIsAddButtonLoading(true);
      let attributes = Object.entries(selectedVariant).map(
        ([type, values]) => ({
          type,
          value: values.map((v) => v.attributeValue),
        })
      );
      let productIdResponse = await callAPI.post(
        config.api.products.getProductId,
        {
          shopId: itemDetails.shopId,
          productId: itemDetails._id,
          ancestorsId: itemDetails.ancestorId,
          attributes: attributes,
        }
      );
      let regProductIdResponse = await productIdResponse.json();
      if (regProductIdResponse.status === 200) {
        if (currentItemId !== regProductIdResponse.data.productId) {
          setCurrentItemId(regProductIdResponse.data.productId);
          getProductDetails(regProductIdResponse.data.productId, false);
        } else {
          setIsAddButtonLoading(false);
        }
      }
    } catch (e) {
      console.log("Get Product ID Error: ", e);
    }
  };

  const checkIsItemAdded = (itemDetails) => {
    const details = itemDetails;

    let addOn = selectedAddOn.map((item) => ({ ...item, selected: true }));

    const preferences = Object.entries(selectedPreference).map(
      ([key, preferenceValues]) => ({
        _id: preferenceValues[0]?.preferenceId,
        values: preferenceValues.map((item) => item._id),
      })
    );

    let customisationPreferences = [];

    for (const [title, selection] of Object.entries(selectedPreference)) {
      // const preferenceId = selection[0].preferenceId;

      const preference = {
        // _id: preferenceId,
        title,
        selection: selection.map(
          ({ _id, name, price, preferenceDietCategory, preferenceSku }) => ({
            preferenceSku,
            name,
            price: price,
          })
        ),
      };

      customisationPreferences.push(preference);
    }

    if (customisationPreferences && Array.isArray(customisationPreferences)) {
      customisationPreferences = customisationPreferences?.filter(
        (item) => Array.isArray(item?.selection) && item?.selection?.length >= 1
      );
    } else {
      customisationPreferences = [];
    }

    const customisationAttributes = Object.keys(selectedVariant).map((key) => ({
      type: key,
      value: selectedVariant[key].map((item) => item.attributeValue),
      isVisible: "Y",
    }));

    details.addOn = addOn;
    details.preferences = preferences;
    details.customisationPreferences = customisationPreferences;
    details.customisationAttributes = customisationAttributes;

    setItemQty(
      ClientCart.getItemQunatityUpdated({
        storeId: details.shopId,
        productId: details._id,
        addOn: addOn,
        customisationPreferences: customisationPreferences,
        item: itemDetails,
      })
    );

    if (props.changeCartItem !== undefined) {
      setIsAdded(
        ClientCart.isPresentInCart({
          storeId: details.shopId,
          productId: details._id,
          addOn: addOn,
          customisationPreferences: customisationPreferences,
        })
      );
    } else {
      setIsAdded(
        ClientCart.isAlreadyAddedUpdated({
          storeId: details.shopId,
          productId: details._id,
          addOn: addOn,
          customisationPreferences: customisationPreferences,
        })
      );
    }
  };

  const getProductDetails = async (itemId) => {
    try {
      let productDetailResponse = await callAPI.post(
        config.api.products.productDetails,
        {
          itemId: itemId,
          rule_id: [],
          tags: "",
          subCategory: "",
          bookingSource: getAppConfig("CALL_PROMO_API")
            ? Util.getBookingSource()
            : "",
        }
      );
      let regProductDetailResponse = await productDetailResponse.json();
      if (regProductDetailResponse.status === 200) {
        const pVariables = regProductDetailResponse?.data?.pVariables.map(
          (item) => item._id
        );
        setPVariable(pVariables || []);
        if (
          props?.changeRepeatSelectionItem !== undefined &&
          Object.keys(props.changeRepeatSelectionItem).length !== 0 &&
          !repeatSelectionChangedVariant
        ) {
          if (regProductDetailResponse?.data?.masterVariants?.productVariants) {
            regProductDetailResponse.data.masterVariants.productVariants =
              regProductDetailResponse?.data?.masterVariants?.productVariants?.filter(
                (f) => f.isChoice === true
              );
          }

          if (regProductDetailResponse?.data?.pDetails?.attributeList) {
            regProductDetailResponse.data.pDetails.attributeList =
              regProductDetailResponse?.data?.pDetails?.attributeList?.filter(
                (f) => f.isChoice === true
              );
          }
          props.changeRepeatSelectionItem?.customisationAttributes?.forEach(
            (attribute) => {
              const key = attribute?.type;

              let arr = [];
              arr.push({
                attributeValue: attribute?.value[0],
                attributeDietCategory:
                  props.changeRepeatSelectionItem?.productSubCategory,
                // price: props.changeRepeatSelectionItem?.itemPrice,
              });
              setSelectedVariant((prevState) => ({
                ...prevState,
                [key]: [...arr],
              }));
              setRepeatSelectionChangedVariant(true);
            }
          );
        } else {
          if (regProductDetailResponse?.data?.masterVariants?.productVariants) {
            regProductDetailResponse.data.masterVariants.productVariants =
              regProductDetailResponse?.data?.masterVariants?.productVariants?.filter(
                (f) => f.isChoice === true
              );
          }

          if (regProductDetailResponse?.data?.pDetails?.attributeList) {
            regProductDetailResponse.data.pDetails.attributeList =
              regProductDetailResponse?.data?.pDetails?.attributeList?.filter(
                (f) => f.isChoice === true
              );
          }

          regProductDetailResponse?.data?.pDetails?.attributeList?.map(
            (variant) => {
              if (Object.keys(selectedVariant).length === 0) {
                if (props.changeCartItem !== undefined) {
                  const cartItem = JSON.parse(
                    JSON.stringify(props.changeCartItem)
                  );
                  let attributeList;

                  cartItem.attributeList = cartItem?.attributeList?.filter(
                    (f) => f.isChoice === true
                  );

                  if (props.changeCartItem.attributeList) {
                    attributeList = cartItem.attributeList;
                  } else {
                    attributeList = cartItem.customisationAttributes;
                  }

                  for (let i = 0; i < attributeList.length; i++) {
                    const attribute = attributeList[i];
                    const value = attribute?.attributeValues?.[0];

                    const key = attribute.attributeName;

                    let arr = [];
                    arr.push({
                      attributeValue: value?.attributeValue,
                      attributeDietCategory: value?.attributeDietCategory,
                      // price: cartItem?.price?.basePrice,
                    });

                    // setSelectedVariant((prevState) => ({
                    //   ...prevState,
                    //   [key]: [...arr],
                    // }));
                  }
                } else {
                  const key = variant.attributeName;
                  let arr = [];
                  arr.push(variant.attributeValues[0]);
                  // setSelectedVariant((prevState) => ({
                  //   ...prevState,
                  //   [key]: [...arr],
                  // }));
                }
              }
            }
          );
        }
        if (!preferencePreselection) {
          regProductDetailResponse?.data?.pDetails?.preferences?.map(
            (preference) => {
              if (
                preference.isMandatory &&
                Object.keys(selectedPreference).length === 0
              ) {
                if (props.changeCartItem !== undefined) {
                  const prefs = props.changeCartItem.customisationPreferences;
                  const matchingItems = prefs.find(
                    (item) => item.title === preference.type
                  );
                  let arr = [];

                  if (matchingItems) {
                    const objSelectionIds = matchingItems.selection.map(
                      (item) => item._id
                    );
                    let value = preference.preferenceValues.filter((val) =>
                      objSelectionIds.includes(val._id)
                    );
                    value = value.map((item) => ({
                      ...item,
                      preferenceId: preference._id || preference.preferenceId,
                    }));
                    arr = value;
                  }
                  setSelectedPreference((prevState) => ({
                    ...prevState,
                    [preference.type]: [...arr],
                  }));
                } else {
                  const key = preference.type;
                  let arr = [];
                  preference.preferenceValues[0].preferenceId =
                    preference._id || preference.preferenceId;
                  arr.push(preference.preferenceValues[0]);
                  setSelectedPreference((prevState) => ({
                    ...prevState,
                    [key]: [...arr],
                  }));
                }
              }
            }
          );
        }
        const updatedPrefs =
          regProductDetailResponse?.data?.pDetails?.preferences?.map(
            (pref) => ({
              ...pref,
              value: pref.preferenceValues.map((item) => ({
                ...item,
                preferenceId: pref._id || pref.preferenceId,
              })),
              preferencePreselection: preferencePreselection,
            })
          );
        const recommendationList =
          regProductDetailResponse.data?.recommendation || [];
        setItemPreferences(updatedPrefs);
        setInitialPreferences(updatedPrefs);
        setResponse(regProductDetailResponse.data);
        setItemDetails(regProductDetailResponse?.data?.pDetails);
        setIsLoading(false);
        setIsAddButtonLoading(false);
        if (props?.setRecommendationList)
          props?.setRecommendationList(recommendationList);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddOnCheckboxClick = (e, addOn) => {
    var foundObj = selectedAddOn.find(function (obj) {
      return JSON.stringify(obj) === JSON.stringify(addOn);
    });

    if (foundObj) {
      e.stopPropagation();
      let arr = selectedAddOn;
      var index = arr.findIndex(function (obj) {
        return JSON.stringify(obj) === JSON.stringify(addOn);
      });
      if (index !== -1) {
        arr.splice(index, 1);
      }
      setSelectedAddOn((prevState) => ([...prevState], [...arr]));
    } else {
      let arr = selectedAddOn;
      arr.push(addOn);
      setSelectedAddOn([...arr]);
    }
  };

  const handleVariantCheckboxClick = (e, value, variant) => {
    const key = variant.attributeName;

    // Get the current list of selected preferences
    const currentSelection = selectedVariant[key] ?? [];

    if (
      currentSelection.length === 1 &&
      JSON.stringify(currentSelection[0]) === JSON.stringify(value)
    ) {
      // Do nothing if the only selected variant is the one being deselected
      return;
    }

    const matchingItems = currentSelection.filter(
      (item) => JSON.stringify(item) === JSON.stringify(value)
    );

    if (matchingItems.length > 0) {
      let variant = { ...selectedVariant };
      delete variant[key];

      setSelectedVariant(variant);
      setSelectedPreference({});
      setSelectedAddOn([]);
      handleCustomizationError(variant);
    } else {
      let obj = { ...selectedVariant };
      obj[key] = [value];
      setSelectedVariant(obj);
      setSelectedPreference({});
      setSelectedAddOn([]);
      handleCustomizationError(obj);
    }
  };

  const handleCustomizationError = (variant) => {
    if (
      response?.masterVariants?.productVariants &&
      (Array.isArray(variant)
        ? variant.length > 0
        : Object.keys(variant).length > 0)
    ) {
      setCustomizedError();
    } else {
      setCustomizedError(
        "Please select all mandatory items from the customization options."
      );
    }
  };

  const handlePreferenceCheckboxClick = (e, value, preference) => {
    const key = preference.type;
    value.preferenceId = preference?._id || preference?.preferenceId;
    const updatedValue = sortObject(value);
    delete updatedValue["preferenceDietCategory"];
    delete updatedValue["isActive"];

    // Get the current list of selected preferences
    const currentSelection = selectedPreference[key] ?? [];
    let updatedSelection;

    if (preference.singleSelect) {
      const matchingItems = currentSelection.filter((item) => {
        const sortedItem = sortObject(item);
        return JSON.stringify(sortedItem) === JSON.stringify(updatedValue);
      });
      if (matchingItems.length > 0) {
        // Deselect the preference if it is already selected
        updatedSelection = { ...selectedPreference };
        delete updatedSelection[key];
        setSelectedPreference(updatedSelection);
        updatePreferences(itemPreferences, key, true);
      } else {
        // Select the preference, deselecting any currently selected preference
        updatedSelection = {
          ...selectedPreference,
          [key]: [updatedValue],
        };
        setSelectedPreference(updatedSelection);
        updatePreferences(itemPreferences, key, false);
      }
    } else {
      const matchingItems = currentSelection.filter((item) => {
        const sortedItem = sortObject(item);
        return JSON.stringify(sortedItem) === JSON.stringify(updatedValue);
      });

      if (matchingItems.length > 0) {
        // Deselect the preference
        updatedSelection = {
          ...selectedPreference,
          [key]: currentSelection.filter((val) => {
            const sortedVal = sortObject(val);
            return JSON.stringify(sortedVal) !== JSON.stringify(updatedValue);
          }),
        };
        setSelectedPreference(updatedSelection);

        if (updatedSelection[key].length === 0) {
          updatePreferences(itemPreferences, key, true);
        }
      } else {
        // Select the preference
        updatedSelection = {
          ...selectedPreference,
          [key]: [...currentSelection, updatedValue],
        };
        setSelectedPreference(updatedSelection);
        updatePreferences(itemPreferences, key, false);
      }
    }
    if (customizedError) {
      handleCustomizedError(updatedSelection);
    }
  };

  const handleCustomizedError = (updatedSelection) => {
    const checkMandatorySelection = checkMandatorySelections(updatedSelection);
    if (checkMandatorySelection) {
      setCustomizedError();
    } else {
      setCustomizedError(
        "Please select all mandatory items from the customization options."
      );
    }
  };

  const updatePreferences = (itemPreferences, key, status) => {
    const updatedPreferences = itemPreferences.map((pref) => {
      if (pref.type === key) {
        return {
          ...pref,
          preferencePreselection: status,
        };
      }
      return pref;
    });
    setItemPreferences(updatedPreferences);
  };

  const handleQuickAdd = (qty) => {
    // setItemQty(1);

    // let addOn = selectedAddOn
    const sessionData = getSessionStorage("productsData");
    let addOn = selectedAddOn.map((item) => ({ ...item, selected: true }));
    //check mandatory items are selected
    const checkMandatorySelection =
      checkMandatorySelections(selectedPreference);
    const customisationAttributes = Object.keys(selectedVariant).map((key) => ({
      type: key,
      value: selectedVariant[key].map((item) => item.attributeValue),
      isVisible: "Y",
    }));
    const isCheckMasterVariants = checkMasterVariants(customisationAttributes);
    if (checkMandatorySelection && isCheckMasterVariants) {
      const itemId = itemDetails._id;
      let quantity;
      if (isAdded) {
        quantity = itemQty + 1;
      } else {
        quantity = 1;
      }
      if (qty) {
        quantity = qty;
      }
      // const itemQuantity = qty || 1;
      const itemType =
        itemDetails.type === undefined ? "product" : itemDetails.type;
      // const addOn = selectedAddOns
      let movementType =
        sessionData?.movementType ||
        itemDetails?.movementType?.value ||
        props?.storeDetails?.movementType?.value ||
        "";
      let sector =
        sessionData?.sector ||
        itemDetails?.sector?.value ||
        props?.storeDetails?.sector?.value ||
        "";
      let terminal =
        sessionData?.terminal ||
        itemDetails?.terminal?.value ||
        props?.storeDetails?.terminal?.value ||
        "";
      let domain =
        sessionData?.domain ||
        itemDetails?.domain ||
        props?.storeDetails?.domain ||
        "";
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
        fulfilmentType = productFulfilmentType?.delivery || "";
      }

      const preferences = Object.entries(selectedPreference).map(
        ([key, preferenceValues]) => ({
          preferenceId: preferenceValues[0]?.preferenceId,
          values: preferenceValues.map(
            (item) => item?._id || item?.preferenceSku
          ),
        })
      );

      const customisationPreferences = [];

      for (const [title, selection] of Object.entries(selectedPreference)) {
        // const preferenceId = selection[0].preferenceId;

        const preference = {
          // _id: preferenceId,
          title,
          selection: selection.map(
            ({ _id, name, price, preferenceDietCategory, preferenceSku }) => ({
              preferenceSku,
              name,
              price: price,
            })
          ),
        };

        customisationPreferences.push(preference);
      }

      if (isAdded) {
        const updateParam = {
          storeId: itemDetails.shopId,
          productId: itemDetails._id,
          quantity: quantity,
          addOn: addOn,
          customisationPreferences: customisationPreferences,
          item: itemDetails,
        };
        ClientCart.updateProductItem(updateParam, props.skipSaveCart);
      } else {
        let addParam = {};
        addParam = {
          storecode: itemDetails.shopId,
          storename: itemDetails.shopName,
          movementType,
          sector,
          terminal,
          domain,
          fulfilmentType: fulfilmentType,
          item: {
            storeName: itemDetails.shopName,
            storeImage: itemDetails.shopImage || "",
            storeId: itemDetails.shopId,
            storeTerminal: terminal,
            productSKU: "",
            itemId,
            itemName: itemDetails.productName,
            itemPrice: Number(itemDetails?.price),
            itemQuantity: quantity,
            itemType,
            addOn,
            deliveryOptions,
            flightId,
            flightUid,
            productSubCategory: itemDetails.dietCategory || [],
            // productImage: itemDetails.productImageUrl,
            preferences: preferences,
            customisationPreferences: customisationPreferences,
            customisationAttributes: customisationAttributes,
            domain,
            fulfilmentType: fulfilmentType,
            movementType,
            sector,
            terminal,
          },
        };

        if (ClientCart.addItem(addParam, props.skipSaveCart)) {
          // setItemAdded(true);
          setIsAdded(!isAdded);
        }
      }
      setCustomizedError();
      closeModal();
      if (props?.setRecommendationModal) props?.setRecommendationModal(true);
      if (props?.setIsRecommendation) props?.setIsRecommendation(false);
      if (props.reRender) {
        props.isReRender();
      }
    } else {
      setCustomizedError(
        "Please select all mandatory items from the customization options."
      );
    }
  };

  const checkMandatorySelections = (selectedPreference) => {
    const mandatoryPreferenceIds = new Set(
      initialPreferences
        .filter((item) => item.isMandatory)
        .map((item) => item.preferenceId)
    );

    const selectedIds = Object.values(selectedPreference)
      .filter((items) => items.length > 0)
      .map((items) => items[0].preferenceId);
    const allMandatorySelected = [...mandatoryPreferenceIds].every((id) =>
      selectedIds.includes(id)
    );
    return allMandatorySelected;
  };

  const checkMasterVariants = (customisationAttributes) => {
    if (response?.masterVariants?.productVariants) {
      if (customisationAttributes && customisationAttributes.length > 0)
        return true;
      return false;
    }
    return true;
  };

  const handleUpdate = () => {
    //check mandatory items are selected
    const checkMandatorySelection =
      checkMandatorySelections(selectedPreference);
    if (checkMandatorySelection) {
      let changeRepeatSelectionItem =
        props.changeRepeatSelectionItem || props.changeCartItem;

      if (currentItemId !== changeRepeatSelectionItem.itemId) {
        if (isAdded) {
          if (props.changeCartItem !== undefined) {
            PushAlert.info("Item with this combination already exists");
            setCustomizedError("Item with this combination already exists");
            setTimeout(() => {
              setCustomizedError();
            }, 2000);
            return;
          }
        }
        ClientCart.removeProductItem(
          {
            storeId:
              changeRepeatSelectionItem?.storeId ||
              changeRepeatSelectionItem?.storeInfo?.storeId,
            productId: changeRepeatSelectionItem?.itemId,
            addOn: changeRepeatSelectionItem?.addOn,
            customisationPreferences:
              changeRepeatSelectionItem?.customisationPreferences,
          },
          props.skipSaveCart
        );
        handleQuickAdd(changeRepeatSelectionItem?.itemQuantity);
        if (props.reRender) {
          props.isReRender();
        }
        return;
      }
      // if ()
      let addOnChanged = false;
      let addOn = selectedAddOn.map((item) => ({ ...item, selected: true }));
      if (
        JSON.stringify(addOn) ===
        JSON.stringify(changeRepeatSelectionItem.addOn)
      ) {
        addOnChanged = false;
      } else {
        addOnChanged = true;
      }

      let preferenceChanged = false;

      const preferences = Object.entries(selectedPreference).map(
        ([key, preferenceValues]) => ({
          preferenceId: preferenceValues[0]?.preferenceId,
          values: preferenceValues.map(
            (item) => item._id || item.preferenceSku
          ),
        })
      );

      const customisationPreferences = [];

      for (const [title, selection] of Object.entries(selectedPreference)) {
        // const preferenceId = selection[0].preferenceId;
        const preference = {
          // _id: preferenceId,
          title,
          selection: selection.map(
            ({ _id, name, price, preferenceDietCategory, preferenceSku }) => ({
              preferenceSku,
              name,
              price: price,
            })
          ),
        };

        customisationPreferences.push(preference);
      }

      if (
        JSON.stringify(customisationPreferences) ===
        JSON.stringify(changeRepeatSelectionItem.customisationPreferences)
      ) {
        preferenceChanged = false;
      } else {
        preferenceChanged = true;
      }

      let quantity;
      if (isAdded) {
        if (
          props?.changeCartItem !== undefined ||
          props?.changeRepeatSelectionItem !== undefined
        ) {
          PushAlert.info("Item with this combination already exists");
          setCustomizedError("Item with this combination already exists");
          setTimeout(() => {
            setCustomizedError();
          }, 2000);
          return;
        }
        quantity = changeRepeatSelectionItem.itemQuantity + 1;
      } else {
        quantity = changeRepeatSelectionItem.itemQuantity;
      }

      changeRepeatSelectionItem = {
        ...changeRepeatSelectionItem,
        addOn: changeRepeatSelectionItem.addOn.map((item) => ({
          ...item,
          selected: true,
        })),
      };
      if (preferenceChanged && addOnChanged) {
        ClientCart.updateRepatedItem(
          {
            item: changeRepeatSelectionItem,
            storeId:
              changeRepeatSelectionItem.storeId ||
              changeRepeatSelectionItem.storeInfo.storeId,
            productId: changeRepeatSelectionItem.itemId,
            quantity: quantity,
            itemPrice: Number(itemDetails?.price),
            customisationPreferences: customisationPreferences,
            addOn: addOn,
            preferences: preferences,
            previousPreference: previousPreference,
          },
          props.skipSaveCart
        );
      } else if (addOnChanged) {
        ClientCart.updateRepatedItem(
          {
            item: changeRepeatSelectionItem,
            storeId:
              changeRepeatSelectionItem.storeId ||
              changeRepeatSelectionItem.storeInfo.storeId,
            productId: changeRepeatSelectionItem.itemId,
            quantity: quantity,
            itemPrice: Number(itemDetails?.price),
            addOn: addOn,
            customisationPreferences:
              changeRepeatSelectionItem.customisationPreferences,
            previousPreference: previousPreference,
          },
          props.skipSaveCart
        );
      } else {
        ClientCart.updateRepatedItem(
          {
            item: changeRepeatSelectionItem,
            storeId:
              changeRepeatSelectionItem.storeId ||
              changeRepeatSelectionItem.storeInfo.storeId,
            productId: changeRepeatSelectionItem.itemId,
            quantity: quantity,
            itemPrice: Number(itemDetails?.price),
            addOn: changeRepeatSelectionItem.addOn,
            customisationPreferences: customisationPreferences,
            preferences: preferences,
            previousPreference: previousPreference,
          },
          props.skipSaveCart
        );
      }
      setCustomizedError();
      closeModal();
      if (props?.setChangeRepeatSelection)
        props.setChangeRepeatSelection(false);
      if (props?.setRecommendationModal) props?.setRecommendationModal(true);
      if (props?.setIsRecommendation) props?.setIsRecommendation(false);
      if (props.reRender) {
        props.isReRender();
      }
    } else {
      setCustomizedError(
        "Please select all mandatory items from the customization options."
      );
    }
  };

  const getProductImage = () => {
    if (getAppConfig("SHOW_PRODUCT_IMAGES_V2")) {
      const found = itemDetails?.productImageUrl?.find(
        (x) =>
          (x?.type?.toLowerCase() || x?.imageType?.toLowerCase()) ===
            "regular" && x?.isActive?.toLowerCase() === "y"
      );
      if (found) {
        return found.imageUrl || found.imageURL || "";
      } else {
        return "";
      }
    } else {
      const found = itemDetails?.productImageUrl?.find(
        (x) =>
          (x?.platform?.toLowerCase() === "web" ||
            x?.platform?.toLowerCase() === "marketplace") &&
          (x?.type?.toLowerCase() || x?.imageType?.toLowerCase()) === "small" &&
          x?.isActive?.toLowerCase() === "y"
      );
      if (found) {
        return found.imageUrl || found.imageURL || "";
      } else {
        return "";
      }
    }
  };

  const renderContent = () => {
    return (
      <Wrapper>
        <ContentWrapper showFullContent={!itemDetails?.itemWithPreference}>
          <CancelImageContainer
            onClick={() => {
              if (props?.setChangeRepeatSelection)
                props.setChangeRepeatSelection(false);
              if (props?.setIsRecommendation) props?.setIsRecommendation(false);
              closeModal();
            }}
          >
            <CancelImageButton src={CancelBlack} />
          </CancelImageContainer>
          <BannerWrapper>
            {getProductImage() !== "" && (
              <BannerImage
                src={getProductImage()}
                onError={(e) => {
                  e.target.src = ProductFallbackImg;
                }}
                showV2Image={getAppConfig("SHOW_PRODUCT_IMAGES_V2")}
              />
            )}
            <DetailsWrapper>
              <ShopNameWrapper>
                <Text>{itemDetails?.shopName}</Text>
              </ShopNameWrapper>
              <ProductNameAndPriceWrapper>
                <Text type="semi-bold">
                  {itemDetails?.title || itemDetails?.productName}
                </Text>
              </ProductNameAndPriceWrapper>
              <ProductNameAndPriceWrapper>
                <Text type="semi-bold">
                  {itemDetails?.itemWithPreference &&
                  isValidPrice(itemDetails?.priceRange?.minPrice) &&
                  isValidPrice(itemDetails?.priceRange?.maxPrice) &&
                  itemDetails?.priceRange?.minPrice !==
                    itemDetails?.priceRange?.maxPrice
                    ? `${formatPrice(
                        itemDetails?.priceRange?.minPrice
                      )} - ${formatPrice(itemDetails?.priceRange?.maxPrice)}`
                    : formatPrice(itemDetails?.price)}
                </Text>
              </ProductNameAndPriceWrapper>
              {itemDetails?.description?.longDescription &&
                itemDetails?.description?.longDescription?.length > 0 && (
                  <ItemDescriptionWrapper
                    showFullContent={!itemDetails?.itemWithPreference}
                  >
                    <Text>
                      {ReactHtmlParser(
                        itemDetails?.description?.longDescription || ""
                      )}
                    </Text>
                  </ItemDescriptionWrapper>
                )}
            </DetailsWrapper>
          </BannerWrapper>
          {itemDetails?.itemWithPreference && (
            <CustomisationWrapper>
              <CustomiseTextHeaderWrapper>
                <Text type="bold">
                  {convertSpelling("Customize your item")}
                </Text>
              </CustomiseTextHeaderWrapper>
              <Divider></Divider>
              <AddOnVariantWrapper>
                {response?.masterVariants?.productVariants?.length > 0 &&
                  response?.masterVariants?.productVariants.map(
                    (variant, index) => {
                      return (
                        <CustomisationView
                          key={index}
                          index={index}
                          selectionType={variant.attributeName + " [Required]"}
                          selectionsAvailable={variant.attributeValues}
                          selectedItems={
                            selectedVariant[variant.attributeName] || []
                          }
                          onCheckClick={(e, value) =>
                            handleVariantCheckboxClick(e, value, variant)
                          }
                          singleSelect={true}
                        ></CustomisationView>
                      );
                    }
                  )}
                <CustomisationViewWrapper>
                  {itemPreferences?.length > 0 &&
                    itemPreferences.map((preference, index) => {
                      return (
                        <CustomisationView
                          key={index}
                          selectionType={
                            preference.isMandatory
                              ? preference.type + " [Required]"
                              : preference.type
                          }
                          selectionsAvailable={preference.preferenceValues}
                          selectedItems={
                            selectedPreference[preference.type] || []
                          }
                          onCheckClick={(e, value) =>
                            handlePreferenceCheckboxClick(e, value, preference)
                          }
                          singleSelect={preference.singleSelect}
                        ></CustomisationView>
                      );
                    })}
                </CustomisationViewWrapper>
                <CustomisationViewWrapper>
                  {response?.pDetails?.addons?.length > 0 && (
                    <CustomisationView
                      selectionType={"ADD ONS"}
                      selectionsAvailable={response?.pDetails?.addons}
                      selectedItems={selectedAddOn}
                      onCheckClick={(e, addOn) =>
                        handleAddOnCheckboxClick(e, addOn)
                      }
                    ></CustomisationView>
                  )}
                </CustomisationViewWrapper>
              </AddOnVariantWrapper>
            </CustomisationWrapper>
          )}
        </ContentWrapper>
        <ModalFooterWrapper customizedError={customizedError}>
          <ErrorWrapper>
            {customizedError && (
              <ErrorText>
                <Text>{customizedError}</Text>
              </ErrorText>
            )}
          </ErrorWrapper>
          <PriceAddButtonWrapper>
            <TotalPriceWrapper>
              <Text type="bold">{formatPrice(totalPrice)}</Text>
            </TotalPriceWrapper>
            {(props.changeRepeatSelection &&
              props?.changeRepeatSelectionItem &&
              Object.keys(props?.changeRepeatSelectionItem).length !== 0) ||
            props.updateCartItem ? (
              <AddButton
                isAdded={false}
                disabled={isAddButtonLoading}
                onClick={() => handleUpdate()}
              >
                <Text type="medium">Update</Text>
              </AddButton>
            ) : (
              <AddButton
                isAdded={false}
                disabled={isAddButtonLoading}
                onClick={() => handleQuickAdd()}
              >
                <Text type="medium">ADD</Text>
              </AddButton>
            )}
          </PriceAddButtonWrapper>
        </ModalFooterWrapper>
      </Wrapper>
    );
  };

  if (isDesktop) {
    return (
      <CustomModal
        isOpen={props.isDrawerOpen}
        boxStyle={{
          maxWidth: "570px",
          backgroundColor: "#F4F5F5",
          maxHeight: "500px",
        }}
      >
        {isLoading ? (
          <ModalContainer>
            <Loader />
            <CancelImageContainer onClick={() => closeModal()}>
              <CancelImageButton src={CancelBlack} />
            </CancelImageContainer>
          </ModalContainer>
        ) : (
          <ModalContainer>
            <ModalContentContainer>{renderContent()}</ModalContentContainer>
          </ModalContainer>
        )}
      </CustomModal>
    );
  } else {
    return (
      <BottomDrawer
        sheetRef={sheetRef}
        isOpen={props.isDrawerOpen}
        setIsOpen={props.setIsDrawerOpen}
        drawerHeight="100%"
        modalContainerStyle={{ minHeight: "80%", backgroundColor: "#F4F4F5" }}
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F4F4F5",
          borderRadius: "8px 8px 0px 0px",
          minHeight: "80%",
        }}
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag={true}
        hideHeader={true}
        hideCloseIcon={true}
        handleClose={closeModal}
      >
        {isLoading ? (
          <DrawerContainer>
            <Loader />
            <CancelImageContainer>
              <CancelImageButton
                src={CancelBlack}
                onClick={() => closeModal()}
              />
            </CancelImageContainer>
          </DrawerContainer>
        ) : (
          <DrawerContainer>{renderContent()}</DrawerContainer>
        )}
      </BottomDrawer>
    );
  }
};

const TotalPriceWrapper = styled.div`
  font-weight: 800;
  font-size: 18px;
  display: flex;
  align-items: center;
  line-height: 21px;
  color: ${colors?.text?.black200};
`;

const PriceAddButtonWrapper = styled.div({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
});

const AddOnVariantWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-bottom: 80px;
  max-height: 400px;
  scrollbar-width: none;
  gap: 24px 0px;

  @media ${device.tablet} {
    max-height: 250px;
  }

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }
`;
const Divider = styled.div`
  margin: 8px 24px;
  border: 1px solid #000;
  opacity: 0.1;
`;
const CustomiseTextHeaderWrapper = styled.div`
  font-size: 22px;
  color: ${colors?.text?.black200};
  margin-top: 8px;
  margin-left: 24px;
  margin-right: 24px;
  font-weight: 700;
  line-height: 31px;
  display: flex;
  width: 100%;
`;
const ProductNameAndPriceWrapper = styled.div`
  width: 90%;
  font-size: 16px;
  color: ${colors?.text?.black200};
  font-weight: 500;
  line-height: 19px;
  margin-top: 8px;
`;

const CancelImageButton = styled.img`
  width: 20px;
  height: 20px;
`;

const CancelImageContainer = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  right: 0px;
  top: 16px;
  position: absolute;
  margin: 0px 24px 0px 20px;
  cursor: pointer;
  border-radius: 50%;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: ${({ showFullContent }) =>
    showFullContent ? "70vh" : "calc(100% - 77px)"};
  max-height: ${({ showFullContent }) =>
    showFullContent ? "70vh" : "calc(100% - 77px)"};
  overflow-y: ${({ showFullContent }) =>
    showFullContent ? "scroll" : "hidden"};
  overflow-y: scroll;
  min-height: 300px;
  padding-bottom: 32px;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }

  @media ${device.laptop} {
    padding-bottom: ${({ showFullContent }) =>
      showFullContent ? "100px" : "32px"};
  }
`;

const Wrapper = styled.div({
  width: "100%",
  height: "100%",
  position: "relative",
});

const ModalFooterWrapper = styled.div`
  width: 100%;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  height: ${({ customizedError }) =>
    customizedError ? (isMobile ? "118px" : "100px") : "77px"};
  align-items: center;
  position: fixed;
  bottom: 0px;
  background-color: #ffffff;
  box-shadow: 0px 1px 12px rgba(5, 32, 61, 0.05);
  z-index: 99;

  @media ${device.laptop} {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }
`;
const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const ModalContentContainer = styled.div`
  width: 100%;
  height: 100%;
`;
const DrawerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const ErrorWrapper = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;
const CustomisationViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px 0px;
`;
const BannerWrapper = styled.div`
  margin-top: 16px;
  width: 100%;
  padding: 0px 24px;
`;
const DetailsWrapper = styled.div``;
const BannerImage = styled.img`
  width: ${({ showV2Image }) => (showV2Image ? "141px" : "146px")};
  height: ${({ showV2Image }) => (showV2Image ? "93px" : "146px")};
  object-fit: contain;
  border-radius: ${({ showV2Image }) => (showV2Image ? "12px" : "0px")};

  float: left;
  margin-right: 24px;
`;
const BannerImageWrapper = styled.div`
  width: 146px;
  height: 146px;
`;
const ShopNameWrapper = styled.div`
  width: 90%;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  margin-top: 16px;
  letter-spacing: 0.1em;
  color: ${colors?.text?.black200};
`;
const ItemDescriptionWrapper = styled.div`
  margin: 8px 0px 0px 0px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${colors?.text?.black900};
  scrollbar-width: none;

  overflow-y: ${({ showFullContent }) =>
    showFullContent ? "fit-content" : "scroll"};
  height: ${({ showFullContent }) =>
    showFullContent ? "fit-content" : "100%"};
  max-height: ${({ showFullContent }) =>
    showFullContent ? "fit-content" : "100px"};

  @media ${device.tablet} {
    max-height: ${({ showFullContent }) =>
      showFullContent ? "fit-content" : "80px"};
  }
`;
const CustomisationWrapper = styled.div`
  width: 100%;
`;

export default ItemCustomizationModal;
