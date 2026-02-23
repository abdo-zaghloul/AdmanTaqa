# ملخص كل الشغل المنفذ

الملف ده فيه كل التعديلات اللي اتعملت، مقسمة بوضوح إلى:

- **مربوط بالباك (API Integration)**
- **فرونت فقط (UI/UX/Refactor)**

---

## 1) الجزء المربوط بالباك (API)

## Users

### Endpoints متربطة فعليًا

- `GET /api/users` لعرض قائمة المستخدمين
- `GET /api/users/:id` لعرض تفاصيل مستخدم
- `POST /api/users` لإنشاء مستخدم
- `PATCH /api/users/:id` لتعديل المستخدم
- `DELETE /api/users/:id` لحذف المستخدم

### Hooks الجديدة/المعدلة

- `src/hooks/Users/useGetUsers.ts`
- `src/hooks/Users/useGetUserById.ts`
- `src/hooks/Users/useCreateUser.ts`
- `src/hooks/Users/useUpdateUser.ts` (جديد)
- `src/hooks/Users/useDeleteUser.ts` (جديد)

### Types الخاصة بالـ API

ملف: `src/types/user.ts`

- `ApiUser`
- `UsersListResponse`
- `UserDetailResponse`
- `CreateUserBody`
- `UpdateUserBody` (جديد)

### سلوك بعد النجاح (React Query)

- تعديل المستخدم `PATCH`:
  - invalidate `["user", id]`
  - invalidate `["users"]`
- حذف المستخدم `DELETE`:
  - invalidate `["users"]`
- إنشاء المستخدم `POST`:
  - invalidate `["users"]`

## Organizations (Authority)

### Endpoint المستخدم

- `POST /api/organizations/:id/approve` للـ approve/reject حسب body:
  - `decision: "APPROVED" | "REJECTED"`
  - `reason?`

### Hook المستخدم

- `src/hooks/Organization/useApproveOrganization.ts`

---

## 2) الجزء المعمول فرونت فقط (UI / UX / Refactor)

## Users UI

### Components جديدة

- `src/pages/Users/component/EditUserDialog.tsx`
  - مودال لتعديل المستخدم (name, phone, isActive, optional password)
  - يرسل فقط الحقول المتغيرة

- `src/pages/Users/component/DeleteUserDialog.tsx`
  - مودال تأكيد حذف المستخدم

### تعديل مكونات قائمة المستخدمين

- `src/pages/Users/component/UsersTableCardContent.tsx`
  - menu actions (`View/Edit/Delete`) بالـ portal
  - فتح `EditUserDialog` و`DeleteUserDialog` مباشرة من الجدول
  - إزالة الـ placeholder القديم للحذف

- `src/pages/Users/Users.tsx`
  - تنظيف منطق الحذف القديم
  - الاستمرار على `CreateUserDialog`
  - تحديث mapping ليشمل `isActive`

- `src/pages/Users/UserDetails.tsx`
  - عرض تفاصيل المستخدم من الـ API
  - إضافة زر **Edit** و**Delete**
  - ربط نفس الـ dialogs القابلة لإعادة الاستخدام

## Organizations UI (Authority)

### Components جديدة

- `src/pages/Authority/Organizations/Component/RejectModal.tsx`
  - مودال سبب الرفض
  - reset للسبب بعد الغلق أو submit

- `src/pages/Authority/Organizations/Component/OrganizationActions.tsx`
  - مكون موحد لأزرار `Approve/Reject`
  - يظهر فقط عند `status === "PENDING"`
  - يدعم loading state و toasts
  - يقبل `onSuccess?`

### Refactor الصفحات

- `src/pages/Authority/Organizations/Component/TableOrganization.tsx`
  - إزالة تكرار approve/reject logic
  - استخدام `OrganizationActions` بدل callbacks القديمة

- `src/pages/Authority/Organizations/OrganizationDetails.tsx`
  - إزالة التكرار
  - استخدام `OrganizationActions` مع `onSuccess` للتنقل

- `src/pages/Authority/Organizations/Organizations.tsx`
  - إزالة mutation handlers المكررة
  - الصفحة مسؤولة عن listing/filter فقط

### ملفات تم حذفها ضمن التنظيف

- `src/pages/Authority/Organizations/Component/OrganizationApproveRejectButtons.tsx`
- `src/pages/Authority/Organizations/Component/OrganizationApproveRejectActions.tsx`
- `src/pages/Authority/Organizations/Component/OrganizationApproveReject.tsx`

---

## 3) تحسينات عامة

- توحيد handling للأخطاء في hooks:
  - قراءة `response.data.message` عند وجودها
  - fallback إلى `Error.message`
  - fallback لرسالة افتراضية

- تحسين قابلية الصيانة:
  - تقليل التكرار
  - فصل المكونات reusable
  - الحفاظ على نفس التصميم العام (shadcn/ui + Tailwind)

---

## 4) الحالة الحالية

- التعديلات المذكورة مطبقة.
- الملفات المعدلة تم التحقق منها بدون lint errors أثناء التنفيذ.
