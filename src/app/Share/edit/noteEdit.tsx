"use client";

import { useState, useEffect } from "react";
import { useNote } from "../../../../hooks/useNote";
import { useShare } from "../../../../hooks/useShare";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";

interface EditSharedNoteProps {
  todo: {
    id: number;
    title: string;
    description?: string;
    dueDate?: string;
    priority: number;
    isCompleted?: boolean;
  };
  onClose: () => void;
}

export function EditSharedNote({ todo, onClose }: EditSharedNoteProps) {
  const { updateTodo } = useNote();
  const { fetchSharedToMe } = useShare();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: 0,
    isCompleted: false,
  });

  // CKEditor config only for needed toolbar items
  const editorConfig: any = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "subscript",
        "superscript",
        "link",
        "|",
        "fontFamily",
        "fontSize",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "alignment",
        "outdent",
        "indent",
        "bulletedList",
        "numberedList",
        "todoList",
        "|",
        "blockQuote",
        "code",
        "codeBlock",
        "|",
        "insertTable",
        "imageUpload",
        "mediaEmbed",
        "horizontalLine",
        "pageBreak",
        "|",
        "undo",
        "redo",
        "removeFormat",
      ],
    },
    alignment: {
      options: ["left", "center", "right", "justify"],
    },
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
    image: {
      toolbar: [
        "imageStyle:inline",
        "imageStyle:alignLeft",
        "imageStyle:alignCenter",
        "imageStyle:alignRight",
        "imageTextAlternative",
      ],
    },
  };

  const [isOpen, setIsOpen] = useState(true);

  // Sync formData when todo changes
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || "",
        description: todo.description || "",
        dueDate: todo.dueDate
          ? new Date(todo.dueDate).toISOString().split("T")[0]
          : "",
        priority: todo.priority ?? 0,
        isCompleted: todo.isCompleted ?? false,
      });
    }
  }, [todo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "priority"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTodo(todo.id, formData); // Send all fields
      await fetchSharedToMe();
      setIsOpen(false);
      onClose();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Todo updated successfully!",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "An error occurred while updating the todo.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-full">
        <h2 className="text-xl font-bold mb-4">Edit Shared Todo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Description CKEditor */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <div className="border rounded-md p-1 [&_.ck-editor__editable_inline]:min-h-[150px]">
              <CKEditor
                editor={ClassicEditor as any}
                data={formData.description}
                onChange={(_, editor) => {
                  const value = editor.getData();
                  setFormData((prev) => ({ ...prev, description: value }));
                }}
                config={editorConfig}
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block font-medium mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block font-medium mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value={0}>Low Priority</option>
              <option value={1}>Medium Priority</option>
              <option value={2}>High Priority</option>
            </select>
          </div>

          {/* Completed */}
          <div>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="isCompleted"
                checked={formData.isCompleted}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span>Completed</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onClose();
              }}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
