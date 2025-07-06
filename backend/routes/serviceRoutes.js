const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

// Customer creates a booking
router.post("/book", authMiddleware, serviceController.createBooking);

// Customer views their bookings
router.get("/customer", authMiddleware, serviceController.getCustomerBookings);

// Worker views their bookings
router.get("/worker", authMiddleware, serviceController.getWorkerBookings);

// Worker/Admin updates booking status
router.patch(
  "/:id/status",
  authMiddleware,
  serviceController.updateBookingStatus
);

module.exports = router;
