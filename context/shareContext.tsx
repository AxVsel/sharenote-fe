"use client";
import { createContext } from "react";

export interface ShareTodoPayload {
  todoId: number;
  sharedToId: number;
}

export interface ShareContextType {
  loading: boolean;
  error: string | null;
  shareTodo: (data: ShareTodoPayload) => Promise<void>;

  // Tambahan untuk YourShare
  fetchYourShare: () => Promise<void>;
  yourShareTodos: any[];
}

export const ShareContext = createContext<ShareContextType>({
  loading: false,
  error: null,
  shareTodo: async () => {},

  // Default value tambahan
  fetchYourShare: async () => {},
  yourShareTodos: [],
});
