import type { ReactNode } from "react";

type PanelProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

// A thin-bordered section. Borders, not shadows, separate content.
export function Panel({ title, description, action, children, className = "" }: PanelProps) {
  return (
    <section className={`rounded-lg border border-zinc-200 bg-white ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-zinc-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
