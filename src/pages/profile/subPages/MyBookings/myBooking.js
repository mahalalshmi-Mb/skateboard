import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { isMobile } from "react-device-detect";
import { NavContext } from "../../../../context/navContext";
import config from "../../../../commons/config";
import callAPI from "../../../../commons/callAPI";
import Loader from "../../../../components/atoms/loader";
import {
  ContentContainer,
  NoDataContainer,
  NoDataImg,
  NoDataText,
  OrderListingContainer,
  PageTitle,
  PageWrapper,
  Tab,
  TabContainer,
} from "./style";
import Text from "../../../../components/atoms/Text";
import OrderCard from "./components/orderCard";
import NoActiveBooking from "./assets/no-active-orders.svg";
import NoPastBooking from "./assets/no-past-orders.svg";

function MyBooking(props) {
  const useNav = useContext(NavContext);
  const observer = useRef();
  const [selectedTab, setSelectedTab] = useState("ACTIVE ORDERS");
  const [activeBookings, setActiveBookings] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [reRender, setIsReRender] = useState(true);

  const [pastBookings, setPastBookings] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [limit, setLimit] = useState(5);
  const [pastIsLoading, setPastIsLoading] = useState(true);
  const [pastError, setPastError] = useState(false);
  const [pastHasMore, setPastHasMore] = useState(false);

  const lastPastElement = useCallback(
    (node) => {
      if (pastIsLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pastHasMore) {
          setPageNo(pageNo + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [pastIsLoading, pastHasMore]
  );

  useEffect(() => {
    if (isMobile) {
      useNav.hideFooterNavs();
      useNav.showHeaderGoBack();
    } else {
      useNav.hideFooterNavs();
      useNav.hideHeaderGoBack();
    }

    return () => {
      useNav.showFooterNavs();
      useNav.hideHeaderGoBack();
      useNav.showHeaderNavs();
    };
  }, []);

  useEffect(() => {
    getActiveBookings();
  }, [reRender]);

  useEffect(() => {
    getPastBookings();
  }, [pageNo]);

  const getActiveBookings = async () => {
    try {
      setIsLoading(true);
      let apiURL = config.api.myOrders.activeOrders;
      let apiResponse = await callAPI.get(apiURL, {
        isSelf: "Y",
        flatresponse: "N",
        neatresponse: "Y",
      });
      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        setActiveBookings(regResponse.data);
        setMetaData(regResponse?.metadata);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getPastBookings = async () => {
    try {
      setPastIsLoading(true);
      setPastError(false);
      setPastHasMore(false);
      let apiURL = config.api.myOrders.pastOrders;
      let apiResponse = await callAPI.get(apiURL, {
        pageNo: pageNo,
        limit,
        flatresponse: "N",
        neatresponse: "Y",
      });
      let regResponse = await apiResponse.json();
      if (regResponse.status === 200) {
        setMetaData(regResponse?.metadata);
        setPastBookings([...pastBookings, ...regResponse.data]);
        setIsLoading(false);
        if (regResponse?.data?.length) setPastHasMore(true);
        setPastIsLoading(false);
      }
    } catch (e) {
      setPastError(true);
      console.log(e);
    }
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <PageWrapper>
        <ContentContainer>
          <PageTitle>
            <Text type="bold">My Orders</Text>
          </PageTitle>
          <TabContainer>
            <Tab
              isSelected={selectedTab === "ACTIVE ORDERS"}
              onClick={() => setSelectedTab("ACTIVE ORDERS")}
            >
              <Text
                type={
                  selectedTab === "ACTIVE ORDERS" ? "extra-bold" : "semi-bold"
                }
              >
                ACTIVE ORDERS
              </Text>
            </Tab>
            <Tab
              isSelected={selectedTab === "PAST ORDERS"}
              onClick={() => setSelectedTab("PAST ORDERS")}
            >
              <Text
                type={
                  selectedTab === "PAST ORDERS" ? "extra-bold" : "semi-bold"
                }
              >
                PAST ORDERS
              </Text>
            </Tab>
          </TabContainer>
          <OrderListingContainer>
            {selectedTab === "ACTIVE ORDERS" ? (
              activeBookings?.length > 0 ? (
                activeBookings?.map((item, index) => (
                  <OrderCard key={index} item={item} orderType="active" />
                ))
              ) : (
                <NoDataContainer>
                  <NoDataImg src={NoActiveBooking} />
                  <NoDataText style={{ paddingTop: "0px" }}>
                    <Text type="semi-bold">No orders in sight</Text>
                  </NoDataText>
                </NoDataContainer>
              )
            ) : pastBookings?.length > 0 ? (
              pastBookings?.map((item, index) => (
                <div ref={lastPastElement}>
                  <OrderCard key={index} item={item} orderType="past" />
                </div>
              ))
            ) : (
              <NoDataContainer>
                <NoDataImg src={NoPastBooking} />
                <NoDataText>
                  <Text type="semi-bold">You do not have any past orders</Text>
                </NoDataText>
              </NoDataContainer>
            )}
          </OrderListingContainer>
        </ContentContainer>
      </PageWrapper>
    );
  }
}

export default MyBooking;
