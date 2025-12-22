import React, { useReducer } from 'react'
import Header from '../Components/Header'
import { Nav } from '../Components'
import { Link, useParams } from 'react-router-dom'
import products from '../Data/clothesData'
import Footer from '../Components/Footer'

export const ProductScreen = () => {

    const { id } = useParams();
    const product = products.find(product => product.id === parseInt(id))

    if(!product) {
        return <h1>Product not found</h1>
    }

    return (
        <section className='product-screen'>
            <Header/>
            <Nav/>
        <main className='main-product-screen'>
            <div className='product-image-box'>
                <button></button>
                    <img src={product.img} alt="" />
                <button></button>
            </div>
            <div className='product-information'>
                <div className='product-information__details'>
                    <button>
                        <i></i>
                    </button>
                    <span></span>
                    <div>
                        <Link to={"/"}>Home</Link>/
                        <Link to={"/"}>New Arrivals Homepage</Link>
                    </div>
                </div>
                <div className='product-information__details'>
                    <h1>{product.name}</h1>
                    <span>{product.price}</span>
                </div>
                <div className='product-information__size'>
                    <div>
                        <span></span>
                        <button></button>
                    </div>
                    <div>
                        <button>
                            <span></span>
                        </button>
                        <button>
                            <span></span>
                        </button>
                    </div>
                    <span>Size</span>
                </div>
                <div className='product-information__characterist'>
                    <p></p>
                    <p>
                        <span></span>
                    </p>
                </div>
            </div>
        </main>

        <footer>
            <Footer/>
        </footer>
        </section>
    )
}
