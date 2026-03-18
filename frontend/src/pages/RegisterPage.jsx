import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../redux/slices/authSlice';
import RegisterForm from '../components/auth/RegisterForm';
import './RegisterPage.css';

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async (formData) => {
        setLoading(true);
        setError('');

        try {
            const result = await dispatch(register(formData));
            if (register.fulfilled.match(result)) {
                // Redirect to dashboard or home
                navigate('/dashboard');
            } else {
                setError(result.payload?.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-card">
                    {error && (
                        <div className="alert alert-error">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <RegisterForm onSubmit={handleRegister} loading={loading} />
                </div>

                <div className="register-info">
                    <h2>Welcome to AgroLink</h2>
                    <p className="lead">Join Kenya's leading agricultural marketplace</p>

                    <div className="features">
                        <div className="feature">
                            <i className="fas fa-shopping-cart"></i>
                            <h3>Buy Fresh Produce</h3>
                            <p>Connect directly with farmers in your county</p>
                        </div>
                        <div className="feature">
                            <i className="fas fa-tractor"></i>
                            <h3>Sell Your Harvest</h3>
                            <p>Reach more customers and grow your business</p>
                        </div>
                        <div className="feature">
                            <i className="fas fa-mobile-alt"></i>
                            <h3>M-Pesa Payments</h3>
                            <p>Secure and instant mobile money transactions</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
