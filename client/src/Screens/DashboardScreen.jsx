import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import ProductsModule from "../Components/dashboard/ProductsModule";
import InventoryModule from "../Components/dashboard/InventoryModule";
import OrdersModule from "../Components/dashboard/OrdersModule";
import CouponsModule from "../Components/dashboard/CouponsModule";
import DashboardLogin from "../Components/dashboard/DashboardLogin";
import { useAuth } from "../Context/AuthContext";
import { DASHBOARD_TABS } from "../constants/dashboard";
import "../Styles/dashboard.css";

const DashboardScreen = () => {
  const {
    user,
    loadingUser,
    login,
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
    [user?.stores, activeStoreId],
  );

  if (!hasToken) {
    return <DashboardLogin onLogin={login} />;
  }

  if (loadingUser || !user) {
    return (
      <section className="dashboard-page">
        <header className="dashboard-header">
          <div className="dashboard-header__intro">
            <p className="dashboard-header__eyebrow">TRIPP NYC Admin</p>
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
          <p className="dashboard-header__eyebrow">TRIPP NYC Admin</p>
          <h1 className="dashboard-header__title">Dashboard</h1>
          <p className="dashboard-header__meta">
            {user.username} - {activeMembership?.role || user.role || "admin"} - store #
            {activeStoreId || "-"}
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
        {DASHBOARD_TABS.map((dashboardTab) => (
          <button
            key={dashboardTab.id}
            className={`dashboard-tabs__btn ${
              tab === dashboardTab.id ? "dashboard-tabs__btn--active" : ""
            }`}
            onClick={() => setTab(dashboardTab.id)}
          >
            {dashboardTab.label}
          </button>
        ))}
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
