import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import SellerForm from './components/SellerForm';
import Home from './components/Home';
import ErrorBoundary from './components/ErrorBoundary';
import { CartProvider } from './contexts/CartContext';
import productData from './data/productData';
import Checkout from './components/Checkout';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(productData);
  }, []);

  const addProductToList = (product) => {
    setProducts([...products, product]);
  };

  return (
    <CartProvider>
      <Router>
        <ErrorBoundary>
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList products={products} />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/product/:id" element={<ProductDetails products={products} />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/sell" element={<SellerForm onAddProduct={addProductToList} />} />
            </Routes>
          </div>
          <Footer />
        </ErrorBoundary>
      </Router>
    </CartProvider>
  );
}

export default App;
