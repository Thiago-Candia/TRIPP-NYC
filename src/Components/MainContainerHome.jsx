import React from 'react'
import products from '../Data/clothesData.js'
import '../Styles/styles.css'
import CollectionScreen from '../Screens/CollectionScreen.jsx'
import { Link } from 'react-router-dom'
import intro from '../assets/Img/intro.jpg'
import intro2 from '../assets/Img/intro2.jpg'

const MainContainerHome = () => {
    return (
    <main className='main__home'>
        <div className='banner__main'>
            <Link to={'/collections'}>
                <img className='banner__main__img' src={intro} alt="" />
                <img src={intro2} alt="" />
            </Link>
        </div>

        <div className='main__title'>
            <h2 className='main__title__text'>New Arrivals</h2>
            <Link to={'/collections'}>
                <button className='btn-config btn__shop__all'>
                    <span> SHOP ALL </span>
                </button>
            </Link>
        </div>

        <div className='product__list'>
            {products.map(product => (
            <div key={product.id} className='card__product'>
                <Link to={'/collections/product/' + product.id}>
                    <div className='product__box__image'>
                        <img className='product__image' src={product.img} alt={product.name} />
                    </div>
                    <div className='product__details'>
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