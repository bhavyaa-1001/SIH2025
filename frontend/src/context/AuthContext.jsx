import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      const data = response.data;
      
      // Save user to state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      const data = response.data;
      
      // Save user to state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  // Google Login
  const googleLogin = async (credential) => {
    setLoading(true);
    setError(null);
    try {
      // Decode the credential to get user info
      const decodedToken = jwtDecode(credential);
      
      // In a real app, you would send this token to your backend
      // const response = await authService.googleLogin({ token: credential });
      // const data = response.data;
      
      // For demo purposes, we'll create a user object from the decoded token
      const userData = {
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
        token: credential
      };
      
      // Save user to state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', credential);
      
      setLoading(false);
      return userData;
    } catch (err) {
      setError('Google login failed');
      setLoading(false);
      throw err;
    }
  };
  // Logout user
  const logout = () => {
    // Remove user from state and localStorage
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(userData);
      const data = response.data;
      
      // Update user in state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      setLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        googleLogin,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};