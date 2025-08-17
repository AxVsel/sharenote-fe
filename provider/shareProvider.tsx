"use client";

import { useState, useCallback } from "react";
import { ShareContext, ShareTodoPayload } from "../context/shareContext";
import axios from "../services/axios";

export function ShareProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yourShareTodos, setYourShareTodos] = useState<any[]>([]);
  const [sharedToMeTodos, setSharedToMeTodos] = useState<any[]>([]);

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

  const updateShareTodo = async (data: {
    todoId: number;
    sharedWithUserId: number;
    canEdit: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.put("/share-todo/share/permission", data);
      return res.data;
    } catch (err: any) {
      console.error("Gagal update share todo:", err);
      setError(err.response?.data?.message || "Gagal update share todo");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //   const unshareTodo = async (shareId: number) => {
  //   try {
  //     await axios.delete(`/share-todo/unshare/${shareId}`);
  //     // update state SharedToMe
  //     setSharedToMeTodos((prev) => prev.filter((s) => s.id !== shareId));
  //     // update state YourShare (kalau perlu)
  //     setYourShareTodos((prev) =>
  //       prev.map((todo) => ({
  //         ...todo,
  //         sharedWith: todo.sharedWith.filter((s) => s.id !== shareId),
  //       }))
  //     );
  //   } catch (err) {
  //     console.error(err);
  //     throw err;
  //   }
  // };
  const unshareTodo = async (shareId: number) => {
    try {
      await axios.delete(`/share-todo/unshare/${shareId}`);
      await fetchYourShare();
      await fetchSharedToMe();
    } catch (err: any) {
      console.error("Gagal unshare todo:", err);
      setError(err.response?.data?.message || "Gagal unshare todo");
      throw err;
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

  const fetchSharedToMe = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/share-todo/shared-to-me");
      setSharedToMeTodos(res.data.todos || []);
    } catch (err: any) {
      console.error("Gagal memuat shared-to-me:", err);
      setError(err.response?.data?.message || "Gagal memuat shared-to-me");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ShareContext.Provider
      value={{
        loading,
        error,
        unshareTodo,
        shareTodo,
        updateShareTodo,
        fetchYourShare,
        yourShareTodos,
        fetchSharedToMe,
        sharedToMeTodos,
      }}
    >
      {children}
    </ShareContext.Provider>
  );
}
