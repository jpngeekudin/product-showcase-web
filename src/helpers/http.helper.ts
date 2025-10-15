import axios from "axios";
import { getStorageItem } from "./storage.helper";

const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.request.use((req) => {
  const { token } = getStorageItem("auth");

  if (!!token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

axiosInstance.interceptors.response.use(
  (resp) => {
    return resp;
  },
  (err) => {
    if (err.response.status === 401 || err.response.status === 403) {
      localStorage.clear();
      window.location.href = "/";
    }
  }
);

export { axiosInstance };
