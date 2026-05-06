import React, { useEffect, useMemo, useState } from "react";
import "../Styles/styles.css";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer.jsx";
import CollectionFilters from "../Components/CollectionFilters.jsx";
import CollectionToolbar from "../Components/CollectionToolbar.jsx";
import ProductGrid from "../Components/ProductGrid.jsx";
import Nav from "../Components/Nav.jsx";
import { useProductContext } from "../Context/ProductContext.jsx";
import { SORT_OPTIONS } from "../constants/collection.js";
import {
  filterProducts,
  getMaxProductPrice,
  sortProducts,
} from "../utils/productUtils.js";

const CollectionScreen = () => {
  const { products } = useProductContext();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const maxPrice = getMaxProductPrice(products);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

  useEffect(() => {
    setPriceRange((currentRange) => ({
      min: Math.min(currentRange.min, maxPrice),
      max: currentRange.max || maxPrice,
    }));
  }, [maxPrice]);

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, selectedCategories, priceRange);
    return sortProducts(filtered, sortOption);
  }, [priceRange, products, selectedCategories, sortOption]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((currentCategory) => currentCategory !== category)
        : [...currentCategories, category],
    );
  };

  const handlePriceChange = (field, value) => {
    const numericValue = Math.max(0, Number(value) || 0);

    setPriceRange((currentRange) => {
      const nextRange = {
        ...currentRange,
        max: currentRange.max || maxPrice,
        [field]: numericValue,
      };

      if (nextRange.min > nextRange.max) {
        return field === "min"
          ? { ...nextRange, max: nextRange.min }
          : { ...nextRange, min: nextRange.max };
      }

      return nextRange;
    });
  };

  const handleSortClick = () => {
    const currentIndex = SORT_OPTIONS.indexOf(sortOption);
    const nextIndex = (currentIndex + 1) % SORT_OPTIONS.length;

    setSortOption(SORT_OPTIONS[nextIndex]);
  };

  return (
    <div className="collection">
      <Nav />
      <main className="collection__main">
        <div className="collection__breadcrumb">
          <Link className="collection__breadcrumb-link" to="/">
            <span className="collection__breadcrumb-text">Home</span>
          </Link>
          <span className="collection__breadcrumb-separator">/</span>
          <Link className="collection__breadcrumb-link" to="/collections">
            <span className="collection__breadcrumb-text">Shop</span>
          </Link>
          <span className="collection__breadcrumb-separator">/</span>
          <span className="collection__breadcrumb-current">New Arrivals</span>
        </div>

        <header className="collection__header">
          <h1 className="collection__title">New Arrivals</h1>
        </header>

        <div className="collection__layout">
          <CollectionFilters
            maxPrice={maxPrice}
            priceRange={priceRange}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
          />

          <section className="collection__content">
            <CollectionToolbar
              visibleCount={filteredProducts.length}
              totalCount={products.length}
              sortOption={sortOption}
              onSortClick={handleSortClick}
            />
            <ProductGrid products={filteredProducts} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionScreen;
