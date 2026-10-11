import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  aside?: ReactNode;
};

export function PageHeader({ title, description, aside }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
      </div>
      {aside}
    </header>
  );
}
