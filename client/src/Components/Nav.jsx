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
                    <div className='nav-item'> 
                    <ul>
                        <li>
                            <button className='btn-config btn-nav'>
                                <div className='link-nav'>
                                    <Link href="/"> 
                                        <span className='text'>women</span> 
                                    </Link>
                                    <ul className='sublinks-nav'>
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
                            <button className='btn-config btn-nav'>
                                <div className='link-nav'>
                                    <Link href="/"> 
                                        <span className='text'>men</span> 
                                    </Link>
                                    <ul className='sublinks-nav'>
                                        <li className=''>
                                            <span>new arrivals</span>
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
                            <button className='btn-config btn-nav'>
                                <div className='link-nav'>
                                    <Link href="/"> 
                                        <span className='text nav-text'>darkstreet</span> 
                                    </Link>
                                    <ul className='sublinks-nav'>
                                        <li className=''>
                                            <span>new arrivals</span>
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
                                    </ul>
                                </div>
                            </button>
                        </li>
                        <li>
                            <button className='btn-config btn-nav'>
                                <a href="/"> 
                                    <span className='text'>sale</span>
                                </a>
                            </button>
                        </li>
                    </ul>
                    </div>

                    {/* IMG NAV */}
                    <div className='nav-item'>
                        <Link to={"/"} className='logo-nav'>
                            <img src={logoNav}/>
                        </Link>
                    </div>

                    {/* CARRITO */}
                    <div className='nav-item nav-item-bag'>
                        <button className='btn-config' onClick={onSearchClick}>
                            <i>
                                <Icons.MagnifyingGlass/>
                            </i>
                        </button>
                        <span>
                            <a href="">Account</a>
                        </span>
                        <div className='nav-bag'>
                            <span>Tote </span>
                            <div className='bag-img'>
                                <img src={bag} alt="" />
                            </div>
                        </div>
                    </div>


                </nav>
            </header>
        </>
    )
}

export default Nav