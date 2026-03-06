# Taqa App Doc

**Last updated:** 2/10/26 at 2:28 pm

---

## 1. Overview

A centralized application managed by the **Ministry of Energy / a Supervisory Authority**, aiming to organize and connect **Service Providers** with **Fuel Stations**, while enabling full supervision by the authority over maintenance and service operations **without any involvement in financial transactions**.

---

## 2. User Roles

### 1️⃣ Supervisory Authority

- Review and approve Service Provider registrations
- Review fuel stations registrations and their orders
- Manage and maintain the master list of services and their technical forms
- **Monitor:**
  - Service requests
  - Job Orders
  - Maintenance and service records
- **No access** to pricing or financial transactions

### 2️⃣ Service Providers

- Register on the system based on predefined conditions
- Await approval from the Supervisory Authority
- **After approval:**
  - Add services from the approved services list, or propose new services (subject to approval)
  - Create users and assign roles and permissions
  - Receive service requests
  - Submit price quotations
  - **Create and manage Job Orders** (see [§4 Job Order cycle](#4-job-order-cycle))
  - Update job and service execution status

### 3️⃣ Fuel Stations

- Browse approved Service Providers
- View available services
- Request a service through a dedicated Technical Form
- Track request status
- Receive Job Order details after confirmation

---

## 3. High-Level Workflow

1. **Service Provider** registers → **Authority** approval  
2. **Service Provider** configures services and internal users  
3. **Fuel Station:**
   - Selects a Service Provider
   - Submits a service request via the Technical Form
   - Request is received by the Service Provider  
4. **Service Provider:** Submits a quotation  
5. **Fuel Station:** Accepts (selects) a quote → **Job Order is created**  
6. **Payment confirmation:** Station confirms payment sent → Provider confirms payment received → Job Order becomes **ACTIVE**  
7. **Service Provider:** Executes work (visits, operators, reports), updates status  
8. **Fuel Station:** Reviews and approves or rejects completion  
9. **Supervisory Authority:** Monitors service and maintenance activities (no financial data)

---

## 4. Job Order Cycle (Actual Flow)

This section completes the “Create and manage Job Orders” part of the Service Provider role with the **actual cycle** implemented in the system.

### 4.1 How the Job Order is created

- The Job Order is **not** created by the Service Provider manually.
- It is created automatically when the **Fuel Station** selects one quotation via:
  - `POST /api/station/requests/:id/select-quote` with `{ "providerQuoteId": <id> }`
- At that moment the system creates:
  - **ExternalJobOrder** (status `AWAITING_PAYMENT`)
  - **PaymentRecord** to track payment confirmation

### 4.2 Payment confirmation (both sides)

| Step | Who | Action | API (example) |
|------|-----|--------|----------------|
| 1 | Fuel Station | Upload receipt | `POST /api/station/job-orders/:id/upload-receipt` |
| 2 | Fuel Station | Confirm payment sent | `POST /api/station/job-orders/:id/confirm-sent` |
| 3 | Service Provider | Confirm payment received | `POST /api/provider/job-orders/:id/confirm-received` (body: `{ "confirm": true }`) |

After both confirmations, **ExternalJobOrder** status becomes **ACTIVE** and the provider can start execution.

### 4.3 Execution and review

- **Service Provider:** Assign operators, record visits, update status (e.g. IN_PROGRESS, WAITING_PARTS, UNDER_REVIEW), submit reports.
- **Fuel Station:** Views job orders; after provider submits for review, the station can:
  - Approve: `POST /api/station/job-orders/:id/approve`
  - Reject (request rework): `POST /api/station/job-orders/:id/reject` (with reason)

### 4.4 Main statuses (reference)

- **External Request:** SUBMITTED_BY_STATION → SENT_TO_PROVIDERS → QUOTING_OPEN → AWAITING_PAYMENT → ACTIVE → COMPLETED (or CANCELLED)
- **External Job Order:** AWAITING_PAYMENT → ACTIVE → IN_PROGRESS / WAITING_PARTS / … → UNDER_REVIEW → CLOSED (or REWORK_REQUIRED)
- **Payment Record:** NOT_STARTED → STATION_CONFIRMED_SENT → PROVIDER_CONFIRMED_RECEIVED (then Job Order becomes ACTIVE)

---

*This doc aligns with the Taqa App product overview and with the technical flow in `postman/work-order-flow-fuel-station-to-provider-ar.md`.*
