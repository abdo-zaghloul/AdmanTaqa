# Work Order Cycles — FUEL_STATION & SERVICE_PROVIDER (React Reference)

مرجع لدورتي **محطة الوقود (FUEL_STATION)** و**مزود الخدمة (SERVICE_PROVIDER)** في تطبيق **taqa-admin** (React)، مطابقاً لما في الموبايل (gas_flutter) والـ API.

---

## نظرة عامة

| نوع المنظمة | الدورة الرئيسية | الصفحات في taqa-admin |
|-------------|-----------------|------------------------|
| **FUEL_STATION** | أوامر عمل داخلية، أوامر داخلية (Internal)، طلبات صيانة خارجية، أوامر العمل من المحطة | Work Orders, Internal Work Orders, External Requests, Station Job Orders, Linked Providers |
| **SERVICE_PROVIDER** | طلبات عرض السعر (RFQs)، أوامر العمل (Job Orders)، عروض سعر، زيارات وCheck-in | RFQs, Provider Job Orders, Provider Review Queue, Quotations |

---

# دورة FUEL_STATION

## 1. Work Orders (أوامر العمل الداخلية — مدير المحطة)

**نوع المنظمة:** `FUEL_STATION` فقط.

### الروابط

| Path | الوصف |
|------|--------|
| `/work-orders` | قائمة أوامر العمل (تبويبات: New, In progress, Under review, Closed) |
| `/work-orders/review-queue` | طابور المراجعة (أوامر UNDER_REVIEW) |
| `/work-orders/:id` | تفاصيل أمر عمل (عرض، موافقة/رفض/إغلاق حسب الصلاحية والحالة) |

### الصلاحيات

| Permission | الاستخدام |
|------------|----------|
| `workorders.read` | عرض القائمة وتفاصيل الأمر |
| `workorders.create` | زر إنشاء أمر ونموذج الإنشاء |
| `workorders.approve` | تبويب "Under review"، طابور المراجعة، أزرار Approve / Reject / Close (حسب الحالة) |

### الـ API (Work Orders)

| Method | Path | الوصف |
|--------|------|--------|
| GET | `/work-orders` | قائمة (query: `status`, `page`, `limit`, `branchId`, `assetId`, `priority`) |
| GET | `/work-orders/:id` | تفاصيل أمر |
| GET | `/work-orders/review-queue` | طابور المراجعة (pagination) |
| POST | `/work-orders` | إنشاء (body: `title`, `description?`, `priority?`, `branchId?`, `assetId?`, `assignedUserId?`) |
| PATCH | `/work-orders/:id/review` | مراجعة (body: `action`: `APPROVE` \| `REJECT`, `note?`) |
| PATCH | `/work-orders/:id/close` | إغلاق (بدون body) |

### الملفات (Work Orders)

- قائمة: `src/pages/WorkOrders/WorkOrders.tsx`
- تفاصيل: `src/pages/WorkOrders/WorkOrderDetails.tsx`
- طابور مراجعة: `src/pages/WorkOrders/WorkOrdersReviewQueue.tsx`
- إنشاء: `src/pages/WorkOrders/components/CreateWorkOrderDialog.tsx`
- خدمة: `src/api/services/workOrderService.ts`، أنواع: `src/types/workOrder.ts`

---

## 2. Internal Work Orders (أوامر العمل الداخلية — من طلب صيانة INTERNAL)

**نوع المنظمة:** `FUEL_STATION`.

### الروابط

| Path | الوصف |
|------|--------|
| `/internal-work-orders` | قائمة أوامر العمل الداخلية (من طلبات صيانة داخلية) |
| `/internal-work-orders/review-queue` | طابور مراجعة المهام الداخلية |
| `/internal-work-orders/:id` | تفاصيل أمر داخلي |

### الـ API (Internal Tasks)

- قائمة: `GET /internal-tasks` (مع `workOrderId` أو فلتر حسب الباكند)
- تفاصيل: `GET /internal-tasks/:id`
- تحديث حالة (بدء/إكمال): `PATCH /internal-tasks/:id/status` (مثلاً `{ "status": "IN_PROGRESS" }`)

### الملفات

- `src/pages/Station/InternalWorkOrders.tsx`, `InternalWorkOrderDetail.tsx`, `InternalWorkOrdersReviewQueue.tsx`

---

## 3. Station Requests (طلبات الصيانة — خارجية/داخلية)

