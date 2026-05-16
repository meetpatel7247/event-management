import React from 'react';
import { Link } from 'react-router-dom';

const ListEvent = () => {
    return (
        <div style={{
            minHeight: '75vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '4rem 2rem'
        }}>
            <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1.5rem' }}>
                Join the <span className="text-gradient">Creator Economy</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', maxWidth: '850px', marginBottom: '4rem' }}>
                Whether it's a music festival, a local play, or a corporate conference, DEVIT EVENT provides you with the professional tools you need to reach your audience and sell out fast.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '3rem',
                width: '100%',
                maxWidth: '1200px',
                marginBottom: '5rem'
            }}>
                <div className="glass-card" style={{ padding: '3.5rem' }}>
                    <h3 style={{ marginBottom: '1.2rem', fontSize: '1.8rem' }}>Professional Sell</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Advanced ticketing, secure payments, and QR check-ins for events of all sizes.</p>
                    <button className="premium-button" style={{ padding: '1rem 2rem', width: 'auto' }}>Get Started</button>
                </div>
                <div className="glass-card" style={{ padding: '3.5rem' }}>
                    <h3 style={{ marginBottom: '1.2rem', fontSize: '1.8rem' }}>Easy Setup</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Go live in minutes with our intuitive dashboard and real-time analytics.</p>
                    <button className="premium-button" style={{ padding: '1rem 2rem', width: 'auto' }}>Learn More</button>
                </div>
            </div>

            <Link to="/" style={{ textDecoration: 'none' }}>
                <button className="premium-button" style={{ padding: '1.2rem 4rem' }}>Back to Browsing</button>
            </Link>
        </div>
    );
};

export default ListEvent;
