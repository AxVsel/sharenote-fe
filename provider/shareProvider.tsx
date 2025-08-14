"use client";

import { useState, useCallback } from "react";
import { ShareContext, ShareTodoPayload } from "../context/shareContext";
import axios from "../services/axios";

export function ShareProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yourShareTodos, setYourShareTodos] = useState<any[]>([]);

  // Share todo
  const shareTodo = async (data: ShareTodoPayload) => {
    try {
      setLoading(true);
      setError(null);
      await axios.post("/share-todo/share", data);
    } catch (err: any) {
      console.error("Gagal membagikan todo:", err);
      setError(err.response?.data?.message || "Gagal membagikan todo");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch todos yang dibagikan oleh user (YourShare)
  const fetchYourShare = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/share-todo/my-shared-todos");
      setYourShareTodos(res.data.data || []);
    } catch (err: any) {
      console.error("Gagal memuat Your Share:", err);
      setError(err.response?.data?.message || "Gagal memuat Your Share");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ShareContext.Provider
      value={{
        loading,
        error,
        shareTodo,
        fetchYourShare,
        yourShareTodos,
      }}
    >
      {children}
    </ShareContext.Provider>
  );
}
