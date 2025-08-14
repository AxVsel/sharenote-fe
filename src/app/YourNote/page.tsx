"use client";

import ProtectedRoute from "../protect/ProtectRoute";
import { useNote } from "../../../hooks/useNote";
import { useEffect } from "react";
import { AddNote } from "./add/noteAdd";
import { EditNote } from "./edit/noteEdit";
import { ShareTodo } from "./share/ShareTodo";
import Swal from "sweetalert2";

export default function Note() {
  const { todos, fetchTodos, deleteTodo } = useNote();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // fungsi hapus dengan konfirmasi sweetalert
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang sudah dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteTodo(id);
        await fetchTodos();
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Todo berhasil dihapus.",
        });
      } catch (err: any) {
        console.error("Gagal menghapus todo", err);

        // Cek apakah error dari backend adalah 403
        if (err.response?.status === 403) {
          Swal.fire({
            icon: "info",
            title: "Todo Sedang Dibagikan",
            text: "Todos sedang di-share ke user lain. Silakan unshare dulu di halaman YourShare.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Terjadi kesalahan saat menghapus todo.",
          });
        }
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col justify-center items-center">
        <div className="mt-2">
          <AddNote />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-4">
          {todos.map((todo) => {
            const priorityStyles =
              todo.priority === 2
                ? "bg-red-100 text-red-700"
                : todo.priority === 1
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700";

            const priorityLabel =
              todo.priority === 2
                ? "High Priority"
                : todo.priority === 1
                ? "Medium Priority"
                : "Low Priority";

            return (
              <div
                key={todo.id}
                className={`bg-white rounded-xl shadow-lg border border-gray-200 p-5 transition-transform transform hover:scale-[1.02] hover:shadow-xl ${
                  todo.isCompleted ? "border-2 border-green-600" : ""
                }`}
              >
                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {todo.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {todo.description || "No description available"}
                </p>

                {/* Priority & Due Date */}
                <div className="flex items-center justify-between mt-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${priorityStyles}`}
                  >
                    {priorityLabel}
                  </span>
                  <span className="text-xs text-gray-500">
                    {todo.dueDate ? `Due: ${todo.dueDate}` : "No due date"}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-5">
                  <EditNote
                    todo={todo}
                    onClose={() => {
                      fetchTodos();
                    }}
                  />
                  <ShareTodo todoId={todo.id} />
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}
