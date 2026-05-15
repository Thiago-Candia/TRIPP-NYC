import React, { useEffect } from "react";
import { useCart } from "../Context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/cart-side-bar.css";
import { getProductImages } from "../utils/productUtils";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, itemCount, handleRemove, handleUpdate } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !cart) return null;

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`cart-sidebar ${isOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Shopping cart">
        {/* Header */}
        <div className="cart-sidebar__header">
          <div className="cart-sidebar__header-left">
            <h2 className="cart-sidebar__title">Your Cart</h2>
            {itemCount > 0 && (
              <span className="cart-sidebar__count">{itemCount}</span>
            )}
          </div>
          <button className="cart-sidebar__close" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Free shipping banner */}
        <div className="cart-sidebar__shipping">
          🚚 FREE shipping on orders over $150
        </div>

        {/* Items */}
        <div className="cart-sidebar__items">
          {cart.items.length === 0 ? (
            <div className="cart-sidebar__empty">
              <p>Your cart is empty</p>
              <button className="cart-sidebar__continue" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                {/* Thumbnail */}
                <div className="cart-item__img-box">
                  {getProductImages(item.product)[0] ? (
                    <img
                      src={getProductImages(item.product)[0]}
                      alt={item.product.name}
                      className="cart-item__image"
                    />
                  ) : (
                    <div className="cart-item__img-placeholder" />
                  )}
                </div>

                {/* Info */}
                <div className="cart-item__info">
                  <p className="cart-item__name">{item.product?.name}</p>
                  {item.variant && (
                    <p className="cart-item__variant">
                      {[item.variant.size, item.variant.color].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="cart-item__price">
                    ${Number(item.subtotal).toFixed(2)}
                  </p>

                  {/* Qty + remove */}
                  <div className="cart-item__actions">
                    <div className="cart-item__qty">
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => handleUpdate(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart-item__qty-value">{item.quantity}</span>
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => handleUpdate(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => handleRemove(item.id)}
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="cart-sidebar__footer">
            <div className="cart-sidebar__subtotal-row">
              <span>Subtotal</span>
              <span className="cart-sidebar__subtotal-amount">
                ${Number(cart.subtotal).toFixed(2)}
              </span>
            </div>
            <p className="cart-sidebar__tax-note">Taxes and shipping calculated at checkout</p>

            <button
              className="cart-sidebar__checkout"
              onClick={handleCheckout}
            >
              Checkout
            </button>

            <Link to="/cart" onClick={onClose} className="cart-sidebar__view">
              View Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
