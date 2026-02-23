# دليل ربط الـ Frontend مع Roles and Permissions

هذا الملف يشرح نظام الصلاحيات الحالي في المشروع بشكل عملي بحيث فريق الـ Frontend يقدر يربطه بسرعة وبدون لخبطة.

## 1) المفاهيم الأساسية

- **Role**: دور وظيفي (مثل `Technician` أو `Station Manager`).
- **Permission**: صلاحية فعلية بيتحقق منها الباك إند (مثل `workorders.read` أو `team.assign_roles`).
- المستخدم ممكن يكون له Role واحد أو أكثر.
- الصلاحيات النهائية للمستخدم = **اتحاد** كل الصلاحيات الناتجة من كل Roles المربوطة به.
- القرار الأمني في الباك إند يعتمد على **Permission** وليس اسم الـ Role.

---

## 2) من أين يأخذ الفرونت الصلاحيات؟

بعد تسجيل الدخول:

1. `POST /api/auth/login`
2. حفظ `accessToken`
3. طلب `GET /api/auth/me` بالتوكن

استجابة `GET /api/auth/me` تحتوي:

- `user`
- `organization`
- `roles` (Array Objects)
- `permissions` (Array of Strings)

> **المصدر الرسمي للفرونت** في العرض/الإخفاء/الحماية هو `permissions` القادمة من `/api/auth/me`.

---

## 3) شكل البيانات المتوقع من /api/auth/me

مثال مبسط:

```json
{
  "user": {
    "id": 12,
    "email": "user@example.com",
    "fullName": "Ahmed Ali"
  },
  "organization": {
    "id": 3,
    "name": "My Station",
    "type": "FUEL_STATION"
  },
  "roles": [
    {
      "id": 16,
      "name": "Station Manager",
      "organizationId": 3,
      "isSystem": false
    }
  ],
  "permissions": [
    "team.read",
    "team.assign_roles",
    "workorders.read",
    "workorders.create",
    "assets.read"
  ]
}
```

---

## 4) نقطة مهمة جدا: اختلاف نمط كتابة Permission

في المشروع يوجد أكثر من نمط لصياغة permission code:

- Dot notation: `team.assign_roles`, `workorders.read`
- Colon notation: `roles:read`, `users:create`

### القاعدة في الفرونت

- لا تفترض نمطا موحدا.
- اعتبر كل permission مجرد string كما هي.
- تحقق بالمقارنة النصية المباشرة بنفس القيمة القادمة من API.

---

## 5) الـ APIs المتعلقة بإدارة Roles/Permissions

يوجد مساران أساسيان:

## A) مسار RBAC (مفيد جدا لسيناريو Fuel Station / Team)

- `GET /api/rbac/permissions`
- `GET /api/rbac/roles`
- `POST /api/rbac/roles`
- `PATCH /api/rbac/roles/:id`
- `DELETE /api/rbac/roles/:id`
- `POST /api/rbac/fuel-station/setup-default-roles`

## B) المسار العام Roles

- `GET /api/roles`
- `GET /api/roles/permissions`
- `GET /api/roles/:id`
- `POST /api/roles`
- `PATCH /api/roles/:id`

> لو شاشتك خاصة بإدارة فريق Fuel Station فغالبا ستعتمد على `/api/rbac/*` + `/api/team/*`.

---

## 6) أهم Permissions ظاهرة في الـ routes الحالية

- Team:
  - `team.read`
  - `team.invite`
  - `team.assign_roles`
  - `team.deactivate`
- Work Orders:
  - `workorders.create`
  - `workorders.read`
  - `workorders.update`
  - `workorders.approve`
- Assets:
  - `assets.read`
  - `assets.create`
  - `assets.update`
- Internal Tasks:
  - `internal_tasks.read`
  - `internal_tasks.assign`
  - `internal_tasks.review`
  - `internal_tasks.update_status`
  - `internal_tasks.close`
  - `internal_tasks.upload`
