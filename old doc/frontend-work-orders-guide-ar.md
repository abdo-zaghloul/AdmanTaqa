# دليل ربط الـ Frontend مع Work Orders

هذا الملف يشرح دورة `Work Orders` بالكامل داخل النظام: من الإنشاء إلى الإغلاق، مع توضيح الأدوار والصلاحيات، وكيفية ربطها في الـ Frontend بشكل عملي.

---

## 1) الفكرة العامة

`Work Order` يمثل أمر صيانة داخلي خاص بمنظمات `FUEL_STATION` فقط، والتنفيذ الفعلي يتم عبر `Internal Tasks`.

- الإنشاء: مستخدم لديه `workorders.create`
- الإسناد: مستخدم لديه `internal_tasks.assign`
- التنفيذ: الفني المعيّن لديه `internal_tasks.update_status`
- المراجعة/الإغلاق: مدير لديه `workorders.approve` و/أو `internal_tasks.review` و`internal_tasks.close`

---

## 2) دورة Work Orders الكاملة

## 2.1) الإنشاء (Create)

- Endpoint: `POST /api/work-orders`
- Permission: `workorders.create`
- متاح فقط لمنظمة نوعها `FUEL_STATION`

البيانات الأساسية:

- `title` (required)
- `branchId` (optional)
- `assetId` (optional)
- `description` (optional)
- `priority` (optional: `LOW | MEDIUM | HIGH`)
- `assignedUserId` (optional)

سلوك مهم:

- يتم إنشاء `WorkOrder` بحالة ابتدائية `PENDING`.
- يتم تسجيل `requestedByUserId` تلقائيا من المستخدم الحالي.
- لو `assignedUserId` موجود والمستخدم الحالي لديه `internal_tasks.assign`:
  - يتم إنشاء `Internal Task` تلقائيا.
- لو `assignedUserId` موجود لكن بدون صلاحية `internal_tasks.assign`:
  - يتم إنشاء الـ Work Order فقط بدون Task.

---

## 2.2) الإسناد (Assign)

- Endpoint: `POST /api/internal-tasks`
- Permission: `internal_tasks.assign`

العملية:

- إنشاء Task مرتبطة بـ `workOrderId`.
- حالة الـ Task تبدأ `ASSIGNED`.
- إذا كانت حالة الـ Work Order هي `PENDING` تتحول تلقائيا إلى `IN_PROGRESS`.

---

## 2.3) التنفيذ (Execution by Technician)

- Endpoint: `PATCH /api/internal-tasks/:id/status`
- Permission: `internal_tasks.update_status`
- شرط مهم: المستخدم لا يقدر يعدل إلا Task المعيّنة له.

التحويلات المسموحة لحالة الـ Task:

- `ASSIGNED -> IN_PROGRESS`
- `IN_PROGRESS -> PAUSED | WAITING_PARTS | COMPLETED`
- `PAUSED -> IN_PROGRESS`
- `WAITING_PARTS -> IN_PROGRESS`

سلوك مهم:

- عند تحويل Task إلى `COMPLETED`:
  - يتحول الـ Work Order إلى `UNDER_REVIEW`.
- عند `WAITING_PARTS`:
  - قد يتم إنشاء/إعادة استخدام Warehouse Order تلقائيا.

إرفاق ملفات أثناء التنفيذ:

- Endpoint: `POST /api/internal-tasks/:id/attachments`
- Permission: `internal_tasks.upload`

---

## 2.4) المراجعة (Review)

### أ) مراجعة Task

- Endpoint: `PATCH /api/internal-tasks/:id/review`
- Permission: `internal_tasks.review`
- Body: `decision = APPROVE | REJECT`

سلوك:

- `APPROVE`: يثبت المراجعة على الـ Task.
- `REJECT`: يعيد الـ Task إلى `IN_PROGRESS` ويعيد الـ Work Order إلى `IN_PROGRESS`.

### ب) مراجعة Work Order نفسها

- Endpoint: `PATCH /api/work-orders/:id/review`
- Permission: `workorders.approve`
- Body: `action = APPROVE | REJECT`, و`note` اختياري