**نوع المنظمة:** `FUEL_STATION`.

### الروابط

| Path | الوصف |
|------|--------|
| `/station-requests` | قائمة طلبات المحطة (طلبات صيانة) |
| `/station-requests/create` | إنشاء طلب صيانة (داخلي أو خارجي) |
| `/station-requests/:id` | تفاصيل طلب (عروض المزودين، اختيار عرض، إنشاء Job Order) |

### الـ API (Station)

| Method | Path | الوصف |
|--------|------|--------|
| GET | `/station/requests` | قائمة طلبات المحطة |
| GET | `/station/requests/:id` | تفاصيل طلب + عروض المزودين |
| POST | `/station/maintenance-requests` | إنشاء طلب صيانة (body: branchId, title, description, priority, maintenanceMode: INTERNAL \| EXTERNAL) |
| POST | `/station/requests/:id/send-to-providers` | إرسال الطلب لمزودين (body: providerOrganizationIds) |
| POST | `/station/requests/:id/select-quote` | اختيار عرض وإنشاء Job Order (body: providerQuoteId) |
| POST | `/station/requests/:id/reject-quote` | رفض عرض (body: providerQuoteId, rejectionReason) |

### الملفات

- `src/pages/Station/StationRequests.tsx`, `StationRequestDetail.tsx`, `CreateMaintenanceRequest.tsx`
- `src/api/services/stationService.ts`

---

## 4. Station Job Orders و Linked Providers

**نوع المنظمة:** `FUEL_STATION`.

- **Station Job Orders:** `/station-job-orders`, `/station-job-orders/:id` — أوامر العمل الناتجة عن اختيار عرض من طلب خارجي.
- **Linked Providers:** `/linked-providers` — المزودون المرتبطون بالمحطة (لإرسال الطلبات).
- الـ API: من `stationService` (مثلاً طلبات المحطة تحتوي jobOrders أو ExternalJobOrder).

---

# دورة SERVICE_PROVIDER

## 1. RFQs (طلبات عرض السعر)

**نوع المنظمة:** `SERVICE_PROVIDER` فقط.

المحطة ترسل طلبات صيانة؛ المزود يراها كـ **طلبات عرض سعر (RFQ)**.

### الروابط

| Path | الوصف |
|------|--------|
| `/provider-rfqs` | قائمة RFQs الواردة للمزود |
| `/provider-rfqs/:id` | تفاصيل RFQ (عرض، إرسال عرض سعر، تأكيد استلام) |

### الـ API (Provider RFQs)

| Method | Path | الوصف |
|--------|------|--------|
| GET | `/provider/rfqs` | قائمة (query: status, page, limit) |
| GET | `/provider/rfqs/:id` | تفاصيل RFQ |
| PATCH | `/requests/:id` | تأكيد استلام (مثلاً body: `{ "status": "RECEIVED" }` — حسب الباكند) |
| POST | `/provider/rfqs/:id/quotes` | إنشاء عرض سعر للـ RFQ |
| PATCH | `/provider/quotes/:id` | تعديل عرض سعر |
| POST | `/provider/quotes/:id/withdraw` | سحب عرض سعر |

### الملفات

- `src/pages/Provider/ProviderRfqs.tsx`, `ProviderRfqDetail.tsx`
- `src/api/services/providerService.ts`، أنواع: `src/types/provider.ts`

---

## 2. Provider Job Orders (أوامر عمل المزود)

**نوع المنظمة:** `SERVICE_PROVIDER`.

أوامر العمل اللي المزود فتحها أو يشتغل عليها (من اختيار المحطة لعرض سعر).

### الروابط

| Path | الوصف |
|------|--------|
| `/provider-job-orders` | قائمة أوامر عمل المزود |
| `/provider-job-orders/review-queue` | طابور مراجعة أوامر المزود |
| `/provider-job-orders/:id` | تفاصيل أمر (زيارات، Check-in، مرفقات، تقارير، تسليم للإكمال) |

### الـ API (Provider Job Orders)

