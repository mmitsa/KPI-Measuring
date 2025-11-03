# خطة تنفيذ نظام قياس الأداء الوظيفي
## Government Performance Management System - Implementation Plan

---

## 📋 نظرة عامة | Overview

### الهدف الرئيسي
تطوير نظام متكامل لقياس الأداء الوظيفي في الجهات الحكومية السعودية، متوافق مع لائحة وزارة الموارد البشرية والتنمية الاجتماعية، ومتكامل مع منصة "مسار" الوزارية.

### المدة الزمنية
- **MVP**: 8 أسابيع (2 شهر)
- **النظام الكامل**: 12-16 أسبوع (3-4 أشهر)

### الجهة المستفيدة
الجهات الحكومية في المملكة العربية السعودية

---

## 🏗️ البنية التقنية المقترحة | Technology Stack

### Frontend (الواجهة الأمامية)
- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit / Zustand
- **UI Library**: Material-UI (MUI) أو Ant Design (دعم RTL كامل)
- **Charts**: Chart.js / Recharts
- **Forms**: React Hook Form + Yup/Zod
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **i18n**: react-i18next (عربي/إنجليزي)

### Backend (الواجهة الخلفية)
- **Primary Option**: ASP.NET Core 8.0 (C#)
  - Web API
  - Entity Framework Core
  - LINQ
  - AutoMapper
- **Alternative Option**: Node.js (Express/NestJS) with TypeScript

### Database (قاعدة البيانات)
- **Primary**: SQL Server 2019+
- **Alternative**: PostgreSQL 15+
- **ORM**: Entity Framework Core / TypeORM
- **Migrations**: EF Migrations / Sequelize

### Authentication & Authorization
- **SSO**: OAuth2 / SAML 2.0
- **Identity Provider**: Microsoft Entra ID (Azure AD) / Custom IAM
- **نفاذ الوطني**: National Authentication Platform Integration
- **MFA**: Multi-Factor Authentication Support
- **RBAC**: Role-Based Access Control

### Integration & APIs
- **API Style**: RESTful APIs
- **Documentation**: Swagger/OpenAPI 3.0
- **API Gateway**: Optional (YARP / Ocelot)
- **Message Queue**: RabbitMQ / Azure Service Bus (للتكامل مع مسار)

### Reporting & Analytics
- **BI**: Power BI Embedded
- **PDF Generation**: iTextSharp / PuppeteerSharp
- **Excel Export**: EPPlus / ExcelJS

### Security & Compliance
- **Encryption**: AES-256 (Data at Rest), TLS 1.3 (Data in Transit)
- **Secrets Management**: Azure Key Vault / HashiCorp Vault
- **Compliance**: NCA ECC/DCC Standards
- **Audit Logging**: Serilog / NLog
- **WAF**: Web Application Firewall

### DevOps & Infrastructure
- **Version Control**: Git (GitHub/Azure DevOps)
- **CI/CD**: GitHub Actions / Azure DevOps Pipelines
- **Containerization**: Docker
- **Orchestration**: Kubernetes (Optional for scale)
- **Hosting**: On-Premise / Azure Gov Cloud
- **Monitoring**: Application Insights / ELK Stack

---

## 📦 هيكل المشروع | Project Structure

```
KPI-Measuring/
├── frontend/                      # React Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/           # Reusable Components
│   │   │   ├── common/           # Buttons, Inputs, etc.
│   │   │   ├── layouts/          # Layouts (Dashboard, Auth)
│   │   │   └── forms/            # Form Components
│   │   ├── pages/                # Page Components
│   │   │   ├── auth/             # Login, SSO Callback
│   │   │   ├── employee/         # Employee Dashboard
│   │   │   ├── manager/          # Manager Dashboard
│   │   │   ├── hr/               # HR Dashboard
│   │   │   ├── admin/            # System Admin
│   │   │   └── executive/        # Executive Dashboard
│   │   ├── features/             # Feature-based modules
│   │   │   ├── goals/            # Goals Management
│   │   │   ├── evaluation/       # Evaluation Module
│   │   │   ├── objections/       # Objections Management
│   │   │   ├── pip/              # Performance Improvement Plans
│   │   │   ├── training/         # Training Impact
│   │   │   └── reports/          # Reports Module
│   │   ├── services/             # API Services
│   │   ├── hooks/                # Custom React Hooks
│   │   ├── utils/                # Utilities
│   │   ├── types/                # TypeScript Types
│   │   ├── i18n/                 # Internationalization
│   │   └── styles/               # Global Styles
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                       # ASP.NET Core Backend
│   ├── src/
│   │   ├── PerformanceSystem.API/          # Web API Project
│   │   │   ├── Controllers/
│   │   │   ├── Middleware/
│   │   │   ├── Filters/
│   │   │   └── Program.cs
│   │   ├── PerformanceSystem.Core/         # Domain Models
│   │   │   ├── Entities/
│   │   │   ├── Enums/
│   │   │   ├── Interfaces/
│   │   │   └── DTOs/
│   │   ├── PerformanceSystem.Application/  # Business Logic
│   │   │   ├── Services/
│   │   │   ├── Validators/
│   │   │   ├── Mappings/
│   │   │   └── Algorithms/       # Performance Calculation
│   │   ├── PerformanceSystem.Infrastructure/ # Data Access
│   │   │   ├── Data/
│   │   │   │   ├── Contexts/
│   │   │   │   ├── Repositories/
│   │   │   │   └── Migrations/
│   │   │   ├── Integrations/     # External APIs
│   │   │   │   ├── Masar/
│   │   │   │   ├── HRMS/
│   │   │   │   ├── Training/
│   │   │   │   └── SSO/
│   │   │   └── Services/
│   │   └── PerformanceSystem.Tests/        # Unit & Integration Tests
│   └── PerformanceSystem.sln
│
├── database/                      # Database Scripts
│   ├── migrations/
│   ├── seed-data/
│   └── stored-procedures/
│
├── docs/                          # Documentation
│   ├── api/                       # API Documentation
│   ├── architecture/              # Architecture Diagrams
│   ├── user-guides/               # User Manuals
│   └── deployment/                # Deployment Guides
│
├── infrastructure/                # Infrastructure as Code
│   ├── docker/
│   ├── kubernetes/
│   └── terraform/
│
└── README.md
```

---

## 🎯 المراحل التنفيذية | Implementation Phases

### Phase 1: التحضير والإعداد (أسبوع 1)
**المدة**: 5 أيام عمل

#### المهام:
1. **إعداد بيئة التطوير**
   - [ ] إنشاء Git Repository
   - [ ] إعداد CI/CD Pipeline
   - [ ] إنشاء بيئات Development, UAT, Production
   - [ ] إعداد Docker Containers

2. **إنشاء هيكل المشروع**
   - [ ] تهيئة React Frontend Project
   - [ ] تهيئة ASP.NET Core Backend Project
   - [ ] إعداد Database Projects
   - [ ] تكوين ESLint, Prettier, Code Standards

3. **تصميم قاعدة البيانات**
   - [ ] تحويل ERD إلى Database Schema
   - [ ] إنشاء Migration Scripts
   - [ ] إعداد Seed Data للاختبار
   - [ ] تكوين Backup Strategy

4. **إعداد الأمان**
   - [ ] تكوين SSO/OAuth2
   - [ ] إعداد RBAC System
   - [ ] تكوين Encryption (AES-256)
   - [ ] إعداد Audit Logging

#### المخرجات:
- ✅ بيئة تطوير جاهزة وكاملة
- ✅ قاعدة بيانات مُهيأة بالجداول الأساسية
- ✅ نظام المصادقة والتفويض جاهز
- ✅ CI/CD Pipeline فعّال

---

### Phase 2: الوحدات الأساسية للـ MVP (أسبوع 2-3)
**المدة**: 10 أيام عمل

#### 2.1 نظام إدارة المستخدمين والصلاحيات
**المدة**: 3 أيام

##### Backend Tasks:
- [ ] تطوير User Management API
  - POST /api/users (إنشاء مستخدم)
  - GET /api/users/{id}
  - PUT /api/users/{id}
  - DELETE /api/users/{id}
- [ ] تطوير Role Management API
  - GET /api/roles
  - POST /api/roles
  - PUT /api/roles/{id}
- [ ] تطوير RBAC Middleware
- [ ] تطوير JWT Token Service
- [ ] Unit Tests للـ User Services

##### Frontend Tasks:
- [ ] صفحة Login (SSO Integration)
- [ ] لوحة إدارة المستخدمين (Admin)
- [ ] لوحة إدارة الصلاحيات (Admin)
- [ ] HOC للتحكم بالصلاحيات
- [ ] Auth Context/Store

##### Database:
```sql
-- Tables
- Users
- Roles
- UserRoles (Many-to-Many)
- Permissions
- RolePermissions
- AuditLogs
```

---

#### 2.2 نظام إدارة الأهداف الذكية (SMART Goals)
**المدة**: 4 أيام

##### Backend Tasks:
- [ ] Goals Management API
  - POST /api/goals (إنشاء هدف)
  - GET /api/employees/{id}/goals
  - PUT /api/goals/{id}
  - DELETE /api/goals/{id}
  - POST /api/goals/{id}/approve (اعتماد)
- [ ] SMART Goals Validation Service
- [ ] Goals Notification Service
- [ ] Unit Tests

##### Frontend Tasks:
- [ ] صفحة إدارة الأهداف (Manager)
- [ ] صفحة عرض الأهداف (Employee)
- [ ] نموذج إضافة/تعديل هدف (SMART)
- [ ] مكون الأوزان (Weight Distribution)
- [ ] حالة الأهداف (Draft/Approved/InProgress/Done)

##### Database:
```sql
-- Tables
- Goals
  - GoalId (PK)
  - EmployeeId (FK)
  - Title
  - Description
  - Type (Strategic/Operational)
  - Weight (0-100)
  - StartDate, EndDate
  - Status
  - CreatedBy, ApprovedBy
  - Timestamps
```

##### خوارزمية التحقق من SMART:
```csharp
// S - Specific: يجب أن يكون العنوان والوصف واضحين
// M - Measurable: يجب تحديد معايير القياس
// A - Achievable: مراجعة يدوية من المدير
// R - Relevant: ربط الهدف بأهداف الإدارة
// T - Time-bound: تحديد تاريخ بداية ونهاية واضح
```

---

#### 2.3 نظام التقييم
**المدة**: 3 أيام

##### Backend Tasks:
- [ ] Evaluation Management API
  - POST /api/evaluations (إنشاء تقييم)
  - GET /api/evaluations/{id}
  - PUT /api/evaluations/{id}
  - POST /api/evaluations/{id}/finalize (حساب النتيجة النهائية)
- [ ] **Performance Calculation Algorithm**
  ```csharp
  // الخوارزمية الرسمية:
  // النتيجة النهائية = (الأهداف × 0.6) + (السلوكيات × 0.3) + (المبادرات × 0.1) ± أثر التدريب

  FinalScore = (GoalsScore * 0.6) + (BehaviorScore * 0.3) + (InitiativesScore * 0.1) + TrainingImpact

  // التصنيف:
  // 4.5 - 5.0 → ممتاز (Excellent)
  // 3.5 - 4.49 → فوق المتوقع (Above Expected)
  // 2.5 - 3.49 → مرضي (Satisfactory)
  // 1.5 - 2.49 → أقل من المتوقع (Below Expected)
  // 0.0 - 1.49 → ضعيف (Poor)
  ```
- [ ] Outliers Detection Service (كشف التقييمات المتطرفة)
- [ ] Evaluation Notification Service
- [ ] Unit Tests

##### Frontend Tasks:
- [ ] صفحة التقييم النهائي (Manager)
- [ ] نموذج تقييم الأهداف
- [ ] نموذج تقييم السلوكيات (Competencies)
- [ ] نموذج تقييم المبادرات
- [ ] عرض النتيجة النهائية والتصنيف (Employee)
- [ ] Progress Indicators

##### Database:
```sql
-- Tables
- Evaluations
  - EvaluationId (PK)
  - EmployeeId (FK)
  - Period (Year/Semester)
  - GoalsScore (0-5)
  - BehaviorScore (0-5)
  - InitiativesScore (0-5)
  - TrainingImpact (+0.15/0/-0.20)
  - FinalScore (0-5)
  - FinalRating (Enum)
  - Status (Draft/Submitted/Approved)
  - ApprovedAt, ApprovedBy
  - Timestamps

- EvaluationItems
  - ItemId (PK)
  - EvaluationId (FK)
  - ItemType (Goal/Behavior/Initiative)
  - RefId (GoalId or CompetencyId)
  - Score (0-5)
  - Notes
  - EvidenceUrl
```

---

### Phase 3: وحدات الاعتراضات والتحسين (أسبوع 4)
**المدة**: 5 أيام عمل

#### 3.1 نظام الاعتراضات
**المدة**: 3 أيام

##### Backend Tasks:
- [ ] Objections Management API
  - POST /api/objections
  - GET /api/objections/{id}
  - GET /api/employees/{id}/objections
  - POST /api/objections/{id}/decide (قرار اللجنة)
- [ ] Objection Workflow Service
- [ ] Notification Service (تنبيه HR واللجنة)
- [ ] SLA Monitoring (5 أيام كحد أقصى)

##### Frontend Tasks:
- [ ] صفحة تقديم الاعتراض (Employee)
- [ ] صفحة إدارة الاعتراضات (HR)
- [ ] نموذج قرار الاعتراض (Accept/Reject/Adjust)
- [ ] Timeline الاعتراض
- [ ] Attachment Upload

##### Database:
```sql
-- Tables
- Objections
  - ObjectionId (PK)
  - EmployeeId (FK)
  - EvaluationId (FK)
  - Reason
  - Details
  - AttachmentUrl
  - Status (Open/UnderReview/Accepted/Rejected/Adjusted)
  - DecisionNotes
  - DecidedBy
  - DecidedAt
  - CreatedAt
```

---

#### 3.2 خطة تحسين الأداء (PIP)
**المدة**: 2 أيام

##### Backend Tasks:
- [ ] PIP Management API
  - POST /api/pip (إنشاء تلقائي عند FinalScore < 2.5)
  - GET /api/pip/{id}
  - PUT /api/pip/{id}
  - POST /api/pip/{id}/close
- [ ] Auto PIP Trigger Service
- [ ] PIP Progress Tracking

##### Frontend Tasks:
- [ ] صفحة عرض خطة التحسين (Employee)
- [ ] صفحة إدارة خطط التحسين (Manager/HR)
- [ ] نموذج متابعة التقدم
- [ ] إشعارات الاستحقاق

##### Database:
```sql
-- Tables
- PIP
  - PipId (PK)
  - EmployeeId (FK)
  - EvaluationId (FK)
  - TargetedSkills (JSON)
  - PlanJson (JSON)
  - StartDate, DueDate
  - Status (Open/InProgress/Closed)
  - ResultNotes
  - Timestamps
```

---

### Phase 4: التدريب والتطوير (أسبوع 5)
**المدة**: 5 أيام عمل

#### 4.1 التكامل مع نظام التدريب
**المدة**: 3 أيام

##### Backend Tasks:
- [ ] Training Integration API
  - POST /api/training-results (استقبال نتائج التدريب)
  - GET /api/employees/{id}/training-history
- [ ] Training Impact Calculation Service
  ```csharp
  // الخوارزمية:
  // إذا النتيجة >= 85% → Impact = +0.15
  // إذا النتيجة < 60% → Impact = -0.20
  // غير ذلك → Impact = 0
  ```
- [ ] Training Recommendations Service (AI/Rule-Based)

##### Frontend Tasks:
- [ ] صفحة سجل التدريب (Employee)
- [ ] صفحة تأثير التدريب على الأداء (HR)
- [ ] تقرير ربط التدريب بالأداء

##### Database:
```sql
-- Tables
- TrainingResults
  - TrainingResultId (PK)
  - EmployeeId (FK)
  - CourseId
  - CourseName
  - ScorePercent (0-100)
  - Impact (+0.15/0/-0.20)
  - CompletedAt
  - SentToPerformance (bool)
  - SentAt
```

---

#### 4.2 خطة التطوير الفردية (IDP)
**المدة**: 2 أيام

##### Backend Tasks:
- [ ] IDP Management API
  - POST /api/idp
  - GET /api/employees/{id}/idp
  - PUT /api/idp/{id}
- [ ] Auto IDP Generation based on Evaluation

##### Frontend Tasks:
- [ ] صفحة خطة التطوير (Employee)
- [ ] صفحة إدارة خطط التطوير (HR)
- [ ] ربط خطة التطوير بالدورات التدريبية

##### Database:
```sql
-- Tables
- IDP
  - IdpId (PK)
  - EmployeeId (FK)
  - SkillsToImprove (JSON)
  - RecommendedCourses (JSON)
  - Status (Draft/Active/Completed)
  - Timestamps
```

---

### Phase 5: التقارير ولوحات التحكم (أسبوع 6)
**المدة**: 5 أيام عمل

#### 5.1 لوحات التحكم (Dashboards)
**المدة**: 3 أيام

##### Backend Tasks:
- [ ] Dashboard Data API
  - GET /api/dashboard/employee/{id}
  - GET /api/dashboard/manager/{id}
  - GET /api/dashboard/hr
  - GET /api/dashboard/executive
- [ ] KPIs Calculation Service
- [ ] Aggregation Queries Optimization

##### Frontend Tasks:
- [ ] **لوحة تحكم الموظف (Employee Dashboard)**
  - مؤشرات أدائي الشخصية
  - أهدافي (نسبة الإنجاز)
  - تقييمي الحالي
  - الاعتراضات
  - خطة التطوير
  - سجل التدريب

- [ ] **لوحة تحكم المدير (Manager Dashboard)**
  - أداء الفريق (إجمالي)
  - توزيع التقييمات (Pie Chart)
  - الموظفون المتأخرون في التقييم
  - الاعتراضات المعلقة
  - خطط التحسين النشطة
  - مقارنة الفريق بالإدارات الأخرى

- [ ] **لوحة تحكم HR**
  - نسب التقييم على مستوى الجهة
  - المرشحون للترقية
  - الدورات المفتوحة/المغلقة
  - الاعتراضات (SLA)
  - خطط التحسين والتطوير
  - تقرير الامتثال (Compliance)

- [ ] **لوحة تحكم الإدارة العليا (Executive Dashboard)**
  - الأداء المؤسسي الإجمالي
  - الإدارات الأعلى/الأدنى أداءً
  - مؤشرات المخاطر الوظيفية
  - ربط الأداء بالأهداف الاستراتيجية
  - توصيات التطوير

---

#### 5.2 التقارير
**المدة**: 2 أيام

##### Backend Tasks:
- [ ] Reports Generation API
  - GET /api/reports/employee/{id} (PDF/Excel)
  - GET /api/reports/team/{managerId}
  - GET /api/reports/organization
  - GET /api/reports/compliance
- [ ] PDF Generation Service (iTextSharp)
- [ ] Excel Export Service (EPPlus)
- [ ] Power BI Integration

##### Frontend Tasks:
- [ ] صفحة التقارير
- [ ] فلاتر التقارير (Period, Department, etc.)
- [ ] معاينة قبل التصدير
- [ ] جدولة التقارير الدورية (Scheduled Reports)

##### أنواع التقارير:
1. **تقرير الأداء الفردي** (Employee Performance Report)
2. **تقرير أداء الفريق** (Team Performance Report)
3. **تقرير الاعتراضات** (Objections Report)
4. **تقرير خطط التحسين** (PIP Report)
5. **تقرير أثر التدريب** (Training Impact Report)
6. **تقرير المرشحين للترقية** (Promotion Candidates Report)
7. **تقرير الامتثال** (Compliance Report)
8. **تقرير الأداء المؤسسي** (Organizational Performance Report)

---

### Phase 6: التكامل مع الأنظمة الخارجية (أسبوع 7)
**المدة**: 5 أيام عمل

#### 6.1 التكامل مع منصة "مسار"
**المدة**: 3 أيام

##### Backend Tasks:
- [ ] Masar Integration Service
  - POST /api/integrations/masar/dispatch
  - GET /api/integrations/masar/status/{queueId}
- [ ] Masar API Client (SOAP/REST)
- [ ] Integration Queue System
- [ ] Retry Mechanism (Exponential Backoff)
- [ ] Error Handling & Logging

##### Frontend Tasks:
- [ ] صفحة حالة التكامل (Admin)
- [ ] سجل الإرسال إلى مسار
- [ ] إعادة المحاولة اليدوية

##### Database:
```sql
-- Tables
- IntegrationsQueue
  - QueueId (PK)
  - Target (Masar/HRMS/Training)
  - PayloadJson
  - Status (New/Retrying/Sent/Failed)
  - RetryCount
  - LastError
  - CreatedAt, SentAt
```

##### خوارزمية الإرسال:
```csharp
// يُرسل فقط بعد:
// 1. اعتماد التقييم النهائي
// 2. انتهاء فترة الاعتراض (5 أيام)
// 3. حل جميع الاعتراضات

// البيانات المُرسلة:
// - EmployeeId (National ID)
// - FinalScore
// - FinalRating
// - Period
// - ApprovedBy
// - ApprovedAt
```

---

#### 6.2 التكامل مع HRMS
**المدة**: 1 يوم

##### Backend Tasks:
- [ ] HRMS Integration Service
  - GET /api/integrations/hrms/sync-employees
  - POST /api/integrations/hrms/webhook (لاستقبال التحديثات)
- [ ] Employee Sync Service (Scheduled Job)
- [ ] Department Sync Service

---

#### 6.3 الدخول الموحد (SSO)
**المدة**: 1 يوم

##### Backend Tasks:
- [ ] OAuth2/SAML Configuration
- [ ] نفاذ الوطني Integration
- [ ] Microsoft Entra ID Integration
- [ ] Token Refresh Mechanism

##### Frontend Tasks:
- [ ] SSO Callback Handler
- [ ] Auto-redirect to SSO
- [ ] Session Management

---

### Phase 7: الاختبار والتأمين (أسبوع 8)
**المدة**: 5 أيام عمل

#### 7.1 الاختبارات
**المدة**: 3 أيام

##### أنواع الاختبارات:
- [ ] **Unit Tests** (Backend Services)
  - Goal Service Tests
  - Evaluation Algorithm Tests
  - Training Impact Tests
  - Outliers Detection Tests
  - PIP Auto-trigger Tests

- [ ] **Integration Tests**
  - API Endpoints Tests
  - Database Operations Tests
  - External APIs Tests (Masar, HRMS)

- [ ] **End-to-End Tests** (Frontend)
  - User Flows (من تسجيل الدخول حتى التقرير)
  - Manager Flow (إنشاء هدف → تقييم → اعتماد)
  - Employee Flow (عرض تقييم → اعتراض)

- [ ] **Performance Tests**
  - Load Testing (200 TPS)
  - Stress Testing
  - API Response Time (≤ 1s)

- [ ] **Security Tests**
  - OWASP Top 10 Scanning
  - Penetration Testing
  - RBAC Testing
  - Data Encryption Validation

##### أدوات الاختبار:
- Backend: xUnit / NUnit, Moq, FluentAssertions
- Frontend: Jest, React Testing Library, Cypress
- Performance: k6, JMeter
- Security: OWASP ZAP, Burp Suite

---

#### 7.2 الأمن السيبراني والامتثال
**المدة**: 2 أيام

##### Security Checklist:
- [ ] تطبيق ضوابط NCA ECC/DCC
- [ ] تشفير البيانات الحساسة (AES-256)
- [ ] تفعيل TLS 1.3
- [ ] Secrets Management (Key Vault)
- [ ] WAF Configuration
- [ ] Rate Limiting
- [ ] SQL Injection Protection
- [ ] XSS Protection
- [ ] CSRF Protection
- [ ] Input Validation & Sanitization
- [ ] Audit Logging (≥ 12 months retention)
- [ ] Backup & Disaster Recovery Plan
- [ ] Incident Response Plan

##### Compliance Checklist:
- [ ] GDPR Compliance (if applicable)
- [ ] SDAIA Data Governance Standards
- [ ] NCA Cybersecurity Controls
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] Data Retention Policy
- [ ] User Consent Management

