import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getOrder } from "../api/orders";
import Nav from "../Components/Nav";
import "../Styles/order-success.css";

const POLL_LIMIT = 5;
const POLL_DELAY_MS = 3000;

const OrderSuccessScreen = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("external_reference") || searchParams.get("order_id");
  const paymentId = searchParams.get("payment_id");
  const mercadoPagoStatus = searchParams.get("status") || searchParams.get("collection_status");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("Order not found.");
      return undefined;
    }

    let isMounted = true;
    let attempts = 0;

    const loadOrder = () => {
      getOrder(orderId)
        .then((data) => {
          if (!isMounted) return;
          setOrder(data);
          setLoading(false);

          if (data.status === "pending" && attempts < POLL_LIMIT) {
            attempts += 1;
            window.setTimeout(loadOrder, POLL_DELAY_MS);
          }
        })
        .catch(() => {
          if (!isMounted) return;
          setError("Could not load order details.");
          setLoading(false);
        });
    };

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const getStatusCopy = () => {
    if (!order) return null;

    if (order.status === "paid") {
      return {
        icon: "OK",
        title: "Payment confirmed",
        body: `Thank you, ${order.first_name}. We sent the payment receipt to ${order.email}.`,
      };
    }

    if (order.status === "cancelled" || mercadoPagoStatus === "rejected") {
      return {
        icon: "X",
        title: "Payment was not approved",
        body: "Your order was created, but Mercado Pago did not approve the payment.",
      };
    }

    return {
      icon: "...",
      title: "Payment pending",
      body: "Your order was created. Mercado Pago has not confirmed the payment yet.",
    };
  };

  return (
    <div className="order-success">
      <Nav />
      <main className="order-success__main">
        {loading && <p className="order-success__loading">Loading your order...</p>}

        {!loading && error && (
          <div className="order-success__card">
            <div className="order-success__icon order-success__icon--error">X</div>
            <h1 className="order-success__title">Something went wrong</h1>
            <p className="order-success__sub">{error}</p>
            <Link to="/collections" className="order-success__cta">
              Continue Shopping
            </Link>
          </div>
        )}

        {!loading && order && (
          <div className="order-success__card">
            {(() => {
              const copy = getStatusCopy();
              return (
                <>
                  <div className="order-success__icon">{copy.icon}</div>
                  <h1 className="order-success__title">{copy.title}</h1>
                  <p className="order-success__sub">{copy.body}</p>
                </>
              );
            })()}

            <div className="order-success__meta">
              <span className="order-success__meta-label">Order #</span>
              <span className="order-success__meta-value">{order.id}</span>
            </div>
            <div className="order-success__meta">
              <span className="order-success__meta-label">Order status</span>
              <span className="order-success__meta-value">{order.status}</span>
            </div>
            {paymentId && (
              <div className="order-success__meta">
                <span className="order-success__meta-label">Payment ID</span>
                <span className="order-success__meta-value">{paymentId}</span>
              </div>
            )}

            <div className="order-success__items">
              {order.items?.map((item) => (
                <div key={item.id} className="order-success__item">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${Number(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-success__totals">
              <div className="order-success__total-row">
                <span>Subtotal</span>
                <span>${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="order-success__total-row">
                <span>Shipping</span>
                <span>
                  {Number(order.shipping_cost) === 0
                    ? "FREE"
                    : `$${Number(order.shipping_cost).toFixed(2)}`}
                </span>
              </div>
              <div className="order-success__total-row order-success__total-row--total">
                <span>Total</span>
                <span>${Number(order.total).toFixed(2)} ARS</span>
              </div>
            </div>

            <Link to="/collections" className="order-success__cta">
              Continue Shopping
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderSuccessScreen;
