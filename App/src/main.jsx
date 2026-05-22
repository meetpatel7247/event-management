import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'

// Pre-warm the backend server immediately on initial bundle load to trigger cold-start wakeup as early as possible
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
fetch(API_BASE_URL.replace('/api/v1', '/api/v1/health')).catch(() => {});

/**
 * Entry point for the React application.
 * Bootstraps the app, attaching it to the root DOM element.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Redux Provider for global state management */}
    <Provider store={store}>
      {/* BrowserRouter for handling client-side routing */}
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
