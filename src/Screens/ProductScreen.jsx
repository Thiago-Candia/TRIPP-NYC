import React, { useState } from 'react'
import { Nav } from '../Components'
import { Link, useParams } from 'react-router-dom'
import products from '../Data/clothesData'
import Footer from '../Components/Footer'
import Header from '../Components/Header'
import '../Styles/product-screen.css'

export const ProductScreen = () => {
    const { id } = useParams()
    const product = products.find(product => product.id === parseInt(id))
    
    const [selectedSize, setSelectedSize] = useState('')
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)

    if (!product) {
        return <h1>Product not found</h1>
    }

    // Simulación de múltiples imágenes (adapta según tu data)
    const productImages = product.images || [product.img]

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? productImages.length - 1 : prev - 1
        )
    }

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === productImages.length - 1 ? 0 : prev + 1
        )
    }

    const sizes = ['XX-SMALL', 'X-SMALL', 'SMALL', 'MEDIUM', 'LARGE', 'X-LARGE', 'XX-LARGE', 'XXX-LARGE']

    return (
        <div className='product-screen'>
            <Header />
            <Nav />
            
            <main className='product'>
                {/* Galería de imágenes */}
                <section className='product__gallery'>
                    <button 
                        className='product__gallery-nav product__gallery-nav--prev'
                        onClick={handlePrevImage}
                        aria-label="Previous image"
                    >
                        ‹
                    </button>
                    
                    <div className='product__gallery-main'>
                        <img 
                            src={productImages[currentImageIndex]} 
                            alt={product.name}
                            className='product__gallery-image'
                        />
                        
                        <button className='product__gallery-view-more'>
                            UNISEX - View more images
                        </button>
                    </div>
                    
                    <button 
                        className='product__gallery-nav product__gallery-nav--next'
                        onClick={handleNextImage}
                        aria-label="Next image"
                    >
                        ›
                    </button>
                </section>

                {/* Información del producto */}
                <section className='product__info'>
                    {/* Header con favorito y breadcrumb */}
                    <div className='product__header'>
                        <button 
                            className='product__favorite'
                            onClick={() => setIsFavorite(!isFavorite)}
                            aria-label="Add to favorites"
                        >
                            {isFavorite ? '❤' : '♡'}
                        </button>
                        
                        <span className='product__sku'>
                            No. {product.sku || 'AF3921MB-GNB-XXS'}
                        </span>
                        
                        <nav className='product__breadcrumb'>
                            <Link to='/' className='product__breadcrumb-link'>Home</Link>
                            <span className='product__breadcrumb-separator'>\</span>
                            <Link to='/collections' className='product__breadcrumb-link'>
                                New Arrivals Homepage
                            </Link>
                        </nav>
                    </div>

                    {/* Título y precio */}
                    <div className='product__title-section'>
                        <h1 className='product__title'>{product.name}</h1>
                        <p className='product__price'>${product.price}</p>
                    </div>

                    <hr className='product__divider' />

                    {/* Selección de talla */}
                    <div className='product__size-section'>
                        <h2 className='product__size-label'>Size</h2>
                        
                        <div className='product__size-grid'>
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`product__size-button ${
                                        selectedSize === size ? 'product__size-button--selected' : ''
                                    }`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        <div className='product__actions'>
                            <button 
                                className='product__action-button product__action-button--primary'
                                disabled={!selectedSize}
                            >
                                Select a size
                            </button>
                            
                            <button className='product__action-button product__action-button--secondary'>
                                Need Help?
                            </button>
                        </div>

                        <button className='product__size-chart'>
                            Size Chart
                        </button>
                    </div>

                    <hr className='product__divider' />

                    {/* Descripción del producto */}
                    <div className='product__description'>
                        <p className='product__description-text'>
                            {product.description || 
                            'These green slime bleach wash pants zip off into shorts and feature removable chains, adjustable ankles, D-rings, and deep pockets.'}
                        </p>

                        <div className='product__details'>
                            <p className='product__details-item'>
                                <strong>WOMAN IS WEARING X-SMALL</strong>
                            </p>
                            <p className='product__details-item'>
                                <strong>MAN IS WEARING MEDIUM</strong>
                            </p>
                            <p className='product__details-item'>
                                <strong>SIZING BASED ON MENS FIT</strong>
                            </p>
                            
                            <ul className='product__features'>
                                <li className='product__features-item'>
                                    – Refer to Unisex Darkstreet Pant - Size Chart (Based on Men's Sizing)
                                </li>
                                <li className='product__features-item'>
                                    – Drawstring and adjustable waist buckles allow for a tighter fit on the waist
                                </li>
                                <li className='product__features-item'>
                                    – 100% Cotton.
                                </li>
                                <li className='product__features-item'>
                                    - Hand wash cold. Lay flat to dry.
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    )
}
