import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }
        
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  const getInitials = (firstName, secondName) => {
    return `${firstName.charAt(0)}${secondName.charAt(0)}`;
  };

  const handleEdit = (field) => {
    setEditingField(field);
    setEditValue(userData[field]);
  };

  const handleSave = async () => {
    if (!editingField) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/auth/update`, { [editingField]: editValue }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setUserData({ ...userData, [editingField]: editValue });
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to update user data. Please try again.');
    }
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {userData ? (
        <div className="profile-container">
          <div className="profile-photo">
            <span>{getInitials(userData.first_name, userData.second_name)}</span>
          </div>
          <div className="profile-sections">
            <div className="section personal-details">
              <h3>Personal Details</h3>
              <div className="profile-details">
                {['first_name', 'second_name', 'username', 'email', 'phone_number', 'location'].map(field => (
                  <p key={field}>
                    <strong>{field.replace('_', ' ')}:</strong>
                    {editingField === field ? (
                      <>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                        <button className="save-button" onClick={handleSave}>Save</button>
                      </>
                    ) : (
                      <>
                        {userData[field]} <button className="edit-button" onClick={() => handleEdit(field)}>Edit</button>
                      </>
                    )}
                  </p>
                ))}
              </div>
            </div>
            <div className="section manage-items">
              <h3>Manage Items</h3>
              <Link to="/manage-items" className="manage-items-link">Manage Your Items</Link>
            </div>
            <div className="section account">
              <h3>Account</h3>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default UserProfile;
