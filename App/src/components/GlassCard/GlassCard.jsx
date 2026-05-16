import React from 'react';
import { motion } from 'framer-motion';
import styles from './GlassCard.module.css';

const GlassCard = ({ children, className = '', hoverEffect = true, ...props }) => {
    return (
        <motion.div
            className={`${styles.card} ${className}`}
            whileHover={hoverEffect ? { y: -5, boxShadow: '0 10px 30px rgba(0, 243, 255, 0.1)' } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
