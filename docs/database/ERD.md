# مخطط قاعدة البيانات | Database Schema (ERD)

## نظام قياس الأداء الوظيفي

---

## 📊 نظرة عامة على الكيانات (Entities Overview)

قاعدة البيانات تحتوي على **14 جدول رئيسي** مُقسمة إلى الفئات التالية:

### 1. إدارة المستخدمين والصلاحيات (Users & Roles)
- Users
- Roles
- UserRoles
- Permissions
- RolePermissions

### 2. بيانات الموظفين والهيكل التنظيمي (Employees & Organization)
- Employees
- Departments
- Positions

### 3. الأهداف والتقييم (Goals & Evaluation)
- Goals
- Evaluations
- EvaluationItems
- Competencies

### 4. الاعتراضات وخطط التحسين (Objections & Improvement)
- Objections
- PIP (Performance Improvement Plans)
- IDP (Individual Development Plans)

### 5. التدريب والتطوير (Training)
- TrainingResults

### 6. التكامل والمراقبة (Integration & Monitoring)
- IntegrationsQueue
- AuditLogs
- Notifications

---

## 🗄️ تعريف الجداول التفصيلي (Detailed Table Definitions)

### 1. Users (المستخدمون)

جدول حسابات المستخدمين في النظام.

```sql
CREATE TABLE Users (
    UserId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmployeeId UNIQUEIDENTIFIER NOT NULL,  -- FK to Employees
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    IsActive BIT NOT NULL DEFAULT 1,
    LastLoginAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy UNIQUEIDENTIFIER NULL,
    UpdatedAt DATETIME2 NULL,
    UpdatedBy UNIQUEIDENTIFIER NULL,

    CONSTRAINT FK_Users_Employee FOREIGN KEY (EmployeeId)
        REFERENCES Employees(EmployeeId) ON DELETE CASCADE,
    CONSTRAINT FK_Users_CreatedBy FOREIGN KEY (CreatedBy)
        REFERENCES Users(UserId),
    CONSTRAINT FK_Users_UpdatedBy FOREIGN KEY (UpdatedBy)
        REFERENCES Users(UserId)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_Users_EmployeeId ON Users(EmployeeId);
CREATE NONCLUSTERED INDEX IX_Users_Username ON Users(Username);
CREATE NONCLUSTERED INDEX IX_Users_Email ON Users(Email);
```

**الحقول:**
- `UserId`: معرّف فريد للمستخدم (GUID)
- `EmployeeId`: ربط بجدول الموظفين
- `Username`: اسم المستخدم (فريد)
- `Email`: البريد الإلكتروني (فريد)
- `IsActive`: حالة الحساب (نشط/معطل)
- `LastLoginAt`: آخر تسجيل دخول
- `CreatedAt`, `UpdatedAt`: تواريخ الإنشاء والتحديث
- `CreatedBy`, `UpdatedBy`: من قام بالإنشاء/التحديث

---

### 2. Roles (الأدوار)

```sql
CREATE TABLE Roles (
    RoleId INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL UNIQUE,  -- Employee, Manager, HR, Admin, Executive
    RoleNameAr NVARCHAR(50) NOT NULL,
    Description NVARCHAR(500) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Seed Data
INSERT INTO Roles (RoleName, RoleNameAr, Description) VALUES
('Employee', 'موظف', 'Regular employee with view-only access to their own data'),
('Manager', 'مدير مباشر', 'Direct manager with evaluation and goal-setting permissions'),
('HR', 'الموارد البشرية', 'HR personnel with full access to all evaluations and reports'),
('Admin', 'مسؤول النظام', 'System administrator with full system access'),
('Executive', 'الإدارة العليا', 'Executive management with strategic reports access');
```

**الأدوار المحددة مسبقاً:**
1. **Employee** (موظف): الوصول للبيانات الشخصية فقط
2. **Manager** (مدير): إدارة الأهداف والتقييم للفريق
3. **HR** (موارد بشرية): إدارة شاملة لدورة الأداء
4. **Admin** (مسؤول نظام): صلاحيات كاملة على النظام
5. **Executive** (إدارة عليا): الوصول للتقارير الاستراتيجية

---

### 3. UserRoles (أدوار المستخدمين - Many-to-Many)

```sql
CREATE TABLE UserRoles (
    UserRoleId INT PRIMARY KEY IDENTITY(1,1),
    UserId UNIQUEIDENTIFIER NOT NULL,
    RoleId INT NOT NULL,
    AssignedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    AssignedBy UNIQUEIDENTIFIER NULL,

    CONSTRAINT FK_UserRoles_User FOREIGN KEY (UserId)
        REFERENCES Users(UserId) ON DELETE CASCADE,
    CONSTRAINT FK_UserRoles_Role FOREIGN KEY (RoleId)
        REFERENCES Roles(RoleId) ON DELETE CASCADE,
    CONSTRAINT FK_UserRoles_AssignedBy FOREIGN KEY (AssignedBy)
        REFERENCES Users(UserId),
    CONSTRAINT UQ_UserRoles UNIQUE (UserId, RoleId)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_UserRoles_UserId ON UserRoles(UserId);
CREATE NONCLUSTERED INDEX IX_UserRoles_RoleId ON UserRoles(RoleId);
```

