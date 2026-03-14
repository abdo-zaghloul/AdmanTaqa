# Job Orders Web — API لأوامر الصيانة الخارجية (ExternalJobOrder)

توثيق مسارات **job-orders-web** الخاصة بعرض أوامر الصيانة الخارجية (ExternalJobOrder) للمزود بشكل كامل ومناسب للويب. هذه المسارات **لمزود الخدمة فقط** وتعرض كل الحالات والبيانات المرتبطة.

---

## الأساسيات

| البند | الوصف |
|--------|--------|
| **Base path** | `/api/job-orders-web` |
| **المصادقة** | مطلوبة (JWT) |
| **الوصول** | منظمة من نوع **Service Provider** فقط |
| **Permission** | `PROVIDER_JOB_ORDERS_READ` |

---

## قائمة المسارات

| Method | المسار | الوصف |
|--------|--------|--------|
| GET | `/` | قائمة أوامر الصيانة الخارجية مع تضمينات كاملة |
| GET | `/:id` | تفاصيل أمر صيانة واحد بالكامل |

---

## 1. قائمة أوامر الصيانة — `GET /job-orders-web`

يعيد أوامر الصيانة الخارجية للمزود مع كل التضمينات: ProviderQuote, ExternalRequest, Branch, Organization, Asset, PaymentRecord, ExternalJobVisits, ExternalJobAssignments, MaintenanceReports. **لا يطبّق فلتر Operator** — يعرض كل الطلبات للمنظمة.

### Query Parameters

| المعامل | النوع | مطلوب؟ | الوصف |
|---------|--------|--------|--------|
| `page` | string (رقم) | لا | رقم الصفحة (افتراضي: 1) |
| `limit` | string (رقم) | لا | عدد العناصر في الصفحة (افتراضي: 20، أقصى: 100) |
| `status` | string | لا | فلتر حسب الحالة (واحد أو أكثر مفصولة بفاصلة)، مثل: `ACTIVE,IN_PROGRESS` |

### الحالات المدعومة

`CREATED`, `AWAITING_PAYMENT`, `ACTIVE`, `IN_PROGRESS`, `WAITING_PARTS`, `UNDER_REVIEW`, `REWORK_REQUIRED`, `COMPLETED`, `CANCELLED`, `CLOSED`, `SUSPENDED`

### مثال

```http
GET /api/job-orders-web?page=1&limit=20
GET /api/job-orders-web?status=ACTIVE,IN_PROGRESS
```

### شكل الاستجابة

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "status": "ACTIVE",
        "providerQuoteId": 5,
        "externalRequestId": 10,
        "createdAt": "...",
        "expectedStartDate": "...",
        "expectedEndDate": "...",
        "ProviderQuote": { "id": 5, "status": "SELECTED", "..." },
        "ExternalRequest": {
          "id": 10,
          "formData": {},
          "Branch": { "id": 3, "nameEn": "...", "nameAr": "..." },
          "Organization": { "id": 5, "name": "..." },
          "Asset": { "id": 1, "name": "..." }
        },
        "PaymentRecord": { "..." },
        "ExternalJobVisits": [...],
        "ExternalJobAssignments": [{ "Operator": { "id": 1, "name": "..." } }],
        "MaintenanceReports": [...]
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

## 2. تفاصيل أمر الصيانة — `GET /job-orders-web/:id`

يعيد أمر صيانة واحد بكل التفاصيل: ProviderQuote, ExternalRequest (مع Branch, Organization, Asset, Area, City), PaymentRecord, ExternalJobAssignments, ExternalJobVisits, MaintenanceReports, Branch (assigned).

### Path Parameters

| المعامل | النوع | الوصف |
|---------|--------|--------|
| `id` | number | معرّف أمر الصيانة (ExternalJobOrder id) |

### مثال

```http
GET /api/job-orders-web/5
```

---

## الفرق عن `/api/provider/job-orders`

| الجانب | `/api/provider/job-orders` | `/api/job-orders-web` |
|--------|---------------------------|------------------------|
| التضمينات | محدودة (ProviderQuote, ExternalRequest مختصر, PaymentRecord) | كاملة (Branch, Organization, Asset, Visits, Assignments, Reports) |
| فلتر Operator | نعم (للفني يعرض المهام المعينة له فقط) | لا — كل أوامر المنظمة |
| الاستخدام | تطبيق الموبايل (فني/مشرف) | واجهة ويب للإدارة والعرض الشامل |

---

## الملفات ذات الصلة

- `src/routes/jobOrdersWeb.routes.js`
- `src/controllers/jobOrdersWeb.controller.js`
- `src/services/jobOrdersWeb.service.js`
- `src/schemas/jobOrdersWeb.schema.js`
