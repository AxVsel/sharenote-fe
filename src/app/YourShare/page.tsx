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
        title: "Yakin ingin unshare?",
        text: "Todo akan dihapus dari daftar shared user.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Unshare!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await unshareTodo(shareId);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Todo berhasil di-unshare.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat unshare todo.",
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full">
            {yourShareTodos.length > 0 ? (
              yourShareTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 transition-transform hover:scale-[1.02] hover:shadow-xl"
                >
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {todo.title}
                  </h2>
                  <p className="text-gray-700 text-sm mt-2 line-clamp-3">
                    {todo.description}
                  </p>
                  <p className="mt-3 text-sm">
                    <span className="font-medium text-gray-600">Share To:</span>{" "}
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
              <p className="text-gray-500">Belum ada catatan yang dibagikan.</p>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
