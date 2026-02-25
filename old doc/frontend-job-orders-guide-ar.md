# دليل ربط الـ Frontend مع Job Orders

هذا الملف يشرح كيف يعمل مسار `Job Orders` في الباك إند وكيف تبني عليه شاشة Frontend بشكل صحيح.

يشمل:

- الفلو العام
- الصلاحيات المطلوبة
- الـ endpoints الأساسية
- طريقة الربط في الواجهة
- أهم الملاحظات العملية

---

## 1) Job Orders تمشي إزاي؟

`Job Order` يتم إنشاؤه بواسطة **Service Provider** اعتمادا على `quotationId`.

عند الإنشاء، الباك إند:

- يتحقق أن quotation موجودة
- يتحقق أن quotation تخص نفس منظمة مقدم الطلب (Service Provider)
- يربط تلقائيا `serviceRequestId`
- ينشئ order بحالة ابتدائية `CREATED`

حقول JobOrder الأساسية:

- `quotationId` (required)
- `serviceRequestId` (يتم توليده من quotation)
- `assignedBranchId` (optional)
- `status` (default: `CREATED`)
- `executionDetails` (optional JSON)

---

## 2) صلاحيات الوصول (Permissions)

المسار `/api/job-orders` عليه:

- `authenticate`
- `requireApprovedOrganization`

ثم endpoint-level permissions:

- قراءة الأوامر: `job-orders:read`
- إنشاء/تعديل assignments/visits: `job-orders:update`
- قراءة الدفع: `job-orders:read` + `payments:read`
- تأكيد الدفع: `payments:confirm`

> ملاحظة مهمة: إنشاء Job Order نفسه حاليا مربوط بـ `job-orders:update` وليس `job-orders:create`.

---

## 3) من يرى ماذا؟ (Organization Scope)

عند `GET /api/job-orders`:

- `AUTHORITY`: يرى كل الأوامر
- `FUEL_STATION`: يرى فقط الأوامر المرتبطة بطلباته (`ServiceRequest.fuelStationOrganizationId == req.organizationId`)
- `SERVICE_PROVIDER`: يرى الأوامر المرتبطة بعروضه (`quotation.serviceProviderOrganizationId == req.organizationId`)
- أي نوع آخر: لا يرى بيانات

عند `GET /api/job-orders/:id`: نفس الفكرة لكن على order واحد.

---

## 4) Endpoints الأساسية للفرونت

Base:

- `/api/job-orders`

### 4.1) List job orders

- `GET /api/job-orders?limit=50`
- Permission: `job-orders:read`
- `limit` افتراضي 50، والحد الأقصى 100

---

### 4.2) Create job order

- `POST /api/job-orders`
- Permission: `job-orders:update`

Body:

```json
{
  "quotationId": 10,
  "assignedBranchId": 3,
  "executionDetails": {
    "notes": "Start execution next week"
  }
}
```

---

### 4.3) Get by id

- `GET /api/job-orders/:id`
- Permission: `job-orders:read`

---

## 5) Assignments flow (داخل Job Order)

هذه العمليات مخصصة عمليا لـ **Service Provider** (يوجد check في controller).

### 5.1) List assignments

- `GET /api/job-orders/:id/assignments`
- Permission route: `job-orders:read`
- Controller يمنع غير Service Provider

### 5.2) Create assignment

- `POST /api/job-orders/:id/assignments`
- Permission: `job-orders:update`

Body:

```json
{
  "operatorId": 5,
  "arrivalTime": "2026-02-23T09:00:00.000Z",
  "status": "ASSIGNED"
}
```

قيود:

- operator لازم يكون تابع لنفس organization

### 5.3) Update assignment

- `PATCH /api/job-orders/:id/assignments/:assignmentId`
- Permission: `job-orders:update`

Body:

```json
{
  "arrivalTime": "2026-02-24T10:00:00.000Z",
  "status": "ARRIVED"
}
```

---

## 6) Visits flow (داخل Job Order)

أيضا مخصصة عمليا لـ Service Provider.

### 6.1) List visits

- `GET /api/job-orders/:id/visits`
- Permission route: `job-orders:read`

### 6.2) Create visit

