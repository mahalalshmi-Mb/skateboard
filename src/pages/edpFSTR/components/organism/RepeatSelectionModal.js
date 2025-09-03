import { useContext, useEffect, useRef, useState } from "react";
import { isDesktop } from "react-device-detect";
import styled from "styled-components";
import callAPI from "../../../../commons/callAPI";
import config from "../../../../commons/config";
import { getAppConfig } from "../../../../commons/util/appConfigHelper";
import { device, formatPrice } from "../../../../commons/util/helperFunctions";
import Util from "../../../../commons/util/util";
import Text from "../../../../components/atoms/Text";
import Loader from "../../../../components/atoms/loader";
import BottomDrawer from "../../../../components/molecules/BottomDrawer/BottomDrawer";
import CustomModal from "../../../../containers/customModal/customModal";
import { CartContext } from "../../../../context/cartContext";
import { NavContext } from "../../../../context/navContext";
import CancelBlack from "../../assets/CancelBlack.svg";
import { colors } from "theme/colors";
import PlusIcon from "../../../../assets/images/commons/plus_blue.svg";
import MinusIcon from "../../../../assets/images/commons/minus_blue.svg";

const RepeatSelectionModal = (props) => {
  const ClientCart = useContext(CartContext);
  const sheetRef = useRef();
  const useNav = useContext(NavContext);

  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState({});
  const [itemDetails, setItemDetails] = useState({});
  const [selectedAddOn, setSelectedAddOn] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [selectedPreference, setSelectedPreference] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const [currentItemId, setCurrentItemId] = useState(props.selectedItemId);
  const [pVariable, setPVariable] = useState([]);
  const [itemQty, setItemQty] = useState(1);

  const [isAdded, setIsAdded] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const [itemWithCustomisationText, setItemWithCustomisationText] =
    useState("");
  const [rerender, setIsRerender] = useState(false);

  const closeModal = () => {
    document.body.style.overflow = "auto";
    const snapTo = (i) => sheetRef.current?.snapTo(i);
    snapTo(1);
    props.onModalHide();
  };

  useEffect(() => {
    useNav.hideAllNavs();

    return () => {
      if (props.isDineIn) {
        useNav.setShowDineInBottomTab(true);
        useNav.hideAllNavs();
      } else {
        useNav.setShowHeaderNav(true);
        useNav.setShowBottomNav(true);
        useNav.setShowFeedback(true);
        useNav.setShowFooter(false);
        if (props.reRender) {
          props.isReRender();
        }
      }
    };
  }, []);

  useEffect(() => {
    if (props?.isDrawerOpen) {
      if (props?.disableDrag) {
        document.body.style.overflow = "hidden";
      }
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  });

  useEffect(() => {
    if (props.reRender) {
      getProductDetails(props.selectedItemId, true);
      const item = props.changeRepeatSelectionItem;

      const updatedAddOn = item.addOn.map((item) => ({
        ...item,
        selected: true,
      }));

      setItemQty(
        ClientCart.getItemQunatityUpdated({
          storeId: item.storeInfo.storeId,
          productId: item.itemId,
          addOn: updatedAddOn,
          customisationPreferences: item.customisationPreferences,
        })
      );
    } else {
      getProductDetails(props.selectedItemId, true);
    }
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
  }, [selectedVariant]);

  useEffect(() => {
    getCartItem();
    checkIsItemAdded(itemDetails);
  }, [
    itemDetails,
    selectedAddOn,
    selectedPreference,
    selectedVariant,
    pVariable,
    rerender,
  ]);

  const getProductId = async () => {
    try {
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
      if (regProductIdResponse.statusCode === 200) {
        if (currentItemId !== regProductIdResponse.data.productId) {
          setCurrentItemId(regProductIdResponse.data.productId);
          getProductDetails(regProductIdResponse.data.productId, false);
        }
      }
    } catch (e) {
      console.log("Get Product ID Error: ", e);
    }
  };

  const getCartItem = () => {
    let cartItem;
    if (props.reRender) {
      const item = props.changeRepeatSelectionItem;

      const updatedAddOn = item.addOn.map((item) => ({
        ...item,
        selected: true,
      }));

      cartItem = ClientCart.getCartItem({
        storeId: item.storeInfo.storeId,
        itemId: item.itemId,
        addOn: updatedAddOn,
        customisationPreferences: item.customisationPreferences,
      });
    } else {
      cartItem = ClientCart.getCartItemVariables({
        storeId: itemDetails.shopId,
        itemId: itemDetails._id,
        pVariables: pVariable,
      });
    }

    setCartItem(cartItem);
    setTotalPrice(Math.round(cartItem?.itemPrice * 100) / 100);
    setItemQty(cartItem?.itemQuantity || cartItem?.itemQty || 1);

    if (cartItem) {
      let pref = "";
      if (cartItem?.customisationAttributes?.length > 0) {
        pref = cartItem.customisationAttributes
          .reduce((acc, cur) => acc.concat(cur.value), [])
          .join("・");
      }
      const addOnTypes = cartItem.addOn.map((addon) => addon.type).join("・");

      let customisationPreferences = "";
      for (const key in cartItem.customisationPreferences) {
        if (cartItem.customisationPreferences.hasOwnProperty(key)) {
          const arr = cartItem.customisationPreferences[key].selection;
          for (const obj of arr) {
            customisationPreferences += obj.name + "・";
          }
        }
      }

      customisationPreferences = customisationPreferences.slice(0, -1);

      // Building the desired string
      let result = ``;
      if (pref !== "") {
        result = `${itemDetails.productName}・${pref}・`;
      } else {
        result = `${itemDetails.productName}・`;
      }
      if (customisationPreferences) {
        result += `${customisationPreferences}・`;
      }
      if (addOnTypes) {
        result += `${addOnTypes}`;
      } else {
        result = result.replace(/・\s*$/, "");
      }
      setItemWithCustomisationText(result);
    }
  };

  const checkIsItemAdded = (itemDetails) => {
    const details = itemDetails;

    let addOn = selectedAddOn.map((item) => ({ ...item, selected: true }));

    const preferences = Object.entries(selectedPreference).map(
      ([key, preferenceValues]) => ({
        preferenceId: preferenceValues[0].preferenceId,
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

    const customisationAttributes = Object.keys(selectedVariant).map((key) => ({
      type: key,
      value: selectedVariant[key].map((item) => item.name),
      isVisible: "Y",
    }));

    details.addOn = addOn;
    details.preferences = preferences;
    details.customisationPreferences = customisationPreferences;
    details.customisationAttributes = customisationAttributes;

    if (props.reRender) {
      const item = props.changeRepeatSelectionItem;

      const updatedAddOn = item.addOn.map((item) => ({
        ...item,
        selected: true,
      }));
      setItemQty(
        ClientCart.getItemQunatityUpdated({
          storeId: item.storeInfo.storeId,
          productId: item.itemId,
          addOn: updatedAddOn,
          customisationPreferences: item.customisationPreferences,
        })
      );
    } else {
    }
    setIsAdded(
      ClientCart.isAlreadyAdded({
        storeId: details.shopId,
        productId: details._id,
      })
    );
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
        setItemDetails(regProductDetailResponse.data.pDetails);
        setResponse(regProductDetailResponse.data);

        const pVariables = regProductDetailResponse.data.pVariables.map(
          (item) => item._id
        );
        setPVariable(pVariables);

        let price = regProductDetailResponse.data.pDetails.price;
        regProductDetailResponse?.data?.pDetails?.productVariants?.map(
          (variant) => {
            const key = variant.attributeName;
            let arr = [];
            arr.push(variant.attributeValues[0]);
            setSelectedVariant((prevState) => ({
              ...prevState,
              [key]: [...arr],
            }));
            price += variant.attributeValues[0]?.price || 0;
          }
        );
        regProductDetailResponse?.data?.masterVariants?.preferences?.map(
          (preference) => {
            if (preference.isMandatory) {
              const key = preference.type;
              let arr = [];
              preference.preferenceValues[0].preferenceId =
                preference._id || preference.preferenceId;
              arr.push(preference.preferenceValues[0]);
              setSelectedPreference((prevState) => ({
                ...prevState,
                [key]: [...arr],
              }));
              price += preference.preferenceValues[0]?.price || 0;
            }
          }
        );
        setTotalPrice(Math.round(price * 100) / 100);
        // checkIsItemAdded(regProductDetailResponse.data.pDetails)
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  function handleIncrement(e) {
    e.stopPropagation();
    const currQty = itemQty + 1;
    setItemQty(currQty);
    if (props.reRender) {
      const item = props.changeRepeatSelectionItem;

      let localCustomisationPreferences = [];
      for (const [key, value] of Object.entries(
        item.customisationPreferences
      )) {
        const { title, selection } = value;
        const preference = {
          title,
          selection: selection.map(
            ({ _id, name, price, preferenceDietCategory, preferenceSku }) => ({
              preferenceSku,
              name,
              price: price,
            })
          ),
        };

        localCustomisationPreferences.push(preference);
      }
      item.customisationPreferences = localCustomisationPreferences;

      const updatedAddOn = item.addOn.map((item) => ({
        ...item,
        selected: true,
      }));
      ClientCart.updateProductItem(
        {
          storeId: item.storeInfo.storeId,
          productId: item.itemId,
          quantity: itemQty + 1,
          addOn: updatedAddOn,
          item: item,
          customisationPreferences: item.customisationPreferences,
        },
        props.skipSaveCart
      );
    } else {
      ClientCart.updateProductItem(
        {
          storeId: itemDetails.shopId,
          productId: itemDetails._id,
          quantity: itemQty + 1,
          // addOn: cartItem.addOn,
          // customisationPreferences: cartItem.customisationPreferences,
          item: cartItem,
          pVariables: pVariable?.length >= 1 ? pVariable : [],
        },
        props.skipSaveCart
      );
    }
    setIsRerender(!rerender);
  }

  function handleDecrement(e) {
    e.stopPropagation();
    const currQty = itemQty - 1;
    setItemQty(currQty);
    if (props.reRender) {
      const item = props.changeRepeatSelectionItem;

      let localCustomisationPreferences = [];
      for (const [key, value] of Object.entries(
        item.customisationPreferences
      )) {
        const { title, selection } = value;
        console.log(title, selection);
        const preference = {
          title,
          selection: selection.map(
            ({ _id, name, price, preferenceDietCategory, preferenceSku }) => ({
              preferenceSku,
              name,
              price: price,
            })
          ),
        };

        localCustomisationPreferences.push(preference);
      }
      item.customisationPreferences = localCustomisationPreferences;

      const updatedAddOn = item.addOn.map((item) => ({
        ...item,
        selected: true,
      }));
      ClientCart.updateProductItem(
        {
          storeId: item.storeInfo.storeId,
          productId: item.itemId,
          quantity: itemQty - 1,
          item: item,
          addOn: updatedAddOn,
          customisationPreferences: item.customisationPreferences,
        },
        props.skipSaveCart
      );
    } else {
      ClientCart.updateProductItem(
        {
          storeId: itemDetails.shopId,
          productId: itemDetails._id,
          quantity: itemQty - 1,
          // addOn: cartItem.addOn,
          // customisationPreferences: cartItem.customisationPreferences,
          item: cartItem,
          pVariables: pVariable?.length >= 1 ? pVariable : [],
        },
        props.skipSaveCart
      );
    }

    if (itemQty - 1 <= 0) {
      props.setShowRepeatSelectionModal(false);
      props.setChangeRepeatSelection(false);
      if (props?.setChangeRepeatSelectionItem)
        props.setChangeRepeatSelectionItem({});
    }
    setIsRerender(!rerender);
  }

  const handleAddNewCustomisation = () => {
    props.setShowRepeatSelectionModal(false);
    props.setChangeRepeatSelection(false);
    props.setChangeRepeatSelectionItem({});
    props.setShowCustomisationModal(true);
    if (props?.setAddNewCustomisation) props.setAddNewCustomisation(true);
    try {
      props.setChangeCartItem(undefined);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeCustomisation = () => {
    const updatedItem = cartItem;
    updatedItem.itemQuantity = itemQty;
    try {
      props.setChangeCartItem(updatedItem);
    } catch (e) {
      console.log(e);
    }
    props.setShowRepeatSelectionModal(false);
    props.setChangeRepeatSelection(true);
    props.setChangeRepeatSelectionItem(updatedItem);
    props.setShowCustomisationModal(true);
  };

  const getItemTotal = () => {
    var totalPrice = 0;
    let customizationPrice = 0;
    if (
      cartItem?.itemQuantity !== undefined &&
      cartItem.itemQuantity !== null
    ) {
      if (
        cartItem?.itemQuantity !== undefined &&
        cartItem.itemQuantity !== null
      ) {
        if (cartItem?.customisationPreferences?.length > 0) {
          customizationPrice = getCustomizationPrice(
            cartItem?.customisationPreferences
          );
        }
        totalPrice +=
          (cartItem.itemPrice + customizationPrice) *
          parseInt(cartItem.itemQuantity);
      }
    } else {
      if (
        cartItem?.itemQuantity !== undefined &&
        cartItem.itemQuantity !== null
      ) {
        customizationPrice = getCustomizationPrice(
          cartItem?.customisationPreferences
        );
        totalPrice += cartItem.itemPrice + customizationPrice;
      }
    }
    return parseFloat(totalPrice);
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

  const renderContent = () => {
    return (
      <Wrapper>
        <ContentWrapper>
          <CancelImageButton
            src={CancelBlack}
            onClick={() => props.onModalHide()}
          />
          <ProductNameAndPriceWrapper>
            <Text>
              {itemDetails?.title?.toLowerCase() ||
                itemDetails?.productName?.toLowerCase()}{" "}
              - {formatPrice(itemDetails?.price || itemDetails?.itemPrice)}
            </Text>
          </ProductNameAndPriceWrapper>
          <CustomisationTextHeaderWrapper>
            <Text type="bold">Your customisations</Text>
          </CustomisationTextHeaderWrapper>
          <MainContentWrapper>
            <ProductCategoryAndChangeWrapper>
              <ChangeButtonWrapper>
                <Text type="bold" onClick={handleChangeCustomisation}>
                  Change
                </Text>
              </ChangeButtonWrapper>
            </ProductCategoryAndChangeWrapper>
            <ProductCustomisationWrapper>
              <Text type="bold">
                {itemWithCustomisationText.toLocaleLowerCase()}
              </Text>
            </ProductCustomisationWrapper>{" "}
            <TotalPriceAndAddButtonWrapper>
              <TotalPriceWrapper>
                <Text type="bold">{formatPrice(getItemTotal())}</Text>
              </TotalPriceWrapper>
              <CounterButton>
                <CounterButtonWrapper onClick={(e) => handleDecrement(e)}>
                  <ItemQtyIcon src={MinusIcon} />
                </CounterButtonWrapper>
                <ItemQuantityWrapper>
                  <Text type="extra-bold">{itemQty}</Text>
                </ItemQuantityWrapper>
                <CounterButtonWrapper onClick={(e) => handleIncrement(e)}>
                  <ItemQtyIcon src={PlusIcon} />
                </CounterButtonWrapper>
              </CounterButton>
            </TotalPriceAndAddButtonWrapper>
          </MainContentWrapper>
        </ContentWrapper>
        <ModalFooterWrapper>
          <AddNewCustomisationWrapper>
            <AddNewCustomisationButton onClick={handleAddNewCustomisation}>
              <Text type="bold">Add new Customisation</Text>
            </AddNewCustomisationButton>
          </AddNewCustomisationWrapper>
        </ModalFooterWrapper>
      </Wrapper>
    );
  };

  if (isDesktop) {
    return (
      <CustomModal
        isOpen={props.showRepeatSelectionModal}
        boxStyle={{
          maxWidth: "570px",
          height: "400px",
          backgroundColor: "#F4F5F5",
        }}
      >
        {isLoading ? (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
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
        isOpen={props.showRepeatSelectionModal}
        setIsOpen={props.setShowRepeatSelectionModal}
        drawerHeight="415px"
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F4F4F5",
          borderRadius: "8px 8px 0px 0px",
        }}
        snapPoints={[1, 0]}
        initialSnap={0}
        disableDrag
        hideHeader={true}
        hideCloseIcon={true}
        handleClose={closeModal}
      >
        {isLoading ? (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        ) : (
          <DrawerContainer>{renderContent()}</DrawerContainer>
        )}
      </BottomDrawer>
    );
  }
};

const AddNewCustomisationWrapper = styled.div({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
});

const TotalPriceAndAddButtonWrapper = styled.div({
  display: "flex",
  justifyContent: "space-between",
  marginTop: "16px",
});
const TotalPriceWrapper = styled.div`
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: center;
  line-height: 22px;
  color: ${colors?.text?.black200};
`;

const CounterButtonWrapper = styled.div`
  display: flex;
  width: 16px;
  height: 16px;
  cursor: pointer;
`;
const ItemQtyIcon = styled.img`
  width: 100%;
  height: 100%;
`;
const ItemQuantityWrapper = styled.div`
  font-weight: 800;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.1px;
  color: ${colors?.text?.actionTextColor};

  @media ${device.laptop} {
    font-size: 14px;
  }
`;
const ProductCustomisationWrapper = styled.div`
  font-weight: 400;
  font-size: 18px;
  display: flex;
  align-items: center;
  margin-top: 12px;
  line-height: 22px;
  color: ${colors?.text?.black900};
  opacity: 0.8;
`;

const ProductCategoryAndChangeWrapper = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
});

const ProductCategoryImage = styled.img({
  width: "12px",
  height: "12px",
});
const ChangeButtonWrapper = styled.div`
  font-weight: 800;
  font-size: 18px;
  display: flex;
  align-items: center;
  color: ${colors?.text?.actionTextColor};
  line-height: 22px;
  cursor: pointer;
`;
const MainContentWrapper = styled.div({
  marginTop: "16px",
  marginLeft: "24px",
  marginRight: "24px",
  background: "#FFFFFF",
  borderRadius: "8px",
  padding: "16px",
});
const CustomisationTextHeaderWrapper = styled.div`
  font-size: 26px;
  color: ${colors?.text?.black200};
  margin-top: 12px;
  margin-left: 24px;
  margin-right: 24px;
  font-weight: 700;
  line-height: 31px;
`;
const ProductNameAndPriceWrapper = styled.div`
  font-size: 16px;
  color: ${colors?.text?.gray300};
  margin-top: 44px;
  margin-left: 24px;
  font-weight: 500;
  line-height: 19px;
`;

const CancelImageButton = styled.img`
  width: 20px;
  height: 20px;
  margin-top: 20px;
  right: 0px;
  position: absolute;
  margin: 20px 24px 0px 24px;
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: calc(100% - 77px);
  max-height: calc(100% - 77px);
  overflow-y: scroll;
  padding-bottom: 32px;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }
`;

const Wrapper = styled.div({
  width: "100%",
  height: "100%",
  position: "relative",
});

const CounterButton = styled.div`
  width: 114px;
  height: 45px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border: 2px solid #dfdfe2;
  border-radius: 8px;
  cursor: pointer;
`;

const AddNewCustomisationButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  height: 45px;
  background: ${colors?.button?.primaryBackground};
  box-shadow: 0px 1px 12px rgba(5, 32, 61, 0.05);
  border-radius: 60px;
  cursor: pointer;
  width: -webkit-fill-available;

  font-weight: 800;
  font-size: 18px;
  line-height: 130%;
  text-align: center;
  color: ${colors?.button?.primaryText};
`;

const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalFooterWrapper = styled.div`
  width: 100%;
  height: 77px;
  padding: 0px 24px;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0px;
  background-color: #ffffff;
  box-shadow: 0px 1px 12px rgba(5, 32, 61, 0.05);

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

export default RepeatSelectionModal;
