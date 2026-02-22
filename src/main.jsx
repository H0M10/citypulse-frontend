import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AppProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(16px)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#f8fafc' }
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#f8fafc' }
            }
          }}
        />
      </AppProvider>
    </HashRouter>
  </React.StrictMode>
);
