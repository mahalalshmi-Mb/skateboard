import React, { useState, useContext, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { NavContext } from "../../../../context/navContext";
import Loader from "../../../../components/atoms/loader";
import {
  ContentContainer,
  OrderListingWrapper,
  PageTitle,
  PageWrapper,
  TabContainer,
  Tab,
  NoDataContainer,
  NoDataText,
} from "./style";
import Text from "../../../../components/atoms/Text";
import TicketCard from "./components/ticketCard";
import moment from "util/momentWrapper";
import { getUserInfo } from "../../../../commons/util/helperFunctions";
import config from "../../../../commons/config";
import callAPI from "../../../../commons/callAPI";

const HelpAndSupport = () => {
  const useNav = useContext(NavContext);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("OPEN TICKETS");
  const [openTickets, setOpenTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);

  useEffect(() => {
    if (isMobile) {
      useNav.hideFooterNavs();
      useNav.hideBottomNavs();
      useNav.showHeaderGoBack();
    } else {
      useNav.hideFooterNavs();
      useNav.hideBottomNavs();
      useNav.hideHeaderGoBack();
    }

    getTickets();

    return () => {
      useNav.showFooterNavs();
      useNav.showBottomNavs();
      useNav.hideHeaderGoBack();
    };
  }, []);

  const getTicketsFromUserInfo = async () => {
    const user = await getUserInfo("both");
    if (user?.metadata?.helpdesk?.tickets) {
      setOpenTickets(user?.metadata?.helpdesk?.tickets?.open || []);
      const filteredList = user?.metadata?.helpdesk?.tickets?.closed?.sort(
        (a, b) => {
          return moment(b?.recordDate) - moment(a?.recordDate);
        }
      );
      setClosedTickets(filteredList || []);
    }
    setIsLoading(false);
  };

  const getTickets = async () => {
    const ticketListing = config.api.helpAndSupport.ticketListing;
    const ticketListingResponse = await callAPI.get(ticketListing);

    const regResponse = await ticketListingResponse.json();
    if (!(regResponse.status === 200 || regResponse.status === 201)) {
      getTicketsFromUserInfo();
      return;
    }

    const tickets = regResponse.data;
    const _openTickets = [];
    const _closedTickets = [];

    tickets.forEach((ticket) => {
      if (ticket?.isOpen) {
        _openTickets.push(ticket);
      } else {
        _closedTickets.push(ticket);
      }
    });

    const _sortedOpen = _openTickets.sort(
      (a, b) => new Date(b.recordDate) - new Date(a.recordDate)
    );
    const _sortedClose = _closedTickets.sort(
      (a, b) => new Date(b.recordDate) - new Date(a.recordDate)
    );

    setOpenTickets(_sortedOpen);
    setClosedTickets(_sortedClose);

    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <PageWrapper
        style={
          openTickets?.length === 0 || closedTickets.length === 0
            ? { height: "100vh" }
            : {}
        }
      >
        <ContentContainer>
          <PageTitle>
            <Text type="bold">My Tickets</Text>
          </PageTitle>
          <TabContainer>
            <Tab
              isSelected={selectedTab === "OPEN TICKETS"}
              onClick={() => setSelectedTab("OPEN TICKETS")}
            >
              <Text
                type={
                  selectedTab === "OPEN TICKETS" ? "extra-bold" : "semi-bold"
                }
              >
                {`OPEN TICKETS (${openTickets?.length})`}
              </Text>
            </Tab>
            <Tab
              isSelected={selectedTab === "CLOSED TICKETS"}
              onClick={() => setSelectedTab("CLOSED TICKETS")}
            >
              <Text
                type={
                  selectedTab === "CLOSED TICKETS" ? "extra-bold" : "semi-bold"
                }
              >
                {`CLOSED TICKETS (${closedTickets?.length})`}
              </Text>
            </Tab>
          </TabContainer>
          <OrderListingWrapper>
            {selectedTab === "OPEN TICKETS" ? (
              openTickets?.length > 0 ? (
                openTickets?.map((x, index) => (
                  <TicketCard data={x} key={index} />
                ))
              ) : (
                <NoDataContainer>
                  <NoDataText style={{ paddingTop: "0px" }}>
                    <Text type="semi-bold">No open tickets</Text>
                  </NoDataText>
                </NoDataContainer>
              )
            ) : closedTickets?.length > 0 ? (
              closedTickets?.map((x, index) => (
                <TicketCard data={x} key={index} />
              ))
            ) : (
              <NoDataContainer>
                <NoDataText>
                  <Text type="semi-bold">No closed tickets</Text>
                </NoDataText>
              </NoDataContainer>
            )}
          </OrderListingWrapper>
        </ContentContainer>
      </PageWrapper>
    );
  }
};

export default HelpAndSupport;
