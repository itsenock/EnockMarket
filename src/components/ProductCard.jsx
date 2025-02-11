// ProductCard.js
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.images[0]} alt={product.name} />
        <div className="product-info">
          <h3>{product.name}</h3>
          <p>${product.price.toFixed(2)}</p>
          <p>{product.category}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
