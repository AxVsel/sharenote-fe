"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../../context/authContext";
import GuestRoute from "@/app/components/GuestRoute";

export default function Register() {
  const { register } = useContext(AuthContext);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordHash, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("passwordHash", passwordHash);

    try {
      await register(formData);
      console.log("Register berhasil");
      router.push("/home");
    } catch (error) {
      console.error("Register gagal", error);
    }
  };

  return (
    <GuestRoute>
      <div className="flex flex-col h-screen justify-center items-center p-4 bg-white">
        <div className="w-full p-3 bg-zinc-50 max-w-sm space-y-6 text-stone-900 border-2 border-zink-900">
          {/* Logo dan Judul */}
          <div className="flex flex-col">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-64 h-auto object-contain mb-2"
            />
            <h2 className="text-3xl font-bold text-stone-900">
              Create account ShareNote
            </h2>
          </div>

          {/* Form Register */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-zinc-600 rounded-md bg-white"
            />

            <input
              type="text"
              placeholder="Fullname"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-zinc-600 rounded-md bg-white"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-zinc-600 rounded-md bg-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={passwordHash}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-zinc-600 rounded-md bg-white"
            />

            <button
              type="submit"
              className="w-full py-2 text-white bg-red-600 hover:bg-red-700 rounded-full font-semibold transition"
            >
              Register
            </button>
          </form>

          {/* Link ke Login */}
          <p className="text-center text-sm text-stone-900">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-red-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </GuestRoute>
  );
}
