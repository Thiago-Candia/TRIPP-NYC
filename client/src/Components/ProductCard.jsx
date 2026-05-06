import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import {
  findVariantBySize,
  formatCurrency,
  getProductImage,
  getProductSizes,
} from "../utils/productUtils";

const ProductCard = ({ product, variant = "default" }) => {
  const { handleAddToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const productSizes = getProductSizes(product);
  const productUrl = `/collections/product/${product.id}`;
  const showsPurchaseControls = variant === "default";

  const handleAddClick = () => {
    const selectedVariant = findVariantBySize(product, selectedSize);
    handleAddToCart(product, 1, selectedVariant);
  };

  return (
    <article className={`product-card product-card--${variant}`}>
      <Link className="product-card__link" to={productUrl}>
        <div className="product-card__image-box">
          <img
            className="product-card__image"
            src={getProductImage(product)}
            alt={product.name}
          />
        </div>
        <div className="product-card__details">
          <h3 className="product-card__title">{product.name}</h3>
          <p className="product-card__price">{formatCurrency(product.price)}</p>
        </div>
      </Link>

      {showsPurchaseControls && productSizes.length > 0 && (
        <div className="product-card__sizes">
          {productSizes.map((size) => (
            <button
              key={size}
              className={`product-card__size-btn ${
                selectedSize === size ? "product-card__size-btn--selected" : ""
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      )}

      {showsPurchaseControls && (
        <button
          className="product-card__add-to-cart"
          disabled={productSizes.length > 0 && !selectedSize}
          onClick={handleAddClick}
        >
          {productSizes.length > 0 && !selectedSize ? "Select a size" : "Add to cart"}
        </button>
      )}
    </article>
  );
};

export default ProductCard;
