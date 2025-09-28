"use client";

import { createContext } from "react";

export type Todo = {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  priority: number;
};

export interface FetchTodosOptions {
  page?: number;
  limit?: number;
  sortBy?: "newest" | "oldest";
  isCompleted?: boolean;
  priority?: number | "all";
}

export type NoteContextType = {
  todos: Todo[];
  loading: boolean;
  fetchTodos: (options?: FetchTodosOptions) => Promise<void>;
  addTodo: (data: Omit<Todo, "id" | "isCompleted">) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  updateTodo: (id: number, updates: Partial<Todo>) => Promise<void>;
  updateSharedTodo: (id: number, updates: Partial<Todo>) => Promise<void>;
};

export const NoteContext = createContext<NoteContextType>({
  todos: [],
  loading: false,
  fetchTodos: async () => {},
  addTodo: async () => {},
  deleteTodo: async () => {},
  updateTodo: async () => {},
  updateSharedTodo: async () => {},
});
