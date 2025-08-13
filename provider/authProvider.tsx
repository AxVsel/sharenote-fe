"use client";

import { useState, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import type { AuthContextType } from "../context/authContext";
import axios from "../services/axios";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cek token saat pertama kali load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (identifier: string, passwordHash: string) => {
    try {
      const response = await axios.post("/auth/login", {
        identifier,
        passwordHash,
      });
      const { token } = response.data.user;

      // Simpan token
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login gagal", error);
      throw error;
    }
  };

  const logout = async () => {
    await axios.post("/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const register = async (formData: FormData) => {
    const response = await axios.post("/auth/register", formData, {
      headers: { "Content-Type": "application/json" },
    });
    const { token } = response.data.user;
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
