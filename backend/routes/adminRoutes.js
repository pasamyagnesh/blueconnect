const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

// Public: Admin Login
router.post("/login", adminController.adminLoginHandler);

// Protected: Admin-only
router.get(
  "/dashboard",
  authMiddleware,
  isAdmin,
  adminController.getAdminDashboard
);
router.get(
  "/pending-workers",
  authMiddleware,
  isAdmin,
  adminController.getPendingWorkers
);
router.patch(
  "/workers/:id",
  authMiddleware,
  isAdmin,
  adminController.approveOrRejectWorker
);
router.get("/logs", authMiddleware, isAdmin, adminController.getAdminLogs);

module.exports = router;
