"use client";

import * as React from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "destructive";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (opts: { title: string; description?: string; variant?: ToastVariant }) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback(
    (opts: { title: string; description?: string; variant?: ToastVariant }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [
        ...prev,
        { id, title: opts.title, description: opts.description, variant: opts.variant ?? "default" },
      ]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-[100] flex w-full max-w-sm flex-col gap-2 p-4 sm:bottom-4 sm:right-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-4 shadow-lg animate-in slide-in-from-bottom-4 fade-in",
              t.variant === "success" && "bg-emerald-50 border-emerald-200",
              t.variant === "destructive" && "bg-red-50 border-red-200",
              t.variant === "default" && "bg-background border-border"
            )}
          >
            {t.variant === "success" && (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            )}
            {t.variant === "destructive" && (
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{t.description}</p>
              )}
            </div>
            <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
