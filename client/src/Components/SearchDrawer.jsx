import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../Context/ProductContext.jsx";
import { Icons } from "../Assets/Icons/Icons";

const SUGGESTIONS = [
  "PANTS",
  "TOPS",
  "DRESSES",
  "OUTWEAR",
  "ACCESSORIES",
  "SALE",
  "NEW ARRIVALS",
];

const SearchDrawer = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const { products } = useProductContext();
  const navigate = useNavigate();


  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setQuery("");
    }
  }, [isOpen]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);


  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const filteredProducts = query.trim().length > 1
    ? products
        .filter((p) =>
          p.name?.toLowerCase().includes(query.toLowerCase()) ||
          p.category?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSuggestionClick = (suggestion) => {
    const q = suggestion.toLowerCase().replace(/\s+/g, "-");
    onClose();
    navigate(`/collections?search=${q}`);
  };

  const handleProductClick = (product) => {
    onClose();
    navigate(`/collections/product/${product.id}`);
  };

  const handleViewAll = () => {
    onClose();
    navigate(`/collections?search=${encodeURIComponent(query)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) handleViewAll();
  };

  return (
    <>
      <div
        className={`search-drawer__overlay ${isOpen ? "search-drawer__overlay--visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`search-drawer ${isOpen ? "search-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="search-drawer__header">
          <form className="search-drawer__form" onSubmit={handleSubmit}>
            <span className="search-drawer__icon">
              <Icons.MagnifyingGlass />
            </span>
            <input
              ref={inputRef}
              id="search-drawer-input"
              className="search-drawer__input"
              type="text"
              placeholder="Search for anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </form>
          <button
            className="search-drawer__close"
            onClick={onClose}
            aria-label="Close search"
          >
            ✕
          </button>
        </div>

        <div className="search-drawer__body">
          {filteredProducts.length === 0 && (
            <div className="search-drawer__suggestions-section">
              <p className="search-drawer__section-label">SUGGESTIONS</p>
              <div className="search-drawer__tags">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="search-drawer__tag"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {filteredProducts.length > 0 && (
            <div className="search-drawer__products-section">
              <p className="search-drawer__section-label">PRODUCTS</p>
              <ul className="search-drawer__product-list">
                {filteredProducts.map((product) => (
                  <li key={product.id}>
                    <button
                      className="search-drawer__product-item"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="search-drawer__product-img-box">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="search-drawer__product-img"
                          />
                        ) : (
                          <div className="search-drawer__product-img-placeholder" />
                        )}
                      </div>
                      <div className="search-drawer__product-info">
                        <span className="search-drawer__product-name">
                          {product.name?.toUpperCase()}
                        </span>
                        <span className="search-drawer__product-price">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {query.trim().length > 1 && filteredProducts.length === 0 && (
            <p className="search-drawer__no-results">
              No results for &ldquo;<strong>{query}</strong>&rdquo;
            </p>
          )}
        </div>
        {filteredProducts.length > 0 && (
          <div className="search-drawer__footer">
            <button className="search-drawer__view-all" onClick={handleViewAll}>
              VIEW ALL RESULTS
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default SearchDrawer;
