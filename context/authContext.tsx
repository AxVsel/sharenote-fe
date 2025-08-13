"use client";

import { createContext } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  login: (identifier: string, passwordHash: string) => Promise<void>;
  logout: () => void;
  register: (formData: FormData) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async (identifier: string, passwordHash: string) => {},
  logout: () => {},
  register: async () => {},
});
