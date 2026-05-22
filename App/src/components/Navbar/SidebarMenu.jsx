import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import styles from './SidebarMenu.module.css';

const SidebarMenu = ({ isMenuOpen, closeMenu, user, handleLogout }) => {
    const location = useLocation();

    return (
        <>
            <div className={`${styles.sidebarOverlay} ${isMenuOpen ? styles.open : ''}`} onClick={closeMenu}></div>

            <div className={`${styles.sidebar} ${isMenuOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <span className={styles.menuTitle}>MENU</span>
                    <button className={styles.closeBtn} onClick={closeMenu}>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"></path></svg>
                    </button>
                </div>

                {user && (
                    <div className={styles.userSection}>
                        <span className={styles.userName}>Hi, {user.name || 'User'}</span>
                        <span className={styles.userRole}>{user.role}</span>
                    </div>
                )}

                <div className={styles.sidebarContent}>
                    <NavLink to="/" onClick={closeMenu} className={({ isActive }) => `${styles.sidebarLink} ${isActive && !location.search ? styles.active : ''}`}>Home</NavLink>
                    <NavLink to="/?view=all" onClick={closeMenu} className={() => `${styles.sidebarLink} ${location.search.includes('view=all') ? styles.active : ''}`}>Events</NavLink>

                    {user && user.role === 'organizer' && (
                        <NavLink to="/organizer" onClick={closeMenu} className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ''}`}>Organizer Dashboard</NavLink>
                    )}
                    {user && user.role === 'admin' && (
                        <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ''}`}>Admin Dashboard</NavLink>
                    )}

                    <NavLink to="/wishlist" onClick={closeMenu} className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ''}`}>Wishlist</NavLink>
                    {user && (
                        <NavLink to="/my-bookings" onClick={closeMenu} className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ''}`}>My Bookings</NavLink>
                    )}
                    <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ''}`}>About</NavLink>
                    <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => `${styles.sidebarLink} ${isActive ? styles.active : ''}`}>Contact</NavLink>
                </div>

                <div className={styles.actionButtons}>
                    {user ? (
                        <button className="premium-button" onClick={handleLogout} style={{ marginTop: '2rem' }}>
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" onClick={closeMenu} style={{ textDecoration: 'none' }}>
                                <button className="premium-button" style={{ background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}>Sign In</button>
                            </Link>
                            <Link to="/register" onClick={closeMenu} style={{ textDecoration: 'none' }}>
                                <button className="premium-button">Register</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default SidebarMenu;
