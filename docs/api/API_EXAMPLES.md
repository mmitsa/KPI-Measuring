# API Usage Examples
# أمثلة استخدام الـ API

<div dir="rtl">

## 📋 نظرة عامة

هذا الدليل يحتوي على أمثلة عملية لاستخدام API نظام قياس الأداء الوظيفي.

### البيئات المتاحة:

| البيئة | Base URL | الوصف |
|--------|----------|-------|
| Development | `http://localhost:5001/api/v1` | بيئة التطوير المحلية |
| Staging | `https://staging-api.performance.gov.sa/api/v1` | بيئة الاختبار |
| Production | `https://api.performance.gov.sa/api/v1` | بيئة الإنتاج |

### المصادقة:

جميع الطلبات (عدا `/auth/login`) تتطلب Bearer Token:

```bash
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

</div>

---

## 1. Authentication Examples

### 1.1 تسجيل الدخول

```bash
curl -X POST https://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "password": "Employee@123"
  }'
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john.doe",
    "email": "john.doe@gov.sa",
    "employeeId": "e1f2g3h4-i5j6-7890-klmn-op1234567890",
    "roles": ["Employee"],
    "permissions": [
      "Goals.View",
      "Goals.Create",
      "Evaluation.View"
    ]
  }
}
```

### 1.2 الحصول على معلومات المستخدم الحالي

```bash
curl -X GET https://localhost:5001/api/v1/users/me \
  -H "Authorization: Bearer {accessToken}"
```

**Response (200 OK):**
```json
{
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "employeeId": "e1f2g3h4-i5j6-7890-klmn-op1234567890",
  "username": "john.doe",
  "email": "john.doe@gov.sa",
  "employee": {
    "employeeNumber": "E12345",
    "fullNameAr": "جون دو",
    "fullNameEn": "John Doe",
    "department": "تقنية المعلومات",
    "position": "مطور برمجيات",
    "grade": 10,
    "manager": {
      "employeeId": "m1n2o3p4-q5r6-7890-stuv-wx1234567890",
      "fullNameAr": "أحمد محمد",
      "email": "ahmed.mohamed@gov.sa"
    }
  },
  "roles": ["Employee"],
  "permissions": ["Goals.View", "Goals.Create", "Evaluation.View"],
  "isActive": true,
  "lastLoginAt": "2025-11-05T10:30:00Z"
}
```

---

## 2. Goals Management Examples

### 2.1 الحصول على أهدافي

```bash
curl -X GET "https://localhost:5001/api/v1/goals/my?status=Approved&year=2025" \
  -H "Authorization: Bearer {accessToken}"
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "goalId": "g1h2i3j4-k5l6-7890-mnop-qr1234567890",
      "title": "تطوير نظام إدارة الأداء",
      "description": "تصميم وتطوير نظام متكامل لقياس وإدارة الأداء الوظيفي",
      "type": "Strategic",
      "category": "تقنية المعلومات",
      "weight": 30,
      "targetValue": "100%",
      "measurementUnit": "نسبة مئوية",
      "startDate": "2025-01-01",
      "endDate": "2025-12-31",
      "status": "Approved",
      "progressPercent": 65,
      "approvedAt": "2025-01-10T14:20:00Z",
      "approvedBy": {
        "userId": "m1n2o3p4-q5r6-7890-stuv-wx1234567890",
        "fullNameAr": "أحمد محمد"
      }
    }
  ],
  "totalWeight": 100,
  "summary": {
    "total": 4,
    "approved": 4,
    "inProgress": 3,
    "completed": 1
  }
}
```

### 2.2 إنشاء هدف جديد

```bash
curl -X POST https://localhost:5001/api/v1/goals \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "تحسين أمن المعلومات",
    "description": "تطبيق معايير الأمان الجديدة على جميع الأنظمة",
    "type": "Operational",
    "category": "أمن المعلومات",
    "weight": 25,
    "targetValue": "100%",
    "measurementUnit": "نسبة مئوية",
    "startDate": "2025-01-01",
    "endDate": "2025-12-31"
  }'
