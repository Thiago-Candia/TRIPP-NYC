import React, { useEffect, useState } from "react";
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

const Nav = ({ onSearchClick = () => {}, disableAutoHide = false }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMobileSection, setActiveMobileSection] = useState(null);
  const [isHidden, setIsHidden] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    if (disableAutoHide) return undefined;

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY && currentScrollY > 80;

      setIsHidden(isScrollingDown);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [disableAutoHide]);

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    setIsMenuOpen(false);
    setActiveMobileSection(null);
    onSearchClick();
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setActiveMobileSection(null);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((current) => {
      if (current) setActiveMobileSection(null);
      return !current;
    });
  };

  const activeSection = NAV_SECTIONS.find((section) => section.label === activeMobileSection);

  return (
    <header className={`header ${isHidden ? "header--hidden" : ""}`}>
      <nav className="nav">
        <button
          className={`nav__hamburger ${isMenuOpen ? "nav__hamburger--open" : ""}`}
          type="button"
          onClick={handleToggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <span className="nav__hamburger-line" />
          <span className="nav__hamburger-line" />
          <span className="nav__hamburger-line" />
        </button>

        <div className={`nav__menu ${isMenuOpen ? "nav__menu--open" : ""}`}>
          <ul className="nav__list nav__list--desktop">
            {NAV_SECTIONS.map((section) => (
              <li className="nav__item" key={section.label}>
                <div className="nav__dropdown">
                  <Link to={section.href} className="nav__link" onClick={handleCloseMenu}>
                    <span className="nav__text">{section.label}</span>
                  </Link>
                  {section.items.length > 0 && (
                    <ul className="nav__submenu">
                      {section.items.map((item) => (
                        <li className="nav__submenu-item" key={item}>
                          <Link
                            to={`/collections/${section.label}/${item}`}
                            className="nav__submenu-link"
                            onClick={handleCloseMenu}
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

          <div className="nav__mobile-menu">
            {!activeSection && (
              <ul className="nav__mobile-list">
                {NAV_SECTIONS.map((section) => (
                  <li className="nav__mobile-item" key={section.label}>
                    {section.items.length > 0 ? (
                      <button
                        className="nav__mobile-link nav__link"
                        type="button"
                        onClick={() => setActiveMobileSection(section.label)}
                      >
                        <span className="nav__mobile-text nav__text">{section.label}</span>
                        <span className="nav__mobile-arrow" aria-hidden="true">
                          {"->"}
                        </span>
                      </button>
                    ) : (
                      <Link
                        to={section.href}
                        className="nav__mobile-link nav__link"
                        onClick={handleCloseMenu}
                      >
                        <span className="nav__mobile-text nav__text">{section.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {activeSection && (
              <div className="nav__mobile-panel">
                <button
                  className="nav__mobile-back"
                  type="button"
                  onClick={() => setActiveMobileSection(null)}
                >
                  <span aria-hidden="true">{"<-"}</span>
                  <span>{formatNavLabel(activeSection.label)}</span>
                </button>

                <ul className="nav__mobile-sublist">
                  {activeSection.items.map((item) => (
                    <li className="nav__mobile-subitem" key={item}>
                      <Link
                        to={`/collections/${activeSection.label}/${item}`}
                        className="nav__mobile-sublink"
                        onClick={handleCloseMenu}
                      >
                        {formatNavLabel(item)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
