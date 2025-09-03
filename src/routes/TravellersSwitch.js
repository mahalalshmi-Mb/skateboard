import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Profile from "../pages/profile/profile.js";
import Communication from "../pages/profile/subPages/communication/communication.js";
import EventAccess from "../pages/profile/subPages/EventAccess/EventAccess.js";
import ActiveBooking from "../pages/profile/subPages/MyBookings/ActiveBooking/activeBooking.js";
import MyBooking from "../pages/profile/subPages/MyBookings/myBooking.js";
import BookingDetails from "../pages/profile/subPages/MyBookings/pages/BookingDetails/bookingDetails.js";
import PastBooking from "../pages/profile/subPages/MyBookings/PastBooking/pastBooking.js";
import MyOrders from "../pages/profile/subPages/myOrders/myBooking.js";
import MyRaffles from "../pages/profile/subPages/myRaffles/myRaffles.js";
import PersonalDetails from "../pages/profile/subPages/personalDetails/personalDetails.js";
import Settings from "../pages/profile/subPages/Settings/Settings.js";
import VerifyEmail from "../pages/profile/subPages/verifyEmail/verifyEmail.js";
import HelpAndSupport from "../pages/profile/subPages/HelpAndSupport/helpAndSupport.js";
import OrderCheckin from "pages/orderCheckin/orderCheckin.js";

const TravellersSwitch = (props) => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/profile`}>
        <Profile {...props} title="Profile" />
      </Route>
      <Route exact path={`${path}/profile/personalDetails`}>
        <PersonalDetails {...props} title="Profile" />
      </Route>
      <Route exact path={`${path}/profile/myRaffles`}>
        <MyRaffles {...props} title="My Raffles" />
      </Route>
      <Route exact path={`${path}/profile/personalDetails/verify/email`}>
        <VerifyEmail {...props} title="Verify Email" />
      </Route>
      <Route exact path={`${path}/profile/myOrders`}>
        <MyOrders {...props} title="My Orders" />
      </Route>
      <Route exact path={`${path}/profile/myBookings`}>
        <MyBooking {...props} title="My Bookings" />
      </Route>
      <Route exact path={`${path}/profile/activeOrders`}>
        <ActiveBooking {...props} title="My Orders" />
      </Route>
      <Route exact path={`${path}/profile/pastOrders`}>
        <PastBooking {...props} title="My Orders" />
      </Route>
      <Route exact path={`${path}/profile/myBookings/:orderId/:orderType`}>
        <BookingDetails {...props} title="My Bookings" />
      </Route>
      <Route exact path={`${path}/profile/settings`}>
        <Settings {...props} title="Settings" />
      </Route>
      <Route exact path={`${path}/profile/settings/communication`}>
        <Communication {...props} title="Communication" />
      </Route>
      <Route exact path={`${path}/profile/event-access`}>
        <EventAccess {...props} title="Event Access" />
      </Route>
      <Route exact path={`${path}/profile/help-and-support`}>
        <HelpAndSupport {...props} title="Event Access" />
      </Route>
      <Route exact path={`${path}/checkin`}>
        <OrderCheckin {...props} title="Check-in" />
      </Route>
    </Switch>
  );
};

export default TravellersSwitch;