- `POST /api/job-orders/:id/visits`
- Permission: `job-orders:update`

Body:

```json
{
  "visitDate": "2026-02-24",
  "status": "COMPLETED",
  "notes": "Inspection completed successfully"
}
```

### 6.3) Update visit

- `PATCH /api/job-orders/:id/visits/:visitId`
- Permission: `job-orders:update`

Body:

```json
{
  "status": "FOLLOW_UP_REQUIRED",
  "notes": "Need another visit"
}
```

---

## 7) Payment flow المرتبط بالـ Job Order

### 7.1) Get payment by job order

- `GET /api/job-orders/:id/payment`
- Permissions:
  - `job-orders:read`
  - `payments:read`

### 7.2) Confirm payment

- `POST /api/job-orders/:id/confirm-payment`
- Permission: `payments:confirm`

Body اختياري:

```json
{
  "amount": 1250.5,
  "currency": "USD"
}
```

سلوك مهم:

- لو Payment غير موجود:
  - الباك إند ينشئ Payment تلقائيا
  - amount/currency من body أو من `JobOrderFinancial` إن وجد
- ثم يحوله إلى `CONFIRMED`
- ويحفظ:
  - `confirmedByUserId`
  - `confirmedAt`

---

## 8) الـ Validation المهمة للفرونت

- كل ids في params: أرقام صحيحة (`id`, `assignmentId`, `visitId`)
- `confirm-payment`:
  - `amount` رقم موجب (اختياري)
  - `currency` 3 أحرف (اختياري)
- `create assignment`:
  - `operatorId` رقم موجب
  - `arrivalTime` بصيغة ISO datetime (اختياري)
- `create visit`:
  - `visitDate` بصيغة `YYYY-MM-DD`
  - `status` نص مطلوب

---

## 9) Frontend Integration عملي (Recommended)

## 9.1) Permissions guards

بعد `GET /api/auth/me`:

- استخدم `job-orders:read` لعرض القائمة والتفاصيل
- استخدم `job-orders:update` لأزرار create/update (order/assignment/visit)
- استخدم `payments:read` لإظهار tab أو card الدفع
- استخدم `payments:confirm` لزر Confirm Payment

## 9.2) شكل صفحة Details مقترح

Tabs:

1. `Overview` (بيانات Job Order)
2. `Assignments`
3. `Visits`
4. `Payment`

وكل tab يعمل fetch endpoint الخاص به on-demand.

## 9.3) ترتيب طلبات جيد

1. افتح `GET /api/job-orders/:id`
2. بعدها:
   - `GET /assignments`
   - `GET /visits`
   - `GET /payment` (لو user عنده `payments:read`)
3. بعد أي create/update:
   - refetch للـ tab الحالي + summary

---

## 10) أخطاء متوقعة في الواجهة

- `401`: التوكن ناقص/منتهي
- `403`:
  - permission ناقصة
  - أو org type غير مسموح في بعض العمليات
  - أو الوصول لـ order لا يخص المنظمة
- `404`:
  - job order/assignment/visit/operator غير موجود
- `400`:
  - validation فاشلة

اعرض رسائل واضحة للمستخدم حسب الحالة.

---

## 11) نقاط مهمة جدا قبل التسليم

- لا تعتمد على role name في إظهار أزرار Job Orders، اعتمد على permissions فقط.
- متوقع أن بعض العمليات تظهر في UI لكن تفشل 403 حسب organization type (خصوصا assignments/visits لغير Service Provider)، لذلك:
  - اعمل gating بالـ permission + نوع المنظمة لو متاح عندك من `/auth/me`.
- `JobOrderFinancial` قد يظهر أو لا حسب صلاحية `job-order-financial:read`، فخليه optional في الـ UI model.

---

## 12) Checklist سريع للفريق

- [ ] Fetch `/api/auth/me` وتخزين permissions
- [ ] Screen list: `GET /api/job-orders`
- [ ] Screen details: `GET /api/job-orders/:id`
- [ ] Assignments tab: list/create/update
- [ ] Visits tab: list/create/update
- [ ] Payment tab: read + confirm
- [ ] Handling شامل لـ 401/403/404/400
- [ ] UI guards based on permissions