---

### Phase 8: التدريب والإطلاق (بعد أسبوع 8)
**المدة**: 2-3 أسابيع

#### 8.1 التدريب
**المدة**: 1 أسبوع

##### مواد التدريب:
- [ ] دليل المستخدم (User Manual) - عربي/إنجليزي
- [ ] فيديوهات تعليمية (Video Tutorials)
- [ ] دليل المسؤول (Admin Guide)
- [ ] أسئلة شائعة (FAQ)
- [ ] ورش عمل (Workshops) حسب الدور:
  - موظف
  - مدير
  - HR
  - مسؤول النظام

##### خطة التدريب:
1. **تدريب HR والإدارة العليا** (يوم 1)
2. **تدريب المدراء** (يوم 2-3)
3. **تدريب الموظفين** (يوم 4-5)
4. **تدريب مسؤولي النظام** (يوم 6)

---

#### 8.2 التشغيل التجريبي (Pilot)
**المدة**: 2 أسابيع

##### خطة الـ Pilot:
- [ ] اختيار إدارة واحدة (20-50 موظف)
- [ ] تطبيق دورة تقييم كاملة
- [ ] جمع الملاحظات (Feedback)
- [ ] إصلاح الأخطاء (Bug Fixes)
- [ ] تحسين تجربة المستخدم (UX Improvements)

