import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
    return (
        <div style={{
            minHeight: '70vh',
            padding: '6rem 2rem',
            maxWidth: '1000px',
            margin: '0 auto',
            width: '100%',
        }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '2.5rem' }}>
                Privacy <span className="text-gradient">Policy</span>
            </h1>

            <div style={{
                color: 'var(--text-muted)',
                lineHeight: '1.8',
                fontSize: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '3rem'
            }}>
                <section>
                    <h2 style={{ color: '#fff', marginBottom: '1.2rem', fontSize: '1.8rem' }}>1. Data Collection</h2>
                    <p>We collect information you provide directly to us when you create an account, register for events, or communicate with us.</p>
                </section>

                <section>
                    <h2 style={{ color: '#fff', marginBottom: '1.2rem', fontSize: '1.8rem' }}>2. Data Usage</h2>
                    <p>We use the information we collect to provide, maintain, and improve our services, and to protect our users.</p>
                </section>

                <section>
                    <h2 style={{ color: '#fff', marginBottom: '1.2rem', fontSize: '1.8rem' }}>3. Data Protection</h2>
                    <p>We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorized access.</p>
                </section>

                <section style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '4rem', marginTop: '3rem', textAlign: 'center' }}>
                    <p style={{ marginBottom: '2.5rem' }}>Your privacy is our priority. Last updated March 30, 2026.</p>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <button className="premium-button" style={{ padding: '1.2rem 3.5rem', width: 'auto' }}>Go Back</button>
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default Privacy;