| Method | Path | الوصف |
|--------|------|--------|
| GET | `/provider/job-orders` | قائمة (query: status, page, limit) |
| GET | `/provider/job-orders/:id` | تفاصيل أمر |
| POST | `/job-orders` | إنشاء Job Order (body: title, description, status, priority, … — حسب الباكند) |
| PUT | `/job-orders/:id` | تحديث Job Order |
| DELETE | `/job-orders/:id` | حذف (إن وُجد) |
| POST | `/provider/job-orders/:id/confirm-received` | تأكيد استلام |
| PATCH | `/provider/job-orders/:id/assign-operator` | تعيين مشغّل |
| PATCH | `/provider/job-orders/:id/status` | تحديث الحالة |
| GET | `/provider/job-orders/:id/visits` | قائمة الزيارات |
| POST | `/provider/job-orders/:id/visits` | إنشاء زيارة (EXECUTION \| INSPECTION \| FOLLOW_UP) |
| POST | `/provider/job-orders/:id/visits/checkin` | Check-in زيارة (بدون إنشاء زيارة مسبقة — حسب الباكند) |
| GET | `/provider/visits/:visitId` | تفاصيل زيارة |
| POST | `/provider/visits/:visitId/checkin` | تسجيل وصول للزيارة (body: method GPS\|QR\|MANUAL, notes) |
| POST | `/provider/visits/:visitId/complete` | إكمال الزيارة (body: completionNote اختياري) |
| GET | `/provider/job-orders/:id/attachments` | مرفقات الأمر |
| POST | `/provider/job-orders/:id/attachments/upload` | رفع مرفق (multipart) |
| GET | `/provider/job-orders/:id/reports` | تقارير الصيانة |
| POST | `/provider/job-orders/:id/reports` | إنشاء تقرير |
| POST | `/provider/job-orders/:id/submit-completion` | تسليم الأمر للإكمال (للمراجعة) |
| GET | `/provider/job-orders/:id/timeline` | تايملاين النشاطات |

### الملفات

- `src/pages/Provider/ProviderJobOrders.tsx`, `ProviderJobOrderDetail.tsx`, `ProviderJobOrdersReviewQueue.tsx`
- `src/api/services/providerService.ts`

---

## 3. Quotations (العروض السعرية)

**نوع المنظمة:** `SERVICE_PROVIDER` (وقد تظهر لـ FUEL_STATION / AUTHORITY حسب الصلاحيات).

- قائمة العروض وتفاصيلها وإنشاؤها حسب الباكند (`/quotations`, `/provider/rfqs/:id/quotes` إلخ).
- الصفحة: `src/pages/Quotations/Quotations.tsx`.

---

# ملخص الروابط حسب نوع المنظمة

| المنظمة | المسارات |
|---------|----------|
| **FUEL_STATION** | `/work-orders`, `/work-orders/review-queue`, `/work-orders/:id`, `/internal-work-orders`, `/internal-work-orders/review-queue`, `/internal-work-orders/:id`, `/station-requests`, `/station-requests/create`, `/station-requests/:id`, `/station-job-orders`, `/station-job-orders/:id`, `/linked-providers` |
| **SERVICE_PROVIDER** | `/provider-rfqs`, `/provider-rfqs/:id`, `/provider-job-orders`, `/provider-job-orders/review-queue`, `/provider-job-orders/:id`, `/quotations` |

---

# الصلاحيات و orgTypes (من accessControl)

- **work-orders:** `orgTypes: ["FUEL_STATION"]` — `workorders.read`, `workorders.create`, `workorders.approve`
- **internal-work-orders:** `orgTypes: ["FUEL_STATION"]`
- **station-requests, station-job-orders, linked-providers:** `orgTypes: ["FUEL_STATION"]`
- **provider-rfqs, provider-job-orders:** `orgTypes: ["SERVICE_PROVIDER"]`
- **quotations:** `orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION", "AUTHORITY"]` — `quotations:read`, `quotations:submit`

---

# تدفق مختصر

**FUEL_STATION:** إنشاء طلب صيانة (داخلي → Internal Work Order، خارجي → إرسال لمزودين) → اختيار عرض → Job Order للمحطة. أوامر العمل الداخلية (Work Orders) من المدير: إنشاء، تبويبات، مراجعة، إغلاق.

**SERVICE_PROVIDER:** استقبال RFQs → عرض سعر أو إنشاء Job Order → تنفيذ الأمر: زيارات، Check-in، تقارير، تسليم للإكمال → طابور مراجعة إن وُجد.

---

# مراجع إضافية

- **Flutter / API:** `gas_flutter/docs/work-order-flow-fuel-station-to-provider.md`
- **مزود الخدمة (RFQs و Jobs):** `gas_flutter/docs/service-provider-rfqs-and-jobs.md`
