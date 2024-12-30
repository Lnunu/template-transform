import axios from "axios";

export const requestMdm = axios.create({
  baseURL: "http://localhost:8089/",
  headers: {
    "Content-Type": "application/json",
    Authorization: "b3a9dc15667e4f6db906e625a0a7d8c3",
  },
});
