import { Link, NavLink, Outlet } from "react-router-dom";
import { Wallet } from "lucide-react";
import { focusRingClass } from "../../lib/ui";
import { APP_PAGES, HOME_PATH } from "../../routes";

function navLinkClass({ isActive }: { isActive: boolean }) {
  const base = `flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${focusRingClass}`;

  return isActive
    ? `${base} bg-zinc-100 font-medium text-zinc-900`
    : `${base} text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 active:bg-zinc-100`;
}

// Fixed sidebar from md up; below that it collapses into a top bar so the
// content keeps the full width on small screens.
export function AppLayout() {
  return (
    <div className="min-h-svh">
      {/* First stop for keyboard users: jumps past the navigation, visible only when focused. */}
      <a
        href="#conteudo"
        className={`sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-white ${focusRingClass}`}
      >
        Pular para o conteúdo
      </a>

      <aside className="border-b border-zinc-200 bg-white md:fixed md:inset-y-0 md:left-0 md:w-60 md:border-r md:border-b-0">
        {/* The app name links back to the hero page from anywhere. */}
        <div className="px-3 py-2 md:py-4">
          <Link
            to={HOME_PATH}
            className={`inline-flex items-center gap-2 rounded-md px-2 py-2 text-zinc-900 transition-colors hover:bg-zinc-50 active:bg-zinc-100 ${focusRingClass}`}
          >
            <Wallet className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            <span className="text-sm font-semibold tracking-tight">Finance Tracker</span>
          </Link>
        </div>

        {/* overflow-x-auto clips anything outside the list's box, so the list's own
            padding leaves room for the focus ring's 2px offset. */}
        <nav aria-label="Principal" className="px-2 pb-2">
          <ul className="flex gap-1 overflow-x-auto p-1 md:flex-col">
            {APP_PAGES.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink to={path} className={navLinkClass}>
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* tabIndex -1 lets the skip link move focus here without adding a tab stop. */}
      <main id="conteudo" tabIndex={-1} className="focus:outline-none md:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
