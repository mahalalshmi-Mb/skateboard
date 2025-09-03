export const getFlightParam = (flightData) => {
  return {
    flight_uid: flightData?.UID,
    flight_id: flightData?.flightId,
    movement: flightData?.movementType === "D" ? "departure" : "arrival",
    sector: flightData?.sector,
    terminal: flightData?.baseTerminal,
    source: flightData?.baseAirportName,
    destination: flightData?.srcDestAirportName,
    gate_id: flightData?.gateId,
    schedule_date: flightData?.scheduleDate,
    schedule_time: flightData?.scheduleTime,
    schedule_date_time: flightData?.scheduleDateTime,
    airline: flightData?.airlineName,
  };
};

export const getHotelLoungeFormParam = (sessionData) => {
  const data = {
    adults: sessionData?.adults,
    children: sessionData?.children,
    rooms: sessionData?.rooms,
    duration: sessionData?.duration,
    check_in_date: sessionData?.checkInTime,
    check_in_time: new Date(sessionData?.checkInTime).getTime(),
    service_id: sessionData?.serviceId,
  };

  const flightData = getFlightParam(sessionData?.flightData);
  return { ...data, ...flightData };
};

export const getHotelLoungeRoomParam = (roomData, bookingData) => {
  console.log("roomData", roomData);
  const data = {
    room_id: roomData?._id,
    room_name: roomData?.title,
    room_price: roomData?.pricing?.latestGrossPrice[0]?.grossPrice,
  };
  const formData = getHotelLoungeFormParam(bookingData);
  return { ...data, ...formData };
};
