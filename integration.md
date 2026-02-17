# Ministry of Energy Backend – API Integration Guide

# دليل تكامل واجهة برمجة التطبيقات – نظام وزارة الطاقة

**Base URL / الرابط الأساسي:** `http://localhost:3000/api`  
**Authentication / المصادقة:** `Authorization: Bearer <accessToken>` (except where noted / ما لم يُذكر خلاف ذلك)

**Postman collection / مجموعة Postman:** Import the file `postman/enrgy_BE_API.postman_collection.json`. Collection variables: `baseUrl` = `http://localhost:3000`, `accessToken`, `refreshToken`. **The access token is stored automatically:** run **Auth → Login** (or **Register Organization**, or **Refresh Token**); the Test scripts save `accessToken` and `refreshToken` from the response into the collection variables. All other requests then use `Authorization: Bearer {{accessToken}}` by default. No need to copy the token manually.  
**مجموعة Postman:** استورد الملف `postman/enrgy_BE_API.postman_collection.json`. متغيرات المجموعة: `baseUrl` = `http://localhost:3000`، `accessToken`، `refreshToken`. **يتم تخزين رمز الوصول تلقائياً:** نفّذ **Auth → Login** (أو **Register Organization** أو **Refresh Token**)؛ تقوم سكربتات الاختبار بحفظ `accessToken` و`refreshToken` من الاستجابة في متغيرات المجموعة. بقية الطلبات تستخدم افتراضياً `Authorization: Bearer {{accessToken}}` دون نسخ الرمز يدوياً.

---

## 1. Health Check / فحص الصحة

| Method | Path          | Auth | Description (EN)                                                         | الوصف (AR)                                                           |
| ------ | ------------- | ---- | ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| GET    | `/api/health` | No   | Check if the API is running. Returns `{ success: true, message: "OK" }`. | التحقق من أن الواجهة تعمل. يُرجع `{ success: true, message: "OK" }`. |

---

## 2. Auth / المصادقة

