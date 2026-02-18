# Service Provider – Frontend Cycle / دورة مزود الخدمة في الواجهة الأمامية

This document describes what the **frontend** (web or mobile) should implement for the **Service Provider** flow: screens, user actions, and which API endpoints to call.

هذا الملف يوضح ما يجب على **الواجهة الأمامية** (ويب أو موبايل) تنفيذه لدورة **مزود الخدمة**: الشاشات، إجراءات المستخدم، وواجهات الـ API المستخدمة.

---

## 1. Prerequisites / المتطلبات

- **Organization type:** `SERVICE_PROVIDER`
- **Organization status:** `APPROVED` (otherwise operational routes like requests, quotations, job orders are blocked)
- User has **Bearer token** after login/register; send in header: `Authorization: Bearer <accessToken>`

---

## 2. High-level flow / المسار العام

```
Register/Login → Profile & Settings → Service Requests (from linked stations)
    → Submit Quotation → (Fuel Station accepts) → Create Job Order
    → Assign Operators / Record Visits → (Optional) Confirm Payment
```

تسجيل الدخول → الملف والإعدادات → طلبات الخدمة (من المحطات المرتبطة)
    → تقديم عرض سعر → (محطة الوقود توافق) → إنشاء أمر عمل
    → تعيين مشغلين / تسجيل زيارات → (اختياري) تأكيد الدفع

---

## 3. Screens and API mapping / الشاشات وربطها بالـ API

### 3.1 Auth / المصادقة

| Screen / الشاشة | Action / الإجراء | API |
|------------------|------------------|-----|
| Register as Service Provider | Submit: org name, type=SERVICE_PROVIDER, email, password, fullName, phone | `POST /api/auth/register` |
| Login | Submit: email, password | `POST /api/auth/login` |
| (Any) | Refresh when token expires | `POST /api/auth/refresh` (body: `refreshToken`) |

After login/register: store `accessToken` and `refreshToken`; use `accessToken` in `Authorization: Bearer <token>` for all protected requests.

---

### 3.2 Profile & organization / الملف والمنظمة

| Screen / الشاشة | Action / الإجراء | API |
|------------------|------------------|-----|
| My organization | Load profile | `GET /api/organizations/me` |
| Edit org name | Save | `PATCH /api/organizations/me` (body: `name`) |
| Documents | List | `GET /api/organizations/:id/documents` |
| Documents | Upload | `POST /api/organizations/:id/documents` (multipart: `file`, `documentType`) |
| Approval history | View | `GET /api/organizations/:id/approval-history` |
| Service categories (linked to us) | List / link / unlink | `GET /api/organizations/:id/service-categories`, `POST`, `DELETE .../service-categories/:categoryId` |

If `organization.status !== 'APPROVED'`: show a “Pending approval” message and restrict operational screens (requests, quotations, job orders).

---

### 3.3 Branches / الفروع

| Screen / الشاشة | Action / الإجراء | API |
|------------------|------------------|-----|
| Branch list | Load | `GET /api/branches` |
| Branch detail | Load | `GET /api/branches/:id` |
| Add branch | Submit: areaId, name, address | `POST /api/branches` |
| Edit branch | Save | `PATCH /api/branches/:id` |

Locations for `areaId`: `GET /api/locations/countries`, then governorates, cities, areas.

---

### 3.4 Users and roles / المستخدمون والأدوار

| Screen / الشاشة | Action / الإجراء | API |
|------------------|------------------|-----|
| User list | Load | `GET /api/users` |
| User detail | Load | `GET /api/users/:id` |
| Create user | Submit: email, password, fullName, phone | `POST /api/users` |
| Roles list | Load | `GET /api/roles` |
| Permissions for org type | Load (for role edit) | `GET /api/roles` (and permissions per role as returned) |

---

### 3.5 Team (invitations) / الفريق (الدعوات)

If the backend assigns `team.*` permissions to Service Provider roles:

| Screen / الشاشة | Action / الإجراء | API |
|------------------|------------------|-----|
| Invite member | Submit: email or phone, roleId, branchId (optional) | `POST /api/team/invite` |
| Pending invitations | Load | `GET /api/team/invitations` |
| Team members | Load | `GET /api/team/users` |
| Change member role | Submit new roleId | `PATCH /api/team/users/:id/role` |
| Deactivate member | Confirm | `PATCH /api/team/users/:id/deactivate` |
| Cancel invitation | Confirm | `PATCH /api/team/invitations/:id/cancel` |

Accept invitation is **public**: `POST /api/team/accept` (no auth; body includes token from invite link).

---

### 3.6 Service requests (from linked fuel stations) / طلبات الخدمة

SP sees only requests from **fuel stations linked** to them (via `StationServiceProvider`). لا يرى مزود الخدمة إلا طلبات المحطات المرتبطة به.

