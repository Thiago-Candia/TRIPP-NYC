import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Nav from "../Components/Nav";
import { useAuth } from "../Context/AuthContext";
import { getMyOrders } from "../api/orders";
import "../Styles/user-profile.css";

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return "No disponible";

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const statusLabels = {
  pending: "Pendiente",
  paid: "Pagado",
  processing: "En preparacion",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

const UserProfileScreen = () => {
  const { user, loadingUser, logout, canManageCatalog } = useAuth();
  const navigate = useNavigate();
  const hasToken = Boolean(localStorage.getItem("access_token"));
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    if (!hasToken || !user) return undefined;

    let isMounted = true;
    setLoadingOrders(true);
    setOrdersError("");

    getMyOrders()
      .then((data) => {
        if (!isMounted) return;
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setOrdersError("No pudimos cargar tu historial de compras.");
      })
      .finally(() => {
        if (isMounted) setLoadingOrders(false);
      });

    return () => {
      isMounted = false;
    };
  }, [hasToken, user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!hasToken) {
    return <Navigate to="/account" replace />;
  }

  if (loadingUser || !user) {
    return (
      <div className="user-profile">
        <Nav />
        <main className="user-profile__main">
          <section className="user-profile__panel">
            <p className="user-profile__loading">Cargando tu perfil...</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <Nav />
      <main className="user-profile__main">
        <section className="user-profile__header">
          <div>
            <p className="user-profile__eyebrow">Mi cuenta</p>
            <h1 className="user-profile__title">Hola, {user.username}</h1>
            <p className="user-profile__subtitle">
              Gestiona tu informacion y revisa tus compras en TRIPP NYC.
            </p>
          </div>
          <button className="user-profile__logout" type="button" onClick={handleLogout}>
            Cerrar sesion
          </button>
        </section>

        <div className="user-profile__grid">
          <section className="user-profile__panel user-profile__panel--account">
            <div className="user-profile__panel-header">
              <p className="user-profile__section-kicker">Cuenta</p>
              <h2 className="user-profile__section-title">Informacion personal</h2>
            </div>
            <div className="user-profile__info-list">
              <div className="user-profile__info-row">
                <span>Usuario</span>
                <strong>{user.username}</strong>
              </div>
              <div className="user-profile__info-row">
                <span>Email</span>
                <strong>{user.email || "No configurado"}</strong>
              </div>
              <div className="user-profile__info-row">
                <span>Tipo de cuenta</span>
                <strong>{user.role === "admin" ? "Administrador" : "Cliente"}</strong>
              </div>
            </div>
            {canManageCatalog && (
              <Link to="/dashboard" className="user-profile__dashboard-link">
                Ir al dashboard
              </Link>
            )}
          </section>

          <section className="user-profile__panel user-profile__panel--orders">
            <div className="user-profile__panel-header user-profile__panel-header--split">
              <div>
                <p className="user-profile__section-kicker">Compras</p>
                <h2 className="user-profile__section-title">Historial de ordenes</h2>
              </div>
              <span className="user-profile__order-count">{orders.length}</span>
            </div>

            {loadingOrders && <p className="user-profile__muted">Cargando compras...</p>}

            {!loadingOrders && ordersError && (
              <p className="user-profile__error">{ordersError}</p>
            )}

            {!loadingOrders && !ordersError && orders.length === 0 && (
              <div className="user-profile__empty">
                <p>Todavia no tenes compras asociadas a esta cuenta.</p>
                <Link to="/collections" className="user-profile__shop-link">
                  Ir a la tienda
                </Link>
              </div>
            )}

            {!loadingOrders && !ordersError && orders.length > 0 && (
              <div className="user-profile__orders">
                {orders.map((order) => (
                  <article className="user-profile__order" key={order.id}>
                    <div className="user-profile__order-top">
                      <div>
                        <p className="user-profile__order-id">Orden #{order.id}</p>
                        <p className="user-profile__order-date">{formatDate(order.created_at)}</p>
                      </div>
                      <span className={`user-profile__status user-profile__status--${order.status}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>

                    <div className="user-profile__order-items">
                      {order.items?.map((item) => (
                        <span className="user-profile__order-item" key={item.id}>
                          {item.name} x {item.quantity}
                        </span>
                      ))}
                    </div>

                    <div className="user-profile__order-bottom">
                      <span>Total</span>
                      <strong>{formatCurrency(order.total)}</strong>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserProfileScreen;
