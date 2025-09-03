export const CancellationReason = {
  Others: [
    { value: "r01", label: "Order created by mistake" },
    { value: "r02", label: "Found cheaper item elsewhere" },
    { value: "r03", label: "Incorrect shipping address entered" },
    { value: "r04", label: "Incorrect payment method entered" },
    { value: "r05", label: "Item not arrived on time" },
  ],
  Lounge: [
    { value: "r01", label: "Flight delayed" },
    { value: "r02", label: "Flight cancelled" },
    { value: "r03", label: "Trip cancelled" },
    { value: "r04", label: "Order created by mistake" },
  ],
  "Duty Free": [
    { value: "r01", label: "Order created by mistake" },
    { value: "r02", label: "Found cheaper item elsewhere" },
    { value: "r03", label: "Incorrect payment method entered" },
    { value: "r04", label: "Others" },
  ],
};

export const RaiseIssueTitle = {
  Common: [
    { value: "r01", label: "Need help with refund" },
    { value: "r02", label: "Need help with invoice" },
    { value: "r03", label: "Need a callback" },
    { value: "r04", label: "Order not confirmed" },
    { value: "r05", label: "Order not fulfilled" },
    { value: "r06", label: "Others" },
  ],
  Cab: [
    { value: "r01", label: "Driver not assigned" },
    { value: "r02", label: "Driver not answering" },
    { value: "r03", label: "Delay in pickup" },
    { value: "r04", label: "Need help with rescheduling" },
  ],
  "Duty Free": [{ value: "r01", label: "Item out of stock" }],
  "Flight Booking": [
    { value: "r01", label: "PNR not generated" },
    { value: "r02", label: "Need ticket copy" },
    { value: "r03", label: "Need help with rescheduling" },
    { value: "r04", label: "Need correction in user information" },
  ],
  "Food and Beverages": [{ value: "r01", label: "Item not delivered" }],
};
