import { useState, useEffect } from "react";
import {
  getCart,
  addToCart,
  removeCartItem,
  updateCartItem
} from "../api/cart";

export const useCart = () => {
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  const handleAddToCart = async (productId, quantity = 1, variantId) => {
    try {
      await addToCart(productId, quantity, variantId);
      fetchCart(); 
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);
      fetchCart();
    } catch (error) {
      console.error("Error removing item", error);
    }
  };

  const handleUpdate = async (itemId, quantity) => {
    try {
      await updateCartItem(itemId, quantity);
      fetchCart();
    } catch (error) {
      console.error("Error updating item", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    handleAddToCart,
    handleRemove,
    handleUpdate,
  };
};