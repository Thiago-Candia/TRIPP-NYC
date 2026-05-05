import React from "react";
import { COLLECTION_CATEGORIES } from "../constants/collection";
import { formatCurrency } from "../utils/productUtils";

const CollectionFilters = ({
  maxPrice,
  priceRange,
  selectedCategories,
  onCategoryChange,
  onPriceChange,
}) => {
  return (
    <aside className="collection__sidebar">
      <section className="collection__filter-group">
        <h2 className="collection__filter-title">Category</h2>
        <div className="collection__checks">
          {COLLECTION_CATEGORIES.map((category) => (
            <label key={category} className="collection__check">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => onCategoryChange(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="collection__filter-group">
        <h2 className="collection__filter-title">Price</h2>
        <p className="collection__price-note">
          The highest price is {formatCurrency(maxPrice)}
        </p>
        <div className="collection__range">
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={priceRange.max}
            onChange={(event) => onPriceChange("max", event.target.value)}
            aria-label="Maximum price"
          />
        </div>
        <div className="collection__price-inputs">
          <label>
            <span>$</span>
            <input
              type="number"
              min="0"
              max={priceRange.max}
              value={priceRange.min}
              onChange={(event) => onPriceChange("min", event.target.value)}
            />
          </label>
          <label>
            <span>$</span>
            <input
              type="number"
              min={priceRange.min}
              max={maxPrice}
              value={priceRange.max}
              onChange={(event) => onPriceChange("max", event.target.value)}
            />
          </label>
        </div>
      </section>
    </aside>
  );
};

export default CollectionFilters;
