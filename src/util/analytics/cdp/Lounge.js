import Util from "../../../commons/util/util";
import { getHotelLoungeFormParam, getHotelLoungeRoomParam } from "./EventParam";

export const triggerLoungeBookAccess = (sessionData) => {
  const eventData = getHotelLoungeFormParam(sessionData);
  Util.triggerMoEngageEvent("lounge_book_access", eventData);
};

export const triggerLoungeRoomAdd = (roomData, bookingData) => {
  const eventData = getHotelLoungeRoomParam(roomData, bookingData);
  Util.triggerMoEngageEvent("lounge_room_add", eventData);
};

export const triggerLoungeRoomDecrement = (roomData, bookingData, currQty) => {
  const eventData = getHotelLoungeRoomParam(roomData, bookingData);
  Util.triggerMoEngageEvent("lounge_room_decrement", eventData, {
    room_qty: currQty,
  });
};

export const triggerLoungeRoomIncrement = (roomData, bookingData, currQty) => {
  const eventData = getHotelLoungeRoomParam(roomData, bookingData);
  Util.triggerMoEngageEvent("lounge_room_increment", eventData, {
    room_qty: currQty,
  });
};

export const triggerLoungeUserDetailsConfirmed = (sessionData) => {
  const eventData = getHotelLoungeFormParam(sessionData);
  Util.triggerMoEngageEvent("lounge_user_details_confirmed", eventData);
}