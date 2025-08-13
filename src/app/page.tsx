import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="text-zinc-800">
      <h1>halaman Dashboard</h1>
      <Link href="/auth/login">Ke Halaman Login</Link>
    </div>
  );
}
