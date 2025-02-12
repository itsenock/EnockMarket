import PropTypes from 'prop-types';
import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  cartItems: [],
  wishlistItems: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const itemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
      if (itemIndex !== -1) {
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[itemIndex].quantity += action.payload.quantity;
        return { ...state, cartItems: updatedCartItems };
      }
      return { ...state, cartItems: [...state.cartItems, action.payload] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cartItems: state.cartItems.filter(item => item.id !== action.payload.id) };
    case 'MOVE_TO_WISHLIST':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload.id),
        wishlistItems: [...state.wishlistItems, action.payload],
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(item => item.id !== action.payload.id),
      };
    case 'MOVE_TO_CART':
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(item => item.id !== action.payload.id),
        cartItems: [...state.cartItems, action.payload],
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id: productId } });
  };

  const moveToWishlist = (product) => {
    dispatch({ type: 'MOVE_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (productId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: { id: productId } });
  };

  const moveToCart = (product) => {
    dispatch({ type: 'MOVE_TO_CART', payload: product });
  };

  return (
    <CartContext.Provider value={{ cartItems: state.cartItems, wishlistItems: state.wishlistItems, addToCart, removeFromCart, moveToWishlist, removeFromWishlist, moveToCart }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => useContext(CartContext);
