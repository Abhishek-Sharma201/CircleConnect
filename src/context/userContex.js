"use client";
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { apiURL } from "../constants";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const fetched = useRef(false);

  const fetchMe = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${apiURL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Single fetch on app mount — never duplicated across consuming components
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchMe();
  }, [fetchMe]);

  const refetchUser = useCallback(async () => {
    fetched.current = false;
    await fetchMe();
    fetched.current = true;
  }, [fetchMe]);

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, isAuthenticated, setIsAuthenticated, refetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
