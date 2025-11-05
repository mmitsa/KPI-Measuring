# دليل التطوير - نظام قياس الأداء الوظيفي

## 📋 جدول المحتويات

1. [إعداد بيئة التطوير](#1-إعداد-بيئة-التطوير)
2. [بنية المشروع](#2-بنية-المشروع)
3. [معايير الكود](#3-معايير-الكود)
4. [سير العمل على Git](#4-سير-العمل-على-git)
5. [الاختبارات](#5-الاختبارات)
6. [التوثيق](#6-التوثيق)
7. [أفضل الممارسات](#7-أفضل-الممارسات)

---

## 1. إعداد بيئة التطوير

### المتطلبات الأساسية

#### Backend
```bash
- .NET SDK 8.0+
- SQL Server 2019+ أو SQL Server Express
- Visual Studio 2022 أو VS Code
- Postman أو Insomnia (للاختبار)
```

#### Frontend
```bash
- Node.js 18+
- npm أو yarn
- VS Code مع الإضافات الموصى بها:
  - ESLint
  - Prettier
  - TypeScript
  - ES7+ React/Redux Snippets
```

### خطوات التثبيت

#### 1. Clone المشروع
```bash
git clone https://github.com/[username]/KPI-Measuring.git
cd KPI-Measuring
```

#### 2. Backend Setup
```bash
cd backend/src/PerformanceSystem.API

# تحديث Connection String في appsettings.json
# تثبيت الحزم
dotnet restore

# إنشاء قاعدة البيانات
dotnet ef database update

# تشغيل المشروع
dotnet run

# API متاح على: http://localhost:5001
# Swagger UI: http://localhost:5001/swagger
```

#### 3. Frontend Setup
```bash
cd frontend

# تثبيت الحزم
npm install

# تحديث .env.development
VITE_API_URL=http://localhost:5001/api

# تشغيل المشروع
npm run dev

# Frontend متاح على: http://localhost:3000
```

#### 4. حسابات الاختبار
```
Employee:
Username: john.doe
Password: Employee@123

Manager:
Username: jane.smith
Password: Manager@123

HR:
Username: hr.admin
Password: HR@123

Admin:
Username: system.admin
Password: Admin@123

Executive:
Username: exec.user
Password: Executive@123
```

---

## 2. بنية المشروع

### Backend Structure
```
backend/
├── src/
│   ├── PerformanceSystem.Core/           # Domain Models
│   │   ├── Entities/                     # Domain Entities
│   │   ├── Enums/                        # Enumerations
│   │   └── Interfaces/                   # Repository Interfaces
│   │
│   ├── PerformanceSystem.Application/    # Business Logic
│   │   ├── Services/                     # Application Services
│   │   ├── DTOs/                         # Data Transfer Objects
│   │   ├── Mappings/                     # AutoMapper Profiles
│   │   └── Common/                       # Shared Logic
│   │
│   ├── PerformanceSystem.Infrastructure/ # Data Access
│   │   ├── Data/                         # DbContext & Configurations
│   │   ├── Repositories/                 # Repository Implementations
│   │   └── Migrations/                   # EF Migrations
│   │
│   └── PerformanceSystem.API/            # API Layer
│       ├── Controllers/                  # API Controllers
│       ├── Middleware/                   # Custom Middleware
│       └── Program.cs                    # Startup Configuration
│
└── tests/                                # Unit & Integration Tests
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/                       # Reusable Components
│   │   ├── auth/                         # Authentication Components
│   │   ├── layout/                       # Layout Components
│   │   ├── goals/                        # Goals Components
│   │   ├── evaluations/                  # Evaluations Components
│   │   └── manager/                      # Manager Components
│   │
│   ├── pages/                            # Page Components
│   │   ├── auth/                         # Auth Pages
│   │   ├── employee/                     # Employee Pages
│   │   ├── manager/                      # Manager Pages
│   │   ├── hr/                           # HR Pages
│   │   └── admin/                        # Admin Pages
│   │
│   ├── store/                            # Redux Store
│   │   ├── index.ts                      # Store Configuration
│   │   └── slices/                       # Redux Slices
│   │
│   ├── services/                         # API Services
│   │   ├── api.ts                        # Axios Instance
│   │   ├── authService.ts
│   │   ├── goalsService.ts
│   │   └── evaluationsService.ts
│   │
│   ├── theme/                            # MUI Theme
│   │   └── index.ts
│   │
│   ├── i18n/                             # Translations
│   │   ├── config.ts
│   │   ├── ar/                           # Arabic
│   │   └── en/                           # English
│   │
│   └── App.tsx                           # Main App Component
│
└── public/                               # Static Files
```

---

## 3. معايير الكود

### Backend (C#)

#### Naming Conventions
```csharp
// PascalCase للـ Classes, Methods, Properties
public class EmployeeService
{
    public async Task<Employee> GetEmployeeById(string id) { }
    public string FullName { get; set; }
}

// camelCase للـ Parameters, Local Variables
public void UpdateGoal(string goalId, int progressPercent)
{
    var updatedGoal = await _repository.GetById(goalId);
}

// _camelCase للـ Private Fields
private readonly IEmployeeRepository _employeeRepository;

// UPPER_CASE للـ Constants
public const string DEFAULT_CULTURE = "ar-SA";
```

#### Code Style
```csharp
// استخدم async/await لجميع العمليات I/O
public async Task<List<Goal>> GetGoalsAsync(string employeeId)
{
    return await _context.Goals
        .Where(g => g.EmployeeId == employeeId)
        .ToListAsync();
}

// استخدم LINQ بشكل واضح
var activeGoals = goals
    .Where(g => g.Status == GoalStatus.InProgress)
    .OrderBy(g => g.EndDate)
    .ToList();

// استخدم null coalescing
var name = user.FullName ?? "Unknown";

// استخدم Pattern Matching
if (evaluation is { Status: EvaluationStatus.Finalized, FinalScore: < 2.5m })
{
    // Create PIP
}
```

#### Exception Handling
```csharp
public async Task<Goal> CreateGoalAsync(CreateGoalRequest request)
{
    try
    {
        // Validate
        if (string.IsNullOrWhiteSpace(request.Title))
            throw new ArgumentException("Title is required", nameof(request.Title));

        // Business logic
        var goal = new Goal { /* ... */ };
        await _context.Goals.AddAsync(goal);
        await _context.SaveChangesAsync();

        return goal;
    }
    catch (DbUpdateException ex)
    {
        _logger.LogError(ex, "Error creating goal");
        throw new ApplicationException("Failed to create goal", ex);
    }
}
```

### Frontend (TypeScript/React)

#### Naming Conventions
```typescript
// PascalCase للـ Components
export default function EmployeeDashboard() { }

// camelCase للـ Functions, Variables
const fetchGoals = async () => { };
const isLoading = false;

// UPPER_CASE للـ Constants
const API_BASE_URL = 'http://localhost:5001/api';

// kebab-case للـ File Names
employee-dashboard.tsx
create-goal-dialog.tsx
```

#### Component Structure
```typescript
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

interface ComponentProps {
  goalId: string;
  onClose: () => void;
}

export default function GoalDialog({ goalId, onClose }: ComponentProps) {
  // Hooks (في الأعلى دائماً)
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.goals);

  // State
  const [formData, setFormData] = useState({ title: '', weight: 0 });

  // Effects
  useEffect(() => {
    // Load data
  }, [goalId]);

  // Handlers
  const handleSubmit = async () => {
    // Submit logic
  };

  // Render
  return (
    <Dialog open onClose={onClose}>
      {/* JSX */}
    </Dialog>
  );
}
```

#### TypeScript Best Practices
```typescript
// استخدم Interfaces للـ Objects
interface Goal {
  id: string;
  title: string;
  weight: number;
  status: GoalStatus;
}

// استخدم Enums للـ Fixed Values
enum GoalStatus {
  Draft = 'Draft',
  Approved = 'Approved',
  InProgress = 'InProgress',
  Completed = 'Completed',
}

// استخدم Optional Chaining
const employeeName = user?.employee?.nameAr;

// استخدم Nullish Coalescing
const progress = goal.progressPercent ?? 0;

// استخدم Type Guards
if (typeof value === 'string') {
  console.log(value.toUpperCase());
}
```

#### Redux Best Practices
```typescript
// استخدم createSlice من Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunks
export const fetchGoals = createAsyncThunk(
  'goals/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await goalsService.getGoals(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message);
    }
  }
);

// Slice
const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setCurrentGoal: (state, action) => {
      state.currentGoal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      });
  },
});
```

---

## 4. سير العمل على Git

### Branch Strategy

```
main (production)
  │
  ├── develop (integration)
  │     │
  │     ├── feature/TASK-001-create-goal-dialog
  │     ├── feature/TASK-002-edit-goal-dialog
  │     ├── bugfix/BUG-123-fix-login-error
  │     └── hotfix/fix-critical-security-issue
```

### Commit Messages

```bash
# تنسيق الـ Commit
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types
- `feat`: ميزة جديدة
- `fix`: إصلاح bug
- `docs`: تغييرات في التوثيق
- `style`: تنسيق الكود (لا يؤثر على المنطق)
- `refactor`: إعادة هيكلة الكود
- `test`: إضافة اختبارات
- `chore`: مهام صيانة

#### Examples
```bash
feat(goals): add create goal dialog with SMART validation

- Add CreateGoalDialog component
- Implement SMART criteria checklist
- Add form validation
- Connect to API endpoint

Closes #TASK-001

---

fix(auth): resolve login token expiration issue

The JWT token was not being refreshed correctly, causing users
to be logged out unexpectedly.

- Add token refresh mechanism
- Update auth interceptor
- Add unit tests

Fixes #BUG-123

---

docs: update API documentation for evaluations

Add detailed documentation for evaluation endpoints including
request/response examples and error codes.
```

### Workflow

#### 1. إنشاء Branch جديد
```bash
# من develop
git checkout develop
git pull origin develop

# إنشاء feature branch
git checkout -b feature/TASK-001-create-goal-dialog
```

#### 2. التطوير
```bash
# إضافة الملفات
git add .

# Commit
git commit -m "feat(goals): add create goal dialog"

# Push
git push origin feature/TASK-001-create-goal-dialog
```

#### 3. Pull Request
```bash
# على GitHub
1. اذهب إلى repository
2. اضغط "New Pull Request"
3. Base: develop ← Compare: feature/TASK-001-xxx
4. اكتب وصف تفصيلي
5. أضف Screenshots إن وجدت
6. طلب Code Review من زميل
```

#### 4. Code Review
```
Reviewer checklist:
☐ الكود يتبع معايير المشروع
☐ لا توجد أخطاء واضحة
☐ الاختبارات تمر بنجاح
☐ التوثيق محدث
☐ لا تغييرات غير مرتبطة بالمهمة
```

#### 5. Merge
```bash
# بعد الموافقة
Merge feature → develop

# Delete branch
git branch -d feature/TASK-001-xxx
git push origin --delete feature/TASK-001-xxx
```

---

## 5. الاختبارات

### Backend Testing

#### Unit Tests (xUnit)
```csharp
public class GoalServiceTests
{
    private readonly Mock<IGoalRepository> _mockRepo;
    private readonly GoalService _service;

    public GoalServiceTests()
    {
        _mockRepo = new Mock<IGoalRepository>();
        _service = new GoalService(_mockRepo.Object);
    }

    [Fact]
    public async Task CreateGoal_WithValidData_ReturnsGoal()
    {
        // Arrange
        var request = new CreateGoalRequest
        {
            Title = "Test Goal",
            Weight = 20
        };

        // Act
        var result = await _service.CreateGoalAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Goal", result.Title);
        _mockRepo.Verify(r => r.AddAsync(It.IsAny<Goal>()), Times.Once);
    }

    [Fact]
    public async Task CreateGoal_WithInvalidWeight_ThrowsException()
    {
        // Arrange
        var request = new CreateGoalRequest { Weight = 150 };

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => _service.CreateGoalAsync(request)
        );
    }
}
```

#### Integration Tests
```csharp
public class GoalsControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public GoalsControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetGoals_ReturnsSuccessStatusCode()
    {
        // Act
        var response = await _client.GetAsync("/api/goals");

        // Assert
        response.EnsureSuccessStatusCode();
    }
}
```

### Frontend Testing

#### Component Tests (Jest + React Testing Library)
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import CreateGoalDialog from './CreateGoalDialog';

describe('CreateGoalDialog', () => {
  it('renders correctly', () => {
    render(<CreateGoalDialog open={true} onClose={() => {}} />);

    expect(screen.getByText('إنشاء هدف جديد')).toBeInTheDocument();
    expect(screen.getByLabelText('عنوان الهدف')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const onClose = jest.fn();
    render(<CreateGoalDialog open={true} onClose={onClose} />);

    const submitButton = screen.getByText('إنشاء الهدف');
    fireEvent.click(submitButton);

    expect(screen.getByText('عنوان الهدف مطلوب')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });
});
```

#### E2E Tests (Cypress)
```typescript
describe('Goals Management', () => {
  beforeEach(() => {
    cy.login('john.doe', 'Employee@123');
    cy.visit('/employee/goals');
  });

  it('creates a new goal', () => {
    cy.contains('إنشاء هدف جديد').click();

    cy.get('[name="title"]').type('Test Goal');
    cy.get('[name="weight"]').type('20');
    cy.get('[name="type"]').select('Operational');

    cy.contains('إنشاء الهدف').click();

    cy.contains('Test Goal').should('be.visible');
  });
});
```

### Running Tests

```bash
# Backend
cd backend
dotnet test

# Frontend
cd frontend
npm test                 # Unit tests
npm run test:e2e         # E2E tests
npm run test:coverage    # With coverage
```

---

## 6. التوثيق

### Code Documentation

#### Backend (XML Comments)
```csharp
/// <summary>
/// إنشاء هدف جديد للموظف
/// </summary>
/// <param name="request">بيانات الهدف الجديد</param>
/// <returns>الهدف المنشأ</returns>
/// <exception cref="ValidationException">عند فشل التحقق من البيانات</exception>
public async Task<Goal> CreateGoalAsync(CreateGoalRequest request)
{
    // Implementation
}
```

#### Frontend (JSDoc)
```typescript
/**
 * نموذج إنشاء هدف جديد
 *
 * @param props - خصائص الـ Dialog
 * @param props.open - حالة فتح/إغلاق الـ Dialog
 * @param props.onClose - Function عند الإغلاق
 * @param props.employeeId - معرّف الموظف
 *
 * @returns React Component
 */
export default function CreateGoalDialog({
  open,
  onClose,
  employeeId
}: CreateGoalDialogProps) {
  // Implementation
}
```

### API Documentation

جميع الـ APIs موثقة في Swagger:
```
http://localhost:5001/swagger
```

### README Files

كل مجلد رئيسي يجب أن يحتوي على README.md:
```markdown
# Goals Module

## Overview
شرح موجز للوحدة

## Components
- CreateGoalDialog
- EditGoalDialog
- ViewGoalDialog

## Usage
كيفية استخدام الوحدة

## API Endpoints
قائمة الـ APIs المستخدمة
```

---

## 7. أفضل الممارسات

### Performance

#### Backend
```csharp
// استخدم Pagination
public async Task<PagedResult<Goal>> GetGoalsAsync(int page, int pageSize)
{
    var query = _context.Goals.AsQueryable();

    var total = await query.CountAsync();
    var items = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return new PagedResult<Goal>(items, total, page, pageSize);
}

// استخدم Select لتقليل البيانات
var goals = await _context.Goals
    .Select(g => new GoalListDto {
        Id = g.Id,
        Title = g.Title,
        Status = g.Status
    })
    .ToListAsync();

// استخدم Caching للبيانات الثابتة
[ResponseCache(Duration = 3600)]
public async Task<List<Department>> GetDepartmentsAsync()
{
    return await _context.Departments.ToListAsync();
}
```

#### Frontend
```typescript
// استخدم useMemo للقيم الثقيلة
const filteredGoals = useMemo(() => {
  return goals.filter(g => g.status === statusFilter);
}, [goals, statusFilter]);

// استخدم useCallback للـ Functions
const handleSubmit = useCallback(async () => {
  // Submit logic
}, [dependency]);

// استخدم React.lazy للـ Code Splitting
const HRDashboard = React.lazy(() => import('./pages/hr/HRDashboard'));
```

### Security

#### Backend
```csharp
// Input Validation
public class CreateGoalRequest
{
    [Required]
    [StringLength(200, MinimumLength = 5)]
    public string Title { get; set; }

    [Range(1, 100)]
    public int Weight { get; set; }
}

// Authorization
[Authorize(Roles = "Manager,HR,Admin")]
public async Task<IActionResult> ApproveGoal(string id)
{
    // Only authorized roles can approve
}

// Prevent SQL Injection (use parameterized queries)
var goals = await _context.Goals
    .Where(g => g.EmployeeId == employeeId)  // ✅ Parameterized
    .ToListAsync();
```

#### Frontend
```typescript
// Sanitize Input
import DOMPurify from 'dompurify';

const sanitizedInput = DOMPurify.sanitize(userInput);

// Validate on Client & Server
const validateGoal = (goal: Goal): string[] => {
  const errors: string[] = [];

  if (!goal.title) errors.push('Title required');
  if (goal.weight < 1 || goal.weight > 100) {
    errors.push('Weight must be 1-100');
  }

  return errors;
};
```

### Accessibility

```tsx
// استخدم Semantic HTML
<button aria-label="إنشاء هدف جديد">
  <Add />
</button>

// استخدم ARIA attributes
<TextField
  label="عنوان الهدف"
  error={!!errors.title}
  helperText={errors.title}
  aria-describedby="title-error"
  aria-invalid={!!errors.title}
/>

// Keyboard Navigation
<Dialog
  open={open}
  onClose={onClose}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <DialogTitle id="dialog-title">إنشاء هدف</DialogTitle>
  <DialogContent id="dialog-description">
    {/* Content */}
  </DialogContent>
</Dialog>
```

---

## 📚 موارد إضافية

### Documentation
- [ASP.NET Core Docs](https://docs.microsoft.com/aspnet/core)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Material-UI](https://mui.com)
- [Redux Toolkit](https://redux-toolkit.js.org)

### Tools
- [Postman](https://www.postman.com) - API Testing
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms)

---

## 🆘 الحصول على المساعدة

### Issues
إذا واجهت مشكلة:
1. ابحث في [GitHub Issues](https://github.com/[repo]/issues)
2. إذا لم تجد حل، افتح Issue جديد

### Pull Requests
للمساهمة:
1. Fork المشروع
2. أنشئ feature branch
3. اعمل التغييرات
4. افتح Pull Request

### Contact
- Team Lead: [email]
- Backend Lead: [email]
- Frontend Lead: [email]

---

**آخر تحديث**: 2024-11-05
**النسخة**: v1.0