##### معايير نجاح الـ Pilot:
- نسبة استخدام ≥ 80%
- رضا المستخدمين ≥ 85%
- عدم وجود أخطاء حرجة (Critical Bugs)
- نجاح التكامل مع HRMS
- دقة احتساب التقييم 100%

---

#### 8.3 الإطلاق الرسمي (Production Launch)
**المدة**: 1 أسبوع

##### Deployment Checklist:
- [ ] Backup Database
- [ ] Database Migration (Production)
- [ ] Deploy Backend (Blue-Green Deployment)
- [ ] Deploy Frontend
- [ ] Configure CDN & Caching
- [ ] Configure SSL/TLS
- [ ] Configure WAF
- [ ] Configure Monitoring & Alerts
- [ ] Health Checks
- [ ] Smoke Tests
- [ ] Performance Validation
- [ ] Rollback Plan Ready

##### Launch Day:
- [ ] Deploy to Production (فجرًا / Off-peak hours)
- [ ] Monitor System Health
- [ ] Support Team on Standby
- [ ] Communication to All Users
- [ ] Helpdesk Ready

---

## 📊 مؤشرات النجاح الرئيسية | Key Success Metrics

### مؤشرات الاستخدام (Usage KPIs)
- **نسبة الاستخدام**: ≥ 90% من الموظفين النشطين
- **معدل تسجيل الدخول**: يومي
- **معدل إكمال التقييم**: ≥ 95%

