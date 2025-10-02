"use client";
import { createContext } from "react";

export interface ShareTodoPayload {
  todoId: number;
  sharedWithEmail: string;
  canEdit?: boolean;
}

export interface ShareContextType {
  loading: boolean;
  error: string | null;
  shareTodo: (data: ShareTodoPayload) => Promise<void>;

  fetchYourShare: () => Promise<void>;
  yourShareTodos: any[];

  fetchSharedToMe: () => Promise<void>;
  sharedToMeTodos: any[];

  updateShareTodo: (data: {
    todoId: number;
    sharedWithUserId: number;
    canEdit: boolean;
  }) => Promise<any>;
  unshareTodo: (shareId: number) => Promise<void>;
}

export const ShareContext = createContext<ShareContextType>({
  loading: false,
  error: null,
  shareTodo: async () => {},

  fetchYourShare: async () => {},
  yourShareTodos: [],

  fetchSharedToMe: async () => {},
  sharedToMeTodos: [],

  updateShareTodo: async () => {},
  unshareTodo: async () => {},
});
