import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { auth } from '../firebaseConfig'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    username: '',
    email: '',
    phoneNumber: '',
    location: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const Login = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }
      navigate('/');
    } catch (error) {
      console.error('Authentication Error:', error.message);
      alert("An error occurred!!");
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert('Password reset email sent!');
    } catch (error) {
      console.error('Password Reset Error:', error.message);
      alert('An error occurred while sending the password reset email!');
    }
  };

  return (
    <div className="login-form">
      <h2>{isRegistering ? 'Create Account' : 'Sign In'}</h2>
      <form onSubmit={Login}>
        {isRegistering && (
          <>
            <div className="input-container">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>First Name</label>
            </div>
            <div className="input-container">
              <input
                type="text"
                name="secondName"
                value={formData.secondName}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Second Name</label>
            </div>
            <div className="input-container">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Username</label>
            </div>
            <div className="input-container">
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Phone Number</label>
            </div>
            <div className="input-container">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Location</label>
            </div>
          </>
        )}
        <div className="input-container">
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder=" "
          />
          <label>{isRegistering ? "Email" : "Username or Email"}</label>
        </div>
        <div className="input-container password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder=" "
          />
          <label>Password</label>
          <span onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {isRegistering && (
          <div className="input-container password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Confirm Password</label>
            <span onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )}
        {!isRegistering && (
          <div className="forgot-password">
            <button type="button" onClick={handlePasswordReset}>Forgot Password?</button>
          </div>
        )}
        <button type="submit">
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
      <p onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering
          ? 'Already have an account? Sign In'
          : "Don't have an account? Register"}
      </p>
    </div>
  );
};

export default LoginForm;
