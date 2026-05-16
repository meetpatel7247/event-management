import React from 'react';
import { Link } from 'react-router-dom';

const GiftCards = () => {
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
            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>
                Give the Gift of <span className="text-gradient">Experiences</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', maxWidth: '850px', marginBottom: '4.5rem' }}>
                Perfect for any occasion, our gift cards let your friends and family choose their 
                favorite live shows, concerts, and more.
            </p>

            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '35px',
                padding: '4rem',
                maxWidth: '600px',
                width: '100%',
                backdropFilter: 'blur(15px)',
                marginBottom: '4rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    background: 'var(--primary-gradient)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    opacity: 0.5
                }}></div>
                <h3 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Gift Card Store Coming Soon</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
                    We're finishing the final touches on our new digital gift card platform. 
                    Be the first to know when we launch!
                </p>
                <button className="premium-button" style={{ width: 'auto', padding: '1rem 2.5rem' }}>Notify Me</button>
            </div>

            <Link to="/" style={{ textDecoration: 'none' }}>
                <button className="premium-button" style={{ padding: '1.2rem 4rem' }}>Back to Home</button>
            </Link>
        </div>
    );
};

export default GiftCards;
