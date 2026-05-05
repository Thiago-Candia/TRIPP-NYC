import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ProductProvider } from './Context/ProductContext.jsx'
import { CartProvider } from './Context/CartContext.jsx'



createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ProductProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ProductProvider>
  </BrowserRouter>
)