// main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the '/client' import
import App from './App';
import './index.css'; // Import your global styles

// Create a root.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your App.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
