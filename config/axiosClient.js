import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import userApi from "../services/userApi";

const axiosClient = axios.create({
  // baseURL: "http://10.0.2.2:3000/v1", // Thay đổi URL thành 10.0.2.2 cho Android Emulator
  baseURL: "http://192.168.1.4:3000/v1",
  timeout: 10000, // Timeout thời gian yêu cầu
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn accessToken vào mỗi request
axiosClient.interceptors.request.use(
  async (config) => {
    if (config.skipAuth) return config;

    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log("🔐 send accessToken:", accessToken);
      }
    } catch (err) {
      console.log("❌ Error reading accessToken", err);
    }

    return config;
  },
  (error) => {
    console.log("❌ Request error", error);
    return Promise.reject(error);
  }
);

// Xử lý refresh token khi accessToken hết hạn
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("🔁 Token expired. Attempting refresh...");

      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.log("⚠️ No refresh token available.");
        return Promise.reject(error);
      }

      try {
        const res = await userApi.refreshToken({ refreshToken });
        const newAccessToken = res.data.accessToken;

        console.log("✅ Token refreshed:", newAccessToken);

        // Cập nhật lại token và retry request cũ
        await AsyncStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);
      } catch (refreshErr) {
        console.log("❌ Refresh token failed:", refreshErr.response?.data || refreshErr.message);

        // Clear token → logout
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");

        // 👉 Có thể thêm navigation.navigate('Login') tại đây nếu dùng React Navigation

        return Promise.reject(refreshErr); // DỪNG lặp
      }
    }

    // Các lỗi khác (không phải 401)
    if (error.response) {
      const { status, data } = error.response;
      console.log("Axios Error:", status, data?.message || data);
    } else {
      console.log("Axios Unknown Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
