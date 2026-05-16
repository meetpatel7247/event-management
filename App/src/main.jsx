import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'

/**
 * Entry point for the React application.
 * Bootstraps the app, attaching it to the root DOM element.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Redux Provider for global state management */}
    <Provider store={store}>
      {/* BrowserRouter for handling client-side routing */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
