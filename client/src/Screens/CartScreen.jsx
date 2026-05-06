import React from "react";
import { useCart } from "../Context/CartContext";
import "../Styles/cart.css";
import { formatCurrency } from "../utils/productUtils";

const CartScreen = () => {


  const { cart , handleRemove, handleUpdate } = useCart();

  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="cart-empty">Tu carrito está vacío.</div>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Carrito de Compras</h2>
      <div className="cart-items-list">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.product.name}</span>
              {item.variant && (
                <span className="cart-item-variant">
                  Variante: {item.variant.size || item.variant.name}
                </span>
              )}
            </div>
            <div className="cart-item-actions">
              <input
                className="cart-item-actions__input"
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => handleUpdate(item.id, Number(e.target.value))}
              />
              <button className="cart-item-actions__remove-btn" onClick={() => handleRemove(item.id)}>Eliminar</button>
            </div>
            <div className="cart-item-subtotal">
              Subtotal: {formatCurrency(item.subtotal)}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div>Total de productos: {cart.total_items}</div>
        <div>Subtotal: {formatCurrency(cart.subtotal)}</div>
        <div>Total: {formatCurrency(cart.total)}</div>
      </div>
    </div>
  );
};

export default CartScreen;