---

### 4. Permissions (الصلاحيات)

```sql
CREATE TABLE Permissions (
    PermissionId INT PRIMARY KEY IDENTITY(1,1),
    PermissionName NVARCHAR(100) NOT NULL UNIQUE,  -- e.g., 'Goals.Create', 'Evaluation.Update'
    PermissionNameAr NVARCHAR(100) NOT NULL,
    Module NVARCHAR(50) NOT NULL,  -- Goals, Evaluation, Objections, PIP, Reports, etc.
    Description NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Example Permissions
INSERT INTO Permissions (PermissionName, PermissionNameAr, Module, Description) VALUES
('Goals.View', 'عرض الأهداف', 'Goals', 'View goals'),
('Goals.Create', 'إنشاء أهداف', 'Goals', 'Create new goals'),
('Goals.Update', 'تعديل الأهداف', 'Goals', 'Update existing goals'),
('Goals.Delete', 'حذف الأهداف', 'Goals', 'Delete goals'),
('Goals.Approve', 'اعتماد الأهداف', 'Goals', 'Approve goals'),
('Evaluation.View', 'عرض التقييمات', 'Evaluation', 'View evaluations'),
('Evaluation.Create', 'إنشاء تقييم', 'Evaluation', 'Create evaluations'),
('Evaluation.Update', 'تعديل التقييم', 'Evaluation', 'Update evaluations'),
('Evaluation.Finalize', 'اعتماد التقييم النهائي', 'Evaluation', 'Finalize evaluations'),
('Objections.View', 'عرض الاعتراضات', 'Objections', 'View objections'),
('Objections.Create', 'تقديم اعتراض', 'Objections', 'Create objections'),
('Objections.Decide', 'البت في الاعتراض', 'Objections', 'Decide on objections'),
('Reports.View', 'عرض التقارير', 'Reports', 'View reports'),
('Reports.Export', 'تصدير التقارير', 'Reports', 'Export reports'),
('System.ManageUsers', 'إدارة المستخدمين', 'System', 'Manage users'),
('System.ManageRoles', 'إدارة الأدوار', 'System', 'Manage roles');
```

---

### 5. RolePermissions (صلاحيات الأدوار - Many-to-Many)

```sql
CREATE TABLE RolePermissions (
    RolePermissionId INT PRIMARY KEY IDENTITY(1,1),
    RoleId INT NOT NULL,
    PermissionId INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_RolePermissions_Role FOREIGN KEY (RoleId)
        REFERENCES Roles(RoleId) ON DELETE CASCADE,
    CONSTRAINT FK_RolePermissions_Permission FOREIGN KEY (PermissionId)
        REFERENCES Permissions(PermissionId) ON DELETE CASCADE,
    CONSTRAINT UQ_RolePermissions UNIQUE (RoleId, PermissionId)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_RolePermissions_RoleId ON RolePermissions(RoleId);
CREATE NONCLUSTERED INDEX IX_RolePermissions_PermissionId ON RolePermissions(PermissionId);
```

---

### 6. Departments (الإدارات)

```sql
CREATE TABLE Departments (
    DepartmentId INT PRIMARY KEY IDENTITY(1,1),
    DepartmentCode NVARCHAR(20) NOT NULL UNIQUE,
    DepartmentNameAr NVARCHAR(200) NOT NULL,
    DepartmentNameEn NVARCHAR(200) NULL,
    ParentDepartmentId INT NULL,  -- للتسلسل الهرمي
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Departments_Parent FOREIGN KEY (ParentDepartmentId)
        REFERENCES Departments(DepartmentId)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_Departments_ParentId ON Departments(ParentDepartmentId);
CREATE NONCLUSTERED INDEX IX_Departments_Code ON Departments(DepartmentCode);
```

---

### 7. Positions (المسميات الوظيفية)

```sql
CREATE TABLE Positions (
    PositionId INT PRIMARY KEY IDENTITY(1,1),
    PositionCode NVARCHAR(20) NOT NULL UNIQUE,
    PositionNameAr NVARCHAR(200) NOT NULL,
    PositionNameEn NVARCHAR(200) NULL,
    Grade INT NULL,  -- المرتبة (1-15)
    JobFamily NVARCHAR(100) NULL,  -- عائلة الوظيفة
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_Positions_Code ON Positions(PositionCode);
CREATE NONCLUSTERED INDEX IX_Positions_Grade ON Positions(Grade);
```

---

### 8. Employees (الموظفون)

الجدول الأساسي لبيانات الموظفين.

