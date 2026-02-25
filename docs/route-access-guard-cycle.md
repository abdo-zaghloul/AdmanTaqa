# RouteAccessGuard Cycle

This document explains how route authorization flows in the app, from navigation to final rendering.

## 1) Where the guard sits in the routing flow

All main app routes are wrapped by `ProtectedRoute` at the root level, then specific pages are wrapped by `RouteAccessGuard` with a `pathKey`.

- Root auth gate: `src/components/ProtectedRoute.tsx`
- Per-page access gate: `src/components/RouteAccessGuard.tsx`
- Route composition: `src/router.tsx`

High-level sequence:

1. User navigates to a route.
2. `ProtectedRoute` checks authentication state.
3. If authenticated, React Router renders the target page element.
4. If that element is wrapped in `RouteAccessGuard`, access rules are evaluated.
5. If allowed, page content renders.
6. If denied, the Access Denied UI renders.

## 2) Data used for authorization

`RouteAccessGuard` reads auth context values:

- `organization?.type`
- `permissions`

Source: `src/context/AuthContext.tsx`

It then resolves the corresponding rule:

- `const rule = ROUTE_ACCESS_RULES[pathKey]`

Source: `src/lib/accessControl.ts`

## 3) Decision logic in `canAccessByRule`

Authorization is evaluated in this order:

1. **No rule found**: allow access (`true`).
2. **Org type rule exists**: deny if user org type is missing or not included.
3. **Permission checks** (applied only when `permissions.length > 0`):
   - `anyPermissions`: user must have at least one permission.
   - `allPermissions`: user must have all listed permissions.
4. If all checks pass: allow access.

Important behavior:

- If the backend session returns an empty permission list, permission checks are skipped and org-type gating remains the fallback.

## 4) Router and rule key contract

The `pathKey` passed in `src/router.tsx` must match keys in `ROUTE_ACCESS_RULES`.

Examples:

- Route path `work-orders` uses `pathKey="work-orders"`.
- Route path `work-orders/:id` uses `pathKey="work-orders/:id"`.
- Route path `branch-requests/:id` uses `pathKey="branch-requests/:id"`.

If a route is wrapped by `RouteAccessGuard` but no matching key exists in `ROUTE_ACCESS_RULES`, it is treated as allowed by default.

## 5) What the user sees on deny

`RouteAccessGuard` does not redirect on authorization failure. It renders an in-page Access Denied screen with:

- A clear denied state title and description
- `Return Home` action (`/`)
- `Go Back` action (`window.history.back()`)
- Static error code (`ERR_FORBIDDEN_403`)

## 6) Sidebar consistency note

Sidebar visibility also uses the same rule map and `canAccessByRule` pattern (`src/components/AppSidebar.tsx`), so menu visibility and page-level access should stay aligned.

