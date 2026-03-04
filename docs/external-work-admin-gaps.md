# النواقص في واجهة الـ Admin بالنسبة لتدفق العمل الخارجي

هذا الملف يقارن ما هو موصوف في `شرح-العمل-الخارجي-External-Work.md` و `رسم-تدفق-العمل-الخارجي.md` مع ما هو مُنفَّذ حالياً في **taqa-admin**، ويُحدد **ما الناقص**.

---

## ما هو مُنفَّذ (موجود)

| المرحلة | من | الوظيفة | الحالة في الـ Admin |
|--------|-----|---------|---------------------|
| 1 | المحطة | إنشاء طلب EXTERNAL + اختيار مزودين (`providerOrganizationIds`) | ✅ في `CreateMaintenanceRequest`: maintenanceMode EXTERNAL واختيار مزودين مرتبطين (linked providers). الطلب يُنشأ ويُرسل للمزودين عند الإنشاء. |
| 2 | المزود | رؤية RFQs وإرسال عرض أسعار | ✅ `ProviderRfqs` + `ProviderRfqDetail` مع نموذج Submit quote (تسعير، عرض فني، مدة وضمان). |
| 3 | المحطة | اختيار عرض → إنشاء ExternalJobOrder + PaymentRecord | ✅ في `StationRequestDetail`: Select quote ثم زر Select. |
| 4 أ | المحطة | confirm-sent (رفع إيصال وتأكيد إرسال المبلغ) | ✅ في `StationRequestDetail` و `StationJobOrderDetail`: رفع إيصال وتأكيد الدفع (زر واحد). |
| 4 ب | المزود | confirm-received (قبول/رفض) | ✅ في `ProviderJobOrderDetail`: Payment مع Confirm received / Reject. |
| 5 (جزء) | المزود | تعيين عامل، تحديث الحالة، مرفقات، تقارير، Submit for review | ✅ Assign operator، Update status، Attachments (رفع)، Maintenance reports، Submit completion. |
| 5 (زيارات) | المزود | زيارات + Check-in | ✅ قائمة Visits + زر Check-in visit (مع Modal و notes). يستخدم الـ legacy endpoint `POST .../visits/checkin`. |
| 6 | المحطة | مراجعة وموافقة/إعادة عمل | ✅ في `StationJobOrderDetail`: Approve & close، Request rework (مع سبب). |

---

## ما الناقص

### 1) المحطة — إرسال الطلب للمزودين لاحقاً (Send to providers لطلب موجود)

- **المستند:** إذا أُنشئ الطلب **بدون** اختيار مزودين، يبقى بحالة `SUBMITTED_BY_STATION` ولا يراه أي مزود. يمكن لاحقاً إرساله لمزودين عبر `POST /api/station/requests/:id/send-to-providers` مع `providerOrganizationIds`.
- **الوضع في الـ Admin:** الـ API موجود (`sendStationRequestToProviders`) ويُستدعى فقط من **إنشاء** الطلب في `CreateMaintenanceRequest`. **لا يوجد** في صفحة تفاصيل الطلب (`StationRequestDetail`) أي قسم يسمح بـ "Send to providers" عندما الطلب بحالة `SUBMITTED_BY_STATION`.
- **الناقص:** في `StationRequestDetail`، عندما `request.status === "SUBMITTED_BY_STATION"` (أو ما يعادلها): إظهار قسم "Send to providers" (قائمة المزودين المرتبطين + زر إرسال) واستدعاء `sendStationRequestToProviders` حتى ينتقل الطلب إلى QUOTING_OPEN ويرى المزودون الـ RFQ.

---

### 2) المزود — إنشاء زيارة (Create Visit) — التدفق الجديد Visit-first