### مؤشرات الجودة (Quality KPIs)
- **دقة احتساب التقييم**: ≥ 99.9%
- **معدل الأخطاء**: < 1% من المعاملات
- **عدد الأعطال السنوية**: ≤ 3

### مؤشرات الأداء (Performance KPIs)
- **زمن تحميل الصفحة**: ≤ 3 ثوانٍ
- **زمن استجابة API**: ≤ 1 ثانية
- **التوفر**: ≥ 99.5%

### مؤشرات رضا المستخدمين (Satisfaction KPIs)
- **رضا المستخدمين**: ≥ 85%
- **Net Promoter Score (NPS)**: ≥ 50
- **معدل الشكاوى**: < 5% من المستخدمين

### مؤشرات الامتثال (Compliance KPIs)
- **معالجة الاعتراضات**: ≤ 5 أيام
- **دقة الربط مع مسار**: ≥ 99%
- **الالتزام بـ NCA**: 100%
- **نسبة البيانات المشفرة**: 100%

---

## 🔄 خطة التحسين المستمر | Continuous Improvement Plan

### المرحلة الثانية (بعد 3-6 أشهر من الإطلاق)
1. **الذكاء الاصطناعي التنبؤي**
   - تحليل احتمالات انخفاض الأداء
   - التوصية بمسارات تدريبية وقائية
   - توقع الاحتياجات التطويرية

