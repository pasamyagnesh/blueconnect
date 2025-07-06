const ServiceRequest = require("../models/ServiceRequest");
const user = require("../models/user");

// 📌 Customer creates a booking
const createBooking = async (req, res) => {
  const { worker_id, service_type, location } = req.body;
  const customer_id = req.user.userId;

  try {
    const worker = await user.findOne({
      _id: worker_id,
      role: "worker",
      is_approved: true,
    });
    if (!worker) {
      return res
        .status(400)
        .json({ message: "Worker not found or not approved" });
    }

    const booking = await ServiceRequest.create({
      customer_id,
      worker_id,
      service_type,
      location,
    });

    res
      .status(201)
      .json({ success: true, message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// 📌 Customer views all their bookings
const getCustomerBookings = async (req, res) => {
  const customer_id = req.user.userId;

  try {
    const bookings = await ServiceRequest.find({ customer_id }).populate(
      "worker_id",
      "name mobile profession"
    );
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customer bookings" });
  }
};

// 📌 Worker views all their bookings
const getWorkerBookings = async (req, res) => {
  const worker_id = req.user.userId;

  try {
    const bookings = await ServiceRequest.find({ worker_id }).populate(
      "customer_id",
      "name mobile"
    );
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch worker bookings" });
  }
};

// 📌 Worker/Admin updates booking status
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected", "in-progress", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const booking = await ServiceRequest.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    booking[`${status}_at`] = new Date();
    await booking.save();

    res
      .status(200)
      .json({ success: true, message: "Booking status updated", booking });
  } catch (err) {
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

module.exports = {
  createBooking,
  getCustomerBookings,
  getWorkerBookings,
  updateBookingStatus,
};
