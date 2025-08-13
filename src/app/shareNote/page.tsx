import ProtectedRoute from "../components/ProtectRoute";

export default function ShareNote() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-black">Halaman Home ShareNote</h1>
      </div>
    </ProtectedRoute>
  );
}
