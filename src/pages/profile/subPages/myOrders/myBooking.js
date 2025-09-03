import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

//components
import config from "../../../../commons/config";
import Loader from "../../../../components/atoms/loader";
import "./myBooking.css";

//media
import { useCookies } from "react-cookie";
import ArrowUp from "../../../../assets/images/myBookings/arrowUpGreen.svg";
import callAPI from "../../../../commons/callAPI";
import Card from "./subcomponent/card/card";
import Text from "../../../../components/atoms/Text";
import useCustomNavigation from "../../../../hooks/useCustomNavigation";

const useStyles = makeStyles(
  (theme) => ({
    expand: {
      display: "flex",
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
  }),
  { index: 1 }
);

const MyBookings = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { pushHistory } = useCustomNavigation();

  const [cookies, setCookie] = useCookies(["gwLoginData"]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActiveOpen, setIsActiveOpen] = useState(true);
  const [isPastOpen, setIsPastOpen] = useState(false);

  const [activeBooking, setActiveBooking] = useState([]);
  const [activeBookingCount, setActiveBookingCount] = useState(0);

  //pastBookingsHooks
  const [isFlightBookingOpen, setIsFlightBookingOpen] = useState(true);
  const [pastBooking, setPastBooking] = useState([]);
  const [pastBookingCount, setPastBookingCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [limit, setLimit] = useState(5);
  const [pastIsLoading, setPastIsLoading] = useState(true);
  const [pastError, setPastError] = useState(false);
  const [pastHasMore, setPastHasMore] = useState(false);
  const [reRender, setIsReRender] = useState(true);

  const observer = useRef();
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
    if (!cookies.gwLoginData || !cookies.gwLoginData.mobile) {
      localStorage.setItem("module", "myBooking");
      pushHistory("/");
    } else {
      localStorage.removeItem("module");
    }
  }, []);

  useEffect(() => {
    getActiveBookings();
  }, []);

  useEffect(() => {
    getPastBookings();
  }, [pageNo]);

  function getActiveBookings() {
    callAPI
      .get(config.api.myOrders.activeOrders, {
        isSelf: "Y",
      })
      .then((data) => {
        // console.log(response.status) --> 401
        return data.json();
      })
      .then((data) => {
        if (data.type === "success" && data.status === 200) {
          const jsonData = data.data;
          setActiveBooking(jsonData);
          setActiveBookingCount(jsonData.length);
          setIsActiveOpen(true);
          setIsPastOpen(false);
          setIsLoading(false);
        } else {
          setIsActiveOpen(false);
          setIsPastOpen(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getPastBookings() {
    setPastIsLoading(true);
    setPastError(false);
    setPastHasMore(false);

    callAPI
      .patch(
        config.api.myOrders.pastOrders,
        {
          pageNo: pageNo,
          limit,
        },
        "",
        false
      )
      .then((data) => {
        // console.log(response.status) --> 401
        return data.json();
      })
      .then((data) => {
        if (data.data) {
          const response = data.data;
          setPastBookingCount(data.count && data.count[0].items);
          setPastBooking([...pastBooking, ...response]);
          setIsLoading(false);
          if (response.length) setPastHasMore(true);
          setPastIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setPastError(true);
      });
  }

  function handleHeaderClick(type) {
    if (type === "past") {
      setIsPastOpen(!isPastOpen);
    } else if (type === "active") {
      setIsActiveOpen(!isActiveOpen);
    } else if (type === "flight-booking") {
      setIsFlightBookingOpen(!isFlightBookingOpen);
    } else {
      setIsActiveOpen(!isActiveOpen);
      setIsPastOpen(!isPastOpen);
      setIsFlightBookingOpen(!isFlightBookingOpen);
    }
  }

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

  return (
    <div className="myBookings-container">
      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div className="content-container">
          <div
            className={
              activeBooking.length
                ? "booking-header-wrapper"
                : "booking-header-wrapper disabled"
            }
            onClick={() => handleHeaderClick("active")}
          >
            <div className="booking-header">
              <h4 className="booking-header-text">{`Active Booking ${
                activeBookingCount ? "(" : ""
              } ${activeBookingCount ? activeBookingCount : ""} ${
                activeBookingCount ? ")" : ""
              }`}</h4>

              <div className="bookings-num-text">
                <div
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: isActiveOpen,
                  })}
                  aria-expanded={isActiveOpen}
                  aria-label="show more active bookings"
                >
                  <img src={ArrowUp} alt="no image found" />
                </div>
              </div>
            </div>
          </div>
          {activeBooking.length && isActiveOpen ? (
            <div
              className={`booking-section ${
                isActiveOpen ? "booking-section-open" : null
              }`}
            >
              {activeBooking.map((orderItem, index) => (
                <div className="order-wrapper" key={index}>
                  <div className="order-id-wrapper">
                    <Text type="bold">
                      {`Order Id - ${getOrderId(orderItem?.header, "half")}`}
                    </Text>
                  </div>
                  <div className="order-card-wrapper">
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
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <div
            className={
              pastBooking.length
                ? "booking-header-wrapper"
                : "booking-header-wrapper disabled"
            }
            onClick={() => handleHeaderClick("past")}
          >
            <div className="booking-header">
              <div className="booking-header-text">Past Booking</div>
              <div className="bookings-num-text">
                <div
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: isPastOpen,
                  })}
                  aria-expanded={isPastOpen}
                  aria-label="show more past bookings"
                >
                  <img src={ArrowUp} alt="no image found" />
                </div>
              </div>
            </div>
          </div>
          {isPastOpen && pastBooking.length ? (
            <div className="booking-section">
              {pastBooking.map((orderItem, index) => (
                <div className="order-wrapper" key={index}>
                  <div className="order-id-wrapper">
                    <Text type="bold">{`Order Id - ${getOrderId(
                      orderItem?.header,
                      "half"
                    )}`}</Text>
                  </div>
                  <div className="order-card-wrapper">
                    {orderItem?.children?.map((subOrderItem, subOrderIndex) => (
                      <div ref={lastPastElement}>
                        <Card
                          item={subOrderItem}
                          key={subOrderIndex}
                          orderId={getOrderId(orderItem?.header, "full")}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