```sql
CREATE TABLE Employees (
    EmployeeId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    NationalId NVARCHAR(10) NOT NULL UNIQUE,  -- رقم الهوية الوطنية
    EmployeeNumber NVARCHAR(20) NOT NULL UNIQUE,  -- الرقم الوظيفي
    FullNameAr NVARCHAR(200) NOT NULL,
    FullNameEn NVARCHAR(200) NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber NVARCHAR(20) NULL,

    DepartmentId INT NOT NULL,
    PositionId INT NOT NULL,
    ManagerId UNIQUEIDENTIFIER NULL,  -- المدير المباشر (self-reference)

    HireDate DATE NOT NULL,
    Grade INT NULL,  -- المرتبة
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active',  -- Active, OnLeave, Terminated

    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NULL,

    CONSTRAINT FK_Employees_Department FOREIGN KEY (DepartmentId)
        REFERENCES Departments(DepartmentId),
    CONSTRAINT FK_Employees_Position FOREIGN KEY (PositionId)
        REFERENCES Positions(PositionId),
    CONSTRAINT FK_Employees_Manager FOREIGN KEY (ManagerId)
        REFERENCES Employees(EmployeeId)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_Employees_NationalId ON Employees(NationalId);
CREATE NONCLUSTERED INDEX IX_Employees_EmployeeNumber ON Employees(EmployeeNumber);
CREATE NONCLUSTERED INDEX IX_Employees_DepartmentId ON Employees(DepartmentId);
CREATE NONCLUSTERED INDEX IX_Employees_ManagerId ON Employees(ManagerId);
CREATE NONCLUSTERED INDEX IX_Employees_Status ON Employees(Status);
```

**الحقول الرئيسية:**
- `NationalId`: رقم الهوية الوطنية (10 أرقام، فريد)
- `EmployeeNumber`: الرقم الوظيفي (فريد)
- `DepartmentId`: الإدارة التابع لها
- `PositionId`: المسمى الوظيفي
- `ManagerId`: المدير المباشر
- `Status`: حالة الموظف (نشط، إجازة، منتهي الخدمة)

---

### 9. Goals (الأهداف)

```sql
CREATE TABLE Goals (
    GoalId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmployeeId UNIQUEIDENTIFIER NOT NULL,

    Title NVARCHAR(300) NOT NULL,
    Description NVARCHAR(2000) NULL,
    Type NVARCHAR(50) NOT NULL,  -- Strategic, Operational, Development
    Category NVARCHAR(100) NULL,  -- تصنيف الهدف

    Weight DECIMAL(5,2) NOT NULL,  -- الوزن النسبي (0-100)
    TargetValue NVARCHAR(100) NULL,  -- القيمة المستهدفة
    MeasurementUnit NVARCHAR(50) NULL,  -- وحدة القياس

    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,

    Status NVARCHAR(20) NOT NULL DEFAULT 'Draft',  -- Draft, Approved, InProgress, Completed, Cancelled
    ProgressPercent DECIMAL(5,2) NULL DEFAULT 0,  -- نسبة الإنجاز

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy UNIQUEIDENTIFIER NOT NULL,
    ApprovedAt DATETIME2 NULL,
    ApprovedBy UNIQUEIDENTIFIER NULL,

    CONSTRAINT FK_Goals_Employee FOREIGN KEY (EmployeeId)
        REFERENCES Employees(EmployeeId) ON DELETE CASCADE,
    CONSTRAINT FK_Goals_CreatedBy FOREIGN KEY (CreatedBy)
        REFERENCES Users(UserId),
    CONSTRAINT FK_Goals_ApprovedBy FOREIGN KEY (ApprovedBy)
        REFERENCES Users(UserId),
    CONSTRAINT CHK_Goals_Weight CHECK (Weight BETWEEN 0 AND 100),
    CONSTRAINT CHK_Goals_ProgressPercent CHECK (ProgressPercent BETWEEN 0 AND 100)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_Goals_EmployeeId ON Goals(EmployeeId);
CREATE NONCLUSTERED INDEX IX_Goals_Status ON Goals(Status);
CREATE NONCLUSTERED INDEX IX_Goals_Type ON Goals(Type);
CREATE NONCLUSTERED INDEX IX_Goals_CreatedAt ON Goals(CreatedAt DESC);
```

**خصائص SMART:**
- **S**pecific: Title, Description واضحان
- **M**easurable: TargetValue, MeasurementUnit
- **A**chievable: مراجعة يدوية من المدير
- **R**elevant: Category, Type
- **T**ime-bound: StartDate, EndDate

---

### 10. Competencies (الكفاءات السلوكية)

```sql
CREATE TABLE Competencies (
    CompetencyId INT PRIMARY KEY IDENTITY(1,1),
    CompetencyCode NVARCHAR(20) NOT NULL UNIQUE,
    CompetencyNameAr NVARCHAR(200) NOT NOT,
    CompetencyNameEn NVARCHAR(200) NULL,
    Description NVARCHAR(1000) NULL,
    Category NVARCHAR(100) NULL,  -- Leadership, Communication, Technical, etc.
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Seed Data (أمثلة)
INSERT INTO Competencies (CompetencyCode, CompetencyNameAr, CompetencyNameEn, Category) VALUES
('LEAD-01', 'القيادة', 'Leadership', 'Leadership'),
('COMM-01', 'التواصل الفعّال', 'Effective Communication', 'Communication'),
('TEAM-01', 'العمل الجماعي', 'Teamwork', 'Interpersonal'),
('INIT-01', 'المبادرة', 'Initiative', 'Personal'),
('PROB-01', 'حل المشكلات', 'Problem Solving', 'Technical'),
('TIME-01', 'إدارة الوقت', 'Time Management', 'Personal'),
('CUST-01', 'خدمة المستفيدين', 'Customer Service', 'Service'),
('INNO-01', 'الابتكار والإبداع', 'Innovation', 'Personal');
```

