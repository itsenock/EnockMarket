
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { auth } from '../firebaseConfig'; 

const LoginForm= () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const Login = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/'); 
    } catch (error) {
      console.error('Authentication Error:', error.message);
      alert("An error occured!!");
    }
  };

  return (
    <div className="login-form">
      <h2>{isRegistering ? 'Create Account' : 'Sign In'}</h2>
      <form onSubmit={Login}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/>
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
