// The app's pages, in one place. App.tsx builds the routes from this list, and the
// sidebar and the hero page build their links from it, so adding or removing a
// page here updates all three.

import type { ComponentType } from "react";
import { ArrowLeftRight, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { TransactionsPage } from "./pages/transactions/TransactionsPage";

export type AppPage = {
  path: string;
  label: string;
  // One line shown on the hero page's link card.
  description: string;
  icon: LucideIcon;
  component: ComponentType;
};

// The hero lives at "/" and is not listed: it links to these pages.
export const HOME_PATH = "/";

export const APP_PAGES: AppPage[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    description: "Receitas, despesas e saldo do período, com os gastos por categoria em gráficos.",
    icon: LayoutDashboard,
    component: DashboardPage,
  },
  {
    path: "/transactions",
    label: "Transações",
    description: "Histórico completo, onde você registra, edita e exclui receitas e despesas.",
    icon: ArrowLeftRight,
    component: TransactionsPage,
  },
];
