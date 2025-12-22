import React from 'react'
import { Nav } from '../Components'
import '../Styles/styles.css'
import products from '../Data/clothesData.js'
import { Link } from 'react-router-dom'

const CollectionScreen = () => {
    return (
    <div className='collection-screen'>
        <nav>
            <Nav/>
        </nav>

    <main className='collection-main'>
        <div className='collection-header'>
            <div>
                <h1 className='text'>New arrivals</h1>
            </div>
            <div className='breadcrumb'>
                <Link to={'/'}>
                    <span className='text'>Home</span>
                </Link>
                <span className='text'> / </span>
                <span className='text'>New arrivals</span>
            </div>
            <div className='btn-filter'>
                <button className='btn-config'>
                    <span>Featured</span>
                </button>
            </div>
        </div>


        <div className='collection'>
            {products.map(product => (
            <div key={product.id} className='card-product'>
                <Link to={'/collections/product/' + product.id}>
                    <div className='product-image'>
                        <img src={product.img} alt={product.name} />
                    </div>
                    <div className='product-details'>
                        <h3 className='text'>{product.name}</h3>
                        <p className='text'>${product.price.toFixed(2)}</p>
                    </div>
                </Link>
            </div>
            ))}
        </div>
    </main>
    </div>
    )
}

export default CollectionScreen