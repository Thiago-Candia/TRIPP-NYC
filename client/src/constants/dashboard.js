export const PRODUCT_SIZE_OPTIONS = [
  { value: "", label: "Sin talle" },
  { value: "XXS", label: "XX-Small" },
  { value: "XS", label: "X-Small" },
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
  { value: "XL", label: "X-Large" },
  { value: "XXL", label: "XX-Large" },
  { value: "XXXL", label: "XXX-Large" },
];

export const EMPTY_VARIANT = {
  size: "",
  color: "",
  color_code: "",
  sku: "",
  price_adjustment: 0,
  stock: 0,
  is_active: true,
};

export const EMPTY_PRODUCT_FORM = {
  name: "",
  description: "",
  price: "",
  compare_at_price: "",
  sku: "",
  stock: 0,
  is_active: true,
  is_featured: false,
  variants: [{ ...EMPTY_VARIANT }],
};

export const DASHBOARD_TABS = [
  { id: "products", label: "Products" },
  { id: "inventory", label: "Inventory" },
  { id: "orders", label: "Orders" },
  { id: "coupons", label: "Coupons" },
];
