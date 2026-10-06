# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Finance tracker with a Spring Boot 4 / Java 17 REST backend (repo root, Maven) and a React 19 + TypeScript + Vite + Tailwind 4 frontend in `frontend/` (entry `main.tsx` → `App.tsx`; Phase 2 CRUD files under `src/` are comment-only stubs the user is implementing by hand). Persistence is PostgreSQL via Spring Data JPA.

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
│   └── src/                      # main.tsx, App.tsx
│       ├── api/                  # axiosClient, categories, transactions
│       ├── types/                # category, transaction (mirror backend DTOs)
│       ├── hooks/                # useCategories, useTransactions (React Query)
│       ├── pages/                # categories/, transactions/ (list page + form)
│       └── components/           # shared UI (empty)
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
    │       └── db/migration/     # Flyway (empty)
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
- Mapping entity↔DTO is done by hand-written `@Component` mappers in the package named `constructor` (`*Mapper` interface + `*MapperImp`). Services inject the concrete `*MapperImp` class directly, not the interface.
- Errors: `CategoryNotFoundException` / `TransactionNotFoundException` are translated by `exception/GlobalExceptionHandler`.
- `CorsConfig` allows only `http://localhost:5173` (the Vite dev server) on `/api/**`, methods GET/POST/PATCH/DELETE/OPTIONS. Add any new HTTP method there or the frontend's preflight will fail.

## Gotchas

- `spring.jpa.hibernate.ddl-auto=create` in `application.properties` **drops and recreates the schema on every startup**, so data does not persist across runs. Flyway is on the classpath, but `src/main/resources/db/migration` is empty — no migrations exist yet.
- Tests: service tests are plain Mockito unit tests (`@Mock`/`@InjectMocks`, no Spring context). `src/test/resources/application-test.properties` configures in-memory H2 (test-scope dependency) for Spring-context tests; activate it with `@ActiveProfiles("test")`, otherwise the default Postgres config is used.
