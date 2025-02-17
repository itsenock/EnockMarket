import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import LoginForm from './LoginForm';
import './Navbar.css';

const Navbar = () => {
  const { cartItems, clearCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
    if (!token) {
      clearCart(); // Clear cart if user is not logged in
    }
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    closeModal(); // Ensure this is called correctly
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <h1>CAMPUS MARKET</h1>
        </Link>
      </div>
      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/sell">Sell</Link>
        <Link to="/cart">Cart ({isLoggedIn ? cartItems.length : 0})</Link>
        {isLoggedIn ? (
          <Link to="/profile">Profile</Link>
        ) : (
          <button onClick={openModal}>Login</button>
        )}
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        &#9776;
      </div>
      {isModalOpen && <LoginForm closeModal={closeModal} onLoginSuccess={handleLogin} />}
    </nav>
  );
};

export default Navbar;
