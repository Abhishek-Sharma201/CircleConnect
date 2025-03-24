// useAuth hook

"use client";

import { useEffect, useState } from "react";
import { apiURL } from "../constants";
import dotenv from "dotenv";

dotenv.config();

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiURL}/api/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${apiURL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.status === 409)
        return { success: response.success, message: response.message };

      const data = await response.json();

      return data;
    } catch (error) {
      return { success: false, message: "Signup failed." };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  };

  const googleLogin = async (token) => {
    try {
      const response = await fetch(`${apiURL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (error) {
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
    } catch (error) {
      return { success: false, message: "Logout failed" };
    }
  };

  return {
    signup,
    login,
    googleLogin,
    logout,
    isAuthenticated,
    user,
    loading,
  };
};
