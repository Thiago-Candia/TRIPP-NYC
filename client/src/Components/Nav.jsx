import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icons } from "../Assets/Icons/Icons";
import bag from "../Assets/Img/bag.png";
import logoNav from "../Assets/Img/logonav.png";
import { useCart } from "../Context/CartContext";
import CartSidebar from "./CartSidebar";
import SearchDrawer from "./SearchDrawer";
import "../Styles/search-drawer.css";

const NAV_SECTIONS = [
  {
    label: "women",
    href: "/",
    items: ["new-arrivals", "face-covers", "bottoms", "top", "dresses", "outwear", "plus-size", "accessories", "sale"],
  },
  {
    label: "men",
    href: "/",
    items: ["new-arrivals", "face-covers", "bottoms", "top", "dresses", "outwear", "plus-size", "accessories", "sale"],
  },
  {
    label: "darkstreet",
    href: "/",
    items: ["new-arrivals", "face-covers", "bottoms", "top", "dresses", "outwear", "plus-size", "accessories"],
  },
  {
    label: "sale",
    href: "/sale",
    items: [],
  },
];

const formatNavLabel = (label) => label.replaceAll("-", " ");

const Nav = ({ onSearchClick = () => {} }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount } = useCart();

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    onSearchClick();
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav__menu">
          <ul className="nav__list">
            {NAV_SECTIONS.map((section) => (
              <li className="nav__item" key={section.label}>
                <div className="nav__dropdown">
                  <Link to={section.href} className="nav__link">
                    <span className="nav__text">{section.label}</span>
                  </Link>
                  {section.items.length > 0 && (
                    <ul className="nav__submenu">
                      {section.items.map((item) => (
                        <li className="nav__submenu-item" key={item}>
                          <Link
                            to={`/collections/${section.label}/${item}`}
                            className="nav__submenu-link"
                          >
                            <span className="nav__submenu-text">{formatNavLabel(item)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="nav__logo">
          <Link to="/">
            <img src={logoNav} alt="TRIPP NYC Logo" className="nav__logo-img" />
          </Link>
        </div>

        <div className="nav__actions">
          <button
            className="nav__action-btn"
            onClick={handleOpenSearch}
            aria-label="Open search"
          >
            <Icons.MagnifyingGlass />
          </button>

          <Link to="/account" className="nav__action-link">
            Account
          </Link>

          <button
            className="nav__action-btn nav__action-btn--cart"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
          >
            <span className="nav__cart-icon">
              <img src={bag} alt="Shopping bag" className="nav__cart-img" />
              {itemCount > 0 && (
                <span className="nav__cart-badge">{itemCount > 99 ? "99+" : itemCount}</span>
              )}
            </span>
          </button>

          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />

          <SearchDrawer
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        </div>
      </nav>
    </header>
  );
};

export default Nav;
