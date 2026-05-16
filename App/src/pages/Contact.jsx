import React, { useReducer } from 'react';
import { motion } from 'framer-motion';

/**
 * Contact Page Component
 * 
 * Provides a simple form for users to reach out with questions.
 * Uses useReducer to manage form state.
 */

const initialState = {
    name: '',
    email: '',
    message: '',
    submitted: false
};

const formReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_FIELD':
            return {
                ...state,
                [action.field]: action.value
            };
        case 'SUBMIT':
            return {
                ...state,
                submitted: true
            };
        default:
            return state;
    }
};

const Contact = () => {
    const [state, dispatch] = useReducer(formReducer, initialState);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch({ type: 'SUBMIT' });
    };

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card"
                style={{ maxWidth: '600px', margin: '0 auto' }}
            >
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Get in Touch
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Have questions or feedback? We'd love to hear from you.
                </p>
                {state.submitted ? (
                    <div style={{
                        backgroundColor: 'rgba(74, 222, 128, 0.1)',
                        border: '1px solid #4ade80',
                        color: '#4ade80',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '1.1rem'
                    }}>
                        Thank you for reaching out! We will get back to you soon.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label>
                            <input 
                                type="text" 
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-color)',
                                    color: 'white'
                                }} 
                                placeholder="Your Name" 
                                value={state.name}
                                onChange={(e) => dispatch({ type: 'CHANGE_FIELD', field: 'name', value: e.target.value })}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                            <input 
                                type="email" 
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-color)',
                                    color: 'white'
                                }} 
                                placeholder="Your Email" 
                                value={state.email}
                                onChange={(e) => dispatch({ type: 'CHANGE_FIELD', field: 'email', value: e.target.value })}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Message</label>
                            <textarea 
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-color)',
                                    color: 'white',
                                    minHeight: '120px'
                                }} 
                                placeholder="Your Message" 
                                value={state.message}
                                onChange={(e) => dispatch({ type: 'CHANGE_FIELD', field: 'message', value: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="premium-button">Send Message</button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default Contact;