| Method | Path                 | Auth | Description (EN)                                                                                                                                                                                        | الوصف (AR)                                                                                                                                                          |
| ------ | -------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/auth/register` | No   | Register a new organization (SERVICE_PROVIDER or FUEL_STATION) with the first user. Organization starts as PENDING until the Authority approves. Returns user, organization, accessToken, refreshToken. | تسجيل منظمة جديدة (مزود خدمة أو محطة وقود) مع المستخدم الأول. تبقى المنظمة قيد المراجعة حتى موافقة الجهة المشرفة. يُرجع المستخدم والمنظمة ورمز الوصول ورمز التحديث. |
| POST   | `/api/auth/login`    | No   | Login with email and password. Returns user, organization, accessToken, refreshToken.                                                                                                                   | تسجيل الدخول بالبريد الإلكتروني وكلمة المرور. يُرجع المستخدم والمنظمة ورمز الوصول ورمز التحديث.                                                                     |
| POST   | `/api/auth/refresh`  | No   | Exchange a valid refresh token for a new access token and refresh token.                                                                                                                                | استبدال رمز التحديث الصالح برمز وصول ورمز تحديث جديدين.                                                                                                             |

### Request bodies / هيئات الطلبات

**POST /api/auth/register**

- **EN:** `organizationName` (string), `organizationType` ("SERVICE_PROVIDER" \| "FUEL_STATION"), `email`, `password` (min 8), `fullName`, `phone` (optional).
- **AR:** `organizationName` (النوع: نص)، `organizationType` ("SERVICE_PROVIDER" أو "FUEL_STATION")، `email`، `password` (8 أحرف على الأقل)، `fullName`، `phone` (اختياري).

**POST /api/auth/login**

- **EN:** `email`, `password`.
- **AR:** `email`، `password`.

**POST /api/auth/refresh**

- **EN:** `refreshToken` (string).
- **AR:** `refreshToken` (نص).

---

## 3. Organizations / المنظمات

| Method | Path                                      | Auth            | Description (EN)                                                                                                                                           | الوصف (AR)                                                                                                                                                      |
| ------ | ----------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/organizations/me`                   | Yes             | Get the current user's organization (profile).                                                                                                             | الحصول على منظمة المستخدم الحالي (الملف التعريفي).                                                                                                              |
| PATCH  | `/api/organizations/me`                   | Yes             | Update own organization name (SP/FS only; Authority managed separately).                                                                                   | تحديث اسم المنظمة الخاصة (لمزودي الخدمة ومحطات الوقود فقط).                                                                                                     |
| GET    | `/api/organizations`                      | Yes (Authority) | List all organizations with optional filters: `status`, `type`, `page`, `limit`. Requires Authority and permission `organizations:read`.                   | عرض قائمة المنظمات مع فلترة اختيارية: `status`, `type`, `page`, `limit`. يتطلب صلاحية الجهة المشرفة و`organizations:read`.                                      |
| GET    | `/api/organizations/:id`                  | Yes             | Get organization by ID. Own org or Authority can access.                                                                                                   | الحصول على منظمة بالمعرف. المنظمة نفسها أو الجهة المشرفة يمكنها الوصول.                                                                                         |
| POST   | `/api/organizations/:id/approve`          | Yes (Authority) | Approve or reject organization. Body: `decision` ("APPROVED" \| "REJECTED"), `reason` (optional). Requires Authority and `organizations:approve`.          | الموافقة على المنظمة أو رفضها. الهيئة: `decision` ("APPROVED" أو "REJECTED")، `reason` (اختياري). يتطلب الجهة المشرفة و`organizations:approve`.                 |
| GET    | `/api/organizations/:id/documents`        | Yes             | List documents uploaded for the organization. Owner or Authority.                                                                                          | عرض مستندات المنظمة. المالك أو الجهة المشرفة.                                                                                                                   |
| POST   | `/api/organizations/:id/documents`        | Yes             | Upload a document (multipart/form-data: `file`, `documentType`: LICENSE \| REGISTRATION \| OTHER). Owner or Authority. Max 5MB; PDF, JPEG, PNG, GIF, WebP. | رفع مستند (multipart/form-data: `file`, `documentType`: LICENSE أو REGISTRATION أو OTHER). المالك أو الجهة المشرفة. الحد 5 ميجابايت؛ PDF، JPEG، PNG، GIF، WebP. |
| GET    | `/api/organizations/:id/approval-history` | Yes             | List approval/rejection history for the organization.                                                                                                      | عرض سجل الموافقات والرفض للمنظمة.                                                                                                                               |
| GET    | `/api/organizations/:id/service-categories` | Yes           | List service categories linked to this organization (Service Provider). Owner or Authority.                                                                 | عرض فئات الخدمة المرتبطة بهذه المنظمة (مزود الخدمة). المالك أو الجهة المشرفة.                                                                                   |
| POST   | `/api/organizations/:id/service-categories` | Yes           | Link a service category to the organization. Body: `serviceCategoryId`. Service Provider (own org) or Authority.                                           | ربط فئة خدمة بالمنظمة. الهيئة: `serviceCategoryId`. مزود الخدمة (منظمته) أو الجهة المشرفة.                                                                     |
| DELETE | `/api/organizations/:id/service-categories/:categoryId` | Yes  | Remove service category link from the organization.                                                                                                        | إزالة ربط فئة الخدمة من المنظمة.                                                                                                                                  |

---

## 4. Locations / المواقع (Hierarchy: Country → Governorate → City → Area)

| Method | Path                                                | Auth | Description (EN)                                    | الوصف (AR)                                   |
| ------ | --------------------------------------------------- | ---- | --------------------------------------------------- | -------------------------------------------- |
| GET    | `/api/locations/countries`                          | No   | List all countries.                                 | عرض جميع الدول.                              |
| GET    | `/api/locations/countries/:countryId/governorates`  | No   | List governorates for a country.                    | عرض المحافظات لدولة معينة.                   |
| GET    | `/api/locations/countries/:id`                      | No   | Get a single country by ID.                         | الحصول على دولة بالمعرف.                     |
| GET    | `/api/locations/governorates/:governorateId/cities` | No   | List cities for a governorate.                      | عرض المدن لمحافظة معينة.                     |
| GET    | `/api/locations/cities/:cityId/areas`               | No   | List areas for a city.                              | عرض المناطق لمدينة معينة.                    |
| GET    | `/api/locations/areas/:id`                          | No   | Get a single area by ID (e.g. for branch creation). | الحصول على منطقة بالمعرف (مثلاً لإنشاء فرع). |

