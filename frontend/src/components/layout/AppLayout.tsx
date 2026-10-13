import { NavLink, Outlet } from "react-router-dom";
import { ArrowLeftRight, LayoutDashboard, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transações", icon: ArrowLeftRight },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  const base =
    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";

  return isActive
    ? `${base} bg-zinc-100 font-medium text-zinc-900`
    : `${base} text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900`;
}

// Fixed sidebar from md up; below that it collapses into a top bar so the
// content keeps the full width on small screens.
export function AppLayout() {
  return (
    <div className="min-h-svh">
      <aside className="border-b border-zinc-200 bg-white md:fixed md:inset-y-0 md:left-0 md:w-60 md:border-r md:border-b-0">
        <div className="flex items-center gap-2 px-5 py-4 md:py-6">
          <Wallet className="h-5 w-5 text-zinc-900" strokeWidth={1.75} aria-hidden="true" />
          <span className="text-sm font-semibold tracking-tight text-zinc-900">Finance Tracker</span>
        </div>

        <nav aria-label="Principal" className="px-3 pb-3">
          <ul className="flex gap-1 overflow-x-auto md:flex-col">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} end={to === "/"} className={navLinkClass}>
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="md:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
