import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * App Component
 * 
 * The root component of the application. Handles top-level global layout, 
 * search state, and global components like the Navbar, Footer, and Toast notifications.
 */
function App() {
  // Global search state passed down to routing components
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const location = useLocation();

  /**
   * Effect to monitor URL parameters for direct search queries ("?q=something").
   * Updates local search state to trigger re-renders and filtering in downstream component trees.
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qParam = params.get('q'); // Optional direct search query

    // Reset search term if not present in URL, ensuring a "refresh" feeling when switching categories
    if (qParam) {
      setSearchTerm(qParam);
    } else {
      setSearchTerm('');
    }
  }, [location.search]);

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      {/* Scroll to top utility when navigating pages */}
      <ScrollToTop />

      {/* Global Navigation matching search criteria */}
      <Navbar onSearch={setSearchTerm} onLocationChange={setSearchLocation} />

      {/* Main content view that changes per route */}
      <main className="container" style={{ paddingBottom: '4rem', flex: 1 }}>
        <AppRoutes searchTerm={searchTerm} searchLocation={searchLocation} />
      </main>

      {/* Global application footer */}
      <Footer />

      {/* Global Toast component for resolving user actions cleanly */}
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;