---

### 11. Evaluations (التقييمات)

الجدول الرئيسي للتقييمات السنوية.

```sql
CREATE TABLE Evaluations (
    EvaluationId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmployeeId UNIQUEIDENTIFIER NOT NULL,

    Period NVARCHAR(20) NOT NULL,  -- مثل: '2025', '2025-Q1', '2025-H1'
    EvaluationType NVARCHAR(20) NOT NULL DEFAULT 'Annual',  -- Annual, MidYear, Quarterly

    -- النتائج الفرعية
    GoalsScore DECIMAL(3,2) NULL,  -- نتيجة الأهداف (0-5)
    BehaviorScore DECIMAL(3,2) NULL,  -- نتيجة السلوكيات (0-5)
    InitiativesScore DECIMAL(3,2) NULL,  -- نتيجة المبادرات (0-5)

    -- أثر التدريب
    TrainingImpact DECIMAL(4,2) NULL DEFAULT 0,  -- (+0.15 / 0 / -0.20)

    -- النتيجة النهائية
    FinalScore DECIMAL(3,2) NULL,  -- النتيجة النهائية (0-5)
    FinalRating NVARCHAR(50) NULL,  -- Excellent, AboveExpected, Satisfactory, BelowExpected, Poor

    -- الحالة
    Status NVARCHAR(20) NOT NULL DEFAULT 'Draft',  -- Draft, Submitted, Approved, Objected

    -- الملاحظات
    ManagerNotes NVARCHAR(4000) NULL,
    EmployeeNotes NVARCHAR(4000) NULL,

    -- التواريخ
    EvaluatedAt DATETIME2 NULL,
    EvaluatedBy UNIQUEIDENTIFIER NULL,
    ApprovedAt DATETIME2 NULL,
    ApprovedBy UNIQUEIDENTIFIER NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Evaluations_Employee FOREIGN KEY (EmployeeId)
        REFERENCES Employees(EmployeeId) ON DELETE CASCADE,
    CONSTRAINT FK_Evaluations_EvaluatedBy FOREIGN KEY (EvaluatedBy)
        REFERENCES Users(UserId),
    CONSTRAINT FK_Evaluations_ApprovedBy FOREIGN KEY (ApprovedBy)
        REFERENCES Users(UserId),
    CONSTRAINT CHK_Evaluations_GoalsScore CHECK (GoalsScore BETWEEN 0 AND 5),
    CONSTRAINT CHK_Evaluations_BehaviorScore CHECK (BehaviorScore BETWEEN 0 AND 5),
    CONSTRAINT CHK_Evaluations_InitiativesScore CHECK (InitiativesScore BETWEEN 0 AND 5),
    CONSTRAINT CHK_Evaluations_FinalScore CHECK (FinalScore BETWEEN 0 AND 5)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_Evaluations_EmployeeId ON Evaluations(EmployeeId);
CREATE NONCLUSTERED INDEX IX_Evaluations_Period ON Evaluations(Period);
CREATE NONCLUSTERED INDEX IX_Evaluations_Status ON Evaluations(Status);
CREATE NONCLUSTERED INDEX IX_Evaluations_FinalRating ON Evaluations(FinalRating);
```

**خوارزمية احتساب FinalScore:**
```
FinalScore = (GoalsScore × 0.6) + (BehaviorScore × 0.3) + (InitiativesScore × 0.1) + TrainingImpact
```

**التصنيف (FinalRating):**
- `Excellent` (ممتاز): 4.5 - 5.0
- `AboveExpected` (فوق المتوقع): 3.5 - 4.49
- `Satisfactory` (مرضي): 2.5 - 3.49
- `BelowExpected` (أقل من المتوقع): 1.5 - 2.49
- `Poor` (ضعيف): 0.0 - 1.49

---

### 12. EvaluationItems (عناصر التقييم)

تفاصيل التقييم لكل هدف أو كفاءة أو مبادرة.

