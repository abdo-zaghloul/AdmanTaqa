# TAQA Admin Frontend

واجهة إدارة مبنية بـ React + TypeScript + Vite.

## Full Routes Audit

هذا الجرد مبني على الصفحات المسجلة في `src/router.tsx` ومقسّم حسب الربط مع الباك:

- **Backend-integrated**: الصفحة مربوطة API فعليًا.
- **Frontend-only**: الصفحة Mock/Static بدون ربط API فعلي.
- **Mixed/partial**: الصفحة فيها جزء مربوط باك وجزء Mock.

---

## Backend-integrated (18)

- `/login` → `src/pages/Auth/Login.tsx`
- `/register` → `src/pages/Auth/Register.tsx`
- `/` (index) → `src/pages/Profile/Profile.tsx`
- `/profile` → `src/pages/Profile/Profile.tsx`
- `/organizations` → `src/pages/Authority/Organizations/Organizations.tsx`
- `/organizations/:id` → `src/pages/Authority/Organizations/OrganizationDetails.tsx`
- `/locations` → `src/pages/Locations/Locations.tsx`
- `/branches` → `src/pages/Branches/Branches.tsx`
- `/branches/create` → `src/pages/Branches/CreateBranch.tsx`
- `/branches/:id/edit` → `src/pages/Branches/EditBranch.tsx`
- `/branches/:id` → `src/pages/Branches/BranchDetails.tsx`
- `/users` → `src/pages/Users/Users.tsx`
- `/users/:id` → `src/pages/Users/UserDetails.tsx`
- `/registrations` → `src/pages/Registrations/RegistrationsPage.tsx`
- `/registrations/:id` → `src/pages/Registrations/RegistrationDetailPage.tsx`
- `/onboarding` → `src/pages/Onboarding/OnboardingPage.tsx`
- `/onboarding/:id` → `src/pages/Onboarding/OnboardingDetails.tsx`
- `OrganizationActions` logic → `src/pages/Authority/Organizations/Component/OrganizationActions.tsx`

---

## Frontend-only / Mock (15)

- `/roles` → `src/pages/Roles/Roles.tsx`
- `/roles/create` → `src/pages/Roles/CreateCustomRole.tsx`
- `/roles/:id` → `src/pages/Roles/RoleDetails.tsx`
- `/roles/:id/edit` → `src/pages/Roles/EditRole.tsx`
 - `/fuel-retail` → `src/pages/fuelRetail/fuelRetail.tsx`
- `/fuel-retail/:id` → `src/pages/fuelRetail/FuelRetailDetails.tsx`
- `/fuel-retail/register` → `src/pages/fuelRetail/RegisterFuelRetail.tsx`
- `/fuel-retail/:id/edit` → `src/pages/fuelRetail/EditFuelRetail.tsx`
- `/service-requests/:id` → `src/pages/ServiceRequests/ServiceRequestDetails.tsx`
- `/job-orders` → `src/pages/JobOrders/JobOrders.tsx`
- `/job-orders/:id` → `src/pages/JobOrders/JobOrderDetails.tsx`
- `/inspections` → `src/pages/Inspections/Inspections.tsx`
- `/audit-log` → `src/pages/AuditLog/AuditLog.tsx`
- `*` → `src/pages/NotFound/NotFound.tsx`

---

## Mixed / Partial (2)

- `/service-requests` → `src/pages/ServiceRequests/ServiceRequests.tsx`
  - فيه guard/organization من الباك + الداتا الأساسية Mock.
- `/quotations` → `src/pages/Quotations/Quotations.tsx`
  - فيه guard/organization من الباك + الداتا الأساسية Mock.

---

## Summary

- **Backend-integrated:** 18
- **Frontend-only:** 15
- **Mixed/partial:** 2
- **Total routes audited:** 35
