import React from 'react';
import { Link } from 'react-router-dom';

const Careers = () => {
    return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1 style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                marginBottom: '1rem',
                letterSpacing: '-2px'
            }}>
                Level Up Your <span className="text-gradient">Career</span>
            </h1>
            <p style={{
                color: 'var(--text-muted)',
                fontSize: '1.25rem',
                maxWidth: '700px',
                lineHeight: '1.6',
                marginBottom: '2.5rem'
            }}>
                Join our mission to revolutionize the event management industry. 
                Our team is currently busy building the future, but we're always looking for 
                talented individuals who are ready to make some noise.
            </p>
            
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
                borderRadius: '24px',
                padding: '3rem',
                maxWidth: '800px',
                width: '100%',
                backdropFilter: 'blur(10px)',
                marginBottom: '3rem'
            }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>No open positions right now.</h3>
                <p style={{ color: 'var(--text-muted)' }}>
                    Check back later or send your resume to careers@devitevent.com
                </p>
            </div>

            <Link to="/" style={{ textDecoration: 'none' }}>
                <button className="premium-button" style={{ padding: '1rem 2.5rem' }}>Back to Reality</button>
            </Link>
        </div>
    );
};

export default Careers;
