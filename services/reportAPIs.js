import axiosClient from "../config/axiosClient";

const reportAPIs = {
  create: (data) => axiosClient.post("/report", data),
};

export default reportAPIs;