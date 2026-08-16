import { useState } from "react";
import { loginUser, registerUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isLogin) {
      try {
        setLoading(true);
        const data = await loginUser({
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      console.log("Register response:", data);
      setSuccess("Account created successfully! You can now login.");
      setIsLogin(true);
      setFormData({
        name: "",
        email: formData.email,
        password: "",
        confirmPassword: "",
        role: "athlete"
      });
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

  const toggleAuth = () => {
    setIsLogin(!isLogin);
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
                <option value="athlete">Athlete</option>
                <option value="coach">Coach</option>
                <option value="scout">Scout</option>
                <option value="academy">Academy</option>
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