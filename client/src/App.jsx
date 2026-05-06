import React from 'react'
import { Route, Routes} from 'react-router-dom'
import HomeScreen from './Screens/HomeScreen'
import CollectionScreen from './Screens/CollectionScreen'
import { ProductScreen } from './Screens/ProductScreen'
import CartScreen from './Screens/CartScreen'
import DashboardScreen from './Screens/DashboardScreen'
import AccountScreen from './Screens/AccountScreen'
import CheckoutScreen from './Screens/CheckoutScreen'
import OrderSuccessScreen from './Screens/OrderSuccessScreen'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<HomeScreen/>} />
        <Route path='/collections' element={<CollectionScreen/>} />
        <Route path='/collections/product/:id' element={<ProductScreen/>} />
        <Route path='/cart' element={<CartScreen/>} />
        <Route path='/dashboard' element={<DashboardScreen/>} />
        <Route path='/account' element={<AccountScreen/>} />
        <Route path='/checkout' element={<CheckoutScreen/>} />
        <Route path='/order-success' element={<OrderSuccessScreen/>} />
      </Routes>
    </>
  )
}

export default App