سلوك:

- `APPROVE`: حالة الـ Work Order تصبح `CLOSED`.
- `REJECT`: حالة الـ Work Order تصبح `IN_PROGRESS` مع إعادة فتح آخر Task مكتملة.

---

## 2.5) الإغلاق (Close)

### إغلاق Work Order

- Endpoint: `PATCH /api/work-orders/:id/close`
- Permission: `workorders.approve`
- مسموح فقط لو الحالة الحالية: `UNDER_REVIEW` أو `IN_PROGRESS`

### إغلاق Task

- Endpoint: `PATCH /api/internal-tasks/:id/close`
- Permission: `internal_tasks.close`
- عند الإغلاق، قد يتم إغلاق الـ Work Order المرتبطة بها.

---

## 3) حالات Work Order الرسمية

- `PENDING`
- `IN_PROGRESS`
- `UNDER_REVIEW`
- `CLOSED`

---

## 4) مين بيعمل إيه؟ (Roles vs Permissions)

الاعتماد الأمني في الباك إند على **permission code** وليس اسم الـ role.

عمليا في الأدوار الافتراضية:

- `Station Manager`:
  - إنشاء Work Orders
  - إسناد Tasks
  - مراجعة/إغلاق
- `Supervisor`:
  - متابعة وقراءة، وقد يراجع حسب الصلاحيات الممنوحة
- `Technician`:
  - تنفيذ Task فقط (status + attachments)

---

## 5) Frontend Integration (عملي)

## 5.1) مصدر الصلاحيات

بعد تسجيل الدخول:

1. `POST /api/auth/login`
2. `GET /api/auth/me`
3. تخزين `permissions` وتحويلها إلى `Set`

لا تعتمد على role name في الحماية؛ اعتمد على `permissions`.

---

## 5.2) شاشات مقترحة

1. **Work Orders List**
   - `GET /api/work-orders`
   - Filters: `status`, `branchId`, `assetId`, `priority`, `page`, `limit`
2. **Work Order Details**
   - `GET /api/work-orders/:id`
3. **Internal Tasks Tab**
   - Manager view: `GET /api/internal-tasks?workOrderId=:id`
   - Technician view: `GET /api/internal-tasks/my`
4. **Review Queue**
   - Work Orders: `GET /api/work-orders/review-queue`
   - Tasks: `GET /api/internal-tasks/review-queue`

---

## 5.3) إظهار الأزرار حسب الصلاحية

- زر إنشاء Work Order: `workorders.create`
- زر تعديل Work Order: `workorders.update`
- زر إسناد Task: `internal_tasks.assign`
- أزرار تحديث حالة Task: `internal_tasks.update_status`
- زر رفع مرفقات: `internal_tasks.upload`
- أزرار مراجعة/إغلاق: `workorders.approve` و/أو `internal_tasks.review` و`internal_tasks.close`

---

## 5.4) ترتيب requests المقترح في صفحة التفاصيل

1. `GET /api/work-orders/:id`
2. `GET /api/internal-tasks?workOrderId=:id`
3. إظهار actions حسب الصلاحيات
4. بعد أي action (`assign`, `status`, `review`, `close`):
   - refetch للـ Work Order + tasks

---

## 5.5) الأخطاء المتوقعة في الواجهة

- `401`: token ناقص/منتهي
- `403`: صلاحية ناقصة أو scope غير مسموح
- `404`: work order/task غير موجود
- `400`: validation أو status transition غير صالح

اعرض رسائل واضحة للمستخدم لكل حالة.

---

## 6) Checklist سريع للـ Frontend

- [ ] جلب `/api/auth/me` وتخزين `permissions`
- [ ] بناء guards على مستوى الصفحات والأزرار
- [ ] شاشة list + details للـ Work Orders
- [ ] شاشة/تاب Internal Tasks (manager + technician flows)
- [ ] تنفيذ status transitions المسموحة فقط
- [ ] رفع المرفقات للفني
- [ ] review/close flows للمدير
- [ ] معالجة 401/403/404/400 بشكل واضح

