import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cartItems, wishlistItems, removeFromCart, addToCart, addToWishlist, removeFromWishlist, updateQuantity } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleQuantityChange = (productId, delta) => {
    cartItems.forEach((item) => {
      if (item._id === productId) {
        const newQuantity = item.quantity + delta;
        updateQuantity(item._id, newQuantity);
      }
    });
  };

  const handleMoveToWishlist = async (item) => {
    await addToWishlist(item);
    removeFromCart(item._id);
  };

  const handleMoveToCart = async (item) => {
    await addToCart(item);
    removeFromWishlist(item._id);
  };

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h3>Your Cart is Empty</h3>
          <p>Looks like you have not added anything to your cart yet.</p>
          <Link to="/">Continue Shopping</Link>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id}>
              <img src={`http://localhost:5000/${item.images[0]}`} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Ksh {parseFloat(item.price).toFixed(2)}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item._id, -1)} disabled={item.quantity <= 1}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                </div>
                <div className="main-buttons">
                  <button onClick={() => removeFromCart(item._id)}>Remove</button>
                  <button onClick={() => handleMoveToWishlist(item)}>Save for Later</button>
                </div>
              </div>
            </div>
          ))}
          <div className="checkout-section">
            <h3>Total: Ksh {totalAmount.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
          </div>
        </>
      )}
      {wishlistItems.length > 0 && (
        <div className="wishlist">
          <h2>Saved for Later</h2>
          {wishlistItems.map((item) => (
            <div className="wishlist-item" key={item._id}>
              <img src={`http://localhost:5000/${item.images[0]}`} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Ksh {parseFloat(item.price).toFixed(2)}</p>
                <div className="main-buttons">
                  <button onClick={() => handleMoveToCart(item)}>Move to Cart</button>
                  <button onClick={() => removeFromWishlist(item._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
