# Authority — External Job Orders Routes

توثيق مسارات الـ Authority الخاصة بعرض طلبات الصيانة الخارجية (External Job Orders) مع الفلاتر والتصدير. هذه المسارات **للجهة الرقابية فقط** ولا تعرض أي بيانات مالية.

---

## الأساسيات

| البند | الوصف |
|--------|--------|
| **Base path** | `/api/authority` (أو حسب تهيئة التطبيق) |
| **المصادقة** | مطلوبة (JWT) |
| **الصلاحية** | مستخدم منظمة من نوع **Authority** فقط |
| **Permission** | `ORGANIZATIONS_READ` |

---

## قائمة المسارات

| Method | المسار | الوصف |
|--------|--------|--------|
| GET | `/external-job-orders` | قائمة طلبات الصيانة الخارجية مع pagination وفلاتر |
| GET | `/external-job-orders/export` | تصدير نفس القائمة (JSON أو CSV) |
| GET | `/external-job-orders/:id` | تفاصيل طلب صيانة واحد |
| GET | `/external-job-orders/:id/timeline` | الجدول الزمني لأنشطة الطلب |
| GET | `/external-job-orders/:id/reports` | تقارير الصيانة للطلب |

---

## 1. قائمة الطلبات — `GET /external-job-orders`

يعيد طلبات الصيانة الخارجية مع كل متعلقات الطلب (الطلب، المحطة، منظمة المحطة، العرض) مع إمكانية التصفح (pagination) والفلترة.

### Query Parameters

| المعامل | النوع | مطلوب؟ | الوصف |
|---------|--------|--------|--------|
| `page` | string (رقم) | لا | رقم الصفحة (افتراضي: 1) |
| `limit` | string (رقم) | لا | عدد العناصر في الصفحة (افتراضي: 20، أقصى: 100) |
| `status` | string | لا | حالة الطلب. يمكن أكثر من قيمة مفصولة بفاصلة، مثل: `ACTIVE,IN_PROGRESS` |
| `fromDate` | string (تاريخ) | لا | بداية نطاق التاريخ (ISO date) |
| `toDate` | string (تاريخ) | لا | نهاية نطاق التاريخ (ISO date) |
| `datePreset` | string | لا | اختصار للتاريخ: `today`، `week`، `month`، `custom` |
| `fuelStationOrganizationName` | string | لا | بحث باسم منظمة المحطة (Fuel Station) — تطابق جزئي |
| `serviceProviderOrganizationName` | string | لا | بحث باسم منظمة مزود الخدمة — تطابق جزئي |
| `providerOrganizationId` | string (رقم) | لا | فلتر حسب منظمة مزود الخدمة (ID) |
| `serviceCategoryId` | string (رقم) | لا | فلتر حسب فئة الخدمة |

### سلوك `datePreset`

- **`today`**: الطلبات في اليوم الحالي (من منتصف الليل إلى 23:59:59).
- **`week`**: الطلبات في آخر 7 أيام.
- **`month`**: الطلبات في آخر 30 يوماً.
- **`custom`** أو عدم الإرسال: يتم استخدام `fromDate` و `toDate` إن وُجدتا.

### مثال على الطلب

```http
GET /api/authority/external-job-orders?page=1&limit=20&datePreset=week&fuelStationOrganizationName=شركة النفط
GET /api/authority/external-job-orders?serviceProviderOrganizationName=الصيانة
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
        "createdAt": "2025-03-10T12:00:00.000Z",
        "ExternalRequest": {
          "id": 10,
          "status": "SUBMITTED_BY_STATION",
          "branchId": 3,
          "fuelStationOrganizationId": 5,
          "serviceCategoryId": 2,
          "formData": { "title": "صيانة مضخة" },
          "Branch": {
            "id": 3,
            "nameEn": "Station A",
            "nameAr": "محطة أ",
            "address": "...",
            "street": "...",
            "organizationId": 5
          },
          "Organization": {
            "id": 5,
            "name": "منظمة الوقود أ",
            "type": "FUEL_STATION",
            "status": "APPROVED"
          }
        },
        "ProviderQuote": {
          "id": 20,
          "externalRequestId": 10,
          "serviceProviderOrganizationId": 7,
          "status": "ACCEPTED",
          "version": 1,
          "createdAt": "...",
          "updatedAt": "..."
        }
      }
    ],
    "total": 42
  }
}
```

