# دليل ربط الـ Frontend مع Quotations

هذا الدليل يشرح كيف يعمل مسار `Quotations` في الباك إند، ومين المفروض يستخدمه، وكيف يشتغل عليه فريق الـ Frontend بشكل عملي.

---

## 1) Quotations يعني إيه في السيستم؟

`Quotation` هو عرض سعر يقدمه `Service Provider` على `Service Request` صادرة من `Fuel Station`.

الفلو العام:

1. Fuel Station تنشئ `Service Request`
2. Service Provider يقدم `Quotation`
3. لاحقا يمكن إنشاء `Job Order` مرتبط بالـ quotation

---

## 2) مين يستخدم Quotations؟

## Service Provider (المستخدم الأساسي)

- إنشاء quotation
- عرض quotations الخاصة به

## Fuel Station

- عرض quotations المرتبطة بطلباته فقط

## Authority

- عرض كل quotations (بدون pricing details في الاستجابة الحالية)

---

## 3) الصلاحيات (Permissions)

- `quotations:read`  
  لعرض القائمة والتفاصيل

- `quotations:submit`  
  لتقديم quotation جديد

- `quotation-pricing:read`  
  لإظهار `QuotationPricing` (amount/currency) لغير Authority

---

## 4) شروط الدخول على routes

كل routes `quotations` عليها:

- `authenticate`
- `requireApprovedOrganization`

يعني لازم المستخدم:

- مسجل دخول
- من منظمة معتمدة

---

## 5) Endpoints الأساسية

Base:

- `/api/quotations`

### 5.1) List quotations

- `GET /api/quotations?limit=50`
- يحتاج permission: `quotations:read`
- limit افتراضي 50 والحد الأقصى 100

منطق البيانات حسب organization type:

- `SERVICE_PROVIDER`: يرى quotations الخاصة به فقط
- `FUEL_STATION`: يرى quotations الخاصة بطلباته فقط
- `AUTHORITY`: يرى كل quotations
- أنواع أخرى: data فارغة

---

### 5.2) Get quotation by id

- `GET /api/quotations/:id`
- يحتاج permission: `quotations:read`

التحقق:

- Fuel Station لا ترى quotation إلا إذا كانت تخص Service Request من نفس المنظمة
- Service Provider لا يرى quotation إلا إذا كان هو المقدم لها

---

### 5.3) Submit quotation

- `POST /api/quotations`
- يحتاج permission: `quotations:submit`
- متاح عمليا فقط لـ `SERVICE_PROVIDER`

Body:

```json
{
  "serviceRequestId": 15,
  "amount": 1200.5,
  "currency": "USD"
}
```

التحقق في الباك إند:

- المستخدم لازم يكون `SERVICE_PROVIDER`
- `serviceRequestId` لازم يكون موجود
- لازم يكون فيه link `ACTIVE` بين:
  - fuel station صاحبة الطلب
  - وservice provider الحالي

النتيجة:

- ينشئ `Quotation` بحالة `SUBMITTED`
- لو `amount` موجود، ينشئ `QuotationPricing`

---

## 6) شكل البيانات المتوقع

## Quotation

```json
{
  "id": 8,
  "serviceRequestId": 15,
  "serviceProviderOrganizationId": 3,
  "submittedByUserId": 21,
  "status": "SUBMITTED",
  "createdAt": "2026-02-23T11:00:00.000Z",
  "updatedAt": "2026-02-23T11:00:00.000Z",
  "ServiceRequest": {
    "id": 15,
    "status": "PENDING",
    "branchId": 2,
    "fuelStationOrganizationId": 7
  },
  "QuotationPricing": {
    "id": 4,
    "quotationId": 8,
    "amount": "1200.50",
    "currency": "USD"
  }
}
```

---

## 7) ملاحظة مهمة جدا عن Pricing

الـ pricing (`QuotationPricing`) يظهر عندما:

- المستخدم ليس Authority
- وعنده permission: `quotation-pricing:read`

أما Authority في التطبيق الحالي:

- يشوف quotation metadata
- بدون تفاصيل pricing في include

لذلك في الفرونت:

- خلي حقل `QuotationPricing` optional دائما
- ولا تفترض وجوده لكل المستخدمين

---

## 8) ربط الفرونت خطوة بخطوة

1. بعد login:
   - اعمل `GET /api/auth/me`
   - خزّن permissions + organization type

2. شاشة Quotations List:
   - لو عنده `quotations:read` اعمل `GET /api/quotations`
   - pagination/limit من query

3. شاشة تفاصيل Quotation:
   - `GET /api/quotations/:id`
   - اعرض pricing فقط لو موجود في response

4. شاشة Submit Quotation:
   - تظهر فقط لو:
     - org type = `SERVICE_PROVIDER`
     - وعنده `quotations:submit`
   - بعد submit اعمل refetch list

---

## 9) UI Guards مقترحة

استخرج من `/auth/me`:

- `organization.type`
- `permissions[]`

واعدة أساسية:

- لا تعتمد على role name
- اعتمد على permission + organization type

مثال:

```ts
const canReadQuotations = permissions.includes("quotations:read");
const canSubmitQuotation =
  organizationType === "SERVICE_PROVIDER" &&
  permissions.includes("quotations:submit");
const canReadPricing = permissions.includes("quotation-pricing:read");
```

---

## 10) أخطاء متوقعة (للتعامل في الفرونت)

- `401 Unauthorized`:
  - token ناقص/منتهي

- `403 Forbidden`:
  - organization type غير مسموح (مثلا submit من غير Service Provider)
  - أو مفيش صلاحية
  - أو لا يوجد ربط ACTIVE مع fuel station

- `404 Not Found`:
  - service request غير موجود
  - quotation غير موجود

- `400 Bad Request`:
  - payload غير صحيح (حسب validation/DB constraints)

---

## 11) مين "المفروض" يستخدم Quotations؟

عمليا:

- **Service Provider**: إنشاء + متابعة عروضه (core user)
- **Fuel Station**: مراجعة العروض التي وصلت على طلباته
- **Authority**: رؤية عامة/رقابية على كل العروض

إذا سؤالك من ناحية business ownership:

- صاحب إنشاء الـ quotation هو Service Provider فقط.

---

## 12) Checklist سريع للفريق

- [ ] جلب `permissions` و`organization.type` من `/api/auth/me`
- [ ] Quotations List + Details
- [ ] Submit form لـ Service Provider
- [ ] إظهار pricing فقط عند وجوده
- [ ] معالجة 401/403/404/400 برسائل واضحة
- [ ] إعادة تحميل البيانات بعد submit

