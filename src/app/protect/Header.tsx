"use client";

import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    try {
      await logout(); // panggil fungsi logout dari AuthProvider
      // Kalau mau redirect setelah logout:
      window.location.href = "/";
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <header className="bg-white shadow-md w-full h-14 flex justify-between items-center px-6">
      {/* Kiri: Logo + Menu */}
      <div className="flex items-center gap-6">
        <img
          src="/logo-name.png"
          alt="Logo"
          className="w-40 h-auto object-contain"
        />
        <nav className="flex gap-3">
          <Link
            href="/home"
            className="text-zinc-800 px-4 py-2 rounded-md font-semibold transition"
          >
            Home
          </Link>
          <Link
            href="/YourNote"
            className="text-zinc-800 px-4 py-2 rounded-md font-semibold transition"
          >
            YourNote
          </Link>
          <Link
            href="/YourShare"
            className="text-zinc-800 px-4 py-2 rounded-md font-semibold transition"
          >
            YourShare
          </Link>
          <Link
            href="/Share"
            className="text-zinc-800 px-4 py-2 rounded-md font-semibold transition"
          >
            Share
          </Link>
        </nav>
      </div>

      {/* Kanan */}
      <div className="flex gap-3 text-gray-700 font-medium">
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
