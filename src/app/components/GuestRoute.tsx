"use client";

import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home"); // arahkan ke halaman utama
    }
  }, [isAuthenticated, router]);

  // Kalau belum login, render halaman login/register
  return !isAuthenticated ? <>{children}</> : null;
}
