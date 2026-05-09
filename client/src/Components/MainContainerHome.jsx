import React from "react";
import "../Styles/styles.css";
import { Link } from "react-router-dom";
import intro from "../Assets/Img/intro.jpg";
import intro2 from "../Assets/Img/intro2.jpg";
import { useProductContext } from "../Context/ProductContext.jsx";
import ProductCard from "./ProductCard.jsx";

const MainContainerHome = () => {
  const { products } = useProductContext();

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

      <div className="products__list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="home" />
        ))}
      </div>
    </main>
  );
};

export default MainContainerHome;
