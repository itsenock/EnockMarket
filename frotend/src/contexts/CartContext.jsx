import PropTypes from 'prop-types';
import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const initialState = {
  cartItems: [],
  wishlistItems: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART_ITEMS':
      return { ...state, cartItems: action.payload };
    case 'SET_WISHLIST_ITEMS':
      return { ...state, wishlistItems: action.payload };
    case 'CLEAR_CART_ITEMS':
      return { ...state, cartItems: [] };
    case 'ADD_TO_CART': {
      const itemIndex = state.cartItems.findIndex(item => item.product_id === action.payload.product_id);
      if (itemIndex !== -1) {
        return state; // Item already exists in the cart, do not add it again
      }
      return { ...state, cartItems: [...state.cartItems, action.payload] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cartItems: state.cartItems.filter(item => item._id !== action.payload._id) };
    case 'ADD_TO_WISHLIST': {
      return { ...state, wishlistItems: [...state.wishlistItems, action.payload] };
    }
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlistItems: state.wishlistItems.filter(item => item._id !== action.payload._id) };
    case 'UPDATE_QUANTITY': {
      const updatedCartItems = state.cartItems.map(item =>
        item._id === action.payload._id ? { ...item, quantity: action.payload.quantity } : item
      );
      return { ...state, cartItems: updatedCartItems };
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'CLEAR_CART_ITEMS' }); // Clear cart items if no token
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/user/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch({ type: 'SET_CART_ITEMS', payload: response.data });
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    const fetchWishlistItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/api/user/wishlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch({ type: 'SET_WISHLIST_ITEMS', payload: response.data });
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
      }
    };

    fetchCartItems();
    fetchWishlistItems();
  }, []);

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.post('http://localhost:5000/api/user/cart', product, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      dispatch({ type: 'ADD_TO_CART', payload: response.data });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/user/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: 'REMOVE_FROM_CART', payload: { _id: productId } });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const addToWishlist = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.post('http://localhost:5000/api/user/wishlist', product, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      dispatch({ type: 'ADD_TO_WISHLIST', payload: response.data });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/user/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: { _id: productId } });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.put(`http://localhost:5000/api/user/cart/${productId}`, { quantity }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      dispatch({ type: 'UPDATE_QUANTITY', payload: { _id: productId, quantity } });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART_ITEMS' });
  };

  return (
    <CartContext.Provider value={{ cartItems: state.cartItems, wishlistItems: state.wishlistItems, addToCart, removeFromCart, addToWishlist, removeFromWishlist, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => useContext(CartContext);