- Warehouse Orders:
  - `warehouse_orders.create`
  - `warehouse_orders.read`
  - `warehouse_orders.assign`
  - `warehouse_orders.update_status`
  - `warehouse_orders.close`

---

## 7) طريقة الربط في الـ Frontend (عملية)

## الخطوات

1. بعد login نفذ `GET /api/auth/me`.
2. خزّن `permissions` في state مركزي (Context / Redux / Zustand).
3. حوّلها إلى `Set` لتحسين الأداء في التحقق.
4. استخدم helper موحد للتحقق.
5. طبّق التحقق على:
   - حماية الصفحات
   - إظهار/إخفاء الأزرار
   - Disable لبعض actions الحساسة
6. في حال `403` من الباك إند:
   - اعرض رسالة "ليس لديك صلاحية"
   - لا تعتبرها خطأ UI عادي
7. بعد تعديل Role للمستخدم الحالي:
   - أعد طلب `/api/auth/me` لتحديث الصلاحيات فورا.

---

## 8) Helper جاهز (TypeScript)

```ts
export type MeResponse = {
  permissions?: string[];
};

export const buildPermissionHelpers = (me: MeResponse) => {
  const permissionSet = new Set(me.permissions || []);

  const hasPermission = (code: string) => permissionSet.has(code);
  const hasAnyPermission = (codes: string[]) => codes.some((c) => permissionSet.has(c));
  const hasAllPermissions = (codes: string[]) => codes.every((c) => permissionSet.has(c));

  return {
    permissionSet,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
};
```

مثال استخدام:

```ts
const { hasPermission } = buildPermissionHelpers(me);

const canInvite = hasPermission("team.invite");
const canAssignRoles = hasPermission("team.assign_roles");
const canReadWorkOrders = hasPermission("workorders.read");
```

---

## 9) حماية routes في الفرونت (مثال React)

```tsx
type GuardProps = {
  required: string;
  children: React.ReactNode;
};

function PermissionGuard({ required, children }: GuardProps) {
  const me = useMeStore((s) => s.me);
  const { hasPermission } = buildPermissionHelpers(me || {});

  if (!hasPermission(required)) {
    return <div>ليس لديك صلاحية للوصول.</div>;
  }

  return <>{children}</>;
}
```

---

## 10) قواعد مهمة لتجنب الأخطاء

- لا تعتمد على اسم Role في المنطق الأمني.
- لا تعمل hardcode من نوع: "لو role = X إذن يسمح بـ Y".
- اعتمد دائما على permissions القادمة من `/api/auth/me`.
- الباك إند هو الحماية النهائية، والفرونت طبقة UX فقط.
- ممكن user يشوف button في حالة cache قديم، لذلك التعامل مع `403` إلزامي.

---

## 11) سيناريو تشغيل سريع لفريق الفرونت

1. تسجيل دخول مستخدم.
2. جلب `/api/auth/me`.
3. فتح صفحة Team:
   - لو عنده `team.read` تظهر القائمة.
   - لو عنده `team.invite` يظهر زر الدعوة.
   - لو عنده `team.assign_roles` يظهر تعديل الدور.
4. تجربة مستخدم آخر بصلاحيات أقل للتأكد أن الحجب شغال.
5. تجربة API مباشرة بصلاحية ناقصة والتأكد من `403`.

---

## 12) ملحوظة عن إعداد الأدوار الافتراضية (Fuel Station)

عند الحاجة يمكن تشغيل:

- `POST /api/rbac/fuel-station/setup-default-roles`

هذا endpoint يضمن وجود الأدوار الافتراضية (مثل `Technician`, `Station Manager`, `Accountant`, `Supervisor`, `Warehouse Manager`) مع صلاحياتها.

---

## 13) الخلاصة التنفيذية

- للـ Frontend: اعتمد على `GET /api/auth/me` كمصدر وحيد للحكم.
- خزّن `permissions` كـ `Set`، وأنشئ helpers موحدة.
- افصل بين:
  - عرض Role (لـ UI)
  - قرار السماح/المنع (Permission)
- تعامل مع `403` كجزء أساسي من تجربة المستخدم.

