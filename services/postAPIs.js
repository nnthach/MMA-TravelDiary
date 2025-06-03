import axiosClient from "../config/axiosClient";

const postAPIs = {
  getAllPost: () => axiosClient.get("/post"),
  getById: (id) => axiosClient.get(`/users/${id}`),
  create: (data) => axiosClient.post("/users", data),
  update: (id, data) => axiosClient.put(`/users/${id}`, data),
  delete: (id) => axiosClient.delete(`/users/${id}`),
};

export default postAPIs;
