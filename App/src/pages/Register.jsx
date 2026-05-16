import React, { useEffect, useState } from 'react';
import { authApi } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction } from '../store/authSlice';
import { toast } from 'react-toastify';
import RegisterForm from '../components/Register/RegisterForm';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [error, setError] = useState('');
    const [roleAvailability, setRoleAvailability] = useState({ admin: false, organizer: false });

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    useEffect(() => {
        const checkRoles = async () => {
            try { 
                const availability = await authApi.getRoleAvailability();
                setRoleAvailability(availability); 
            }
            catch (err) { 
                console.error(err);
                toast.error("Failed to check role availability"); 
            }
        };
        checkRoles();
    }, []);

    const handleFormSubmit = async (values) => {
        setError('');
        try {
            const data = await authApi.register({
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.role
            });

            dispatch(loginAction(data));
            toast.success('Registration successful!');
            navigate('/');
        } catch (error) {
            const msg = error.response?.data?.message || 'Registration failed';
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="premium-card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join us to experience the best events</p>
                </div>

                <RegisterForm
                    roleAvailability={roleAvailability}
                    onSubmit={handleFormSubmit}
                    serverError={error}
                />

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