| Screen / الشاشة | Action / الإجراء | API |
|------------------|------------------|-----|
| Request list | Load | `GET /api/requests` (optional: `page`, `limit`) |
| Request detail | Load | `GET /api/requests/:id` |

Use this list so the user can choose a request and **submit a quotation** (next section).

---

### 3.7 Quotations / عروض الأسعار

| Screen / الشاشة | Action / الإجراء | API |
|------------------|------------------|-----|
| Quotation list (our quotations) | Load | `GET /api/quotations` (optional: `limit`) |
| Quotation detail | Load | `GET /api/quotations/:id` |
| Submit quotation | Submit: serviceRequestId, amount, currency (optional) | `POST /api/quotations` |

- Only one SP can submit per request (per backend rules); SP must be **linked** to the request’s fuel station.
- After submission, the Fuel Station may “accept” in their UI (if/when that is implemented); the next step for SP is to **create a job order** when the quotation is agreed.

---

### 3.8 Job orders / أوامر العمل

| Screen / الشاشة | Action / الإجراء | API |
|------------------|------------------|-----|
| Job order list (ours) | Load | `GET /api/job-orders` (optional: `limit`) |
| Job order detail | Load | `GET /api/job-orders/:id` |
| Create job order | From accepted quotation: quotationId, assignedBranchId, executionDetails (optional) | `POST /api/job-orders` |
| Payment record | Load | `GET /api/job-orders/:id/payment` |
| Confirm payment | Submit: amount, currency (optional) | `POST /api/job-orders/:id/confirm-payment` |

---

### 3.9 Operators (SP only) / المشغلون

| Screen / الشاشة | Action / الإجراء | API |
|------------------|------------------|-----|
| Operator list | Load | `GET /api/operators` |
| Operator detail | Load | `GET /api/operators/:id` |
| Create operator | Submit: name | `POST /api/operators` |
| Edit operator | Save | `PATCH /api/operators/:id` |

---

### 3.10 Job order – assignments and visits / تعيينات وزيارات أمر العمل

| Screen / الشاشة | Action / الإجراء | API |
|------------------|------------------|-----|
| Assignments for job | Load | `GET /api/job-orders/:id/assignments` |
| Assign operator | Submit: operatorId, arrivalTime (optional), status (optional) | `POST /api/job-orders/:id/assignments` |
| Update assignment | Save | `PATCH /api/job-orders/:id/assignments/:assignmentId` |
| Visits for job | Load | `GET /api/job-orders/:id/visits` |
| Create visit | Submit: visitDate, status, notes (optional) | `POST /api/job-orders/:id/visits` |
| Update visit | Save | `PATCH /api/job-orders/:id/visits/:visitId` |

---

### 3.11 Service categories (propose) / فئات الخدمة (اقتراح)

| Screen / الشاشة | Action / الإجراء | API |
|------------------|------------------|-----|
| Category list | Load (approved + own pending) | `GET /api/service-categories` |
| Propose new category | Submit: nameEn, nameAr, code (optional) | `POST /api/service-categories/propose` |

---

## 4. Permission-based visibility / إظهار الشاشات حسب الصلاحية

- Use the user’s **permissions** (from your auth/me or roles API) to show/hide menus and buttons.
- Examples:
  - `requests:read` → show Requests.
  - `quotations:read` → show Quotations list/detail.
  - `quotations:submit` → show “Submit quotation” for a request.
  - `job-orders:read` → show Job orders.
  - `job-orders:update` → show Create job order, Assign operator, Visits, Confirm payment (if also `payments:confirm`).
  - `operators:read` / `operators:create` / `operators:update` → Operators screen.
  - `users:read` / `users:create` → Users.
  - `branches:read` / `branches:create` / `branches:update` → Branches.
  - `roles:read` / `roles:create` / `roles:update` → Roles.
  - `team.read` / `team.invite` / `team.assign_roles` → Team/Invitations.

---

## 5. Suggested screen structure (SP) / هيكل مقترح للشاشات

| Section / القسم | Screens (suggested) / شاشات مقترحة |
|------------------|-------------------------------------|
| Auth | Login, Register (as Service Provider) |
| Home / Dashboard | Summary: e.g. open requests, quotations, job orders (use lists above; no dedicated dashboard endpoint for SP in current backend) |
| Organization | My organization, Documents, Approval history, Service categories |
| Setup | Branches, Users, Roles, Team (invitations) |
| Operations | Service requests list → Request detail → Submit quotation → Quotations list → Quotation detail |
| Execution | Job orders list → Job order detail → Assignments, Visits, Payment |
| Masters | Operators, Service categories (list + propose) |

---

## 6. References / مراجع

- Full API details: **integration.md**
- Roles and permissions: **docs/roles-and-permissions-strategy.md**
- User types and roles: **docs/user-types.md**
- Organization and flow overview: **overview.md**
