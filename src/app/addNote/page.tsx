"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNote } from "../../../hooks/useNote";

import Swal from "sweetalert2";

export default function AddNotePage() {
  const { addTodo, fetchTodos } = useNote();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: 0,
  });

  // editor configuration
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTodo(formData);
      await fetchTodos();
      setFormData({ title: "", description: "", dueDate: "", priority: 0 });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Note has been successfully added!",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        router.push("/YourNote"); // redirect to notes page
      }, 2000);
    } catch (err) {
      console.error("Failed to add todo", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "An error occurred while adding the note.",
      });
    }
  };

  return (
    <div className="w-full mt-5">
      <div className="w-3/5 mx-auto p-6 bg-stone-100 shadow-2xl rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Add New Note</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter note title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description (CKEditor full width) */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="w-full [&_.ck-editor__editable_inline]:min-h-[200px] [&_.ck-editor__editable_inline]:w-full">
              <CKEditor
                editor={ClassicEditor as any}
                data={formData.description}
                onChange={(_, editor) => {
                  const value = editor.getData();
                  setFormData({ ...formData, description: value });
                }}
                config={editorConfig}
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
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

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
