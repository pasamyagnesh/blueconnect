import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "./bottomNavigation";
import "./CustomerScreen.css";

const CustomerScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  // Sample data for services
  const suggestedServices = [
    { id: 1, name: "AC Mechanic", icon: "❄️" },
    { id: 2, name: "Electrician", icon: "⚡" },
    { id: 3, name: "Plumber", icon: "🚰" },
    { id: 4, name: "Cook", icon: "👨‍🍳" },
  ];

  const popularServices = [
    {
      id: 1,
      name: "Rajesh Kumar",
      profession: "AC Mechanic",
      rating: 4.8,
      reviews: 125,
    },
    {
      id: 2,
      name: "Priya Sharma",
      profession: "Plumber",
      rating: 4.9,
      reviews: 234,
    },
    {
      id: 3,
      name: "Amit Singh",
      profession: "Electrician",
      rating: 4.7,
      reviews: 345,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleBookService = (serviceId) => {
    navigate(`/book-service/${serviceId}`);
  };

  return (
    <div className="customer-screen">
      {/* Header */}
      <header className="app-header">
        <h1>ServiceHub</h1>
      </header>

      {/* Search Bar */}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>

      {/* Suggested Services */}
      <section className="services-section">
        <h2>Suggested Services</h2>
        <div className="services-grid">
          {suggestedServices.map((service) => (
            <div key={service.id} className="service-card">
              <span className="service-icon">{service.icon}</span>
              <span>{service.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Near You */}
      <section className="popular-section">
        <h2>Popular Near You</h2>
        <div className="workers-list">
          {popularServices.map((worker) => (
            <div key={worker.id} className="worker-card">
              <div className="worker-rating">
                <span className="rating">{worker.rating} ★</span>
                <span className="reviews">({worker.reviews} reviews)</span>
              </div>
              <h3>{worker.name}</h3>
              <p>{worker.profession}</p>
              <button
                onClick={() => handleBookService(worker.id)}
                className="book-button">
                Book
              </button>
            </div>
          ))}
        </div>
      </section>

      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default CustomerScreen;
