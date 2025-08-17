"use client";

import { useEffect, useContext } from "react";
import ProtectedRoute from "../protect/ProtectRoute";
import { ShareContext } from "../../../context/shareContext";
import { EditNote } from "./edit/noteEdit";
import { InfoNote } from "./info/noteInfo";
import Swal from "sweetalert2";

export default function SharedToMe() {
  const { fetchSharedToMe, sharedToMeTodos, loading, unshareTodo } =
    useContext(ShareContext);

  useEffect(() => {
    fetchSharedToMe(); // panggil endpoint /shared-to-me
  }, [fetchSharedToMe]);

  const handleUnshare = async (shareId: number) => {
    try {
      const result = await Swal.fire({
        title: "Yakin ingin Menghapus?",
        text: "Todo yang di share akan dihapus dari daftar share kamu.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await unshareTodo(shareId);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Todo berhasil di Hapus.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat Hapus todo.",
      });
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <ProtectedRoute>
      <div className="flex flex-col justify-center items-center w-full px-6">
        <h1 className="text-2xl font-bold text-gray-800 mt-6 mb-4">
          Todos Shared To Me
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full">
          {sharedToMeTodos.length === 0 && (
            <p className="text-gray-500">
              Belum ada todo yang dibagikan ke kamu.
            </p>
          )}

          {sharedToMeTodos.map((shared: any) => {
            const todo = shared.todo;
            const canEdit = shared.canEdit; // ambil info permission
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
                key={shared.id}
                className="max-w-sm bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {todo.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {todo.description || "No description available"}
                </p>

                <p className="mt-3 text-sm">
                  <span className="font-medium text-gray-600">Share By:</span>{" "}
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {todo.owner.username}
                  </span>
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${priorityStyles}`}
                  >
                    {priorityLabel}
                  </span>
                  <span className="text-xs text-gray-500">
                    {todo.dueDate
                      ? `Due: ${new Date(todo.dueDate).toLocaleDateString()}`
                      : "No due date"}
                  </span>
                </div>

                <div className="flex justify-end gap-2 mt-5">
                  {canEdit ? (
                    <EditNote todo={todo} />
                  ) : (
                    <InfoNote todo={todo} />
                  )}
                  <button
                    onClick={() => handleUnshare(shared.id)}
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                  >
                    Unshare
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