---

## 5. Users / المستخدمون

List and get routes require authentication and permission `users:read`. Create requires `users:create` and an approved organization.  
مسارات العرض تتطلب مصادقة وصلاحية `users:read`. الإنشاء يتطلب `users:create` ومنظمة معتمدة.

| Method | Path             | Auth | Description (EN)                                                                                           | الوصف (AR)                                                                                            |
| ------ | ---------------- | ---- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| GET    | `/api/users`     | Yes  | List users in the current organization. Authority may pass `?organizationId=` to list another org's users. | عرض مستخدمي المنظمة الحالية. الجهة المشرفة يمكنها استخدام `?organizationId=` لعرض مستخدمي منظمة أخرى. |
| GET    | `/api/users/:id` | Yes  | Get user by ID (same organization or Authority).                                                           | الحصول على مستخدم بالمعرف (نفس المنظمة أو الجهة المشرفة).                                             |
| POST   | `/api/users`     | Yes  | Create a user in the current organization. Requires approved org and `users:create`.                      | إنشاء مستخدم في المنظمة الحالية. يتطلب منظمة معتمدة وصلاحية `users:create`.                          |

### Request bodies / هيئات الطلبات

**POST /api/users**

- **EN:** `email` (string), `password` (min 8 characters), `fullName` (string), `phone` (optional).
- **AR:** `email` (نص)، `password` (8 أحرف على الأقل)، `fullName` (نص)، `phone` (اختياري).

---

## 6. Branches / الفروع

Require authenticated user, approved organization, and `branches:read` (create/update need additional permissions).  
تتطلب مستخدماً مصادقاً، منظمة معتمدة، وصلاحية `branches:read` (إنشاء/تحديث تحتاج صلاحيات إضافية).

| Method | Path                | Auth | Description (EN)                                                                                | الوصف (AR)                                                                           |
| ------ | ------------------- | ---- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| GET    | `/api/branches`     | Yes  | List branches of the current organization. Branch-scoped users see only their allowed branches. | عرض فروع المنظمة الحالية. المستخدمون المقيّدون بفرع يرون الفروع المسموح لهم بها فقط. |
| GET    | `/api/branches/:id` | Yes  | Get branch by ID (same org; branch scope enforced).                                             | الحصول على فرع بالمعرف (نفس المنظمة؛ مع مراعاة نطاق الفرع).                          |
| POST   | `/api/branches`     | Yes  | Create a branch. Body: `areaId`, `name`, `address` (optional). Requires `branches:create`.      | إنشاء فرع. الهيئة: `areaId`, `name`, `address` (اختياري). يتطلب `branches:create`.   |
| PATCH  | `/api/branches/:id` | Yes  | Update branch (name, address, isActive). Requires `branches:update`.                            | تحديث الفرع (الاسم، العنوان، isActive). يتطلب `branches:update`.                     |

---

## 7. Roles / الأدوار

Require authentication and `roles:read` (create/update need additional permissions and approved organization).  
تتطلب مصادقة وصلاحية `roles:read` (الإنشاء/التحديث يتطلبان صلاحيات إضافية ومنظمة معتمدة).

| Method | Path                     | Auth | Description (EN)                                                                     | الوصف (AR)                                                         |
| ------ | ------------------------ | ---- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| GET    | `/api/roles`             | Yes  | List roles for the current organization (or Authority global roles).                  | عرض أدوار المنظمة الحالية (أو الأدوار العامة للجهة المشرفة).       |
| GET    | `/api/roles/permissions` | Yes  | List permissions allowed for the current organization type (for assigning to roles).   | عرض الصلاحيات المسموح بها لنوع المنظمة الحالية (لتعيينها للأدوار). |
| GET    | `/api/roles/:id`         | Yes  | Get role by ID with its permissions. Requires `roles:read`.                          | الحصول على دور بالمعرف مع صلاحياته. يتطلب `roles:read`.            |
| POST   | `/api/roles`             | Yes  | Create a role. Body: `name`, `description` (optional), `permissionIds` (array). Requires approved org and `roles:create`. | إنشاء دور. الهيئة: `name`, `description` (اختياري), `permissionIds` (مصفوفة). يتطلب منظمة معتمدة و`roles:create`. |
| PATCH  | `/api/roles/:id`         | Yes  | Update role (name, description, permissionIds). Requires approved org and `roles:update`. | تحديث الدور (الاسم، الوصف، الصلاحيات). يتطلب منظمة معتمدة و`roles:update`. |

