"use client";

import { useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => any;
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Permanent Deletion",
  message = "Are you sure you want to permanently delete this? This action cannot be undone.",
  itemName,
  confirmText = "Delete Permanently",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-rose-500/25 bg-[#121212] p-6 shadow-2xl shadow-rose-950/30 transition-all font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#777] transition-colors hover:bg-[#1E1E1E] hover:text-white"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_12px_#F43F5E25]">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-1 pr-4">
            <h3 className="font-heading text-lg font-bold text-[#F5F5F0]">
              {title}
            </h3>
            <p className="text-xs text-[#999] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Target Item Name Banner */}
        {itemName && (
          <div className="mt-4 rounded-lg border border-[#222] bg-[#0E0E0E] px-3.5 py-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#666]">
              Target Item
            </span>
            <p className="mt-0.5 truncate text-xs font-semibold text-rose-300">
              {itemName}
            </p>
          </div>
        )}

        {/* Warning subtext */}
        <div className="mt-4 rounded-lg bg-rose-950/20 border border-rose-900/30 px-3 py-2 text-[11px] text-rose-300/80">
          ⚠️ Once deleted, this record cannot be recovered.
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-[#2A2A2A] bg-[#181818] px-4 py-2.5 font-medium text-[#A1A1A1] transition-colors hover:bg-[#222] hover:text-white disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-500 active:scale-[0.98] disabled:opacity-50"
          >
            <Trash2 size={14} className={isLoading ? "animate-spin" : ""} />
            <span>{isLoading ? "Deleting…" : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
