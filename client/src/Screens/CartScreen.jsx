import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import "../Styles/cart.css";
import { formatCurrency, getProductImages } from "../utils/productUtils";

const CartScreen = () => {
  const { cart, handleRemove, handleUpdate } = useCart();

  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="cart-empty">Tu carrito esta vacio.</div>;
  }

  return (
    <main className="cart-page">
      <h2 className="cart-page__title">Carrito de Compras</h2>

      <div className="cart-page__items">
        {cart.items.map((item) => (
          <article key={item.id} className="cart-page__item">
            <Link
              to={`/collections/product/${item.product.id}`}
              className="cart-page__image-link"
              aria-label={`Ver ${item.product.name}`}
            >
              <img
                src={getProductImages(item.product)[0]}
                alt={item.product.name}
                className="cart-page__image"
              />
            </Link>

            <div className="cart-page__info">
              <span className="cart-page__name">{item.product.name}</span>
              {item.variant && (
                <span className="cart-page__variant">
                  Variante: {item.variant.size || item.variant.name}
                </span>
              )}
            </div>

            <div className="cart-page__actions">
              <input
                className="cart-page__quantity"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(event) => handleUpdate(item.id, Number(event.target.value))}
              />
              <button className="cart-page__remove" onClick={() => handleRemove(item.id)}>
                Eliminar
              </button>
            </div>

            <div className="cart-page__subtotal">Subtotal: {formatCurrency(item.subtotal)}</div>
          </article>
        ))}
      </div>

      <div className="cart-page__summary">
        <div className="cart-page__summary-lines">
          <div>Total de productos: {cart.total_items}</div>
          <div>Subtotal: {formatCurrency(cart.subtotal)}</div>
          <div>Total: {formatCurrency(cart.total)}</div>
        </div>
        <Link to="/checkout" className="cart-page__checkout">
          Checkout
        </Link>
      </div>
    </main>
  );
};

export default CartScreen;
