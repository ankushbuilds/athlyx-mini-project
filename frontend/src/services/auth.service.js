import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (userData) => {
  const response = await API.post(
    "/auth/register",
    userData
  );

  return response.data;
};

// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (loginData) => {
  const response = await API.post(
    "/auth/login",
    loginData
  );

  return response.data;
};

// ==========================================
// VERIFY EMAIL OTP
// ==========================================

export const verifyEmailOTP = async (otpData) => {
  const response = await API.post(
    "/auth/verify-email-otp",
    otpData
  );

  return response.data;
};

// ==========================================
// RESEND EMAIL OTP
// ==========================================

export const resendEmailOTP = async (emailData) => {
  const response = await API.post(
    "/auth/resend-email-otp",
    emailData
  );

  return response.data;
};