- **المستند والـ Backend:** التدفق المطلوب (visit-first): إنشاء **زيارة** أولاً عبر `POST /api/provider/job-orders/:id/visits` (مع نوع الزيارة: EXECUTION، INSPECTION، FOLLOW_UP)، ثم **Check-in** للزيارة عبر `POST /api/provider/visits/:visitId/checkin`، ثم **إكمال الزيارة** عبر `POST /api/provider/visits/:visitId/complete`.
- **الوضع في الـ Admin:** يوجد فقط زر **"Check-in visit"** الذي يستدعي الـ **legacy** endpoint `POST /api/provider/job-orders/:id/visits/checkin` (بدون إنشاء زيارة مسبقة بنوع محدد). لا يوجد زر "Create Visit" ولا اختيار نوع الزيارة (EXECUTION / INSPECTION / FOLLOW_UP).
- **الناقص:**
  - في `ProviderJobOrderDetail`: زر **"+ Create Visit"** يفتح Modal أو نموذج لإنشاء زيارة (نوع: EXECUTION | INSPECTION | FOLLOW_UP) واستدعاء `POST .../job-orders/:id/visits`.
  - عرض قائمة الزيارات مع **visitId** وربط زر Check-in بكل زيارة (استدعاء `POST .../visits/:visitId/checkin`) بدلاً من الـ legacy فقط.

---

### 3) المزود — إكمال الزيارة (Complete Visit)

- **المستند:** بعد Check-in، المزود يُكمل الزيارة (مثلاً عند انتهاء العمل الميداني). الـ API: `POST /api/provider/visits/:visitId/complete` (مع body اختياري مثل `completionNote`).
- **الوضع في الـ Admin:** لا يوجد أي زر أو إجراء "Complete visit" في صفحة أمر العمل أو في تفاصيل زيارة.
- **الناقص:** في `ProviderJobOrderDetail` (أو في تفاصيل زيارة إن وُجدت): لكل زيارة بحالة غير مكتملة، زر **"Complete visit"** مع حقل اختياري لملاحظة الإكمال، واستدعاء `POST .../visits/:visitId/complete`. (الـ Backend يشترط زيارة مكتملة واحدة على الأقل قبل إنشاء تقرير صيانة.)

---

### 4) عرض إيصال التحويل (View bank transfer receipt)

- **المستند/الموبايل:** بعد أن المحطة تؤكد الإرسال، يظهر للمحطة/المزود رابط "View bank transfer receipt".
- **الوضع في الـ Admin:** يعتمد على ما يُرجعه الـ API لأمر العمل/سجل الدفع. إن كان الـ API يرجع `receiptFileUrl` (أو ما شابه) في `paymentRecord` أو في تفاصيل Job Order، فيُفضّل إظهار رابط "View bank transfer receipt" في قسم Payment (المحطة والمزود). إن لم يكن الحقل موجوداً في الـ API أو في الـ types الحالية، يكون النقص من جانب الـ Backend أو من توسيع الـ types وعرض الرابط إن وُجد.

---

## ملخص سريع

| # | الناقص | الصفحة/المكوّن | الإجراء المقترح |
|---|--------|-----------------|------------------|
| 1 | Send to providers لطلب موجود | `StationRequestDetail` | عند SUBMITTED_BY_STATION: قسم لاختيار مزودين مرتبطين + استدعاء send-to-providers. |
| 2 | Create Visit (زيارة جديدة بنوع) | `ProviderJobOrderDetail` | زر "+ Create Visit" + Modal (نوع: EXECUTION / INSPECTION / FOLLOW_UP) + استدعاء POST .../job-orders/:id/visits. ربط Check-in بكل زيارة (visitId). |
| 3 | Complete Visit | `ProviderJobOrderDetail` (أو تفاصيل زيارة) | لكل زيارة غير مكتملة: زر "Complete visit" + استدعاء POST .../visits/:visitId/complete. |
| 4 | View bank transfer receipt | قسم Payment (المحطة/المزود) | التحقق من الـ API والـ types؛ إن وُجد receiptFileUrl، إظهار رابط "View bank transfer receipt". |

---

*مرجع التدفق: `enrgy-BE/docs/شرح-العمل-الخارجي-External-Work.md` و `enrgy-BE/docs/رسم-تدفق-العمل-الخارجي.md`.*
