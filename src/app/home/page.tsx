import ProtectedRoute from "../components/ProtectRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br f flex flex-col items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Selamat Datang di ShareNote
          </h1>
          <p className="text-gray-600 mb-6">
            Kelola catatan dan bagikan ide-ide kamu dengan mudah dengan teman
            kamu.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