```sql
CREATE TABLE EvaluationItems (
    ItemId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EvaluationId UNIQUEIDENTIFIER NOT NULL,

    ItemType NVARCHAR(20) NOT NULL,  -- Goal, Competency, Initiative
    RefId UNIQUEIDENTIFIER NULL,  -- GoalId أو CompetencyId (إن وجد)

    Title NVARCHAR(300) NOT NULL,
    Description NVARCHAR(2000) NULL,
    Weight DECIMAL(5,2) NULL,  -- الوزن النسبي ضمن النوع

    Score DECIMAL(3,2) NOT NULL,  -- النتيجة (0-5)
    Notes NVARCHAR(2000) NULL,
    EvidenceUrl NVARCHAR(500) NULL,  -- رابط الدليل/المرفق

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_EvaluationItems_Evaluation FOREIGN KEY (EvaluationId)
        REFERENCES Evaluations(EvaluationId) ON DELETE CASCADE,
    CONSTRAINT CHK_EvaluationItems_Score CHECK (Score BETWEEN 0 AND 5),
    CONSTRAINT CHK_EvaluationItems_Weight CHECK (Weight BETWEEN 0 AND 100)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_EvaluationItems_EvaluationId ON EvaluationItems(EvaluationId);
CREATE NONCLUSTERED INDEX IX_EvaluationItems_ItemType ON EvaluationItems(ItemType);
```

---

### 13. Objections (الاعتراضات)

```sql
CREATE TABLE Objections (
    ObjectionId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmployeeId UNIQUEIDENTIFIER NOT NULL,
    EvaluationId UNIQUEIDENTIFIER NOT NULL,

    Reason NVARCHAR(500) NOT NULL,  -- سبب الاعتراض
    Details NVARCHAR(4000) NULL,  -- التفاصيل
    AttachmentUrl NVARCHAR(500) NULL,  -- المرفقات

    Status NVARCHAR(20) NOT NULL DEFAULT 'Open',  -- Open, UnderReview, Accepted, Rejected, Adjusted

    DecisionNotes NVARCHAR(4000) NULL,  -- ملاحظات القرار
    DecidedBy UNIQUEIDENTIFIER NULL,
    DecidedAt DATETIME2 NULL,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Objections_Employee FOREIGN KEY (EmployeeId)
        REFERENCES Employees(EmployeeId) ON DELETE CASCADE,
    CONSTRAINT FK_Objections_Evaluation FOREIGN KEY (EvaluationId)
        REFERENCES Evaluations(EvaluationId) ON DELETE CASCADE,
    CONSTRAINT FK_Objections_DecidedBy FOREIGN KEY (DecidedBy)
        REFERENCES Users(UserId)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_Objections_EmployeeId ON Objections(EmployeeId);
CREATE NONCLUSTERED INDEX IX_Objections_EvaluationId ON Objections(EvaluationId);
CREATE NONCLUSTERED INDEX IX_Objections_Status ON Objections(Status);
CREATE NONCLUSTERED INDEX IX_Objections_CreatedAt ON Objections(CreatedAt DESC);
```

**SLA**: يجب معالجة الاعتراض خلال ≤ 5 أيام عمل.

---

### 14. PIP (خطط تحسين الأداء)

```sql
CREATE TABLE PIP (
    PipId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmployeeId UNIQUEIDENTIFIER NOT NULL,
    EvaluationId UNIQUEIDENTIFIER NULL,  -- التقييم المرتبط

    TargetedSkills NVARCHAR(MAX) NULL,  -- JSON: مهارات مستهدفة للتحسين
    PlanJson NVARCHAR(MAX) NULL,  -- JSON: تفاصيل الخطة

    StartDate DATE NOT NULL,
    DueDate DATE NOT NULL,

    Status NVARCHAR(20) NOT NULL DEFAULT 'Open',  -- Open, InProgress, Closed, Extended
    ProgressNotes NVARCHAR(4000) NULL,
    ResultNotes NVARCHAR(4000) NULL,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy UNIQUEIDENTIFIER NOT NULL,
    ClosedAt DATETIME2 NULL,
    ClosedBy UNIQUEIDENTIFIER NULL,

    CONSTRAINT FK_PIP_Employee FOREIGN KEY (EmployeeId)
        REFERENCES Employees(EmployeeId) ON DELETE CASCADE,
    CONSTRAINT FK_PIP_Evaluation FOREIGN KEY (EvaluationId)
        REFERENCES Evaluations(EvaluationId),
    CONSTRAINT FK_PIP_CreatedBy FOREIGN KEY (CreatedBy)
        REFERENCES Users(UserId),
    CONSTRAINT FK_PIP_ClosedBy FOREIGN KEY (ClosedBy)
        REFERENCES Users(UserId)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_PIP_EmployeeId ON PIP(EmployeeId);
CREATE NONCLUSTERED INDEX IX_PIP_Status ON PIP(Status);
CREATE NONCLUSTERED INDEX IX_PIP_DueDate ON PIP(DueDate);
```

**قاعدة تلقائية:** يُفتح PIP تلقائيًا عند حصول الموظف على تقييم نهائي < 2.5.

---

### 15. IDP (خطط التطوير الفردية)

