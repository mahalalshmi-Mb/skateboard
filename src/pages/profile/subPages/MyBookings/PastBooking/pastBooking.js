import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { isMobile } from "react-device-detect";
import callAPI from "../../../../../commons/callAPI";
import config from "../../../../../commons/config";
import Text from "../../../../../components/atoms/Text";
import Loader from "../../../../../components/atoms/loader";
import { NavContext } from "../../../../../context/navContext";
import Card from "../../myOrders/subcomponent/card/card";
import {
  ContentContainer,
  OrderCardWrapper,
  OrderContainer,
  OrderIdText,
  OrderWrapper,
  PageTitle,
  PageWrapper,
} from "./style";

function ActiveBooking(props) {
  const observer = useRef();
  const useNav = useContext(NavContext);
  const [pastBookings, setPastBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNo, setPageNo] = useState(0);
  const [limit, setLimit] = useState(5);
  const [pastIsLoading, setPastIsLoading] = useState(true);
  const [pastError, setPastError] = useState(false);
  const [pastHasMore, setPastHasMore] = useState(false);
  const [metaData, setMetaData] = useState({});

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
      // if (!Util.isIosWebView()) {
      useNav.showHeaderGoBack();
      // }
    } else {
      useNav.showFooterNavs();
      useNav.hideHeaderGoBack();
    }

    return () => {
      useNav.showFooterNavs();
      useNav.hideHeaderGoBack();
    };
  }, []);

  useEffect(() => {
    getPastBookings();
  }, [pageNo]);

  const getPastBookings = async () => {
    try {
      setPastIsLoading(true);
      setPastError(false);
      setPastHasMore(false);
      let apiURL = config.api.myOrders.pastOrders;
      let apiResponse = await callAPI.patch(apiURL, {
        pageNo: pageNo,
        limit,
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

  const getOrderId = (headerArr, orderIdType) => {
    let found;
    if (orderIdType === "full") {
      found = headerArr?.find((x) => x.display?.startsWith("Full-Order#"));
    } else {
      found = headerArr?.find((x) => x.display?.startsWith("Order#"));
    }
    if (found) {
      return found.value;
    } else {
      return "";
    }
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <PageWrapper>
        <ContentContainer>
          <PageTitle>
            <Text type="extra-bold">{`Past Orders`}</Text>
          </PageTitle>
          <OrderContainer
            style={{ paddingTop: !pastBookings.length ? "0px" : null }}
          >
            {pastBookings?.map((orderItem, orderIndex) => (
              <OrderWrapper key={orderIndex}>
                <OrderIdText>
                  <Text type="bold">{`Order Id - ${getOrderId(
                    orderItem?.header,
                    "half"
                  )}`}</Text>
                </OrderIdText>
                <OrderCardWrapper>
                  {orderItem?.children?.map((subOrderItem, subOrderIndex) => (
                    <div ref={lastPastElement}>
                      <Card
                        item={subOrderItem}
                        key={subOrderIndex}
                        orderId={getOrderId(orderItem?.header, "full")}
                      />
                    </div>
                  ))}
                </OrderCardWrapper>
              </OrderWrapper>
            ))}
          </OrderContainer>
        </ContentContainer>
      </PageWrapper>
    );
  }
}

export default ActiveBooking;
