# دليل ربط الـ Frontend مع Service Categories

هذا الدليل يشرح كل ما يحتاجه فريق الـ Frontend للتعامل مع `Service Categories` في المشروع، بما يشمل:

- قراءة التصنيفات
- اقتراح تصنيف جديد
- اعتماد/رفض التصنيفات (Authority)
- ربط التصنيفات بالمنظمة (Service Provider)

---

## 1) المفهوم بسرعة

- `ServiceCategory` هي فئة خدمة (مثل: كهرباء، ميكانيكا، ...).
- لها حالات:
  - `PENDING`
  - `APPROVED`
  - `REJECTED`
- يمكن أن تكون:
  - مصنفة من Authority مباشرة (غالبا `APPROVED`)
  - أو مقترحة من Service Provider (تبدأ `PENDING`)

---

## 2) الصلاحيات المطلوبة (Permissions)

الـ route level security معتمد على:

- `service-categories:read` لقراءة التصنيفات
- `service-categories:propose` لاقتراح تصنيف جديد
- `service-categories:manage` للإدارة الكاملة (create/update/approve/reject) - Authority only

> ملاحظة: مسارات الإدارة الكاملة عليها أيضا `requireAuthority`، يعني حتى لو عندك permission لازم تكون organization type = `AUTHORITY`.

---

## 3) قائمة الـ Endpoints الأساسية

Base:

- `/api/service-categories`

### 3.1) List categories

- `GET /api/service-categories`
- يحتاج: `service-categories:read`

سلوك الفلترة حسب نوع المنظمة:

- `AUTHORITY`: يرى كل التصنيفات
- `SERVICE_PROVIDER`: يرى
  - كل `APPROVED`
  - + التصنيفات التي اقترحها هو (`proposedByOrganizationId = organizationId`)
- باقي الأنواع: ترى `APPROVED` فقط

---

### 3.2) Get by id

- `GET /api/service-categories/:id`
- يحتاج: `service-categories:read`

قواعد الوصول:

- غير الـ Authority لا يستطيع فتح تصنيف غير `APPROVED` إلا إذا كان هو الذي اقترحه.
- Service Provider لا يرى rejected category تخص منظمة أخرى.

---

### 3.3) Propose category (Service Provider)

- `POST /api/service-categories/propose`
- يحتاج:
  - organization approved (`requireApprovedOrganization`)
  - permission: `service-categories:propose`
  - organization type: `SERVICE_PROVIDER` فقط

Body:

```json
{
  "nameEn": "Electrical Maintenance",
  "nameAr": "صيانة كهربائية",
  "code": "ELEC_MAINT"
}
```

النتيجة:

- يتم إنشاء category بحالة `PENDING`
- `proposedByOrganizationId` = منظمة مقدم الطلب

---

### 3.4) Create category (Authority)

- `POST /api/service-categories`
- يحتاج:
  - `requireAuthority`
  - permission: `service-categories:manage`

Body:

```json
{
  "nameEn": "Mechanical Services",
  "nameAr": "خدمات ميكانيكية",
  "code": "MECH_SERV"
}
```

النتيجة:

- يتم الإنشاء مباشرة بحالة `APPROVED`

---

### 3.5) Update category (Authority)

- `PATCH /api/service-categories/:id`
- يحتاج:
  - `requireAuthority`
  - permission: `service-categories:manage`

Body (اختياري):

```json
{
  "nameEn": "Mechanical Repair",
  "nameAr": "إصلاح ميكانيكي",
  "code": "MECH_REPAIR"
}
```

قيود:

- لا يمكن تعديل Category حالتها `REJECTED`.

---

### 3.6) Approve proposal (Authority)

- `PATCH /api/service-categories/:id/approve`
- يحتاج:
  - `requireAuthority`
  - permission: `service-categories:manage`

قيد:

- مسموح فقط لو الحالة الحالية `PENDING`.

النتيجة:

- تتحول الحالة إلى `APPROVED`
- يتم مسح `rejectedAt` و `rejectedReason`

---

### 3.7) Reject proposal (Authority)

- `PATCH /api/service-categories/:id/reject`
- يحتاج:
  - `requireAuthority`
  - permission: `service-categories:manage`

Body اختياري:

```json
{
  "reason": "Category is duplicate"
}
```

قيد:

- مسموح فقط لو الحالة `PENDING`.

النتيجة:

