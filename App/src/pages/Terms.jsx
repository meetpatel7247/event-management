import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
    return (
        <div style={{
            minHeight: '70vh',
            padding: '6rem 2rem',
            maxWidth: '900px',
            margin: '0 auto',
            width: '100%',
        }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '2.5rem' }}>
                Terms <span className="text-gradient">of Use</span>
            </h1>
            
            <div style={{
                color: 'var(--text-muted)',
                lineHeight: '1.8',
                fontSize: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2.5rem'
            }}>
                <section>
                    <h2 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.6rem' }}>1. Introduction</h2>
                    <p>Welcome to DEVIT EVENT. By using our services, you agree to these terms...</p>
                </section>

                <section>
                    <h2 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.6rem' }}>2. Accounts</h2>
                    <p>When you create an account with us, you must provide information that is accurate...</p>
                </section>

                <section>
                    <h2 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.6rem' }}>3. IP Rights</h2>
                    <p>The Service and its original content, features, and functionality are and will remain the exclusive property of DEVIT EVENT...</p>
                </section>

                <section style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '3rem', marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ marginBottom: '2rem' }}>Last updated: March 30, 2026</p>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <button className="premium-button" style={{ padding: '1rem 3rem', width: 'auto' }}>I Understand & Agree</button>
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default Terms;
