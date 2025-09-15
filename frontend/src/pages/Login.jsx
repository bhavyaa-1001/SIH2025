import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const { login, googleLogin, loading, error, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      // Error is handled by the AuthContext
    }
  };

  return (
    <motion.div 
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="auth-form-container">
        <h2>Login</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? 'error' : ''}
            />
            {formErrors.email && <span className="error-message">{formErrors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={formErrors.password ? 'error' : ''}
            />
            {formErrors.password && <span className="error-message">{formErrors.password}</span>}
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="auth-separator">
            <span>OR</span>
          </div>
          
          <div className="google-login-container">
            <GoogleOAuthProvider 
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} 
              onScriptLoadError={(err) => console.error('Google script load error:', err)}
              options={{
                use_fedcm_for_prompt: false // Disable FedCM to fix AbortError
              }}
            >
              <GoogleLogin
                useOneTap
                context="signin"
                cancel_on_tap_outside={true}
                onSuccess={async (credentialResponse) => {
                  try {
                    await googleLogin(credentialResponse.credential);
                    navigate('/dashboard');
                  } catch (err) {
                    console.error('Google login error:', err);
                  }
                }}
                onError={(error) => {
                  console.error('Login Failed:', error);
                }}
                theme="filled_blue"
                text="signin_with"
                shape="rectangular"
                logo_alignment="center"
                width="100%"
              />
            </GoogleOAuthProvider>
          </div>
        </form>
        
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;