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
import { useState } from "react";

type ShareTodoProps = {
  todoId: number;
  sharedWithUserId?: number;
};

export function ShareTodo({ todoId, sharedWithUserId }: ShareTodoProps) {
  const [formData, setFormData] = useState({
    todoId: todoId.toString(),
    sharedWithUserId: sharedWithUserId ? sharedWithUserId.toString() : "",
    canEdit: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // kirim ke backend
    console.log("Submit Share:", formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Share Todo</DialogTitle>
            <DialogDescription>
              Bagikan todo ke user lain dan tentukan izin edit.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            {/* Todo ID */}
            <div className="grid gap-2">
              <Label htmlFor="todoId">Todo ID</Label>
              <Input id="todoId" value={formData.todoId} readOnly />
            </div>

            {/* Shared With User ID */}
            <div className="grid gap-2">
              <Label htmlFor="sharedWithUserId">User ID Tujuan</Label>
              <Input
                id="sharedWithUserId"
                value={formData.sharedWithUserId}
                readOnly
              />
            </div>

            {/* Can Edit */}
            <div className="grid gap-2">
              <Label htmlFor="canEdit">Boleh Edit?</Label>
              <select
                id="canEdit"
                value={formData.canEdit ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    canEdit: e.target.value === "true",
                  })
                }
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
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
