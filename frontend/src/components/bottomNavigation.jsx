// components/BottomNavigation.jsx
import { useNavigate } from "react-router-dom";
import "./bottomNavigation.css"

const BottomNavigation = ({ activeTab }) => {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => navigate("/customer-screen")}
      >
        <span>🏠</span> Home
      </button>
      <button 
        className={`nav-button ${activeTab === 'bookings' ? 'active' : ''}`}
        onClick={() => navigate("/customer-bookings")}
      >
        <span>📅</span> My bookings
      </button>
      <button 
        className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => navigate("/customer-profile")}
      >
        <span>👤</span> Profile
      </button>
    </nav>
  );
};

export default BottomNavigation;