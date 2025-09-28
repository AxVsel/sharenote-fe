"use client";

import ProtectedRoute from "../protect/ProtectRoute";
import { useNote } from "../../../hooks/useNote";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import EditNote from "./edit/noteEdit";
import { ShareTodo } from "./share/ShareTodo";
import Swal from "sweetalert2";
import Link from "next/link";

export default function Note() {
  const { todos, fetchTodos, deleteTodo, loading } = useNote();
  const [selectedTodo, setSelectedTodo] = useState<any | null>(null);

  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [priority, setPriority] = useState("all");
  const [page, setPage] = useState(1);

  // setiap kali filter berubah, panggil fetchTodos
  useEffect(() => {
    fetchTodos({
      page,
      sortBy: sortBy as "newest" | "oldest",
      isCompleted:
        filterStatus === "completed"
          ? true
          : filterStatus === "notCompleted"
          ? false
          : undefined,
      priority: priority !== "all" ? Number(priority) : "all",
    });
  }, [fetchTodos, page, sortBy, filterStatus, priority]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete?",
      text: "Deleted data cannot be recovered.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteTodo(id);
        await fetchTodos({
          page,
          sortBy: sortBy as "newest" | "oldest",
          priority: priority === "all" ? "all" : Number(priority),
          isCompleted: undefined,
        });

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Todo deleted successfully.",
        });
      } catch (err: any) {
        console.error("Failed to delete todo", err);
        if (err.response?.status === 403) {
          Swal.fire({
            icon: "info",
            title: "Todo is Being Shared",
            text: "This todo is currently shared with another user. Please unshare it first on the YourShare page.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: "An error occurred while deleting the todo.",
          });
        }
      }
    }
  };
  return (
    <ProtectedRoute>
      <div className="flex flex-col justify-center items-center">
        <div className="mt-2">
          <h1 className="text-2xl font-bold text-gray-800 mt-6 mb-4">
            Your Own Notes
          </h1>
        </div>
        <div className="mt-2">
          <Link
            href="/addNote"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            Add Note
          </Link>
        </div>
        <div className=" h-auto w-full p-3 rounded-lg flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            {/* Filter Completed */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm"
            >
              <option value="all">All Todos</option>
              <option value="completed">Completed</option>
              <option value="notCompleted">Not Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm"
            >
              <option value="all">All Priority</option>
              <option value="2">High Priority</option>
              <option value="1">Medium Priority</option>
              <option value="0">Low Priority</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm"
            >
              <option value="newest">Sort by Newest</option>
              <option value="oldest">Sort by Oldest</option>
            </select>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
        {/* Loading & data state */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-gray-500">No notes have been created yet</p>
        ) : (
          <div className="w-full p-5 h-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-4">
              {todos.map((todo) => (
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
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3" hidden>
                    {todo.description || "No description available"}
                  </p>

                  {/* Priority & Due Date */}
                  <div className="flex items-center justify-between mt-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        todo.priority === 2
                          ? "bg-red-100 text-red-700"
                          : todo.priority === 1
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {todo.priority === 2
                        ? "High Priority"
                        : todo.priority === 1
                        ? "Medium Priority"
                        : "Low Priority"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {todo.dueDate
                        ? `Due: ${new Date(todo.dueDate).toLocaleDateString()}`
                        : "No due date"}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-2 mt-5">
                    <Button
                      onClick={() => setSelectedTodo(todo)}
                      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                    >
                      Edit Note
                    </Button>

                    <ShareTodo todoId={todo.id} />
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTodo && (
          <EditNote
            todo={selectedTodo}
            onClose={() => {
              setSelectedTodo(null);
              fetchTodos(); // refresh list after editing
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
