"use client";

import Swal from "sweetalert2";
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
import { useState, useContext } from "react";
import { ShareContext } from "../../../../context/shareContext";

type ShareTodoProps = {
  todoId: number;
  sharedWithUserId?: number;
};

export function ShareEdit({ todoId, sharedWithUserId }: ShareTodoProps) {
  const { updateShareTodo } = useContext(ShareContext);

  const [formData, setFormData] = useState({
    todoId: todoId.toString(),
    sharedWithUserId: sharedWithUserId ? sharedWithUserId.toString() : "",
    canEdit: false,
  });

  const [isOpen, setIsOpen] = useState(false);

  // Helper to close the modal and then show SweetAlert
  const showAlertAfterClose = async (options: any) => {
    setIsOpen(false);
    setTimeout(() => {
      Swal.fire(options);
    }, 300); // small delay to ensure modal is closed first
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.sharedWithUserId) return;

      await updateShareTodo({
        todoId: Number(formData.todoId),
        sharedWithUserId: Number(formData.sharedWithUserId),
        canEdit: formData.canEdit,
      });

      showAlertAfterClose({
        icon: "success",
        title: "Success",
        text: "Permission updated successfully ✅",
      });
    } catch (err: any) {
      console.error(err);

      showAlertAfterClose({
        icon: "error",
        title: "Failed",
        text:
          err.response?.data?.message ||
          "An error occurred while updating permission",
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          setFormData((prev) => ({ ...prev, todoId: String(todoId) }));
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Shared Todo</DialogTitle>
            <DialogDescription>
              Update sharing settings and set edit permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            <Input hidden id="todoId" value={formData.todoId} readOnly />
            <Input
              id="sharedWithUserId"
              hidden
              value={formData.sharedWithUserId}
              readOnly
            />

            <div className="grid gap-2">
              <Label htmlFor="canEdit">Allow Edit?</Label>
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
                <option disabled>Select</option>
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
