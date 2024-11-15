import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-tailwind/react'; // Import the ThemeProvider
import App from './App';
import './index.css';
import { AuthProvider } from './AuthContext'; // Import the AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <ThemeProvider> {/* Wrap your application with the ThemeProvider */}
    <AuthProvider> {/* Wrap your application with the AuthProvider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);