# دليل المساهمة | Contributing Guide

<div dir="rtl">

شكراً لاهتمامك بالمساهمة في نظام قياس الأداء الوظيفي! 🎉

هذا الدليل يوضح كيفية المساهمة في المشروع بطريقة فعّالة ومنظمة.

---

## 📋 جدول المحتويات

1. [مبادئ المساهمة](#principles)
2. [البدء السريع](#getting-started)
3. [عملية التطوير](#development-process)
4. [معايير الكود](#code-standards)
5. [اختبار الكود](#testing)
6. [إرسال Pull Request](#pull-request)
7. [الإبلاغ عن الأخطاء](#bug-reports)
8. [اقتراح ميزات جديدة](#feature-requests)

---

## 🎯 مبادئ المساهمة {#principles}

- ✅ **الجودة أولاً**: نسعى لكتابة كود نظيف وقابل للصيانة
- ✅ **الأمان دائماً**: الالتزام بمعايير NCA والأمن السيبراني
- ✅ **التوثيق الشامل**: كل ميزة يجب أن تكون موثّقة
- ✅ **الاختبارات الكافية**: نسبة تغطية ≥ 80%
- ✅ **التواصل الفعّال**: الشفافية والوضوح في التواصل

---

## 🚀 البدء السريع {#getting-started}

### 1. Fork المشروع

```bash
# على GitHub، اضغط على زر "Fork"
```

### 2. Clone المشروع

```bash
git clone https://github.com/YOUR-USERNAME/KPI-Measuring.git
cd KPI-Measuring
```

### 3. إعداد بيئة التطوير

#### Frontend

```bash
cd frontend
npm install
npm start
```

#### Backend

```bash
cd backend/src/PerformanceSystem.API
dotnet restore
dotnet ef database update
dotnet run
```

### 4. إنشاء Branch جديد

```bash
git checkout -b feature/your-feature-name
# أو
git checkout -b fix/bug-description
```

---

## 🔄 عملية التطوير {#development-process}

### 1. اختر مهمة

- تصفح [Issues](https://github.com/mmitsa/KPI-Measuring/issues)
- اختر Issue معلّم بـ `good first issue` للمبتدئين
- أو أنشئ Issue جديد لتوضيح ما تريد العمل عليه

### 2. تواصل مع الفريق

- علّق على الـ Issue بأنك تريد العمل عليه
- انتظر الموافقة قبل البدء (لتجنب التكرار)

### 3. قم بالتطوير

- اتبع معايير الكود (أدناه)
- اكتب اختبارات للكود الجديد
- وثّق الكود والميزات الجديدة

### 4. اختبر التغييرات

```bash
# Frontend
npm test
npm run test:e2e

# Backend
dotnet test
```

### 5. Commit التغييرات

```bash
git add .
git commit -m "feat: إضافة ميزة X"
# أو
git commit -m "fix: إصلاح مشكلة Y"
```

**صيغة Commit Message:**

```
<type>: <description>

[optional body]

[optional footer]
```

**الأنواع المسموحة:**

- `feat`: ميزة جديدة
- `fix`: إصلاح خطأ
- `docs`: تحديث الوثائق
- `style`: تنسيق الكود (لا يؤثر على الوظيفة)
- `refactor`: إعادة هيكلة الكود
- `test`: إضافة أو تحديث الاختبارات
- `chore`: مهام صيانة (Build, CI/CD, etc.)
- `perf`: تحسين الأداء
- `security`: إصلاح أمني

**أمثلة:**

```bash
git commit -m "feat: إضافة نظام الاعتراضات"
git commit -m "fix: إصلاح خطأ في حساب النتيجة النهائية"
git commit -m "docs: تحديث دليل API"
git commit -m "test: إضافة اختبارات لخوارزمية التقييم"
git commit -m "security: تحديث مكتبة للتعامل مع ثغرة أمنية"
```

### 6. Push التغييرات

```bash
git push origin feature/your-feature-name
```

### 7. أنشئ Pull Request

- افتح [Pull Request](https://github.com/mmitsa/KPI-Measuring/pulls)
- اربطه بالـ Issue المتعلق (مثل: `Closes #123`)
- اشرح التغييرات بوضوح

---

## 📝 معايير الكود {#code-standards}

### Frontend (React/TypeScript)

#### المبادئ:

- استخدم **TypeScript** دائماً، لا JavaScript
- اتبع **ESLint** و **Prettier**
- استخدم **Functional Components** + **Hooks**
- تجنب `any` type، استخدم أنواع دقيقة

#### مثال:

```typescript
// ✅ جيد
interface User {
  userId: string;
  username: string;
  email: string;
  roles: string[];
}

const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div>
      <h1>{user.username}</h1>
      <p>{user.email}</p>
    </div>
  );
};

// ❌ سيء
const UserProfile = ({ user }: any) => {
  return (
    <div>
      <h1>{user.username}</h1>
    </div>
  );
};
```

#### التنظيم:

```
src/
├── components/       # مكونات قابلة لإعادة الاستخدام
├── pages/            # صفحات التطبيق
├── features/         # وحدات حسب الميزة (Goals, Evaluation, etc.)
├── services/         # API clients
├── hooks/            # Custom hooks
├── utils/            # دوال مساعدة
└── types/            # TypeScript types/interfaces
```

---

### Backend (ASP.NET Core / C#)

#### المبادئ:

- اتبع **SOLID Principles**
- استخدم **Dependency Injection**
- اتبع **Clean Architecture**
- استخدم **Async/Await** دائماً

#### مثال:

```csharp
// ✅ جيد
public interface IGoalService
{
    Task<Goal> CreateGoalAsync(CreateGoalDto dto);
    Task<IEnumerable<Goal>> GetEmployeeGoalsAsync(Guid employeeId);
}

public class GoalService : IGoalService
{
    private readonly IGoalRepository _goalRepository;
    private readonly ILogger<GoalService> _logger;

    public GoalService(IGoalRepository goalRepository, ILogger<GoalService> logger)
    {
        _goalRepository = goalRepository;
        _logger = logger;
    }

    public async Task<Goal> CreateGoalAsync(CreateGoalDto dto)
    {
        // Validation
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new ArgumentException("العنوان مطلوب", nameof(dto.Title));

        // Business logic
        var goal = new Goal
        {
            GoalId = Guid.NewGuid(),
            EmployeeId = dto.EmployeeId,
            Title = dto.Title,
            // ...
        };

        await _goalRepository.AddAsync(goal);
        _logger.LogInformation("تم إنشاء هدف جديد: {GoalId}", goal.GoalId);

        return goal;
    }

    // ...
}
```

#### التنظيم:

```
PerformanceSystem/
├── API/                    # Controllers, Middleware
├── Core/                   # Entities, Interfaces, DTOs
├── Application/            # Services, Business Logic
├── Infrastructure/         # Data Access, External APIs
└── Tests/                  # Unit & Integration Tests
```

---

### قاعدة البيانات

#### المبادئ:

- استخدم **Migrations** دائماً، لا تعدل الجداول يدوياً
- أضف **Indexes** للحقول المستعلم عنها كثيراً
- استخدم **Constraints** للحفاظ على سلامة البيانات
- وثّق الـ Stored Procedures

#### إنشاء Migration:

```bash
dotnet ef migrations add AddObjectionsTable
dotnet ef database update
```

---

## 🧪 اختبار الكود {#testing}

### Frontend Tests

```bash
# Unit Tests
npm test

# E2E Tests
npm run test:e2e

# Coverage
npm run test:coverage
```

**متطلبات التغطية:**

- Coverage ≥ 80%
- جميع الـ Services مُختبرة
- جميع الـ Critical Components مُختبرة

**مثال:**

```typescript
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('يعرض اسم المستخدم', () => {
    const user = {
      userId: '123',
      username: 'john.doe',
      email: 'john@example.com',
      roles: ['Employee']
    };

    render(<UserProfile user={user} />);

    expect(screen.getByText('john.doe')).toBeInTheDocument();
  });
});
```

---

### Backend Tests

```bash
# Unit Tests
dotnet test

# Coverage
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
```

**مثال:**

```csharp
[Fact]
public async Task CreateGoal_WithValidData_ReturnsGoal()
{
    // Arrange
    var dto = new CreateGoalDto
    {
        EmployeeId = Guid.NewGuid(),
        Title = "تطوير نظام X",
        Weight = 40
    };

    var mockRepo = new Mock<IGoalRepository>();
    var service = new GoalService(mockRepo.Object, Mock.Of<ILogger<GoalService>>());

    // Act
    var result = await service.CreateGoalAsync(dto);

    // Assert
    Assert.NotNull(result);
    Assert.Equal(dto.Title, result.Title);
    mockRepo.Verify(r => r.AddAsync(It.IsAny<Goal>()), Times.Once);
}

[Fact]
public async Task CalculateFinalScore_WithValidData_ReturnsCorrectScore()
{
    // Arrange
    var evaluation = new Evaluation
    {
        GoalsScore = 4.0m,
        BehaviorScore = 3.5m,
        InitiativesScore = 4.5m,
        TrainingImpact = 0.15m
    };

    var service = new EvaluationService();

    // Act
    var result = service.CalculateFinalScore(evaluation);

    // Assert
    // FinalScore = (4.0 * 0.6) + (3.5 * 0.3) + (4.5 * 0.1) + 0.15
    //            = 2.4 + 1.05 + 0.45 + 0.15 = 4.05
    Assert.Equal(4.05m, result, 2); // دقة رقمين عشريين
}
```

---

## 🔀 إرسال Pull Request {#pull-request}

### قبل الإرسال:

- [ ] تأكد من نجاح جميع الاختبارات
- [ ] تأكد من عدم وجود Linting Errors
- [ ] حدّث الوثائق (إن لزم)
- [ ] أضف CHANGELOG entry

### وصف PR:

```markdown
## الوصف

شرح واضح للتغييرات

## النوع

- [ ] ميزة جديدة (Feature)
- [ ] إصلاح خطأ (Bug Fix)
- [ ] تحسين أداء (Performance)
- [ ] إصلاح أمني (Security)
- [ ] تحديث وثائق (Documentation)

## الاختبارات

- [ ] تم إضافة اختبارات Unit Tests
- [ ] تم إضافة اختبارات Integration Tests
- [ ] Coverage ≥ 80%

## Checklist

- [ ] الكود يتبع معايير المشروع
- [ ] تم تحديث الوثائق
- [ ] تم تحديث CHANGELOG.md
- [ ] جميع الاختبارات تنجح
- [ ] لا توجد Warnings

## Screenshot (إن وجد)

[صورة للميزة الجديدة]

## Related Issue

Closes #123
```

---

## 🐛 الإبلاغ عن الأخطاء {#bug-reports}

### قبل الإبلاغ:

- تأكد من أن الخطأ لم يُبلّغ عنه مسبقاً في [Issues](https://github.com/mmitsa/KPI-Measuring/issues)
- تأكد من أنك تستخدم أحدث إصدار

### نموذج الإبلاغ:

```markdown
## وصف الخطأ

وصف واضح للخطأ

## خطوات إعادة إنتاج الخطأ

1. اذهب إلى '...'
2. اضغط على '...'
3. انزل إلى '...'
4. شاهد الخطأ

## السلوك المتوقع

ماذا كنت تتوقع أن يحدث؟

## السلوك الفعلي

ماذا حدث فعلاً؟

## Screenshots

[صور توضيحية]

## البيئة

- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

## Logs

```
[نسخ السجلات هنا]
```

## معلومات إضافية

أي معلومات أخرى مفيدة
```

---

## 💡 اقتراح ميزات جديدة {#feature-requests}

### نموذج الاقتراح:

```markdown
## الميزة المقترحة

وصف واضح للميزة

## المشكلة التي تحلها

ما هي المشكلة التي ستحلها هذه الميزة؟

## الحل المقترح

كيف تقترح حل هذه المشكلة؟

## البدائل المُدروسة

هل فكرت في حلول أخرى؟

## الأولوية

- [ ] عالية (High)
- [ ] متوسطة (Medium)
- [ ] منخفضة (Low)

## الفئة المتأثرة

- [ ] الموظف (Employee)
- [ ] المدير (Manager)
- [ ] HR
- [ ] الإدارة العليا (Executive)
- [ ] مسؤول النظام (Admin)

## معلومات إضافية

[Screenshots, mockups, etc.]
```

---

## 📞 التواصل

- **Email**: dev@performance.gov.sa
- **Slack**: #kpi-measuring-dev
- **GitHub Discussions**: [Discussions](https://github.com/mmitsa/KPI-Measuring/discussions)

---

## 📜 الترخيص

بالمساهمة في هذا المشروع، توافق على أن مساهماتك ستكون مرخّصة تحت نفس ترخيص المشروع.

---

**شكراً لمساهمتك! 🎉**

</div>
