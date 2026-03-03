# شرح مسار Work Order من محطة الوقود (Fuel Station) إلى مقدم الخدمة (Service Provider)

هذا الملف يوضح بالتفصيل كيف يتم إنشاء "أمر عمل" (Work Order / Job Order) عندما تريد محطة وقود أن تستفيد من صيانة خارجية يقدمها مقدم خدمة (Service Provider)، مع توضيح كل خطوة والـ APIs المستخدمة.

---

## 1. الفرق بين الصيانة الداخلية والخارجية

في النظام يوجد نوعان من طلبات الصيانة:

| النوع | الوصف | النتيجة في النظام |
|------|--------|---------------------|
| **INTERNAL** | صيانة داخلية تنفذها المحطة بنفسها أو موظفوها | يتم إنشاء **Internal Work Order** (أمر عمل داخلي) وربما مهام داخلية (Internal Tasks). لا يشارك فيه مقدم خدمة خارجي. |
| **EXTERNAL** | صيانة خارجية يطلب فيها استدعاء مقدم خدمة (مثل شركة صيانة) | يتم إنشاء **External Request** (طلب خارجي)، ثم بعد اختيار عرض السعر يتم إنشاء **External Job Order** (أمر العمل بين المحطة ومقدم الخدمة). |

**الموضوع الذي يهمك هنا هو مسار EXTERNAL فقط** — أي عندما تريد المحطة أن تعمل "work order" مع مقدم الخدمة.

---

## 2. نظرة عامة على المسار الكامل

المسار من البداية للنهاية كالتالي:

1. **محطة الوقود** تنشئ طلب صيانة خارجي (External Request).
2. (اختياري) المحطة ترسل الطلب لمقدمين محددين أو وفق قواعد (محافظة، فئة خدمة، إلخ) — يسمى إرسال RFQ.
3. **مقدمو الخدمة** يشاهدون الطلبات المرسلة لهم ويقدمون عروض أسعار (Quotes).
4. **محطة الوقود** تختار عرض سعر واحد — **في هذه اللحظة يتم إنشاء Job Order (أمر العمل)** وربطه بالمحطة ومقدم الخدمة.
5. المحطة ترفع إيصال الدفع وتؤكد "تم الإرسال"، ومقدم الخدمة يؤكد "تم الاستلام" — بعدها يصبح Job Order **ACTIVE** (قابل للتنفيذ).
6. مقدم الخدمة ينفذ العمل (زيارات، تعيين فنيين، تقارير)، والمحطة تراجع وتوافق أو ترفض عند الانتهاء.

---

## 3. الخطوات بالتفصيل مع الـ APIs

### الخطوة 1: إنشاء طلب الصيانة الخارجي (من محطة الوقود)

- **الـ API:**  
  `POST /api/station/maintenance-requests`

- **المحتوى (Body) مثال:**  
  - `maintenanceMode`: يجب أن تكون **`"EXTERNAL"`** لطلب صيانة خارجية.  
  - `branchId`: رقم الفرع التابع للمحطة.  
  - `title`: عنوان الطلب.  
  - `description`: وصف (اختياري).  
  - `assetId`: رقم الأصل/الجهاز (اختياري).  
  - يمكن أيضاً إرسال الطلب مباشرة لمزودين أو وفق قواعد (مثل محافظة أو فئة خدمة) حسب ما يدعمه الـ Body.

- **ما يحدث في النظام:**  
  - يتم إنشاء سجل **ExternalRequest** بحالة **`SUBMITTED_BY_STATION`**.  
  - إذا تم إرسال الطلب لمزودين في نفس الطلب، يتم إنشاء روابط **RequestProvider** وقد تتغير الحالة إلى **`SENT_TO_PROVIDERS`** ثم **`QUOTING_OPEN`** حتى يستطيع مقدمو الخدمة تقديم عروض الأسعار.

---