### Request bodies / هيئات الطلبات

**POST /api/roles**

- **EN:** `name` (string), `description` (optional), `permissionIds` (array of permission IDs).
- **AR:** `name` (نص)، `description` (اختياري)، `permissionIds` (مصفوفة معرفات الصلاحيات).

**PATCH /api/roles/:id**

- **EN:** `name` (optional), `description` (optional), `permissionIds` (optional array).
- **AR:** `name` (اختياري)، `description` (اختياري)، `permissionIds` (مصفوفة اختيارية).

---

## 8. Service Requests / طلبات الخدمة

| Method | Path                | Auth | Description (EN)                                                                                                                                                       | الوصف (AR)                                                                                                                                         |
| ------ | ------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/requests`     | Yes  | List service requests. Fuel Station: own requests. Service Provider: requests of linked stations. Authority: all. Optional: `page`, `limit`. Requires `requests:read`. | عرض طلبات الخدمة. محطة الوقود: طلباتها. مزود الخدمة: طلبات المحطات المرتبطة. الجهة المشرفة: الكل. اختياري: `page`, `limit`. يتطلب `requests:read`. |
| GET    | `/api/requests/:id` | Yes  | Get service request by ID. Access by org type (FS/SP/Authority). Requires `requests:read`.                                                                             | الحصول على طلب خدمة بالمعرف. الوصول حسب نوع المنظمة. يتطلب `requests:read`.                                                                        |
| POST   | `/api/requests`     | Yes  | Create a service request (Fuel Station only, approved org). Body: `branchId`, `formData` (optional JSON), `areaId`, `cityId` (optional). Requires `requests:create`.   | إنشاء طلب خدمة (محطة وقود فقط، منظمة معتمدة). الهيئة: `branchId`, `formData` (اختياري)، `areaId`, `cityId` (اختياري). يتطلب `requests:create`.     |

---

## 9. Quotations / عروض الأسعار

Authority sees metadata only (no pricing). SP/FS with `quotation-pricing:read` see pricing.  
الجهة المشرفة ترى البيانات الوصفية فقط (بدون أسعار). مزود الخدمة ومحطة الوقود بصلاحية `quotation-pricing:read` يرون الأسعار.

| Method | Path                  | Auth | Description (EN)                                                                                                                                    | الوصف (AR)                                                                                                                          |
| ------ | --------------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/quotations`     | Yes  | List quotations. SP: own; FS: for own requests; Authority: all (no pricing). Optional: `limit`. Requires `quotations:read`.                         | عرض العروض. مزود الخدمة: عروضه؛ محطة الوقود: لعطلاتها؛ الجهة المشرفة: الكل (بدون أسعار). اختياري: `limit`. يتطلب `quotations:read`. |
| GET    | `/api/quotations/:id` | Yes  | Get quotation by ID. Authority: no pricing. Requires `quotations:read`.                                                                             | الحصول على عرض بالمعرف. الجهة المشرفة: بدون أسعار. يتطلب `quotations:read`.                                                         |
| POST   | `/api/quotations`     | Yes  | Submit a quotation (Service Provider only). Body: `serviceRequestId`, `amount`, `currency` (optional, default "USD"). Requires `quotations:submit`. | تقديم عرض (مزود الخدمة فقط). الهيئة: `serviceRequestId`, `amount`, `currency` (اختياري). يتطلب `quotations:submit`.                 |

---

## 10. Job Orders / أوامر العمل

Authority sees metadata only (no financial data). SP/FS with `job-order-financial:read` see financial data.  
الجهة المشرفة ترى البيانات الوصفية فقط (بدون بيانات مالية). مزود الخدمة ومحطة الوقود بصلاحية `job-order-financial:read` يرون البيانات المالية.

