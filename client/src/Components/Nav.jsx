import React, { useState } from "react"
import logoNav from "../assets/Img/logonav.png"
import bag from "../assets/Img/bag.png"
import { Link } from "react-router-dom"
import { Icons } from "../Assets/Icons/Icons"
import CartSidebar from "./CartSidebar"

const Nav = ({ onSearchClick = () => {} }) => {

  const [isCartOpen, setIsCartOpen] = useState(false)


  return (

    <header className="header">
      <nav className="nav">
        <div className="nav__menu">
          <ul className="nav__list">
            <li className="nav__item">
              <div className="nav__dropdown">
                <Link to="/" className="nav__link">
                  <span className="nav__text">women</span>
                </Link>
                <ul className="nav__submenu">
                  <li className="nav__submenu-item">
                    <Link to="/collections/women/new-arrivals" className="nav__submenu-link">
                      <span className="nav__submenu-text">new arrivals</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/women/face-covers" className="nav__submenu-link">
                      <span className="nav__submenu-text">face covers</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/women/bottoms" className="nav__submenu-link">
                      <span className="nav__submenu-text">bottoms</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/women/top" className="nav__submenu-link">
                      <span className="nav__submenu-text">top</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/women/dresses" className="nav__submenu-link">
                      <span className="nav__submenu-text">dresses</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/women/outwear" className="nav__submenu-link">
                      <span className="nav__submenu-text">outwear</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/women/plus-size" className="nav__submenu-link">
                      <span className="nav__submenu-text">plus size</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/women/accessories" className="nav__submenu-link">
                      <span className="nav__submenu-text">accessories</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/women/sale" className="nav__submenu-link">
                      <span className="nav__submenu-text">sale</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* MEN */}
            <li className="nav__item">
              <div className="nav__dropdown">
                <Link to="/" className="nav__link">
                  <span className="nav__text">men</span>
                </Link>
                <ul className="nav__submenu">
                  <li className="nav__submenu-item">
                    <Link to="/collections/men/new-arrivals" className="nav__submenu-link">
                      <span className="nav__submenu-text">new arrivals</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/men/face-covers" className="nav__submenu-link">
                      <span className="nav__submenu-text">face covers</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/men/bottoms" className="nav__submenu-link">
                      <span className="nav__submenu-text">bottoms</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/men/top" className="nav__submenu-link">
                      <span className="nav__submenu-text">top</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/men/dresses" className="nav__submenu-link">
                      <span className="nav__submenu-text">dresses</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/men/outwear" className="nav__submenu-link">
                      <span className="nav__submenu-text">outwear</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/men/plus-size" className="nav__submenu-link">
                      <span className="nav__submenu-text">plus size</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/men/accessories" className="nav__submenu-link">
                      <span className="nav__submenu-text">accessories</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/men/sale" className="nav__submenu-link">
                      <span className="nav__submenu-text">sale</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* DARKSTREET */}
            <li className="nav__item">
              <div className="nav__dropdown">
                <Link to="/" className="nav__link">
                  <span className="nav__text">darkstreet</span>
                </Link>
                <ul className="nav__submenu">
                  <li className="nav__submenu-item">
                    <Link to="/collections/darkstreet/new-arrivals" className="nav__submenu-link">
                      <span className="nav__submenu-text">new arrivals</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/darkstreet/face-covers" className="nav__submenu-link">
                      <span className="nav__submenu-text">face covers</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/darkstreet/bottoms" className="nav__submenu-link">
                      <span className="nav__submenu-text">bottoms</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/darkstreet/top" className="nav__submenu-link">
                      <span className="nav__submenu-text">top</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/darkstreet/dresses" className="nav__submenu-link">
                      <span className="nav__submenu-text">dresses</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/darkstreet/outwear" className="nav__submenu-link">
                      <span className="nav__submenu-text">outwear</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/darkstreet/plus-size" className="nav__submenu-link">
                      <span className="nav__submenu-text">plus size</span>
                    </Link>
                  </li>
                  <li className="nav__submenu-item">
                    <Link to="/collections/darkstreet/accessories" className="nav__submenu-link">
                      <span className="nav__submenu-text">accessories</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* SALE */}
            <li className="nav__item">
              <div className="nav__dropdown">
                <Link to="/sale" className="nav__link">
                  <span className="nav__text">sale</span>
                </Link>
              </div>
            </li>
          </ul>
        </div>

        {/* LOGO */}
        <div className="nav__logo">
          <Link to="/">
            <img src={logoNav} alt="TRIPP NYC Logo" className="nav__logo-img" />
          </Link>
        </div>

        {/* ACTIONS */}
        <div className="nav__actions">
          <button
            className="nav__action-btn"
            onClick={onSearchClick}
            aria-label="Open search"
          >
            <Icons.MagnifyingGlass />
          </button>

          <Link to="/account" className="nav__action-link">
            Account
          </Link>

          <button className="btn-config" onClick={() => setIsCartOpen(true)}>
            <span className="nav__cart-label">
              <i className="">
                🛒
              </i>
            </span>
          </button>

          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />

            <span className="nav__cart-separator">—</span>
            <div className="nav__cart-icon">
              <img src={bag} alt="Shopping bag" className="nav__cart-img" />
            </div>
        </div>
      </nav>
    </header>
  )
}

export default Nav
