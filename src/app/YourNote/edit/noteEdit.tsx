import { useState, useEffect } from "react";
import { useNote } from "../../../../hooks/useNote";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2"; // ✅ for success/error alert

interface EditNoteProps {
  todo: any;
  onClose: () => void;
}

export default function EditNote({ todo, onClose }: EditNoteProps) {
  const { updateTodo, fetchTodos } = useNote();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: 0,
    isCompleted: false,
  });

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
      await updateTodo(todo.id, formData);
      await fetchTodos?.(); // refresh if available
      onClose();

      // ✅ Success alert
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Note has been updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to update todo", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "An error occurred while updating the note.",
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/5 max-w-full">
        <h2 className="text-xl font-bold mb-4">Edit Note</h2>

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

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <CKEditor
              editor={ClassicEditor as any}
              data={formData.description}
              onChange={(_, editor) => {
                const value = editor.getData();
                setFormData((prev) => ({ ...prev, description: value }));
              }}
              config={{
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "blockQuote",
                  "|",
                  "alignment",
                  "outdent",
                  "indent",
                  "|",
                  "fontColor",
                  "fontBackgroundColor",
                  "highlight",
                  "removeFormat",
                  "|",
                  "insertTable",
                  "mediaEmbed",
                  "imageUpload",
                  "horizontalLine",
                  "|",
                  "undo",
                  "redo",
                ],
              }}
            />
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
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
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
