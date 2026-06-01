import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as logoutAction, login as loginAction } from './store/authSlice';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * App Component
 * 
 * The root component of the application. Handles top-level global layout, 
 * search state, and global components like the Navbar, Footer, and Toast notifications.
 */
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Global search state passed down to routing components
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const location = useLocation();

  // Synchronize localStorage session to sessionStorage on mount for tab restoration
  useEffect(() => {
    const localUser = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');
    if (localUser && !sessionUser) {
      sessionStorage.setItem('user', localUser);
    }
  }, []);

  // Listen for 401 Unauthorized API logouts
  useEffect(() => {
    const handleAuthLogout = () => {
      dispatch(logoutAction());
      toast.error('Session expired or invalid. Please login again.');
      navigate('/login');
    };
    window.addEventListener('auth-logout', handleAuthLogout);
    return () => window.removeEventListener('auth-logout', handleAuthLogout);
  }, [dispatch, navigate]);

  // Cross-tab single session role enforcement
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null;
        const currentUser = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

        if (!newUser) {
          if (currentUser) {
            dispatch(logoutAction());
            sessionStorage.removeItem('user');
            toast.info('Session logged out from another tab.');
            navigate('/login');
          }
        } else if (!currentUser || currentUser._id !== newUser._id || currentUser.role !== newUser.role) {
          dispatch(logoutAction());
          sessionStorage.setItem('user', JSON.stringify(newUser));
          dispatch(loginAction(newUser));
          toast.info(`Session role switched to ${newUser.role}.`);
          navigate(newUser.role === 'admin' ? '/admin' : newUser.role === 'organizer' ? '/organizer' : '/');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch, navigate]);

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

  const isHomePage = location.pathname === '/';
  const isEventDetailsPage = location.pathname.startsWith('/event/');
  const isAdminPage = location.pathname.startsWith('/admin');
  const isOrganizerPage = location.pathname.startsWith('/organizer');
  const useCompactPadding = isHomePage || isEventDetailsPage || isAdminPage || isOrganizerPage;

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      {/* Scroll to top utility when navigating pages */}
      <ScrollToTop />

      {/* Global Navigation matching search criteria */}
      <Navbar onSearch={setSearchTerm} onLocationChange={setSearchLocation} />

      {/* Main content view that changes per route */}
      <main className={`container ${useCompactPadding ? 'home-page-container' : ''}`} style={{ paddingBottom: isHomePage ? '0' : '4rem', flex: 1 }}>
        <AppRoutes searchTerm={searchTerm} searchLocation={searchLocation} />
      </main>

      {/* Global application footer */}
      <Footer />

      {/* Global Toast component for resolving user actions cleanly */}
      <ToastContainer position="bottom-right" theme="dark" limit={1} />
    </div>
  );
}

export default App;
