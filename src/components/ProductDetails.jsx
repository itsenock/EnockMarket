import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import PropTypes from 'prop-types';
import './ProductDetails.css';

const ProductDetails = ({ products }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const productData = products.find((product) => product.id === parseInt(id));
    if (productData) {
      setProduct(productData);
      setMainImage(productData.images[0]);
    }
  }, [id, products]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
    alert('Product added to cart.');
  };

  return (
    <div className="product-details">
    <div className='detailed-image'>
      <div className="main-image-reviews">
        <img src={mainImage} alt={product.name} />
        <div className="thumbnail-images">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} ${index + 1}`}
              onClick={() => setMainImage(image)}
            />
          ))}
        </div>
    
      </div>
      <div className="product-info">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Price: {product.price} USD</p>
        {product.warranty && <p>Warranty: {product.warranty}</p>}
        <p>Rating: {product.rating} / 5</p>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
      </div>
      <div className="reviews">
          <h3>Customer Reviews</h3>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="review">
                <p><strong>{review.user}</strong></p>
                <p>Rating: {review.rating} / 5</p>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

    </div>
  );
};

ProductDetails.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      reviews: PropTypes.arrayOf(
        PropTypes.shape({
          user: PropTypes.string.isRequired,
          rating: PropTypes.number.isRequired,
          comment: PropTypes.string.isRequired,
        })
      ),
      warranty: PropTypes.string,
      rating: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ProductDetails;
