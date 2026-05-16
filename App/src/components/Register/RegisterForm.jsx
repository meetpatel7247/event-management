import React from 'react';
import { useFormik } from 'formik';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
    role: z.enum(['user', 'organizer', 'admin']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const RegisterForm = ({ roleAvailability, onSubmit, serverError }) => {
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'user',
        },
        validateOnMount: true,
        validate: (values) => {
            try {
                registerSchema.parse(values);
                return {};
            } catch (error) {
                const formattedErrors = {};
                const fieldErrors = error.flatten().fieldErrors;
                Object.keys(fieldErrors).forEach((key) => {
                    formattedErrors[key] = fieldErrors[key].join('. ');
                });
                return formattedErrors;
            }
        },
        onSubmit: async (values, { setSubmitting }) => {
            await onSubmit(values);
            setSubmitting(false);
        },
    });

    return (
        <>
            {serverError && (
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
                    {serverError}
                </div>
            )}
            <form onSubmit={formik.handleSubmit} autoComplete="off">
                {/* Dummy fields to bait browser autofill */}
                <input type="text" style={{ display: 'none' }} name="dummy-email" />
                <input type="password" style={{ display: 'none' }} name="dummy-password" />
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
                    <input
                        className="premium-input"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        {...formik.getFieldProps('name')}
                        style={{ borderColor: formik.touched.name && formik.errors.name ? 'red' : '' }}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>{formik.errors.name}</div>
                    ) : null}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
                    <input
                        className="premium-input"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        {...formik.getFieldProps('email')}
                        style={{ borderColor: formik.touched.email && formik.errors.email ? 'red' : '' }}
                        autoComplete="off"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readOnly')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>{formik.errors.email}</div>
                    ) : null}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Role</label>
                    <select
                        className="premium-input"
                        name="role"
                        {...formik.getFieldProps('role')}
                    >
                        <option value="user">User</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin" disabled={!roleAvailability.admin}>
                            Admin {roleAvailability.admin ? '(Available)' : '(Taken)'}
                        </option>
                    </select>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        *Admin role is limited to one account. Multiple organizer accounts are supported.
                    </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
                    <input
                        className="premium-input"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        {...formik.getFieldProps('password')}
                        style={{ borderColor: formik.touched.password && formik.errors.password ? 'red' : '' }}
                        autoComplete="new-password"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readOnly')}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>{formik.errors.password}</div>
                    ) : null}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Confirm Password</label>
                    <input
                        className="premium-input"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        {...formik.getFieldProps('confirmPassword')}
                        style={{ borderColor: formik.touched.confirmPassword && formik.errors.confirmPassword ? 'red' : '' }}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                        <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>{formik.errors.confirmPassword}</div>
                    ) : null}
                </div>

                <button
                    className="premium-button"
                    type="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                    style={{ opacity: (!formik.isValid || formik.isSubmitting) ? 0.5 : 1, cursor: (!formik.isValid || formik.isSubmitting) ? 'not-allowed' : 'pointer' }}
                >
                    {formik.isSubmitting ? 'Creating Account...' : 'Get Started'}
                </button>
            </form>
        </>
    );
};

export default RegisterForm;
