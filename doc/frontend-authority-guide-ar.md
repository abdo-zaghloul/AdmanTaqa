# Authority (Manager) — What You See and Can Do

This document describes **what is available to you as an Authority / Manager** in the taqa-admin application: the screens you can access, the actions you can perform, and how the system checks your permissions.

**Related references (for developers):**
- `old doc/frontend-job-orders-guide-ar.md` — Job Orders (permissions, visibility, endpoints)
- `old doc/frontend-work-orders-guide-ar.md` — Work Orders and Internal Tasks (lifecycle)
- `postman/frontend-internal-external-orders-guide-ar.md` — Internal/External orders, Station, Provider
- `postman/Energy-Platform-API.postman_collection.json` — API request collection (base: `{{baseUrl}}/api`)

---

## 1) Who Is the Authority / Manager?

- Your organization type in the system is **Authority** (`organization.type === 'AUTHORITY'`).
- After you log in, the app loads your profile from `GET /api/auth/me` and uses your **organization type** and **permissions** to decide which menus and pages you see.
- If you try to open a page you are not allowed to access, you will see an **Access Denied** screen instead of the content.

---

## 2) Screens and Menu Items Available to You

| Screen (route)        | What you see / do                              | Required permission (any one)        |
|-----------------------|------------------------------------------------|--------------------------------------|
| **Organizations**     | List of all organizations (any type)          | `organizations:read` or `organizations:approve` |
| **Organization details** | One organization: info, documents, approval history; **Approve** or **Reject** (if pending) | Same as above |
| **Fuel Stations**     | List of fuel stations only                     | Same as above                        |
| **Fuel Station details** | One fuel station (same detail screen); **Approve** or **Reject** (if pending) | Same as above |
| **Registrations**     | Registration requests                          | Same as above                        |
| **Registration details** | One registration request; review and approve/reject | Same as above                  |
| **Onboarding**        | Manage onboarding content (list, add, edit, delete, with image if applicable) | Same as above |
| **Inspections**       | Inspections (list and create if permitted)     | `inspections:read` or `inspections:create` |
| **System Audit Log**  | Log of system/administrative actions; **pagination** (page size, previous/next) | `audit:read` |
| **Branch Requests**   | Branch requests (for review)                   | As per Branch Requests permissions   |
| **Branch Request details** | One branch request; approve or reject     | Same as above                        |
| **Job Orders**        | List of job orders (read-only view)            | `job-orders:read`                    |
| **Job Order details** | One job order (read-only)                      | Same as above                        |
| **Quotations**        | Quotations / RFQs (read and submit if permitted) | `quotations:read` or `quotations:submit` |
| **Service Categories** | Service categories (shared with Service Provider) | As configured                    |
| **Service Offering**  | Service offerings (shared)                     | As configured                        |

---

## 3) What You Can Do on Each Screen

### Organizations

- **List:** See all organizations; filter or search as provided in the UI.
- **Details:** Open one organization to see its data, documents, and approval history.
- **Approve:** For **pending** organizations, use **Approve** to approve the registration (no reason required).
- **Reject:** For **pending** organizations, use **Reject**; you **must enter a reason**. The system will not allow submit without a reason.

### Fuel Stations

- **List:** See only **fuel station** organizations; filter by status (e.g. Pending, Approved, Rejected). You can also see a **rejection reason** column when status is Rejected.
- **Details:** Same as organization details (documents, approval history). You can **Approve** or **Reject** (reason required for reject). The **Back** button returns you to the Fuel Stations list when you opened the detail from there.

### Registrations

- **List and details:** View registration requests and their details; approve or reject according to the same logic as organizations (reason required when rejecting).

### Onboarding

- **List:** View onboarding items (e.g. steps or content shown to new users).
- **Create / Edit / Delete:** Manage items; you can attach an image where the UI supports it.

### System Audit Log

- **List:** View a paginated list of audit entries (who did what, when, resource, IP, etc.).
- **Pagination:** You can change the number of rows per page and move between pages (Previous / Next).

### Branch Requests

- **List and details:** View branch requests (e.g. from fuel stations) and **Approve** or **Reject** them; rejection typically requires a reason.

### Job Orders and Quotations

- **Job Orders:** If you have `job-orders:read`, you can open the Job Orders list and details in **read-only** mode (no create/edit from this role in the current implementation).
- **Quotations:** You can view (and, if permitted, submit) quotations according to your permissions.

---

## 4) How Access Is Decided

- **Login:** After you sign in, the app calls `GET /api/auth/me` and stores your **organization type** (Authority) and **permissions**.
- **Menus:** The sidebar shows only the items you are allowed to see (based on organization type and permissions).
- **Pages:** When you open a route, the app checks again. If you are not allowed, you see **Access Denied** instead of the page.
- **Actions:** Buttons such as Approve, Reject, Create, or Edit are shown only when your permissions allow them. The backend also checks permissions on every request.

---

## 5) Important Behaviour

- **Reject always needs a reason:** For organization, fuel station, or registration rejections, the reason field is **required**. The UI blocks submit until you enter text.
- **Fuel Stations vs Organizations:** Fuel Stations is a filtered view of organizations (type = fuel station). Approve/Reject works the same; the detail screen is shared.
- **Audit Log:** Only visible if you have `audit:read`. The list is paginated so you can browse large logs.
- **Errors:** If something goes wrong (e.g. session expired, no permission, or not found), the app shows a clear message or toast instead of failing silently.

---

## 6) Quick Checklist (What You Have as Manager)

- [x] View and manage **Organizations** (list, details, approve, reject with reason).
- [x] View and manage **Fuel Stations** (list, details, approve, reject with reason).
- [x] View and manage **Registrations** (list, details, approve, reject).
- [x] Manage **Onboarding** content (list, create, edit, delete, with image).
- [x] View **System Audit Log** with **pagination**.
- [x] View and decide on **Branch Requests** (list, details, approve, reject).
- [x] View **Job Orders** (read-only when permitted).
- [x] Use **Quotations** and **Service Categories / Service Offering** as per your permissions.
- [x] See **Access Denied** when you try to open a page you are not allowed to access.
- [ ] **Job Orders** list is currently using sample data; full API integration may be added later.

This guide reflects the current taqa-admin implementation and the behaviour you will see as a manager (Authority user).
