import { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import moment from "util/momentWrapper";
import CancelIcon from "../../../assets/CancelBlack.svg";
import config from "../../../commons/config";
import Util from "../../../commons/util/util";
import Text from "../../../components/atoms/Text";
import { NavContext } from "../../../context/navContext";
import useCustomNavigation from "../../../hooks/useCustomNavigation";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../util/storageUtil";
import { productDomain } from "../../edpFSTR/pages/config/config";
import EntryImage from "../assets/entry-image.png";
import { useConfig } from "context/configContext";

const DutyFreeEntry = () => {
  const useNav = useContext(NavContext);
  const { timezone } = useConfig();

  const history = useHistory();
  const { search } = useLocation();
  const { pushHistory } = useCustomNavigation();
  const domainParam = new URLSearchParams(search).get("domain");

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    useNav.hideAllNavs();

    productsDataFallback();

    return () => {
      useNav.showAllNavs();
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    let productsData = getSessionStorage("productsData");
    if (domainParam) {
      productsData.domain = domainParam;
      setSessionStorage("productsData", productsData);
    }
  }, [domainParam]);

  const productsDataFallback = () => {
    let data = getSessionStorage("productsData");
    if (data === null || data === undefined) {
      let productsData = {
        deliveryOptions: {
          deliveryOption: config.deliveryOptions.takeaway,
          deliveryTime: moment(new Date(), "UTC", "UTC").format(),
          isPackagingRequested: true,
          timezone: timezone,
        },
        domain: productDomain.dutyFree,
      };
      setSessionStorage("productsData", productsData);
    } else {
      data.deliveryOptions.deliveryOption = config.deliveryOptions.takeaway;
      data.deliveryOptions.isDelivery = false;
      data.deliveryOptions.timezone = timezone;
      setSessionStorage("productsData", data);
    }
  };

  const handleShopNowClick = async () => {
    Util.triggerMoEngageEvent("duty_free_shop_now_clicked");
    let existingData = getSessionStorage("productsData");
    if (
      existingData?.deliveryOptions?.deliveryOption ===
        config?.deliveryOptions?.takeaway &&
      existingData?.deliveryOptions?.isScheduled === true
    ) {
      existingData.domain = productDomain.dutyFree;
      pushHistory(`/takeaway-selection?domain=${productDomain.dutyFree}`);
    } else {
      let productsData = {
        deliveryOptions: {
          deliveryOption: config.deliveryOptions.takeaway,
          deliveryTime: moment(new Date(), "UTC", "UTC").format(),
          isPackagingRequested: true,
          timezone: timezone,
        },
        domain: productDomain.dutyFree,
      };
      setSessionStorage("productsData", productsData);
      pushHistory(`/takeaway-selection?domain=${productDomain.dutyFree}`);
    }
  };

  return (
    <Wrapper>
      <GradientWrapper></GradientWrapper>
      <CancelButton
        src={CancelIcon}
        onClick={() => {
          history.goBack();
        }}
      ></CancelButton>
      <HeaderWrapper>
        <Text
          style={{
            fontSize: "42px",
            fontWeight: 700,
          }}
          type="bold"
        >
          BLR Duty free
        </Text>
        <Text
          type="semi-bold"
          style={{
            fontSize: "36px",
            fontWeight: 400,
          }}
        >
          is now open at T2!
        </Text>
      </HeaderWrapper>
      <PlaceHolderIcon src={EntryImage}></PlaceHolderIcon>
      <ShopNowButton
        onClick={() => {
          handleShopNowClick();
        }}
      >
        <Text type="extra-bold">Shop Now</Text>
      </ShopNowButton>

      <CurtainWrapper
        style={{
          borderRight: "5px solid #c1985d",
          transition: "left 1.5s ease-in-out",
          left: animate ? "-50vw" : 0,
        }}
      ></CurtainWrapper>
      <CurtainWrapper
        style={{
          borderLeft: "5px solid #c1985d",
          transition: "right 1.5s ease-in-out",
          right: animate ? "-50vw" : 0,
        }}
      ></CurtainWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border-radius: 8px;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  overflow-x: hidden;
  position: relative;
`;

const GradientWrapper = styled.div`
  background: linear-gradient(180deg, #fffcfb 0%, #f1dcd2 100%);
  width: 100vw;
  height: -webkit-fill-available;
  position: absolute;
  z-index: -1;
  background-size: cover;
  overflow: hidden;
  min-height: 100vh;
`;

const CancelButton = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  align-self: end;
  margin-right: 21px;
  margin-top: -2px;
`;

const ShopNowButton = styled.div`
  display: flex;
  height: 47px;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 100px;
  background: #fff;

  color: #04adaa;
  font-family: Manrope;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: 21px;

  margin: 0px 32px;
  margin-bottom: 22px;
  bottom: 22px;
`;

const PlaceHolderIcon = styled.img`
  padding: 0px 32px;
`;

const HeaderWrapper = styled.div`
  color: #273135;
  text-align: center;
  font-family: Manrope;
  font-style: normal;
  line-height: normal;

  padding: 0px 32px;
`;

const CurtainWrapper = styled.div`
  fill: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10.5px);

  z-index: 1;
  width: 50vw;
  height: 100vh;
  position: absolute;
`;

export default DutyFreeEntry;
