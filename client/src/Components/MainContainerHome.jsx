import React from 'react'
import products from '../Data/clothesData.js'
import '../Styles/styles.css'
import CollectionScreen from '../Screens/CollectionScreen.jsx'
import { Link } from 'react-router-dom'
import intro from '../assets/Img/intro.jpg'

const MainContainerHome = () => {
    return (
    <main>
        <div className='banner-main'>
            <Link to={'/collections'}>
                <img src={intro} alt="" />
            </Link>
        </div>

        <div className='main-title'>
            <h2>New Arrivals</h2>
            <Link to={'/collections'}>
                <button className='btn-config btn-shop-all'>
                    <span> SHOP ALL </span>
                </button>
            </Link>
        </div>

        <div className='product-list'>
            {products.map(product => (
            <div key={product.id} className='card-product'>
                <Link to={'/collections/product/' + product.id}>
                    <div className='product-image'>
                        <img src={product.img} alt={product.name} />
                    </div>
                    <div className='product-details'>
                        <h3>{product.name}</h3>
                        <p>${product.price.toFixed(2)}</p>
                    </div>
                </Link>
            </div>
            ))}
        </div>

    </main>
    )
}

export default MainContainerHome