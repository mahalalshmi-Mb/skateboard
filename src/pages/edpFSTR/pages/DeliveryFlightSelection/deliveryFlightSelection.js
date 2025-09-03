import { useConfig } from "context/configContext";
import { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHistory, useLocation } from "react-router-dom";
import moment from "util/momentWrapper";
import callAPI from "../../../../commons/callAPI";
import config from "../../../../commons/config";
import { getAppConfig } from "../../../../commons/util/appConfigHelper";
import Util from "../../../../commons/util/util";
import Text from "../../../../components/atoms/Text";
import Loader from "../../../../components/atoms/loader";
import PushAlert from "../../../../components/atoms/pushAlert";
import RemoveFlightConfirmation from "../../../../components/molecules/removeFlightConfirmation/removeFlightConfirmation";
import AddFlightModal from "../../../../components/organisms/AddFlightModal/AddFlightModal";
import AddFlight from "../../../../containers/addFlight/addFlight";
import { FlightContext } from "../../../../context/FlightsContext";
import { CartContext } from "../../../../context/cartContext";
import { NavContext } from "../../../../context/navContext";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";
import {
  getSessionStorage,
  setSessionStorage,
} from "../../../../util/storageUtil";
import BackArrowIcon from "../../assets/BackArrow.svg";
import AddFlightCard from "../../components/organism/AddFlightCard";
import GateSelection from "../../components/organism/GateSelection";
import OptForTakeaway from "../../components/organism/OptForTakeaway";
import ScheduledOrderPicker from "../../components/organism/ScheduledOrderPicker";
import SelectedFlightCard from "../../components/organism/SelectedFlightCard";
import ConfirmationPrompt from "../../productComponents/organisms/ConfirmationPrompt";
import { checkForConflictingStore, filterCartItems } from "../../util/util";
import {
  defaultDatePickerTime,
  delLeadTimeDom,
  delLeadTimeInt,
  futureFlightLeadTime,
  maxDeliveryTime,
  productDomain,
} from "../config/config";
import {
  BackArrow,
  ContentWrapper,
  FooterButton,
  FooterButtonText,
  FooterWrapper,
  HeaderBackWrapper,
  HeaderText,
  HeaderWrapper,
  OptForTakeawayWrapper,
  PageWrapper,
  ScheduleOrderBannerWrapper,
} from "./style";

