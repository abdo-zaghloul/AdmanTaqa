# Work Order & Internal / External Orders — Short Repo

---

## Description for Manager (Non-Technical)

**What this document is about:** It describes how **maintenance requests** (work orders) work in the system: when the **fuel station** does the job itself (**internal**) or asks an **external service provider** to do it (**external**), and how **problem cases** (e.g. payment rejected, order cancelled) are handled.

**In plain language:**

- **Work order** = A maintenance request created by a fuel station (e.g. repair a pump, inspect a tank). Each request can be handled in one of two ways.
- **Internal order:** The station **does the work with its own staff**. Only the station sees and manages these requests. The service provider does not see or participate in them.
- **External order:** The station **sends the request to one or more service providers** to get price offers (quotes). The station then **chooses an offer**, and a **job** is created for that provider. Before the provider can start:
  - The **station** confirms in the system that it **sent the payment**.
  - The **provider** confirms that it **received the payment** (or rejects it and gives a reason).  
  Only when **both** have confirmed does the job become “active” and the provider can assign staff, record visits, and complete the work.

**When things don’t go as planned:**

- **Payment rejected:** The provider says it did not receive the payment (and must give a reason). The job then never becomes active; the station may need to follow up or try again.
- **Cancelled:** The request or the job is cancelled. It is closed and no further steps are taken.
- **Quote rejected or withdrawn:** A provider’s offer is rejected or the provider withdraws it. The station’s request can still continue with another provider or another quote.

**Who sees what:**  
The **fuel station** can create and see both internal and external orders. The **service provider** only sees external requests (the ones sent to it): requests for quotes, its own quotes, and the jobs created when the station selects its offer. It does not see the station’s internal orders.

This document also includes a **technical reference** (sections below) for developers; the description above is the high-level view for a non-technical manager.

---

**Source docs (what was produced):**
- `postman/frontend-internal-external-orders-guide-ar.md` — Frontend guide (Arabic): how the station and provider UIs work with internal/external flows and failure cases.
- `postman/internal_external_orders_and_fail_status_7075eeb7.plan.md` — Backend/plan (Arabic): how Internal vs External is chosen, what the service provider sees, and how fail states are handled.

---

## 1. Work Order vs Internal vs External (Technical)

| Term | Who | Meaning |
|------|-----|--------|
| **Work Order** | Fuel station | A maintenance request. Can be executed **internally** (by station staff) or **externally** (by a service provider). |
| **Internal (order)** | Fuel station only | Request is done in-house. Backend creates **InternalWorkOrder** (+ optional **InternalTask**). Service provider **does not see** these. APIs live under `/api/internal/work-orders`. |
| **External (order)** | Station + provider | Request is done by a provider. Backend creates **ExternalRequest**; station can send RFQ to providers; after **select quote** → **ExternalJobOrder** + **PaymentRecord**. After two-step payment confirmation, job becomes **ACTIVE** and provider executes. |

**Single entry point for station:**  
`POST /api/station/maintenance-requests` with **`maintenanceMode`**: `"INTERNAL"` → internal path; `"EXTERNAL"` → external path (and optional `providerOrganizationIds` to send RFQ).

---

## 2. Internal Work Orders (Station Only)

- **Create:** `POST /api/internal/work-orders` or via the single maintenance-request above with `maintenanceMode: "INTERNAL"`.
- **List:** `GET /api/internal/work-orders` (query: status, page, limit).
- **Review queue:** `GET /api/internal/work-orders/review-queue`.
- **Details:** `GET /api/internal/work-orders/:id`.
- **Update:** `PATCH /api/internal/work-orders/:id`.
- **Review (approve/reject):** `PATCH /api/internal/work-orders/:id/review` — body: `{ "decision": "APPROVE" | "REJECT" }`.
- **Close:** `PATCH /api/internal/work-orders/:id/close`.

Service provider has **no access** to these endpoints.

---

## 3. External Orders (Station + Provider)

**Station side:**
- List requests: `GET /api/station/requests`; details: `GET /api/station/requests/:id`.
- Send to providers (RFQ): `POST /api/station/requests/:id/send-to-providers`.
- Select quote: `POST /api/station/requests/:id/select-quote` with `providerQuoteId` → creates External Job Order + PaymentRecord.
- Confirm payment sent: `POST /api/station/job-orders/:id/confirm-sent` (optional body: referenceNumber, receiptFileUrl, amount, method).

**Provider side:**
- RFQs: `GET /api/provider/rfqs`, `GET /api/provider/rfqs/:id`.
- Quotes: `POST /api/provider/rfqs/:id/quotes`, `PATCH /api/provider/quotes/:id`, `POST /api/provider/quotes/:id/withdraw`.
- Job orders: `GET /api/provider/job-orders`, `GET /api/provider/job-orders/:id`.
- **Confirm payment received:** `POST /api/provider/job-orders/:id/confirm-received`  
  - Accept: `{ "confirm": true, "note": "optional" }` → job becomes **ACTIVE**.  
  - Reject: `{ "confirm": false, "rejectionReason": "required" }` → payment record **REJECTED**, job stays **AWAITING_PAYMENT** (never activated).
- After ACTIVE: assign operator, update status, visit check-in, attachments (see frontend guide for endpoints).

---

## 4. Fail / End States (No "FAILED" Status)

The system **does not use a literal "FAILED" status**. Negative outcomes are represented as:

| Case | Who | Result |
|------|-----|--------|
| **Payment rejected** | Provider calls confirm-received with `confirm: false` | PaymentRecord → **REJECTED**; ExternalJobOrder stays **AWAITING_PAYMENT** and is never activated. |
| **Cancelled** | Request or job order is cancelled via allowed transitions | **ExternalRequest** or **ExternalJobOrder** → **CANCELLED** (final; optional `cancellationReason`). |
| **Quote rejected / withdrawn** | Quote is rejected or provider withdraws | **ProviderQuote** → REJECTED or WITHDRAWN; the **request** can continue with another provider or quote. |

---

## 5. Quick Reference Table

| Party | Internal orders | External orders | Fail states in UI |
|-------|-----------------|-----------------|-------------------|
| **Fuel station** | Create via maintenance-requests or internal work-orders; list/details/review/close from `/api/internal/work-orders` | Create via maintenance-requests; list from `/api/station/requests`; select quote; confirm payment sent | Show payment REJECTED, CANCELLED, quote rejected/withdrawn |
| **Service provider** | Does not see or use | RFQ from `/api/provider/rfqs`; quotes; job orders from `/api/provider/job-orders`; confirm received (accept/reject) | Show payment rejected (REJECTED), CANCELLED, quote rejected/withdrawn |

---

## 6. Source Docs (What Was Done)

- **Frontend guide (AR):** `postman/frontend-internal-external-orders-guide-ar.md` — Station create (internal/external), internal work orders APIs, station external requests and payment, provider RFQ/quotes/job orders/confirm-received, and how to show fail states in the UI.
- **Internal/External and fail status (AR):** `postman/internal_external_orders_and_fail_status_7075eeb7.plan.md` — Backend behaviour: maintenanceMode → Internal vs External, provider scope, payment rejected / cancelled / quote rejected or withdrawn; no "FAILED" status.

This repo is the short summary of **Work Order** and **internal–external orders** and how they come from the above two deliverables.
