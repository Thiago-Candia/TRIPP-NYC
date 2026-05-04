import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCart,
  addToCart,
  removeCartItem,
  updateCartItem
} from "../api/cart";
import toast from "react-hot-toast";

const CartContext = createContext();

const initialCart = {
  items: [],
  total: 0,
  subtotal: 0,
  total_items: 0
}


const calculateTotals = (items) => {
  const total_items = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + (i.subtotal || 0), 0);

  return {
    total_items,
    subtotal,
    total: subtotal
  }
}

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : initialCart;
  });

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  useEffect(() => {
    const syncCart = async () => {
      try {
        const data = await getCart();
        setCart(data);
      } catch (error) {
        console.log("Backend no disponible, usando localStorage");
      } finally {
        setLoading(false);
      }
    };

    syncCart()
  }, [])


  const handleAddToCart = async (product, quantity = 1, variant = null) => {
    try {
      setCart((prev) => {
        const existing = prev.items.find(
          (i) =>
            i.product.id === product.id &&
            i.variant?.id === variant?.id
        );

        let updatedItems;

        if (existing) {
          updatedItems = prev.items.map((i) =>
            i.id === existing.id
              ? {
                  ...i,
                  quantity: i.quantity + quantity,
                  subtotal: (i.quantity + quantity) * product.price
                }
              : i
          );
        } else {
          updatedItems = [
            ...prev.items,
            {
              id: Date.now(), 
              product,
              variant,
              quantity,
              subtotal: quantity * product.price
            }
          ];
        }

        return {
          ...prev,
          items: updatedItems,
          ...calculateTotals(updatedItems)
        };
      });

      toast.success("Producto agregado 🛒");


      await addToCart(product.id, quantity, variant?.id);

    } catch (error) {
      console.error(error);
      toast.error("Error al agregar producto");
    }
  };


  const handleRemove = async (item_id) => {
    try {
      setCart((prev) => {
        const updatedItems = prev.items.filter((i) => i.id !== item_id);

        return {
          ...prev,
          items: updatedItems,
          ...calculateTotals(updatedItems)
        };
      });

      toast("Producto eliminado");

      await removeCartItem(item_id);

    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar");
    }
  };

  const handleUpdate = async (item_id, quantity) => {
    try {
      if (quantity < 1) return;

      setCart((prev) => {
        const updatedItems = prev.items.map((i) =>
          i.id === item_id
            ? {
                ...i,
                quantity,
                subtotal: quantity * i.product.price
              }
            : i
        );

        return {
          ...prev,
          items: updatedItems,
          ...calculateTotals(updatedItems)
        };
      });

      toast("Cantidad actualizada");

      await updateCartItem(item_id, quantity);

    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        handleAddToCart,
        handleRemove,
        handleUpdate
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);