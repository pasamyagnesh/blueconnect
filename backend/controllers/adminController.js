const user = require("../models/user");
const AdminLog = require("../models/AdminLog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 📝 Admin Login
const adminLoginHandler = async (req, res) => {
  const { email, password } = req.body;

  const admin = await user.findOne({ email, role: "admin" });
  if (!admin) {
    return res.status(400).json({ success: false, message: "Admin not found" });
  }

  const isMatch = admin.password;
  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid password" });
  }

  const token = jwt.sign(
    { userId: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  res.status(200).json({
    success: true,
    message: "Admin login successful",
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
  });
};

// 📝 Protected: Dashboard
const getAdminDashboard = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Admin Dashboard 🚀",
  });
};

// 📌 Get all pending workers
const getPendingWorkers = async (req, res) => {
  try {
    const workers = await user.find({ role: "worker", is_approved: false });
    res.status(200).json({ success: true, workers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending workers" });
  }
};

// 📌 Approve or Reject worker
const approveOrRejectWorker = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // "approve" or "reject"
  const admin_id = req.user.userId;

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  try {
    const worker = await user.findById(id);
    if (!worker || worker.role !== "worker") {
      return res.status(404).json({ message: "Worker not found" });
    }

    worker.is_approved = action === "approve";
    await worker.save();

    // Log admin action
    await AdminLog.create({
      admin_id,
      action: `${action} worker`,
      target_user_id: id,
    });

    res
      .status(200)
      .json({ success: true, message: `Worker ${action}d successfully` });
  } catch (err) {
    res.status(500).json({ message: "Failed to update worker approval" });
  }
};

// 📌 View Admin Logs
const getAdminLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate("admin_id", "name email")
      .populate("target_user_id", "name email");
    res.status(200).json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin logs" });
  }
};

module.exports = {
  adminLoginHandler,
  getAdminDashboard,
  getPendingWorkers,
  approveOrRejectWorker,
  getAdminLogs,
};
