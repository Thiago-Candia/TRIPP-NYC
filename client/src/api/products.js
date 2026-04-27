import api from "./axios";


export const getProducts = async () => {
  const response = await api.get("/products/");
  return response.data
}


export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/${slug}`);
  return response.data
}