| Method | Path                  | Auth | Description (EN)                                                                                                                                                                 | الوصف (AR)                                                                                                                                              |
| ------ | --------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/job-orders`     | Yes  | List job orders. FS: for own requests; SP: for own quotations; Authority: all (no financial). Optional: `limit`. Requires `job-orders:read`.                                     | عرض أوامر العمل. محطة الوقود: لطلباتها؛ مزود الخدمة: لعروضه؛ الجهة المشرفة: الكل (بدون مالي). اختياري: `limit`. يتطلب `job-orders:read`.                |
| GET    | `/api/job-orders/:id` | Yes  | Get job order by ID. Requires `job-orders:read`.                                                                                                                                 | الحصول على أمر عمل بالمعرف. يتطلب `job-orders:read`.                                                                                                    |
| POST   | `/api/job-orders`     | Yes  | Create job order from an accepted quotation (Service Provider). Body: `quotationId`, `assignedBranchId` (optional), `executionDetails` (optional). Requires `job-orders:update`. | إنشاء أمر عمل من عرض مقبول (مزود الخدمة). الهيئة: `quotationId`, `assignedBranchId` (اختياري), `executionDetails` (اختياري). يتطلب `job-orders:update`. |
| GET    | `/api/job-orders/:id/payment` | Yes  | Get payment record for a job order. FS/SP/Authority with access to the job. Requires `job-orders:read` and `payments:read`. | الحصول على سجل الدفع لأمر العمل. يتطلب `job-orders:read` و`payments:read`. |
| POST   | `/api/job-orders/:id/confirm-payment` | Yes  | Confirm payment for a job order (creates or updates Payment, sets status CONFIRMED). Body: `amount`, `currency` (optional; default from JobOrderFinancial). Requires `payments:confirm`. | تأكيد الدفع لأمر العمل. الهيئة: `amount`, `currency` (اختياري). يتطلب `payments:confirm`. |
| GET    | `/api/job-orders/:id/assignments` | Yes  | List operator assignments for the job order. Service Provider (owner of quotation) only. Requires `job-orders:read`. | عرض تعيينات المشغلين لأمر العمل. مزود الخدمة فقط. يتطلب `job-orders:read`. |
| POST   | `/api/job-orders/:id/assignments` | Yes  | Assign an operator to the job. Body: `operatorId`, `arrivalTime` (optional), `status` (optional). Service Provider. Requires `job-orders:update`. | تعيين مشغل لأمر العمل. الهيئة: `operatorId`, `arrivalTime` (اختياري), `status` (اختياري). يتطلب `job-orders:update`. |
| PATCH  | `/api/job-orders/:id/assignments/:assignmentId` | Yes  | Update assignment (e.g. arrivalTime, status). Service Provider. Requires `job-orders:update`. | تحديث التعيين (مثلاً وقت الوصول، الحالة). يتطلب `job-orders:update`. |
| GET    | `/api/job-orders/:id/visits` | Yes  | List visits for the job order. Service Provider. Requires `job-orders:read`. | عرض زيارات أمر العمل. مزود الخدمة. يتطلب `job-orders:read`. |
| POST   | `/api/job-orders/:id/visits` | Yes  | Create a job visit. Body: `visitDate`, `status`, `notes` (optional). Service Provider. Requires `job-orders:update`. | إنشاء زيارة لأمر العمل. الهيئة: `visitDate`, `status`, `notes` (اختياري). يتطلب `job-orders:update`. |
| PATCH  | `/api/job-orders/:id/visits/:visitId` | Yes  | Update a job visit. Service Provider. Requires `job-orders:update`. | تحديث زيارة أمر العمل. يتطلب `job-orders:update`. |

---

## 11. Service Categories / فئات الخدمة

Authority only. Master list of maintenance service categories; used to link categories to Service Provider organizations.  
للجهة المشرفة فقط. القائمة الرئيسية لفئات خدمات الصيانة؛ تُستخدم لربط الفئات بمنظمات مزودي الخدمة.

| Method | Path                           | Auth            | Description (EN)                                                                 | الوصف (AR)                                                                     |
| ------ | ------------------------------ | --------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| GET    | `/api/service-categories`      | Yes (Authority) | List all service categories. Requires Authority and `service-categories:read`.    | عرض جميع فئات الخدمة. يتطلب الجهة المشرفة و`service-categories:read`.           |
| GET    | `/api/service-categories/:id`  | Yes (Authority) | Get service category by ID.                                                      | الحصول على فئة خدمة بالمعرف.                                                   |
| POST   | `/api/service-categories`      | Yes (Authority) | Create service category. Body: `name`, `code` (optional). Requires `service-categories:manage`. | إنشاء فئة خدمة. الهيئة: `name`, `code` (اختياري). يتطلب `service-categories:manage`. |
| PATCH  | `/api/service-categories/:id`  | Yes (Authority) | Update service category. Body: `name`, `code` (optional). Requires `service-categories:manage`. | تحديث فئة خدمة. يتطلب `service-categories:manage`.                             |

---

## 12. Assets / الأصول

Fuel Station (and branch-scoped). Assets belong to a branch; support warranty records, inspections, internal maintenance, and history.  
محطة الوقود (ومقيّد بفرع). الأصول تتبع فرعاً؛ تدعم سجلات الضمان والتفتيش والصيانة الداخلية والسجل.

| Method | Path                                          | Auth | Description (EN)                                                                 | الوصف (AR)                                                                 |
| ------ | --------------------------------------------- | ---- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| GET    | `/api/assets`                                 | Yes  | List assets. Query: `branchId` (optional). Scoped to current org branches. Requires `assets:read`. | عرض الأصول. استعلام: `branchId` (اختياري). يتطلب `assets:read`.             |
| GET    | `/api/assets/:id`                             | Yes  | Get asset by ID. Requires `assets:read`.                                          | الحصول على أصل بالمعرف. يتطلب `assets:read`.                                |
| POST   | `/api/assets`                                 | Yes  | Create asset. Body: `branchId`, `name`, `maintenanceType` ("INTERNAL" \| "EXTERNAL"), `description` (optional). Requires `assets:create`. | إنشاء أصل. الهيئة: `branchId`, `name`, `maintenanceType`, `description` (اختياري). يتطلب `assets:create`. |
| PATCH  | `/api/assets/:id`                             | Yes  | Update asset. Body: `name`, `maintenanceType`, `description` (optional). Requires `assets:update`. | تحديث أصل. يتطلب `assets:update`.                                          |
| GET    | `/api/assets/:assetId/warranties`              | Yes  | List warranty records for the asset. Requires `warranty:read`.                     | عرض سجلات الضمان للأصل. يتطلب `warranty:read`.                              |
| GET    | `/api/assets/:assetId/warranties/:id`          | Yes  | Get warranty record by ID. Requires `warranty:read`.                              | الحصول على سجل ضمان بالمعرف.                                               |
| POST   | `/api/assets/:assetId/warranties`              | Yes  | Create warranty record. Body: `providerOrganizationId`, `startDate`, `endDate`. Requires `warranty:create`. | إنشاء سجل ضمان. يتطلب `warranty:create`.                                   |
| PATCH  | `/api/assets/:assetId/warranties/:id`          | Yes  | Update warranty record. Body: `startDate`, `endDate` (optional). Requires `warranty:update`. | تحديث سجل ضمان. يتطلب `warranty:update`.                                   |
| GET    | `/api/assets/:assetId/inspections`            | Yes  | List asset inspections. Requires `assets:read`.                                 | عرض تفتيشات الأصل. يتطلب `assets:read`.                                    |
| POST   | `/api/assets/:assetId/inspections`             | Yes  | Create asset inspection. Body: `inspectionDate`, `status` (optional), `notes` (optional). Requires `assets:create`. | إنشاء تفتيش لأصل. يتطلب `assets:create`.                                   |
| GET    | `/api/assets/:assetId/internal-maintenance`   | Yes  | List internal maintenance records for the asset. Requires `assets:read`.         | عرض سجلات الصيانة الداخلية للأصل. يتطلب `assets:read`.                     |
| POST   | `/api/assets/:assetId/internal-maintenance`   | Yes  | Record internal maintenance. Body: `performedAt` (ISO datetime), `notes` (optional). Performed by current user. Requires `assets:create`. | تسجيل صيانة داخلية. الهيئة: `performedAt`, `notes` (اختياري). يتطلب `assets:create`. |
| GET    | `/api/assets/:assetId/history`                 | Yes  | List asset history (read-only audit log for the asset). Requires `assets:read`.  | عرض سجل الأصل (للتدقيق). يتطلب `assets:read`.                              |

---

## 13. Operators / المشغلون

Service Provider only. Operators perform on-site maintenance and are assigned to job orders.  
مزود الخدمة فقط. المشغلون ينفذون الصيانة في الموقع ويُعيَّنون لأوامر العمل.

| Method | Path                  | Auth | Description (EN)                                                                 | الوصف (AR)                                                          |
| ------ | --------------------- | ---- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| GET    | `/api/operators`      | Yes  | List operators for the current organization (Service Provider). Requires `operators:read`. | عرض مشغلي المنظمة الحالية. يتطلب `operators:read`.                   |
| GET    | `/api/operators/:id`  | Yes  | Get operator by ID. Requires `operators:read`.                                    | الحصول على مشغل بالمعرف. يتطلب `operators:read`.                     |
| POST   | `/api/operators`      | Yes  | Create operator. Body: `name`. Requires `operators:create`.                       | إنشاء مشغل. الهيئة: `name`. يتطلب `operators:create`.                 |
| PATCH  | `/api/operators/:id`  | Yes  | Update operator. Body: `name` (optional). Requires `operators:update`.            | تحديث مشغل. يتطلب `operators:update`.                                |

---

## 14. Inspections / التفتيشات

Authority only. للجهة المشرفة فقط.

| Method | Path                   | Auth            | Description (EN)                                                                                                                                                                           | الوصف (AR)                                                                                                                         |
| ------ | ---------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/inspections`     | Yes (Authority) | List inspections (optionally filter by `targetOrganizationId`, `limit`). Requires Authority and `inspections:read`.                                                                        | عرض التفتيشات (اختياري: `targetOrganizationId`, `limit`). يتطلب الجهة المشرفة و`inspections:read`.                                 |
| GET    | `/api/inspections/:id` | Yes (Authority) | Get inspection by ID. Requires Authority.                                                                                                                                                  | الحصول على تفتيش بالمعرف. يتطلب الجهة المشرفة.                                                                                     |
| POST   | `/api/inspections`     | Yes (Authority) | Create inspection. Body: `branchId` (optional), `targetType` (e.g. "FUEL_STATION", "SERVICE_PROVIDER"), `targetOrganizationId`, `findings` (optional JSON). Requires `inspections:create`. | إنشاء تفتيش. الهيئة: `branchId` (اختياري)، `targetType`، `targetOrganizationId`, `findings` (اختياري). يتطلب `inspections:create`. |

