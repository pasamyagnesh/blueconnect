

import { useNavigate } from 'react-router-dom';
import "./roleSelection.css";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="role-selection">
      <h1>How would you like to use our service?</h1>
      <p>
        Join thousands of satisfied users and professionals in our growing
        community
      </p>

      <div className="role-cards">
        <div className="role-card" onClick={() => navigate('/worker-registration')}>
          <div className="role-icon">👨‍🔧</div>
          <h2>I'm a Service Provider</h2>
          <p>Get more customers daily and grow your business</p>
          <ul>
            <li>✓ Get verified and trusted by customers</li>
            <li>✓ Receive work requests near you</li>
            <li>✓ Manage all jobs in one place</li>
          </ul>
          <button className="role-button">Continue as Provider</button>
        </div>

        <div className="role-card" onClick={() => navigate('/customer-registration')}>
          <div className="role-icon">👨‍💼</div>
          <h2>I Need a Service</h2>
          <p>Find reliable professionals in minutes</p>
          <ul>
            <li>✓ Verified and background-checked pros</li>
            <li>✓ Real-time job tracking</li>
            <li>✓ Secure payments and satisfaction guarantee</li>
          </ul>
          <button className="role-button">Continue as Customer</button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;