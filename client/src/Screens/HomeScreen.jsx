import React, { useState } from "react"
import { Nav, MainContainerHome } from "../Components/index"
import '../Styles/styles.css'
import Header from "../Components/Header"
import Footer from "../Components/Footer"

const HomeScreen = () => {

    const [isSearch, setIsSearch] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [showHeader, setShowHeader] = useState(true);

    return (

        <div>
            {showHeader && (
            <div>
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
            </div>
            )}

            <Nav onSearchClick={() => {
                setIsSearch(true)
                setShowHeader(true)
            } 
            }/>

            <div className='main-container-workspaces'>
                <MainContainerHome/>
            </div>
            
            <section>
                <Footer/>
            </section>
        </div>
    )
}

export default HomeScreen