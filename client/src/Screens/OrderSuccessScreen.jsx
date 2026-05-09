import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getOrder } from "../api/orders";
import Nav from "../Components/Nav";
import "../Styles/order-success.css";

const OrderSuccessScreen = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("external_reference") || searchParams.get("order_id");
  const paymentId = searchParams.get("payment_id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("Order not found.");
      return;
    }
    getOrder(orderId)
      .then(setOrder)
      .catch(() => setError("Could not load order details."))
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="order-success">
      <Nav />
      <main className="order-success__main">
        {loading && <p className="order-success__loading">Loading your order…</p>}

        {!loading && error && (
          <div className="order-success__card">
            <div className="order-success__icon order-success__icon--error">✕</div>
            <h1 className="order-success__title">Something went wrong</h1>
            <p className="order-success__sub">{error}</p>
            <Link to="/collections" className="order-success__cta">Continue Shopping</Link>
          </div>
        )}

        {!loading && order && (
          <div className="order-success__card">
            <div className="order-success__icon">✓</div>
            <h1 className="order-success__title">Order Confirmed!</h1>
            <p className="order-success__sub">
              Thank you, <strong>{order.first_name}</strong>! We have sent a confirmation to{" "}
              <strong>{order.email}</strong>.
            </p>

            <div className="order-success__meta">
              <span className="order-success__meta-label">Order #</span>
              <span className="order-success__meta-value">{order.id}</span>
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
                  <span>{item.name} × {item.quantity}</span>
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
                <span>{Number(order.shipping_cost) === 0 ? "FREE" : `$${Number(order.shipping_cost).toFixed(2)}`}</span>
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
