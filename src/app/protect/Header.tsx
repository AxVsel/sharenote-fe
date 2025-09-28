"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import ProtectedRoute from "./ProtectRoute";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/YourNote", label: "YourNote" },
    { href: "/YourShare", label: "YourShare" },
    { href: "/Share", label: "Share" },
  ];

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    <ProtectedRoute>
      <header className="bg-white shadow-md w-full h-14 flex justify-between items-center px-6">
        <div className="flex items-center gap-6">
          <img
            src="/logo-name.png"
            alt="Logo"
            className="w-40 h-auto object-contain"
          />
          <nav className="flex gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 font-semibold transition relative ${
                  pathname === link.href
                    ? "text-red-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-red-600"
                    : "text-zinc-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
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
    </ProtectedRoute>
  );
}
