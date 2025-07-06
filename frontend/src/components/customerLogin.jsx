import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CustomerLogin.css';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    name: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!loginData.phone || !loginData.password) {
      setError('Phone number and password are required');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login data:', loginData);
      navigate('/customer-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="customer-login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <p>Login to access your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group floating">
            <input
              type="text"
              id="name"
              name="name"
              value={loginData.name}
              onChange={handleChange}
              placeholder=" "
              autoComplete="name"
            />
            <label htmlFor="name">Full Name</label>
            <span className="input-icon">👤</span>
          </div>

          <div className="form-group floating">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={loginData.phone}
              onChange={handleChange}
              placeholder=" "
              required
              autoComplete="tel"
            />
            <label htmlFor="phone">Phone Number</label>
            <span className="input-icon">📱</span>
          </div>

          <div className="form-group floating">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder=" "
              required
              autoComplete="current-password"
            />
            <label htmlFor="password">Password</label>
            <span className="input-icon">🔒</span>
            <button 
              type="button" 
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/customer-registration">Create Account</Link></p>
        </div>
      </div>

      <div className="login-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
};

export default CustomerLogin;