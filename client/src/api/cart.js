import api from "./axios";


export const getCart = async () => {
  const response = await api.get("/cart/");
  return response.data;
};

export const addToCart = async (productId, quantity, variantId) => {
  const response = await api.post("/cart/", {
    product_id: productId,
    quantity,
    variant_id: variantId,
  });
  return response.data;
};

export const removeCartItem = async (itemId) => {
  const response = await api.delete(`/cart/items/${itemId}/`);
  return response.data;
};


export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/items/${itemId}/`, { quantity });
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/cart/");
  return response.data;
};
