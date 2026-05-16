import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
    return (
        <div style={{
            minHeight: '70vh',
            padding: '6rem 2.5rem',
            maxWidth: '1100px',
            margin: '0 auto',
            width: '100%',
        }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '3.5rem' }}>
                Navigation <span className="text-gradient">Map</span>
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '3.5rem',
                width: '100%',
            }}>
                <div>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.6rem', color: '#fff' }}>Main</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '1rem' }}><Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link></li>
                        <li style={{ marginBottom: '1rem' }}><Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Login</Link></li>
                        <li style={{ marginBottom: '1rem' }}><Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Register</Link></li>
                        <li style={{ marginBottom: '1rem' }}><Link to="/my-bookings" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>My Bookings</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.6rem', color: '#fff' }}>Company</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '1rem' }}><Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Us</Link></li>
                        <li style={{ marginBottom: '1rem' }}><Link to="/careers" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Careers</Link></li>
                        <li style={{ marginBottom: '1rem' }}><Link to="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Blog</Link></li>
                        <li style={{ marginBottom: '1rem' }}><Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.6rem', color: '#fff' }}>Quick Help</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '1rem' }}><Link to="/support" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Support Center</Link></li>
                        <li style={{ marginBottom: '1rem' }}><Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Use</Link></li>
                        <li style={{ marginBottom: '1rem' }}><Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: '5rem', textAlign: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <button className="premium-button" style={{ padding: '1rem 3.5rem', width: 'auto' }}>Go Home</button>
                </Link>
            </div>
        </div>
    );
};

export default Sitemap;
