import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../store/authSlice';
import { authApi } from '../utils/api';
import { toast } from 'react-toastify';

/**
 * Login Page Component
 * 
 * Handles user authentication. Validates credentials against the mock API,
 * dispatches the login action to Redux, and redirects to the Home page upon success.
 */
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await authApi.login(formData.email, formData.password);
            dispatch(loginAction(data));
            toast.success(`Welcome back, ${data.name}!`);
            navigate(data.role === 'admin' ? '/admin' : data.role === 'organizer' ? '/organizer' : '/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="premium-card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to continue to your dashboard</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} autoComplete="off" name="login-form-bypass">
                    {/* Fake fields to trick browser autofill */}
                    <input type="text" style={{ display: 'none' }} name="fake-email-bypass" />
                    <input type="password" style={{ display: 'none' }} name="fake-password-bypass" />

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
                        <input
                            className="premium-input"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                            readOnly
                            onFocus={(e) => {
                                e.target.removeAttribute('readOnly');
                                e.target.setAttribute('autoComplete', 'off');
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
                        <input
                            className="premium-input"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                            readOnly
                            onFocus={(e) => {
                                e.target.removeAttribute('readOnly');
                                e.target.setAttribute('autoComplete', 'new-password');
                            }}
                        />
                    </div>

                    <button className="premium-button" type="submit">
                        Sign In
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
