"use client";

import { useState } from "react";
import { AuthContext } from "../context/authContext";
import type { AuthContextType } from "../context/authContext";
import axios from "../services/axios";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (identifier: string, passwordHash: string) => {
    try {
      const response = await axios.post("/auth/login", {
        identifier,
        passwordHash,
      });
      // Token sudah di cookie httpOnly, tapi kalau mau simpan juga bisa ambil dari response
      const { token } = response.data.user;
      // Simpan token di localStorage (optional, tapi backend juga set cookie)
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login gagal", error);
      throw error;
    }
  };

  const logout = async () => {
    await axios.post("/auth/logout", {}, { withCredentials: true });
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
