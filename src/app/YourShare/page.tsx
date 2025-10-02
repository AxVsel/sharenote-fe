"use client";

import Swal from "sweetalert2";
import { useEffect, useContext } from "react";
import ProtectedRoute from "../protect/ProtectRoute";
import { ShareEdit } from "./edit/shreEdit";
import { ShareContext } from "../../../context/shareContext";

export default function YourShare() {
  const { fetchYourShare, yourShareTodos, loading, unshareTodo } =
    useContext(ShareContext);

  useEffect(() => {
    fetchYourShare();
  }, [fetchYourShare]);

  const handleUnshare = async (shareId: number) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure you want to unshare?",
        text: "The note will be removed from the shared user's list.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Unshare!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await unshareTodo(shareId);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "The note has been successfully unshared.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "An error occurred while unsharing the note.",
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col justify-center items-center w-full px-6">
        <h1 className="text-2xl font-bold text-gray-800 mt-6 mb-4">
          Your Shared Notes
        </h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {yourShareTodos.length > 0 ? (
              yourShareTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 transition-transform hover:scale-[1.02] hover:shadow-xl"
                >
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {todo.title}
                  </h2>
                  <p className="text-gray-700 text-sm mt-2 line-clamp-3" hidden>
                    {todo.description}
                  </p>
                  <p className="mt-3 text-sm">
                    <span className="font-medium text-gray-600">
                      Shared To:
                    </span>{" "}
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {todo.sharedToName}
                    </span>
                  </p>
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
                  <div className="flex justify-end gap-2 mt-5">
                    <ShareEdit
                      todoId={todo.id}
                      sharedWithUserId={
                        todo.sharedWith.length > 0
                          ? todo.sharedWith[0].sharedWithUserId
                          : undefined
                      }
                    />
                    <button
                      onClick={() =>
                        todo.sharedWith.length > 0 &&
                        handleUnshare(todo.sharedWith[0].id)
                      }
                      className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                    >
                      Unshare
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No shared notes yet.</p>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
