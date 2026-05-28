import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#242424',
            color: '#e5e5e5',
            border: '1px solid #2e2e2e',
            borderRadius: '12px',
            fontFamily: 'Jost, sans-serif',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#242424' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#242424' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
