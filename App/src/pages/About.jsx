import React from 'react';
import { motion } from 'framer-motion';

/**
 * About Page Component
 * 
 * Simple static page presenting company mission, vision, and branding.
 */
const About = () => {
    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card"
                style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
            >
                <h1 className="text-gradient" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                    About DEVIT EVENT
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                    DEVIT EVENT is your premium destination for the best live experiences. From blockbuster concerts and pulse-pounding sports events to laugh-out-loud comedy shows and immersive workshops, we bring world-class entertainment right to your fingertips.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                    <div>
                        <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Our Mission</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>To connect people with experiences that inspire, entertain, and create lasting memories.</p>
                    </div>
                    <div>
                        <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Our Vision</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>To be the global leader in event discovery and ticket booking, powered by innovation and a passion for live events.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
