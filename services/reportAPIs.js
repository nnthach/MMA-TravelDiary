import axiosClient from "../config/axiosClient";

const reportAPIs = {
  getAllReports: (data) => axiosClient.get("/report",data ),
  create: (data) => axiosClient.post("/report", data),
    update: (id, data) => axiosClient.put(`/report/${id}`, data),

};

export default reportAPIs;