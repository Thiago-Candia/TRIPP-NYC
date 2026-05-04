import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../Hooks/useCart';

function ProductCard({product}) {


  const params = useParams()
  const imageUrl = `${router.baseURL}/${product.primary_image}`

  const { handleAddToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const sizes = product.variants?.map(v => v.size) || [];

  return (
    <div className="product-card">
      <div className="product-card__image-wrapper">
        <Link to={`/collections/product/${product.id}`}>
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="product-card__image"
          />
        </Link>
        
        <button
          className="product-card__favorite"
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label="Add to favorites"
        >
          {isFavorite ? "❤" : "♡"}
        </button>
      </div>

      <div className="product-card__info">
        <Link to={`/collections/product/${product.id}`}>
          <h3 className="product-card__name">{product.name}</h3>
        </Link>

        <p className="product-card__price">${Number(product.price).toFixed(2)}</p>

        {sizes.length > 0 && (
          <div className="product-card__sizes">
            {sizes.map((size) => (
              <button
                key={size}
                className={`product-card__size-btn ${
                  selectedSize === size ? "product-card__size-btn--selected" : ""
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <button 
          className="product-card__add-to-cart"
          onClick={() => {
            if (selectedSize && product.variants) {
              const variant = product.variants.find(v => v.size === selectedSize);
              if (variant) {
                handleAddToCart(product, 1, variant);
              }
            }
            else {
              handleAddToCart(product.id, 1);
            }
          }}
        >
          {selectedSize ? "Add to cart" : "Add to cart"}
        </button>
      </div>
    </div>
  )
}

export default ProductCard