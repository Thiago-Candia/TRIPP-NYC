import { createContext, useContext, useMemo, useState } from "react";
import { getMe, loginRequest, registerRequest } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [activeStoreId, setActiveStoreId] = useState(localStorage.getItem("active_store_id"));

  const persistSession = (data) => {
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    if (data.user?.stores?.length && !localStorage.getItem("active_store_id")) {
      localStorage.setItem("active_store_id", String(data.user.stores[0].store_id));
      setActiveStoreId(String(data.user.stores[0].store_id));
    }
    setUser(data.user);
  };

  const login = async (username, password) => {
    const data = await loginRequest(username, password);
    persistSession(data);
    return data.user;
  };

  const register = async ({ username, email, password }) => {
    const data = await registerRequest({ username, email, password });
    persistSession(data);
    return data.user;
  };

  const fetchCurrentUser = async () => {
    setLoadingUser(true);
    try {
      const me = await getMe();
      if (me?.stores?.length && !localStorage.getItem("active_store_id")) {
        localStorage.setItem("active_store_id", String(me.stores[0].store_id));
        setActiveStoreId(String(me.stores[0].store_id));
      }
      setUser(me);
      return me;
    } finally {
      setLoadingUser(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("active_store_id");
    setActiveStoreId(null);
    setUser(null);
  };

  const setActiveStore = (storeId) => {
    localStorage.setItem("active_store_id", String(storeId));
    setActiveStoreId(String(storeId));
  };

  const value = useMemo(
    () => ({
      user,
      loadingUser,
      login,
      register,
      logout,
      fetchCurrentUser,
      activeStoreId,
      setActiveStore,
      isAdmin: Boolean(user?.is_staff || user?.is_superuser || user?.role === "admin"),
      canManageCatalog: Boolean(user?.is_staff || user?.is_superuser || user?.role === "admin"),
    }),
    [user, loadingUser, activeStoreId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
