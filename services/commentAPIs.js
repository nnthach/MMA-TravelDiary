import axiosClient from "../config/axiosClient";

const commentAPIs = {
  getById: (id) => axiosClient.get(`/comments/${id}`),
  create: (data) => axiosClient.post("/comments", data),
  update: (id, data) => axiosClient.put(`/comments/${id}`, data),
  delete: (id) => axiosClient.delete(`/comments/${id}`),
};

export default commentAPIs;
