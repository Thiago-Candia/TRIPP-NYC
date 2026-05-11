import React, { useEffect, useState, useRef } from "react";
import { Nav, MainContainerHome } from "../Components/index";
import "../Styles/styles.css";

import Header from "../Components/Header";
import Footer from "../Components/Footer";
import GramSection from "../Components/GramSection";

const HomeScreen = () => {

  const [isSearch, setIsSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showHeader, setShowHeader] = useState(true);

    const headerContainerRef = useRef(null);
    const [show, setShow] = useState(true);

    useEffect(() => {
    let lastScroll = window.scrollY;
    const handleScroll = () => {
        const currentScroll = window.scrollY;
        if (currentScroll < 10) {
        setShow(true);
        } else if (currentScroll > lastScroll) {
            setShow(false);
        } else {
            setShow(true);
        }
        lastScroll = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div
        ref={headerContainerRef}
        className={`section-header-nav ${show ? "section-header-nav--visible" : "section-header-nav--hidden"}`}
      >
        {showHeader && (
          <Header
            isSearchOpen={isSearch}
            searchText={searchText}
            setSearchText={setSearchText}
            onCloseSearch={() => {
              setIsSearch(false);
              setSearchText("");
            }}
            onCloseHeader={() => setShowHeader(false)}
          />
        )}
        <Nav
          disableAutoHide
          onSearchClick={() => {
            setIsSearch(true);
            setShowHeader(true);
          }}
        />
      </div>

      <div className={`main-container-home ${show ? "main-container-home--visible" : "main-container-home--hidden"}`}>
        <MainContainerHome />
      </div>

      <div className="gram-section">
        <GramSection />
      </div>

      <section>
        <Footer />
      </section>
    </div>
  );
};

export default HomeScreen;
