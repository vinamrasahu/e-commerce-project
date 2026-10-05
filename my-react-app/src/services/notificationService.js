import api from "./axios";

// Notify when product is back in stock
export const createNotification = async (productId) => {
  return await api.post("/notifications", {
    productId,
  });
};