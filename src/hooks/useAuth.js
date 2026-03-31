"use client";

import { apiURL } from "../constants";
import { useUser } from "../context/userContex";

/**
 * Auth hook — reads auth state from UserContext (single source of truth).
 * The /api/auth/me fetch happens exactly ONCE inside UserProvider at app root.
 * This hook only provides action functions (login, logout, signup, googleLogin).
 */
export const useAuth = () => {
  const { user, setUser, loading, isAuthenticated, setIsAuthenticated, refetchUser } = useUser();

  const signup = async (form) => {
    try {
      const response = await fetch(`${apiURL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.status === 409) {
        return { success: false, message: "User already exists" };
      }
      return await response.json();
    } catch {
      return { success: false, message: "Signup failed." };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
        localStorage.setItem("token", data.token);
      }
      return data;
    } catch {
      return { success: false, message: "Login failed" };
    }
  };

  const googleLogin = async (token) => {
    try {
      const response = await fetch(`${apiURL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
        localStorage.setItem("token", data.token);
      }
      return data;
    } catch {
      return { success: false, message: "Google Login failed" };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiURL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("token");
      }
      return data;
    } catch {
      return { success: false, message: "Logout failed" };
    }
  };

  return {
    signup,
    login,
    googleLogin,
    logout,
    refetchUser,
    isAuthenticated,
    user,
    loading,
  };
};
