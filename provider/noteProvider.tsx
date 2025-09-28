"use client";

import { useState, useCallback } from "react";
import { NoteContext, Todo } from "../context/noteContext";
import axios from "../services/axios";

export function NoteProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  interface FetchTodosOptions {
    page?: number;
    limit?: number;
    sortBy?: "newest" | "oldest";
    isCompleted?: boolean;
    priority?: number | "all";
  }

  const fetchTodos = useCallback(async (options: FetchTodosOptions = {}) => {
    setLoading(true);
    try {
      const {
        page = 1,
        limit = 8,
        sortBy = "newest",
        isCompleted,
        priority,
      } = options;

      const params: any = {
        page,
        limit,
        sortBy,
      };

      if (typeof isCompleted === "boolean") params.isCompleted = isCompleted;
      if (priority !== undefined && priority !== "all")
        params.priority = priority;

      const res = await axios.get("/todo/todos", { params });
      setTodos(res.data.data || []); // <- backend return { data, pagination }
    } catch (error) {
      console.error("Gagal fetch todos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = async (data: Omit<Todo, "id" | "isCompleted">) => {
    try {
      const res = await axios.post("/todo/todos", data);
      setTodos((prev) => [...prev, res.data.newTodo]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteTodo = useCallback(async (id: number): Promise<void> => {
    try {
      await axios.delete(`/todo/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      throw error; // biar bisa ditangani di komponen pemanggil
    }
  }, []);

  const updateTodo = useCallback(async (id: number, updates: Partial<Todo>) => {
    try {
      const payload = {
        ...updates,
        dueDate: updates.dueDate ? new Date(updates.dueDate) : null,
      };
      const res = await axios.put(`/todo/todos/${id}`, payload);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...res.data.todo } : t))
      );
    } catch (error) {
      console.error("Gagal update todo:", error);
    }
  }, []);

  const updateSharedTodo = useCallback(
    async (id: number, updates: Partial<Todo>) => {
      try {
        const payload = {
          ...updates,
          dueDate: updates.dueDate ? new Date(updates.dueDate) : null,
        };
        const res = await axios.put(`/todos-share/${id}`, payload); // panggil endpoint shared todo
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...res.data } : t))
        );
      } catch (error) {
        console.error("Gagal update shared todo:", error);
      }
    },
    []
  );

  return (
    <NoteContext.Provider
      value={{
        todos,
        loading,
        fetchTodos,
        addTodo,
        deleteTodo,
        updateTodo,
        updateSharedTodo,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}
