"use client";

import Link from "next/link";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../../context/authContext";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [passwordHash, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(identifier, passwordHash);
      router.push("/home");
    } catch (error) {
      console.error("Login gagal:", error);
      alert("Login gagal, cek kembali email/username dan password.");
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center p-4 bg-white">
      <div className="w-full p-3 bg-zinc-50 max-w-sm space-y-6 text-stone-900 border-2 border-zink-900">
        <div>
          <img
            src="/logo.png"
            alt="Logo"
            className="w-64 h-auto object-contain"
          />
          <h2 className="text-3xl font-bold">Login to ShareNote</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email/Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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

          <div className="text-right text-sm">
            <Link
              href="/forgot-password"
              className="text-red-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-full font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-zink-900">
          Don’t have an account yet?{" "}
          <Link href="/auth/register" className="text-red-600 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