```

**Response (201 Created):**
```json
{
  "goalId": "n1o2p3q4-r5s6-7890-tuvw-xy1234567890",
  "title": "تحسين أمن المعلومات",
  "status": "Draft",
  "progressPercent": 0,
  "createdAt": "2025-11-05T11:00:00Z",
  "message": "تم إنشاء الهدف بنجاح. في انتظار موافقة المدير."
}
```

### 2.3 تحديث نسبة الإنجاز

```bash
curl -X PATCH https://localhost:5001/api/v1/goals/g1h2i3j4-k5l6-7890-mnop-qr1234567890/progress \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "progressPercent": 75,
    "notes": "تم إكمال مرحلة الاختبار بنجاح"
  }'
```

**Response (200 OK):**
```json
{
  "goalId": "g1h2i3j4-k5l6-7890-mnop-qr1234567890",
  "progressPercent": 75,
  "updatedAt": "2025-11-05T12:00:00Z",
  "message": "تم تحديث نسبة الإنجاز"
}
```

### 2.4 اعتماد هدف (Manager)

```bash
curl -X POST https://localhost:5001/api/v1/goals/n1o2p3q4-r5s6-7890-tuvw-xy1234567890/approve \
  -H "Authorization: Bearer {managerAccessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "هدف واضح ومحدد، معتمد"
  }'
```

**Response (200 OK):**
```json
{
  "goalId": "n1o2p3q4-r5s6-7890-tuvw-xy1234567890",
  "status": "Approved",
  "approvedAt": "2025-11-05T13:00:00Z",
  "approvedBy": {
    "userId": "m1n2o3p4-q5r6-7890-stuv-wx1234567890",
    "fullNameAr": "أحمد محمد"
  },
  "message": "تم اعتماد الهدف بنجاح"
}
```

---

## 3. Evaluations Examples

### 3.1 الحصول على تقييماتي

```bash
curl -X GET "https://localhost:5001/api/v1/evaluations/my?period=2025" \
  -H "Authorization: Bearer {accessToken}"
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "evaluationId": "ev1-2345-6789-abcd-ef1234567890",
      "period": "2025",
      "evaluationType": "Annual",
      "goalsScore": 4.5,
      "behaviorScore": 4.2,
      "initiativesScore": 4.0,
      "trainingImpact": 0.15,
      "finalScore": 4.34,
      "finalRating": "AboveExpected",
      "finalRatingAr": "فوق المتوقع",
      "status": "Approved",
      "managerNotes": "أداء ممتاز خلال العام",
      "evaluatedAt": "2025-12-15T10:00:00Z",
      "evaluatedBy": {
        "userId": "m1n2o3p4-q5r6-7890-stuv-wx1234567890",
        "fullNameAr": "أحمد محمد"
      },
      "approvedAt": "2025-12-20T14:00:00Z",
      "approvedBy": {
        "userId": "hr1-2345-6789-hijk-lm1234567890",
        "fullNameAr": "سارة أحمد"
      }
    }
  ]
}
```

### 3.2 إنشاء تقييم (Manager)

```bash
curl -X POST https://localhost:5001/api/v1/evaluations \
  -H "Authorization: Bearer {managerAccessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "e1f2g3h4-i5j6-7890-klmn-op1234567890",
    "period": "2025",
    "evaluationType": "Annual"
  }'
