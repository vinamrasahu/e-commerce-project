import API from "./axios";

export const getSliders = () => API.get("/sliders");

export const getSliderById = (id) =>
  API.get(`/sliders/${id}`);

export const createSlider = (data) =>
  API.post("/sliders", data);

export const updateSlider = (id, data) =>
  API.put(`/sliders/${id}`, data);

export const deleteSlider = (id) =>
  API.delete(`/sliders/${id}`);