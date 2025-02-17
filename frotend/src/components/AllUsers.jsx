import { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';


const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');  // Retrieve the token from localStorage
        const response = await axios.get('http://localhost:5000/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className='allusers'>
      <h2>All Registered Users</h2>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <p><strong>First Name:</strong> {user.first_name}</p>
              <p><strong>Second Name:</strong> {user.second_name}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone Number:</strong> {user.phone_number}</p>
              <p><strong>Location:</strong> {user.location}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading users data...</p>
      )}
    </div>
  );
};

export default AllUsers;