```

**Response (201 Created):**
```json
{
  "evaluationId": "ev2-3456-7890-bcde-fg2345678901",
  "employeeId": "e1f2g3h4-i5j6-7890-klmn-op1234567890",
  "period": "2025",
  "status": "Draft",
  "createdAt": "2025-12-01T09:00:00Z",
  "message": "تم إنشاء التقييم بنجاح"
}
```

### 3.3 تحديث درجات التقييم

```bash
curl -X PUT https://localhost:5001/api/v1/evaluations/ev2-3456-7890-bcde-fg2345678901/scores \
  -H "Authorization: Bearer {managerAccessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "goalsScore": 4.5,
    "behaviorScore": 4.2,
    "initiativesScore": 4.0,
    "managerNotes": "أداء ممتاز، التزام عالي وإنجاز متميز",
    "items": [
      {
        "itemType": "Goal",
        "refId": "g1h2i3j4-k5l6-7890-mnop-qr1234567890",
        "title": "تطوير نظام إدارة الأداء",
        "weight": 30,
        "score": 4.5,
        "notes": "تم إنجاز الهدف بتميز وفي الوقت المحدد"
      },
      {
        "itemType": "Competency",
        "refId": null,
        "title": "القيادة",
        "weight": 20,
        "score": 4.2,
        "notes": "أظهر مهارات قيادية جيدة"
      },
      {
        "itemType": "Initiative",
        "refId": null,
        "title": "تحسين عمليات CI/CD",
        "weight": 10,
        "score": 4.0,
        "notes": "مبادرة ممتازة لتحسين سير العمل"
      }
    ]
  }'
```

**Response (200 OK):**
```json
{
  "evaluationId": "ev2-3456-7890-bcde-fg2345678901",
  "goalsScore": 4.5,
  "behaviorScore": 4.2,
  "initiativesScore": 4.0,
  "itemsCount": 3,
  "updatedAt": "2025-12-10T10:30:00Z",
  "message": "تم تحديث درجات التقييم"
}
```

### 3.4 إنهاء التقييم (حساب النتيجة النهائية)

```bash
curl -X POST https://localhost:5001/api/v1/evaluations/ev2-3456-7890-bcde-fg2345678901/finalize \
  -H "Authorization: Bearer {managerAccessToken}"
```

**Response (200 OK):**
```json
{
  "evaluationId": "ev2-3456-7890-bcde-fg2345678901",
  "finalScore": 4.34,
  "finalRating": "AboveExpected",
  "finalRatingAr": "فوق المتوقع",
  "calculation": {
    "goalsScore": 4.5,
    "goalsWeight": 0.6,
    "goalsContribution": 2.7,
    "behaviorScore": 4.2,
    "behaviorWeight": 0.3,
    "behaviorContribution": 1.26,
    "initiativesScore": 4.0,
    "initiativesWeight": 0.1,
    "initiativesContribution": 0.4,
    "trainingImpact": 0.15,
    "total": 4.51,
    "cappedAt": 5.0,
    "finalScore": 4.51
  },
  "status": "Submitted",
  "message": "تم احتساب النتيجة النهائية. في انتظار اعتماد الموارد البشرية."
}
```

---

## 4. Objections Examples

### 4.1 تقديم اعتراض

```bash
curl -X POST https://localhost:5001/api/v1/objections \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "evaluationId": "ev1-2345-6789-abcd-ef1234567890",
    "reason": "عدم موافقة على الدرجة النهائية",
    "details": "أعتقد أن التقييم لم يعكس الجهد الكبير المبذول في مشروع X والإنجازات التي تحققت. أرفق المستندات الداعمة.",
    "attachmentUrl": "https://storage.gov.sa/documents/objection-evidence-123.pdf"
  }'
```

**Response (201 Created):**
```json
{
  "objectionId": "obj1-2345-6789-mnop-qr1234567890",
  "evaluationId": "ev1-2345-6789-abcd-ef1234567890",
  "status": "Open",
  "createdAt": "2025-12-21T09:00:00Z",
  "slaDeadline": "2025-12-26T09:00:00Z",
  "message": "تم تقديم الاعتراض بنجاح. سيتم مراجعته خلال 5 أيام عمل."
}
```

### 4.2 البت في اعتراض (HR)

```bash
curl -X POST https://localhost:5001/api/v1/objections/obj1-2345-6789-mnop-qr1234567890/decide \
  -H "Authorization: Bearer {hrAccessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "decision": "Accepted",
    "decisionNotes": "بعد مراجعة الاعتراض والمستندات المرفقة، تم قبول الاعتراض وتعديل الدرجة النهائية.",
    "newFinalScore": 3.8
  }'
