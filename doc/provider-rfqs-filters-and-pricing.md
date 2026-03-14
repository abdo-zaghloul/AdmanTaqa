# Provider RFQs – Filters & Pricing Details

توثيق التعديلات على `GET /api/provider/rfqs` (قائمة RFQs للـ provider).

---

## 1. الفلاتر (Query Parameters)

| Parameter | Type   | Required | Description                                      |
|-----------|--------|----------|--------------------------------------------------|
| `status`  | enum   | No       | فلترة حسب حالة RFQ                               |
| `title`   | string | No       | بحث جزئي في `formData.title` (LIKE)             |
| `priority`| string | No       | مطابقة دقيقة مع `formData.priority`             |
| `page`    | string | No       | رقم الصفحة (افتراضي: 1)                         |
| `limit`   | string | No       | عدد النتائج (افتراضي: 20، أقصى: 100)           |

### أمثلة

```
GET /api/provider/rfqs?title=صيانة
GET /api/provider/rfqs?priority=high
GET /api/provider/rfqs?status=SUBMITTED_BY_STATION&title=مضخة
GET /api/provider/rfqs?page=2&limit=10
```

### ملاحظات تقنية

- `title` و `priority` يُستخرجان من `ExternalRequest.formData` (JSON) عبر:
  - `JSON_UNQUOTE(JSON_EXTRACT(formData, '$.title'))`
  - `JSON_UNQUOTE(JSON_EXTRACT(formData, '$.priority'))`
- يتم استخدام `escapeLikePattern` لتجنب injection في LIKE.

---

## 2. تفاصيل العرضات (Quotes)

تمت إضافة حقول جديدة لكل quote داخل `quotes` دون تغيير الحقول القديمة.

### الحقول الجديدة

| Field              | Type   | Description                                             |
|--------------------|--------|---------------------------------------------------------|
| `pricingDetails`   | object | بيانات التسعير من أحدث revision (محتوى `pricingJson`)   |
| `quotePaymentTerms`| array  | شروط الدفع الكاملة (sequence, percent, trigger, note)   |

### مصدر البيانات

- **pricingDetails**: من `ProviderQuoteRevision` (أحدث revision) – الحقل `pricingJson`
- **quotePaymentTerms**: من `QuotePaymentTerm` – كل الشروط مرتبة حسب `sequence`

### توافقية الاستجابة

- لم يتم إزالة أو تعديل أي حقل قديم.
- الحقول الحالية (`id`, `status`, `paymentType`, `hasAttachments`, `attachments`) كما هي.

---

## 3. الملفات المعدلة

| File                                | التعديلات                                                                 |
|-------------------------------------|---------------------------------------------------------------------------|
| `src/schemas/providerRfq.schema.js` | إضافة `title` و `priority` كـ query params اختيارية                        |
| `src/services/providerRfq.service.js`| فلترة RFQs بـ title/priority، تضمين ProviderQuoteRevision، إضافة pricingDetails و quotePaymentTerms لكل quote |

---

## 4. مثال على استجابة Quote

```json
{
  "id": 123,
  "status": "SUBMITTED",
  "paymentType": "INSTALLMENTS",
  "hasAttachments": true,
  "attachments": [
    { "id": 1, "fileName": "quote.pdf", "fileUrl": "https://..." }
  ],
  "pricingDetails": {
    "amount": 5000,
    "currency": "SAR",
    "lineItems": [...]
  },
  "quotePaymentTerms": [
    { "id": 1, "sequence": 1, "percent": 50, "trigger": "ON_APPROVAL", "note": null },
    { "id": 2, "sequence": 2, "percent": 50, "trigger": "ON_COMPLETION", "note": null }
  ]
}
```
