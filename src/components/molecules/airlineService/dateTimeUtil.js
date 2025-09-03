const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatTimeToHour = (time) => {
  return time >= 60
    ? Math.floor(time / 60) + "h " + (time % 60) + "m"
    : time + "min";
};

const getTimeFromString = (time) => {
  return time?.split("T")[1].substr(0, 5);
};

const getDateFromString = (time) => {
  return new Date(time?.split("T")[0]).toDateString();
};

const getDateByFormat = (inputDate) => {
  // Fri, 28 Jun 23

  const date = new Date(inputDate);
  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of the year

  const formattedDate = `${dayOfWeek}, ${day} ${month} ${year}`;
  return formattedDate; // Output: "Mon,22Aug23"
};
const getDateByDDMMYYYYFormate = (inputDate) => {
  const date = new Date(inputDate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate; // Output: "22/08/2023"
};


const getDateByYYYYMMDDFormate = (inputDate) => {
  const date = new Date(inputDate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const formattedDate = `${year}/${day}/${month}`;
  return formattedDate; // Output: "2023/08/22"
};

const getDateByHHdddDDMMMFormate = (inputDate) => {
  const date = new Date(inputDate);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];

  const formattedDate = `${hours}:${minutes} ${dayOfWeek} ${day} ${month}`;
  return formattedDate; // Output: "07:20 Mon 22 Aug"
};

const getDateByMMDDYYYYFormate = (inputDate) => {
  const date = new Date(inputDate);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export {
  formatTimeToHour,
  getTimeFromString,
  getDateFromString,
  getDateByFormat,
  getDateByDDMMYYYYFormate,
  getDateByYYYYMMDDFormate,
  getDateByHHdddDDMMMFormate,
  getDateByMMDDYYYYFormate,
};
