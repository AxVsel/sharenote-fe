import ProtectedRoute from "../components/ProtectRoute";

export default function Note() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-black">Halaman Home (Note)</h1>
      </div>
    </ProtectedRoute>
  );
}
