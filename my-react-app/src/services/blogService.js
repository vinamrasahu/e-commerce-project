import API from "./axios";

export const getBlogs = () =>
  API.get("/blogs");

export const getBlogById = (id) =>
  API.get(`/blogs/${id}`);

export const createBlog = (data) =>
  API.post("/blogs", data);

export const updateBlog = (id, data) =>
  API.put(`/blogs/${id}`, data);

export const deleteBlog = (id) =>
  API.delete(`/blogs/${id}`);