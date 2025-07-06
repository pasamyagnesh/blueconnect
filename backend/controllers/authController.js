const OTP = require("../models/OTP");
const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOTP = require("../utils/sendOTP");

const sendOtpHandler = async (req, res, next) => {
  const { mobile } = req.body;
  if (!mobile)
    return res.status(400).json({ message: "Mobile number required" });

  const result = await sendOTP(mobile);
  if (result) {
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } else {
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

const verifyOtpHandler = async (req, res, next) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    return res.status(400).json({ message: "Mobile and OTP required" });
  }

  const otpRecord = await OTP.findOne({ mobile, otp });
  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (otpRecord.expires_at < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  // Mark mobile as verified in the OTP table
  otpRecord.verified = true;
  await otpRecord.save();

  res.status(200).json({ success: true, message: "Mobile number verified" });
};

const registerHandler = async (req, res, next) => {
  const {
    role,
    name,
    mobile_verified,
    mobile,
    profession,
    experience,
    location,
    password,
    profile_image,
    documents,
  } = req.body;

  // Check if user already exists
  const existinguser = await user.findOne({ mobile });
  if (existinguser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Check if mobile was verified
  const verifiedOtp = await OTP.findOne({ mobile, verified: true });
  const isMobileVerified = verifiedOtp ? true : false;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await user.create({
    role,
    name,
    mobile,
    profession,
    experience,
    location,
    password: hashedPassword,
    profile_image,
    documents,
    mobile_verified: isMobileVerified, // set true if verified
  });

  // Clean up OTP records for this mobile
  await OTP.deleteMany({ mobile });

  res.status(201).json({
    success: true,
    message: "user registered successfully",
    newUser,
  });
};

const loginHandler = async (req, res, next) => {
  const { mobile, password } = req.body;

  try {
    const user = await user.findOne({ mobile, password });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid phone number or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid phone number or password" });
    }

    // 🚨 Check for worker approval
    if (user.role === "worker" && !user.is_approved) {
      return res.status(403).json({
        success: false,
        message: "Admin Approval Under Process",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        mobile: user.mobile,
        mobile_verified: user.mobile_verified,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendOtpHandler,
  verifyOtpHandler,
  registerHandler,
  loginHandler,
};
