import axiosClient from "../config/axiosClient";

const postAPIs = {
  getAllPost: () => axiosClient.get("/post"),
  getById: (id) => axiosClient.get(`/post/${id}`),
  getByUserId: (id) => axiosClient.get(`/post/user/${id}`),
  create: (data) => axiosClient.post("/post", data),
  update: (id, data) => axiosClient.put(`/post/${id}`, data),
  delete: (id) => axiosClient.delete(`/post/${id}`),
};

export default postAPIs;
