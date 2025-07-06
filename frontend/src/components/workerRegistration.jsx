import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./workerRegistration.css";
import WorkerLogin from "./workerLogin";

const WorkerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profession: "",
    workExperience: "",
    documents: null,
    password: "",
    location: "",
    confirmPassword: "",
    photo: null,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAutoDetectLocation = async () => {
    setAutoDetecting(true);

    try {
      console.log("📡 Requesting location permission from user...");

      if (!navigator.geolocation) {
        alert("🚫 Geolocation is not supported by your browser.");
        setAutoDetecting(false);
        return;
      }

      // ✅ Step 1: Ask browser for user's location with high accuracy
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, // Try to get GPS/WiFi location
          timeout: 15000, // 15s timeout
          maximumAge: 0, // No cached positions
        });
      });

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      console.log("✅ User granted location access:", { lat, lon });

      // ✅ Step 2: Call OpenCage API with lat/lon to get address
      const res = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            key: "ad6081b1b9bc4a01a9807a58f4f0cc5b", // Your OpenCage API key
            q: `${lat},${lon}`,
            pretty: 1,
          },
        }
      );

      if (!res.data.results || res.data.results.length === 0) {
        throw new Error("No results from OpenCage API");
      }

      const components = res.data.results[0].components;
      const address = res.data.results[0].formatted;
      const city =
        components.city ||
        components.town ||
        components.village ||
        components.state ||
        "Unknown";

      const detectedLocation = {
        address,
        coordinates: { lat, lng: lon },
        city,
      };

      console.log("📍 Detected location details:", detectedLocation);

      // ✅ Step 3: Update formData with detected address & coordinates
      setFormData((prev) => ({
        ...prev,
        location: detectedLocation,
      }));

      alert(`📍 Location detected: ${detectedLocation.address}`);
    } catch (error) {
      console.error("❌ Location detection failed:", error);

      if (error.code === 1) {
        alert(
          "🚫 Location permission denied. Please enable it in your browser settings."
        );
      } else if (error.code === 2) {
        alert("❌ Location unavailable. Try again later.");
      } else if (error.code === 3) {
        alert("⏳ Location request timed out. Please try again.");
      } else {
        alert("⚠ Could not detect location. Please enter manually.");
      }

      // 🌐 Fallback: Use mock location for development (localhost only)
      if (window.location.hostname === "localhost") {
        console.log("🛠 Using mock location for localhost...");
        const mockLocation = {
          address: "123 Worker Street, Service City",
          coordinates: { lat: 12.9716, lng: 77.5946 }, // Example: Bangalore
          city: "Bangalore",
        };

        setFormData((prev) => ({
          ...prev,
          location: mockLocation,
        }));

        alert(`📍 Mock Location: ${mockLocation.address}`);
      }
    } finally {
      setAutoDetecting(false);
    }
  };

  const handleSendOtp = async () => {
    console.log("Sending OTP to", formData.phone);

    setOtpSent(true);
    setOtpVerified(false); // reset if trying again
    setOtp(Array(6).fill(""));

    // Start resend timer
    setOtpTimer(30);
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // API Call to send OTP
    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: formData.phone }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("OTP sent:", data);
      } else {
        console.error("Error sending OTP:", data.message);
        alert("Failed to send OTP: " + data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Could not connect to server.");
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    console.log("Verifying OTP:", enteredOtp);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: formData.phone,
            otp: enteredOtp,
          }),
        }
      );

      
      const data = await response.json();

      if (response.ok && data.success) {
        console.log("OTP verified:", data);
        alert("OTP verified successfully!");
        setOtpVerified(true);
        setOtpSent(false);
        setOtp(Array(6).fill(""));
      } else {
        console.error("OTP verification failed:", data.message);
        alert("Invalid OTP: " + data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Could not connect to server.");
    }
  };



  const uploadToCloudinary = async (file, folder) => {
    const cloudName = "dvuwbvlth"; //  your Cloudinary cloud name
    const uploadPreset = "blueCollarJob"; //  unsigned upload preset

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    try {
      const response = await axios.post(url, formData);
      console.log("Cloudinary upload success:", response.data.secure_url);
      return response.data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      throw new Error("Failed to upload file to Cloudinary");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let photoUrl = "";
      let documentUrl = "";

      // Upload profile photo to Cloudinary
      if (formData.photo) {
        photoUrl = await uploadToCloudinary(formData.photo, "worker_profiles");
      }

      // Upload documents to Cloudinary
      if (formData.documents) {
        documentUrl = await uploadToCloudinary(
          formData.documents,
          "worker_documents"
        );
      }

      const payload = {
        role: "worker",
        name: formData.name,
        mobile_verified: otpVerified,
        mobile: formData.phone,
        profession: formData.profession,
        experience: formData.workExperience,
        location: formData.location, // {address, coordinates, city}
        password: formData.password,
        profile_image: photoUrl,
        documents: documentUrl ? [documentUrl] : [], // ✅ send as array
      };

      console.log("📤 Sending payload to backend:", payload);

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Registration success:", response.data);
      alert("🎉 Registration successful!");
      setRegistrationSuccess(true);
    } catch (err) {
      console.error(
        "❌ Registration error:",
        err.response?.data || err.message
      );
      alert(
        "Registration failed: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/role-selection"); // Explicitly navigate back to role selection
  };

  const handleDashboard = () => {
    navigate("/worker-dashboard"); // Navigate to dashboard after success
  };

  const handleLoginNavigation = () => {
    navigate("/worker-login");
  };
  if (registrationSuccess) {
    return (
      <div className="registration-success">
        <div className="success-header">
          <button onClick={handleBack} className="back-button">
            ← Back
          </button>
          <h2>Registration Submitted Successfully!</h2>
        </div>
        <div className="success-message">
          <div className="status-message">
            <span className="status-badge">Status:</span>
            <span className="status-text">Verification under Process</span>
          </div>
          <p className="success-info">
            You will receive a call from our admin within 24hrs to verify and
            approve your registration.
          </p>
          <p className="success-thanks">Thank you for registering with us!</p>
        </div>
        <div className="success-actions">
          <button onClick={handleBack} className="secondary-button">
            Back to Home
          </button>
          <button onClick={handleDashboard} className="primary-button">
            Go to Dashboard →
          </button>
        </div>
      </div>
    );
  }
  const getPasswordStrength = (password) => {
    if (!password) return "empty";
    if (password.length < 4) return "weak";
    if (password.length < 8) return "medium";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return "strong";
    return "medium";
  };

  const getPasswordStrengthText = (password) => {
    const strength = getPasswordStrength(password);
    switch (strength) {
      case "empty":
        return "";
      case "weak":
        return "Weak";
      case "medium":
        return "Medium";
      case "strong":
        return "Strong";
      default:
        return "";
    }
  };
  return (
    <div className="worker-registration">
      <div className="registration-header">
        <button onClick={handleBack} className="back-button">
          ← Back
        </button>
        <h2>Service Provider Registration</h2>
        <p className="subtitle">Fill in your details to get started</p>
      </div>
      <div className="profile-photo-upload">
        <div className="profile-image-container">
          {formData.photo ? (
            <img
              src={URL.createObjectURL(formData.photo)}
              alt="Profile"
              className="profile-image"
            />
          ) : (
            <div className="profile-placeholder">
              <span>+</span>
            </div>
          )}
        </div>
        <input
          type="file"
          id="profilePhoto"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          style={{ display: "none" }}
        />
        <label htmlFor="profilePhoto" className="upload-label">
          Upload Profile Photo
        </label>
      </div>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <div className="phone-field-container">
            <div className="phone-input-wrapper">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={otpSent}
                placeholder="Enter phone number"
                className="phone-input"
              />
              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="send-otp-btn"
                  disabled={!formData.phone}>
                  Send OTP
                </button>
              )}
            </div>

            {otpSent && (
              <div className="otp-verification-section">
                <p className="otp-instructions">
                  Enter the 6-digit OTP sent to {formData.phone}
                </p>
                <div className="otp-inputs-container">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onFocus={(e) => e.target.select()}
                      className="otp-input"
                    />
                  ))}
                </div>

                {!otpVerified ? (
                  <>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="verify-otp-btn"
                      disabled={otp.includes("")}>
                      Verify OTP
                    </button>
                    <div className="resend-otp-wrapper">
                      {otpTimer > 0 ? (
                        <p className="otp-timer">Resend OTP in {otpTimer}s</p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="resend-btn">
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="verified-status">
                    ✅ <span className="verified-text">Phone Verified</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
            />
            <div className="password-strength">
              <div
                className={`strength-bar ${getPasswordStrength(
                  formData.password
                )}`}></div>
              <span className="strength-text">
                {getPasswordStrengthText(formData.password)}
              </span>
            </div>
            <div className="password-hints">
              <span
                className={`hint ${
                  formData.password.length >= 8 ? "valid" : ""
                }`}>
                ✓ At least 8 characters
              </span>
              <span
                className={`hint ${
                  /[A-Z]/.test(formData.password) ? "valid" : ""
                }`}>
                ✓ At least one uppercase letter
              </span>
              <span
                className={`hint ${
                  /[0-9]/.test(formData.password) ? "valid" : ""
                }`}>
                ✓ At least one number
              </span>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {formData.password && formData.confirmPassword && (
            <span
              className={`password-match ${
                formData.password === formData.confirmPassword
                  ? "match"
                  : "no-match"
              }`}>
              {formData.password === formData.confirmPassword
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="profession">Profession</label>
          <select
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            required>
            <option value="">Select your profession</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="carpenter">Carpenter</option>
            <option value="painter">Painter</option>
            <option value="cleaner">Cleaner</option>
            <option value="mechanic">Mechanic</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Address</label>
          <div className="location-group">
            <input
              type="text"
              name="address"
              value={formData.location.city}
              onChange={handleChange}
              required
              placeholder="Enter your address"
            />
            <button
              type="button"
              onClick={handleAutoDetectLocation}
              className="detect-button"
              disabled={autoDetecting}>
              {autoDetecting ? (
                <>
                  <span className="spinner-small"></span>
                  Detecting...
                </>
              ) : (
                "Auto Detect"
              )}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="workExperience">Work Experience (in years)</label>
          <input
            type="number"
            id="workExperience"
            name="workExperience"
            value={formData.workExperience}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="documents">
            Upload Proof Documents (PDF, max 5MB)
          </label>
          <input
            type="file"
            id="documents"
            name="documents"
            onChange={handleChange}
            accept=".pdf"
          />
          <small>
            Upload any certificates, ID proofs, or other relevant documents
          </small>
        </div>

        <div className="login-prompt">
          <div className="login-divider">
            <span className="divider-line"></span>
            <span className="divider-text">OR</span>
            <span className="divider-line"></span>
          </div>
          <div className="login-option">
            <p>Already have an account?</p>
            <button
              type="button"
              className="login-button"
              onClick={handleLoginNavigation} // Updated to use the navigation function
            >
              Login Here
            </button>
          </div>
        </div>
        <div className="form-actions">
          <button
            type="button"
            onClick={handleBack}
            className="secondary-button">
            Cancel
          </button>
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Registering...
              </>
            ) : (
              "Register Now"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkerRegistration;
