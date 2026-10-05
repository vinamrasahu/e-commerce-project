import api from "./axios";

export const sendContact = async (data) => {
  const response = await api.post("/contact", data);
  return response.data;
};  