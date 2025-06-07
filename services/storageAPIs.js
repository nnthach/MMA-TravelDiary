import axiosClient from "../config/axiosClient";

const storageAPIs = {
  getStorageOfUser: (id) => axiosClient.get(`/storage/${id}`),
  create: (id, data) => axiosClient.patch(`/storage/${id}`, data),
  delete: (userId, postId) =>
    axiosClient.delete(`/storage/${userId}/${postId}`),
};

export default storageAPIs;
