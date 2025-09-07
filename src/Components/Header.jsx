import React from 'react'

const Header = ({isSearchOpen, searchText, setSearchText, handleSearchClick, handleCloseSearch, onCloseHeader}) => {

    return (
    <div className="header-banner">
        {isSearchOpen 
        ? (
            <div className='header-search'>
                <input
                    className='text'
                    value={searchText} 
                    type="text"
                    onChange={(e) => setSearchText(e.target.value)}
                    name="" 
                    id="" 
                />
                <button className='btn-config text btn-close-search' onClick={onCloseHeader}>
                    X
                </button>
            </div>
        )
        : (
        <>
            <div className='header-container'>
                <span className="text">
                    EXTRA 50% OFF SALE ITEMS W/ CODE: XTRA50 ★ FREE U.S. SHIPPING FOR ORDERS $150+
                </span>
            </div>
            <div>
                <span className="text btn-config" onClick={onCloseHeader}>X</span>
            </div>
        </>
        )}
    </div>
    )
}

export default Header