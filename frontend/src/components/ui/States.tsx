import type { ReactNode } from "react";
import { AlertCircle, Loader2, RotateCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { secondaryButtonClass } from "../../lib/ui";

export function LoadingState({ label = "Carregando…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 px-5 py-12 text-sm text-zinc-500">
      <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}

// Placeholder block for skeleton layouts. Purely visual: the surrounding
// SkeletonStatus is what announces the loading state.
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`rounded bg-zinc-100 motion-safe:animate-pulse ${className}`} />;
}

// Wraps a skeleton layout so it is announced once, by its label, instead of as empty boxes.
export function SkeletonStatus({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-start gap-4 px-5 py-6 text-sm sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-medium text-zinc-900">Não foi possível carregar os dados.</p>
          <p className="mt-0.5 break-words text-zinc-500">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className={`${secondaryButtonClass} ml-7 sm:ml-0`}>
          <RotateCw className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: LucideIcon;
};

export function EmptyState({ title, description, action, icon: Icon }: EmptyStateProps) {
  return (
    <div className="px-5 py-12 text-center">
      {Icon && (
        <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
      <p className="text-sm font-medium text-zinc-900">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
