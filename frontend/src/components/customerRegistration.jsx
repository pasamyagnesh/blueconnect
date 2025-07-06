import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./customerRegistration.css";

const CustomerRegistration = () => {
  const [step, setStep] = useState("signup"); // 'signup', 'otp', 'complete'
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    password: "",
    village: "",
    district: "",
  });
  const [otp, setOtp] = useState("");
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutoDetectLocation = async () => {
    setAutoDetecting(true);
    try {
      // Simulate API call to get location
      const mockResponse = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              village: "Techville",
              district: "Digital District",
            }),
          1500
        )
      );

      setFormData((prev) => ({
        ...prev,
        village: mockResponse.village,
        district: mockResponse.district,
        address: `${mockResponse.village}, ${mockResponse.district}`,
      }));
    } catch (error) {
      console.error("Location detection failed:", error);
    } finally {
      setAutoDetecting(false);
    }
  };

  const handleSendOtp = () => {
    // In real app, call API to send OTP
    console.log("OTP sent to", formData.phone);
    setStep("otp");
  };

  const handleVerifyOtp = () => {
    // In real app, verify OTP with backend
    console.log("OTP verified");
    // Generate mock JWT token (in real app, get from backend)
    const mockToken = "mock-jwt-token-" + Math.random().toString(36).substr(2);
    setJwtToken(mockToken);
    localStorage.setItem("customerToken", mockToken);
    setStep("complete");
  };

  const handleComplete = () => {
    navigate("/customer-dashboard");
  };

  const handleLoginNavigation = () => {
    navigate("/customer-login");
  };

  if (step === "otp") {
    return (
      <div className="otp-screen">
        <h2>Verify Your Phone</h2>
        <p>We've sent an OTP to {formData.phone}</p>

        <div className="otp-input-group">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
          />
          <button onClick={handleVerifyOtp} className="verify-button">
            Verify
          </button>
        </div>

        <button onClick={() => setStep("signup")} className="back-button">
          ← Back
        </button>
      </div>
    );
  }

  if (step === "complete") {
    return (
      <div className="completion-screen">
        <div className="success-icon">✓</div>
        <h2>Registration Complete!</h2>
        <p>Your account has been successfully created.</p>
        <p>JWT token generated and stored.</p>
        <button onClick={handleComplete} className="continue-button">
          Continue to Dashboard →
        </button>
      </div>
    );
  }

  return (
    <div className="customer-signup">
      <h2>Customer Sign Up</h2>
      <p>Create your account to find service providers</p>

      <form>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <div className="location-group">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your address"
            />
            <button
              type="button"
              onClick={handleAutoDetectLocation}
              className="detect-button"
              disabled={autoDetecting}>
              {autoDetecting ? "Detecting..." : "Auto Detect"}
            </button>
          </div>

          {formData.village && (
            <div className="location-details">
              <span>Village: {formData.village}</span>
              <span>District: {formData.district}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a password"
          />
          <small>Password will be automatically generated on first login</small>
        </div>

        <button
          type="button"
          onClick={handleSendOtp}
          className="signup-button"
          disabled={!formData.name || !formData.phone || !formData.address}>
          Send OTP
        </button>
      </form>

      <div className="login-prompt">
        Already have an account?
        <button onClick={handleLoginNavigation} className="login-link">
          Log In
        </button>
      </div>
    </div>
  );
};

export default CustomerRegistration;
