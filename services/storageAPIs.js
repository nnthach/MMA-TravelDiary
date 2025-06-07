import axiosClient from "../config/axiosClient";

const storageAPIs = {
  getStorageOfUser: (id) => axiosClient.get(`/storage/${id}`),
  getById: (id) => axiosClient.get(`/post/${id}`),
  create: (data) => axiosClient.post("/storage", data),
  update: (id, data) => axiosClient.put(`/users/${id}`, data),
  delete: (id) => axiosClient.delete(`/users/${id}`),
};

export default storageAPIs;
