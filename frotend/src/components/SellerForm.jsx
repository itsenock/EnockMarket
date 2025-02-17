import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SellerForm.css';

const SellerForm = ({ onAddProduct }) => {
  const [itemData, setItemData] = useState({
    name: '',
    category: 'Electronics',
    condition: 'New',
    description: '',
    price: '',
    warranty: '',
    images: [],
    quantity: 1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const categories = [
    'Electronics',
    'Computers',
    'Fashion',
    'Home & Kitchen',
    'Sports & Outdoors',
    'Musical Instruments',
    'Furniture',
    'Home Appliances',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setItemData({ ...itemData, images: [...itemData.images, ...newImages] });
  };

  const handleRemoveImage = (idx) => {
    setItemData({
      ...itemData,
      images: itemData.images.filter((_, index) => index !== idx),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !itemData.name ||
      !itemData.description ||
      !itemData.price ||
      itemData.images.length === 0
    ) {
      alert('Please fill in all required fields and upload at least one image.');
      return;
    }

    if (
      (itemData.condition === 'New' || itemData.condition === 'Refurbished') &&
      (itemData.category === 'Electronics' || itemData.category === 'Computers')
    ) {
      itemData.warranty = itemData.warranty || '1 Year';
    } else {
      itemData.warranty = 'No Warranty';
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.keys(itemData).forEach((key) => {
        if (key === 'images') {
          itemData[key].forEach((image) => {
            formData.append('images', image.file);
          });
        } else {
          formData.append(key, itemData[key]);
        }
      });

      const response = await axios.post('http://localhost:5000/api/user/item', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onAddProduct(response.data);
      alert('Your item has been added.');

      // Reset form
      setItemData({
        name: '',
        category: 'Electronics',
        condition: 'New',
        description: '',
        price: '',
        warranty: '',
        images: [],
        quantity: 1,
      });
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }
  };

  return (
    <div className="sellerForm-container">
      <div className="seller-form">
        <h2>Item Details</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Item Name:
            <input
              type="text"
              name="name"
              value={itemData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Category:
            <select
              name="category"
              value={itemData.category}
              onChange={handleChange}
            >
              {categories.map((cat, idx) => (
                <option value={cat} key={idx}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
          <label>
            Condition:
            <div>
              <label>
                <input
                  type="radio"
                  name="condition"
                  value="New"
                  checked={itemData.condition === 'New'}
                  onChange={handleChange}
                />
                New
              </label>
              <label>
                <input
                  type="radio"
                  name="condition"
                  value="Used"
                  checked={itemData.condition === 'Used'}
                  onChange={handleChange}
                />
                Used
              </label>
              <label>
                <input
                  type="radio"
                  name="condition"
                  value="Refurbished"
                  checked={itemData.condition === 'Refurbished'}
                  onChange={handleChange}
                />
                Refurbished
              </label>
            </div>
          </label>
          {(itemData.condition === 'New' || itemData.condition === 'Refurbished') &&
            (itemData.category === 'Electronics' || itemData.category === 'Computers') && (
            <label>
              Warranty:
              <select
                name="warranty"
                value={itemData.warranty}
                onChange={handleChange}
                required
              >
                <option value="">Select Warranty</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
              </select>
            </label>
          )}
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={itemData.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Quantity: {/* Add quantity field */}
            <input
              type="number"
              name="quantity"
              value={itemData.quantity}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={itemData.description}
              onChange={handleChange}
              required
            ></textarea>
          </label>
          <label>
            Upload Images:
            <div className="image-upload">
              <div className="upload-icon">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <span>+</span>
              </div>
              <div className="image-preview">
                {itemData.images.map((image, idx) => (
                  <div key={idx} className="image-container">
                    <img src={image.url} alt={`Preview ${idx}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => handleRemoveImage(idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </label>
          <button type="submit">Submit Item</button>
        </form>
      </div>
    </div>
  );
};

SellerForm.propTypes = {
  onAddProduct: PropTypes.func.isRequired,
};

export default SellerForm;
