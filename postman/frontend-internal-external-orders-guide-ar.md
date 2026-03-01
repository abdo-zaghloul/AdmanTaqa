# دليل Frontend: الطلبات الداخلية والخارجية ومزود الخدمة وحالات الفشل

هذا الملف يوضح لفريق الـ Frontend:

- كيف يعمل إنشاء طلب صيانة (داخلي vs خارجي) من واجهة المحطة
- كيف تعرض وتتعامل مع الطلبات الداخلية (Internal Work Orders)
- كيف تعرض الطلبات الخارجية ومسار الدفع وتأكيد الاستلام
- كيف تعمل واجهة **مزود الخدمة** (قائمة RFQ، عروض، أوامر عمل، تأكيد استلام الدفع)
- كيف تتعامل مع **حالات الفشل** في الواجهة (رفض دفع، إلغاء، عرض مرفوض)

---

## 1) محطة الوقود: إنشاء طلب صيانة (Internal أو External)

### الـ API

- **Endpoint:** `POST /api/station/maintenance-requests`
- **صلاحية:** `station.maintenance_requests.create` (أو المفتاح المعتمد في المشروع)
- **نوع المنظمة:** Fuel Station فقط

### Body (مهم للفرونت)

```json
{
  "branchId": 1,
  "assetId": null,
  "title": "عنوان الطلب",
  "description": "وصف اختياري",
  "priority": "MEDIUM",
  "maintenanceMode": "INTERNAL",
  "attachments": [],
  "firstTask": { "assignedUserId": null, "notes": "ملاحظة أول مهمة" },
  "providerOrganizationIds": []
}
```

- **للطلب الداخلي (Internal):** ضع `maintenanceMode: "INTERNAL"`. يمكن إرسال `firstTask` لإنشاء أول مهمة داخلية (اختياري).
- **للطلب الخارجي (External):** ضع `maintenanceMode: "EXTERNAL"`. إذا أردت إرسال RFQ فورًا لمزودين، أرسل قائمة IDs في `providerOrganizationIds` (يجب أن يكونوا مزودين مرتبطين بالمحطة وحالة الربط ACTIVE).

### كيف يشتغل عندكم (Frontend المحطة)

1. في شاشة "إنشاء طلب صيانة":
   - خيار **تنفيذ داخلي** → `maintenanceMode: "INTERNAL"`.
   - خيار **تنفيذ عبر مزود خدمة** → `maintenanceMode: "EXTERNAL"`.
2. إذا المستخدم اختار External ويريد إرسال طلب عرض فورًا:
   - اعرض قائمة المزودين المرتبطين (من `GET /api/station/linked-providers` أو المتاحين من `GET /api/station/linked-providers/available`).
   - المستخدم يختار مزودين → أضف `providerOrganizationIds` في الـ body.
3. بعد النجاح:
   - **Internal:** استخدم `data.internalWorkOrder` (واختياريًا `data.firstTask`) وأعد التوجيه لصفحة أوامر العمل الداخلية أو تفاصيل الطلب.
   - **External:** استخدم `data.externalRequest`؛ إذا كان الطلب أُرسل لمزودين ستجد `status` مثل `QUOTING_OPEN` ويمكن التوجيه لصفحة الطلبات الخارجية.

---

## 2) محطة الوقود: الطلبات الداخلية (Internal Work Orders)

- أوامر العمل الداخلية **للمحطة فقط**؛ مزود الخدمة لا يراها.

### الـ APIs (كلها تحت `/api/internal/work-orders`)

| الإجراء           | Method | Endpoint                              | ملاحظة                    |
| ----------------- | ------ | ------------------------------------- | ------------------------- |
| إنشاء أمر داخلي  | POST   | `/api/internal/work-orders`           | أو استخدم إنشاء طلب واحد أعلاه |
| قائمة أوامر      | GET    | `/api/internal/work-orders`           | مع query: status, page, limit |
| قائمة للمراجعة   | GET    | `/api/internal/work-orders/review-queue` | لأوامر تحت المراجعة      |
| تفاصيل أمر       | GET    | `/api/internal/work-orders/:id`       |                           |
| تحديث أمر        | PATCH  | `/api/internal/work-orders/:id`       |                           |
| مراجعة (موافقة/رفض) | PATCH  | `/api/internal/work-orders/:id/review` | body: `{ "decision": "APPROVE" \| "REJECT" }` |
| إغلاق أمر        | PATCH  | `/api/internal/work-orders/:id/close`  |                           |

### كيف يشتغل عندكم

- اعرض قائمة أوامر العمل الداخلية من `GET /api/internal/work-orders` مع فلتر حسب `status` إن وجد.
- للأوامر التي تحتاج موافقة: استخدم `review-queue` ثم من التفاصيل استدعِ `PATCH .../review` بقرار APPROVE أو REJECT.
- لا تعرض هذه الشاشات لمستخدم من نوع **مزود خدمة**؛ الـ Backend يمنعهم من هذه المسارات.

---

## 3) محطة الوقود: الطلبات الخارجية والدفع (External)

### قائمة الطلبات الخارجية

