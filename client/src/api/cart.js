import api from "./axios";


export const getCart = async () => {
  const response = await api.get("/cart/");
  return response.data
}

export const addToCart = async (product_id, quantity, variant_id) => {
  const response = await api.post('/cart/', {
    product_id,
    quantity,
    variant_id
  })
  return response.data
}

export const removeCartItem = async (item_id) => {
  const response = await api.delete(`/cart/items/${item_id}/`);
  return response.data
}


export const updateCartItem = async (item_id, quantity) => {
  const response = await api.put(`/cart/items/${item_id}/`, {quantity});
  return response.data
}