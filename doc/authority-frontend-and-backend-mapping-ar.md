# Authority — الفرونت اند فقط وربطه بالباك اند

هذا المستند يوضح **كل ما هو متاح لـ Authority في الواجهة الأمامية (Front-end) فقط**، ثم **أيّه مربوط بالباك اند (API)** وأيّه **غير مربوط (بيانات ثابتة / Mock)**.

---

## 1) من يدخل كـ Authority؟

- نوع المنظمة في النظام: **Authority** (`organization.type === 'AUTHORITY'`).
- بعد تسجيل الدخول يتم جلب البروفايل من **`GET /api/auth/me`** ويُحدَّد منها نوع المنظمة والصلاحيات، وعليها تُعرض القوائم والصفحات.
- الصفحات التي لا يسمح لها بالوصول تُظهر **Access Denied**.

---

## 2) شاشات الـ Authority في الفرونت اند (القائمة الكاملة)

| # | الشاشة (المسار) | ماذا ترى / تفعل | الصلاحية المطلوبة |
|---|-----------------|------------------|-------------------|
| 1 | **Organizations** (`/organizations`) | قائمة كل المنظمات (أي نوع)، فلترة وبحث، جدول مع إجراءات | `organizations:read` أو `organizations:approve` |
| 2 | **تفاصيل منظمة** (`/organizations/:id`) | بيانات المنظمة، مستندات، سجل الموافقة، أزرار موافقة/رفض (إن كانت Pending) | نفس الأعلى |
| 3 | **Fuel Stations** (`/fuel-stations`) | قائمة منظمات من نوع محطة وقود فقط، فلترة (Pending / Approved / Rejected)، عمود سبب الرفض | نفس الأعلى |
| 4 | **تفاصيل محطة وقود** (`/fuel-stations/:id`) | نفس شاشة تفاصيل المنظمة؛ زر الرجوع يعيدك لقائمة Fuel Stations | نفس الأعلى |
| 5 | **Registrations** (`/registrations`) | قائمة (في الكود الحالي: معتمدة على قائمة المنظمات المعتمدة) | نفس الأعلى |
| 6 | **تفاصيل تسجيل** (`/registrations/:id`) | تفاصيل طلب تسجيل، موافقة/رفض | نفس الأعلى |
| 7 | **Onboarding** (`/onboarding`, `/onboarding/:id`) | إدارة محتوى الـ onboarding (قائمة، إضافة، تعديل، حذف، مع صورة) | نفس الأعلى |
| 8 | **Inspections** (`/inspections`) | قائمة تفتيشات ونموذج إنشاء تفتيش | `inspections:read` أو `inspections:create` |
| 9 | **System Audit Log** (`/audit-log`) | سجل إداري مع ترقيم صفحات (page size، previous/next) | `audit:read` |
| 10 | **Branch Requests** (`/branch-requests`, `/branch-requests/:id`) | قائمة طلبات فروع وتفاصيل طلب؛ موافقة/رفض (مع سبب للرفض) | في `accessControl.ts`: مسار التفاصيل `branch-requests/:id` فقط مُعرَّف لـ Authority؛ قائمة `branch-requests` مُعرَّفة لـ FUEL_STATION و SERVICE_PROVIDER. إن ظهرت القائمة للـ Authority في الواجهة فغالباً من إعداد آخر أو مطلوب إضافة AUTHORITY للقائمة. |
| 11 | **Job Orders** (`/job-orders`, `/job-orders/:id`) | قائمة أوامر عمل وعرض تفاصيل (قراءة فقط) | `job-orders:read` |
| 12 | **Quotations** (`/quotations`) | عروض أسعار / RFQs (عرض وتقديم حسب الصلاحية) | `quotations:read` أو `quotations:submit` |
| 13 | **Service Categories** (`/service-categories`) | فئات الخدمة (مشتركة مع Service Provider) | حسب الإعداد |
| 14 | **Service Offering** (`/service-Offering`) | عروض الخدمة (مشتركة) | حسب الإعداد |

---

## 3) ربط كل شاشة بالباك اند (مربوط ✅ / غير مربوط ❌)

### 3.1 مربوط بالباك اند (يستدعي API حقيقي)

