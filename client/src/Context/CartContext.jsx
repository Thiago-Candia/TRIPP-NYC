import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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
const CART_STORAGE_KEY = "tripp_cart";

const getStoredCart = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? normalizeCart(JSON.parse(stored)) : initialCart;
  } catch {
    return initialCart;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(getStoredCart);
  const [loading, setLoading] = useState(true);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Sync from backend on mount
  useEffect(() => {
    const syncCart = async () => {
      try {
        const data = await getCart();
        setCart(normalizeCart(data));
      } catch {
        // Backend unavailable — fall back to localStorage silently
      } finally {
        setLoading(false);
      }
    };
    syncCart();
  }, []);

  // Helper: recompute totals from items array
  const buildCart = useCallback((items) => ({
    items,
    ...calculateCartTotals(items),
  }), []);

  // ── Add ────────────────────────────────────────────────────────
  const handleAddToCart = useCallback(async (product, quantity = 1, variant = null) => {
    // Optimistic update
    setCart((prev) => {
      const existing = prev.items.find((i) => isSameCartItem(i, product, variant));
      const updatedItems = existing
        ? prev.items.map((i) =>
            i.id === existing.id
              ? {
                  ...i,
                  quantity: i.quantity + quantity,
                  subtotal: getCartItemSubtotal(product, i.quantity + quantity, variant),
                }
              : i
          )
        : [
            ...prev.items,
            {
              id: `temp_${Date.now()}`,
              product,
              variant,
              quantity,
              subtotal: getCartItemSubtotal(product, quantity, variant),
            },
          ];
      return { ...prev, ...buildCart(updatedItems) };
    });

    try {
      const updatedCart = await toast.promise(
        addToCart(product.id, quantity, variant?.id),
        {
          loading: "Adding to cart…",
          success: `${product.name} added!`,
          error: "Failed to add product",
        }
      );
      // Replace optimistic state with real backend IDs
      if (updatedCart?.items) {
        setCart(normalizeCart(updatedCart));
      }
    } catch (err) {
      console.error("addToCart error:", err);
    }
  }, [buildCart]);

  // ── Remove ─────────────────────────────────────────────────────
  const handleRemove = useCallback(async (itemId) => {
    setCart((prev) => ({
      ...prev,
      ...buildCart(prev.items.filter((i) => i.id !== itemId)),
    }));

    try {
      await removeCartItem(itemId);
      toast("Item removed");
    } catch (err) {
      console.error("removeCartItem error:", err);
      toast.error("Failed to remove item");
    }
  }, [buildCart]);

  // ── Update quantity ────────────────────────────────────────────
  const handleUpdate = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return handleRemove(itemId);

    setCart((prev) => ({
      ...prev,
      ...buildCart(
        prev.items.map((i) =>
          i.id === itemId
            ? { ...i, quantity, subtotal: getCartItemSubtotal(i.product, quantity, i.variant) }
            : i
        )
      ),
    }));

    try {
      await updateCartItem(itemId, quantity);
    } catch (err) {
      console.error("updateCartItem error:", err);
      toast.error("Failed to update quantity");
    }
  }, [buildCart, handleRemove]);

  // ── Clear (used after successful checkout) ─────────────────────
  const handleClearCart = useCallback(async () => {
    setCart(initialCart);
    localStorage.removeItem(CART_STORAGE_KEY);
    try {
      await import("../api/cart").then(({ clearCart }) => clearCart?.());
    } catch {
      // Best-effort backend clear
    }
  }, []);

  // ── Derived values ─────────────────────────────────────────────
  const itemCount = useMemo(
    () => cart.items.reduce((sum, i) => sum + (i.quantity || 0), 0),
    [cart.items]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        handleAddToCart,
        handleRemove,
        handleUpdate,
        handleClearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
