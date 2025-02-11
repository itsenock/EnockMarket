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

  const Change = (e) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  const ImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setItemData({ ...itemData, images: imageUrls });
  };

  const Submit = (e) => {
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

    if (itemData.condition === 'New' && itemData.category === 'Electronics') {
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
    <div className="seller-form">
      <h2>Sell an Item</h2>
      <form onSubmit={Submit}>
        <label>
          Item Name:
          <input
            type="text"
            name="name"
            value={itemData.name}
            onChange={Change}
            required
          />
        </label>
        <label>
          Category:
          <select
            name="category"
            value={itemData.category}
            onChange={Change}
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
          <select
            name="condition"
            value={itemData.condition}
            onChange={Change}
          >
            <option value="New">New</option>
            <option value="Second Hand">Second Hand</option>
          </select>
        </label>
        {itemData.condition === 'New' &&
          itemData.category === 'Electronics' && (
            <label>
              Warranty:
              <select
                name="warranty"
                value={itemData.warranty}
                onChange={Change}
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
            onChange={Change}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={itemData.description}
            onChange={Change}
            required
          ></textarea>
        </label>
        <label>
          Upload Images:
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={ImageUpload}
            required
          />
        </label>
        <button type="submit">Submit Item</button>
      </form>
    </div>
  );
};

export default SellerForm;
