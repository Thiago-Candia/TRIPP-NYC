import React, { useEffect, useState, useRef } from "react"
import { Nav, MainContainerHome } from "../Components/index"
import '../Styles/styles.css'

import Header from "../Components/Header"
import Footer from "../Components/Footer"
import GramSection from "../Components/GramSection"

const HomeScreen = () => {

    const [isSearch, setIsSearch] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [showHeader, setShowHeader] = useState(true);

    /* FUNCION SCROLL */
    const lastScrollY = useRef(0)

    const headerContainerRef = useRef(null)
    const [show, setShow] = useState(true)


    useEffect(() => {
        let lastScroll = 0
        const handleScroll = () => {
            const currentScroll = window.scrollY
            if (currentScroll < 10) {
                setShow(false)
            }
            else if (currentScroll > lastScroll) {
                setShow(true)
            }
            lastScroll = currentScroll
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])


    return (
        <div>
            <div
                ref={headerContainerRef}
                className={`section__header__nav ${show ? 'section__header__nav--visible' : 'section__header__nav-hidden'}`}>
                    {showHeader && (
                    <Header
                        isSearchOpen={isSearch}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        onCloseSearch={() => {
                            setIsSearch(false);
                            setSearchText('');
                        }}
                        onCloseHeader={() => setShowHeader(false)}
                    />
                )}
            <Nav onSearchClick={() => {
                setIsSearch(true)
                setShowHeader(true)
            } 
            }/>
            </div>

            <div className={`'main__container__home' ${show ? 'main__container--visible' : 'main__container--visible'}`}
                style={{
                    marginTop: show ? '150px' : '0',
                    transition: 'margin-top 0.3s ease-in-out'
                }}
                >
                <MainContainerHome/>
            </div>

            <div className="gram-section">
                <GramSection/>
            </div>
            
            <section>
                <Footer/>
            </section>
        </div>
    )
}

export default HomeScreen