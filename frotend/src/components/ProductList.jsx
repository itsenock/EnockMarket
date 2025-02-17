import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';

const ProductList = ({ onAddProduct }) => {
  const [products, setProducts] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [navigate]);

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
                <div className="product-card" key={product._id}>
                  <Link to={`/product/${product._id}`}>
                    <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="product-image" />
                    <h3>{product.name}</h3>
                    <p>Ksh {product.price}</p>
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
  onAddProduct: PropTypes.func.isRequired,
};

export default ProductList;
