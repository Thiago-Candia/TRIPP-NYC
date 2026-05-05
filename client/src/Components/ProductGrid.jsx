import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  if (!products.length) {
    return (
      <p className="collection__empty">
        No products match the selected filters.
      </p>
    );
  }

  return (
    <div className="collection__products">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant="catalog" />
      ))}
    </div>
  );
};

export default ProductGrid;
