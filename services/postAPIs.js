import axiosClient from "../config/axiosClient";

const postAPIs = {
  getAllPost: () => axiosClient.get("/post?public=true"),
  getById: (id) => axiosClient.get(`/post/${id}`),
  getByUserIdAndPublic: (id, query) =>
    axiosClient.get(`/post/user/${id}?public=${query}`),
  getAllUserPosts: (id) => axiosClient.get(`/post/user/${id}`),
  create: (data) => axiosClient.post("/post", data),
  update: (id, data) => axiosClient.put(`/post/${id}`, data),
  delete: (id) => axiosClient.delete(`/post/${id}`),
  toggleLike: (postId, userId) =>
    axiosClient.patch(`/post/like/${postId}`, { userId }),
  search: (params) => axiosClient.get("/post/search", { params }),
};

export default postAPIs;
