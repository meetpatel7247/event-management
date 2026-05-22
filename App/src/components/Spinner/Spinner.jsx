import React from 'react';
import './Spinner.css';

/**
 * Spinner Component
 * 
 * A beautifully designed neon spinner matching the application's
 * dark/neon design system. Uses keyframe animations and glows.
 * 
 * @param {string} message - Optional message to show beneath the spinner.
 */
const Spinner = ({ message = 'Loading Events...' }) => {
    return (
        <div className="spinner-container">
            <div className="neon-spinner">
                <div className="ring ring-outer"></div>
                <div className="ring ring-middle"></div>
                <div className="ring ring-inner"></div>
                <div className="spinner-dot"></div>
            </div>
            {message && <p className="spinner-message">{message}</p>}
        </div>
    );
};

export default Spinner;