### الخطوة 2: إرسال الطلب لمقدمي الخدمة (إن لم يتم في الخطوة 1)

- **الـ API:**  
  `POST /api/station/requests/:id/send-to-providers`

- **الاستخدام:**  
  عندما يكون الطلب موجوداً لكن لم يُرسل بعد لمزودين، أو تريد إرساله لمزودين إضافيين.  
  المعامل `:id` هو رقم الـ External Request.

- **ما يحدث في النظام:**  
  - يتم ربط الطلب بمقدمي الخدمة (سجلات **RequestProvider**).  
  - الحالة تتحول إلى **`SENT_TO_PROVIDERS`** ثم **`QUOTING_OPEN`** ليكون الطلب مفتوحاً لعروض الأسعار.

---

### الخطوة 3: مقدم الخدمة يقدم عرض سعر (Quote)

- **من طرف:** تطبيق أو واجهة **مقدم الخدمة (Service Provider)**.

- **ما يحدث:**  
  مقدم الخدمة يرى الطلبات المرسلة له (RFQ) ويقدم عرض سعر.  
  يتم إنشاء سجل **ProviderQuote** مرتبط بنفس الـ **ExternalRequest**، وحالته تكون مثل **`SUBMITTED`** أو **`REVISED`**.

- الـ APIs الخاصة بالمزود موجودة تحت مسارات الـ Provider (مثل تقديم/تعديل/سحب عرض السعر).

---

### الخطوة 4: محطة الوقود تختار عرض سعر واحد — هنا يُنشأ الـ Job Order

- **الـ API:**  
  `POST /api/station/requests/:id/select-quote`

- **المحتوى (Body):**  
  `{ "providerQuoteId": <رقم عرض السعر الذي اختارته المحطة> }`  
  المعامل `:id` هو رقم الـ External Request.

- **ما يحدث في النظام (وهذا هو جوهر إنشاء أمر العمل):**  
  1. يتم التحقق من أن الطلب يخص محطة الوقود وأن عرض السعر يخص هذا الطلب.  
  2. حالة **ExternalRequest** تتحول إلى **`AWAITING_PAYMENT`** (في انتظار الدفع).  
  3. يتم إنشاء **ExternalJobOrder** (أمر العمل بين المحطة ومقدم الخدمة) بحالة **`AWAITING_PAYMENT`**.  
  4. يتم إنشاء **PaymentRecord** (سجل الدفع) بحالة **`NOT_STARTED`** لتتبع خطوتي التأكيد (المحطة أرسلت — المزود استلم).

**باختصار:** في لحظة استدعاء **select-quote** يتم إنشاء الـ **Job Order (Work Order)** وربطه بالمحطة ومقدم الخدمة. بعدها يأتي دور الدفع والتنفيذ.

---

### الخطوة 5: تأكيد الدفع (من المحطة ثم من مقدم الخدمة)

- **من محطة الوقود:**  
  - رفع إيصال التحويل:  
    `POST /api/station/job-orders/:id/upload-receipt`  
    (مع إرفاق الملف في الحقل المطلوب).  
  - تأكيد أن المحطة أرسلت المبلغ:  
    `POST /api/station/job-orders/:id/confirm-sent`

- **من مقدم الخدمة:**  
  - تأكيد استلام الدفع:  
    `POST /api/job-orders/:id/payment/confirm-received`

- **ما يحدث في النظام:**  
  عندما تؤكد المحطة "تم الإرسال" ويؤكد المزود "تم الاستلام"، يتم تحديث **PaymentRecord** وتتحول حالة **ExternalJobOrder** إلى **`ACTIVE`**. من هذه اللحظة يمكن لمقدم الخدمة البدء في التنفيذ (تعيين فنيين، زيارات، تحديث الحالة، إلخ).

---

### الخطوة 6: التنفيذ والمراجعة (بعد تفعيل الـ Job Order)