- **Endpoint:** `GET /api/station/requests` (قائمة موحدة لطلبات خارجية + توافق مع الطلبات القديمة إن وجدت).
- **تفاصيل طلب:** `GET /api/station/requests/:id`.

### إرسال طلب لمزودين (RFQ)

- **Endpoint:** `POST /api/station/requests/:id/send-to-providers`
- يمكن إرسال `providerOrganizationIds` و/أو معايير (مثل governorateId, serviceCategoryId) حسب الـ schema.

### اختيار عرض ومتابعة الدفع

- **اختيار عرض:** `POST /api/station/requests/:id/select-quote` مع `providerQuoteId`.
- بعد اختيار العرض يُنشأ **أمر عمل خارجي (External Job Order)** وسجل دفع (PaymentRecord). المحطة تحتاج أن:
  1. **تؤكد إرسال الدفع:** `POST /api/station/job-orders/:id/confirm-sent`
     - Body (اختياري): `referenceNumber`, `receiptFileUrl`, `amount`, `method`.
  2. بعد ذلك **مزود الخدمة** يؤكد استلام الدفع من جانبه (انظر قسم المزود أدناه). عند تأكيد الطرفين تصبح حالة أمر العمل **ACTIVE** ويبدأ التنفيذ.

### كيف يشتغل عندكم (الدفع وحالة "فشل" الدفع)

- في تفاصيل أمر العمل الخارجي (Job Order) اعرض حالة الدفع إن وُجدت (مثلاً من تفاصيل الطلب أو من endpoint خاص بالدفع إن أضيف).
- إذا كانت الحالة أن **المحطة لم تؤكد بعد:** اعرض زر "تأكيد إرسال الدفع" واستدعِ `confirm-sent` (وإن أمكن رفع إيصال عبر `POST /api/station/job-orders/:id/upload-receipt` ثم إرسال `receiptFileUrl` في confirm-sent).
- إذا **المزود رفض استلام الدفع** (انظر قسم حالات الفشل): ستجد أن سجل الدفع بحالة **REJECTED** وأمر العمل يبقى **AWAITING_PAYMENT**. اعرض رسالة مناسبة للمستخدم (مثل: "تم رفض استلام الدفع من المزود" وسبب الرفض إن وُجد).

---

## 4) مزود الخدمة: كيف يشتغل عنده (Frontend المزود)

مزود الخدمة **لا يرى** الطلبات الداخلية (Internal Work Orders). يرى فقط المسار الخارجي: RFQ → عروض → أوامر عمل → دفع.

### 4.1 صندوق طلبات العرض (RFQ)

- **قائمة RFQs:** `GET /api/provider/rfqs` (مع query: status, page, limit إن دعمها الـ Backend).
- **تفاصيل RFQ:** `GET /api/provider/rfqs/:id`.

اعرض للمزود قائمة الطلبات المرسلة له ليرسل عليها عروض أسعار.

### 4.2 عروض الأسعار

- **إنشاء عرض:** `POST /api/provider/rfqs/:id/quotes` (body: pricingJson, submit، إلخ حسب الـ schema).
- **تعديل/مراجعة عرض:** `PATCH /api/provider/quotes/:id`.
- **سحب عرض:** `POST /api/provider/quotes/:id/withdraw`.

عند سحب أو رفض العرض، الطلب قد يستمر مع مزود آخر؛ اعرض ذلك في الواجهة (مثلاً: "تم سحب العرض" أو "العرض مرفوض").

### 4.3 أوامر العمل (Job Orders)

بعد أن تختار المحطة عرض المزود، يُنشأ له أمر عمل خارجي.

- **قائمة أوامر العمل:** `GET /api/provider/job-orders` (query: status, page, limit).
- **تفاصيل أمر:** `GET /api/provider/job-orders/:id`.

حالات أمر العمل (status) من الـ Backend تشمل مثلاً: `CREATED`, `AWAITING_PAYMENT`, `ACTIVE`, `IN_PROGRESS`, `WAITING_PARTS`, `UNDER_REVIEW`, `COMPLETED`, `CLOSED`, `CANCELLED`, `SUSPENDED`.

### 4.4 تأكيد استلام الدفع (وضع "الفشل" عند الرفض)

- **Endpoint:** `POST /api/provider/job-orders/:id/confirm-received`
- **Body:**
  - **قبول استلام الدفع:** `{ "confirm": true, "note": "اختياري" }`
  - **رفض استلام الدفع:** `{ "confirm": false, "rejectionReason": "سبب الرفض (إجباري)" }`

**كيف يشتغل عنده:**

- عندما تكون حالة أمر العمل **AWAITING_PAYMENT** وكانت المحطة قد أكدت الإرسال (STATION_CONFIRMED_SENT)، اعرض للمزود خيارين:
  - "تأكيد استلام الدفع" → استدعاء بـ `confirm: true`.
  - "رفض استلام الدفع" → استدعاء بـ `confirm: false` + حقل إجباري `rejectionReason`.
