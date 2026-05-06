import api from "./axios";

export const loginRequest = async (username, password) => {
  const response = await api.post("/users/auth/login/", { username, password });
  return response.data;
};

export const registerRequest = async ({ username, password, email }) => {
  const response = await api.post("/users/auth/register/", { username, password, email });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/users/auth/me/");
  return response.data;
};
