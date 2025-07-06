import React from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerProfile.css";
import BottomNavigation from "./bottomNavigation";

const CustomerProfile = () => {
  const navigate = useNavigate();

  const bookingHistory = [
    { date: "July 15, 2024", service: "Emily Cleaning" },
    { date: "June 22, 2024", service: "David Plumbing" },
    { date: "May 10, 2024", service: "Michael Electrical" },
  ];

  const handleLogout = () => {
    // Add logout logic here
    console.log("User logged out");
    navigate("/customer-login");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Account</h1>
      </div>

      <div className="profile-info">
        <div className="user-details">
          <h2>Olivia Bennett</h2>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>

      <div className="divider"></div>

      <div className="booking-history">
        <h2>Booking History</h2>
        <div className="bookings-list">
          {bookingHistory.map((booking, index) => (
            <div key={index} className="booking-item">
              <div className="booking-details">
                <span className="booking-date">{booking.date}</span>
                <span className="booking-service">• {booking.service}</span>
              </div>
              <button className="rate-button">Rate</button>
            </div>
          ))}
        </div>
      </div>

      <div className="divider"></div>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      <BottomNavigation activeTab="profile" />
    </div>
  );
};

export default CustomerProfile;
