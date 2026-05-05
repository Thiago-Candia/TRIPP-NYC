export const formatCurrency = (value) => {
  return `$${Number(value || 0).toFixed(2)}`;
};

export const getProductImage = (product) => {
  return product?.primary_image || product?.img || "";
};

export const getAbsoluteImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http") || imagePath.startsWith("data:")) return imagePath;

  return `${window.location.origin}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export const getProductImages = (product) => {
  const galleryImages = product?.images?.length
    ? product.images.map((image) => getAbsoluteImageUrl(image.image))
    : [];

  return galleryImages.length
    ? galleryImages
    : [getAbsoluteImageUrl(getProductImage(product))];
};

export const getProductSizes = (product) => {
  return product?.variants?.map((variant) => variant.size).filter(Boolean) || [];
};

export const findVariantBySize = (product, size) => {
  return product?.variants?.find((variant) => variant.size === size) || null;
};

export const getProductCategory = (product) => {
  const categoryValue =
    product?.category_name ||
    product?.category?.name ||
    product?.category ||
    product?.collection ||
    "";

  if (categoryValue) {
    return String(categoryValue).toLowerCase();
  }

  const searchableText = `${product?.name || ""} ${product?.description || ""}`.toLowerCase();

  if (searchableText.includes("dress")) return "dresses";
  if (searchableText.includes("pant") || searchableText.includes("cargo")) return "pants";
  if (searchableText.includes("short")) return "shorts";
  if (searchableText.includes("skirt")) return "skirts";
  if (
    searchableText.includes("top") ||
    searchableText.includes("tshirt") ||
    searchableText.includes("shirt")
  ) {
    return "tops";
  }
  if (searchableText.includes("jacket") || searchableText.includes("coat")) return "outerwear";
  if (searchableText.includes("accessor") || searchableText.includes("bag")) return "accessories";
  if (searchableText.includes("one-piece") || searchableText.includes("one piece")) return "one-piece";

  return "";
};

export const getMaxProductPrice = (products) => {
  if (!products.length) return 0;

  return Math.max(...products.map((product) => Number(product.price) || 0));
};

export const filterProducts = (products, selectedCategories, priceRange) => {
  const activeMaxPrice = priceRange.max;
  const normalizedCategories = selectedCategories.map((category) => category.toLowerCase());

  return products.filter((product) => {
    const price = Number(product.price) || 0;
    const productCategory = getProductCategory(product);
    const matchesCategory =
      normalizedCategories.length === 0 ||
      normalizedCategories.some((category) => productCategory.includes(category));
    const matchesPrice = price >= priceRange.min && price <= activeMaxPrice;

    return matchesCategory && matchesPrice;
  });
};

export const sortProducts = (products, sortOption) => {
  return [...products].sort((firstProduct, secondProduct) => {
    if (sortOption === "price-low") {
      return Number(firstProduct.price) - Number(secondProduct.price);
    }

    if (sortOption === "price-high") {
      return Number(secondProduct.price) - Number(firstProduct.price);
    }

    if (sortOption === "name") {
      return String(firstProduct.name).localeCompare(String(secondProduct.name));
    }

    return Number(secondProduct.is_featured) - Number(firstProduct.is_featured);
  });
};
