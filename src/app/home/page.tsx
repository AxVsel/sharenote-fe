import ProtectedRoute from "../protect/ProtectRoute";
import Link from "next/link";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br flex flex-col items-center justify-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full text-center transform transition-all hover:scale-[1.02] hover:shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div className="p-4 rounded-full shadow-md bg-red-500">
              <img
                src="/logo-name.png"
                alt="ShareNote Logo"
                width={60}
                height={60}
                className=""
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
            Welcome to <span className="text-red-500">ShareNote</span>
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Manage notes, store your ideas, and share inspiration with your
            friends quickly and effortlessly.
          </p>

          {/* CTA Button */}
          <Link
            href="/YourNote"
            className="inline-block px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition"
          >
            Start Creating Notes
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
