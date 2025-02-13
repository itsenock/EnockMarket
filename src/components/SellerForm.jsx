import PropTypes from 'prop-types';
import { useState } from 'react';
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
  });

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
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    if (itemData.images.length + imageUrls.length <= 4) {
      setItemData({ ...itemData, images: [...itemData.images, ...imageUrls] });
    } else {
      alert('You can only upload up to 4 images.');
    }
  };

  const handleRemoveImage = (e, url) => {
    e.stopPropagation();
    setItemData({
      ...itemData,
      images: itemData.images.filter((image) => image !== url),
    });
  };

  const handleSubmit = (e) => {
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

    itemData.rating = 5;

    onAddProduct({
      ...itemData,
      id: Date.now(),
      price: parseFloat(itemData.price),
    });

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
    });
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
                  required
                />
                <span>+</span>
              </div>
              <div className="image-preview">
                {itemData.images.map((url, idx) => (
                  <div key={idx} className="image-container">
                    <img src={url} alt={`Upload ${idx}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={(e) => handleRemoveImage(e, url)}
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
