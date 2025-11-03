# توثيق API | API Specification

## نظام قياس الأداء الوظيفي - Government Performance Management System

**الإصدار**: v1.0
**Base URL**: `https://api.performance.gov.sa/v1`
**البروتوكول**: HTTPS only (TLS 1.3)
**الصيغة**: JSON
**المصادقة**: OAuth2 / Bearer Token

---

## 📋 جدول المحتويات

1. [المصادقة والتفويض](#authentication)
2. [إدارة المستخدمين](#users)
3. [إدارة الأهداف](#goals)
4. [التقييمات](#evaluations)
5. [الاعتراضات](#objections)
6. [خطط التحسين (PIP)](#pip)
7. [خطط التطوير (IDP)](#idp)
8. [التدريب](#training)
9. [التقارير](#reports)
10. [لوحات التحكم](#dashboards)
11. [التكامل](#integrations)
12. [الإشعارات](#notifications)
13. [أكواد الأخطاء](#error-codes)

---

## 🔐 المصادقة والتفويض (Authentication & Authorization) {#authentication}

### 1.1 تسجيل الدخول عبر SSO

```http
POST /auth/sso/login
```

**Request Body:**
```json
{
  "provider": "nafath",  // or "entra", "custom"
  "redirectUrl": "https://app.performance.gov.sa/callback"
}
```

**Response:**
```json
{
  "authUrl": "https://nafath.sa/authorize?...",
  "state": "random-state-string",
  "expiresIn": 300
}
```

---

### 1.2 معالجة Callback من SSO

```http
POST /auth/sso/callback
```

**Request Body:**
```json
{
  "code": "authorization-code",
  "state": "random-state-string"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "userId": "uuid",
    "username": "john.doe",
    "email": "john.doe@gov.sa",
    "roles": ["Employee", "Manager"],
    "permissions": ["Goals.View", "Goals.Create", ...]
  }
}
```

---

### 1.3 تجديد Token

```http
POST /auth/refresh
```

**Headers:**
```
Authorization: Bearer {refreshToken}
```

**Response:**
```json
{
  "accessToken": "new-access-token",
  "expiresIn": 3600
}
```

---

### 1.4 تسجيل الخروج

```http
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

## 👥 إدارة المستخدمين (Users Management) {#users}

### 2.1 الحصول على المستخدم الحالي

```http
GET /users/me
```

**Response:**
```json
{
  "userId": "uuid",
  "employeeId": "uuid",
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
      "employeeId": "uuid",
      "fullNameAr": "أحمد محمد"
    }
  },
  "roles": ["Employee", "Manager"],
  "permissions": ["Goals.View", "Goals.Create", ...],
  "isActive": true,
  "lastLoginAt": "2025-11-03T10:30:00Z"
}
```

---

### 2.2 قائمة المستخدمين (Admin/HR فقط)

```http
GET /users?page=1&limit=50&search=&role=&isActive=true
```

**Query Parameters:**
- `page` (int): رقم الصفحة (default: 1)
- `limit` (int): عدد العناصر (default: 50, max: 100)
- `search` (string): البحث بالاسم أو البريد
- `role` (string): تصفية حسب الدور
- `isActive` (boolean): تصفية حسب الحالة

**Response:**
```json
{
  "data": [
    {
      "userId": "uuid",
      "username": "john.doe",
      "email": "john.doe@gov.sa",
      "fullNameAr": "جون دو",
      "roles": ["Employee"],
      "isActive": true,
      "lastLoginAt": "2025-11-03T10:30:00Z"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "totalPages": 5,
    "totalItems": 230
  }
}
```

---

### 2.3 إنشاء مستخدم جديد (Admin فقط)

```http
POST /users
```

**Request Body:**
```json
{
  "employeeId": "uuid",
  "username": "jane.smith",
  "email": "jane.smith@gov.sa",
  "roles": ["Employee"]
}
```

**Response:**
```json
{
  "userId": "uuid",
  "username": "jane.smith",
  "email": "jane.smith@gov.sa",
  "roles": ["Employee"],
  "isActive": true,
  "createdAt": "2025-11-03T11:00:00Z"
}
```

---

### 2.4 تحديث صلاحيات المستخدم (Admin فقط)

```http
PUT /users/{userId}/roles
```

**Request Body:**
```json
{
  "roles": ["Employee", "Manager"]
}
```

**Response:**
```json
{
  "userId": "uuid",
  "roles": ["Employee", "Manager"],
  "updatedAt": "2025-11-03T11:15:00Z"
}
```

---

## 🎯 إدارة الأهداف (Goals Management) {#goals}

### 3.1 قائمة الأهداف

```http
GET /goals?employeeId={uuid}&status=Approved&period=2025
```

**Query Parameters:**
- `employeeId` (uuid): معرّف الموظف
- `status` (string): Draft, Approved, InProgress, Completed, Cancelled
- `period` (string): السنة أو الفترة
- `type` (string): Strategic, Operational, Development

**Response:**
```json
{
  "data": [
    {
      "goalId": "uuid",
      "employeeId": "uuid",
      "title": "تطوير نظام قياس الأداء",
      "description": "بناء نظام متكامل لقياس الأداء الوظيفي...",
      "type": "Strategic",
      "category": "تقنية المعلومات",
      "weight": 40,
      "targetValue": "100%",
      "measurementUnit": "نسبة الإنجاز",
      "startDate": "2025-01-01",
      "endDate": "2025-12-31",
      "status": "InProgress",
      "progressPercent": 65,
      "createdAt": "2025-01-01T08:00:00Z",
      "createdBy": {
        "userId": "uuid",
        "fullNameAr": "أحمد محمد"
      },
      "approvedAt": "2025-01-05T10:00:00Z",
      "approvedBy": {
        "userId": "uuid",
        "fullNameAr": "سارة عبدالله"
      }
    },
    ...
  ],
  "summary": {
    "totalGoals": 5,
    "totalWeight": 100,
    "avgProgress": 65
  }
}
```

---

### 3.2 إنشاء هدف جديد (Manager/HR)

```http
POST /goals
```

**Request Body:**
```json
{
  "employeeId": "uuid",
  "title": "تحسين جودة الكود البرمجي",
  "description": "تطبيق معايير Clean Code وزيادة تغطية الاختبارات",
  "type": "Operational",
  "category": "الجودة",
  "weight": 20,
  "targetValue": "90%",
  "measurementUnit": "نسبة تغطية الاختبارات",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31"
}
```

**Validation Rules:**
- `title`: مطلوب، 5-300 حرف
- `weight`: مطلوب، 0-100، ومجموع أوزان الموظف يجب ألا يتجاوز 100
- `startDate` < `endDate`

**Response:**
```json
{
  "goalId": "uuid",
  "title": "تحسين جودة الكود البرمجي",
  "status": "Draft",
  "createdAt": "2025-11-03T11:30:00Z",
  "message": "تم إنشاء الهدف بنجاح. يرجى اعتماده من قبل الموظف."
}
```

---

### 3.3 اعتماد الهدف (Employee/Manager)

```http
POST /goals/{goalId}/approve
```

**Request Body:**
```json
{
  "notes": "موافق على الهدف"
}
```

**Response:**
```json
{
  "goalId": "uuid",
  "status": "Approved",
  "approvedAt": "2025-11-03T12:00:00Z",
  "approvedBy": {
    "userId": "uuid",
    "fullNameAr": "جون دو"
  }
}
```

---

### 3.4 تحديث تقدم الهدف

```http
PATCH /goals/{goalId}/progress
```

**Request Body:**
```json
{
  "progressPercent": 75,
  "notes": "تم إنجاز 75% من الهدف"
}
```

**Response:**
```json
{
  "goalId": "uuid",
  "progressPercent": 75,
  "updatedAt": "2025-11-03T12:15:00Z"
}
```

---

### 3.5 حذف هدف (قبل الاعتماد فقط)

```http
DELETE /goals/{goalId}
```

**Response:**
```json
{
  "message": "تم حذف الهدف بنجاح"
}
```

---

## 📊 التقييمات (Evaluations) {#evaluations}

### 4.1 قائمة التقييمات

```http
GET /evaluations?employeeId={uuid}&period=2025&status=Approved
```

**Response:**
```json
{
  "data": [
    {
      "evaluationId": "uuid",
      "employeeId": "uuid",
      "employee": {
        "employeeNumber": "E12345",
        "fullNameAr": "جون دو",
        "department": "تقنية المعلومات"
      },
      "period": "2025",
      "evaluationType": "Annual",
      "goalsScore": 4.2,
      "behaviorScore": 4.0,
      "initiativesScore": 3.8,
      "trainingImpact": 0.15,
      "finalScore": 4.21,
      "finalRating": "AboveExpected",
      "status": "Approved",
      "evaluatedAt": "2025-12-15T14:00:00Z",
      "evaluatedBy": {
        "userId": "uuid",
        "fullNameAr": "أحمد محمد"
      },
      "approvedAt": "2025-12-20T10:00:00Z"
    },
    ...
  ]
}
```

---

### 4.2 إنشاء تقييم جديد (Manager/HR)

```http
POST /evaluations
```

**Request Body:**
```json
{
  "employeeId": "uuid",
  "period": "2025",
  "evaluationType": "Annual",
  "items": [
    {
      "itemType": "Goal",
      "refId": "goal-uuid",
      "title": "تطوير نظام قياس الأداء",
      "weight": 40,
      "score": 4.5,
      "notes": "تم إنجاز الهدف بتميز",
      "evidenceUrl": "https://storage.gov.sa/evidence/123.pdf"
    },
    {
      "itemType": "Competency",
      "refId": "competency-uuid",
      "title": "القيادة",
      "weight": 30,
      "score": 4.0,
      "notes": "أظهر مهارات قيادية جيدة"
    },
    {
      "itemType": "Initiative",
      "title": "اقتراح تحسين عملية CI/CD",
      "weight": 10,
      "score": 3.8,
      "notes": "مبادرة مفيدة تم تطبيقها"
    }
  ],
  "managerNotes": "موظف متميز، يُنصح بترقيته"
}
```

**Response:**
```json
{
  "evaluationId": "uuid",
  "status": "Draft",
  "createdAt": "2025-12-10T10:00:00Z",
  "message": "تم إنشاء التقييم بنجاح. يرجى المراجعة قبل الاعتماد النهائي."
}
```

---

### 4.3 حساب النتيجة النهائية واعتماد التقييم

```http
POST /evaluations/{evaluationId}/finalize
```

**Request Body:**
```json
{
  "managerNotes": "ملاحظات نهائية من المدير"
}
```

**Response:**
```json
{
  "evaluationId": "uuid",
  "goalsScore": 4.2,
  "behaviorScore": 4.0,
  "initiativesScore": 3.8,
  "trainingImpact": 0.15,
  "finalScore": 4.21,
  "finalRating": "AboveExpected",
  "status": "Submitted",
  "evaluatedAt": "2025-12-15T14:00:00Z",
  "pipCreated": false,
  "message": "تم حساب النتيجة النهائية واعتماد التقييم بنجاح"
}
```

**Business Logic:**
```
finalScore = (goalsScore × 0.6) + (behaviorScore × 0.3) + (initiativesScore × 0.1) + trainingImpact

finalRating:
  - Excellent: 4.5 - 5.0
  - AboveExpected: 3.5 - 4.49
  - Satisfactory: 2.5 - 3.49
  - BelowExpected: 1.5 - 2.49
  - Poor: 0.0 - 1.49

Auto PIP Trigger: if finalScore < 2.5
```

---

### 4.4 الحصول على تفاصيل تقييم

```http
GET /evaluations/{evaluationId}
```

**Response:**
```json
{
  "evaluationId": "uuid",
  "employee": { ... },
  "period": "2025",
  "evaluationType": "Annual",

  "items": [
    {
      "itemId": "uuid",
      "itemType": "Goal",
      "refId": "goal-uuid",
      "title": "تطوير نظام قياس الأداء",
      "description": "...",
      "weight": 40,
      "score": 4.5,
      "notes": "...",
      "evidenceUrl": "..."
    },
    ...
  ],

  "goalsScore": 4.2,
  "behaviorScore": 4.0,
  "initiativesScore": 3.8,
  "trainingImpact": 0.15,
  "finalScore": 4.21,
  "finalRating": "AboveExpected",

  "managerNotes": "...",
  "employeeNotes": null,

  "status": "Approved",
  "evaluatedAt": "2025-12-15T14:00:00Z",
  "evaluatedBy": { ... },
  "approvedAt": "2025-12-20T10:00:00Z",
  "approvedBy": { ... }
}
```

---

## ⚠️ الاعتراضات (Objections) {#objections}

### 5.1 قائمة الاعتراضات

```http
GET /objections?employeeId={uuid}&status=Open
```

**Response:**
```json
{
  "data": [
    {
      "objectionId": "uuid",
      "employee": {
        "employeeId": "uuid",
        "fullNameAr": "جون دو",
        "employeeNumber": "E12345"
      },
      "evaluation": {
        "evaluationId": "uuid",
        "period": "2025",
        "finalScore": 3.2,
        "finalRating": "Satisfactory"
      },
      "reason": "عدم توافق التقييم مع الإنجازات",
      "details": "أعتقد أن التقييم لا يعكس الجهود المبذولة...",
      "attachmentUrl": "https://storage.gov.sa/objections/123.pdf",
      "status": "UnderReview",
      "createdAt": "2025-12-22T09:00:00Z",
      "slaDeadline": "2025-12-27T09:00:00Z",
      "daysRemaining": 3
    },
    ...
  ]
}
```

---

### 5.2 تقديم اعتراض (Employee)

```http
POST /objections
```

**Request Body:**
```json
{
  "evaluationId": "uuid",
  "reason": "عدم توافق التقييم مع الإنجازات",
  "details": "أعتقد أن التقييم لا يعكس الجهود المبذولة في المشاريع الرئيسية...",
  "attachmentUrl": "https://storage.gov.sa/objections/evidence.pdf"
}
```

**Validation:**
- يجب تقديم الاعتراض خلال 5 أيام من اعتماد التقييم
- لا يمكن تقديم أكثر من اعتراض واحد لنفس التقييم

**Response:**
```json
{
  "objectionId": "uuid",
  "status": "Open",
  "createdAt": "2025-12-22T09:00:00Z",
  "slaDeadline": "2025-12-27T09:00:00Z",
  "message": "تم تقديم الاعتراض بنجاح. سيتم مراجعته من قبل اللجنة المختصة."
}
```

---

### 5.3 البت في الاعتراض (HR/Committee)

```http
POST /objections/{objectionId}/decide
```

**Request Body:**
```json
{
  "decision": "Accepted",  // Accepted, Rejected, Adjusted
  "decisionNotes": "تم قبول الاعتراض وتعديل التقييم",
  "newFinalScore": 3.8,  // في حالة Adjusted أو Accepted
  "newFinalRating": "AboveExpected"
}
```

**Response:**
```json
{
  "objectionId": "uuid",
  "status": "Accepted",
  "decision": "Accepted",
  "decisionNotes": "...",
  "decidedAt": "2025-12-25T11:00:00Z",
  "decidedBy": {
    "userId": "uuid",
    "fullNameAr": "سارة عبدالله"
  },
  "evaluationUpdated": true,
  "newFinalScore": 3.8,
  "newFinalRating": "AboveExpected"
}
```

---

## 📈 خطط تحسين الأداء (PIP) {#pip}

### 6.1 قائمة خطط التحسين

```http
GET /pip?employeeId={uuid}&status=Open
```

**Response:**
```json
{
  "data": [
    {
      "pipId": "uuid",
      "employee": {
        "employeeId": "uuid",
        "fullNameAr": "أحمد سعيد",
        "employeeNumber": "E67890"
      },
      "evaluation": {
        "evaluationId": "uuid",
        "period": "2025",
        "finalScore": 2.3,
        "finalRating": "BelowExpected"
      },
      "targetedSkills": [
        "إدارة الوقت",
        "التواصل الفعّال",
        "حل المشكلات"
      ],
      "plan": {
        "objectives": [
          "تحسين مهارات إدارة الوقت بنسبة 40%",
          "حضور دورة تدريبية في التواصل الفعّال"
        ],
        "actions": [
          "حضور ورشة عمل في إدارة الوقت",
          "قراءة كتاب 'فن التواصل'",
          "تطبيق تقنيات Pomodoro"
        ],
        "milestones": [
          {
            "title": "إتمام الدورة التدريبية",
            "dueDate": "2026-02-15",
            "status": "Pending"
          }
        ]
      },
      "startDate": "2026-01-01",
      "dueDate": "2026-03-31",
      "status": "Open",
      "createdAt": "2025-12-20T10:00:00Z"
    },
    ...
  ]
}
```

---

### 6.2 إنشاء خطة تحسين (يدوياً - Manager/HR)

```http
POST /pip
```

**Request Body:**
```json
{
  "employeeId": "uuid",
  "evaluationId": "uuid",
  "targetedSkills": ["إدارة الوقت", "التواصل"],
  "plan": {
    "objectives": [...],
    "actions": [...],
    "milestones": [...]
  },
  "startDate": "2026-01-01",
  "dueDate": "2026-03-31"
}
```

**Response:**
```json
{
  "pipId": "uuid",
  "status": "Open",
  "createdAt": "2026-01-01T08:00:00Z"
}
```

---

### 6.3 تحديث تقدم خطة التحسين

```http
PATCH /pip/{pipId}/progress
```

**Request Body:**
```json
{
  "progressNotes": "تم إكمال الدورة التدريبية بنجاح",
  "milestones": [
    {
      "title": "إتمام الدورة التدريبية",
      "status": "Completed",
      "completedAt": "2026-02-10"
    }
  ]
}
```

**Response:**
```json
{
  "pipId": "uuid",
  "progressNotes": "...",
  "updatedAt": "2026-02-10T14:00:00Z"
}
```

---

### 6.4 إغلاق خطة التحسين

```http
POST /pip/{pipId}/close
```

**Request Body:**
```json
{
  "resultNotes": "تم تحسين الأداء بشكل ملحوظ",
  "isSuccessful": true
}
```

**Response:**
```json
{
  "pipId": "uuid",
  "status": "Closed",
  "resultNotes": "...",
  "closedAt": "2026-03-31T10:00:00Z"
}
```

---

## 🎓 التدريب (Training) {#training}

### 7.1 استقبال نتيجة تدريب (من نظام التدريب)

```http
POST /training/results
```

**Request Body:**
```json
{
  "employeeId": "uuid",
  "courseId": "C12345",
  "courseName": "إدارة المشاريع الاحترافية (PMP)",
  "courseCategory": "الإدارة",
  "scorePercent": 88,
  "isPassed": true,
  "completedAt": "2025-11-01"
}
```

**Business Logic:**
```
impact =
  if scorePercent >= 85: +0.15
  if scorePercent < 60: -0.20
  else: 0
```

**Response:**
```json
{
  "trainingResultId": "uuid",
  "impact": 0.15,
  "message": "تم تسجيل نتيجة التدريب بنجاح. سيتم تطبيق الأثر على التقييم القادم.",
  "sentToPerformance": true
}
```

---

### 7.2 قائمة نتائج التدريب للموظف

```http
GET /training/results?employeeId={uuid}&year=2025
```

**Response:**
```json
{
  "data": [
    {
      "trainingResultId": "uuid",
      "courseId": "C12345",
      "courseName": "إدارة المشاريع الاحترافية (PMP)",
      "courseCategory": "الإدارة",
      "scorePercent": 88,
      "isPassed": true,
      "impact": 0.15,
      "completedAt": "2025-11-01",
      "sentToPerformance": true
    },
    ...
  ],
  "summary": {
    "totalCourses": 5,
    "passedCourses": 4,
    "avgScore": 82,
    "totalImpact": 0.45
  }
}
```

---

## 📄 التقارير (Reports) {#reports}

### 8.1 تقرير الأداء الفردي

```http
GET /reports/employee/{employeeId}?period=2025&format=pdf
```

**Query Parameters:**
- `period` (string): الفترة
- `format` (string): pdf, excel, json (default: json)

**Response (JSON):**
```json
{
  "employee": {
    "employeeNumber": "E12345",
    "fullNameAr": "جون دو",
    "department": "تقنية المعلومات",
    "position": "مطور برمجيات",
    "grade": 10
  },
  "period": "2025",
  "evaluation": {
    "finalScore": 4.21,
    "finalRating": "AboveExpected",
    "goalsScore": 4.2,
    "behaviorScore": 4.0,
    "initiativesScore": 3.8,
    "trainingImpact": 0.15
  },
  "goals": [
    {
      "title": "تطوير نظام قياس الأداء",
      "weight": 40,
      "progressPercent": 95,
      "score": 4.5
    },
    ...
  ],
  "trainingHistory": [
    {
      "courseName": "Clean Code Principles",
      "scorePercent": 92,
      "impact": 0.15
    },
    ...
  ],
  "yearComparison": [
    { "year": 2023, "finalScore": 3.8, "finalRating": "AboveExpected" },
    { "year": 2024, "finalScore": 4.0, "finalRating": "AboveExpected" },
    { "year": 2025, "finalScore": 4.21, "finalRating": "AboveExpected" }
  ],
  "recommendations": [
    "يُنصح بترقية الموظف",
    "مرشح لبرنامج القيادات"
  ]
}
```

**Response (PDF):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="performance-report-E12345-2025.pdf"

[PDF Binary Data]
```

---

### 8.2 تقرير أداء الفريق (Manager)

```http
GET /reports/team/{managerId}?period=2025&format=excel
```

**Response (Excel):**
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="team-performance-2025.xlsx"

[Excel Binary Data]
```

---

### 8.3 تقرير المرشحين للترقية (HR)

```http
GET /reports/promotion-candidates?period=2025&minScore=4.0
```

**Response:**
```json
{
  "data": [
    {
      "employeeId": "uuid",
      "employeeNumber": "E12345",
      "fullNameAr": "جون دو",
      "department": "تقنية المعلومات",
      "position": "مطور برمجيات",
      "currentGrade": 10,
      "yearsInPosition": 3,
      "finalScore": 4.5,
      "finalRating": "Excellent",
      "consecutiveExcellent": 2,
      "readinessScore": 95,
      "recommendation": "جاهز للترقية الفورية"
    },
    ...
  ],
  "summary": {
    "totalCandidates": 45,
    "excellentRating": 30,
    "aboveExpectedRating": 15
  }
}
```

---

### 8.4 تقرير الامتثال (HR/Admin)

```http
GET /reports/compliance?period=2025
```

**Response:**
```json
{
  "period": "2025",
  "evaluationCycles": {
    "totalCycles": 1,
    "completedOnTime": 1,
    "delayed": 0,
    "complianceRate": 100
  },
  "objections": {
    "total": 12,
    "resolvedOnTime": 10,
    "delayed": 2,
    "avgResolutionDays": 4.2,
    "slaComplianceRate": 83.3
  },
  "masarIntegration": {
    "totalSent": 450,
    "successfulSent": 448,
    "failed": 2,
    "successRate": 99.6
  },
  "security": {
    "encryptedRecords": 450,
    "encryptionRate": 100,
    "auditLogsRetention": "12 months",
    "lastSecurityAudit": "2025-10-15"
  }
}
```

---

## 📊 لوحات التحكم (Dashboards) {#dashboards}

### 9.1 لوحة الموظف

```http
GET /dashboards/employee
```

**Response:**
```json
{
  "myPerformance": {
    "currentPeriod": "2025",
    "finalScore": 4.21,
    "finalRating": "AboveExpected",
    "rank": "Top 15%"
  },
  "myGoals": {
    "total": 5,
    "approved": 5,
    "inProgress": 4,
    "completed": 1,
    "avgProgress": 65
  },
  "myTraining": {
    "completedCourses": 3,
    "avgScore": 87,
    "totalImpact": 0.30
  },
  "myObjections": {
    "pending": 0,
    "resolved": 1
  },
  "myDevelopmentPlan": {
    "hasActivePlan": true,
    "recommendedCourses": [
      "Advanced Leadership",
      "Strategic Planning"
    ]
  },
  "notifications": {
    "unread": 5
  }
}
```

---

### 9.2 لوحة المدير

```http
GET /dashboards/manager
```

**Response:**
```json
{
  "teamOverview": {
    "totalEmployees": 15,
    "evaluatedEmployees": 12,
    "pendingEvaluations": 3
  },
  "performanceDistribution": {
    "excellent": 3,
    "aboveExpected": 6,
    "satisfactory": 3,
    "belowExpected": 0,
    "poor": 0
  },
  "goalsStatus": {
    "totalGoals": 75,
    "approved": 70,
    "pending": 5,
    "avgProgress": 68
  },
  "objections": {
    "pending": 2,
    "underReview": 1,
    "resolved": 5
  },
  "activePIPs": 0,
  "alerts": [
    {
      "type": "PendingEvaluation",
      "message": "3 موظفين لم يتم تقييمهم بعد",
      "priority": "high"
    }
  ]
}
```

---

### 9.3 لوحة HR

```http
GET /dashboards/hr
```

**Response:**
```json
{
  "organizationOverview": {
    "totalEmployees": 450,
    "evaluatedEmployees": 420,
    "completionRate": 93.3
  },
  "performanceDistribution": {
    "excellent": 90,
    "aboveExpected": 180,
    "satisfactory": 135,
    "belowExpected": 12,
    "poor": 3
  },
  "promotionCandidates": {
    "total": 45,
    "excellentRating": 30,
    "aboveExpectedRating": 15
  },
  "objections": {
    "total": 12,
    "pending": 3,
    "underReview": 4,
    "resolved": 5,
    "avgResolutionDays": 4.2
  },
  "activePIPs": 5,
  "compliance": {
    "evaluationCompletionRate": 93.3,
    "objectionSLACompliance": 83.3,
    "masarIntegrationSuccessRate": 99.6
  }
}
```

---

### 9.4 لوحة الإدارة العليا

```http
GET /dashboards/executive
```

**Response:**
```json
{
  "organizationalPerformance": {
    "avgFinalScore": 3.65,
    "trend": "+0.12 من العام الماضي"
  },
  "topPerformingDepartments": [
    {
      "departmentName": "تقنية المعلومات",
      "avgScore": 4.2,
      "employeeCount": 50
    },
    ...
  ],
  "lowPerformingDepartments": [
    {
      "departmentName": "العمليات",
      "avgScore": 3.1,
      "employeeCount": 30,
      "recommendation": "يحتاج دعم تدريبي"
    }
  ],
  "strategicGoalsAlignment": {
    "aligned": 85,
    "notAligned": 15,
    "alignmentRate": 85
  },
  "talentRetention": {
    "highPerformers": 120,
    "atRisk": 8,
    "retentionActions": 5
  },
  "trainingROI": {
    "totalInvestment": 500000,
    "employeesImproved": 80,
    "avgImprovementScore": 0.15
  }
}
```

---

## 🔗 التكامل (Integrations) {#integrations}

### 10.1 إرسال النتائج إلى مسار (Masar)

```http
POST /integrations/masar/dispatch
```

**Request Body:**
```json
{
  "evaluationIds": ["uuid1", "uuid2", ...],  // أو null لإرسال الكل
  "period": "2025"
}
```

**Response:**
```json
{
  "queued": 450,
  "message": "تم إضافة 450 تقييم إلى قائمة الإرسال",
  "estimatedCompletionTime": "2025-12-31T12:00:00Z"
}
```

---

### 10.2 حالة الإرسال إلى مسار

```http
GET /integrations/masar/status?period=2025
```

**Response:**
```json
{
  "period": "2025",
  "total": 450,
  "sent": 448,
  "pending": 0,
  "failed": 2,
  "successRate": 99.6,
  "failedRecords": [
    {
      "queueId": "uuid",
      "employeeNumber": "E99999",
      "error": "Connection timeout",
      "retryCount": 3,
      "lastAttempt": "2025-12-31T11:45:00Z"
    }
  ]
}
```

---

### 10.3 إعادة محاولة الإرسال الفاشل

```http
POST /integrations/masar/retry/{queueId}
```

**Response:**
```json
{
  "queueId": "uuid",
  "status": "Retrying",
  "message": "جارٍ إعادة المحاولة..."
}
```

---

### 10.4 مزامنة بيانات الموظفين من HRMS

```http
POST /integrations/hrms/sync-employees
```

**Response:**
```json
{
  "totalEmployees": 450,
  "newEmployees": 5,
  "updatedEmployees": 12,
  "inactiveEmployees": 3,
  "syncedAt": "2025-11-03T08:00:00Z"
}
```

---

## 🔔 الإشعارات (Notifications) {#notifications}

### 11.1 قائمة الإشعارات

```http
GET /notifications?isRead=false&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "notificationId": "uuid",
      "type": "GoalApproved",
      "title": "تم اعتماد الهدف",
      "message": "تم اعتماد هدفك 'تطوير نظام قياس الأداء'",
      "entityType": "Goal",
      "entityId": "goal-uuid",
      "isRead": false,
      "createdAt": "2025-11-03T10:00:00Z"
    },
    {
      "notificationId": "uuid",
      "type": "EvaluationSubmitted",
      "title": "تم تقييمك",
      "message": "تم الانتهاء من تقييمك للفترة 2025",
      "entityType": "Evaluation",
      "entityId": "evaluation-uuid",
      "isRead": false,
      "createdAt": "2025-12-15T14:30:00Z"
    },
    ...
  ],
  "unreadCount": 5
}
```

---

### 11.2 تحديد إشعار كمقروء

```http
PATCH /notifications/{notificationId}/mark-read
```

**Response:**
```json
{
  "notificationId": "uuid",
  "isRead": true,
  "readAt": "2025-11-03T12:00:00Z"
}
```

---

### 11.3 تحديد جميع الإشعارات كمقروءة

```http
POST /notifications/mark-all-read
```

**Response:**
```json
{
  "markedRead": 12,
  "message": "تم تحديد 12 إشعار كمقروء"
}
```

---

## ❌ أكواد الأخطاء (Error Codes) {#error-codes}

جميع الأخطاء تُرجع بصيغة RFC7807 Problem+JSON:

```json
{
  "type": "https://api.performance.gov.sa/problems/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "الوزن الإجمالي للأهداف يجب ألا يتجاوز 100",
  "instance": "/goals",
  "errors": [
    {
      "field": "weight",
      "message": "الوزن الإجمالي للأهداف يجب ألا يتجاوز 100"
    }
  ]
}
```

### أكواد HTTP الشائعة:

| الكود | المعنى | متى يُستخدم |
|------|--------|-------------|
| 200 | OK | نجحت العملية |
| 201 | Created | تم إنشاء مورد جديد |
| 204 | No Content | نجحت العملية بدون محتوى (مثل الحذف) |
| 400 | Bad Request | بيانات غير صحيحة |
| 401 | Unauthorized | غير مصرّح (Token منتهي/غير صالح) |
| 403 | Forbidden | ليس لديك صلاحية |
| 404 | Not Found | المورد غير موجود |
| 409 | Conflict | تعارض (مثل هدف مكرر) |
| 422 | Unprocessable Entity | فشل في قواعد الأعمال |
| 429 | Too Many Requests | تجاوز حد الطلبات |
| 500 | Internal Server Error | خطأ في الخادم |
| 503 | Service Unavailable | الخدمة غير متاحة مؤقتاً |

---

### أكواد الأخطاء المخصصة:

| الكود | الرسالة | الحل |
|------|---------|-----|
| `GOAL_WEIGHT_EXCEEDED` | الوزن الإجمالي للأهداف تجاوز 100 | تعديل الأوزان |
| `OBJECTION_DEADLINE_PASSED` | انتهت فترة تقديم الاعتراض | لا يمكن تقديم اعتراض |
| `EVALUATION_ALREADY_APPROVED` | التقييم معتمد ولا يمكن تعديله | إنشاء اعتراض |
| `DUPLICATE_GOAL` | يوجد هدف مشابه بالفعل | تعديل الهدف الموجود |
| `INSUFFICIENT_PERMISSIONS` | ليس لديك صلاحية لهذه العملية | تواصل مع المسؤول |
| `MASAR_INTEGRATION_FAILED` | فشل الإرسال إلى مسار | إعادة المحاولة لاحقاً |

---

## 🔒 الأمان (Security)

### Headers المطلوبة:

```http
Authorization: Bearer {accessToken}
Content-Type: application/json
Accept: application/json
X-Request-ID: uuid  // اختياري للتتبع
```

### Rate Limiting:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1699000000
```

### CORS:

```
Access-Control-Allow-Origin: https://app.performance.gov.sa
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400
```

---

## 📚 أمثلة كاملة (Full Examples)

### مثال 1: دورة التقييم الكاملة

```bash
# 1. المدير يُنشئ أهداف للموظف
POST /goals
{
  "employeeId": "emp-uuid",
  "title": "تطوير ميزة X",
  "weight": 40,
  ...
}

# 2. الموظف يعتمد الهدف
POST /goals/{goalId}/approve

# 3. الموظف يُحدّث التقدم طوال السنة
PATCH /goals/{goalId}/progress
{ "progressPercent": 75 }

# 4. المدير يُدخل التقييم النهائي
POST /evaluations
{
  "employeeId": "emp-uuid",
  "items": [...]
}

# 5. المدير يعتمد التقييم
POST /evaluations/{evaluationId}/finalize

# 6. الموظف يُقدّم اعتراض (اختياري)
POST /objections
{
  "evaluationId": "eval-uuid",
  "reason": "..."
}

# 7. HR تبت في الاعتراض
POST /objections/{objectionId}/decide
{
  "decision": "Accepted",
  ...
}

# 8. إرسال النتيجة إلى مسار
POST /integrations/masar/dispatch
```

---

## 📞 الدعم (Support)

- **الوثائق التفاعلية (Swagger)**: https://api.performance.gov.sa/swagger
- **البريد الإلكتروني**: api-support@performance.gov.sa
- **الهاتف**: 920000000

---

**آخر تحديث**: نوفمبر 2025
**الإصدار**: v1.0
**الحالة**: ✅ جاهز للتطبيق
