import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://10.0.2.2:3000/v1", // Thay đổi URL thành 10.0.2.2 cho Android Emulator
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
    console.log("err res", error.response);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (!refreshToken) return Promise.reject(error);

      try {
        const res = await refreshTokenAPI({ refreshToken });

        const newAccessToken = res.data.accessToken;

        AsyncStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    console.log("res error", error);
    return Promise.reject(error);
  }
);

// axiosClient.interceptors.request.use(
//   (config) => config,
//   (error) => Promise.reject(error)
// );

// axiosClient.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     // Đưa ra lỗi rõ ràng khi có vấn đề
//     console.error("Axios Error:", error);
//     return Promise.reject(error);
//   }
// );

export default axiosClient;
