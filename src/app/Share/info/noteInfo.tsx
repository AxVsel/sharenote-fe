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
import { useState, useEffect } from "react";

type TodoProps = {
  todo: {
    id: number;
    title: string;
    description?: string;
    dueDate?: string;
    priority: number;
    isCompleted?: boolean;
    isShared?: boolean;
  };
};

export function InfoNote({ todo }: TodoProps) {
  const [open, setOpen] = useState(false);

  const priorityLabel =
    todo.priority === 2
      ? "High Priority"
      : todo.priority === 1
      ? "Medium Priority"
      : "Low Priority";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">
          Info
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Todo Details</DialogTitle>
          <DialogDescription>
            You can view the details of this todo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 text-gray-700">
          <div>
            <span className="font-semibold">Title:</span> {todo.title}
          </div>

          <div>
            <span className="font-semibold">Description:</span>{" "}
            {todo.description || "No description"}
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

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
