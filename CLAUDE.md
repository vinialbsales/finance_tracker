# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Finance tracker with a Spring Boot 4 / Java 17 REST backend (repo root, Maven) and a React 19 + TypeScript + Vite + Tailwind 4 frontend in `frontend/` (entry `main.tsx` → `App.tsx`, which sets up react-router: `/` dashboard and `/transactions`, both inside `components/layout/AppLayout`; unknown paths redirect to `/`). The user writes the data layer (`api/`, `hooks/`, `types/`, form state/handlers) by hand — keep visual changes out of that logic. Persistence is PostgreSQL via Spring Data JPA.

## Project structure

```
finance_tracker/
├── pom.xml
├── .env                          # DB_PASSWORD (git-ignored)
├── frontend/                     # React + Vite + Tailwind app
│   ├── package.json
│   ├── tsconfig.json             # app config (src/), strict
│   ├── tsconfig.node.json        # vite.config.ts only
│   ├── vite.config.ts
│   └── src/                      # main.tsx, App.tsx (routes), index.css (Tailwind theme tokens)
│       ├── api/                  # axiosClient, categories, transactions
│       ├── types/                # category, transaction (mirror backend DTOs)
│       ├── hooks/                # useCategories, useTransactions (React Query)
│       ├── lib/                  # format (BRL/date/cents), summary (dashboard totals), ui (shared class strings)
│       ├── pages/                # dashboard/, transactions/ (list page + form)
│       └── components/           # layout/ (sidebar), ui/ (Panel, StatTile, CategoryDot…), charts/ (Recharts)
└── src/
    ├── main/
    │   ├── java/com/vinialb/finance_tracker/
    │   │   ├── FinanceTrackerApplication.java
    │   │   ├── config/           # CorsConfig
    │   │   ├── controller/       # Category/TransactionController
    │   │   ├── service/          # Category/TransactionService
    │   │   ├── repository/       # Category/TransactionRepository
    │   │   ├── entity/           # Category, Transaction
    │   │   ├── dto/              # request/response DTOs
    │   │   ├── constructor/      # entity↔DTO mappers (*Mapper, *MapperImp)
    │   │   ├── enumerated/       # TransactionType
    │   │   └── exception/        # not-found exceptions, GlobalExceptionHandler
    │   └── resources/
    │       ├── application.properties
    │       └── db/migration/     # Flyway: V1–V2 schema, V3 category seed, V4 optional transaction category
    └── test/
        ├── java/com/vinialb/finance_tracker/
        │   ├── FinanceTrackerApplicationTests.java
        │   └── service/          # Category/TransactionServiceTest
        └── resources/application-test.properties   # H2 config
```

## Commands

Backend (from repo root):
- Run: `./mvnw spring-boot:run` (needs PostgreSQL on `localhost:5432`, db `finance_tracker`, user `vinialb`, and env var `DB_PASSWORD` — kept in the git-ignored `.env`; export it into the shell first, Spring does not load `.env` itself)
- Build / all tests: `./mvnw verify` / `./mvnw test`
- Single test class: `./mvnw test -Dtest=TransactionServiceTest`
- Single method: `./mvnw test -Dtest=TransactionServiceTest#methodName`

Frontend (from `frontend/`): `npm run dev` (serves on :5173), `npm run build` (runs `tsc -b tsconfig.json tsconfig.node.json` type-check, then `vite build`), `npm run lint`. There is no frontend test runner. The two tsconfigs are independent projects (no `references`), so both must be passed to `tsc -b`.

## Architecture

Layered package structure under `com.vinialb.finance_tracker`: `controller` → `service` → `repository` (Spring Data JPA) → `entity`, with `dto` for request/response payloads.

- Controllers expose everything under `/api` (`/api/transactions`, `/api/categories`); updates use `PATCH`, not `PUT`.
- Categories are read-only: the 10 rows seeded by Flyway V3 are the whole set, and `/api/categories` only has GET (list, by id). There is no category create/update/delete on either side, and no `CategoryRequestDTO`.
- Mapping entity↔DTO is done by hand-written `@Component` mappers in the package named `constructor` (`*Mapper` interface + `*MapperImp`). Services inject the concrete `*MapperImp` class directly, not the interface.
- Errors: `CategoryNotFoundException` / `TransactionNotFoundException` are translated by `exception/GlobalExceptionHandler`.
- `CorsConfig` allows only `http://localhost:5173` (the Vite dev server) on `/api/**`, methods GET/POST/PATCH/DELETE/OPTIONS. Add any new HTTP method there or the frontend's preflight will fail.

Frontend:
- `VITE_API_BASE_URL` (in `frontend/.env`) points axios at `http://localhost:8080/api`.
- `types/` mirrors the Java DTOs by hand — keep them in sync when a DTO changes (e.g. `TransactionRequestDTO.name` is `@NotBlank`; omitting it gives a 400).
- `amount` is a string end to end (BigDecimal serialized as text). Convert with `Number()` only for display; sums go through `lib/format.ts` `toCents`/`fromCents`.
- There are no aggregate endpoints yet; dashboard totals are computed client-side in `lib/summary.ts`.
- `LocalDate` strings are formatted with `timeZone: "UTC"` (`formatDate`) to avoid an off-by-one day in Brazil's timezone.
- Visual style: neutral zinc palette, thin borders, no heavy shadows. `accent` (defined in `index.css` `@theme`) is reserved for income; category `color` (gray `#808080` fallback via `CategoryDot` / `FALLBACK_CATEGORY_COLOR`) is the only other data color, including chart bars.
- The dashboard chart's category icons (`CATEGORY_ICONS` in `components/charts/ExpensesByCategoryChart.tsx`) are keyed by category name; a migration that renames a seeded category must update that map, or the bar falls back to the `Tag` icon.
- List pages render their form inside a local `*Layout` wrapper used in every loading/error/data branch, so form state survives refetches.

## Commits

- Use Conventional Commits (`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`) with descriptions in English.
- Split changes into multiple logically scoped commits instead of one large commit.

## Gotchas

- The schema is owned by Flyway (`src/main/resources/db/migration`: V1 categories, V2 transactions, V3 seed of 10 fixed categories); `ddl-auto=validate` only checks it. Any entity change needs a new `V<n>__*.sql` migration — never edit an applied one. `transactions.category_id` is nullable since V4: category is required only for `EXPENSE`, enforced in `TransactionService` (`CategoryRequiredException` → 400), not by the DB or Bean Validation. `INCOME` may have no category (`categoryId: null` in responses), and since a transaction's category can't change on update, an uncategorized income can't be switched to expense.
- `FinanceTrackerApplicationTests` (no test profile) boots against the real local Postgres, so `./mvnw test` runs the migrations there.
- Tests: service tests are plain Mockito unit tests (`@Mock`/`@InjectMocks`, no Spring context). `src/test/resources/application-test.properties` configures in-memory H2 (test-scope dependency) for Spring-context tests; activate it with `@ActiveProfiles("test")`, otherwise the default Postgres config is used.
