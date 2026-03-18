import React, { useState } from 'react';

const LoginForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
                <label>Email or Phone Number</label>
                <div className="input-with-icon">
                    <i className="fas fa-user"></i>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="john@example.com or 07..."
                        required
                    />
                </div>
            </div>
            <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                    <i className="fas fa-lock"></i>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>
            <div className="form-options">
                <label className="checkbox-label">
                    <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            <button 
                type="submit" 
                className="btn btn-primary btn-full login-submit-btn"
                disabled={loading}
            >
                {loading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Signing in...</>
                ) : (
                    <><i className="fas fa-sign-in-alt"></i> Sign In to AgroLink</>
                )}
            </button>
        </form>
    );
};

export default LoginForm;
