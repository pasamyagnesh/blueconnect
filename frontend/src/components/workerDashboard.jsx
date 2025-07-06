import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WorkerDashboard.css";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [workerData, setWorkerData] = useState({
    name: "Rajesh Kumar",
    profession: "Electrician",
    phone: "+91 9876543210",
    address: "123 Worker Street, Bangalore",
    rating: 4.8,
    experience: "5 years",
    photo: "https://via.placeholder.com/150",
  });

  // Sample data - replace with actual API calls
  const [requests, setRequests] = useState([
    {
      id: 1,
      customer: "Amit Patel",
      service: "Wiring Repair",
      date: "Today 10:30 AM",
      location: "2 km away",
    },
    {
      id: 2,
      customer: "Priya Sharma",
      service: "Switch Installation",
      date: "Today 2:00 PM",
      location: "5 km away",
    },
  ]);

  const [history, setHistory] = useState([
    {
      id: 1,
      customer: "Neha Gupta",
      service: "Fuse Replacement",
      date: "July 15, 2023",
      status: "Completed",
      rating: 5,
    },
    {
      id: 2,
      customer: "Vikram Singh",
      service: "Light Fixture",
      date: "July 10, 2023",
      status: "Completed",
      rating: 4,
    },
  ]);

  // Fetch worker data from backend (example)
  useEffect(() => {
    // Replace with actual API call
    // fetchWorkerData().then(data => setWorkerData(data));
  }, []);

  const handleAcceptRequest = (requestId) => {
    // API call to accept request
    console.log("Accepted request:", requestId);
    setRequests(requests.filter((req) => req.id !== requestId));
  };

  const handleRejectRequest = (requestId) => {
    // API call to reject request
    console.log("Rejected request:", requestId);
    setRequests(requests.filter((req) => req.id !== requestId));
  };

  const handleLogout = () => {
    // Handle logout logic
    navigate("/worker-login");
  };

  return (
    <div className="worker-dashboard">
      {/* Left Sidebar */}
      <div className="sidebar">
        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-image-container">
            <img
              src={workerData.photo}
              alt="Profile"
              className="profile-image"
            />
          </div>
          <h2>{workerData.name}</h2>
          <p className="profession">{workerData.profession}</p>
          <div className="rating">
            <span>★ {workerData.rating}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="dashboard-nav">
          <button
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}>
            Profile
          </button>
          <button
            className={`nav-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}>
            Home (Requests)
          </button>
          <button
            className={`nav-item ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}>
            History
          </button>
          <button className="nav-item logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === "profile" && (
          <div className="profile-details">
            <h2>Profile Details</h2>
            <div className="detail-item">
              <span className="label">Name:</span>
              <span className="value">{workerData.name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Profession:</span>
              <span className="value">{workerData.profession}</span>
            </div>
            <div className="detail-item">
              <span className="label">Phone:</span>
              <span className="value">{workerData.phone}</span>
            </div>
            <div className="detail-item">
              <span className="label">Address:</span>
              <span className="value">{workerData.address}</span>
            </div>
            <div className="detail-item">
              <span className="label">Experience:</span>
              <span className="value">{workerData.experience}</span>
            </div>
            <button className="edit-profile-btn">Edit Profile</button>
          </div>
        )}

        {activeTab === "home" && (
          <div className="requests-container">
            <h2>New Service Requests</h2>
            {requests.length > 0 ? (
              <div className="requests-list">
                {requests.map((request) => (
                  <div key={request.id} className="request-card">
                    <div className="request-info">
                      <h3>{request.customer}</h3>
                      <p className="service">{request.service}</p>
                      <p className="date-location">
                        <span>{request.date}</span>
                        <span>•</span>
                        <span>{request.location}</span>
                      </p>
                    </div>
                    <div className="request-actions">
                      <button
                        className="accept-btn"
                        onClick={() => handleAcceptRequest(request.id)}>
                        Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleRejectRequest(request.id)}>
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-requests">No new service requests available</p>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="history-container">
            <h2>Service History</h2>
            {history.length > 0 ? (
              <div className="history-list">
                {history.map((job) => (
                  <div key={job.id} className="history-card">
                    <div className="job-info">
                      <h3>{job.customer}</h3>
                      <p className="service">{job.service}</p>
                      <p className="date">{job.date}</p>
                      <p className="status">{job.status}</p>
                    </div>
                    <div className="job-rating">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={i < job.rating ? "star filled" : "star"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-history">No service history available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
