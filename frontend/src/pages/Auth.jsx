import { useState } from "react";
import {
  loginUser,
  registerUser
} from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Auth = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

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

        setSuccess("loginSuccessful");

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
          "loginFailed"
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
      setError("passwordsMismatch");
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

      setSuccess("accountCreated");
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
        "registrationFailed"
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
            {isLogin ? t("welcomeBack") : t("joinAthlyx")}
          </h1>

          <p>
            {isLogin
              ? t("signInDescription")
              : t("registerDescription")}
          </p>
        </div>

        {error && (
          <div className="auth-message auth-error">
            {t(error, { defaultValue: error })}
          </div>
        )}

        {success && (
          <div className="auth-message auth-success">
            {t(success, { defaultValue: success })}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          {!isLogin && (
            <div className="form-group">

              <label>{t("fullName")}</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("enterFullName")}
                required
              />

            </div>
          )}

          <div className="form-group">

            <label>{t("email")}</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("enterEmail")}
              required
            />

          </div>

          <div className="form-group">

            <label>{t("password")}</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("enterPassword")}
              required
              minLength={6}
            />

          </div>

          {!isLogin && (
            <div className="form-group">

              <label>{t("confirmPassword")}</label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t("confirmYourPassword")}
                required
                minLength={6}
              />

            </div>
          )}

          {!isLogin && (
            <div className="form-group">

              <label>{t("registerAs")}</label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="athlete">
                  {t("roles.athlete")}
                </option>

                <option value="coach">
                  {t("roles.coach")}
                </option>

                <option value="scout">
                  {t("roles.scout")}
                </option>

                <option value="academy">
                  {t("roles.academy")}
                </option>
              </select>

            </div>
          )}

          {isLogin && (
            <div className="forgot-password">

              <button type="button">
                {t("forgotPassword")}
              </button>

            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? t("pleaseWait")
              : isLogin
                ? t("login")
                : t("createAccount")}

            {!loading && <span>→</span>}
          </button>

        </form>

        <div className="auth-switch">

          <span>
            {isLogin
              ? t("noAccount")
              : t("alreadyAccount")}
          </span>

          <button
            type="button"
            onClick={toggleAuth}
          >
            {isLogin ? t("register") : t("login")}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Auth;