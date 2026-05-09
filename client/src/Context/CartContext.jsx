import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  addToCart,
  clearCart,
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

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const syncCart = async () => {
      try {
        const data = await getCart();
        setCart(normalizeCart(data));
      } catch {
      } finally {
        setLoading(false);
      }
    };

    syncCart();
  }, []);
  const buildCart = useCallback((items) => ({
    items,
    ...calculateCartTotals(items),
  }), []);

  const handleAddToCart = useCallback(async (product, quantity = 1, variant = null) => {
    setCart((prev) => {
      const existing = prev.items.find((item) => isSameCartItem(item, product, variant));
      const updatedItems = existing
        ? prev.items.map((item) =>
            item.id === existing.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  subtotal: getCartItemSubtotal(product, item.quantity + quantity, variant),
                }
              : item
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
          loading: "Adding to cart...",
          success: `${product.name} added!`,
          error: "Failed to add product",
        }
      );

      if (updatedCart?.items) {
        setCart(normalizeCart(updatedCart));

  const buildCart = useCallback(
    (items) => ({
      items,
      ...calculateCartTotals(items),
    }),
    [],
  );

  const handleAddToCart = useCallback(
    async (product, quantity = 1, variant = null) => {
      setCart((prev) => {
        const existing = prev.items.find((item) =>
          isSameCartItem(item, product, variant),
        );
        const updatedItems = existing
          ? prev.items.map((item) =>
              item.id === existing.id
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    subtotal: getCartItemSubtotal(
                      product,
                      item.quantity + quantity,
                      variant,
                    ),
                  }
                : item,
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
            loading: "Adding to cart...",
            success: `${product.name} added!`,
            error: "Failed to add product",
          },
        );

        if (updatedCart?.items) {
          setCart(normalizeCart(updatedCart));
        }
      } catch (error) {
        console.error("addToCart error:", error);

      }
    },
    [buildCart],
  );

  const handleRemove = useCallback(async (itemId) => {
    setCart((prev) => ({
      ...prev,
      ...buildCart(prev.items.filter((item) => item.id !== itemId)),
    }));

    try {
      await removeCartItem(itemId);
      toast("Item removed");
    } catch (err) {
      console.error("removeCartItem error:", err);
      toast.error("Failed to remove item");
    }
  }, [buildCart]);

  const handleUpdate = useCallback(async (itemId, quantity) => {
    if (quantity < 1) {
      await handleRemove(itemId);
      return;
    }

    setCart((prev) => ({
      ...prev,
      ...buildCart(
        prev.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity, subtotal: getCartItemSubtotal(item.product, quantity, item.variant) }
            : item
        )
      ),
    }));
=======
  const handleRemove = useCallback(
    async (itemId) => {
      setCart((prev) => ({
        ...prev,
        ...buildCart(prev.items.filter((item) => item.id !== itemId)),
      }));

      try {
        await removeCartItem(itemId);
        toast("Item removed");
      } catch (error) {
        console.error("removeCartItem error:", error);
        toast.error("Failed to remove item");
      }
    },
    [buildCart],
  );


  const handleUpdate = useCallback(
    async (itemId, quantity) => {
      if (quantity < 1) {
        handleRemove(itemId);
        return;
      }

      setCart((prev) => ({
        ...prev,
        ...buildCart(
          prev.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  subtotal: getCartItemSubtotal(item.product, quantity, item.variant),
                }
              : item,
          ),
        ),
      }));

      try {
        await updateCartItem(itemId, quantity);
      } catch (error) {
        console.error("updateCartItem error:", error);
        toast.error("Failed to update quantity");
      }
    },
    [buildCart, handleRemove],
  );

  const handleClearCart = useCallback(async () => {
    setCart(initialCart);
    localStorage.removeItem(CART_STORAGE_KEY);

    try {
      await clearCart();
    } catch {
      // Best-effort backend clear.
    }
  }, []);


  const itemCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart.items]
  );

  const value = useMemo(() => ({
    cart,
    loading,
    itemCount,
    handleAddToCart,
    handleRemove,
    handleUpdate,
    handleClearCart,
  }), [cart, loading, itemCount, handleAddToCart, handleRemove, handleUpdate, handleClearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;

  const ensureServerCart = useCallback(async () => {
    let serverCart = null;

    try {
      serverCart = normalizeCart(await getCart());
    } catch {
      serverCart = initialCart;
    }

    if (serverCart.items.length > 0) {
      setCart(serverCart);
      return serverCart;
    }

    const localCart = getStoredCart();
    if (!localCart.items.length) return localCart;

    let latestCart = serverCart;
    for (const item of localCart.items) {
      const productId = item.product?.id;
      if (!productId) continue;
      latestCart = normalizeCart(
        await addToCart(productId, item.quantity || 1, item.variant?.id),
      );
    }

    setCart(latestCart);
    return latestCart;
  }, []);

  const itemCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart.items],
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
        ensureServerCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