- **مقدم الخدمة:**  
  - يعيّن فنيين (Assignments)، يسجل زيارات (Visits)، يحدّث حالة أمر العمل (مثلاً **IN_PROGRESS**، **WAITING_PARTS**، **UNDER_REVIEW**).  
  - يرفع تقارير صيانة إن وجدت.

- **محطة الوقود:**  
  - تعرض أوامر العمل:  
    `GET /api/station/job-orders`  
    (يمكن التصفية بحالة مثل **UNDER_REVIEW**).  
  - بعد انتهاء المزود من العمل وتقديم التقرير، المحطة إما:  
    - توافق على إغلاق الأمر:  
      `POST /api/station/job-orders/:id/approve`  
    - أو ترفض وتطلب إعادة عمل:  
      `POST /api/station/job-orders/:id/reject`  
      (مع إمكانية إدخال سبب الرفض).

---

## 4. جدول ملخص الـ APIs من طرف محطة الوقود

| الترتيب | الهدف | الـ API | ملاحظة |
|---------|--------|---------|--------|
| 1 | إنشاء طلب صيانة خارجي | `POST /api/station/maintenance-requests` | Body: `maintenanceMode: "EXTERNAL"` + branchId, title, إلخ. |
| 2 | إرسال الطلب لمزودين (إن لزم) | `POST /api/station/requests/:id/send-to-providers` | :id = رقم External Request. |
| 3 | — | (مقدم الخدمة يقدم عرض سعر من واجهته) | — |
| 4 | اختيار عرض السعر وإنشاء Job Order | `POST /api/station/requests/:id/select-quote` | Body: `{ "providerQuoteId": <id> }`. **هنا يُنشأ أمر العمل.** |
| 5 أ | رفع إيصال الدفع | `POST /api/station/job-orders/:id/upload-receipt` | مع إرفاق ملف الإيصال. |
| 5 ب | تأكيد إرسال الدفع | `POST /api/station/job-orders/:id/confirm-sent` | بعدها المزود يؤكد الاستلام لتفعيل الأمر. |
| 6 | عرض أوامر العمل | `GET /api/station/job-orders` | يمكن التصفية بحالة (مثلاً UNDER_REVIEW). |
| 7 | الموافقة على إغلاق الأمر | `POST /api/station/job-orders/:id/approve` | بعد انتهاء المزود من العمل. |
| 7 بديل | رفض وطلب إعادة عمل | `POST /api/station/job-orders/:id/reject` | مع إمكانية إدخال سبب. |

---

## 5. الحالات المهمة (للمرجع)

- **External Request:**  
  SUBMITTED_BY_STATION → SENT_TO_PROVIDERS → QUOTING_OPEN → QUOTE_SELECTED → AWAITING_PAYMENT → ACTIVE → COMPLETED (أو CANCELLED).

- **External Job Order:**  
  AWAITING_PAYMENT → ACTIVE → IN_PROGRESS / WAITING_PARTS / … → UNDER_REVIEW → CLOSED (أو REWORK_REQUIRED).

- **Payment Record:**  
  NOT_STARTED → STATION_CONFIRMED_SENT → PROVIDER_CONFIRMED_RECEIVED (وعندها يصبح الـ Job Order ACTIVE).

---

## 6. خلاصة في جملة واحدة

**لعمل Work Order من Fuel Station إلى Service Provider:**  
المحطة تنشئ طلب صيانة **EXTERNAL**، ترسله للمزودين، المزود يقدم عرض سعر، ثم المحطة تختار عرضاً واحداً عبر **select-quote** — في هذه اللحظة يُنشأ **External Job Order** (أمر العمل). بعد تأكيد الدفع من الطرفين يصبح الأمر **ACTIVE** ويقدر مقدم الخدمة يبدأ التنفيذ.

---

*تم إعداد هذا الشرح بناءً على هيكل الـ APIs والـ services في المشروع (مثل station.routes.js، stationMaintenanceRequest.service.js، externalRequest.service.js، وغيرها).*
