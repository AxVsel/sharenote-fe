"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../../context/authContext";
import GuestRoute from "@/app/protect/GuestRoute";
import { registerSchema } from "./validation/register";
import Swal from "sweetalert2";

export default function Register() {
  const { register } = useContext(AuthContext);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordHash, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = registerSchema.validate(
      { username, fullname, email, passwordHash },
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

    const formData = new FormData();
    formData.append("username", username);
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("passwordHash", passwordHash);

    try {
      await register(formData);

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Your account has been created!",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (error) {
      console.error("Registration failed", error);

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "An error occurred while creating your account.",
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
              Create an account <span className="text-red-600">ShareNote</span>
            </h2>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Full name */}
            <div>
              <input
                type="text"
                placeholder="Full name"
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              {errors.fullname && (
                <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition duration-200"
            >
              Register
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-stone-700">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-red-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </GuestRoute>
  );
}
