import axiosClient from "../config/axiosClient";

const postAPIs = {
  getAllPost: () => axiosClient.get("/post"),
  getById: (id) => axiosClient.get(`/post/${id}`),
  getByUserIdAndPublic: (id, query) =>
    axiosClient.get(`/post/user/${id}?public=${query}`),
  create: (data) => axiosClient.post("/post", data),
  update: (id, data) => axiosClient.put(`/post/${id}`, data),
  delete: (id) => axiosClient.delete(`/post/${id}`),
};

export default postAPIs;
