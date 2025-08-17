"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useNote } from "../../../../hooks/useNote";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

type TodoFormProps = {
  todo: {
    id: number;
    title: string;
    description?: string;
    dueDate?: string;
    priority: number;
    isCompleted?: boolean;
  };
  onClose?: () => void;
};

export function EditNote({ todo, onClose }: TodoFormProps) {
  const { updateTodo, fetchTodos } = useNote();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: 0,
    isCompleted: false,
  });

  // Isi formData saat modal dibuka
  useEffect(() => {
    if (open && todo) {
      setFormData({
        title: todo.title || "",
        description: todo.description || "",
        dueDate: todo.dueDate
          ? new Date(todo.dueDate).toISOString().split("T")[0]
          : "",
        priority: todo.priority || 0,
        isCompleted: todo.isCompleted || false,
      });
    }
  }, [open, todo]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      await fetchTodos();
      setOpen(false);
      onClose?.();

      // ✅ SweetAlert sukses
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Catatan berhasil diperbarui!",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      console.error("Gagal menyimpan todo", err);

      // ✅ SweetAlert error
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat memperbarui catatan.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
            <DialogDescription>
              Fill in the details for your todo item.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Title */}
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Due Date */}
            <div className="grid gap-3">
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
            <div className="grid gap-3">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Low Priority</option>
                <option value={1}>Medium Priority</option>
                <option value={2}>High Priority</option>
              </select>
            </div>

            {/* Completed */}
            <div className="grid gap-3">
              <Label htmlFor="isCompleted">Completed</Label>
              <input
                id="isCompleted"
                name="isCompleted"
                type="checkbox"
                checked={formData.isCompleted}
                onChange={handleChange}
                className="w-5 h-5"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
