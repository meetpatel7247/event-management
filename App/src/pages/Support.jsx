import React from 'react';
import { Link } from 'react-router-dom';

const Support = () => {
    return (
        <div style={{
            minHeight: '65vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '4rem 2rem'
        }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>
                <span className="text-gradient">24/7 Support</span> Center
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px', marginBottom: '3.5rem' }}>
                We're here to help you every step of the way. Whether it's ticket issues, 
                event questions, or just saying hello, we've got you covered.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2.5rem',
                width: '100%',
                maxWidth: '1000px',
                marginBottom: '4rem'
            }}>
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Email Us</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>For detailed inquiries and complex issues.</p>
                    <a href="mailto:support@devitevent.com" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>support@devitevent.com</a>
                </div>
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Call Us</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Mon-Fri, 9am - 6pm EST for technical support.</p>
                    <a href="tel:+10000000000" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>+1 (800) EVENT-HELP</a>
                </div>
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Live Chat</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Connect with an expert agent in seconds.</p>
                    <button className="premium-button" style={{ padding: '0.8rem 1.5rem', width: 'auto' }}>Start Chat</button>
                </div>
            </div>

            <Link to="/" style={{ textDecoration: 'none' }}>
                <button className="premium-button" style={{ padding: '1rem 3rem' }}>Back to Reality</button>
            </Link>
        </div>
    );
};

export default Support;
