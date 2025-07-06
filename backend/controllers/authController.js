const OTP = require("../models/OTP");
const UserModel = require("../models/user");
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
  const existingUser = await UserModel.findOne({ mobile });
  if (existingUser) {
    return res.status(400).json({ message: "Mobile number already registered" });
  }

  // Check if mobile was verified
  const verifiedOtp = await OTP.findOne({ mobile, verified: true });
  const isMobileVerified = verifiedOtp ? true : false;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await UserModel.create({
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

  // Input validation
  if (!mobile || !password) {
    return res.status(400).json({
      success: false,
      message: "Mobile number and password are required"
    });
  }

  try {
    console.log('Login attempt for mobile:', mobile);
    
    // Format the mobile number to match the database format
    let formattedMobile = mobile.trim();
    
    // If mobile doesn't start with +91, add it
    if (!formattedMobile.startsWith('+91')) {
      // Remove any spaces or special characters
      const cleanNumber = formattedMobile.replace(/[^0-9]/g, '');
      // Add +91 prefix if it's a 10-digit number
      if (cleanNumber.length === 10) {
        formattedMobile = `+91 ${cleanNumber}`;
      } else if (cleanNumber.length === 12 && cleanNumber.startsWith('91')) {
        formattedMobile = `+${cleanNumber.slice(0, 2)} ${cleanNumber.slice(2)}`;
      }
    }
    
    console.log('Formatted mobile for search:', formattedMobile);
    const foundUser = await UserModel.findOne({ mobile: formattedMobile }).select('+password');
    
    if (!foundUser) {
      console.log('User not found for mobile:', formattedMobile);
      return res.status(400).json({
        success: false,
        message: "Invalid phone number or password"
      });
    }

    console.log('User found, checking password...');
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      console.log('Invalid password for user:', mobile);
      return res.status(400).json({
        success: false,
        message: "Invalid phone number or password"
      });
    }

    // 🚨 Check for worker approval
    if (foundUser.role === "worker" && !foundUser.is_approved) {
      return res.status(403).json({
        success: false,
        message: "Admin Approval Under Process",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: foundUser._id, role: foundUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: foundUser._id,
        name: foundUser.name,
        role: foundUser.role,
        mobile: foundUser.mobile,
        mobile_verified: foundUser.mobile_verified,
        email: foundUser.email,
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
