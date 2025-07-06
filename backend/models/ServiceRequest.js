const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  worker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service_type: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "in-progress", "completed"],
    default: "pending",
  },
  booked_at: {
    type: Date,
    default: Date.now,
  },
  accepted_at: Date,
  started_at: Date,
  completed_at: Date,
  customer_rating: {
    type: Number,
    min: 1.0,
    max: 5.0,
  },
  customer_review: String,
});

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
