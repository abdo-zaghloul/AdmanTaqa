# TAQA Admin — Acceptance Criteria

معايير القبول لتطبيق **taqa-admin** بنفس أسلوب وثيقة TAQA Acceptance Criteria. كل قسم: Use Cases → Acceptance Criteria → ملخص ما يُنفّذ في taqa-admin.

---

◊ **User Management & Registration**

**Use Cases**
- UC-1: Service Provider registers
- UC-2: Fuel Retail (Fuel Station) registers
- UC-3: Authority user accesses the system (dashboard)

**Acceptance Criteria**
- ✔ Separate registration flows for each user type
- ✔ Login restricted until approval (Service provider registration restricted until documents approved by Authority)
- ✔ Correct dashboard displayed per user

*في taqa-admin:* ProtectedRoute يسمح بـ Authority، Service Provider، Fuel Station. القائمة الجانبية تُفلتر حسب نوع المنظمة وصلاحياتها (accessControl.ts).

---

◊ **Service Provider Registration & Approval Flow**

**Use Cases**
- UC-9: Authority reviews applications
- UC-10: Authority approves/rejects applications

**Acceptance Criteria**
- ✔ Status: Pending / Approved / Rejected
- ✔ Decisions logged with timestamp
- ✔ Notifications sent on status change

*في taqa-admin:* صفحات Organizations، Fuel Stations (وPending/Rejected)، Registrations، Onboarding. تفاصيل منظمة مع أزرار الموافقة/الرفض. عرض Owner وبدون قائمة Users.

---

◊ **Users & Roles in Taqa Dashboard (Authority)**

**Use Cases**
- UC-4: Company Admin creates a user (Authority)
- UC-5: Company Admin assigns a role

**Acceptance Criteria**
- ✔ Predefined roles available
- ✔ Permissions enforced per role
- ✔ UI reflects role permissions

*في taqa-admin:* صفحات Users، User details، Create/Edit user، Roles (قائمة، إنشاء، تعديل، تفاصيل). API: GET/POST/PATCH /api/roles للجهة.

---

◊ **Users & Roles in Service Provider Dashboard**

**Use Cases**
- UC-1: Service Provider adds new users
- UC-2: Assign roles to users (Admin, Operations, Technician)

**Acceptance Criteria**
- ✔ Users can be added successfully
- ✔ Roles are enforced correctly
- ✔ Users see only functionalities allowed by their role

*في taqa-admin:* نفس صفحات Users و Roles لمزود الخدمة مع استخدام GET/POST/PATCH /api/rbac/roles. دعم permissionKeys في استجابة الأدوار.

---

◊ **Taqa Admin Dashboard UI (Authority)**

**Use Cases**
- UC-17: Authority monitors the system
- UC-18: Authority reviews registrations

**Acceptance Criteria**
- ✔ Overview dashboards available
- ✔ No financial data visible
- ✔ Read-only access where applicable

*في taqa-admin:* القائمة تشمل Organizations، Fuel Stations، Registrations، Onboarding، Job Orders، Service Categories، Quotations (كـ "Service offers")، Audit Log، Profile، Locations.

---

◊ **Fuel Station Access**

**Use Cases**
- UC-6: Fuel Station submits a Request Order
- UC-7: Fuel Station views available services

**Acceptance Criteria**
- ✔ Organization may contain multiple branches
- ✔ Each branch may contain multiple users
- ✔ Fuel Station can view only approved services
- ✔ Request status visible (Pending → Quotation → Creation)

*في taqa-admin:* الدخول مسموح لـ Fuel Station. إخفاء من السايدبار: Branches, Branch Requests, Locations, Internal Work Orders, External Requests, Station Job Orders, Linked Providers, Quotations (FUEL_STATION_HIDDEN_PATHS).

---

◊ **Pending → Quotation → Payment → Creation**

**Use Cases**
- UC-8: Service Provider receives requests
- UC-9: Prepare & send quotations (technical and financial)
- UC-10: Fuel station approves requests and sends payment proposal; payment confirmed → Job Order

**Acceptance Criteria**
- ✔ Requests start as Pending
- ✔ Technical and financial Quotations can be sent by Service Provider
- ✔ Fuel station can approve quotations and send payment agreement
- ✔ Fuel Station can upload receipt image when payment is made
- ✔ Service Provider confirms receipt
- ✔ Approved payment triggers Job Order

