// Página inicial: apresenta o app e leva às demais páginas.

import { Link } from "react-router-dom";
import { ArrowRight, Wallet } from "lucide-react";
import { APP_PAGES } from "../../routes";
import { focusRingClass } from "../../lib/ui";

// The layout already provides <main>; this page adds the intro and a <nav> of page cards.
export function HeroPage() {
  return (
    <div className="space-y-10 md:space-y-12">
      <title>Finance Tracker</title>

      <header className="border-b border-zinc-200 pb-8 md:pb-10">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
          <Wallet className="h-5 w-5 text-zinc-900" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Finance Tracker</h1>
        <p className="mt-3 max-w-xl text-base text-zinc-500">
          Um projeto pessoal para registrar receitas e despesas, organizá-las por categoria e acompanhar, com totais
          e gráficos, para onde vai o dinheiro.
        </p>
      </header>

      <nav aria-labelledby="hero-pages-heading">
        <h2 id="hero-pages-heading" className="text-sm font-semibold text-zinc-900">
          Páginas
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {APP_PAGES.map(({ path, label, description, icon: Icon }) => (
            // The whole card is the link, so its name is the title plus the description.
            <li key={path}>
              <Link
                to={path}
                className={`group flex h-full items-start gap-4 rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50 active:bg-zinc-100 ${focusRingClass}`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-white">
                  <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-zinc-900">{label}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{description}</p>
                </div>
                <ArrowRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500 transition group-hover:text-zinc-900 motion-safe:group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
