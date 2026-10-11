import type { ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

export function LoadingState({ label = "Carregando…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 px-5 py-12 text-sm text-zinc-500">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-3 px-5 py-6 text-sm">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-900" aria-hidden="true" />
      <div>
        <p className="font-medium text-zinc-900">Não foi possível carregar os dados.</p>
        <p className="mt-0.5 text-zinc-500">{message}</p>
      </div>
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="px-5 py-12 text-center">
      <p className="text-sm font-medium text-zinc-900">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
