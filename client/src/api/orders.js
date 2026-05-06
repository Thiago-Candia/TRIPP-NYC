import api from "./axios";

export const createOrder = async (checkoutData) => {
  const response = await api.post("/orders/checkout/", checkoutData);
  return response.data;
};

export const getOrder = async (orderId) => {
  const response = await api.get(`/orders/${orderId}/`);
  return response.data;
};