*في taqa-admin:* RFQs مع فلتر status. تفاصيل RFQ: إنشاء/تعديل عرض، تأكيد/رفض استلام الدفع، عرض receiptFileUrl (إيصال الدفع)، زر Job Order بعد التأكيد يوجّه إلى provider-job-orders/:id (ExternalJobOrder.id).

---

◊ **Service Provider — Job Order**

**Use Cases**
- UC-2: Service Provider assigns Operations team to Job Order
- UC-11/12: Mark Job Order as Completed; Operations Manager reviews

**Acceptance Criteria**
- ✔ Team assigned; schedule set; Job Order status updated
- ✔ Job Order status can be updated to Completed by authorized users
- ✔ Timestamp logged

*في taqa-admin:* صفحة Provider Job Order Detail: Assign operator، Visits، Operators، Maintenance Reports، Execution attachments. زر واحد "Update status" → "Completed" يحدّث الحالة إلى COMPLETED.

---

◊ **Service Categories & Service Management**

**Use Cases**
- UC-11: Super admin creates a list of Services
- UC-12: Service Provider chooses from the jobs and edits
- UC-3/4/5: Service Provider adds/edits services; Technical Form per service

**Acceptance Criteria**
- ✔ Each service has its own technical form
- ✔ New services require approval before activation
- ✔ Services can be edited successfully

*في taqa-admin:* صفحة Service Categories (للـ Authority و Service Provider). ترتيب القائمة من الأحدث للأقدم (createdAt). إدارة الفئات والموافقة/الرفض حسب الصلاحيات.

---

◊ **Profile & Organization Data**

**Use Cases**
- User views organization profile and documents

**Acceptance Criteria**
- ✔ Organization data from /organizations/me/full
- ✔ Owner (fullName, email, phone) displayed when available
- ✔ Organization Documents and Service Provider Documents listed with View link

*في taqa-admin:* صفحة Profile (UnifiedProfileCard): بيانات المنظمة، Owner، OrganizationDocuments، ServiceProviderDocuments. لا عرض لـ Service Provider Profile card ولا لـ Upload مستندات.

---

◊ **Quotations / Service offers**

**Use Cases**
- Authority reviews service offers (no financial data)
- Service Provider / Fuel Station view financial offers

**Acceptance Criteria**
- ✔ Authority sees "Service offers" (read-only where applicable)
- ✔ Permissions enforced (quotations:read, quotations:submit)

*في taqa-admin:* صفحة Quotations. للـ Authority: عنوان "Service offers" ووصف "Review and manage service offers...". لغير Authority: "financial offers". نفس المسار والصفحة، الاسم يختلف حسب نوع المنظمة.

---

◊ **Authority View of Timeline & Reports**

**Use Cases**
- UC-3: TAQA Admin / Authority views Job Order timeline and progress
- UC-4: Authority reviews attached reports and documents

**Acceptance Criteria**
- ✔ Authority dashboard provides read-only access
- ✔ Timeline shows status updates; reports and attachments visible
- ✔ No financial or pricing information displayed
- ✔ Authority manages master list of services and technical forms
- ✔ Full historical audit logs accessible

*في taqa-admin:* Job Orders للجهة (قراءة)، Audit Log، تفاصيل المنظمات بدون Users. إدارة Service Categories.

---

◊ **Compliance & Regulatory Audit**

**Use Cases**
- UC-16: Record regulatory audit trail for operational activities

**Acceptance Criteria**
- ✔ Key operational actions recorded in non-editable audit trail
- ✔ Each record includes: Acting user, Timestamp, Action details

*في taqa-admin:* صفحة Audit Log للجهة (صلاحية audit:read). تفاصيل السجل حسب ما يوفّره الـ backend.

---

◊ **Roles API by Organization Type**

**Acceptance Criteria**
- ✔ Authority uses /api/roles (list, get by id, create, update)
- ✔ Service Provider and Fuel Station use /api/rbac/roles (list, get by id, create, update)
- ✔ Response with permissionKeys (array of strings) supported in UI

*في taqa-admin:* useGetRoles، useGetRoleById، useCreateRole، useUpdateRole تختار الـ endpoint حسب organization.type. تطبيع permissionKeys في utils (normalizeRole).

---

*آخر تحديث وفق سلوك taqa-admin وملف accessControl.ts وواجهات الـ API.*
