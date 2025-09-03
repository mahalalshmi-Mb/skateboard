import axios from "axios";

export const edpApi = axios.create({
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
  credentials: "include",
});
