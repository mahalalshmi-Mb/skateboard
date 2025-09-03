import { useConfig } from "context/configContext";
import { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import moment from "util/momentWrapper";
import BackArrowWhite from "../../../../assets/images/terminalTwo/backArrow.svg";
import callAPI from "../../../../commons/callAPI";
import config from "../../../../commons/config";
import { getAppConfig } from "../../../../commons/util/appConfigHelper";
import { device } from "../../../../commons/util/helperFunctions";
import Util from "../../../../commons/util/util";
import Text from "../../../../components/atoms/Text";
import Loader from "../../../../components/atoms/loader";
import PushAlert from "../../../../components/atoms/pushAlert";
import Dropdown from "../../../../components/organisms/Dropdown/Dropdown";
import { FlightContext } from "../../../../context/FlightsContext";
import { CartContext } from "../../../../context/cartContext";
import { NavContext } from "../../../../context/navContext";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import { PrimaryButton } from "../../../../theme/globalStyleSheet";
import {
  getSessionStorage,
  removeSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import TakeAwaySelectionItem from "../../components/TakeAwaySelectionItem";
import FloatingCart from "../../components/molecules/FloatingCart";
import ScheduledOrderPicker from "../../components/organism/ScheduledOrderPicker";
import ConfirmationPrompt from "../../productComponents/organisms/ConfirmationPrompt";
import FlightConfirmationPrompt from "../../productComponents/organisms/FlightConfirmationPrompt";
import { checkForConflictingStore, filterCartItems } from "../../util/util";
import {
  defaultDatePickerTime,
  initialSlotBuffer,
  productDomain,
} from "../config/config";
import TerminalGrid from "./components/TerminalGrid";
import { colors } from "theme/colors";
import SectorGrid from "./components/SectorGrid";
import DepartureBanner from "../../../../../src/assets/images/takeaway/DepartureBanner.svg";
import VisitorBanner from "../../../../../src/assets/images/takeaway/VisitorBanner.svg";
import MDepartureBanner from "../../../../../src/assets/images/takeaway/MDepartureBanner.svg";
import MVisitorBanner from "../../../../../src/assets/images/takeaway/MVisitorBanner.svg";
import ArrowLeft from "../../../../../src/assets/images/takeaway/ArrowLeft.svg";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const TakeAwaySelection = (props) => {
  let query = useQuery();
  const { pathname, search } = useLocation();
  const useNav = useContext(NavContext);
  const ClientCart = useContext(CartContext);
  const ClientFlight = useContext(FlightContext);
  const { preOrderAvailable, timezone, skipOrderTerminalSelection } =
    useConfig();

  const history = useHistory();
  const { pushHistory } = useCustomNavigation();
  let productsData = getSessionStorage("productsData");
  const domainParam = new URLSearchParams(search).get("domain") || "";
  const typeParam = new URLSearchParams(search).get("type") || "";

  const [terminal, setTerminal] = useState({});
  const [sector, setSector] = useState({});
  const [time, setTime] = useState(defaultDatePickerTime());
  const [isLoading, setIsLoading] = useState(true);
  const [areaData, setAreaData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [movementTypeData, setMovementTypeData] = useState([]);
  const [delToGateAvailable, setDelToGateAvailable] = useState(true);

  const [conflictingStoreId, setConflictingStoreId] = useState([]);
  const [cartConfirmationPromptOpen, setCartConfirmationPromptOpen] =
    useState(false);
  const [flightConfirmationPromptOpen, setFlightConfirmationPromptOpen] =
    useState(false);
  const [selectedArea, setSelectedArea] = useState("");
  const [pageData, setPageData] = useState({});
  const [flightData, setFlightData] = useState({});
  const [isProceedToTakeaway, setIsProceedToTakeaway] = useState(true);

  useEffect(() => {
    if (isMobile) {
      useNav.showHeaderNavs();
      useNav.hideFooterNavs();
    } else {
      useNav.showHeaderNavs();
      useNav.hideFooterNavs();
    }

    fnbDataFallback();
    getPageData();
    let flightList = ClientFlight.myFlights();
    if (flightList?.length > 0) {
      getFlightInfo(flightList[0]?.flightId);
    }
    Util.getQrCodeSource(window.location.href);

    return () => {
      useNav.showHeaderNavs();
      useNav.showFooterNavs();
    };
  }, [pathname]);

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (action === "POP") {
        pushHistory("/");
      }
    });

    return () => unlisten();
  }, [history]);

  useEffect(() => {
    getAvailableSector();
  }, [terminal]);

  useEffect(() => {
    getAvailableMovementType(sectorData, sector);
  }, [sector]);

  useEffect(() => {
    let productsData = getSessionStorage("productsData");
    productsData.domain = domainParam;
    setSessionStorage("productsData", productsData);

    getAvailableAreas();
  }, [domainParam]);

  const proceedForTakeaway = () => {
    let data = JSON.parse(JSON.stringify(getSessionStorage("productsData")));

    const eventData = {
      domain: data?.domain,
      terminal: data?.terminal,
      movement: data?.movementType,
      sector: data?.sector,
      deliveryOption: data?.deliveryOptions?.deliveryOption,
    };

    Util.sendMessageToReactNative("moengage_movement_selected", eventData);
    if (typeParam === "spring-market") {
      pushHistory("/spring-market");
    } else {
      pushHistory("/takeaway");
    }
  };

  const getFlightInfo = async (flightId) => {
    let flightData = ClientFlight.getFlightById(flightId);
    if (flightData) {
      let id = flightId;
      let flightDate = flightData?.scheduleDate;
      let flightMovementType = flightData?.movementType;
      let date = moment(flightDate, "UTC", "UTC").format();
      let movementType = "Departure";
      if (flightMovementType === "A") movementType = "Arrival";

      try {
        let apiURL = config.api.flightSearch
          .replace("{{date}}", date)
          .replace("{{movementType}}", movementType)
          .replace("{{flightNo}}", id);
        let apiResponse = await callAPI.get(apiURL);
        let regResponse = await apiResponse.json();
        if (regResponse?.data?.length > 0) {
          setFlightData(regResponse.data);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getPageData = async () => {
    try {
      let domain = "fnb";
      if (domainParam === "Duty Free") {
        domain = "dutyfree";
      }
      let apiURL = config.api.pages.replace(
        "{{pageId}}",
        `${Util.getSlug(props?.location?.pathname)}-${domain}`
      );
      let apiResponse = await callAPI.get(apiURL);
      let regResponse = await apiResponse.json();
      if (apiResponse.status === 200) {
        setPageData(regResponse);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fnbDataFallback = () => {
    let data = getSessionStorage("productsData");
    if (data === null || data === undefined || !data.deliveryOptions) {
      let productsData = {
        deliveryOptions: {
          deliveryOption: config.deliveryOptions.takeaway,
          deliveryTime: moment(new Date(), "UTC", "UTC").format(),
          isPackagingRequested: true,
          timezone: timezone,
        },
        domain: domainParam,
      };
      setSessionStorage("productsData", productsData);
    } else {
      data.deliveryOptions.deliveryOption = config.deliveryOptions.takeaway;
      data.deliveryOptions.isDelivery = false;
      data.deliveryOptions.timezone = timezone;
      setSessionStorage("productsData", data);
    }
  };

  const getAvailableAreas = async () => {
    try {
      setIsLoading(true);
      let data = getSessionStorage("productsData");
      let apiURL = config.api.products.areaListing;
      const response = await callAPI.get(apiURL, {
        domain: data?.domain,
      });
      const regResponse = await response.json();
      if (regResponse.status === 200) {
        setAreaData(regResponse?.data);
        setTerminal(regResponse.data?.terminals[0]);
        getSelectedTerminal(regResponse.data?.terminals);
        setDelToGateAvailable(regResponse?.data?.allowDeliverToGate);
        if (skipOrderTerminalSelection) {
          handleMomentClick("Departure", []);
        } else {
          if (regResponse.data?.terminals?.length === 1) {
            handleMomentClick("Departure", regResponse.data?.terminals[0]);
          }
        }
        setIsLoading(false);
      } else {
        PushAlert.error("Please try again after sometime");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getSelectedTerminal = (terminal) => {
    const preFilledTerminal = query.get("terminal");
    let terminalFound = {};
    if (
      preFilledTerminal !== undefined &&
      preFilledTerminal !== null &&
      preFilledTerminal !== ""
    ) {
      terminalFound = terminal.find(
        (x) => x.terminal?.toLowerCase() === preFilledTerminal?.toLowerCase()
      );
      if (terminalFound) {
        setTerminal(terminalFound);
        getSelectedSector(terminalFound);
      } else {
        getSelectedSector(terminal[0]);
      }
    } else {
      getSelectedSector(terminal[0]);
    }
  };

  const getAvailableSector = () => {
    if (areaData?.terminals?.length > 0) {
      const found = areaData?.terminals?.find(
        (x) => x.terminal?.toLowerCase() === terminal?.terminal?.toLowerCase()
      );
      if (found) {
        setSectorData(found?.sectors);
        getAvailableMovementType(found?.sectors, found?.sectors[0]);
      }
    }
  };

  const getAvailableMovementType = (sectorData, selectedSector) => {
    const found = sectorData?.find(
      (x) => x.sector?.toLowerCase() === selectedSector?.sector?.toLowerCase()
    );
    if (found) {
      setMovementTypeData(found?.movementTypes);
    }
  };

  const getSelectedSector = (selectedTerminal) => {
    const preFilledSector = query.get("sector");
    if (
      preFilledSector !== undefined &&
      preFilledSector !== null &&
      preFilledSector !== ""
    ) {
      const sectorFound = selectedTerminal?.sectors?.find(
        (x) => x.sector?.toLowerCase() === preFilledSector?.toLowerCase()
      );
      if (sectorFound) {
        setSector(sectorFound);
      } else {
        setSector(selectedTerminal?.sectors[0]);
      }
    } else {
      setSector(selectedTerminal?.sectors[0]);
    }
  };

  const handleMomentClick = (selectedMoment, terminalSelected) => {
    let data = JSON.parse(JSON.stringify(getSessionStorage("productsData")));
    if (data.deliveryOptions?.isScheduled && preOrderAvailable) {
      if (moment(time).isBefore(moment().add(initialSlotBuffer, "minutes"))) {
        PushAlert.error(
          `Please select a time which is at least ${initialSlotBuffer}mins from current time`
        );
        return;
      }
    }
    if (!data.deliveryOptions?.isScheduled) {
      if (data.deliveryOptions) {
        data.deliveryOptions.deliveryTime = moment(
          new Date(),
          "UTC",
          "UTC"
        ).format();
        data.deliveryOptions.timezone = timezone;
      }
    }
    terminalSelected
      ? (data.terminal =
          terminalSelected?.terminal?.replaceAll(" ", "") || "All Terminals")
      : (data.terminal =
          terminal?.terminal?.replaceAll(" ", "") || "All Terminals");
    data.movementType = selectedMoment || "";
    data.sector = sector?.sector || "Domestic";
    data.displayLabel = terminalSelected?.displayLabel || "All Terminals";
    setSessionStorage("productsData", data);
    ClientCart.updateFnbItemDelAndFlight(data.deliveryOptions, "", "");

    if (isProceedToTakeaway) {
      proceedForTakeaway();
    } else {
      checkForConflictingStore(
        data,
        ClientCart,
        setCartConfirmationPromptOpen,
        setConflictingStoreId,
        history,
        proceedForTakeaway
      );
    }
  };

  const handleBackButtonClick = () => {
    Util.triggerMoEngageEvent("takeaway_back_button_clicked");
    pushHistory("/");
  };

  const handleDeliveryClick = () => {
    let existingData = getSessionStorage("productsData");
    if (
      existingData?.deliveryOptions?.deliveryOption ===
        config?.deliveryOptions?.deliveryAtGate &&
      existingData?.deliveryOptions?.isScheduled === true
    ) {
      pushHistory("/delivery-flight-selection");
    } else {
      let productsData = {
        deliveryOptions: {
          deliveryOption: config.deliveryOptions.deliveryAtGate,
          deliveryTime: moment(new Date(), "UTC", "UTC").format(),
          isPackagingRequested: true,
          isDelivery: true,
          timezone: timezone,
        },
      };
      setSessionStorage("productsData", productsData);
      pushHistory("/delivery-flight-selection");
    }
  };

  const clearAndProceed = () => {
    filterCartItems(ClientCart, conflictingStoreId);

    setCartConfirmationPromptOpen(false);
    setConflictingStoreId([]);
    removeSessionStorage("mandatoryInfoData");
    removeSessionStorage("tipData");

    proceedForTakeaway();
  };

  const checkFlight = (selectedMoment, terminalSelected) => {
    if (productsData?.domain === "Duty Free") {
      let flightTerminal = "";
      if (flightData?.length > 0) {
        flightTerminal = `Terminal${flightData[0]?.terminal}`;
        const flightSector =
          flightData[0]?.flightType === "DOMESTIC"
            ? "Domestic"
            : "International";
        const selectedTerminal = terminalSelected?.terminal?.replaceAll(
          " ",
          ""
        );
        const selectedMovementType = selectedMoment;
        const selectedSector = sector?.sector;
        if (
          flightTerminal === selectedTerminal &&
          flightSector === selectedSector
        ) {
          handleMomentClick(selectedMoment, terminalSelected);
        } else {
          setSelectedArea(selectedMoment);
          setFlightConfirmationPromptOpen(true);
        }
      } else {
        handleMomentClick(selectedMoment, terminalSelected);
      }
    } else {
      handleMomentClick(selectedMoment, terminalSelected);
    }
  };

  const clearFlightAndProceed = () => {
    ClientFlight.reset();
    removeSessionStorage("mandatoryInfoData");
    removeSessionStorage("tipData");
    setFlightConfirmationPromptOpen(false);
    handleMomentClick(selectedArea);
  };

  const handleFilter = (filterParam, filterValue, isMultiSelect) => {
    setTerminal(filterValue);
    getSelectedSector(filterValue);
    setSector(filterValue?.sectors[0]);
    checkFlight("Departure", filterValue);
  };

  const handleGoBack = () => {
    history.goBack();
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <PageContainer>
        <Wrapper>
          <MomentSelectionWrapper>
            {preOrderAvailable && (
              <PreOrderContainer>
                <SectionTitle>
                  <Text type="bold">Pre-order your meal</Text>
                </SectionTitle>
                <ScheduleOrderBannerWrapper>
                  <ScheduledOrderPicker
                    value={time}
                    setValue={setTime}
                    minTime={defaultDatePickerTime()}
                    label="Want to pre-order?"
                  />
                </ScheduleOrderBannerWrapper>
              </PreOrderContainer>
            )}
          </MomentSelectionWrapper>

          <TerminalGridWrapper>
            <TerminalGrid
              showAllTerminalButton={false}
              data={areaData || {}}
              handleFilterClick={handleFilter}
              selectedFilter={terminal}
            />
            {/* <HorizontalDivider />
            <SectorGrid
              data={areaData || {}}
              handleFilterClick={handleFilter}
              selectedFilter={sector}
            /> */}
          </TerminalGridWrapper>
          {/* <OrderFormWarpper>
            <Text type="bold">Where would you like to order from?</Text>
            <Text type="regular">
              This will help us show you restaurants closest to you.
            </Text>
            <OrderFromBannerWrapper>
              <MobileDepartureBannerImage
                src={MDepartureBanner}
                alt="Order from"
              />
              <MobileVisitorBannerImage src={MVisitorBanner} alt="Order from" />
            </OrderFromBannerWrapper>
            <SearchButton>
              <Text type="bold">SEARCH</Text>
            </SearchButton>
          </OrderFormWarpper> */}
        </Wrapper>
        <FloatingCart />
        {cartConfirmationPromptOpen && (
          <ConfirmationPrompt
            isDrawerOpen={cartConfirmationPromptOpen}
            setIsDrawerOpen={setCartConfirmationPromptOpen}
            clearAndProceed={clearAndProceed}
          />
        )}
        {flightConfirmationPromptOpen && (
          <FlightConfirmationPrompt
            isDrawerOpen={flightConfirmationPromptOpen}
            setIsDrawerOpen={setFlightConfirmationPromptOpen}
            successHandler={clearFlightAndProceed}
          />
        )}
      </PageContainer>
    );
  }
};

const DeliverToGateWrapper = styled.div`
  margin-top: 12px;
  font-size: 16px;
  line-height: 24px;
  color: ${colors?.text?.actionTextColor};
  cursor: pointer;
`;
const DescriptionTextWrapper = styled.div`
  margin-top: 8px;
  font-size: 14px;
  line-height: 19px;
  opacity: 0.7;
  color: ${colors?.text?.black200};
`;
const ShortOnTimeWrapper = styled.div`
  margin-top: 12px;
  font-size: 18px;
  line-height: 23px;
  color: ${colors?.text?.black200};
`;
const DepartureTextWrapper = styled.div`
  background: #f8cf46;
  padding: 4px 8px;
  width: fit-content;
  font-size: 10px;
  color: ${colors?.text?.black200};
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 70px;
  background: ${colors?.pageBackground?.primary};
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 24px;

  @media ${device.laptop} {
    width: 100%;
    height: 100%;
    max-width: 720px;
    margin: 0px auto;
    padding: 48px;
  }
`;
const MomentSelectionWrapper = styled.div`
  width: 100%;
`;

const MessageContainer = styled.div`
  width: 100%;
  background: ${colors?.primaryForeground};
  border-radius: 4px;
  margin-top: 8px;
`;
const MessageWrapper = styled.div`
  padding: 24px 28px 24px 24px;
  width: 100%;
`;

const ScheduleOrderBannerWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 8px;
`;
const DesktopBannerContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: ${colors?.secondaryLightForeground};
  @media ${device.mobileM} {
    font-size: 16px;
  }
`;
const DesktopBannerTextContainer = styled.div`
  width: 100%;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 36px;

  @media ${device.laptop} {
    padding: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const DesktopGoBackWrapper = styled.div`
  width: fit-content;
  cursor: pointer;
  position: absolute;
  left: 36px;
`;
const BackArrowImg = styled.img``;
const GoBackText = styled.div`
  font-size: 16px;
  color: ${colors?.text?.primaryLightText};
`;
const DesktopBannerTitle = styled.div`
  font-size: 40px;
  color: ${colors?.text?.blue600};
  padding-top: 0px;
  @media ${device.mobileM} {
    font-size: 24px;
  }
`;
const DesktopPageContainer = styled.div`
  display: none;

  @media ${device.laptop} {
    display: flex;
    width: 100%;
    height: 100%;
    max-width: 720px;
    margin: 0px auto;
    padding: 52px 0px 115px 0px;
    gap: 0px 38px;
  }
`;
const DesktopTakeawayContainer = styled.div`
  width: 50%;
`;
const DesktopDeliveryContainer = styled.div`
  width: 50%;
`;
const SectionTitle = styled.div`
  font-size: 16px;
  color: ${colors?.text?.black200};
  line-height: 30px;

  @media ${device.laptop} {
    font-size: 18px;
  }
`;
const DesktopSectionSubTitle = styled.div`
  font-size: 20px;
  color: ${colors?.text?.black200};
  line-height: 21px;
  padding-top: 8px;
`;
const DesktopTerminalSelectionWrapper = styled.div`
  width: 100%;
  padding-top: 24px;
`;
const DesktopScheduledOrderContainer = styled.div`
  width: 100%;
`;
const OptForDelButton = styled(PrimaryButton)`
  display: flex;
  width: fit-content;
  padding: 16px 48px;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  font-size: 20px;
  line-height: 22px;
  margin-top: 24px;
  cursor: pointer;
`;
const OptForDelSubText = styled.div`
  font-size: 18px;
  line-height: 20px;
  color: ${colors?.text?.black200};
  margin-top: 24px;
`;
const VerticalDividerContainer = styled.div`
  height: 60vh;
  gap: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const VerticalDividerLine = styled.div`
  border-left: 1px dashed black;
  opacity: 0.18;
  height: 100%;
`;
const VerticalDividerOrText = styled.div`
  font-size: 14px;
  opacity: 0.3;
  line-height: 20px;
  color: ${colors?.text?.actionTextColor};
`;
const TerminalGridWrapper = styled.div`
  margin-top: 24px;
  border-radius: 8px;
  border: 1px solid ${colors?.border};
  padding: 16px;
  border-radius: 16px;
  background: ${colors?.pageBackground?.secondary};
`;
const OrderFormWarpper = styled.div`
  width: 100%;
  padding: 0px 8px;
  margin-top: 40px;
  border-radius: 8px;

  & > div:nth-child(1) {
    font-size: 18px;
    padding-top: 4px;
  }

  & > div:nth-child(2) {
    font-size: 14px;
    padding-top: 4px;
  }
`;
const OrderFromBannerWrapper = styled.div`
  width: 100%;
  height: auto;
  padding: 12px 4px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
`;
const DepartureBannerImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin: auto;
`;
const MobileDepartureBannerImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin: auto;
  @media ${device.mobileM} {
    width: 90%;
  }
`;
const VisitorBannerImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin: auto;
`;
const MobileVisitorBannerImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin: auto;
  @media ${device.mobileM} {
    width: 90%;
  }
`;
const MobileDeliverToGateWrapper = styled.div`
  width: 100%;
  padding: 0px 24px 24px 24px;

  @media ${device.laptop} {
    display: none;
  }
`;
const PreOrderContainer = styled.div`
  width: 100%;
`;

const HorizontalDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #d9d9d9;
  margin-top: 24px;
`;
const SearchButton = styled(PrimaryButton)`
  background-color: ${colors.background};
  color: ${colors.primary};
  border: 1.7px solid ${colors.primary};
  font-size: 14px;
  line-height: 18px;
  font-weight: 800;
  height: 42px;
`;

export default TakeAwaySelection;
