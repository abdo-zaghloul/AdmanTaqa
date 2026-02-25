# دليل ربط الـ Frontend مع Branch Requests

هذا الدليل يشرح:

- مين المفروض يستخدم `Branch Requests` في السيستم
- كل دور يعمل إيه
- ازاي تطبق الـ flow بالكامل في الـ Frontend

---

## 1) Branch Requests بتخدم إيه؟

`Branch Request` هي آلية موافقة لإضافة فرع جديد لمحطة وقود (`Fuel Station`) بدل الإنشاء المباشر.

يعني:

- محطة الوقود تقدم طلب
- الجهة (`Authority`) تراجعه
- لو موافقة: يتنشأ `Branch` فعلي في النظام

---

## 2) مين يستخدمها في السيستم؟

## Fuel Station

- تقديم طلب فرع جديد
- متابعة طلباته (قائمة + تفاصيل)

## Authority

- مراجعة كل الطلبات
- الموافقة أو الرفض

---

## 3) الصلاحيات المطلوبة (Permissions)

- `branch-requests:create`
  - تقديم طلب جديد

- `branch-requests:read`
  - عرض القائمة + التفاصيل

- `branch-requests:approve`
  - approve/reject (Authority)

قيود إضافية:

- جميع endpoints تحتاج `authenticate`
- إنشاء الطلب يحتاج `requireApprovedOrganization`
- approve/reject تحتاج `requireAuthority` (Authority فقط)

---

## 4) Endpoints الأساسية

Base:

- `/api/branch-requests`

### 4.1) Submit branch request

- `POST /api/branch-requests`
- من المفترض يستخدمها: Fuel Station فقط
- permission: `branch-requests:create`

Body (مثال):

```json
{
  "nameEn": "North Station Branch",
  "nameAr": "فرع المحطة الشمالية",
  "areaId": 10,
  "stationTypeId": 2,
  "licenseNumber": "LIC-2026-9911",
  "street": "Main St",
  "latitude": 30.1234567,
  "longitude": 31.1234567,
  "workingHours": {
    "sun": { "open": "08:00", "close": "22:00" },
    "fri": { "open": "24h" }
  },
  "address": "Cairo, ...",
  "ownerName": "Owner Name",
  "ownerEmail": "owner@example.com",
  "managerName": "Manager Name",
  "managerEmail": "manager@example.com",
  "managerPhone": "+201001234567",
  "createManagerAccount": true,
  "fuelTypeIds": [1, 2]
}
```

نتيجة الإنشاء:

- request status = `PENDING`
- reference code يتولد تلقائي (مثل: `BR-2026-AB12CD34`)

---

### 4.2) List branch requests

- `GET /api/branch-requests?status=PENDING&page=1&limit=20`
- permission: `branch-requests:read`

منطق النطاق:

- `AUTHORITY`: يرى كل الطلبات
- غير Authority: يرى طلبات منظمته فقط

الاستجابة تحتوي pagination:

- `items`
- `total`
- `page`
- `limit`

---

### 4.3) Get request by id

- `GET /api/branch-requests/:id`
- permission: `branch-requests:read`

الوصول:

- Owner organization أو Authority

---

### 4.4) Approve request (Authority)

- `POST /api/branch-requests/:id/approve`
- permissions/guards:
  - `requireAuthority`
  - `branch-requests:approve`

شروط:

- الحالة لازم تكون `PENDING` أو `UNDER_REVIEW`

---

### 4.5) Reject request (Authority)

- `POST /api/branch-requests/:id/reject`
- permissions/guards:
  - `requireAuthority`
  - `branch-requests:approve`

Body اختياري:

```json
{
  "reason": "Missing required location details"
}
```

---

## 5) حالات الطلب (Status Lifecycle)

- `PENDING` → عند التقديم
- `UNDER_REVIEW` → أثناء المراجعة (مدعوم في النظام)
- `APPROVED` → بعد الموافقة
- `REJECTED` → بعد الرفض

