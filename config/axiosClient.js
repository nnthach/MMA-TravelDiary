import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const axiosClient = axios.create({
  // baseURL: "http://10.0.2.2:3000/v1", // Thay đổi URL thành 10.0.2.2 cho Android Emulator
  baseURL: "http://192.168.1.3:3000/v1",
  timeout: 10000, // Timeout thời gian yêu cầu
  headers: {
    "Content-Type": "application/json",
  },
});

// Case truyen token vao header khi call api
axiosClient.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    if (config.skipAuth) return config;
    const accessToken = await AsyncStorage.getItem("accessToken");

    try {
      console.log("send acTokne", accessToken);

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    } catch (error) {
      console.log("Error reading token", error);
      return config; // vẫn gửi request nếu không có token
    }
  },
  function (error) {
    console.log("send actoken err", error);
    // Do something with request error
    return Promise.reject(error);
  }
);

// Case token expire or invalid => refreshToken
// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    console.log("axios res", response.data);
    return response;
  },
  async function (error) {
    console.log("axios res error", error);

    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("originalReq retry", originalRequest._retry);
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      console.log("refreshToken", refreshToken);

      if (!refreshToken) return Promise.reject(error);

      try {
        console.log("start refresh token");
        const res = await userApi.refreshToken({ refreshToken });
        console.log("refreshtoken called res", res);

        const newAccessToken = res.data.accessToken;

        AsyncStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    if (error.response) {
      const { status, data } = error.response;
      console.log("Axios Error:", status, data?.message || data);
    } else {
      console.log("Axios Unknown Error:", error.message);
    }

    console.log("res error", error);
    return Promise.reject(error);
  }
);

export default axiosClient;
