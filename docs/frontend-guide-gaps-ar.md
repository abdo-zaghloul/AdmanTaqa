# الناقص من الفرونت إند مقارنة بدليل internal-external-orders-guide-ar

مقارنة مع [enrgy-BE/docs/frontend-internal-external-orders-guide-ar.md](../../enrgy-BE/docs/frontend-internal-external-orders-guide-ar.md).

---

## 1) إنشاء طلب صيانة (Create Maintenance Request)

| البند في الدليل | الحالة في taqa-admin |
|------------------|----------------------|
| `assetId` في الـ body | **ناقص** — لا يُرسل |
| `attachments: []` في الـ body | **ناقص** — لا يوجد حقل مرفقات |
| `firstTask.assignedUserId` | **ناقص** — أول مهمة تحتوي فقط على `notes` |
| `providerOrganizationIds` عند اختيار External | **متعمّد** — تم إزالته حسب طلب المستخدم (الإرسال للمزودين من صفحة تفاصيل الطلب فقط) |

---

## 2) الطلبات الداخلية (Internal Work Orders)

| البند | الحالة |
|-------|--------|
| قائمة، review-queue، تفاصيل، PATCH، review، close | **موجود** — مكتمل في internalWorkOrderService و الصفحات |

---

## 3) الطلبات الخارجية والدفع (Station)

### 3.1 رفع إيصال وتأكيد الإرسال من صفحة أمر العمل

- **الدليل:** المحطة تقدر تعمل رفع إيصال + تأكيد إرسال من **مكانين**: تفاصيل الطلب `station-requests/29` **أو** صفحة أمر العمل `station-job-orders/6`.
- **الحالة:** من **تفاصيل الطلب** (StationRequestDetail) موجود (Upload receipt + Confirm payment sent). من **صفحة أمر العمل** (StationJobOrderDetail) **ناقص** — لا يوجد قسم دفع (رفع إيصال / تأكيد إرسال) عندما تكون الحالة `AWAITING_PAYMENT`.

**مطلوب:** إضافة قسم "الدفع" في [StationJobOrderDetail.tsx](src/pages/Station/StationJobOrderDetail.tsx) عندما `order.status === "AWAITING_PAYMENT"`: رفع إيصال + زر تأكيد إرسال المبلغ (واستدعاء نفس الـ APIs المستخدمة في StationRequestDetail).

### 3.2 حقول اختيارية في confirm-sent

- **الدليل:** Body اختياري: `referenceNumber`, `receiptFileUrl`, `amount`, `method` (قيم method: `BANK_TRANSFER` | `CASH` | `OTHER`).
- **الحالة:** الـ type [ConfirmSentBody](src/types/station.ts) يحتوي على الحقول، لكن الواجهة في StationRequestDetail ترسل فقط `receiptFileUrl` (إن وُجد). لا توجد حقول إدخال لـ **رقم التحويل**، **المبلغ**، **طريقة الدفع**.

**مطلوب (اختياري):** إضافة حقول اختيارية في واجهة تأكيد الإرسال: رقم التحويل (referenceNumber)، المبلغ (amount)، طريقة الدفع (method: قائمة BANK_TRANSFER / CASH / OTHER) وتمريرها في body الـ confirm-sent.

### 3.3 عرض حالة "المزود رفض استلام الدفع"

- **الدليل:** اعرض رسالة مناسبة (مثل "تم رفض استلام الدفع من المزود" وسبب الرفض).
- **الحالة:** **موجود** في StationRequestDetail (paymentRejected، rejectionReason). يُفضّل التأكد أن نفس الحالة تظهر في StationJobOrderDetail عندما يكون الأمر AWAITING_PAYMENT والدفع مرفوض.

---

## 4) مزود الخدمة (Provider)

### 4.1 تسجيل الزيارة (Check-in)

- **الدليل:** `POST /api/provider/job-orders/:id/visits/checkin` مع `arrivalVerificationType`: GPS | QR | MANUAL.
- **الحالة:** استدعاء check-in موجود، لكن **لا يوجد** إرسال أو اختيار لـ `arrivalVerificationType` في الواجهة.

**مطلوب (حسب الـ Backend):** إذا كان الـ API يتوقع `arrivalVerificationType`، إضافته في body طلب الـ check-in (قائمة أو قيمة افتراضية مثل MANUAL).

### 4.2 إنشاء عرض سعر (Quote)

- **الدليل:** body قد يشمل `pricingJson`, `submit`، إلخ حسب الـ schema.
- **الحالة:** التطبيق يرسل `amount` و `validUntil`. إذا كان الـ Backend يدعم حقول إضافية (pricingJson، submit)، يمكن إضافتها لاحقاً حسب الـ API الفعلي.

---

## 5) حالات الفشل

| البند | الحالة |
|-------|--------|
| رفض استلام الدفع (REJECTED + سبب) | **موجود** للمحطة في تفاصيل الطلب وللمزود في تفاصيل أمر العمل |
| إلغاء (CANCELLED + cancellationReason) | **يُفضّل** التأكد من عرض CANCELLED و cancellationReason في قوائم وتفاصيل الطلبات/أوامر العمل إن كان الـ API يرجعها |
| عرض مرفوض/منسحب | **موجود** — العروض تعرض حالتها (REJECTED, WITHDRAWN) |

---

## 6) الصلاحيات

- **الدليل:** التحقق من `GET /api/auth/me` و `organization.type` و `permissions` قبل إظهار الأزرار/المسارات.
- **الحالة:** **موجود** — AuthContext يستدعي auth/me ويخزن organization.type و permissions؛ RouteAccessGuard و Sidebar يستخدمانها للوصول. (صلاحيات تفصيلية مثل `station.maintenance_requests.create` تعتمد على تكوين accessControl و anyPermissions/allPermissions.)

---

## ملخص أولويات التنفيذ

1. **أعلى:** إضافة قسم الدفع (رفع إيصال + تأكيد إرسال) في **صفحة أمر العمل للمحطة** (StationJobOrderDetail) عندما الحالة AWAITING_PAYMENT.
2. **متوسط:** إضافة حقول اختيارية لتأكيد الإرسال (referenceNumber، amount، method) في واجهة المحطة.
3. **حسب الـ API:** إضافة `arrivalVerificationType` لطلب check-in للمزود إذا كان مطلوباً من الـ Backend.
4. **تحسين:** عرض CANCELLED و cancellationReason بشكل واضح في القوائم والتفاصيل إن وُجدت في الـ response.
