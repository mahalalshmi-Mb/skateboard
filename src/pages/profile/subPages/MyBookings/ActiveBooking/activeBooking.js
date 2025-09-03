import React, { useContext, useEffect, useState } from "react";
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
  const useNav = useContext(NavContext);
  const [activeBookings, setActiveBookings] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [reRender, setIsReRender] = useState(true);

  useEffect(() => {
    if (isMobile) {
      useNav.hideFooterNavs();
      useNav.showHeaderGoBack();
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
    getActiveBookings();
  }, [reRender]);

  const getActiveBookings = async () => {
    try {
      setIsLoading(true);
      let apiURL = config.api.myOrders.activeOrders;
      let apiResponse = await callAPI.get(apiURL, {
        isSelf: "Y",
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
            <Text type="extra-bold">{`Active Orders (${metaData?.totalRecords})`}</Text>
          </PageTitle>
          <OrderContainer
            style={{ paddingTop: !activeBookings.length ? "0px" : null }}
          >
            {activeBookings?.map((orderItem, orderIndex) => (
              <OrderWrapper key={orderIndex}>
                <OrderIdText>
                  <Text type="bold">{`Order Id - ${getOrderId(
                    orderItem?.header,
                    "half"
                  )}`}</Text>
                </OrderIdText>
                <OrderCardWrapper>
                  {orderItem?.children?.map((subOrderItem, subOrderIndex) => (
                    <Card
                      type="activeBooking"
                      item={subOrderItem}
                      key={subOrderIndex}
                      orderId={getOrderId(orderItem?.header, "full")}
                      reRender={reRender}
                      setIsReRender={setIsReRender}
                    />
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
