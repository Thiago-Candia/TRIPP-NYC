import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cart";
import {
  calculateCartTotals,
  getCartItemSubtotal,
  initialCart,
  isSameCartItem,
  normalizeCart,
} from "../utils/cartUtils";

const CartContext = createContext();
const CART_STORAGE_KEY = "cart";

const getStoredCart = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? normalizeCart(JSON.parse(storedCart)) : initialCart;
  } catch (error) {
    console.error("Error reading cart from localStorage", error);
    return initialCart;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(getStoredCart);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const syncCart = async () => {
      try {
        const data = await getCart();
        setCart(normalizeCart(data));
      } catch (_error) {
        console.log("Backend no disponible, usando localStorage");
      } finally {
        setLoading(false);
      }
    };

    syncCart();
  }, []);

  const updateCartItems = (items) => ({
    items,
    ...calculateCartTotals(items),
  });

  const handleAddToCart = async (product, quantity = 1, variant = null) => {
    try {
      setCart((prevCart) => {
        const existingItem = prevCart.items.find((item) =>
          isSameCartItem(item, product, variant),
        );

        const updatedItems = existingItem
          ? prevCart.items.map((item) =>
              item.id === existingItem.id
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    subtotal: getCartItemSubtotal(product, item.quantity + quantity, variant),
                  }
                : item,
            )
          : [
              ...prevCart.items,
              {
                id: Date.now(),
                product,
                variant,
                quantity,
                subtotal: getCartItemSubtotal(product, quantity, variant),
              },
            ];

        return {
          ...prevCart,
          ...updateCartItems(updatedItems),
        };
      });

      const updatedCart = await toast.promise(addToCart(product.id, quantity, variant?.id), {
        loading: "Agregando producto...",
        success: "Producto agregado",
        error: "Error al agregar producto",
      });

      if (updatedCart?.items) {
        setCart(normalizeCart(updatedCart));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      setCart((prevCart) => {
        const updatedItems = prevCart.items.filter((item) => item.id !== itemId);

        return {
          ...prevCart,
          ...updateCartItems(updatedItems),
        };
      });

      toast("Producto eliminado");
      await removeCartItem(itemId);
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar");
    }
  };

  const handleUpdate = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity,
                subtotal: getCartItemSubtotal(item.product, quantity, item.variant),
              }
            : item,
        );

        return {
          ...prevCart,
          ...updateCartItems(updatedItems),
        };
      });

      toast("Cantidad actualizada");
      await updateCartItem(itemId, quantity);
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
        handleUpdate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
