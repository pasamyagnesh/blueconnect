import React from "react";
import { useNavigate } from "react-router-dom";
import "./customerBookings.css";

import BottomNavigation from "./bottomNavigation";

const CustomerBookings = () => {
  const navigate = useNavigate();

  const ongoingBooking = {
    worker: "Ethan Carter",
    service: "Plumbing",
    statusUpdates: [
      { status: "Booking placed", time: "Placed at 10:00 AM" },
      { status: "Accepted", time: "Accepted at 10:15 AM" },
      { status: "Service in Progress", time: "In progress at 11:00 AM" },
      { status: "Completed", time: "Completed at 12:00 PM" },
    ],
  };

  const pastBookings = [
    { worker: "Sophia Bennett", service: "Cleaning" },
    { worker: "Ethan Carter", service: "Plumbing" },
  ];

  return (
    <div className="bookings-container">
      <header className="bookings-header">
        <h1>Track Service</h1>
      </header>

      <section className="ongoing-section">
        <h2>Ongoing</h2>
        <div className="booking-card">
          <div className="worker-info">
            <h3>{ongoingBooking.worker}</h3>
            <p>{ongoingBooking.service}</p>
          </div>

          <div className="status-timeline">
            {ongoingBooking.statusUpdates.map((update, index) => (
              <div key={index} className="status-item">
                <div className="status-indicator"></div>
                <div className="status-details">
                  <p className="status-title">{update.status}</p>
                  <p className="status-time">{update.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section className="past-section">
        <h2>Past</h2>
        {pastBookings.map((booking, index) => (
          <div key={index} className="past-booking">
            <h3>{booking.worker}</h3>
            <p>{booking.service}</p>
          </div>
        ))}
      </section>

      <BottomNavigation activeTab="bookings" />
    </div>
  );
};

export default CustomerBookings;
