import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ProductsModule from "../Components/dashboard/ProductsModule";
import InventoryModule from "../Components/dashboard/InventoryModule";
import OrdersModule from "../Components/dashboard/OrdersModule";
import CouponsModule from "../Components/dashboard/CouponsModule";
import "../Styles/dashboard.css";

const DashboardScreen = () => {
  const {
    user,
    loadingUser,
    logout,
    fetchCurrentUser,
    canManageCatalog,
    activeStoreId,
    setActiveStore,
  } = useAuth();
  const [tab, setTab] = useState("products");
  const hasToken = Boolean(localStorage.getItem("access_token"));

  useEffect(() => {
    if (hasToken && !user) {
      fetchCurrentUser().catch(() => logout());
    }
  }, [hasToken, user, fetchCurrentUser, logout]);

  const activeMembership = useMemo(
    () => user?.stores?.find((store) => String(store.store_id) === String(activeStoreId)),
    [user?.stores, activeStoreId]
  );

  if (!hasToken) {
    return <Navigate to="/account" replace />;
  }

  if (loadingUser || !user) {
    return (
      <section className="dashboard-page">
        <header className="dashboard-header">
          <div className="dashboard-header__intro">
            <h1 className="dashboard-header__title">Validando acceso</h1>
            <p className="dashboard-header__meta">Cargando permisos de administrador...</p>
          </div>
        </header>
      </section>
    );
  }

  if (!canManageCatalog) {
    return <Navigate to="/account" replace />;
  }

  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header__intro">
          <h1 className="dashboard-header__title">Dashboard modular</h1>
          <p className="dashboard-header__meta">
            {user.username} - {activeMembership?.role || user.role || "admin"} - store #{activeStoreId || "-"}
          </p>
        </div>
        <div className="dashboard-header__actions">
          {Boolean(user.stores?.length) && (
            <select
              className="dashboard-field dashboard-field--select"
              value={activeStoreId || ""}
              onChange={(event) => setActiveStore(event.target.value)}
            >
              {user.stores.map((store) => (
                <option value={store.store_id} key={store.store_id}>
                  {store.store_name} ({store.role})
                </option>
              ))}
            </select>
          )}
          <button className="dashboard-btn dashboard-btn--primary" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <nav className="dashboard-tabs">
        <button
          className={`dashboard-tabs__btn ${tab === "products" ? "dashboard-tabs__btn--active" : ""}`}
          onClick={() => setTab("products")}
        >
          Products
        </button>
        <button
          className={`dashboard-tabs__btn ${tab === "inventory" ? "dashboard-tabs__btn--active" : ""}`}
          onClick={() => setTab("inventory")}
        >
          Inventory
        </button>
        <button
          className={`dashboard-tabs__btn ${tab === "orders" ? "dashboard-tabs__btn--active" : ""}`}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>
        <button
          className={`dashboard-tabs__btn ${tab === "coupons" ? "dashboard-tabs__btn--active" : ""}`}
          onClick={() => setTab("coupons")}
        >
          Coupons
        </button>
      </nav>

      <div>
        {tab === "products" && <ProductsModule />}
        {tab === "inventory" && <InventoryModule />}
        {tab === "orders" && <OrdersModule />}
        {tab === "coupons" && <CouponsModule />}
      </div>
    </section>
  );
};

export default DashboardScreen;