---

## 15. Audit Log / سجل التدقيق

Authority only. للجهة المشرفة فقط.

| Method | Path         | Auth            | Description (EN)                                                                                                                          | الوصف (AR)                                                                                                                                  |
| ------ | ------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/audit` | Yes (Authority) | List audit logs. Query: `organizationId`, `branchId`, `resourceType`, `resourceId`, `page`, `limit`. Requires Authority and `audit:read`. | عرض سجل التدقيق. الاستعلام: `organizationId`, `branchId`, `resourceType`, `resourceId`, `page`, `limit`. يتطلب الجهة المشرفة و`audit:read`. |

---

## 16. Permission Org Types / صلاحيات أنواع المنظمات

Authority only. Used to configure which permissions are visible for each organization type (Authority, Service Provider, Fuel Station).  
للجهة المشرفة فقط. تُستخدم لضبط الصلاحيات الظاهرة لكل نوع منظمة.

| Method | Path                          | Auth            | Description (EN)                                                                                                                                 | الوصف (AR)                                                                                                              |
| ------ | ----------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| GET    | `/api/permission-org-types`  | Yes (Authority) | List all permissions and which are enabled per organization type. Requires Authority and `permission-org-types:manage`.                           | عرض جميع الصلاحيات وما هو مفعّل لكل نوع منظمة. يتطلب الجهة المشرفة و`permission-org-types:manage`.                         |
| PUT    | `/api/permission-org-types`  | Yes (Authority) | Set which permissions are visible for an organization type. Body: `organizationType`, `permissionIds` (array). Only SERVICE_PROVIDER and FUEL_STATION. | تعيين الصلاحيات الظاهرة لنوع منظمة. الهيئة: `organizationType`, `permissionIds` (مصفوفة). فقط SERVICE_PROVIDER و FUEL_STATION. |
| PATCH  | `/api/permission-org-types`  | Yes (Authority) | Same as PUT.                                                                                                                                     | نفس PUT.                                                                                                                 |

### Request bodies / هيئات الطلبات

**PUT/PATCH /api/permission-org-types**

- **EN:** `organizationType` ("SERVICE_PROVIDER" \| "FUEL_STATION"), `permissionIds` (array of permission IDs).
- **AR:** `organizationType` ("SERVICE_PROVIDER" أو "FUEL_STATION")، `permissionIds` (مصفوفة معرفات الصلاحيات).

---

## 17. Onboarding / التعريف بالتطبيق

Content for mobile onboarding screens (welcome slides). List and get are public; create/update/delete require authentication.  
محتوى شاشات التعريف بتطبيق الموبايل. العرض والعرض بالمعرف عام؛ الإنشاء والتحديث والحذف يتطلبان مصادقة.

| Method | Path                    | Auth | Description (EN)                                                                                                                                 | الوصف (AR)                                                                                                                              |
| ------ | ----------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/onboarding`       | No   | List active onboarding items (ordered). Authenticated clients may pass `?all=true` to list all items including inactive.                         | عرض عناصر التعريف النشطة (مرتبة). العملاء المصادقون يمكنهم استخدام `?all=true` لعرض الكل بما فيها غير النشطة.                          |
| GET    | `/api/onboarding/:id`    | No   | Get one onboarding item by ID.                                                                                                                  | الحصول على عنصر تعريف بالمعرف.                                                                                                         |
| POST   | `/api/onboarding`       | Yes  | Create onboarding item. Body: `title`, `description`, `content`, `order`, `isActive`, `imageUrl`; or multipart with field `image` for Cloudinary upload. | إنشاء عنصر تعريف. الهيئة: `title`, `description`, `content`, `order`, `isActive`, `imageUrl`؛ أو multipart مع الحقل `image` للرفع إلى Cloudinary. |
| PATCH  | `/api/onboarding/:id`    | Yes  | Update onboarding item. Same body as create; optional multipart `image` upload (replaces previous image on Cloudinary).                           | تحديث عنصر التعريف. نفس هيئة الإنشاء؛ رفع اختياري لصورة `image` (يستبدل الصورة السابقة على Cloudinary).                                 |
| DELETE | `/api/onboarding/:id`   | Yes  | Delete onboarding item.                                                                                                                         | حذف عنصر التعريف.                                                                                                                       |

