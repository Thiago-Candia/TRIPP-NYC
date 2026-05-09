import React from "react";

const Header = ({
  isSearchOpen,
  searchText = "",
  setSearchText = () => {},
  onCloseHeader = () => {},
}) => {
  return (
    <div className="header-banner">
      {isSearchOpen ? (
        <div className="header-banner__search">
          <input
            className="header-banner__search-input"
            value={searchText}
            type="text"
            onChange={(event) => setSearchText(event.target.value)}
            aria-label="Search products"
          />
          <button
            className="header-banner__close"
            onClick={onCloseHeader}
            aria-label="Close search"
          >
            X
          </button>
        </div>
      ) : (
        <>
          <div className="header-banner__message-wrap">
            <span className="header-banner__message">
              EXTRA 50% OFF SALE ITEMS W/ CODE: XTRA50 - FREE U.S. SHIPPING FOR ORDERS $150+
            </span>
          </div>
          <button
            className="header-banner__close"
            onClick={onCloseHeader}
            aria-label="Close announcement"
          >
            X
          </button>
        </>
      )}
    </div>
  );
};

export default Header;
