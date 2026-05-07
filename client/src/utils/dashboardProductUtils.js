import { EMPTY_PRODUCT_FORM, EMPTY_VARIANT } from "../constants/dashboard";

export const normalizeProductForm = (product = null) => {
  if (!product) return { ...EMPTY_PRODUCT_FORM, variants: [{ ...EMPTY_VARIANT }] };

  return {
    ...EMPTY_PRODUCT_FORM,
    ...product,
    price: product.price ?? "",
    compare_at_price: product.compare_at_price ?? "",
    sku: product.sku || "",
    variants: product.variants?.length
      ? product.variants.map((variant) => ({
          ...EMPTY_VARIANT,
          ...variant,
          sku: variant.sku || "",
        }))
      : [{ ...EMPTY_VARIANT }],
  };
};

export const buildProductPayload = (productForm) => {
  const timestamp = Date.now();

  return {
    ...productForm,
    price: Number(productForm.price || 0),
    compare_at_price: productForm.compare_at_price
      ? Number(productForm.compare_at_price)
      : null,
    sku: productForm.sku || `PROD-${timestamp}`,
    stock: Number(productForm.stock || 0),
    variants: productForm.variants
      .filter((variant) => variant.size || variant.color || variant.sku)
      .map((variant, index) => ({
        ...variant,
        sku: variant.sku || `VAR-${timestamp}-${index}`,
        price_adjustment: Number(variant.price_adjustment || 0),
        stock: Number(variant.stock || 0),
      })),
  };
};

export const filterDashboardProducts = (products, searchTerm) => {
  const normalizedTerm = searchTerm.trim().toLowerCase();
  if (!normalizedTerm) return products;

  return products.filter((product) =>
    `${product.name} ${product.sku || ""} ${product.category_name || ""}`
      .toLowerCase()
      .includes(normalizedTerm),
  );
};
