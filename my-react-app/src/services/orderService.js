import api from "./axios";

// Create Order
export const createOrder = async (orderData, token) => {
  const response = await api.post("/orders", orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Get All Orders
export const getOrders = async (token) => {
  const response = await api.get("/orders"  );

  return response.data;
};

// Get Single Order By ID
export const getOrderById = async (id, token) => {
  const response = await api.get(`/orders/${id}`);

  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/orders/my");
  console.log(response);
  return response.data;
};