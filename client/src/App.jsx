import React from 'react'
import { Route, Routes} from 'react-router-dom'
import HomeScreen from './Screens/HomeScreen'
import CollectionScreen from './Screens/CollectionScreen'
import { ProductScreen } from './Screens/ProductScreen'
import CartScreen from './Screens/CartScreen'
import DashboardScreen from './Screens/DashboardScreen'
import AccountScreen from './Screens/AccountScreen'

function App() {

  return (
    <>
      <Routes>
        <Route 
          path='/' 
          element={<HomeScreen/>}>
        </Route>
        <Route
          path='/collections'
          element={<CollectionScreen/>}>
        </Route>
        <Route
          path='/collections/product/:id'
          element={<ProductScreen/>}>
        </Route>
        <Route
          path='/cart'
          element={<CartScreen/>}>
        </Route>
        <Route
          path='/dashboard'
          element={<DashboardScreen/>}>
        </Route>
        <Route
          path='/account'
          element={<AccountScreen/>}>
        </Route>
      </Routes>
    </>
  )
}

export default App
