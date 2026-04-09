import React from 'react'
import { Route, Routes} from 'react-router-dom'
import HomeScreen from './Screens/HomeScreen'
import CollectionScreen from './Screens/CollectionScreen'
import { ProductScreen } from './Screens/ProductScreen'

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
      </Routes>
    </>
  )
}

export default App
