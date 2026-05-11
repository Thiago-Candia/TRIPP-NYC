import React, { useRef } from "react";
import "../Styles/styles.css";
import { Link } from "react-router-dom";
import intro from "../Assets/Img/intro.jpg";
import intro2 from "../Assets/Img/intro2.jpg";
import { useProductContext } from "../Context/ProductContext.jsx";
import ProductCard from "./ProductCard.jsx";

const MainContainerHome = () => {
  const { products } = useProductContext();
  const productTrackRef = useRef(null);

  const handleCarouselScroll = (direction) => {
    const track = productTrackRef.current;
    if (!track) return;

    const scrollAmount = track.clientWidth * 0.85;
    track.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <main className="main-home">
      <div className="banner-main">
        <Link to={"/collections"}>
          <img className="banner-main__img" src={intro} alt="" />
          <img className="banner-main__img" src={intro2} alt="" />
        </Link>
      </div>

      <div className="main-title">
        <h2 className="main-title__text">New Arrivals</h2>
        <Link to={"/collections"}>
          <button className="main-title__button">
            <span> SHOP ALL </span>
          </button>
        </Link>
      </div>

      <section className="home-products">
        <button
          className="home-products__nav home-products__nav--prev"
          type="button"
          onClick={() => handleCarouselScroll("prev")}
          aria-label="Previous products"
        >
          {"<"}
        </button>
        <div className="products__list" ref={productTrackRef}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variant="home" />
          ))}
        </div>
        <button
          className="home-products__nav home-products__nav--next"
          type="button"
          onClick={() => handleCarouselScroll("next")}
          aria-label="Next products"
        >
          {">"}
        </button>
      </section>
    </main>
  );
};

export default MainContainerHome;