- عند **القبول:** أمر العمل ينتقل إلى **ACTIVE** ويمكنه تعيين عامل وتحديث الحالة والزيارات والمرفقات.
- عند **الرفض:** سجل الدفع يصبح **REJECTED** وأمر العمل يبقى **AWAITING_PAYMENT** (لا يُفعّل). اعرض رسالة واضحة أن الدفع مرفوض وربما عرض سبب الرفض للمحطة لاحقًا.

### 4.5 بعد التفعيل (ACTIVE وما بعد)

- **تعيين عامل:** `POST /api/provider/job-orders/:id/assign-operator` مع `operatorId`.
- **تحديث حالة أمر العمل:** `PATCH /api/provider/job-orders/:id/status` مع `status` واختياريًا `cancellationReason` عند الإلغاء.
- **تسجيل زيارة (check-in):** `POST /api/provider/job-orders/:id/visits/checkin` (مع arrivalVerificationType: GPS | QR | MANUAL، إلخ).
- **رفع مرفق:** `POST /api/provider/job-orders/:id/attachments` مع `fileUrl` واختياريًا `description`.

اعرض الأزرار/الشاشات حسب الحالة المسموح بها من الـ Backend (مثلاً التعيين والزيارات عندما status من ACTIVE, IN_PROGRESS, WAITING_PARTS).

---

## 5) حالات الفشل في الواجهة (كيف تعرضها وتتعامل معها)

في النظام **لا يوجد status اسمه "FAILED"**. الفشل يظهر عبر الحالات التالية:

### 5.1 رفض استلام الدفع (Payment Rejected)

- **من يفعلها:** مزود الخدمة (confirm-received مع `confirm: false`).
- **النتيجة:** PaymentRecord.status = **REJECTED**، ExternalJobOrder يبقى **AWAITING_PAYMENT**.
- **عندكم (Frontend):**
  - **للمحطة:** في تفاصيل الطلب/أمر العمل اعرض أن "المزود رفض استلام الدفع" وربما سبب الرفض إن رجع من الـ API. لا تعرض الزر كأن الدفع ناجي؛ يمكن إظهار خيار "إعادة المحاولة" أو التواصل مع المزود حسب المنتج.
  - **للمزود:** بعد الرفض اعرض أن الدفع "مرفوض" وسبب الرفض إن حفظ.

### 5.2 إلغاء الطلب أو أمر العمل (Cancelled)

- **ExternalRequest** أو **ExternalJobOrder** يمكن أن ينتقلان إلى **CANCELLED** حسب الـ state machine.
- **عندكم:** اعرض الحالة **CANCELLED** بوضوح (مثلاً شريط أو لون مختلف). إن وُجد `cancellationReason` من الـ API اعرضه. لا تسمحوا بأفعال تنفيذية على الطلبات/أوامر الملغاة.

### 5.3 عرض مرفوض أو منسحب (Quote Rejected / Withdrawn)

- **ProviderQuote** قد يكون **REJECTED** أو **WITHDRAWN**.
- **عندكم (المزود):** اعرض أن العرض "مرفوض" أو "منسحب"؛ الطلب الأصلي قد يستمر مع مزود آخر فلا تعرضوه كفشل كامل للطلب إنما فشل لهذا العرض فقط.
- **عندكم (المحطة):** إن رُفض أو سُحب عرض معين، أبقوا إمكانية اختيار عرض آخر من نفس الطلب إن كان الـ API يدعم ذلك.

---

## 6) ملخص سريع للفرونت

| الطرف        | Internal Orders                    | External Orders                                                                 | حالات الفشل المعروضة                         |
| ------------- | ---------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------- |
| **محطة وقود** | إنشاء عبر maintenance-requests أو مباشرة internal work-orders؛ قائمة وتفاصيل من `/api/internal/work-orders` | إنشاء من maintenance-requests، قائمة من `/api/station/requests`، دفع عبر confirm-sent | REJECTED للدفع، CANCELLED، وعرض مرفوض/منسحب |
| **مزود خدمة**| لا يرى ولا يستخدم                  | RFQ من `/api/provider/rfqs`، عروض، أوامر من `/api/provider/job-orders`، تأكيد استلام من confirm-received | رفض استلام الدفع (REJECTED)، CANCELLED، عرض مرفوض/منسحب |

---

## 7) التحقق من الصلاحيات قبل إظهار الأزرار

مشابه لدليل إنشاء المستخدم:

- بعد تسجيل الدخول استدعوا `GET /api/auth/me` وتحققوا من:
  - `organization.type`: Fuel Station vs Service Provider لاختيار المسارات (internal/work-orders للمحطة فقط؛ rfqs و job-orders للمزود).
  - `permissions`: وجود الصلاحيات المناسبة (مثل `station.maintenance_requests.create`, `internal_work_orders.read`, `provider.rfqs.read`, `provider.job_orders.read`, `provider.payments.confirm_received`، إلخ) قبل إظهار إنشاء طلب، قوائم، تأكيد دفع، إلخ.

بهذا يكون الـ Frontend متوافقًا مع منطق Internal/External ومزود الخدمة وحالات الفشل كما في الـ Backend.
