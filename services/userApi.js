import axiosClient from "../config/axiosClient";

const userApi = {
  getAll: () => axiosClient.get("/users"), // GET /v1/users
  getById: (id) => axiosClient.get(`/users/${id}`), // GET /v1/users/:id
  create: (data) => axiosClient.post("/users", data), // POST /v1/users
  update: (id, data) => axiosClient.put(`/users/${id}`, data), // PUT /v1/users/:id
  delete: (id) => axiosClient.delete(`/users/${id}`), // DELETE /v1/users/:id

  login: (data) => axiosClient.post("/users/login", data),
};

export default userApi;
