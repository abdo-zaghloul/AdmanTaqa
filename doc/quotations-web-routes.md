# Quotations Web — API للعروض الخارجية (ProviderQuote)

توثيق مسارات **quotations-web** الخاصة بعرض عروض مزود الخدمة الخارجية (ProviderQuote) بشكل مناسب للويب. هذه المسارات **لمزود الخدمة فقط** وتعرض بيانات العروض المرتبطة بـ RFQs الخارجية.

---

## الأساسيات

| البند | الوصف |
|--------|--------|
| **Base path** | `/api/quotations-web` |
| **المصادقة** | مطلوبة (JWT) |
| **الوصول** | منظمة من نوع **Service Provider** فقط |
| **Permission** | `PROVIDER_RFQS_READ` |

---

## قائمة المسارات

| Method | المسار | الوصف |
|--------|--------|--------|
| GET | `/` | قائمة عروض المزود الخارجية مع pagination وفلتر status |
| GET | `/:id` | تفاصيل عرض واحد بالكامل |

---

## 1. قائمة العروض — `GET /quotations-web`

يعيد عروض مزود الخدمة الخارجية (ProviderQuote) مع RFQ الملحق وبيانات المحطة، بشكل مناسب للويب.

### Query Parameters

| المعامل | النوع | مطلوب؟ | الوصف |
|---------|--------|--------|--------|
| `page` | string (رقم) | لا | رقم الصفحة (افتراضي: 1) |
| `limit` | string (رقم) | لا | عدد العناصر في الصفحة (افتراضي: 20، أقصى: 100) |
| `status` | string | لا | فلتر حسب حالة العرض: `DRAFT`, `SUBMITTED`, `REVISED`, `WITHDRAWN`, `REJECTED`, `SELECTED` |

### مثال

```http
GET /api/quotations-web?page=1&limit=20
GET /api/quotations-web?status=SUBMITTED
```

### شكل الاستجابة

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "status": "SUBMITTED",
        "version": 1,
        "externalRequestId": 10,
        "createdAt": "2025-03-10T12:00:00.000Z",
        "updatedAt": "2025-03-10T12:00:00.000Z",
        "paymentType": "ONE_TIME",
        "hasAttachments": true,
        "attachments": [
          { "id": 5, "fileName": "offer.pdf", "fileUrl": "https://..." }
        ],
        "ExternalRequest": {
          "id": 10,
          "status": "QUOTING_OPEN",
          "formData": {},
          "Branch": { "id": 3, "nameEn": "Station A", "nameAr": "محطة أ" },
          "Organization": { "id": 5, "name": "منظمة الوقود" }
        }
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

## 2. تفاصيل العرض — `GET /quotations-web/:id`

يعيد عرضاً واحداً بكل التفاصيل: المرفقات، شروط الدفع، الإصدارات، RFQ الكامل، المحطة، المنظمة، الأصل، المنطقة، المدينة.

### Path Parameters

| المعامل | النوع | الوصف |
|---------|--------|--------|
| `id` | number | معرّف العرض (ProviderQuote id) |

### مثال

```http
GET /api/quotations-web/5
```

### شكل الاستجابة

```json
{
  "success": true,
  "data": {
    "id": 5,
    "status": "SUBMITTED",
    "version": 1,
    "externalRequestId": 10,
    "serviceProviderOrganizationId": 3,
    "submittedByUserId": 1,
    "rejectionReason": null,
    "createdAt": "...",
    "updatedAt": "...",
    "paymentType": "ONE_TIME",
    "hasAttachments": true,
    "attachments": [
      {
        "id": 1,
        "fileName": "offer.pdf",
        "fileUrl": "https://...",
        "mimeType": "application/pdf",
        "fileSize": 12345,
        "createdAt": "..."
      }
    ],
    "QuoteAttachments": [...],
    "QuotePaymentTerms": [
      { "sequence": 1, "percent": 100, "trigger": "ON_COMPLETION_SUBMITTED", "note": null }
    ],
    "ProviderQuoteRevisions": [
      { "id": 1, "version": 1, "pricingJson": {...}, "submittedAt": "..." }
    ],
    "ExternalRequest": {
      "id": 10,
      "status": "QUOTING_OPEN",
      "formData": {},
      "Branch": { "id": 3, "nameEn": "...", "nameAr": "...", "address": "...", "latitude": "...", "longitude": "..." },
      "Organization": { "id": 5, "name": "...", "type": "FUEL_STATION" },
      "Asset": { "id": 1, "name": "...", "maintenanceType": "...", "description": "..." },
      "Area": { "id": 1, "name": "..." },
      "City": { "id": 1, "name": "..." }
    }
  }
}
```

---

## الفرق عن `/api/quotations` و `/api/provider/rfqs`

| المسار | النوع | الوصف |
|--------|--------|--------|
| `/api/quotations` | Quotation (داخلي) | عروض مرتبطة بـ ServiceRequest (صيانة داخلية/قديمة) |
| `/api/provider/rfqs` | RFQ + ProviderQuote | RFQs مع العروض ضمن كل RFQ |
| `/api/quotations-web` | ProviderQuote فقط | قائمة وتفاصيل العروض الخارجية للمزود — مناسب للويب |

---

## الملفات ذات الصلة

- `src/routes/quotationsWeb.routes.js` — تعريف المسارات
- `src/controllers/quotationsWeb.controller.js` — المنطق
- `src/services/quotationsWeb.service.js` — جلب البيانات
- `src/schemas/quotationsWeb.schema.js` — التحقق من المدخلات
