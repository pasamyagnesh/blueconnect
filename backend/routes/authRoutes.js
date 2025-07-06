const express = require("express");
const router = express.Router();
const {
  sendOtpHandler,
  verifyOtpHandler,
  registerHandler,
  loginHandler,
} = require("../controllers/authController");

router.post("/send-otp", sendOtpHandler);
router.post("/verify-otp", verifyOtpHandler);
router.post("/register", registerHandler);
router.post("/login", loginHandler);

module.exports = router;
