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
import Checkout from './components/Checkout';
import UserProfile from './components/UserProfile';
import AllUsers from './components/AllUsers';
import ManageItems from './components/ManageItems';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
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
              <Route path="/register" element={<LoginForm />} />
              <Route path="/product/:id" element={<ProductDetails products={products} />} /> {/* Pass products as props */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/sell" element={<SellerForm onAddProduct={addProductToList} />} />
              <Route path="/profile" element={<UserProfile />} />  {/* New Route for User Profile */}
              <Route path="/users" element={<AllUsers />} />      {/* New Route for All Users */}
              <Route path="/manage-items" element={<ManageItems />} /> {/* New Route for Manage Items */}
            </Routes>
          </div>
          <Footer />
        </ErrorBoundary>
      </Router>
    </CartProvider>
  );
}

export default App;
