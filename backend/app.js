const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const serviceRoutes = require("./routes/serviceRoutes");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve uploaded files statically (profile images, documents)
app.use("/uploads", express.static("uploads"));

const adminRoutes = require("./routes/adminRoutes");

// Other routes...
app.use("/api/admin", adminRoutes);

// ✅ API Routes
app.use("/api/auth", authRoutes); // Auth (OTP, register, login)
// app.use("/api/users", userRoutes); // User profile etc.
// app.use("/api/admin", adminRoutes); // Admin approvals & logs
// app.use("/api/services", serviceRoutes); // Customer ↔ Worker bookings

// ✅ Root Route (health check)
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("💥 Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
