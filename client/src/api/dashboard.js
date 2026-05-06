import api from "./axios";

export const listDashboardProducts = async () => {
  const storeId = localStorage.getItem("active_store_id");
  const response = await api.get("/products/", {
    headers: storeId ? { "X-Store-Id": storeId } : {},
  });
  return response.data;
};

export const createDashboardProduct = async (payload) => {
  const storeId = localStorage.getItem("active_store_id");
  const response = await api.post("/products/", payload, {
    headers: storeId ? { "X-Store-Id": storeId } : {},
  });
  return response.data;
};

export const updateDashboardProduct = async (id, payload) => {
  const storeId = localStorage.getItem("active_store_id");
  const response = await api.put(`/products/${id}/`, payload, {
    headers: storeId ? { "X-Store-Id": storeId } : {},
  });
  return response.data;
};

export const deleteDashboardProduct = async (id) => {
  const storeId = localStorage.getItem("active_store_id");
  await api.delete(`/products/${id}/`, {
    headers: storeId ? { "X-Store-Id": storeId } : {},
  });
};

export const uploadProductImages = async (productId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  const storeId = localStorage.getItem("active_store_id");
  const response = await api.post(`/products/${productId}/upload-images/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(storeId ? { "X-Store-Id": storeId } : {}),
    },
  });
  return response.data;
};

export const deleteProductImage = async (productId, imageId) => {
  const storeId = localStorage.getItem("active_store_id");
  await api.delete(`/products/${productId}/images/${imageId}/`, {
    headers: storeId ? { "X-Store-Id": storeId } : {},
  });
};
