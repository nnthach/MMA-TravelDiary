import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://10.0.2.2:3000/v1',  // Thay đổi URL thành 10.0.2.2 cho Android Emulator
  timeout: 10000,  // Timeout thời gian yêu cầu
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Đưa ra lỗi rõ ràng khi có vấn đề
    console.error('Axios Error:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;
