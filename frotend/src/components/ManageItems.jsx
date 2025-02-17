import { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageItems.css';

const ManageItems = () => {
  const [userItems, setUserItems] = useState([]);

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        const response = await axios.get('http://localhost:5000/api/user/items', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserItems(response.data);
      } catch (error) {
        console.error('Error fetching user items:', error);
      }
    };

    fetchUserItems();
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/user/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserItems(userItems.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <div className="manage-items">
      <h2>Manage Your Items</h2>
      {userItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        userItems.map(item => (
          <div key={item._id} className="manage-item-card">
            <img src={`http://localhost:5000${item.images[0]}`} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Category: {item.category}</p>
              <p>Condition: {item.condition}</p>
              <p>Price: Ksh {item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button onClick={() => handleRemoveItem(item._id)}>Remove Item</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageItems;
