const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  otp: { type: String, required: true },
  expires_at: { type: Date, required: true },
  verified: { type: Boolean },
});

module.exports = mongoose.model("OTP", otpSchema);
