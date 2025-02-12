import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({ products }) => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');

  useEffect(() => {
    const categorizedProducts = products.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
    setProductsByCategory(categorizedProducts);
  }, [products]);

  return (
    <div className="product-list-page">
      {Object.keys(productsByCategory).length === 0 && <p>No products available.</p>}
      {Object.keys(productsByCategory).map((category) => (
        (!selectedCategory || selectedCategory === category) && (
          <div key={category} className="category-section">
            <h2 className="category-title">{category}</h2>
            <div className="product-list">
              {productsByCategory[category].map((product) => (
                <div className="product-card" key={product.id}>
                  <Link to={`/product/${product.id}`}>
                    <img src={product.images[0]} alt={product.name} className="product-image" />
                    <h3>{product.name}</h3>
                    <p> Ksh {product.price} </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    warranty: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  })).isRequired,
};

export default ProductList;
