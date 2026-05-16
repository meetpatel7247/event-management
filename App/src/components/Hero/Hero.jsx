import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section style={{
            textAlign: 'center',
            padding: '6rem 0 4rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)',
                zIndex: -1,
                pointerEvents: 'none'
            }} />

            <motion.h1
                style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: 1.1 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                Feel the <span className="text-gradient">Vibe</span>
            </motion.h1>

            <motion.p
                style={{ color: 'var(--text-muted)', fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
            >
                Discover the most electrifying concerts, festivals, and exclusive events happening near you.
            </motion.p>

            <motion.div
                style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <button className="premium-button" style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem' }}>Explore Events</button>
                <button className="premium-button" style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem', background: 'transparent', border: '1px solid var(--primary-color)' }}>Create Event</button>
            </motion.div>
        </section>
    );
};

export default Hero;
