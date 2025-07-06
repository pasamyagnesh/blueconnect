const client = require("../config/twilio");
const OTP = require("../models/OTP");

// Helper to generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (mobile) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  try {
    // Send OTP via Twilio SMS
    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    });

    // Save OTP in DB
    await OTP.create({ mobile, otp, expires_at: expiresAt });

    console.log(`📱 OTP sent to ${mobile}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending OTP:", error.message);
    return false;
  }
};

module.exports = sendOTP;
