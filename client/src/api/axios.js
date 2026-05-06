import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest.url.includes("/users/auth/login/")
    ) {

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("active_store_id");

      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
