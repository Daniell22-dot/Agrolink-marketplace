import React, { useState, useEffect } from 'react';
import geolocationService from '../../services/geolocationService';

const RegisterForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        nationalId: '',
        username: '',
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'buyer',
        latitude: null,
        longitude: null,
        county: '',
        location: ''
    });

    const [locationLoading, setLocationLoading] = useState(false);
    const [locationDetected, setLocationDetected] = useState(false);

    // Auto-detect location on component mount
    useEffect(() => {
        detectLocation();
    }, []);

    const detectLocation = async () => {
        setLocationLoading(true);
        try {
            const position = await geolocationService.getCurrentPosition();
            setFormData(prev => ({
                ...prev,
                latitude: position.latitude,
                longitude: position.longitude,
                county: position.county || '',
                location: position.location || ''
            }));
            setLocationDetected(true);
        } catch (error) {
            console.error('Location detection failed:', error);
        } finally {
            setLocationLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Validate National ID (Kenyan format: 8 digits)
        if (!/^\d{7,8}$/.test(formData.nationalId)) {
            alert('Please enter a valid Kenyan National ID (7-8 digits)');
            return;
        }

        // Validate phone (Kenyan format)
        if (!/^(\+254|254|0)[17]\d{8}$/.test(formData.phone)) {
            alert('Please enter a valid Kenyan phone number');
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <h2>Create Your Account</h2>
            <p className="subtitle">Join AgroLink - Connecting Farmers to Markets</p>

            {/* National ID */}
            <div className="form-group">
                <label htmlFor="nationalId">
                    <i className="fas fa-id-card"></i> National ID *
                </label>
                <input
                    type="text"
                    id="nationalId"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleChange}
                    placeholder="Enter your National ID"
                    required
                    maxLength="8"
                />
                <small>Kenyan National ID (7-8 digits)</small>
            </div>

            {/* Username */}
            <div className="form-group">
                <label htmlFor="username">
                    <i className="fas fa-user"></i> Username *
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a unique username"
                    required
                    minLength="3"
                    maxLength="50"
                />
            </div>

            {/* Full Name */}
            <div className="form-group">
                <label htmlFor="fullName">
                    <i className="fas fa-user-circle"></i> Full Name *
                </label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                />
            </div>

            {/* Email */}
            <div className="form-group">
                <label htmlFor="email">
                    <i className="fas fa-envelope"></i> Email *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                />
            </div>

            {/* Phone */}
            <div className="form-group">
                <label htmlFor="phone">
                    <i className="fas fa-phone"></i> Phone Number *
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0712345678 or +254712345678"
                    required
                />
                <small>Kenyan phone number</small>
            </div>

            {/* Role */}
            <div className="form-group">
                <label htmlFor="role">
                    <i className="fas fa-briefcase"></i> I am a *
                </label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    <option value="buyer">Buyer</option>
                    <option value="farmer">Farmer</option>
                </select>
            </div>

            {/* Location Auto-Detection */}
            <div className="form-group location-group">
                <label>
                    <i className="fas fa-map-marker-alt"></i> Location
                </label>
                {locationLoading ? (
                    <div className="location-status loading">
                        <i className="fas fa-spinner fa-spin"></i> Detecting your location...
                    </div>
                ) : locationDetected ? (
                    <div className="location-status detected">
                        <i className="fas fa-check-circle"></i> Location detected: {formData.county || 'Unknown'}
                        <button
                            type="button"
                            onClick={detectLocation}
                            className="btn-link"
                        >
                            Refresh
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={detectLocation}
                        className="btn btn-secondary"
                    >
                        <i className="fas fa-location-arrow"></i> Detect My Location
                    </button>
                )}
                <small>We'll use your location to show you nearby products</small>
            </div>

            {/* Password */}
            <div className="form-group">
                <label htmlFor="password">
                    <i className="fas fa-lock"></i> Password *
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter a strong password"
                    required
                    minLength="6"
                />
                <small>At least 6 characters, include uppercase, lowercase, and numbers</small>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
                <label htmlFor="confirmPassword">
                    <i className="fas fa-lock"></i> Confirm Password *
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    required
                />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? (
                    <>
                        <i className="fas fa-spinner fa-spin"></i> Creating Account...
                    </>
                ) : (
                    <>
                        <i className="fas fa-user-plus"></i> Register
                    </>
                )}
            </button>

            <p className="text-center mt-3">
                Already have an account? <a href="/login">Login here</a>
            </p>
        </form>
    );
};

export default RegisterForm;