2. **نظام المكافآت**
   - ربط المكافآت المالية/الرمزية بالأداء
   - نظام النقاط الرقمية (Gamification)

3. **التوقيع الإلكتروني**
   - اعتماد التقييمات رسميًا إلكترونيًا
   - التوافق مع منصة "توثيق"

4. **التكامل مع الأرشفة الحكومية**
   - حفظ التقييمات في مستودع رقمي
   - التوافق مع SDAIA/NCA DCC

5. **لوحة مؤشرات المخاطر الوظيفية**
   - عرض الإدارات ذات الأداء المنخفض المتكرر
   - إنذارات مبكرة للمخاطر

6. **تطبيق الجوال (Mobile App)**
   - iOS / Android
   - إشعارات Push
   - الوصول السريع للأهداف والتقييمات

---

## 🎯 الأولويات والتبعيات | Priorities & Dependencies

### أولويات عالية (High Priority)
1. ✅ نظام المصادقة والتفويض (RBAC)
2. ✅ إدارة الأهداف (SMART Goals)
3. ✅ نظام التقييم والخوارزمية
4. ✅ لوحات التحكم الأساسية
5. ✅ التكامل مع HRMS

### أولويات متوسطة (Medium Priority)
1. 🔶 نظام الاعتراضات
2. 🔶 خطة تحسين الأداء (PIP)
3. 🔶 التكامل مع التدريب
4. 🔶 التقارير المتقدمة

