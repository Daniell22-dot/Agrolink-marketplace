import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register, logout } from '../redux/slices/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

    const handleLogin = async (credentials) => {
        try {
            await dispatch(login(credentials)).unwrap();
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    const handleRegister = async (userData) => {
        try {
            await dispatch(register(userData)).unwrap();
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return {
        user,
        loading,
        error,
        isAuthenticated,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout
    };
};