```sql
CREATE TABLE IDP (
    IdpId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmployeeId UNIQUEIDENTIFIER NOT NULL,

    SkillsToImprove NVARCHAR(MAX) NULL,  -- JSON: مهارات للتطوير
    RecommendedCourses NVARCHAR(MAX) NULL,  -- JSON: دورات مقترحة
    DevelopmentGoals NVARCHAR(MAX) NULL,  -- JSON: أهداف تطويرية

    Status NVARCHAR(20) NOT NULL DEFAULT 'Draft',  -- Draft, Active, Completed

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CreatedBy UNIQUEIDENTIFIER NOT NULL,
    CompletedAt DATETIME2 NULL,

    CONSTRAINT FK_IDP_Employee FOREIGN KEY (EmployeeId)
        REFERENCES Employees(EmployeeId) ON DELETE CASCADE,
    CONSTRAINT FK_IDP_CreatedBy FOREIGN KEY (CreatedBy)
        REFERENCES Users(UserId)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_IDP_EmployeeId ON IDP(EmployeeId);
CREATE NONCLUSTERED INDEX IX_IDP_Status ON IDP(Status);
```

---

### 16. TrainingResults (نتائج التدريب)

```sql
CREATE TABLE TrainingResults (
    TrainingResultId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmployeeId UNIQUEIDENTIFIER NOT NULL,

    CourseId NVARCHAR(50) NULL,  -- معرّف الدورة من نظام التدريب
    CourseName NVARCHAR(300) NOT NULL,
    CourseCategory NVARCHAR(100) NULL,

    ScorePercent DECIMAL(5,2) NOT NULL,  -- النتيجة (0-100)
    IsPassed BIT NOT NULL,  -- هل نجح؟

    Impact DECIMAL(4,2) NULL,  -- الأثر على التقييم (+0.15 / 0 / -0.20)

    CompletedAt DATE NOT NULL,
    SentToPerformance BIT NOT NULL DEFAULT 0,  -- هل أُرسلت للنظام؟
    SentAt DATETIME2 NULL,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_TrainingResults_Employee FOREIGN KEY (EmployeeId)
        REFERENCES Employees(EmployeeId) ON DELETE CASCADE,
    CONSTRAINT CHK_TrainingResults_ScorePercent CHECK (ScorePercent BETWEEN 0 AND 100)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_TrainingResults_EmployeeId ON TrainingResults(EmployeeId);
CREATE NONCLUSTERED INDEX IX_TrainingResults_CompletedAt ON TrainingResults(CompletedAt DESC);
```

**خوارزمية حساب الأثر:**
```sql
Impact = CASE
    WHEN ScorePercent >= 85 THEN 0.15
    WHEN ScorePercent < 60 THEN -0.20
    ELSE 0
END
```

---

### 17. IntegrationsQueue (قائمة انتظار التكامل)

```sql
CREATE TABLE IntegrationsQueue (
    QueueId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    Target NVARCHAR(50) NOT NULL,  -- Masar, HRMS, Training
    EntityType NVARCHAR(50) NOT NULL,  -- Evaluation, Employee, etc.
    EntityId NVARCHAR(100) NOT NULL,

    PayloadJson NVARCHAR(MAX) NOT NULL,  -- البيانات المُرسلة (JSON)

    Status NVARCHAR(20) NOT NULL DEFAULT 'New',  -- New, Retrying, Sent, Failed
    RetryCount INT NOT NULL DEFAULT 0,
    MaxRetries INT NOT NULL DEFAULT 3,

    LastError NVARCHAR(2000) NULL,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    SentAt DATETIME2 NULL,

    CONSTRAINT CHK_IntegrationsQueue_RetryCount CHECK (RetryCount >= 0)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_IntegrationsQueue_Status ON IntegrationsQueue(Status);
CREATE NONCLUSTERED INDEX IX_IntegrationsQueue_Target ON IntegrationsQueue(Target);
CREATE NONCLUSTERED INDEX IX_IntegrationsQueue_CreatedAt ON IntegrationsQueue(CreatedAt DESC);
```

**آلية إعادة المحاولة (Retry Mechanism):**
- عدد المحاولات القصوى: 3
- الفترة الزمنية بين المحاولات: Exponential Backoff (2s, 4s, 8s)

---

### 18. AuditLogs (سجلات المراجعة)

```sql
CREATE TABLE AuditLogs (
    LogId BIGINT PRIMARY KEY IDENTITY(1,1),

    UserId UNIQUEIDENTIFIER NULL,
    Username NVARCHAR(100) NULL,

    Action NVARCHAR(50) NOT NULL,  -- Create, Update, Delete, View, Approve, etc.
    Entity NVARCHAR(50) NOT NULL,  -- Goals, Evaluations, Objections, etc.
    EntityId NVARCHAR(100) NOT NULL,

    OldValue NVARCHAR(MAX) NULL,  -- JSON: القيم القديمة
    NewValue NVARCHAR(MAX) NULL,  -- JSON: القيم الجديدة

    IpAddress NVARCHAR(50) NULL,
    UserAgent NVARCHAR(500) NULL,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_AuditLogs_User FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_AuditLogs_UserId ON AuditLogs(UserId);
CREATE NONCLUSTERED INDEX IX_AuditLogs_Action ON AuditLogs(Action);
CREATE NONCLUSTERED INDEX IX_AuditLogs_Entity ON AuditLogs(Entity);
CREATE NONCLUSTERED INDEX IX_AuditLogs_CreatedAt ON AuditLogs(CreatedAt DESC);
```

