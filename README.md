# TAQA Admin Frontend

TAQA Admin is a React + TypeScript admin dashboard used to manage organizations, branches, users, registrations, onboarding, branch requests, work orders, and related authority/provider workflows.

## Tech Stack

- React 19
- TypeScript
- Vite (rolldown-vite)
- React Router
- TanStack Query
- Axios
- Tailwind CSS + Radix UI primitives
- React Hook Form + Zod
- Sonner (toasts)

## Project Architecture

The app is organized around pages, feature hooks, and shared infrastructure:

- `src/pages/` contains route-level screens and feature UI.
- `src/hooks/` contains data-fetching and mutation hooks per domain.
- `src/api/services/` contains API service methods grouped by module.
- `src/components/` contains app shell and reusable UI building blocks.
- `src/context/` contains global state providers (`AuthContext`).
- `src/lib/` contains shared utilities (permissions, access rules, helpers).
- `src/types/` contains domain and API typing contracts.

## Runtime Flow

### App Bootstrap

The app starts in `src/main.tsx`:

1. Creates a `QueryClient`.
2. Wraps app with `QueryClientProvider`.
3. Wraps app with `AuthProvider`.
4. Mounts `RouterProvider` with the hash router.

### Routing & Layout

- Router definition lives in `src/router.tsx` (`createHashRouter`).
- `/login` and `/register` are public.
- All authenticated app routes are nested under `/` and rendered inside `Layout`.
- `Layout` renders:
  - Sidebar (`AppSidebar`)
  - Top header
  - Page outlet (`<Outlet />`)

### Authentication

Authentication state is managed in `src/context/AuthContext.tsx`:

- Stores `user`, `organization`, `roles`, `permissions`, tokens, and loading state.
- On app load:
  - Reads `access_token` from local storage.
  - Calls `authService.me()` to hydrate identity and permissions.
- Exposes helpers:
  - `isAuthenticated`
  - `hasPermission`, `hasAnyPermission`, `hasAllPermissions`
  - `login` / `logout`

`ProtectedRoute` (`src/components/ProtectedRoute.tsx`) enforces login:

- Shows spinner while auth loads.
- Redirects unauthenticated users to `/login`.

### Authorization (Route-Level Access Control)

Route-level authorization is handled by:

- `src/lib/accessControl.ts`:
  - `ROUTE_ACCESS_RULES`
  - `canAccessByRule(...)`
  - `normalizePathKey(...)`
- `src/components/RouteAccessGuard.tsx`:
  - Evaluates route access using org type + permissions.
  - Renders page content when allowed.
  - Renders Access Denied UI when denied.

Related guide:

- `docs/route-access-guard-cycle.md`

### Sidebar Visibility

`src/components/AppSidebar.tsx` uses the same access-rule map (`ROUTE_ACCESS_RULES`) via `canAccessByRule(...)` to hide inaccessible menu items, keeping sidebar visibility aligned with page access guards.

## API Layer

The Axios client is configured in `src/api/config.ts`:

- Sets base URL to:
  - `https://enrgy-be-development.up.railway.app/api/`
- Adds `Authorization: Bearer <token>` on requests when token exists.
- Handles `401` with refresh-token flow:
  - Calls `auth/refresh`
  - Retries failed requests after refresh
  - Redirects to `#/login` if refresh fails

## Key Feature Areas

Major route domains in `src/router.tsx`:

- Auth: `login`, `register`
- Profile
- Organizations (authority)
- Branches & locations
- Users & roles
- Registrations & onboarding
- Service offerings/categories
- Fuel retail
- Branch requests
- Quotations
- Job orders
- Work orders + review queue
- Inspections & audit logs

## Development

### Prerequisites

- Node.js 20+ recommended
- npm

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## Route Audit (Legacy Reference)

The previous README included a route audit split by backend integration level. If needed, you can regenerate and maintain that list from `src/router.tsx`, but this README now focuses on overall project architecture and development flow.
