import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import LoginForm from '../components/auth/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (formData) => {
        setLoading(true);
        setError('');

        try {
            const result = await dispatch(login(formData));
            if (login.fulfilled.match(result)) {
                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                setError(result.payload?.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to access your AgroLink account</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <LoginForm onSubmit={handleLogin} loading={loading} />

                    <div className="login-footer">
                        <p>Don't have an account? <Link to="/register">Register here</Link></p>
                    </div>
                </div>

                <div className="login-bg">
                    <div className="login-overlay">
                        <h2>AgroLink</h2>
                        <p className="tagline">Connecting Farmers to Markets & Services</p>
                        <div className="stats">
                            <div className="stat">
                                <h3>10,000+</h3>
                                <p>Active Farmers</p>
                            </div>
                            <div className="stat">
                                <h3>50,000+</h3>
                                <p>Happy Customers</p>
                            </div>
                            <div className="stat">
                                <h3>47</h3>
                                <p>Counties Covered</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
