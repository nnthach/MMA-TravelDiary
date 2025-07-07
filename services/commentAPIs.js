import axiosClient from "../config/axiosClient";

const commentAPIs = {
  // getAllPost: () => axiosClient.get("/post?public=true"),
  // getById: (id) => axiosClient.get(`/post/${id}`),
  // getByUserIdAndPublic: (id, query) =>
  //   axiosClient.get(`/post/user/${id}?public=${query}`),
  create: (data) => axiosClient.post("/comments", data),
  // update: (id, data) => axiosClient.put(`/post/${id}`, data),
  // delete: (id) => axiosClient.delete(`/post/${id}`),
};

export default commentAPIs;
