import axios from "axios";

export const requestMdmMagic = axios.create({
  // baseURL: "http://10.0.0.44:8089",
  baseURL: "http://localhost:8089",
  headers: {
    "Content-Type": "application/json",
    Authorization: "b3a9dc15667e4f6db906e625a0a7d8c3",
  },
});

export const requestMdm = axios.create({
  baseURL: "http://10.0.0.44:8081",
  headers: {
    "Content-Type": "application/json",
    Authorization: "afc-token:7bfb7b808bea4051bef9b07172861984",
  },
});