function DeliveryFlightSelection(props) {
  const { pathname } = useLocation();
  const history = useHistory();
  const useNav = useContext(NavContext);
  const ClientFlight = useContext(FlightContext);
  const ClientCart = useContext(CartContext);
  const { pushHistory } = useCustomNavigation();

  const { preOrderAvailable, timezone } = useConfig();

  const [isLoading, setIsLoading] = useState(true);
  const [isFlightAdded, setIsFlightAdded] = useState(false);
  const [flightData, setFlightData] = useState({});
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [selectedGate, setSelectedGate] = useState(null);
  const [gates, setGates] = useState([]);
  const [time, setTime] = useState(defaultDatePickerTime());
  const [showRemoveFlightModal, setShowRemoveFlightModal] = useState(false);
  const [disableStartOrdering, setDisableStartOrdering] = useState(false);

  const [conflictingStoreId, setConflictingStoreId] = useState([]);
  const [cartConfirmationPromptOpen, setCartConfirmationPromptOpen] =
    useState(false);

  const [isDeliveryQrCode, setIsDeliveryQrCode] = useState(false);

  useEffect(() => {
    const isFlightSelectionPage = pathname === "/delivery-flight-selection";

    handleNavs();
    fnbDataFallback();
    checkIfFlightExists();
    Util.getQrCodeSource(window.location.href);
    handleQrCodeDelivery();

    return () => {
      if (isMobile && isFlightSelectionPage) {
        useNav.showHeaderNavs();
        useNav.showFooterNavs();
        useNav.showBottomNavs();
      }
    };
  }, [pathname]);

  const handleNavs = () => {
    if (isMobile) {
      useNav.hideHeaderNavs();
      useNav.hideFooterNavs();
      useNav.hideBottomNavs();
    } else {
      useNav.showHeaderNavs();
      useNav.hideFooterNavs();
      useNav.showBottomNavs();
    }
  };

  const fnbDataFallback = () => {
    let data = getSessionStorage("productsData");
    if (data === null || data === undefined) {
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
    }
  };

  const handleQrCodeDelivery = () => {
    let params = Util.getUrlParams(window.location.href);
    if (
      params?.QRCodescancampaign?.toLowerCase()?.includes("deliver-to-gate")
    ) {
      setIsDeliveryQrCode(true);
      ClientCart.reset();
      ClientCart.clearSavedLocalCart();
      setIsLoading(false);
    } else if (
      getSessionStorage("qrCodeSource")
        ?.toLowerCase()
        ?.includes("deliver-to-gate")
    ) {
      setIsDeliveryQrCode(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const checkIfFlightExists = () => {
    let addedFlight = ClientFlight.myFlights();
    if (addedFlight?.length > 0) {
      const found = addedFlight.find(
        (x) =>
          x.movementType === "D" ||
          x?.movementType?.toLowerCase() === "departure"
      );
      if (found) {
        getFlightInfo(found?.flightId);
      }
    }
  };

  const getFlightInfo = async (flightId) => {
    setIsLoading(true);
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
        if (regResponse.data.length > 0) {
          if (regResponse.data[0]?.terminal) {
            flightData.terminal = regResponse.data[0]?.terminal;
            flightData.estimatedDate = moment(
              regResponse.data[0]?.estimatedDate,
              "UTC",
              "UTC"
            )
              .add(5, "hour")
              .add(30, "minute")
              .format("lll");

            // Retrieve delivery-related session data from sessionStorage
            let sessionData = JSON.parse(
              JSON.stringify(getSessionStorage("productsData"))
            );

            let isSameFlight =
              sessionData?.flightDetails?.UID === flightData?.UID;

            const gateList = await handleAddFlight(flightData);

            if (sessionData?.deliveryOptions?.deliveryAddress) {
              preFillGateNumber(
                `${sessionData.deliveryOptions.deliveryAddress}`,
                `T${regResponse.data[0]?.terminal}`
              );
            } else if (regResponse.data[0]?.gates[0]?.gateNumber) {
              preFillGateNumber(
                `Gate ${regResponse.data[0]?.gates[0]?.gateNumber}`,
                `T${regResponse.data[0]?.terminal}`
              );
            } else {
              if (gateList?.length > 0 && gateList?.[0]?.value) {
                preFillGateNumber(
                  `Gate ${gateList[0]?.value}`,
                  `T${regResponse.data[0]?.terminal}`
                );
              } else {
                preFillGateNumber(`Gate`, `T${regResponse.data[0]?.terminal}`);
              }
            }
            sessionData.flightDetails = flightData || [];

            if (sessionData?.deliveryOptions?.deliveryTime && isSameFlight) {
              const updatedTime = moment(
                `${sessionData?.deliveryOptions?.deliveryTime}`
              ).format();
              setTime(updatedTime);
              return;
            }

            // Parse the estimated delivery time from the flightData and format it using moment
            const estimatedDateTime = moment(flightData.estimatedDate);
            // Get the current time using moment
            const currentTime = moment();

            // Calculate the difference in minutes between the estimated time and the current time
            const differenceInMinutes = estimatedDateTime.diff(
              currentTime,
              "minutes"
            );

            // Check if the difference in minutes is greater than or equal to 180 (3 hours)
            if (differenceInMinutes >= futureFlightLeadTime) {
              // Calculate the delivery time by adding 75 minutes to the current time and formatting it
              const deliveryTime = estimatedDateTime
                .clone()
                .subtract(maxDeliveryTime, "minutes")
                .format();

              // Update delivery-related session data from sessionStorage
              sessionData.deliveryOptions.deliveryTime = deliveryTime;
              sessionData.deliveryOptions.isScheduled = true;

              // Update the sessionStorage with the modified session data
              setSessionStorage("productsData", sessionData);

              const updatedTime = moment(`${deliveryTime}`).format();
              setTime(updatedTime);
            } else {
              const deliveryTime = currentTime.clone().format();

              sessionData.deliveryOptions.deliveryTime = deliveryTime;
              sessionData.deliveryOptions.isScheduled = false;

              // Update the sessionStorage with the modified session data
              setSessionStorage("productsData", sessionData);

              const updatedTime = moment(`${deliveryTime}`).format();
              setTime(updatedTime);
            }
            setIsLoading(false);
          } else {
            throw Error();
          }
        } else {
          throw Error();
        }
      } catch (e) {
        setIsLoading(false);
        console.log(e);
      }
    } else {
      setIsLoading(false);
      console.log("No flights found");
    }
  };

  const handleAddFlight = async (data) => {
    setFlightData(data);
    const gateList = await getGateListing(data);
    setGates(gateList);

    if (getAppConfig("FSTR_DELIVERY_TERMINAL2_ENABLED")) {
      if (
        data?.terminal === "2" ||
        data?.terminal?.toLowerCase() === "t2" ||
        data?.terminal?.toLowerCase() === "terminal2" ||
        data?.terminal?.toLowerCase() === "terminaltwo"
      ) {
        if (
          getAppConfig("FSTR_DELIVERY_TERMINAL2_ERROR_TEXT") &&
          getAppConfig("FSTR_DELIVERY_TERMINAL2_ERROR_TEXT") !== ""
        ) {
          PushAlert.error(getAppConfig("FSTR_DELIVERY_TERMINAL2_ERROR_TEXT"));
        }
        setDisableStartOrdering(true);
      } else {
        setDisableStartOrdering(false);
      }
    }
    setIsFlightAdded(true);
    return gateList;
  };

  const preFillGateNumber = (gate, terminal) => {
    setSelectedGate({
      label: `${terminal?.replace("Terminal", "T")}, Boarding ${gate}`,
      value: gate?.split("Gate")[1]?.trim(),
    });
  };

  const getGateListing = async (data) => {
    try {
      handleNavs();
      let terminal = data?.terminal || "";
      const sector = data?.sector || "";
      let allGates = [];
      let gateList = [];

      const apiUrl = config.api.flightGate.gateListing;
      let regResponse = await callAPI.get(apiUrl, {
        terminal: terminal?.toString(),
        type: sector?.toLowerCase(),
      });
      let apiResponse = await regResponse.json();
      if (200 === apiResponse.status) {
        apiResponse?.data?.forEach((gateObj) => {
          allGates = allGates.concat(gateObj.gates);
        });
      }
      if (allGates.length > 0) {
        allGates.sort((a, b) => parseInt(a) - parseInt(b));
        allGates.forEach((gates) => {
          gateList.push({
            value: gates,
            label: `T${terminal}, Boarding Gate ${gates}`,
          });
        });
        return gateList;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddFlightShow = () => {
    setShowAddFlight(true);
  };

  const handleAddFlightClose = (data) => {
    let flights = ClientFlight.myFlights();
    let existingFlight = [];
    if (typeof data === "object" && data !== null && data?.flight_unique_no) {
      if (flights?.length > 1) {
        existingFlight = flights.filter((flt) => flt.UID !== data?.uid);
        if (existingFlight[0]?.UID) {
          ClientFlight.removeFlight(existingFlight[0]?.UID);
        }
      }
      getFlightInfo(data?.flight_unique_no);
    }
    setShowAddFlight(false);
  };

  const handleSubmit = () => {
    let data = JSON.parse(JSON.stringify(getSessionStorage("productsData")));

    data.domain = productDomain.fnb;
    data.terminal = `Terminal${flightData?.terminal}`;

    let movementType = "Departure";
    if (
      flightData?.movementType === "A" ||
      flightData?.movementType?.toLowerCase() === "arrival"
    )
      movementType = "Arrival";
    data.movementType = movementType;

    let sector = "Domestic";
    if (
      flightData?.sector === "I" ||
      flightData?.sector?.toLowerCase() === "international"
    )
      sector = "International";
    data.sector = sector;
    data.deliveryOptions.deliveryAddress = `Gate ${selectedGate?.value}`;
    data.deliveryOptions.deliveryOption = config.deliveryOptions.deliveryAtGate;
    data.deliveryOptions.isDelivery = true;

    let deliveryTime = moment(flightData?.estimatedDate)
      .subtract(
        sector === "Domestic" ? delLeadTimeDom : delLeadTimeInt,
        "minutes"
      )
      .format("lll");

    if (moment(deliveryTime).isSameOrBefore(moment(new Date()))) {
      PushAlert.error(
        `Please select a flight which is at least ${
          sector === "Domestic" ? delLeadTimeDom : delLeadTimeInt
        }mins from current time`
      );
      return;
    }

    if (data.deliveryOptions?.isScheduled) {
      if (
        moment(data.deliveryOptions?.deliveryTime).isSameOrAfter(deliveryTime)
      ) {
        PushAlert.error(
          `Please select a time which is at least ${
            sector === "Domestic" ? delLeadTimeDom : delLeadTimeInt
          }mins before flight time`
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
      }
    }
    setSessionStorage("productsData", data);

    ClientCart.updateFnbItemDelAndFlight(
      data.deliveryOptions,
      flightData.flightId,
      flightData.UID
    );

    checkForConflictingStore(
      data,
      ClientCart,
      setCartConfirmationPromptOpen,
      setConflictingStoreId,
      history,
      proceedForTakeaway
    );
  };

  const clearAndProceed = () => {
    filterCartItems(ClientCart, conflictingStoreId);

    setCartConfirmationPromptOpen(false);
    setConflictingStoreId([]);

    pushHistory("/takeaway");
  };

  const proceedForTakeaway = () => {
    pushHistory("/takeaway");
  };

  const handleGoBack = () => {
    if (!isDeliveryQrCode) {
      pushHistory("/");
    }
  };

  const checkIfFnbMapped = (uid) => {
    let showPopUp = false;
    let cartObject = ClientCart.getCart();
    Object.values(cartObject).forEach((x) => {
      x.items.forEach((citem) => {
        if (
          citem.flightUid === uid &&
          citem?.deliveryOptions?.deliveryOption ===
            config.deliveryOptions.deliveryAtGate
        ) {
          showPopUp = true;
        }
      });
    });
    return showPopUp;
  };

  const handleEditFlightWithProducts = () => {
    let cartObject = ClientCart.getCart();
    Object.values(cartObject).forEach((x) => {
      x.items = x.items.filter(
        (citem) =>
          citem.flightUid !== flightData?.UID &&
          citem?.deliveryOptions?.deliveryOption !==
            config.deliveryOptions.deliveryAtGate
      );
    });
    setShowRemoveFlightModal(false);
    handleAddFlightShow();
  };

  const handleRemoveFlightModalClose = () => {
    setShowRemoveFlightModal(false);
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <PageWrapper>
        <HeaderWrapper>
          <HeaderBackWrapper onClick={() => handleGoBack()}>
            {!isDeliveryQrCode && (
              <BackArrow src={BackArrowIcon} alt="back-arrow" />
            )}
            <HeaderText>
              <Text>Deliver To My Gate</Text>
            </HeaderText>
          </HeaderBackWrapper>
        </HeaderWrapper>
        <ContentWrapper tabIndex={"0"}>
          {!isFlightAdded ? (
            <AddFlightCard
              handleAddFlightShow={handleAddFlightShow}
              handleGoBack={handleGoBack}
            />
          ) : null}
          {isFlightAdded ? (
            <>
              <SelectedFlightCard
                flightData={flightData}
                setFlightData={setFlightData}
                handleAddFlightShow={handleAddFlightShow}
                validateEditFlight={checkIfFnbMapped}
                showRemoveFlightModal={showRemoveFlightModal}
                setShowRemoveFlightModal={setShowRemoveFlightModal}
              />
              <GateSelection
                selectedGate={selectedGate}
                setSelectedGate={setSelectedGate}
                gates={gates}
                flightData={flightData}
                setFlightData={setFlightData}
                time={time}
                setTime={setTime}
                handleAddFlightShow={handleAddFlightShow}
                handleStartOrdering={handleSubmit}
                disableStartOrdering={disableStartOrdering}
                handleGoBack={handleGoBack}
                preOrderAvailable={preOrderAvailable}
              />
            </>
          ) : null}
          <ScheduleOrderBannerWrapper>
            <ScheduledOrderPicker
              value={time}
              setValue={setTime}
              minTime={defaultDatePickerTime()}
              label="Want to pre-order?"
              triggerStyle={{ zIndex: 998 }}
            />
          </ScheduleOrderBannerWrapper>
          {!isFlightAdded && !isDeliveryQrCode ? (
            <OptForTakeawayWrapper>
              <OptForTakeaway />
            </OptForTakeawayWrapper>
          ) : null}
        </ContentWrapper>
        {isFlightAdded ? (
          <FooterWrapper>
            <FooterButton
              onClick={() => handleSubmit()}
              disabled={
                selectedGate === null ||
                selectedGate === undefined ||
                disableStartOrdering === true
              }
            >
              <FooterButtonText>
                <Text type="extra-bold">Start ordering</Text>
              </FooterButtonText>
            </FooterButton>
          </FooterWrapper>
        ) : null}
        {showRemoveFlightModal && (
          <RemoveFlightConfirmation
            modalText={`You have some items in your cart that are mapped to this flight.
            Editing this flight will remove those items from your cart. Do
            you wish to continue?`}
            handleRemoveFlight={handleEditFlightWithProducts}
            onClose={handleRemoveFlightModalClose}
          />
        )}
        {cartConfirmationPromptOpen && (
          <ConfirmationPrompt
            isDrawerOpen={cartConfirmationPromptOpen}
            setIsDrawerOpen={setCartConfirmationPromptOpen}
            clearAndProceed={clearAndProceed}
          />
        )}
        <AddFlightModal
          show={showAddFlight}
          setShow={setShowAddFlight}
          onHide={handleAddFlightClose}
          onExited={handleAddFlightClose}
          fullscreen={true}
        >
          <AddFlight
            handleOnAddFlight={handleAddFlightClose}
            onlyDepartureFlights={true}
            flightSuccessHandler
          />
        </AddFlightModal>
      </PageWrapper>
    );
  }
}

export default DeliveryFlightSelection;
