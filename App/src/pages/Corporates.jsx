import React from 'react';
import { Link } from 'react-router-dom';

const Corporates = () => {
    return (
        <div style={{
            minHeight: '75vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '4rem 2.5rem'
        }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-1.5px' }}>
                Corporate <span className="text-gradient">Ticketing Solutions</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', maxWidth: '850px', marginBottom: '4.5rem', lineHeight: '1.7' }}>
                Unlock exclusive corporate perks, bulk booking discounts, and tailored event experiences for your entire workforce.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '3rem',
                width: '100%',
                maxWidth: '1200px',
                marginBottom: '5rem'
            }}>
                <div className="glass-card" style={{ padding: '3rem' }}>
                    <h3 style={{ marginBottom: '1.2rem', fontSize: '1.8rem' }}>Bulk Bookings</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Special rates for companies and organizations booking multiple events at once.</p>
                </div>
                <div className="glass-card" style={{ padding: '3rem' }}>
                    <h3 style={{ marginBottom: '1.2rem', fontSize: '1.8rem' }}>Tailored Events</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Bespoke event planning and management for high-profile business gatherings.</p>
                </div>
            </div>

            <Link to="/" style={{ textDecoration: 'none' }}>
                <button className="premium-button" style={{ padding: '1rem 3.5rem' }}>Explore Options</button>
            </Link>
        </div>
    );
};

export default Corporates;