**مدة الحفظ:** ≥ 12 شهر (متطلب NCA)

---

### 19. Notifications (الإشعارات)

```sql
CREATE TABLE Notifications (
    NotificationId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),

    UserId UNIQUEIDENTIFIER NOT NULL,

    Type NVARCHAR(50) NOT NULL,  -- GoalApproved, EvaluationSubmitted, ObjectionReceived, etc.
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(1000) NOT NULL,

    EntityType NVARCHAR(50) NULL,  -- Goal, Evaluation, Objection, etc.
    EntityId NVARCHAR(100) NULL,

    IsRead BIT NOT NULL DEFAULT 0,
    ReadAt DATETIME2 NULL,

    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Notifications_User FOREIGN KEY (UserId)
        REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_Notifications_UserId ON Notifications(UserId);
CREATE NONCLUSTERED INDEX IX_Notifications_IsRead ON Notifications(IsRead);
CREATE NONCLUSTERED INDEX IX_Notifications_CreatedAt ON Notifications(CreatedAt DESC);
```

---

## 🔗 مخطط العلاقات (Entity Relationship Diagram)

```
Users ←1:N→ Employees
  ↓ M:N
Roles → RolePermissions → Permissions

Employees ←1:N→ Departments
          ←1:N→ Positions
          ←1:N→ Employees (Self-Reference: Manager)
          ←1:N→ Goals
          ←1:N→ Evaluations
          ←1:N→ Objections
          ←1:N→ PIP
          ←1:N→ IDP
          ←1:N→ TrainingResults

Evaluations ←1:N→ EvaluationItems
            ←1:N→ Objections
            ←1:1→ PIP

Goals → EvaluationItems (RefId)
Competencies → EvaluationItems (RefId)
```

---

## 📈 استعلامات مُحسّنة (Optimized Queries)

### 1. حساب النتيجة النهائية للتقييم

```sql
CREATE OR ALTER PROCEDURE sp_CalculateFinalScore
    @EvaluationId UNIQUEIDENTIFIER
AS
BEGIN
    DECLARE @GoalsScore DECIMAL(3,2);
    DECLARE @BehaviorScore DECIMAL(3,2);
    DECLARE @InitiativesScore DECIMAL(3,2);
    DECLARE @TrainingImpact DECIMAL(4,2);
    DECLARE @FinalScore DECIMAL(3,2);
    DECLARE @FinalRating NVARCHAR(50);

    -- جلب النتائج الفرعية
    SELECT
        @GoalsScore = GoalsScore,
        @BehaviorScore = BehaviorScore,
        @InitiativesScore = InitiativesScore,
        @TrainingImpact = ISNULL(TrainingImpact, 0)
    FROM Evaluations
    WHERE EvaluationId = @EvaluationId;

    -- احتساب النتيجة النهائية
    SET @FinalScore = (@GoalsScore * 0.6) + (@BehaviorScore * 0.3) + (@InitiativesScore * 0.1) + @TrainingImpact;

    -- التأكد من النطاق (0-5)
    IF @FinalScore > 5 SET @FinalScore = 5;
    IF @FinalScore < 0 SET @FinalScore = 0;

    -- تحديد التصنيف
    SET @FinalRating = CASE
        WHEN @FinalScore >= 4.5 THEN 'Excellent'
        WHEN @FinalScore >= 3.5 THEN 'AboveExpected'
        WHEN @FinalScore >= 2.5 THEN 'Satisfactory'
        WHEN @FinalScore >= 1.5 THEN 'BelowExpected'
        ELSE 'Poor'
    END;

    -- تحديث التقييم
    UPDATE Evaluations
    SET FinalScore = @FinalScore,
        FinalRating = @FinalRating
    WHERE EvaluationId = @EvaluationId;

    -- فتح PIP تلقائياً إذا كان الأداء منخفض
    IF @FinalScore < 2.5
    BEGIN
        EXEC sp_CreateAutoPIP @EvaluationId;
    END

    SELECT @FinalScore AS FinalScore, @FinalRating AS FinalRating;
END;
```

---

### 2. إنشاء PIP تلقائي

```sql
CREATE OR ALTER PROCEDURE sp_CreateAutoPIP
    @EvaluationId UNIQUEIDENTIFIER
AS
BEGIN
    DECLARE @EmployeeId UNIQUEIDENTIFIER;
    DECLARE @ExistingPipId UNIQUEIDENTIFIER;

    -- جلب معرّف الموظف
    SELECT @EmployeeId = EmployeeId
    FROM Evaluations
    WHERE EvaluationId = @EvaluationId;

    -- التحقق من عدم وجود PIP مفتوح
    SELECT @ExistingPipId = PipId
    FROM PIP
    WHERE EmployeeId = @EmployeeId
      AND EvaluationId = @EvaluationId
      AND Status IN ('Open', 'InProgress');

    IF @ExistingPipId IS NULL
    BEGIN
        INSERT INTO PIP (EmployeeId, EvaluationId, StartDate, DueDate, Status, CreatedBy)
        VALUES (
            @EmployeeId,
            @EvaluationId,
            GETDATE(),
            DATEADD(MONTH, 3, GETDATE()),  -- 3 أشهر
            'Open',
            SYSTEM_USER
        );
    END
END;
```

