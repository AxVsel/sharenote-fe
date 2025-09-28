"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface InfoNoteModalProps {
  todo: {
    id: number;
    title: string;
    description?: string;
    dueDate?: string;
    priority: number;
    isCompleted?: boolean;
    isShared?: boolean;
  };
  onClose: () => void;
}

export function InfoNoteModal({ todo, onClose }: InfoNoteModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const priorityLabel =
    todo.priority === 2
      ? "High Priority"
      : todo.priority === 1
      ? "Medium Priority"
      : "Low Priority";

  useEffect(() => {
    if (!isOpen) onClose();
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-full">
        <h2 className="text-xl font-bold mb-4">Todo Details</h2>

        <div className="space-y-4 text-gray-700">
          {/* Title */}
          <div>
            <span className="font-semibold">Title:</span> {todo.title}
          </div>

          {/* Description */}
          <div>
            <span className="font-semibold">Description:</span>
            <div className="border p-2 rounded-md bg-gray-50 mt-1">
              <CKEditor
                editor={ClassicEditor as any}
                data={todo.description || ""}
                disabled={true} // read-only
                config={{
                  toolbar: [], // kosongkan toolbar
                }}
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <span className="font-semibold">Due Date:</span>{" "}
            {todo.dueDate
              ? new Date(todo.dueDate).toLocaleDateString()
              : "No due date"}
          </div>

          {/* Priority */}
          <div>
            <span className="font-semibold">Priority:</span> {priorityLabel}
          </div>

          {/* Completed */}
          <div>
            <span className="font-semibold">Completed:</span>{" "}
            {todo.isCompleted ? "Yes" : "No"}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