- تتحول الحالة إلى `REJECTED`
- يتم تعبئة `rejectedAt` و `rejectedReason`

---

## 4) Schema/Validation المطلوبة من الفرونت

### create/propose

- `nameEn`: required, max 255
- `nameAr`: required, max 255
- `code`: optional, max 50

### update

- `nameEn`: optional
- `nameAr`: optional
- `code`: optional (يسمح null في update)

### path params

- `id` لازم يكون رقم صحيح موجب (digit string في URL)

---

## 5) شكل البيانات المتوقع (ServiceCategory)

غالبا هتشوف حقول مثل:

```json
{
  "id": 12,
  "nameEn": "Electrical Maintenance",
  "nameAr": "صيانة كهربائية",
  "code": "ELEC_MAINT",
  "status": "PENDING",
  "proposedByOrganizationId": 5,
  "rejectedAt": null,
  "rejectedReason": null,
  "createdAt": "2026-02-23T10:00:00.000Z",
  "updatedAt": "2026-02-23T10:00:00.000Z"
}
```

---

## 6) ربط Service Categories بالمنظمة (Service Provider Services)

بالإضافة إلى catalog الأساسي، يوجد endpoints لربط التصنيف بمنظمة معينة:

Base:

- `/api/organizations/:id/service-categories`

### 6.1) List linked categories for organization

- `GET /api/organizations/:id/service-categories`
- الوصول:
  - Authority مسموح
  - أو نفس المنظمة (`id == req.organizationId`)

---

### 6.2) Link category to organization

- `POST /api/organizations/:id/service-categories`

Body:

```json
{
  "serviceCategoryId": 3
}
```

قيود:

- المسموح: Service Provider نفسه أو Authority
- category لازم تكون موجودة
- category لازم تكون `APPROVED`
- `findOrCreate` مستخدم لتجنب تكرار الرابط

---

### 6.3) Unlink category from organization

- `DELETE /api/organizations/:id/service-categories/:categoryId`
- الوصول:
  - Authority مسموح
  - أو نفس المنظمة

---

## 7) Frontend Flow مقترح

## لواجهة Service Provider

1. اعمل `GET /api/service-categories` لعرض:
   - approved categories
   - + pending/rejected الخاصة به
2. زر "اقتراح تصنيف":
   - `POST /api/service-categories/propose`
3. بعد قبول التصنيف من Authority:
   - اعمل link للمنظمة عبر:
   - `POST /api/organizations/:id/service-categories`

## لواجهة Authority

1. `GET /api/service-categories` لعرض جميع التصنيفات
2. فلتر pending proposals في UI
3. استخدم:
   - `PATCH /api/service-categories/:id/approve`
   - أو `PATCH /api/service-categories/:id/reject`
4. للتعديل المباشر:
   - `PATCH /api/service-categories/:id`
   - أو إنشاء مباشر بـ `POST /api/service-categories`

---

## 8) Helper صلاحيات جاهز للفرونت

```ts
export const canReadServiceCategories = (permissions: string[]) =>
  permissions.includes("service-categories:read");

export const canProposeServiceCategories = (permissions: string[]) =>
  permissions.includes("service-categories:propose");

export const canManageServiceCategories = (permissions: string[]) =>
  permissions.includes("service-categories:manage");
```

مهم:

- إدارة الشاشة لا تعتمد على role name.
- اعتمد دائما على permissions القادمة من `/api/auth/me`.

---

## 9) أخطاء متوقعة (للتعامل في UI)

- `401` Unauthorized: التوكن مفقود/منتهي
- `403` Forbidden:
  - نوع المنظمة غير مسموح
  - أو permission غير كافية
  - أو محاولة approve/reject لحالة ليست `PENDING`
  - أو محاولة تعديل `REJECTED`
- `404` Not Found:
  - category غير موجودة
  - أو رابط منظمة-تصنيف غير موجود عند الحذف
- `400` Bad Request:
  - validation فاشلة

---

## 10) Checklist تنفيذ سريع للفرونت

- جلب permissions من `/api/auth/me`
- تفعيل guards:
  - read / propose / manage
- بناء شاشتين:
  - Service Provider: list + propose + link/unlink
  - Authority: list + create + update + approve/reject
- التعامل مع `PENDING/APPROVED/REJECTED` كـ badges واضحة
- إظهار `rejectedReason` عند وجودها

