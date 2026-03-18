import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [profile, setProfile] = useState({
        full_name: '', email: '', phone: '', location: '',
        county: '', sub_county: '', username: '', avatarFile: null, avatarPreview: null
    });
    const [passwords, setPasswords] = useState({
        currentPassword: '', newPassword: '', confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfile({
                full_name: user.fullName || user.full_name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                county: user.county || '',
                sub_county: user.sub_county || '',
                username: user.username || ''
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('fullName', profile.full_name);
            formData.append('email', profile.email);
            formData.append('phone', profile.phone);
            formData.append('location', profile.location);
            formData.append('county', profile.county);
            if (profile.avatarFile) {
                formData.append('avatar', profile.avatarFile);
            }

            const result = await authService.updateProfile(formData);
            dispatch(updateUser(result.data));
            toast.success('Profile updated successfully!');
            setEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await authService.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            toast.success('Password changed successfully!');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setChangingPassword(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-layout">
                    {/* Profile Sidebar */}
                    <div className="profile-sidebar">
                        <div className="profile-avatar-section">
                            <div className="profile-avatar" style={{ overflow: 'hidden', position: 'relative' }}>
                                {profile.avatarPreview || user?.avatar ? (
                                    <img src={profile.avatarPreview || user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    (user?.fullName?.charAt(0)?.toUpperCase() || user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U')
                                )}
                            </div>
                            
                            {editing && (
                                <div style={{ marginTop: '10px' }}>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setProfile({ 
                                                    ...profile, 
                                                    avatarFile: file, 
                                                    avatarPreview: URL.createObjectURL(file) 
                                                });
                                            }
                                        }} 
                                        style={{ fontSize: '12px', maxWidth: '180px' }} 
                                    />
                                </div>
                            )}

                            <h2 style={{ marginTop: '10px' }}>{user?.fullName || user?.full_name || user?.username}</h2>
                            <span className="profile-role">{user?.role === 'farmer' ? '🌾 Farmer' : '🛒 Buyer'}</span>
                            <p className="profile-location">
                                <i className="fas fa-map-marker-alt"></i> {user?.county || user?.location || 'Location Not Set'}
                            </p>
                        </div>
                        <nav className="profile-nav">
                            <button className={`nav-item ${!changingPassword ? 'active' : ''}`} onClick={() => setChangingPassword(false)}>
                                <i className="fas fa-user"></i> Profile Info
                            </button>
                            <button className={`nav-item ${changingPassword ? 'active' : ''}`} onClick={() => setChangingPassword(true)}>
                                <i className="fas fa-lock"></i> Change Password
                            </button>
                        </nav>
                    </div>

                    {/* Profile Content */}
                    <div className="profile-content">
                        {!changingPassword ? (
                            <div className="profile-card">
                                <div className="card-header">
                                    <h3><i className="fas fa-id-card"></i> Personal Information</h3>
                                    {!editing && (
                                        <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                                            <i className="fas fa-edit"></i> Edit
                                        </button>
                                    )}
                                </div>
                                {editing ? (
                                    <form onSubmit={handleProfileUpdate} className="profile-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Full Name</label>
                                                <input type="text" className="form-control" value={profile.full_name}
                                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Username</label>
                                                <input type="text" className="form-control" value={profile.username} disabled />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Email</label>
                                                <input type="email" className="form-control" value={profile.email}
                                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Phone</label>
                                                <input type="text" className="form-control" value={profile.phone}
                                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Location</label>
                                                <input type="text" className="form-control" value={profile.location}
                                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">County</label>
                                                <input type="text" className="form-control" value={profile.county}
                                                    onChange={(e) => setProfile({ ...profile, county: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="profile-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Full Name</span>
                                            <span className="detail-value">{profile.full_name || '—'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Username</span>
                                            <span className="detail-value">{profile.username || '—'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Email</span>
                                            <span className="detail-value">{profile.email || '—'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Phone</span>
                                            <span className="detail-value">{profile.phone || '—'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Location</span>
                                            <span className="detail-value">{profile.location || '—'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">County</span>
                                            <span className="detail-value">{profile.county || '—'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Account Type</span>
                                            <span className="detail-value role">{user?.role}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="profile-card">
                                <div className="card-header">
                                    <h3><i className="fas fa-key"></i> Change Password</h3>
                                </div>
                                <form onSubmit={handlePasswordChange} className="profile-form">
                                    <div className="form-group">
                                        <label className="form-label">Current Password</label>
                                        <input type="password" className="form-control" value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">New Password</label>
                                        <input type="password" className="form-control" value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Confirm New Password</label>
                                        <input type="password" className="form-control" value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required />
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            {loading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
