import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import "../Styles/styles.css";
import { formatCurrency, getProductImage } from "../utils/productUtils";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, handleRemove, handleUpdate } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!cart) return null;

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />
      <aside className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="cart-sidebar__header">
          <h2>Cart</h2>
          <button onClick={onClose} aria-label="Close cart">
            x
          </button>
        </div>

        <div className="cart-sidebar__shipping">
          FREE shipping will be applied at checkout
        </div>

        <div className="cart-sidebar__items">
          {cart.items.length === 0 ? (
            <p className="cart-sidebar__empty">Your cart is empty</p>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={getProductImage(item.product)}
                  alt={item.product.name}
                  className="cart-item__image"
                />

                <div className="cart-item__info">
                  <p className="cart-item__name">{item.product.name}</p>

                  {item.variant && (
                    <p className="cart-item__variant">
                      {item.variant.size || item.variant.name}
                    </p>
                  )}

                  <div className="cart-item__actions">
                    <button onClick={() => handleUpdate(item.id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdate(item.id, item.quantity + 1)}>
                      +
                    </button>
                    <button
                      className="cart-item__remove"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item__price">
                  {formatCurrency(item.subtotal)}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-sidebar__footer">
          <div className="cart-sidebar__total">
            <span>Subtotal</span>
            <span>{formatCurrency(cart.subtotal)}</span>
          </div>

          <button className="cart-sidebar__checkout">Checkout</button>

          <Link to="/cart" onClick={onClose} className="cart-sidebar__view">
            View Cart
          </Link>
        </div>
      </aside>
    </>
  );
};

export default CartSidebar;
