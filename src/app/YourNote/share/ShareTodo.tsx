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
        title: "Invalid Email Format",
        text: "Please enter a valid email address.",
      });
    }

    try {
      await shareTodo({
        todoId: Number(formData.todoId),
        sharedWithEmail: formData.sharedWithEmail,
        canEdit: formData.canEdit,
      });

      setFormData({
        todoId: String(todoId),
        sharedWithEmail: "",
        canEdit: false,
      });

      showAlertAfterClose({
        icon: "success",
        title: "Success",
        text: "Todo has been successfully shared ✅",
      });
    } catch (err: any) {
      const status = err.response?.status;

      if (status === 404) {
        showAlertAfterClose({
          icon: "error",
          title: "Email Not Found",
          text: err.response.data.message || "No user found with this email.",
        });
      } else if (status === 409) {
        showAlertAfterClose({
          icon: "info",
          title: "Already Shared",
          text: "This todo has already been shared with this user.",
        });
      } else if (status === 403) {
        showAlertAfterClose({
          icon: "error",
          title: "Not Allowed",
          text: err.response.data.message,
        });
      } else {
        showAlertAfterClose({
          icon: "error",
          title: "Failed",
          text: "An error occurred while sharing the todo.",
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
              Enter the recipient's email to share this todo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            {/* Hidden Todo ID */}
            <input type="hidden" name="todoId" value={formData.todoId} />

            {/* Recipient Email */}
            <div className="grid gap-2">
              <Label htmlFor="sharedWithEmail">Recipient Email</Label>
              <Input
                id="sharedWithEmail"
                name="sharedWithEmail"
                type="email"
                placeholder="Enter user email"
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
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