**ملاحظة:** لا تُعاد بيانات مالية (أسعار، دفعات، إلخ) في استجابة الـ Authority.

---

## 2. تصدير الطلبات — `GET /external-job-orders/export`

نفس فلاتر القائمة، لكن النتيجة كل الطلبات (بدون pagination) بتنسيق JSON أو CSV.

### Query Parameters

نفس معاملات القائمة **ما عدا** `page` و `limit`، مع إضافة:

| المعامل | النوع | مطلوب؟ | الوصف |
|---------|--------|--------|--------|
| `format` | string | لا | `json` أو `csv` (افتراضي: `csv`) |

الفلاتر المدعومة: `status`, `fromDate`, `toDate`, `datePreset`, `fuelStationOrganizationName`, `serviceProviderOrganizationName`, `providerOrganizationId`, `serviceCategoryId`.

### أمثلة

```http
GET /api/authority/external-job-orders/export?datePreset=month&format=json
GET /api/authority/external-job-orders/export?fuelStationOrganizationName=شركة&format=csv
```

### الاستجابة

- **`format=json`**: نفس شكل `data.items` في قائمة الطلبات لكن بدون pagination، داخل `{ "success": true, "data": [ ... ] }`.
- **`format=csv`**: ملف CSV مع العناوين: `id`, `status`, `createdAt`, `title`, `branchName`, `serviceCategoryId`, `providerOrganizationId`، و header: `Content-Disposition: attachment; filename=authority-job-orders.csv`.

---

## 3. تفاصيل طلب واحد — `GET /external-job-orders/:id`

يعيد تفاصيل طلب صيانة خارجي واحد مع الطلب، العرض، المحطة، التعيينات، الزيارات، والتقارير (بدون بيانات مالية).

### Path Parameters

| المعامل | الوصف |
|---------|--------|
| `id` | معرّف الـ External Job Order (رقم) |

### مثال

```http
GET /api/authority/external-job-orders/123
```

### الاستجابة

```json
{
  "success": true,
  "data": {
    "id": 123,
    "status": "ACTIVE",
    "ExternalRequest": { ... },
    "ProviderQuote": { ... },
    "ExternalJobAssignments": [ ... ],
    "ExternalJobVisits": [ ... ],
    "MaintenanceReports": [ ... ],
    "Branch": { ... }
  }
}
```

---

## 4. الجدول الزمني — `GET /external-job-orders/:id/timeline`

يعيد سجل الأنشطة (Activity Log) للطلب مرتباً من الأحدث.

### Path Parameters

| المعامل | الوصف |
|---------|--------|
| `id` | معرّف الـ External Job Order (رقم) |

### مثال

```http
GET /api/authority/external-job-orders/123/timeline
```

---

## 5. تقارير الصيانة — `GET /external-job-orders/:id/reports`

يعيد تقارير الصيانة المرتبطة بالطلب (للجهة الرقابية، بدون بيانات مالية).

### Path Parameters

| المعامل | الوصف |
|---------|--------|
| `id` | معرّف الـ External Job Order (رقم) |

### مثال

```http
GET /api/authority/external-job-orders/123/reports
```

---

## ملخص الفلاتر

| الفلتر | المعامل | الاستخدام |
|--------|---------|-----------|
| حالة الطلب | `status` | قائمة أو أكثر: `ACTIVE`, `IN_PROGRESS`, `CLOSED`, إلخ |
| نطاق التاريخ | `fromDate`, `toDate` | تاريخ بداية ونهاية (ISO) |
| اختصار التاريخ | `datePreset` | `today` \| `week` \| `month` \| `custom` |
| المحطة | `branchId` | معرّف الفرع (المحطة) |
| منظمة المحطة | `fuelStationOrganizationId` | معرّف منظمة الوقود |
| مزود الخدمة | `providerOrganizationId` | معرّف منظمة مزود الخدمة |
| فئة الخدمة | `serviceCategoryId` | معرّف فئة الخدمة |

---

## الملفات ذات الصلة

- **Routes:** `src/routes/authority.routes.js`
- **Controller:** `src/controllers/authorityExternalJobOrder.controller.js`
- **Schema (Zod):** `src/schemas/authorityExternalJobOrder.schema.js`
- **Service:** `src/services/externalJobOrder.service.js` (`listForAuthority`, `listForAuthorityExport`, `getByIdForAuthority`, `getTimelineForAuthority`)
