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
import { useState } from "react";
import { useShare } from "../../../../hooks/useShare";

type ShareTodoProps = {
  todoId: number;
};

export function ShareTodo({ todoId }: ShareTodoProps) {
  const { shareTodo, loading } = useShare();
  const [formData, setFormData] = useState({
    todoId: String(todoId),
    sharedWithEmail: "",
    canEdit: false, // default: false
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const showAlertAfterClose = async (options: any) => {
    setIsOpen(false);
    setTimeout(() => {
      Swal.fire(options);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.sharedWithEmail)) {
      return showAlertAfterClose({
        icon: "warning",
        title: "Format Email Salah",
        text: "Masukkan format email yang benar.",
      });
    }

    try {
      await shareTodo({
        todoId: Number(formData.todoId),
        sharedWithEmail: formData.sharedWithEmail,
        canEdit: formData.canEdit, // tetap dikirim (false)
      });

      setFormData({
        todoId: String(todoId),
        sharedWithEmail: "",
        canEdit: false,
      });

      showAlertAfterClose({
        icon: "success",
        title: "Berhasil",
        text: "Todo berhasil dibagikan ✅",
      });
    } catch (err: any) {
      const status = err.response?.status;

      if (status === 404) {
        showAlertAfterClose({
          icon: "error",
          title: "Email Tidak Ditemukan",
          text: err.response.data.message || "User dengan email ini tidak ada.",
        });
      } else if (status === 409) {
        showAlertAfterClose({
          icon: "info",
          title: "Sudah Dibagikan",
          text: "Todo sudah dibagikan ke user ini sebelumnya.",
        });
      } else if (status === 403) {
        showAlertAfterClose({
          icon: "error",
          title: "Tidak Diizinkan",
          text: err.response.data.message,
        });
      } else {
        showAlertAfterClose({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat membagikan todo.",
        });
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          setFormData((prev) => ({ ...prev, todoId: String(todoId) }));
          setErrorMsg("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Share Todo</DialogTitle>
            <DialogDescription>
              Masukkan email tujuan untuk membagikan todo ini.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            {/* Hidden Todo ID */}
            <input type="hidden" name="todoId" value={formData.todoId} />

            {/* Email Tujuan */}
            <div className="grid gap-2">
              <Label htmlFor="sharedWithEmail">Email Tujuan</Label>
              <Input
                id="sharedWithEmail"
                name="sharedWithEmail"
                type="email"
                placeholder="Masukkan email user"
                value={formData.sharedWithEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sharedWithEmail: e.target.value,
                  })
                }
              />
            </div>

            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Menyimpan..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
