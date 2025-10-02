"use client";

import { useEffect, useContext, useState } from "react";
import ProtectedRoute from "../protect/ProtectRoute";
import { ShareContext } from "../../../context/shareContext";
import { EditSharedNote } from "./edit/noteEdit";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface InfoNoteModalProps {
  todo: any;
  onClose: () => void;
}

function InfoNoteModal({ todo, onClose }: InfoNoteModalProps) {
  const priorityLabel =
    todo.priority === 2
      ? "High Priority"
      : todo.priority === 1
      ? "Medium Priority"
      : "Low Priority";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-full">
        <h2 className="text-xl font-bold mb-4">Todo Details</h2>

        <div className="space-y-4 text-gray-700">
          <div>
            <span className="font-semibold">Title:</span> {todo.title}
          </div>

          <div>
            <span className="font-semibold">Description:</span>
            <div className="border p-2 rounded-md bg-gray-50 mt-1">
              <CKEditor
                editor={ClassicEditor as any}
                data={todo.description || ""}
                disabled={true}
                config={{ toolbar: [] }}
              />
            </div>
          </div>

          <div>
            <span className="font-semibold">Due Date:</span>{" "}
            {todo.dueDate
              ? new Date(todo.dueDate).toLocaleDateString()
              : "No due date"}
          </div>

          <div>
            <span className="font-semibold">Priority:</span> {priorityLabel}
          </div>

          <div>
            <span className="font-semibold">Completed:</span>{" "}
            {todo.isCompleted ? "Yes" : "No"}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SharedToMe() {
  const { fetchSharedToMe, sharedToMeTodos, loading, unshareTodo } =
    useContext(ShareContext);
  const [selectedTodo, setSelectedTodo] = useState<any | null>(null);
  const [infoTodo, setInfoTodo] = useState<any | null>(null);

  useEffect(() => {
    fetchSharedToMe();
  }, [fetchSharedToMe]);

  const handleUnshare = async (shareId: number) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure you want to remove?",
        text: "The shared todo will be removed from your shared list.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Remove!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await unshareTodo(shareId);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Todo has been removed.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "An error occurred while removing the todo.",
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col justify-center items-center w-full px-6">
        <h1 className="text-2xl font-bold text-gray-800 mt-6 mb-4">
          Todos Shared With Me
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full">
            {sharedToMeTodos.length > 0 ? (
              sharedToMeTodos.map((shared: any) => {
                const todo = shared.todo;
                const canEdit = shared.canEdit;
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
                    className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 transition-transform hover:scale-[1.02] hover:shadow-xl"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 truncate">
                      {todo.title}
                    </h2>
                    <p
                      hidden
                      className="text-gray-700 text-sm mt-2 line-clamp-3"
                    >
                      {todo.description || "No description available"}
                    </p>

                    <p className="mt-3 text-sm">
                      <span className="font-medium text-gray-600">
                        Shared By:
                      </span>{" "}
                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {todo.owner.username}
                      </span>
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${priorityStyles}`}
                      >
                        {priorityLabel}
                      </span>
                      <span className="text-xs text-gray-500">
                        {todo.dueDate
                          ? `Due: ${new Date(
                              todo.dueDate
                            ).toLocaleDateString()}`
                          : "No due date"}
                      </span>
                    </div>

                    <div className="flex justify-end gap-2 mt-5">
                      {canEdit ? (
                        <Button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                          onClick={() => setSelectedTodo(todo)}
                        >
                          Edit
                        </Button>
                      ) : (
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                          onClick={() => setInfoTodo(todo)}
                        >
                          Info
                        </Button>
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
              })
            ) : (
              <p className="text-gray-500">
                No todos have been shared with you yet.
              </p>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {selectedTodo && (
          <EditSharedNote
            todo={selectedTodo}
            onClose={() => setSelectedTodo(null)}
          />
        )}

        {/* Info Modal */}
        {infoTodo && (
          <InfoNoteModal todo={infoTodo} onClose={() => setInfoTodo(null)} />
        )}
      </div>
    </ProtectedRoute>
  );
}