### أولويات منخفضة (Low Priority)
1. 🔷 التكامل مع "مسار" (بعد التشغيل التجريبي)
2. 🔷 Power BI Embedded
3. 🔷 الذكاء الاصطناعي التنبؤي
4. 🔷 تطبيق الجوال

### التبعيات الحرجة
```
Database Setup → User Management → Goals Management → Evaluation System
                                                         ↓
                                                   Objections System
                                                         ↓
                                                    PIP System
                                                         ↓
                                              Training Integration
                                                         ↓
                                                 Reports & Dashboards
                                                         ↓
                                              External Integrations
```

---

## 📝 ملاحظات مهمة | Important Notes

### الأمان (Security)
- **لا تقم بتخزين كلمات المرور في قاعدة البيانات** - استخدم SSO فقط
- **جميع البيانات الحساسة مشفرة** (Salaries, Performance Scores, Personal Data)
- **Audit Logs لجميع العمليات الحساسة** (Create, Update, Delete, Approve)
- **MFA إلزامي** لمسؤولي النظام والـ HR
- **Session Timeout**: 30 دقيقة من عدم النشاط

### الأداء (Performance)
- **Caching**: استخدم Redis للـ Dashboards Data
- **Database Indexing**: على جميع الـ Foreign Keys والحقول المُستعلم عنها كثيرًا
- **Pagination**: جميع القوائم يجب أن تكون مُقسّمة (50 سجل/صفحة)
- **Lazy Loading**: للصور والمحتوى الثقيل
- **CDN**: لاستضافة الـ Static Assets

