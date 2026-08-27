import { useState } from "react";
import {
  loginUser,
  registerUser,
  verifyEmailOTP,
  resendEmailOTP
} from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  // OTP screen
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "athlete"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // HANDLE OTP CHANGE
  // ==========================================

  const handleOtpChange = (e) => {
    const value = e.target.value;

    // Only allow numbers
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setError("");
      setSuccess("");
    }
  };

  // ==========================================
  // LOGIN / REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ==========================================
    // LOGIN
    // ==========================================

    if (isLogin) {
      try {
        setLoading(true);

        const data = await loginUser({
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setSuccess("Login successful!");

        console.log("Login response:", data);

        if (data.user.role === "athlete") {
          navigate("/athlete/dashboard");
        } else if (data.user.role === "coach") {
          navigate("/coach/dashboard");
        } else if (data.user.role === "scout") {
          navigate("/scout/dashboard");
        } else if (data.user.role === "academy") {
          navigate("/academy/dashboard");
        }

      } catch (error) {
        console.error("Login error:", error);

        setError(
          error.response?.data?.message ||
          "Login failed. Please try again."
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    // ==========================================
    // REGISTER VALIDATION
    // ==========================================

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // ==========================================
    // REGISTER
    // ==========================================

    try {
      setLoading(true);

      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      console.log("Register response:", data);

      // ==========================================
      // OTP SENT
      // ==========================================

      if (data.otpSent) {
        setOtpStep(true);
        setOtp("");
        setSuccess(
          "OTP has been sent to your email. Please verify your email."
        );
      } else {
        setSuccess(
          "Account created successfully! You can now login."
        );

        setIsLogin(true);

        setFormData({
          name: "",
          email: formData.email,
          password: "",
          confirmPassword: "",
          role: "athlete"
        });
      }

    } catch (error) {
      console.error("Register error:", error);

      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const data = await verifyEmailOTP({
        email: formData.email,
        otp: otp
      });

      console.log("OTP verification response:", data);

      if (data.success || data.verified) {
        setSuccess(
          "Email verified successfully! You can now login."
        );

        // Go back to login
        setOtpStep(false);
        setIsLogin(true);

        setFormData({
          name: "",
          email: formData.email,
          password: "",
          confirmPassword: "",
          role: formData.role
        });

        setOtp("");
      }

    } catch (error) {
      console.error("OTP verification error:", error);

      setError(
        error.response?.data?.message ||
        "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESEND OTP
  // ==========================================

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const data = await resendEmailOTP({
        email: formData.email
      });

      console.log("Resend OTP response:", data);

      setSuccess(
        "A new OTP has been sent to your email."
      );

      setOtp("");

    } catch (error) {
      console.error("Resend OTP error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to resend OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // TOGGLE LOGIN / REGISTER
  // ==========================================

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    setOtpStep(false);
    setOtp("");

    setError("");
    setSuccess("");

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "athlete"
    });
  };

  // ==========================================
  // OTP SCREEN
  // ==========================================

  if (otpStep) {
    return (
      <div className="auth-page">
        <div className="auth-card">

          <div className="auth-logo-wrapper">
            <img
              src="/logo.png"
              alt="Athlyx"
              className="auth-logo"
            />
          </div>

          <div className="auth-header">
            <h1>Verify Your Email</h1>

            <p>
              Enter the 6-digit OTP sent to{" "}
              <strong>{formData.email}</strong>
            </p>
          </div>

          {error && (
            <div className="auth-message auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-message auth-success">
              {success}
            </div>
          )}

          <form
            onSubmit={handleVerifyOTP}
            className="auth-form"
          >

            <div className="form-group">
              <label>Email OTP</label>

              <input
                type="text"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit OTP"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify Email"}

              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="auth-switch">

            <span>Didn't receive the OTP?</span>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
            >
              Resend OTP
            </button>

          </div>

          <div className="auth-switch">

            <span>Wrong email?</span>

            <button
              type="button"
              onClick={() => {
                setOtpStep(false);
                setError("");
                setSuccess("");
              }}
            >
              Go Back
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // LOGIN / REGISTER SCREEN
  // ==========================================

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo-wrapper">
          <img
            src="/logo.png"
            alt="Athlyx"
            className="auth-logo"
          />
        </div>

        <div className="auth-header">
          <h1>
            {isLogin ? "Welcome Back" : "Join Athlyx"}
          </h1>

          <p>
            {isLogin
              ? "Sign in to continue your athletic journey."
              : "Create your account and discover your potential."}
          </p>
        </div>

        {error && (
          <div className="auth-message auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-message auth-success">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          {!isLogin && (
            <div className="form-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

            </div>
          )}

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              minLength={6}
            />

          </div>

          {!isLogin && (
            <div className="form-group">

              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                minLength={6}
              />

            </div>
          )}

          {!isLogin && (
            <div className="form-group">

              <label>Register As</label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="athlete">
                  Athlete
                </option>

                <option value="coach">
                  Coach
                </option>

                <option value="scout">
                  Scout
                </option>

                <option value="academy">
                  Academy
                </option>
              </select>

            </div>
          )}

          {isLogin && (
            <div className="forgot-password">

              <button type="button">
                Forgot Password?
              </button>

            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Create Account"}

            {!loading && <span>→</span>}
          </button>

        </form>

        <div className="auth-switch">

          <span>
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>

          <button
            type="button"
            onClick={toggleAuth}
          >
            {isLogin ? "Register" : "Login"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Auth;