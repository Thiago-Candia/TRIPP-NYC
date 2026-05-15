import React from 'react'
import { Route, Routes} from 'react-router-dom'
import HomeScreen from './Screens/HomeScreen'
import CollectionScreen from './Screens/CollectionScreen'
import { ProductScreen } from './Screens/ProductScreen'
import CartScreen from './Screens/CartScreen'
import DashboardScreen from './Screens/DashboardScreen'
import AccountScreen from './Screens/AccountScreen'
import CheckoutScreen from './Screens/CheckoutScreen'
import CheckoutStatusScreen from './Screens/CheckoutStatusScreen'
import UserProfileScreen from './Screens/UserProfileScreen'

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
        <Route path='/user' element={<UserProfileScreen/>} />
        <Route path='/checkout' element={<CheckoutScreen/>} />
        <Route path='/checkout/success' element={<CheckoutStatusScreen expectedStatus="success" />} />
        <Route path='/checkout/failure' element={<CheckoutStatusScreen expectedStatus="failure" />} />
        <Route path='/checkout/pending' element={<CheckoutStatusScreen expectedStatus="pending" />} />
        <Route path='/order-success' element={<CheckoutStatusScreen expectedStatus="success" />} />
      </Routes>
    </>
  )
}

export default App
