import axios from "axios";

const BASE_URL = "https://randomuser.me";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // timeout: 1000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
  withCredentials: false,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    console.log(error, "Request error");
    return Promise.reject(error);
  }
);



axiosInstance.interceptors.response.use(null, (error) => {
  const expectedErrors =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedErrors) {
    console.log("logging error", error);
  }
  return Promise.reject(error);
});

export default axiosInstance;
