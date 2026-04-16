import React from 'react'
import { Nav } from '../Components'
import '../Styles/styles.css'
import products from '../Data/clothesData.js'
import { Link } from 'react-router-dom'
import Footer from '../Components/Footer.jsx'

const CollectionScreen = () => {
    return (
    <div className='collection'>
    <main className='collection__main'>
        <div className='collection__header'>
            <div>
                <h1 className='collection__title text'>New arrivals</h1>
            </div>
            <div className='collection__breadcrumb'>
                <Link to={'/'}>
                    <span className='text'>Home</span>
                </Link>
                <span className='text'>/</span>
                <span className='text'>New arrivals</span>
            </div>
            <div className='collection__filter'>
                <button className='collection__filter-btn'>
                    <span>Featured</span>
                </button>
            </div>
        </div>
    
        <div className='collection__products'>
            {products.map(product => (
            <div key={product.id} className='product-card'>
                <Link to={'/collections/product/' + product.id}>
                    <div className='product-card__image-box'>
                        <img className='product-card__image' src={product.img} alt={product.name} />
                    </div>
                    <div className='product-card__details'>
                        <h3 className='text'>{product.name}</h3>
                        <p className='text'>${product.price.toFixed(2)}</p>
                    </div>
                </Link>
            </div>
            ))}
        </div>
    </main>

    <Footer>
        <Footer/>
    </Footer>

    </div>
    )
}

export default CollectionScreen