---

## 6) ماذا يحدث عند الموافقة؟ (Side Effects مهمة)

عند approve الباك إند يقوم بـ:

1. إنشاء `Branch` فعلي بحالة `APPROVED`
2. ربط `branchId` داخل `BranchRequest`
3. لو `createManagerAccount=true` و`managerEmail` موجود:
   - ينشئ user manager (أو يستخدم الموجود)
   - يحاول يربطه بدور `Station Manager`
4. يربط الـ manager بالفرع في `UserBranch`
5. ينشئ `BranchFuelType` من `fuelTypeIds`

هذا مهم للفرونت لأن:

- approved request ليس فقط status change
- بل ينتج branch فعلي يمكن عرضه/استخدامه في شاشات أخرى

---

## 7) تطبيق الـ Frontend عمليا

## 7.1) شاشة Fuel Station - Submit Request

- Form للحقول الأساسية:
  - `nameEn`, `nameAr`, `areaId`
- حقول إضافية اختيارية:
  - الموقع، بيانات المالك/المدير، `fuelTypeIds`
- submit إلى:
  - `POST /api/branch-requests`
- بعد النجاح:
  - toast + تحويل إلى صفحة القائمة

## 7.2) شاشة Fuel Station - My Requests

- API:
  - `GET /api/branch-requests?status=&page=1&limit=20`
- عرض:
  - `referenceCode`
  - `status`
  - `submittedAt`
  - `rejectionReason` لو مرفوض
- أزرار:
  - تفاصيل الطلب

## 7.3) شاشة Authority - Review Queue

- API:
  - `GET /api/branch-requests?status=PENDING&page=1&limit=20`
- Actions:
  - Approve
  - Reject (modal فيها reason)

## 7.4) شاشة التفاصيل

- API:
  - `GET /api/branch-requests/:id`
- اعرض:
  - بيانات الطلب
  - بيانات المنطقة/نوع المحطة
  - الحالة
  - سبب الرفض (إن وجد)
  - branch المرتبط بعد الموافقة (إن وجد)

---

## 8) Guards في الفرونت (مهم)

بعد `/api/auth/me`:

- استخدم `organization.type` + `permissions[]`

قواعد بسيطة:

- Submit button:
  - `organization.type === "FUEL_STATION"`
  - + `branch-requests:create`
- Review actions (approve/reject):
  - `organization.type === "AUTHORITY"`
  - + `branch-requests:approve`
- List/details:
  - `branch-requests:read`

---

## 9) Validation ملخص

### Submit

- Required:
  - `nameEn`, `nameAr`, `areaId`
- Optional:
  - `licenseNumber`, `stationTypeId`, `street`, `latitude`, `longitude`
  - `workingHours`, `address`
  - بيانات owner/manager
  - `createManagerAccount`
  - `fuelTypeIds` (array of positive integers)

### List query

- `status` من enum status
- `page` رقم موجب
- `limit` رقم موجب (backend cap = 100)

### Reject body

- `reason` اختياري (max 2000)

---

## 10) أخطاء متوقعة في الواجهة

- `401` Unauthorized:
  - token ناقص أو منتهي

- `403` Forbidden:
  - role/organization type غير مسموح
  - أو صلاحية ناقصة

- `404` Not Found:
  - request غير موجود

- `400` Bad Request:
  - status غير صالح للـ action
  - أو validation فاشلة

---

## 11) Checklist تنفيذ سريع

- [ ] جلب `permissions` و `organization.type` من `/api/auth/me`
- [ ] صفحة Fuel Station submit request
- [ ] صفحة list with filters (`status`, `page`, `limit`)
- [ ] صفحة details
- [ ] صفحة Authority review queue
- [ ] approve/reject actions مع refetch
- [ ] عرض rejection reason بوضوح
- [ ] معالجة 401/403/404/400