```

**Response (200 OK):**
```json
{
  "objectionId": "obj1-2345-6789-mnop-qr1234567890",
  "decision": "Accepted",
  "oldFinalScore": 3.5,
  "newFinalScore": 3.8,
  "decidedAt": "2025-12-23T11:00:00Z",
  "decidedBy": {
    "userId": "hr1-2345-6789-hijk-lm1234567890",
    "fullNameAr": "سارة أحمد"
  },
  "message": "تم قبول الاعتراض وتعديل الدرجة النهائية"
}
```

---

## 5. PIPs Examples

### 5.1 الحصول على خطط التحسين الخاصة بي

```bash
curl -X GET "https://localhost:5001/api/v1/pips/my?status=Open" \
  -H "Authorization: Bearer {accessToken}"
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "pipId": "pip1-2345-6789-stuv-wx1234567890",
      "employeeId": "e1f2g3h4-i5j6-7890-klmn-op1234567890",
      "evaluationId": "ev1-2345-6789-abcd-ef1234567890",
      "targetedSkills": ["إدارة الوقت", "حل المشكلات"],
      "plan": {
        "objectives": ["تحسين مهارات إدارة الوقت بنسبة 30%"],
        "actions": [
          "حضور دورة إدارة الوقت",
          "تطبيق تقنية Pomodoro",
          "مراجعة أسبوعية مع المدير"
        ],
        "timeline": "3 أشهر",
        "successCriteria": [
          "إكمال 95% من المهام في الوقت المحدد",
          "تقليل التأخير بنسبة 50%"
        ]
      },
      "startDate": "2025-01-01",
      "dueDate": "2025-03-31",
      "status": "Open",
      "progressNotes": null,
      "createdAt": "2025-01-01T08:00:00Z"
    }
  ]
}
```

### 5.2 تحديث تقدم خطة التحسين

```bash
curl -X PATCH https://localhost:5001/api/v1/pips/pip1-2345-6789-stuv-wx1234567890/progress \
  -H "Authorization: Bearer {managerAccessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "progressNotes": "تم إكمال 50% من الخطة:\n- حضر دورة إدارة الوقت وحصل على 85%\n- بدأ بتطبيق تقنية Pomodoro\n- تحسن ملحوظ في الالتزام بالمواعيد",
    "status": "InProgress"
  }'
```

**Response (200 OK):**
```json
{
  "pipId": "pip1-2345-6789-stuv-wx1234567890",
  "status": "InProgress",
  "progressPercent": 50,
  "updatedAt": "2025-02-15T10:00:00Z",
  "message": "تم تحديث تقدم خطة التحسين"
}
```

---

## 6. Reports Examples

### 6.1 تقرير أداء موظف

```bash
curl -X GET "https://localhost:5001/api/v1/reports/employee/e1f2g3h4-i5j6-7890-klmn-op1234567890?period=2025&format=pdf" \
  -H "Authorization: Bearer {accessToken}" \
  --output employee-report-2025.pdf
```

**Response:** PDF File

### 6.2 تقرير أداء الفريق (Manager)

```bash
curl -X GET "https://localhost:5001/api/v1/reports/team?period=2025&format=excel" \
  -H "Authorization: Bearer {managerAccessToken}" \
  --output team-report-2025.xlsx
```

**Response:** Excel File

### 6.3 تقرير المرشحين للترقية (HR)

```bash
curl -X GET "https://localhost:5001/api/v1/reports/promotion-candidates?period=2025&minScore=3.5" \
  -H "Authorization: Bearer {hrAccessToken}"
```

**Response (200 OK):**
```json
{
  "period": "2025",
  "minScore": 3.5,
  "totalCandidates": 45,
  "data": [
    {
      "employeeId": "e1f2g3h4-i5j6-7890-klmn-op1234567890",
      "employeeNumber": "E12345",
      "fullNameAr": "جون دو",
      "department": "تقنية المعلومات",
      "position": "مطور برمجيات",
      "currentGrade": 10,
      "finalScore": 4.5,
      "finalRating": "Excellent",
      "yearsInPosition": 3,
      "consecutiveHighRatings": 2,
      "recommendedGrade": 11,
      "notes": "أداء متميز لعامين متتاليين"
    }
  ]
}
```

---

## 7. Dashboard Examples

### 7.1 لوحة تحكم الموظف

```bash
curl -X GET https://localhost:5001/api/v1/dashboards/employee \
  -H "Authorization: Bearer {accessToken}"
