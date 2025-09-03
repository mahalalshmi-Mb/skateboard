import Util from "../../../commons/util/util";
import { getHotelLoungeFormParam, getHotelLoungeRoomParam } from "./EventParam";

export const triggerHotelSearchRooms = (sessionData) => {
  const eventData = getHotelLoungeFormParam(sessionData);
  Util.triggerMoEngageEvent("hotel_search_rooms", eventData);
};

export const triggerHotelRoomAdd = (roomData, bookingData) => {
  const eventData = getHotelLoungeRoomParam(roomData, bookingData);
  Util.triggerMoEngageEvent("hotel_room_add", eventData);
};

export const triggerHotelRoomDecrement = (roomData, bookingData, currQty) => {
  const eventData = getHotelLoungeRoomParam(roomData, bookingData);
  Util.triggerMoEngageEvent("hotel_room_decrement", eventData, {
    room_qty: currQty,
  });
};

export const triggerHotelRoomIncrement = (roomData, bookingData, currQty) => {
  const eventData = getHotelLoungeRoomParam(roomData, bookingData);
  Util.triggerMoEngageEvent("hotel_room_increment", eventData, {
    room_qty: currQty,
  });
};

export const triggerHotelUserDetailsConfirmed = (sessionData) => {
  const eventData = getHotelLoungeFormParam(sessionData);
  Util.triggerMoEngageEvent("hotel_user_details_confirmed", eventData);
};