### قابلية التوسع (Scalability)
- **تصميم Microservices-Ready** (حتى لو بدأنا بـ Monolith)
- **Database Sharding**: جاهزية للتقسيم حسب الجهة الحكومية
- **Horizontal Scaling**: للـ API Servers
- **Message Queue**: لعمليات التكامل الثقيلة

### الصيانة (Maintainability)
- **Clean Code**: اتباع SOLID Principles
- **Documentation**: Swagger/OpenAPI للـ APIs
- **Code Comments**: باللغة الإنجليزية
- **Git Commit Messages**: واضحة ووصفية
- **Version Control**: Semantic Versioning (v1.0.0)

---

## 📞 فريق العمل المقترح | Proposed Team

### الأدوار المطلوبة:
1. **Project Manager** (1) - إدارة المشروع
2. **Solution Architect** (1) - تصميم البنية التقنية
3. **Backend Developers** (2-3) - ASP.NET Core / Node.js
4. **Frontend Developers** (2) - React + TypeScript
5. **Database Developer** (1) - SQL Server / PostgreSQL
6. **DevOps Engineer** (1) - CI/CD, Deployment, Monitoring
7. **QA Engineer** (1-2) - الاختبارات والجودة
8. **Security Specialist** (1) - الأمن السيبراني والامتثال
9. **UI/UX Designer** (1) - تصميم الواجهات وتجربة المستخدم
10. **Technical Writer** (1) - الوثائق والأدلة

