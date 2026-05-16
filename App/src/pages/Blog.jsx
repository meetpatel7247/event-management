import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
    return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '4rem 2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1.5rem' }}>
                Event <span className="text-gradient">Insights</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', maxWidth: '800px', marginBottom: '4rem' }}>
                Explore the latest trends in live entertainment, ticketing technologies, and the coolest events happening near you.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2.5rem',
                width: '100%',
                marginBottom: '4rem'
            }}>
                <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.6rem' }}>Coming Soon...</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        The official DEVIT EVENT blog is currently under development. 
                        We're curating some amazing stories to share with you!
                    </p>
                </div>
            </div>

            <Link to="/" style={{ textDecoration: 'none' }}>
                <button className="premium-button" style={{ padding: '1rem 3rem' }}>Back to Reality</button>
            </Link>
        </div>
    );
};

export default Blog;
