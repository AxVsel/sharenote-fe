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
import { useState } from "react";
import { useNote } from "../../../../hooks/useNote";

export function AddNote() {
  const { addTodo, fetchTodos } = useNote();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: 0,
  });

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
      setOpen(false);
    } catch (err) {
      console.error("Gagal menambahkan todo", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
          Add Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Todo</DialogTitle>
            <DialogDescription>
              Fill in the details for your new todo item.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter todo title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter todo description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

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
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