### Request bodies / هيئات الطلبات

**POST /api/onboarding** (JSON or multipart/form-data)

- **EN:** `title` (required), `description` (optional), `content` (optional), `order` (optional number, default 0), `isActive` (optional boolean, default true), `imageUrl` (optional URL). Or send file on field `image` (JPEG, PNG, GIF, WebP; max 5MB) to upload to Cloudinary.
- **AR:** `title` (مطلوب)، `description` (اختياري)، `content` (اختياري)، `order` (اختياري، افتراضي 0)، `isActive` (اختياري، افتراضي true)، `imageUrl` (اختياري). أو إرسال ملف على الحقل `image` (JPEG, PNG, GIF, WebP؛ حد 5 ميجابايت) للرفع إلى Cloudinary.

**PATCH /api/onboarding/:id**

- **EN:** Same fields as POST, all optional. Or send new `image` file to replace existing.
- **AR:** نفس حقول POST، كلها اختيارية. أو إرسال ملف `image` جديد لاستبدال الحالي.

---

## Response format / تنسيق الاستجابة

- **Success:** `{ success: true, data: <...>, message?: "<...>" }`
- **Error:** `{ success: false, message: "<...>", errorCode: <number>, statusCode: <number>, errors?: <...> }`

---

## Notes / ملاحظات

- **EN:** Use the access token in the header: `Authorization: Bearer <accessToken>`. Approved organizations (except Authority) are required for operational routes (branches, requests, quotations, job orders). Authority never receives quotation pricing or job order financial data.
- **AR:** استخدم رمز الوصول في الهيدر: `Authorization: Bearer <accessToken>`. المنظمات المعتمدة (ما عدا الجهة المشرفة) مطلوبة للمسارات التشغيلية (الفروع، الطلبات، العروض، أوامر العمل). الجهة المشرفة لا تتلقى أسعار العروض ولا البيانات المالية لأوامر العمل.
