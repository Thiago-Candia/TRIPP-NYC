import { createContext, useContext, useEffect, useState } from "react";
import { getProducts } from "../api/products";

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getProducts();
      setProducts(data.results);
    } 
    catch (error) {
      console.log(error);
    }
  };
  
    fetchData();
  }, []);


return (
  <ProductContext.Provider value={{ products }}>
    {children}
  </ProductContext.Provider>)
}


export const useProductContext = () => useContext(ProductContext)