import API from "./axios";

export const getProducts = () => {
  return API.get("/products");
};

// Get Single Product
export const getProductById = (id) => {
  return API.get(`/products/${id}`);
};

export const createProduct = (data) => {
  return API.post("/products", data);
};

export const updateProduct = (id, data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else {
      formData.append(key, value);
    }
  });

  return API.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = (id) => {
  return API.delete(`/products/${id}`);
};