| الشاشة / الوظيفة | مربوط بالباك؟ | الـ API المستخدم (Back-end) |
|------------------|----------------|-----------------------------|
| **Organizations (قائمة)** | ✅ نعم | `GET /api/organizations` (مع query: status, type, page, limit) |
| **تفاصيل منظمة** | ✅ نعم | `GET /api/organizations/:id` |
| **مستندات المنظمة** | ✅ نعم | `GET /api/organizations/:id/documents` |
| **سجل الموافقة للمنظمة** | ✅ نعم | `GET /api/organizations/:id/approval-history` |
| **موافقة / رفض منظمة أو محطة وقود** | ✅ نعم | `POST /api/organizations/:id/approve` (body: `decision: "APPROVED"` أو `"REJECTED"` + `reason` عند الرفض) |
| **Fuel Stations (قائمة)** | ✅ نعم | `GET /api/organizations/fuel-stations` (مع query: status, page, limit) |
| **تفاصيل محطة وقود** | ✅ نعم | نفس `GET /api/organizations/:id` (نفس صفحة OrganizationDetails) |
| **Registrations (قائمة)** | ✅ نعم | في الكود الحالي: قائمة المعتمَدين من **`GET /api/organizations`** (status APPROVED) |
| **تفاصيل تسجيل + موافقة/رفض** | ✅ نعم | `GET /api/registrations/:id`، `POST /api/registrations/:id/approve`، `POST /api/registrations/:id/reject` |
| **Onboarding (قائمة، تفاصيل، إنشاء، تعديل، حذف)** | ✅ نعم | خدمات الـ onboarding في الـ API (مثل `GET/POST/PATCH/DELETE` حسب الـ backend) — الـ hooks: useGetOnboarding، useGetOnboardingById، useUpdateOnboarding، إلخ |
| **System Audit Log** | ✅ نعم | `GET /api/audit?page=&limit=` (ترقيم صفحات) |
| **Branch Requests (قائمة)** | ✅ نعم (API موجود) | `GET /api/branch-requests` — الـ API موجود؛ في الكود صلاحية **عرض** القائمة للـ Authority قد تحتاج تأكيد (انظر accessControl: القائمة لـ FUEL_STATION و SERVICE_PROVIDER، التفاصيل لـ Authority). |
| **تفاصيل Branch Request + موافقة/رفض** | ✅ نعم | `GET /api/branch-requests/:id`، `POST /api/branch-requests/:id/approve`، `POST /api/branch-requests/:id/reject` |
| **Quotations** | ✅ نعم | الـ hooks تستدعي API الـ quotations (مثل useGetQuotations) |
| **Service Categories** | ✅ نعم | API فئات الخدمة (قائمة، تفاصيل، إلخ) |
| **Service Offering** | ✅ نعم | API عروض الخدمة (useGetServiceOfferings، useGetServiceOfferingById، إلخ) |
| **تحديد من يمكنه الدخول (القوائم والمسارات)** | ✅ نعم | `GET /api/auth/me` (نوع المنظمة + الصلاحيات) |

### 3.2 غير مربوط بالباك اند (بيانات ثابتة / Mock)

| الشاشة / الوظيفة | مربوط بالباك؟ | الملاحظة |
|------------------|----------------|----------|
| **Job Orders (قائمة)** | ❌ لا | البيانات من **MOCK_JOB_ORDERS** داخل `src/pages/JobOrders/JobOrders.tsx` — لا يوجد استدعاء API. |
| **Job Order (تفاصيل)** | ❌ لا | البيانات من **MOCK_JOB_ORDERS** داخل `src/pages/JobOrders/JobOrderDetails.tsx` — إذا الـ id غير موجود في المصفوفة يُعرض أول عنصر. |
| **Inspections (قائمة + إنشاء)** | ❌ لا | البيانات من **MOCK_INSPECTIONS**, **MOCK_INSPECTORS**, **MOCK_TARGETS** داخل `src/pages/Inspections/Inspections.tsx` — زر إنشاء تفتيش يعطي toast فقط ولا يحفظ في الباك. |

---

## 4) ملخص سريع: Authority Front-end وربطه بالباك

| الشاشة | في الفرونت؟ | مربوط بالباك؟ | الـ API (إن وُجد) |
|--------|-------------|----------------|-------------------|
| Organizations (قائمة + تفاصيل) | ✅ | ✅ | GET organizations، GET organizations/:id، GET documents، GET approval-history، POST organizations/:id/approve |
| Fuel Stations (قائمة + تفاصيل) | ✅ | ✅ | GET organizations/fuel-stations، ثم نفس endpoints المنظمة للتفاصيل والموافقة/الرفض |
| Registrations (قائمة + تفاصيل) | ✅ | ✅ | القائمة: organizations؛ التفاصيل: GET/POST registrations/:id (approve/reject) |
| Onboarding | ✅ | ✅ | خدمات onboarding في الـ API |
| Audit Log | ✅ | ✅ | GET audit?page=&limit= |
| Branch Requests (قائمة + تفاصيل) | ✅ | ✅ | GET branch-requests، GET branch-requests/:id، POST approve/reject |
| Job Orders (قائمة + تفاصيل) | ✅ | ❌ | **Mock فقط** — لا API |
| Inspections (قائمة + إنشاء) | ✅ | ❌ | **Mock فقط** — لا API |
| Quotations | ✅ | ✅ | API الـ quotations |
| Service Categories / Service Offering | ✅ | ✅ | API فئات الخدمة وعروض الخدمة |
| Auth / صلاحيات العرض | ✅ | ✅ | GET auth/me |

---

## 5) خلاصة

- **اللي في الـ Authority front-end فقط:** كل الشاشات والمسارات المذكورة في الجدول في القسم 2 (من Organizations حتى Service Offering)، مع التحكم في الوصول حسب الصلاحيات ونوع المنظمة.
- **اللي مربوط بالباك والفرونت:** Organizations، Fuel Stations، Registrations، Onboarding، Audit Log، Branch Requests (تفاصيل وموافقة/رفض)، Quotations، Service Categories، Service Offering، وـ auth/me للصلاحيات.
- **اللي غير مربوط (Mock):** Job Orders (قائمة + تفاصيل)، Inspections (قائمة + إنشاء).

إذا حابب نضيف جدول endpoints الباك اند فقط (بدون وصف الفرونت)، أو نحدّث المستند عند تغيير الـ API، نقدر نكمّل بناءً على ذلك.