### الإجمالي: 11-14 شخص

---

## 📅 الجدول الزمني الموجز | Summary Timeline

| المرحلة | المدة | البداية | النهاية |
|---------|------|---------|---------|
| Phase 1: الإعداد | 1 أسبوع | أسبوع 1 | أسبوع 1 |
| Phase 2: الوحدات الأساسية | 2 أسبوع | أسبوع 2 | أسبوع 3 |
| Phase 3: الاعتراضات والتحسين | 1 أسبوع | أسبوع 4 | أسبوع 4 |
| Phase 4: التدريب والتطوير | 1 أسبوع | أسبوع 5 | أسبوع 5 |
| Phase 5: التقارير ولوحات التحكم | 1 أسبوع | أسبوع 6 | أسبوع 6 |
| Phase 6: التكامل الخارجي | 1 أسبوع | أسبوع 7 | أسبوع 7 |
| Phase 7: الاختبار والتأمين | 1 أسبوع | أسبوع 8 | أسبوع 8 |
| Phase 8: التدريب والإطلاق | 2-3 أسابيع | أسبوع 9 | أسبوع 10-11 |

**إجمالي المدة للـ MVP**: 8 أسابيع (2 شهر)
**إجمالي المدة مع الإطلاق**: 10-11 أسبوع (2.5-3 أشهر)

---

## ✅ معايير قبول المشروع | Project Acceptance Criteria

### المعايير الوظيفية (Functional):
- ✅ جميع وظائف الـ MVP تعمل بشكل صحيح
- ✅ الخوارزمية تحتسب النتيجة بدقة 100%
- ✅ PIP تُفتح تلقائيًا عند FinalScore < 2.5
- ✅ الاعتراضات تُعالج خلال ≤ 5 أيام
- ✅ التقارير قابلة للتصدير (PDF/Excel)

### المعايير غير الوظيفية (Non-Functional):
- ✅ زمن تحميل الصفحة ≤ 3 ثوانٍ
- ✅ زمن استجابة API ≤ 1 ثانية
- ✅ التوفر ≥ 99.5%
- ✅ جميع البيانات الحساسة مشفرة (AES-256)
- ✅ الامتثال الكامل لضوابط NCA

### المعايير الأمنية (Security):
- ✅ اجتياز اختبارات OWASP Top 10
- ✅ Audit Logs تعمل بشكل صحيح
- ✅ RBAC يمنع الوصول غير المصرح
- ✅ TLS 1.3 فعّال
- ✅ Secrets في Key Vault (وليس في الكود)

### المعايير التوثيقية (Documentation):
- ✅ دليل المستخدم (عربي/إنجليزي)
- ✅ دليل المسؤول
- ✅ وثائق API (Swagger)
- ✅ دليل النشر (Deployment Guide)
- ✅ خطة الاستجابة للحوادث (IR Plan)

---

## 🚀 الخطوات التالية | Next Steps

1. **مراجعة واعتماد الخطة** من أصحاب المصلحة
2. **تشكيل فريق العمل** وتوزيع الأدوار
3. **إعداد بيئة التطوير** والأدوات
4. **البدء في Phase 1** - الإعداد والتحضير
5. **عقد اجتماعات Sprint Planning** أسبوعياً
6. **متابعة التقدم** عبر Daily Standups

---

## 📄 المراجع | References

- [وثيقة متطلبات النظام الأصلية](#)
- [لائحة وزارة الموارد البشرية والتنمية الاجتماعية](#)
- [ضوابط NCA - الهيئة الوطنية للأمن السيبراني](#)
- [معايير SDAIA للبيانات](#)
- [دليل منصة مسار](#)
- [دليل النفاذ الوطني](#)

---

## 📧 جهات الاتصال | Contact

- **مدير المشروع**: [الاسم]
- **المهندس المعماري**: [الاسم]
- **قائد فريق Backend**: [الاسم]
- **قائد فريق Frontend**: [الاسم]
- **مسؤول الأمن السيبراني**: [الاسم]

---

**تاريخ آخر تحديث**: 2025-11-03
**الإصدار**: 1.0
**الحالة**: ✅ جاهز للتنفيذ

---

**ملاحظة**: هذه الخطة قابلة للتعديل حسب الملاحظات والمتغيرات أثناء التنفيذ. يُرجى مراجعة التقدم أسبوعياً وتحديث الخطة عند الحاجة.
