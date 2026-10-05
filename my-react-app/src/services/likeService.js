import api from "./axios";

export const addLike = async (productId) => {
  const res = await api.post("/likes", {
    productId,
  });

  return res.data;
};

export const getLikes = async () => {
  const res = await api.get("/likes");

  return res.data;
};

export const removeLike = async (productId) => {
  const res = await api.delete(`/likes/${productId}`);

  return res.data;
};

export const checkLike = async (productId) => {
  const res = await api.get(`/likes/check/${productId}`);

  return res.data;
};