```

**Response (200 OK):**
```json
{
  "employee": {
    "employeeId": "e1f2g3h4-i5j6-7890-klmn-op1234567890",
    "fullNameAr": "جون دو",
    "position": "مطور برمجيات",
    "department": "تقنية المعلومات"
  },
  "currentPeriod": "2025",
  "goals": {
    "total": 4,
    "approved": 4,
    "completed": 1,
    "inProgress": 3,
    "averageProgress": 68
  },
  "latestEvaluation": {
    "evaluationId": "ev1-2345-6789-abcd-ef1234567890",
    "period": "2024",
    "finalScore": 4.3,
    "finalRating": "AboveExpected",
    "status": "Approved"
  },
  "activePIPs": [],
  "trainingResults": {
    "completed": 3,
    "passed": 3,
    "averageScore": 87,
    "impact": 0.15
  },
  "notifications": {
    "unread": 5
  }
}
```

### 7.2 لوحة تحكم المدير

```bash
curl -X GET https://localhost:5001/api/v1/dashboards/manager \
  -H "Authorization: Bearer {managerAccessToken}"
```

**Response (200 OK):**
```json
{
  "manager": {
    "employeeId": "m1n2o3p4-q5r6-7890-stuv-wx1234567890",
    "fullNameAr": "أحمد محمد"
  },
  "team": {
    "totalEmployees": 8,
    "activeEmployees": 8
  },
  "goals": {
    "pendingApproval": 3,
    "approved": 28,
    "totalWeight": 100
  },
  "evaluations": {
    "pending": 2,
    "inProgress": 3,
    "completed": 3
  },
  "objections": {
    "open": 1,
    "underReview": 0
  },
  "pips": {
    "active": 1,
    "dueThisMonth": 0
  },
  "teamPerformance": {
    "averageScore": 3.8,
    "ratingDistribution": {
      "Excellent": 2,
      "AboveExpected": 3,
      "Satisfactory": 2,
      "BelowExpected": 1
    }
  }
}
```

---

## 8. Error Handling Examples

### 8.1 Unauthorized (401)

```bash
curl -X GET https://localhost:5001/api/v1/goals/my \
  -H "Authorization: Bearer invalid-token"
```

**Response (401 Unauthorized):**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "messageAr": "الرمز غير صالح أو منتهي الصلاحية",
    "timestamp": "2025-11-05T10:00:00Z"
  }
}
```

### 8.2 Forbidden (403)

```bash
curl -X POST https://localhost:5001/api/v1/goals/xyz/approve \
  -H "Authorization: Bearer {employeeAccessToken}"
```

**Response (403 Forbidden):**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to approve goals",
    "messageAr": "ليس لديك صلاحية اعتماد الأهداف",
    "requiredPermission": "Goals.Approve",
    "userRoles": ["Employee"],
    "timestamp": "2025-11-05T10:00:00Z"
  }
}
```

### 8.3 Validation Error (400)

```bash
curl -X POST https://localhost:5001/api/v1/goals \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "weight": 150
  }'
```

**Response (400 Bad Request):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "messageAr": "فشل التحقق من البيانات",
    "errors": [
      {
        "field": "title",
        "message": "Title is required",
        "messageAr": "العنوان مطلوب"
      },
      {
        "field": "weight",
        "message": "Weight must be between 0 and 100",
        "messageAr": "الوزن يجب أن يكون بين 0 و 100"
      }
    ],
    "timestamp": "2025-11-05T10:00:00Z"
  }
}
```

### 8.4 Not Found (404)

```bash
curl -X GET https://localhost:5001/api/v1/goals/invalid-uuid \
  -H "Authorization: Bearer {accessToken}"
```

