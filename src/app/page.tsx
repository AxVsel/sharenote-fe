import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Selamat Datang di ShareNote
        </h1>
        <p className="text-gray-600 mb-6">
          Kelola catatan dan bagikan ide-ide kamu dengan mudah dengan teman
          kamu.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Ke Halaman Login
        </Link>
      </div>
    </div>
  );
}
