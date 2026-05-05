export const initialCart = {
  items: [],
  total: 0,
  subtotal: 0,
  total_items: 0,
};

export const calculateCartTotals = (items) => {
  const totalItems = items.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
  const subtotal = items.reduce((acc, item) => acc + Number(item.subtotal || 0), 0);

  return {
    total_items: totalItems,
    subtotal,
    total: subtotal,
  };
};

export const getCartItemSubtotal = (product, quantity, variant = null) => {
  const price = Number(variant?.final_price || product?.price || 0);

  return price * quantity;
};

export const isSameCartItem = (item, product, variant = null) => {
  return item.product?.id === product.id && item.variant?.id === variant?.id;
};

export const normalizeCart = (cart) => {
  if (!cart?.items) return initialCart;

  return {
    ...cart,
    ...calculateCartTotals(cart.items),
  };
};
