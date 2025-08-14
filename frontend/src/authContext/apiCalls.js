import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";

// Set up axios base URL (using Vite env variables)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8800/api/";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await api.post("auth/login", user);
    dispatch(loginSuccess(res.data));
    return res.data; // Return data for additional handling if needed
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    dispatch(loginFailure(err.response?.data?.message || "Login failed"));
    throw err; // Re-throw for component-level error handling
  }
};

// Optional: Add register function
export const register = async (user, dispatch) => {
  dispatch(loginStart()); // You might want to create registerStart action
  try {
    const res = await api.post("auth/register", user);
    return res.data;
  } catch (err) {
    console.error("Register error:", err.response?.data || err.message);
    dispatch(loginFailure(err.response?.data?.message || "Registration failed"));
    throw err;
  }
};

// Optional: Add logout function
export const logout = (dispatch) => {
  localStorage.removeItem("user");
  dispatch({ type: "LOGOUT" });
};