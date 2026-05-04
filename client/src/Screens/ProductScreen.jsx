import React, { useState, useEffect } from "react";
import { Nav } from "../Components";
import { Link, useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import "../Styles/product-screen.css";
import { getProductById } from "../api/products.js";
import { useCart } from "../Hooks/useCart.jsx";


export const ProductScreen = () => {

    const { handleAddToCart } = useCart();
    const {id} = useParams();

    const [product, setProduct] = useState({});
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const sizes = product.variants?.map(v => v.size) || [];

    useEffect(() => {
    const fetchProduct = async () => {
        try {
            const data = await getProductById(id)
            setProduct(data);
        } catch (error) {
            console.error("Error fetching product", error);
        }
    }
    fetchProduct()
    }, [id])

    if (!product) {
        return <h1>Product not found</h1>;
    }


    const getImageUrl = (imgPath) => {
        if (!imgPath) return '';
        if (imgPath.startsWith('http') || imgPath.startsWith('data:')) return imgPath;
        return `${window.location.origin}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
    };

    const productImages = product.images?.length > 0
        ? product.images.map(img => getImageUrl(img.image))
        : [getImageUrl(product.primary_image)];

    const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
        prev === 0 ? productImages.length - 1 : prev - 1,
    );
    };

    const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
        prev === productImages.length - 1 ? 0 : prev + 1,
    );
    };

    return (
    <div className="page">
        <Header />
        <Nav />
        <main className="product-screen">
            <div className="product">
            <section className="product__gallery">
                <button
                    className="product__gallery-nav product__gallery-nav--prev"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                >
                    ‹
                </button>
                <div className="product__gallery-main">
                    <img
                        src={productImages[currentImageIndex]}
                        alt={product.name}
                        className="product__gallery-image"
                    />
                    <button className="product__gallery-view-more">
                        {product.variants?.[0]?.size || "UNISEX"} - View more images
                    </button>
                </div>
                <button
                    className="product__gallery-nav product__gallery-nav--next"
                    onClick={handleNextImage}
                    aria-label="Next image"
                >
                    ›
                </button>
            </section>
            <section className="product__info">
                <div className="product__header">
                    <button
                        className="product__favorite"
                        onClick={() => setIsFavorite(!isFavorite)}
                        aria-label="Add to favorites"
                    >
                        {isFavorite ? "❤" : "♡"}
                    </button>
                    <span className="product__sku">
                        No. {product.sku || "N/A"}
                    </span>
                    <nav className="product__breadcrumb">
                        <Link to="/" className="product__breadcrumb-link">
                            Home
                        </Link>
                        <span className="product__breadcrumb-separator">
                            \
                        </span>
                        <Link to="/collections" className="product__breadcrumb-link">
                            New Arrivals Homepage
                        </Link>
                    </nav>
                </div>
                <div className="product__title-section">
                    <h1 className="product__title">{product.name}</h1>
                    <p className="product__price">${Number(product.price).toFixed(2)}</p>
                </div>
                <hr className="product__divider" />
                
                <div className="product__size-section">
                    <h2 className="product__size-label">
                        Size
                    </h2>
                    <div className="product__size-grid">
                        {sizes.length > 0 ? (
                            sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`product__size-button ${
                                        selectedSize === size
                                            ? "product__size-button--selected"
                                            : ""
                                    }`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))
                        ) : (
                            <p>No sizes available</p>
                        )}
                    </div>
                    <div className="product__actions">
                        <button
                            className="product__action-button product__action-button--primary"
                            disabled={!selectedSize}
                            onClick={() => {
                                const variant = product.variants?.find(v => v.size === selectedSize);
                                if (variant) {
                                    handleAddToCart(product, 1, variant);
                                }
                            }}
                        >
                            {selectedSize ? "Add to cart" : "Select a size"}
                        </button>
                        <button className="product__action-button product__action-button--secondary">
                            Need Help?
                        </button>
                    </div>
                    <button className="product__size-chart">Size Chart</button>
                </div>
                <hr className="product__divider" />
                <div className="product__description">
                    <p className="product__description-text">
                        {product.description ||
                        "Product description not available."}
                    </p>
                    <div className="product__details">
                        <p className="product__details-item">
                            <strong>WOMAN IS WEARING X-SMALL</strong>
                        </p>
                        <p className="product__details-item">
                            <strong>MAN IS WEARING MEDIUM</strong>
                        </p>
                        <p className="product__details-item">
                            <strong>SIZING BASED ON MENS FIT</strong>
                        </p>
                        <ul className="product__features">
                            <li className="product__features-item">
                                – Refer to Size Chart (Based on Men's Sizing)
                            </li>
                            <li className="product__features-item">
                                – Adjustable fit for comfort
                            </li>
                            <li className="product__features-item">
                                – Premium Materials
                            </li>
                            <li className="product__features-item">
                                – Care instructions: See tag for details
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    </main>
    <Footer />
    </div>
    )
}