**Response (404 Not Found):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Goal not found",
    "messageAr": "الهدف غير موجود",
    "resourceType": "Goal",
    "resourceId": "invalid-uuid",
    "timestamp": "2025-11-05T10:00:00Z"
  }
}
```

---

## 9. Pagination Examples

### 9.1 طلب صفحة معينة

```bash
curl -X GET "https://localhost:5001/api/v1/admin/users?page=2&limit=20" \
  -H "Authorization: Bearer {adminAccessToken}"
```

**Response (200 OK):**
```json
{
  "data": [/* 20 items */],
  "pagination": {
    "page": 2,
    "limit": 20,
    "totalPages": 12,
    "totalItems": 235,
    "hasNext": true,
    "hasPrev": true,
    "nextPage": 3,
    "prevPage": 1
  },
  "links": {
    "first": "/api/v1/admin/users?page=1&limit=20",
    "prev": "/api/v1/admin/users?page=1&limit=20",
    "next": "/api/v1/admin/users?page=3&limit=20",
    "last": "/api/v1/admin/users?page=12&limit=20"
  }
}
```

---

## 10. Filtering & Searching Examples

### 10.1 البحث والتصفية المتقدمة

```bash
curl -X GET "https://localhost:5001/api/v1/admin/users?search=john&role=Manager&department=IT&isActive=true&sortBy=fullNameAr&sortOrder=asc" \
  -H "Authorization: Bearer {adminAccessToken}"
```

**Query Parameters:**
- `search`: البحث في الاسم أو البريد الإلكتروني
- `role`: تصفية حسب الدور
- `department`: تصفية حسب الإدارة
- `isActive`: تصفية حسب الحالة
- `sortBy`: الترتيب حسب (fullNameAr, createdAt, etc.)
- `sortOrder`: اتجاه الترتيب (asc, desc)

---

## 11. Bulk Operations Examples

### 11.1 اعتماد عدة أهداف دفعة واحدة (Manager)

```bash
curl -X POST https://localhost:5001/api/v1/goals/bulk-approve \
  -H "Authorization: Bearer {managerAccessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "goalIds": [
      "g1h2i3j4-k5l6-7890-mnop-qr1234567890",
      "g2i3j4k5-l6m7-8901-nopq-rs2345678901",
      "g3j4k5l6-m7n8-9012-opqr-st3456789012"
    ],
    "notes": "جميع الأهداف واضحة ومعتمدة"
  }'
```

**Response (200 OK):**
```json
{
  "approved": 3,
  "failed": 0,
  "results": [
    {
      "goalId": "g1h2i3j4-k5l6-7890-mnop-qr1234567890",
      "success": true,
      "message": "تم الاعتماد"
    },
    {
      "goalId": "g2i3j4k5-l6m7-8901-nopq-rs2345678901",
      "success": true,
      "message": "تم الاعتماد"
    },
    {
      "goalId": "g3j4k5l6-m7n8-9012-opqr-st3456789012",
      "success": true,
      "message": "تم الاعتماد"
    }
  ]
}
```

---

## 📚 Additional Resources

### Postman Collection
تحميل: `docs/api/Performance_System_Postman_Collection.json`

### Environment Variables
```json
{
  "baseUrl": "https://localhost:5001/api/v1",
  "accessToken": "your-access-token",
  "refreshToken": "your-refresh-token",
  "userId": "your-user-id",
  "employeeId": "your-employee-id",
  "goalId": "sample-goal-id",
  "evaluationId": "sample-evaluation-id"
}
```

### Rate Limiting
- **الحد الأقصى**: 1000 طلب / ساعة لكل مستخدم
- **Headers:**
  - `X-RateLimit-Limit`: 1000
  - `X-RateLimit-Remaining`: 995
  - `X-RateLimit-Reset`: 1699459200

### API Versioning
- **الإصدار الحالي**: v1
- **URL**: `/api/v1/...`
- **الإصدارات القديمة**: مدعومة لمدة 12 شهر

---

**آخر تحديث**: نوفمبر 2025
**الإصدار**: 1.0
**الحالة**: ✅ جاهز للاستخدام

