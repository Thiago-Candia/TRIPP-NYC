import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Nav } from "../Components";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import { Icons } from "../Assets/Icons/Icons.jsx";
import { getProductById } from "../api/products.js";
import { useCart } from "../Context/CartContext.jsx";
import "../Styles/product-screen.css";

const getImageUrl = (imgPath) => {
  if (!imgPath) return "";
  if (imgPath.startsWith("http") || imgPath.startsWith("data:")) return imgPath;
  return `${window.location.origin}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`
}

export const ProductScreen = () => {
  const { handleAddToCart } = useCart();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [productError, setProductError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const dragStartX = useRef(0);
  const dragOffsetX = useRef(0);

  useEffect(() => {
    let isActive = true;

    const fetchProduct = async () => {
      setIsProductLoading(true);
      setProductError("");
      setProduct(null);

      try {
        const data = await getProductById(id);
        if (!isActive) return;
        setProduct(data);
      } catch (error) {
        if (!isActive) return;
        console.error("Error fetching product", error);
        setProductError("We could not find this product.");
      } finally {
        if (isActive) {
          setIsProductLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setSelectedSize("");
    setDragOffset(0);
    dragOffsetX.current = 0;
  }, [id]);

  const productImages = useMemo(() => {
    if (!product) return [];
    return product.images?.length
      ? product.images.map((image) => getImageUrl(image.image))
      : [getImageUrl(product.primary_image)];
  }, [product]);

  const sizes = useMemo(
    () => product?.variants?.map((variant) => variant.size).filter(Boolean) || [],
    [product],
  );

  if (isProductLoading) {
    return (
      <div className="page">
        <Header />
        <Nav />
        <main className="product-screen product-screen--state">
          <div className="product-state" role="status" aria-live="polite">
            <span className="product-state__spinner" aria-hidden="true" />
            <p className="product-state__eyebrow">Loading product</p>
            <h1 className="product-state__title">Preparing the details</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="page">
        <Header />
        <Nav />
        <main className="product-screen product-screen--state">
          <div className="product-state product-state--error" role="alert">
            <p className="product-state__eyebrow">Product unavailable</p>
            <h1 className="product-state__title">This product could not be loaded.</h1>
            <Link className="product-state__button" to="/collections">
              Back to shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleGalleryPointerDown = (event) => {
    if (productImages.length < 2) return;
    dragStartX.current = event.clientX;
    dragOffsetX.current = 0;
    setIsDraggingGallery(true);
    setDragOffset(0);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleGalleryPointerMove = (event) => {
    if (!isDraggingGallery) return;
    const nextOffset = event.clientX - dragStartX.current;
    dragOffsetX.current = nextOffset;
    setDragOffset(nextOffset);
  };

  const handleGalleryPointerEnd = (event) => {
    if (!isDraggingGallery) return;

    const swipeThreshold = 48;
    const finalOffset = dragOffsetX.current;
    if (finalOffset <= -swipeThreshold) {
      handleNextImage();
    }
    if (finalOffset >= swipeThreshold) {
      handlePrevImage();
    }

    setIsDraggingGallery(false);
    setDragOffset(0);
    dragOffsetX.current = 0;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const handleGalleryKeyDown = (event) => {
    if (productImages.length < 2) return;
    if (event.key === "ArrowLeft") handlePrevImage();
    if (event.key === "ArrowRight") handleNextImage();
  };

  const handleAddSelectedSize = () => {
    const variant = product.variants?.find((item) => item.size === selectedSize);
    if (variant) {
      handleAddToCart(product, 1, variant);
    }
  };

  return (
    <div className="page">
      <Header />
      <Nav />
      <main className="product-screen">
        <div className="product">
          <section className="product__gallery">
            {productImages.length > 1 && (
              <div className="product__gallery-thumbs" aria-label="Product images">
                {productImages.map((image, imageIndex) => (
                  <button
                    className={`product__gallery-thumb ${
                      imageIndex === currentImageIndex ? "product__gallery-thumb--active" : ""
                    }`}
                    type="button"
                    key={`${image}-${imageIndex}`}
                    onClick={() => setCurrentImageIndex(imageIndex)}
                    aria-label={`View product image ${imageIndex + 1}`}
                    aria-current={imageIndex === currentImageIndex}
                  >
                    <img src={image} alt={`${product.name} thumbnail ${imageIndex + 1}`} />
                  </button>
                ))}
              </div>
            )}

            <div
              className={`product__gallery-main ${
                isDraggingGallery ? "product__gallery-main--dragging" : ""
              }`}
              role="region"
              tabIndex={0}
              aria-label="Product image gallery"
              onPointerDown={handleGalleryPointerDown}
              onPointerMove={handleGalleryPointerMove}
              onPointerUp={handleGalleryPointerEnd}
              onPointerCancel={handleGalleryPointerEnd}
              onKeyDown={handleGalleryKeyDown}
            >
              <div
                className="product__gallery-track"
                style={{
                  transform: `translateX(calc(${-currentImageIndex * 100}% + ${dragOffset}px))`,
                }}
              >
                {productImages.map((image, imageIndex) => (
                  <div className="product__gallery-slide" key={`${image}-${imageIndex}`}>
                    <img
                      src={image}
                      alt={`${product.name} ${imageIndex + 1}`}
                      className="product__gallery-image"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
              <button className="product__gallery-view-more">
                {product.variants?.[0]?.size || "UNISEX"} - View more images
              </button>
            </div>
          </section>

          <section className="product__info">
            <div className="product__header">
              <button
                className={`product__favorite ${isFavorite ? "product__favorite--active" : ""}`}
                onClick={() => setIsFavorite((current) => !current)}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={isFavorite}
              >
                {isFavorite ? <Icons.HeartFilled /> : <Icons.Heart />}
              </button>
              <span className="product__sku">No. {product.sku || "N/A"}</span>
              <nav className="product__breadcrumb">
                <Link to="/" className="product__breadcrumb-link">Home</Link>
                <span className="product__breadcrumb-separator">\</span>
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
              <h2 className="product__size-label">Size</h2>
              <div className="product__size-grid">
                {sizes.length ? (
                  sizes.map((size) => (
                    <button
                      key={size}
                      className={`product__size-button ${
                        selectedSize === size ? "product__size-button--selected" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <p className="product__empty-sizes">No sizes available</p>
                )}
              </div>

              <div className="product__actions">
                <button
                  className="product__action-button product__action-button--primary"
                  disabled={!selectedSize}
                  onClick={handleAddSelectedSize}
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
                {product.description || "Product description not available."}
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
                    - Refer to Size Chart (Based on Mens Sizing)
                  </li>
                  <li className="product__features-item">- Adjustable fit for comfort</li>
                  <li className="product__features-item">- Premium Materials</li>
                  <li className="product__features-item">- Care instructions: See tag for details</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};
