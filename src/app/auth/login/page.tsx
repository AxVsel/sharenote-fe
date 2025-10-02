"use client";

import Link from "next/link";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../../context/authContext";
import GuestRoute from "@/app/protect/GuestRoute";
import Swal from "sweetalert2";
import { loginSchema } from "./validation/login";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [passwordHash, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = loginSchema.validate(
      { identifier, passwordHash },
      { abortEarly: false }
    );
    if (error) {
      const newErrors: { [key: string]: string } = {};
      error.details.forEach((err) => {
        if (err.context?.key) {
          newErrors[err.context.key] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      await login(identifier, passwordHash);
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back 👋",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please check your email/username and password.",
      });
    }
  };

  return (
    <GuestRoute>
      <div className="flex min-h-screen justify-center items-center bg-white p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-red-200 p-8 space-y-6">
          {/* Logo & Title */}
          <div className="flex flex-col items-center text-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-28 h-28 object-contain mb-3"
            />
            <h2 className="text-2xl font-bold text-stone-900">
              Login to <span className="text-red-600">ShareNote</span>
            </h2>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email / Username */}
            <div>
              <input
                type="text"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={passwordHash}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              {errors.passwordHash && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.passwordHash}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right text-sm">
              <Link
                href="/forgot-password"
                className="text-red-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition duration-200"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-stone-700">
            Don’t have an account yet?{" "}
            <Link
              href="/auth/register"
              className="text-red-600 hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </GuestRoute>
  );
}
