import { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import moment from "util/momentWrapper";
import IllustrationImage from "../../../../assets/images/couponListing/illustrationImage.svg";
import EmptyCouponImg from "../../../../assets/images/couponListing/noCoupons.png";
import callAPI from "../../../../commons/callAPI";
import config from "../../../../commons/config";
import { getAppConfig } from "../../../../commons/util/appConfigHelper";
import {
  decode,
  device,
  getUserInfo,
  isLoggedIn,
} from "../../../../commons/util/helperFunctions";
import Util from "../../../../commons/util/util";
import Text from "../../../../components/atoms/Text";
import Loader from "../../../../components/atoms/loader";
import { CartContext } from "../../../../context/cartContext";
import { NavContext } from "../../../../context/navContext";
import { PrimaryButton } from "../../../../theme/globalStyleSheet";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import { colors } from "theme/colors";
import { productDomain } from "pages/edpFSTR/pages/config/config";

function CouponListing(props) {
  const history = useHistory();
  const useNav = useContext(NavContext);
  const ClientCart = useContext(CartContext);

  const [isLoading, setIsLoading] = useState(true);
  const [promoCode, setPromoCode] = useState(
    getSessionStorage("couponCode") || ""
  );
  const [availablePromo, setAvailablePromo] = useState(
    getSessionStorage("availablePromo")
  );
  const [couponList, setCouponList] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const [dineInSessionData] = useState(getSessionStorage("dine-in"));
  const [isDineIn] = useState(dineInSessionData?.storeId || "" !== "");
  const [dutyFreeSessionData] = useState(getSessionStorage("productsData"));
  const [isDutyFree] = useState(
    dutyFreeSessionData?.domain === productDomain?.dutyFree
  );

  useEffect(() => {
    if (isMobile) {
      useNav.hideFooterNavs();
      useNav.hideBottomNavs();
    } else {
      useNav.showFooterNavs();
    }
    useNav.showHeaderGoBack();

    getPriceSummary();

    return () => {
      useNav.showFooterNavs();
      useNav.hideHeaderGoBack();
      useNav.showBottomNavs();
    };
  }, [useNav]);

  const checkPayRedir = () => {
    const redirStr = window.sessionStorage.getItem("payRedir");
    let redirObj;

    if (
      !(
        void 0 === redirStr ||
        "" === redirStr ||
        " " === redirStr ||
        null === redirStr
      )
    ) {
      redirObj = JSON.parse(redirStr);

      ClientCart.set(redirObj);
    }

    window.sessionStorage.setItem("payRedir", "");

    return redirObj;
  };

  const getPriceSummary = async () => {
    const sessRef = checkPayRedir();
    let reqData = ClientCart.isEmpty()
      ? sessRef && ClientCart.isEmpty(sessRef)
        ? ClientCart.getItems()
        : ClientCart.getItems(sessRef)
      : ClientCart.getItems();

    let ruleId = "";
    let cartArray = [...reqData];
    cartArray.forEach((ele) => {
      ele.ruleId = ruleId;
    });
    let promo = ClientCart.isEmpty()
      ? ""
      : promoCode
      ? promoCode.toUpperCase()
      : "";

    let source = "";
    if (isDineIn) {
      source = "dine-in";
    }
    if (isDutyFree) {
      source = `${
        getAppConfig("BOOKING_SOURCE") || ""
      }-${dutyFreeSessionData?.domain
        ?.replaceAll(" ", "")
        .toLowerCase()}-${dutyFreeSessionData?.movementType?.toLowerCase()}`;
    }

    setIsLoading(true);
    try {
      let apiResponse = await callAPI.patch(
        config.api.cart.summary,
        {
          promo,
          ruleId,
          items: cartArray,
          rules: getAppConfig("CALL_PROMO_API")
            ? availablePromo?.data || []
            : [],
          source: {
            name: getAppConfig("CALL_PROMO_API") ? Util.getBookingSource() : "",
            type: source,
            channel: getAppConfig("POS_APP_ID"),
            partnerId: "",
            platform: getAppConfig("platform") || "",
          },
        },
        "",
        true
      );

      let regResponse = await apiResponse.json();

      if (regResponse.status === 200) {
        if (isLoggedIn()) {
          getCoupons(regResponse);
        } else {
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCoupons = async (priceSummary) => {
    const userDetails = await getUserInfo();
    let userId = "";
    if (userDetails?.userId) {
      userId = decode(userDetails?.userId);
    }
    const coupons = await getCouponList(userId, priceSummary);
    const appliedCoupon = getSessionStorage("appliedCoupon");
    if (appliedCoupon && appliedCoupon?.coupon) {
      setSelectedCoupon(appliedCoupon?.coupon);
    }
    setCouponList(coupons);
    setIsLoading(false);
  };

  const getCouponList = async (userId, priceSummary) => {
    try {
      const reqBody = {
        customerId: userId,
        cartSummary: priceSummary,
        bookingChannel: Util.getBookingSource(),
      };
      const apiURL = config.api.getCoupons;
      let apiResponse = await callAPI.patch(apiURL, reqBody);
      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        return regResponse.data;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleApplyCoupon = (obj) => {
    let applicablePromo =
      JSON.parse(JSON.stringify(getSessionStorage("availablePromo"))) || {};
    let appliedCoupon = getSessionStorage("appliedCoupon");

    if (applicablePromo && Object.keys(applicablePromo)?.length === 0) {
      let tempObj = {};
      let tempData = [];
      let couponData = [];
      couponData?.push(obj?.coupon);
      tempData?.push({ couponCode: couponData });
      tempObj.data = tempData;
      applicablePromo = tempObj;
    } else {
      if (applicablePromo?.data?.[0]?.couponCode) {
        if (!applicablePromo?.data?.[0]?.couponCode?.includes(obj?.coupon)) {
          applicablePromo?.data?.[0]?.couponCode?.push(obj?.coupon);
        }
        if (appliedCoupon && appliedCoupon?.coupon) {
          if (
            applicablePromo?.data?.[0]?.couponCode.includes(
              appliedCoupon.coupon?.toLowerCase()
            )
          ) {
            applicablePromo?.data?.[0]?.couponCode?.splice(
              applicablePromo?.data?.[0]?.couponCode.indexOf(
                appliedCoupon.coupon?.toLowerCase()
              ),
              1
            );
          }
        }
      } else {
        let arr = [];
        arr?.push(obj?.coupon);
        applicablePromo.data[0].couponCode = arr;
      }
    }
    obj.showAppliedCouponModal = true;
    setSelectedCoupon(obj?.coupon);

    setSessionStorage("availablePromo", applicablePromo);
    setSessionStorage("appliedCoupon", obj);
    props?.setAppliedCouponObj(obj);

    Util.triggerMoEngageEvent("apply_coupon", {
      couponName: obj?.coupon || "",
      couponDiscountPercentage: obj?.discOff || "",
      ruleId: obj?.ruleId || "",
      promoId: obj?.promoId || "",
    });
    props?.setShowCoupon(false);
    props?.setShowAppliedCouponModal(true);
    if (props?.reRender) {
      props?.isReRender();
    }
  };

  const handleRemovePromo = (coupon) => {
    let applicablePromo = getSessionStorage("availablePromo");
    if (applicablePromo && applicablePromo?.data?.[0]?.couponCode) {
      applicablePromo?.data?.[0]?.couponCode?.splice(
        applicablePromo?.data?.[0]?.couponCode?.indexOf(coupon.toLowerCase()),
        1
      );
    }
    setAvailablePromo(applicablePromo);
    setSessionStorage("availablePromo", applicablePromo);
    setSessionStorage("appliedCoupon", {});
    setSelectedCoupon();
    getPriceSummary();
  };

  const handleBackToCart = () => {
    props.setShowCoupon(false);
  };

  if (isLoading) {
    return <Loader height="auto" />;
  } else {
    return (
      <Wrapper>
        {couponList?.length > 0 && (
          <PageIllustraionImageContainer>
            <PageIllustraionImage src={IllustrationImage} />
          </PageIllustraionImageContainer>
        )}
        <CouponTextBox>
          <Text type="semi-bold">Have a Coupon?</Text>
          <CustomTextField
            placeholder="Enter discount code"
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e?.target?.value)}
          />
          <Button
            onClick={() => {
              handleApplyCoupon({
                coupon: couponCode?.toLowerCase(),
              });
            }}
          >
            <Text type={"bold"}>Apply</Text>
          </Button>
        </CouponTextBox>
        {couponList?.length > 0 ? (
          <ContentContainer>
            <CouponListingContainer>
              {couponList?.map((item, index) => (
                <CouponCard
                  key={index}
                  style={{
                    opacity:
                      selectedCoupon === item.coupon?.toLowerCase()
                        ? "0.7"
                        : "1",
                  }}
                >
                  <CouponCardContentWrapper>
                    <CouponCardTitleWrapper>
                      <CouponCardTitle>
                        <Text type="bold">{item.coupon}</Text>
                      </CouponCardTitle>
                      <CouponCardApply
                        onClick={() =>
                          selectedCoupon !== item.coupon?.toLowerCase()
                            ? handleApplyCoupon({
                                coupon: item?.coupon?.toLowerCase(),
                              })
                            : handleRemovePromo(item?.coupon?.toLowerCase())
                        }
                      >
                        <Text
                          type="semi-bold"
                          style={{
                            color:
                              selectedCoupon === item.coupon?.toLowerCase()
                                ? "#E58364"
                                : `${colors.primary}`,
                            cursor: "pointer",
                          }}
                        >
                          {selectedCoupon === item.coupon?.toLowerCase()
                            ? "Remove"
                            : "Apply"}
                        </Text>
                      </CouponCardApply>
                    </CouponCardTitleWrapper>
                    <CouponCardDiscount>
                      <Text type="bold">{item.discOff}</Text>
                    </CouponCardDiscount>
                    <HorzDivider />
                    <CouponCardDesc>
                      <Text>{item.promoDescription}</Text>
                    </CouponCardDesc>
                  </CouponCardContentWrapper>
                  <CouponCardValidity>
                    <Text type="semi-bold">
                      Valid Until : {moment(item.endDate).format("L")}
                    </Text>
                  </CouponCardValidity>
                </CouponCard>
              ))}
            </CouponListingContainer>
          </ContentContainer>
        ) : (
          <EmptyCouponContainer>
            <EmptyCouponImage src={EmptyCouponImg} />
            <EmptyCouponTitle>
              <Text type="bold">Aha, No coupons found at this moment</Text>
            </EmptyCouponTitle>
            <EmptyCouponSubTitle>
              <Text>Explore a variety of shops, services and restaurants.</Text>
            </EmptyCouponSubTitle>
            <GoToCartButtonContainer>
              <GoToCartButton onClick={() => handleBackToCart()}>
                <Text type="bold">Go Back to Cart</Text>
              </GoToCartButton>
            </GoToCartButtonContainer>
          </EmptyCouponContainer>
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const PageIllustraionImageContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
`;
const PageIllustraionImage = styled.img``;
const ContentContainer = styled.div`
  width: 100%;
  padding: 24px;
  max-height: 250px;
  overflow-y: auto;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
    scrollbar-width: none;
  }
`;
const CouponListingContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const CustomTextField = styled.input`
  display: flex;
  width: 100%;
  height: 54px;
  font-size: 18px;
  text-align: start;
  text-indent: 20px;
  border: 1px solid rgba(34, 34, 34, 0.7);
  border-radius: 8px;
  text-transform: none;
  outline: none;
  color: ${colors?.text?.black300};
  background-color: transparent;
  z-index: 9;
`;
const CouponCard = styled.div`
  width: 100%;
  border-radius: 8px;
  border: 1px solid #dfdfe2;
  background-color: #fff;
  position: relative;
  z-index: 1;
`;
const CouponCardContentWrapper = styled.div`
  width: 100%;
  padding: 18px 18px 0px 18px;
`;
const CouponCardTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const CouponCardTitle = styled.div`
  color: ${colors?.text?.black200};
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
`;
const CouponCardApply = styled.div`
  color: ${colors?.text?.actionTextColor};
  font-size: 14px;
  font-weight: 600;
`;
const CouponCardDiscount = styled.div`
  color: ${colors?.text?.black200};
  font-size: 20px;
  font-weight: 700;
  padding-top: 6px;
`;
const HorzDivider = styled.div`
  width: 100%;
  height: 1px;
  margin: 12px 0px;
  background-color: #dfdfe2;
`;
const CouponCardDesc = styled.div`
  color: ${colors?.text?.black200};
  font-size: 16px;
  font-weight: 500;
  opacity: 0.7;
  padding-bottom: 12px;
`;
const CouponCardValidity = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0px;
  background: rgba(4, 173, 170, 0.1);

  color: ${colors?.text?.black200};
  font-size: 14px;
  font-weight: 600;
  opacity: 0.7;
`;
const EmptyCouponContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const EmptyCouponImage = styled.img`
  width: 25%;
`;
const EmptyCouponTitle = styled.div`
  color: ${colors?.text?.black200};
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  line-height: 32px;
  padding: 46px 40px 0px 40px;
`;
const EmptyCouponSubTitle = styled.div`
  color: ${colors?.text?.black200};
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  line-height: 21px;
  opacity: 0.7;
  padding: 8px 40px 0px 40px;
`;
const GoToCartButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 38px;
`;
const GoToCartButton = styled(PrimaryButton)`
  width: fit-content;
  padding: 16px 36px;
`;
const CouponTextBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 18px 24px;
  gap: 10px;

  @media ${device.laptop} {
    justify-content: center;
  }
`;
const Button = styled(PrimaryButton)`
  display: flex;
  padding: 12px 24px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 100px;
  min-width: 188px;
  height: 42px;
  background: ${colors?.button?.primaryBackground};
  cursor: pointer;
  z-index: 9;
`;

export default CouponListing;
