import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import styles from './Navbar.module.css';

import NavLogo from './NavLogo';
import NavSearch from './NavSearch';
import SidebarMenu from './SidebarMenu';

/**
 * Global Navigation Bar Component.
 * 
 * Includes branding, a global search input feature, and a responsive hamburger
 * menu for mobile and desktop linking to main platform sections.
 */
const Navbar = ({ onSearch, onLocationChange }) => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = () => {
        dispatch(logout());
        closeMenu();
        navigate('/');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.topRow}>
                <NavLogo />
                <NavSearch onSearch={onSearch} onLocationChange={onLocationChange} />

                <div className={styles.actions}>
                    {user && (
                        <Link to="/my-bookings" className={styles.navLink}>
                            Bookings
                        </Link>
                    )}
                    <button className={styles.hamburgerBtn} onClick={toggleMenu}>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path></svg>
                    </button>
                </div>
            </div>

            <SidebarMenu
                isMenuOpen={isMenuOpen}
                closeMenu={closeMenu}
                user={user}
                handleLogout={handleLogout}
            />
        </nav>
    );
};

export default Navbar;
