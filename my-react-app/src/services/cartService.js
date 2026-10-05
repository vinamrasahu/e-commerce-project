import api from "./axios";

// Add product to cart
export const addToCart = async (cartData) => {
  return await api.post("/cart", cartData);
};

// Get all cart items
export const getCart = async () => {
  return await api.get("/cart");
};

// Update quantity
export const updateCart = async (id, quantity) => {
  return await api.put(`/cart/${id}`, { quantity });
};

// Delete cart item
export const deleteCartItem = async (id) => {
  return await api.delete(`/cart/${id}`);
};
export const moveToWishlist = async (cartId) => {
  return await api.post(
    "/cart/move-to-wishlist",
    {
      cartId,
    }
  );
};