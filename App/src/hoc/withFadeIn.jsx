import React from 'react';
import { motion } from 'framer-motion';

/**
 * Higher-Order Component (HOC) that adds a fade-in animation
 * to the wrapped component when it renders or scrolls into view.
 * 
 * @param {React.Component} WrappedComponent - The component to be wrapped
 * @returns {React.Component} A new component with fade-in animation
 */
const withFadeIn = (WrappedComponent) => {
    const WithFadeIn = (props) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ height: '100%' }}
            >
                <WrappedComponent {...props} />
            </motion.div>
        );
    };

    // Set display name for easier debugging in React DevTools
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    WithFadeIn.displayName = `withFadeIn(${displayName})`;

    return WithFadeIn;
};

export default withFadeIn;
