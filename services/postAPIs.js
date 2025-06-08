import axiosClient from "../config/axiosClient";

const postAPIs = {
  getAllPost: () => axiosClient.get("/post"),
  getById: (id) => axiosClient.get(`/post/${id}`),
  create: (data) => axiosClient.post("/post", data),
  update: (id, data) => axiosClient.put(`/post/${id}`, data),
  delete: (id) => axiosClient.delete(`/users/${id}`),
};

export default postAPIs;
