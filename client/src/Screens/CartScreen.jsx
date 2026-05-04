import React from "react";
import { useCart } from "../Hooks/useCart";
import "../Styles/cart.css";

const CartScreen = () => {


  const { cart , handleRemove, handleUpdate } = useCart();

  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="cart-empty">Tu carrito está vacío.</div>;
  }

  return (
    <div className="cart-container">
      <h2>Carrito de Compras</h2>
      <div className="cart-items-list">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.product.name}</span>
              {item.variant && (
                <span className="cart-item-variant">Variante: {item.variant.name}</span>
              )}
            </div>
            <div className="cart-item-actions">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => handleUpdate(item.id, Number(e.target.value))}
              />
              <button onClick={() => handleRemove(item.id)}>Eliminar</button>
            </div>
            <div className="cart-item-subtotal">
              Subtotal: ${Number(item.subtotal).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div>Total de productos: {cart.total_items}</div>
        <div>Subtotal: ${Number(cart.subtotal).toFixed(2)}</div>
        <div>Total: ${Number(cart.total).toFixed(2)}</div>
      </div>
    </div>
  );
};

export default CartScreen;
