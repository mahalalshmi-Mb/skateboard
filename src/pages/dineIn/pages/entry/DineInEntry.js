import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import { getAppConfig } from "../../../../commons/util/appConfigHelper";
import {
  applicablepromo,
  getUserInfo,
} from "../../../../commons/util/helperFunctions";
import Util from "../../../../commons/util/util";
import Text from "../../../../components/atoms/Text";
import Loader from "../../../../components/atoms/loader";
import { NavContext } from "../../../../context/navContext";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import { setSessionStorage } from "../../../../util/storageUtil";
import BackgroundImageSource from "../../assets/backgroundImage.png";
import { getStores } from "../../util/Util";
import LoginWithoutOtp from "components/organisms/LoginWithoutOtp/LoginWithoutOtp";

const DineInEntry = () => {
  const searchParams = new URLSearchParams(document.location.search);
  const [queryParams, setQueryParams] = useState({});

  const useNav = useContext(NavContext);
  const { pushHistory } = useCustomNavigation();
  const [cookies] = useCookies(["gwLoginData"]);

  const [isQuickSignInOpen, setIsQuickSignInOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [storeDetails, setStoreDetails] = useState({});
  const [backgroundImageURL, setBackgroundImageURL] = useState(null);

  const [imageSize, setImageSize] = useState({
    width: "calc(100vw + 244px)",
    height: "calc(100vh - 210px)",
    radius: "calc(100vh - 210px)",
  });

  useEffect(() => {
    getApplicablePromo();
    let queryParams = {};

    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    if (Object.keys(queryParams).length <= 0) {
      queryParams = {
        storeId: "60ed76aca8258362b0e5d132a",
        tableNumber: 4,
      };
    }

    setQueryParams(queryParams);

    useNav.hideAllNavs();
    return () => {
      useNav.showAllNavs();
    };
  }, []);

  useEffect(() => {
    if (isQuickSignInOpen) {
      setImageSize({
        width: "calc(100vw + 244px)",
        height: "calc(100vh - 476px)",
        radius: "calc(100vw + 244px)",
      });
    } else {
      setImageSize({
        width: "calc(100vw + 244px)",
        height: "calc(100vh - 210px)",
        radius: "calc(100vh - 210px)",
      });
    }
  }, [isQuickSignInOpen]);

  useEffect(() => {
    if (queryParams?.storeId) {
      getStoreDetails();
    }
    Util.getQrCodeSource(window.location.href);
  }, [queryParams]);

  const getApplicablePromo = async () => {
    if (cookies.gwLoginData && getAppConfig("CALL_PROMO_API")) {
      let data = await getUserInfo();
      if (data?.userId) {
        let getPromoData = await applicablepromo(window.atob(data.userId), "L");
        setSessionStorage("availablePromo", getPromoData);
      }
    }
  };

  const getStoreDetails = async () => {
    setIsLoading(true);
    const details = await getStores(queryParams?.storeId, "L");

    let dineInSessionStorage = {
      active: details?.active || false,
      isRetailStore: details?.isRetailStore || false,
      terminal: details?.terminal?.value || null,
      sector: details?.sector?.value || null,
      movementType: details?.movementType?.value || null,
      zoneType: details?.zoneType || null,
      domain: details?.domain || null,
    };

    searchParams.forEach((value, key) => {
      dineInSessionStorage[key] = value;
    });

    setSessionStorage("dine-in", dineInSessionStorage);

    setStoreDetails(details);

    const backgroundImageBanner = details?.shopImage?.find((image) =>
      image.imageType.includes("background")
    );
    if (backgroundImageBanner) {
      setBackgroundImageURL(backgroundImageBanner.imageURL);
    }
    setIsLoading(false);
  };

  const goToStoreFront = () => {
    const storeData = `${storeDetails?.storeDisplayName?.replace(
      "/",
      "-"
    )}-${storeDetails?.terminal?.value?.replace("/", "-")}-${
      storeDetails?.sector?.value
    }-${storeDetails?.movementType?.value}-${queryParams?.storeId}`;

    Util.triggerMoEngageEvent("store_viewed", {
      store_id: queryParams?.storeId,
      store_name: storeDetails?.storeDisplayName,
      terminal: storeDetails?.terminal?.value,
      sector: storeDetails?.sector?.value,
      movement_type: storeDetails?.movementType?.value,
    });

    pushHistory(`/storefront/${storeData}`, {
      tableNumber: queryParams?.tableNumber,
      isDineIn: true,
    });
  };

  const handleStartClick = () => {
    let productsData = {
      terminal: storeDetails?.terminal?.value,
    };
    setSessionStorage("productsData", productsData);
    goToStoreFront();
  };

  if (!isLoading) {
    return (
      <Wrapper>
        <StoreAndTableContentWrapper>
          <BackgroundImage
            BackgroundImageSource={backgroundImageURL || BackgroundImageSource}
            width={imageSize.width}
            height={imageSize.height}
            radius={imageSize.radius}
          />
          <StoreAndTableWrapper>
            <StoreLogo src={storeDetails?.shopBrandImageUrl} />
            <StoreNameWrapper>
              <Text type="bold">{storeDetails?.storeDisplayName}</Text>
            </StoreNameWrapper>
            <TableNumberWrapper>
              <Text type="bold">Table no. {queryParams?.tableNumber}</Text>
            </TableNumberWrapper>
          </StoreAndTableWrapper>
        </StoreAndTableContentWrapper>
        <StartOverButtonWrapper>
          <StartOverButton onClick={handleStartClick}>
            <Text type="extra-bold">Start Order</Text>
          </StartOverButton>
        </StartOverButtonWrapper>
        <LoginWithoutOtp
          isDrawerOpen={isQuickSignInOpen}
          setIsDrawerOpen={setIsQuickSignInOpen}
          successHandler={goToStoreFront}
        />
      </Wrapper>
    );
  } else {
    return <Loader />;
  }
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const StoreNameWrapper = styled.div`
  margin-top: 4px;
  margin-bottom: 8px;
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  line-height: normal;
`;

const StoreLogo = styled.img`
  width: 52px;
  height: 52px;
`;

const StoreAndTableWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  align-self: center;
`;

const TableNumberWrapper = styled.div`
  display: flex;
  padding: 4px 12px;
  align-items: flex-start;
  gap: 10px;
  border-radius: 100px;
  border: 1px solid #fff;
  opacity: 0.8;

  color: #fff;
  font-size: 13px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 1.3px;
  text-transform: uppercase;
`;

const StoreAndTableContentWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const BackgroundImage = styled.img`
  background: ${(props) => `url(${props.BackgroundImageSource}) no-repeat`};
  background-size: cover;
  background-position: center center;
  flex-shrink: 0;
  border-bottom-right-radius: ${(props) => props.radius};
  border-bottom-left-radius: ${(props) => props.radius};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  transition: width 0.5s ease-in-out, height 0.5s ease-in-out;
`;

const StartOverButtonWrapper = styled.div`
  justify-content: center;
  display: flex;
  width: 100vw;
`;

const StartOverButton = styled.div`
  display: flex;
  width: 342px;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 36px;
  background: #04adaa;
  margin-top: 34px;

  color: #fff;
  font-size: 16px;
  font-weight: 800;
  line-height: 130%;
  cursor: pointer;
`;
export default DineInEntry;