---

### 3. جلب لوحة المدير (أداء الفريق)

```sql
CREATE OR ALTER VIEW vw_ManagerDashboard
AS
SELECT
    e.EmployeeId,
    e.FullNameAr AS EmployeeName,
    e.EmployeeNumber,
    p.PositionNameAr AS Position,
    d.DepartmentNameAr AS Department,

    ev.Period,
    ev.FinalScore,
    ev.FinalRating,
    ev.Status AS EvaluationStatus,

    CASE WHEN o.ObjectionId IS NOT NULL THEN 1 ELSE 0 END AS HasObjection,
    CASE WHEN pip.PipId IS NOT NULL THEN 1 ELSE 0 END AS HasActivePIP

FROM Employees e
LEFT JOIN Positions p ON e.PositionId = p.PositionId
LEFT JOIN Departments d ON e.DepartmentId = d.DepartmentId
LEFT JOIN Evaluations ev ON e.EmployeeId = ev.EmployeeId
LEFT JOIN Objections o ON ev.EvaluationId = o.EvaluationId AND o.Status IN ('Open', 'UnderReview')
LEFT JOIN PIP pip ON e.EmployeeId = pip.EmployeeId AND pip.Status IN ('Open', 'InProgress')
WHERE e.IsActive = 1;
```

---

## 🔐 الأمان والتشفير (Security & Encryption)

### حقول حساسة تحتاج للتشفير:
- `Employees.NationalId` → AES-256
- `Employees.Email` → Hashing (optional)
- `Employees.PhoneNumber` → AES-256
- `TrainingResults.ScorePercent` → AES-256 (optional)
- `Evaluations.FinalScore` → AES-256

### مثال: تشفير رقم الهوية

```sql
-- تفعيل Always Encrypted أو Column Encryption
ALTER TABLE Employees
ALTER COLUMN NationalId ADD ENCRYPTED WITH (
    COLUMN_ENCRYPTION_KEY = CEK_Performance,
    ENCRYPTION_TYPE = DETERMINISTIC,
    ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256'
);
```

---

## 📊 فهرسة إضافية للأداء (Performance Indexes)

```sql
-- تحسين استعلامات لوحة HR
CREATE NONCLUSTERED INDEX IX_Evaluations_PeriodRating
ON Evaluations(Period, FinalRating)
INCLUDE (FinalScore, Status);

-- تحسين البحث عن المرشحين للترقية
CREATE NONCLUSTERED INDEX IX_Evaluations_PromotionCandidates
ON Evaluations(FinalRating, FinalScore)
WHERE FinalRating IN ('Excellent', 'AboveExpected');

-- تحسين استعلامات SLA الاعتراضات
CREATE NONCLUSTERED INDEX IX_Objections_SLA
ON Objections(Status, CreatedAt)
WHERE Status IN ('Open', 'UnderReview');
```

---

## 🧹 سياسات الصيانة (Maintenance Policies)

### 1. أرشفة سجلات المراجعة القديمة

```sql
-- أرشفة Logs أقدم من سنة
CREATE PROCEDURE sp_ArchiveOldAuditLogs
AS
BEGIN
    INSERT INTO AuditLogs_Archive
    SELECT * FROM AuditLogs
    WHERE CreatedAt < DATEADD(YEAR, -1, GETDATE());

    DELETE FROM AuditLogs
    WHERE CreatedAt < DATEADD(YEAR, -1, GETDATE());
END;
```

### 2. تنظيف الإشعارات المقروءة القديمة

```sql
-- حذف الإشعارات المقروءة الأقدم من 6 أشهر
DELETE FROM Notifications
WHERE IsRead = 1
  AND ReadAt < DATEADD(MONTH, -6, GETDATE());
```

---

## 📦 النسخ الاحتياطي (Backup Strategy)

- **يومي**: Full Backup (3 AM)
- **كل 4 ساعات**: Differential Backup
- **كل ساعة**: Transaction Log Backup
- **الاحتفاظ**: 30 يوم على الأقل
- **التشفير**: AES-256 للنسخ الاحتياطية
- **التخزين**: موقع خارجي (Off-site) + سحابي (Cloud)

---

## ✅ Checklist للتنفيذ

- [ ] إنشاء Database وتحديد Collation (Arabic_CI_AS)
- [ ] تطبيق جميع الجداول والفهارس
- [ ] تطبيق Constraints والعلاقات
- [ ] Seed البيانات الأولية (Roles, Permissions, Competencies)
- [ ] إنشاء Stored Procedures
- [ ] إنشاء Views
- [ ] تفعيل التشفير للحقول الحساسة
- [ ] إعداد Backup Plan
- [ ] إعداد Monitoring & Alerts
- [ ] اختبارات الأداء (Load Testing)

---

**آخر تحديث**: نوفمبر 2025
**الإصدار**: 1.0
**الحالة**: ✅ جاهز للتطبيق
