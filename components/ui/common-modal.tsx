"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export default function CommonModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "확인",
  showCancel = false,
  onConfirm,
  cancelText = "취소",
  variant = "default",
}: CommonModalProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-100 border-0 rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold text-zinc-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-neutral-700 mt-2">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center gap-2">
          {showCancel && (
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {cancelText}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            {...(variant === "destructive" && { variant: "destructive" })}
            className={`px-6 ${
              variant === "destructive"
                ? ""
                : "text-white bg-sky-500 hover:bg-sky-600"
            }`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
