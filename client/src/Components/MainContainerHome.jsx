import React, { useEffect, useState } from "react";
import "../Styles/styles.css";
import CollectionScreen from "../Screens/CollectionScreen.jsx";
import { Link } from "react-router-dom";
import intro from "../assets/Img/intro.jpg";
import intro2 from "../assets/Img/intro2.jpg";
import { getProducts } from "../api/products.js";

const MainContainerHome = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getProducts();
      setProducts(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  fetchData();
}, []);


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
          <div key={product.id} className="product-card">
            <Link to={"/collections/product/" + product.id}>
              <div className="product-card__image-box">
                <img
                  className="product-card__image"
                  src={product.primary_image}
                  alt={product.name}
                />
              </div>
              <div className="product-card__details">
                <h3>{product.name}</h3>
                <p>${Number(product.price).toFixed(2)}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MainContainerHome;
