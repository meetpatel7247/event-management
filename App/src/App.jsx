import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as logoutAction, login as loginAction } from './store/authSlice';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

/**
 * App Component
 * 
 * The root component of the application. Handles top-level global layout, 
 * search state, and global components like the Navbar, Footer, and Toast notifications.
 */
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Multi-tab single active session detector
  const [isDuplicate, setIsDuplicate] = useState(false);
  const tabId = useMemo(() => Math.random().toString(36).substring(2, 9), []);
  const isDuplicateRef = useRef(false);

  // Keep ref updated to always refer to the latest duplication state in listeners
  useEffect(() => {
    isDuplicateRef.current = isDuplicate;
  }, [isDuplicate]);

  // BroadcastChannel for cross-tab communication
  useEffect(() => {
    const channel = new BroadcastChannel('event_management_session_channel');
    let pingTimeout;

    const handleMessage = (event) => {
      const { type, senderTabId } = event.data || {};
      if (senderTabId === tabId) return;

      if (type === 'ping') {
        // If we are currently active (not duplicate), reply with pong
        if (!isDuplicateRef.current) {
          channel.postMessage({ type: 'pong', senderTabId: tabId });
        }
      } else if (type === 'pong') {
        // If we receive a pong, another tab is active; mark this as duplicate
        clearTimeout(pingTimeout);
        setIsDuplicate(true);
      } else if (type === 'claim_active') {
        // Another tab has claimed active status; this tab must surrender and block
        if (!isDuplicateRef.current) {
          setIsDuplicate(true);
        }
      }
    };

    channel.addEventListener('message', handleMessage);

    // Initial check: broadcast ping to locate any active tab
    channel.postMessage({ type: 'ping', senderTabId: tabId });
    pingTimeout = setTimeout(() => {
      // If no other tab replied, this tab is primary and remains unblocked
      setIsDuplicate(false);
    }, 250);

    return () => {
      clearTimeout(pingTimeout);
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [tabId]);

  // Broadcast unload event to allow other duplicate tabs to take over when closed
  useEffect(() => {
    const handleUnload = () => {
      if (!isDuplicateRef.current) {
        const channel = new BroadcastChannel('event_management_session_channel');
        channel.postMessage({ type: 'claim_active', senderTabId: tabId });
        channel.close();
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [tabId]);

  // Function to switch active status to this tab
  const claimActive = () => {
    const channel = new BroadcastChannel('event_management_session_channel');
    channel.postMessage({ type: 'claim_active', senderTabId: tabId });
    channel.close();
    setIsDuplicate(false);
  };

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

  if (isDuplicate) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(circle at center, #0a0a16 0%, #030308 100%)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Outfit', 'Inter', sans-serif",
          color: '#e0faff',
          padding: '20px',
        }}
      >
        <div 
          style={{
            background: 'rgba(10, 10, 15, 0.85)',
            border: '1px solid rgba(0, 243, 255, 0.25)',
            borderRadius: '24px',
            padding: '3.5rem 2.5rem',
            maxWidth: '540px',
            width: '100%',
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 243, 255, 0.15), 0 0 50px rgba(188, 19, 254, 0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Animated glow background elements */}
          <div 
            style={{
              position: 'absolute',
              top: '-10%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '150px',
              height: '150px',
              background: 'rgba(0, 243, 255, 0.15)',
              filter: 'blur(50px)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '-10%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '150px',
              height: '150px',
              background: 'rgba(188, 19, 254, 0.1)',
              filter: 'blur(50px)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />

          {/* Glowing Warning Icon with micro-animation */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(0, 243, 255, 0.08)',
              border: '1px solid rgba(0, 243, 255, 0.35)',
              boxShadow: '0 0 20px rgba(0, 243, 255, 0.15)',
              marginBottom: '2rem',
              animation: 'pulseGlow 2s infinite ease-in-out',
            }}
          >
            <FiAlertTriangle size={36} color="#00f3ff" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 243, 255, 0.8))' }} />
          </div>

          <style>
            {`
              @keyframes pulseGlow {
                0% { transform: scale(1); box-shadow: 0 0 20px rgba(0, 243, 255, 0.15); border-color: rgba(0, 243, 255, 0.35); }
                50% { transform: scale(1.05); box-shadow: 0 0 35px rgba(0, 243, 255, 0.35); border-color: rgba(0, 243, 255, 0.7); }
                100% { transform: scale(1); box-shadow: 0 0 20px rgba(0, 243, 255, 0.15); border-color: rgba(0, 243, 255, 0.35); }
              }
              .activate-btn {
                background: linear-gradient(135deg, #00f3ff 0%, #bc13fe 100%);
                color: #050505;
                font-weight: 700;
                font-family: inherit;
                border: none;
                padding: 1rem 2.2rem;
                font-size: 1.05rem;
                border-radius: 12px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 0.75rem;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
                text-transform: uppercase;
                letter-spacing: 1px;
              }
              .activate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 0 25px rgba(0, 243, 255, 0.7), 0 0 35px rgba(188, 19, 254, 0.4);
                color: #ffffff;
              }
              .activate-btn:active {
                transform: translateY(0);
              }
            `}
          </style>

          <h2 
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#00f3ff',
              textShadow: '0 0 15px rgba(0, 243, 255, 0.6)',
              marginBottom: '1.25rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            Multiple Tabs Detected
          </h2>

          <p 
            style={{
              color: '#8b9bb4',
              fontSize: '1.05rem',
              lineHeight: '1.7',
              marginBottom: '2.5rem',
            }}
          >
            To ensure session security, data consistency, and a seamless booking experience, this application can only be active in one tab at a time.
            <br />
            <span style={{ color: '#00f3ff', marginTop: '0.75rem', display: 'block', fontWeight: 500 }}>
              Would you like to activate this tab and use the app here instead?
            </span>
          </p>

          <button className="activate-btn" onClick={claimActive}>
            <span>Use Tab Here</span>
            <FiArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

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
