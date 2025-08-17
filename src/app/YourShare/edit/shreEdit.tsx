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

  // Helper untuk menutup modal lalu menampilkan SweetAlert
  const showAlertAfterClose = async (options: any) => {
    setIsOpen(false);
    setTimeout(() => {
      Swal.fire(options);
    }, 300); // beri jeda agar modal sudah tertutup
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
        title: "Berhasil",
        text: "Permission berhasil diupdate ✅",
      });
    } catch (err: any) {
      console.error(err);

      showAlertAfterClose({
        icon: "error",
        title: "Gagal",
        text:
          err.response?.data?.message ||
          "Terjadi kesalahan saat update permission",
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
            <DialogTitle>Share Todo</DialogTitle>
            <DialogDescription>
              Bagikan todo ke user lain dan tentukan izin edit.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="todoId">Todo ID</Label>
              <Input id="todoId" value={formData.todoId} readOnly />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sharedWithUserId">User ID Tujuan</Label>
              <Input
                id="sharedWithUserId"
                value={formData.sharedWithUserId}
                readOnly
              />
            </div>

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
