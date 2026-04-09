import React, { useState } from 'react'
import logoNav from '../assets/Img/logonav.png'
import bag from '../assets/Img/bag.png'
import { Link } from 'react-router-dom'
import { Icons } from '../Assets/Icons/Icons'


const Nav = ({onSearchClick}) => {

    return (
        <>
            <header>
                <nav>
                    {/* NAVBAR OPTIONS */}
                    <div className='nav__item'> 
                    <ul>
                        <li>
                            <button className='btn-config btn__nav'>
                                <div className='link__nav__box'>
                                    <Link href="/"> 
                                        <span className='text btn__nav__text'>women</span> 
                                    </Link>
                                    <ul className='sublinks__nav__box'>
                                        <li className='sublink-box-nav'>
                                            <Link href="/" className='btn-config btn-sublink-box-nav'>
                                                <span>new arrivals</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <span>face covers</span>
                                        </li>
                                        <li>
                                            <span>bottoms</span>
                                        </li>
                                        <li>
                                            <span>top</span>
                                        </li>
                                        <li>
                                            <span>dresses</span>
                                        </li>
                                        <li>
                                            <span>outwear</span>
                                        </li>
                                        <li>
                                            <span>plus size</span>
                                        </li>
                                        <li>
                                            <span>accessories</span>
                                        </li>
                                        <li>
                                            <span>sale</span>
                                        </li>
                                    </ul>
                                </div>
                            </button>
                        </li>
                        <li>
                            <button className='btn-config btn__nav'>
                                <div className='link__nav__box'>
                                    <Link href="/"> 
                                        <span className='text'>men</span> 
                                    </Link>
                                    <ul className='sublinks__nav__box'>
                                        <li className='sublinks__box'>
                                            <span>new arrivals</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>face covers</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>bottoms</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>top</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>dresses</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>outwear</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>plus size</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>accessories</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>sale</span>
                                        </li>
                                    </ul>
                                </div>
                            </button>
                        </li>
                        <li>
                            <button className='btn-config btn__nav'>
                                <div className='link__nav__box'>
                                    <Link href="/"> 
                                        <span className='text nav__btn__text'>darkstreet</span> 
                                    </Link>
                                    <ul className='sublinks__nav__box'>
                                        <li className='sublinks__box'>
                                            <span>new arrivals</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>face covers</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>bottoms</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>top</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>dresses</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>outwear</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>plus size</span>
                                        </li>
                                        <li className='sublinks__box'>
                                            <span>accessories</span>
                                        </li>
                                    </ul>
                                </div>
                            </button>
                        </li>
                        <li>
                            <button className='btn-config btn__nav'>
                                <a href="/"> 
                                    <span className='text'>sale</span>
                                </a>
                            </button>
                        </li>
                    </ul>
                    </div>

                    {/* IMG NAV */}
                    <div className='nav__item'>
                        <Link to={"/"} className='logo__nav'>
                            <img src={logoNav}/>
                        </Link>
                    </div>

                    {/* CARRITO */}
                    <div className='nav__item nav__item__bag'>
                        <button className='btn-config nav__item__bag__btn' onClick={onSearchClick}>
                            <i className='nav__item__bag__btn__icon'>
                                <Icons.MagnifyingGlass/>
                            </i>
                        </button>
                        <span>
                            <a href="">Account</a>
                        </span>
                        <div className='nav__bag'>
                            <span>Tote </span>
                            <div className='nav__bag__box__img'>
                                <img className='nav__bag__img' src={bag} alt="" />
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Nav