import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './workerLogin.css';

const API_BASE_URL = 'http://localhost:5000/api/auth';

const WorkerLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

    // Basic validation
    if (!loginData.phone || !loginData.password) {
      setError('Phone number and password are required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        mobile: loginData.phone,
        password: loginData.password
      });

      if (response.data.success) {
        // Store JWT token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to dashboard based on user role
        if (response.data.user.role === 'worker') {
          navigate('/worker-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="worker-login-container">
      <div className="login-card">
        <h2>Worker Login</h2>
        <p>Enter your details to access your account</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={loginData.phone}
              onChange={handleChange}
              placeholder="Enter your registered phone number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <span onClick={() => navigate('/worker-registration')}>Register</span></p>
          <p>Forgot password? <span onClick={() => navigate('/reset-password')}>Reset</span></p>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;