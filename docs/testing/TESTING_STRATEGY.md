# Testing Strategy
# استراتيجية الاختبار الشاملة

## 🎯 Overview

Comprehensive testing strategy for the Government Performance Management System ensuring quality, security, and reliability.

---

## 1. Testing Pyramid

```
                    /\
                   /  \
                  / E2E \ (10%)
                 /________\
                /          \
               / Integration \ (30%)
              /______________\
             /                \
            /   Unit Tests      \ (60%)
           /____________________\
```

### Test Distribution

| Level | Coverage Target | Purpose |
|-------|-----------------|---------|
| **Unit Tests** | 80%+ | Test individual functions/methods |
| **Integration Tests** | 70%+ | Test component interactions |
| **E2E Tests** | Critical paths | Test full user workflows |
| **Performance Tests** | Key scenarios | Test system under load |
| **Security Tests** | All endpoints | Test vulnerabilities |

---

## 2. Unit Testing

### 2.1 Backend Unit Tests (.NET)

**Framework:** xUnit + Moq + FluentAssertions

**Test Structure:**
```csharp
public class GoalServiceTests
{
    private readonly Mock<IGoalRepository> _mockRepository;
    private readonly GoalService _service;

    public GoalServiceTests()
    {
        _mockRepository = new Mock<IGoalRepository>();
        _service = new GoalService(_mockRepository.Object);
    }

    [Fact]
    public async Task CreateGoal_ValidData_ReturnsGoal()
    {
        // Arrange
        var goalDto = new CreateGoalDto
        {
            Title = "Test Goal",
            Weight = 30
        };

        _mockRepository
            .Setup(r => r.AddAsync(It.IsAny<Goal>()))
            .ReturnsAsync(new Goal { GoalId = Guid.NewGuid() });

        // Act
        var result = await _service.CreateGoalAsync(goalDto);

        // Assert
        result.Should().NotBeNull();
        result.GoalId.Should().NotBeEmpty();
        _mockRepository.Verify(r => r.AddAsync(It.IsAny<Goal>()), Times.Once);
    }

    [Fact]
    public async Task CreateGoal_InvalidWeight_ThrowsException()
    {
        // Arrange
        var goalDto = new CreateGoalDto { Weight = 150 };  // Invalid: > 100

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => _service.CreateGoalAsync(goalDto)
        );
    }
}
```

**Run Tests:**
```bash
cd backend
dotnet test --logger "console;verbosity=detailed"
dotnet test --collect:"XPlat Code Coverage"
```

### 2.2 Frontend Unit Tests (React)

**Framework:** Vitest + React Testing Library

**Test Structure:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GoalCard from './GoalCard';

describe('GoalCard', () => {
  it('renders goal title and weight', () => {
    const goal = {
      goalId: '123',
      title: 'Test Goal',
      weight: 30,
      progressPercent: 50
    };

    render(<GoalCard goal={goal} />);

    expect(screen.getByText('Test Goal')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('calls onDelete when delete button clicked', () => {
    const mockDelete = vi.fn();
    const goal = { goalId: '123', title: 'Test', weight: 30 };

    render(<GoalCard goal={goal} onDelete={mockDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockDelete).toHaveBeenCalledWith('123');
  });
});
```

**Run Tests:**
```bash
cd frontend
npm test
npm run test:coverage
```

---

## 3. Integration Testing

### 3.1 API Integration Tests

**Test Database Connection:**
```csharp
[Collection("Database")]
public class GoalIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public GoalIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateGoal_IntegrationTest()
    {
        // Arrange
        var token = await GetAuthTokenAsync();
        var goal = new { title = "Integration Test Goal", weight = 30 };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/goals", goal, new RequestOptions
        {
            Headers = { Authorization = new AuthenticationHeaderValue("Bearer", token) }
        });

        // Assert
        response.EnsureSuccessStatusCode();
        var createdGoal = await response.Content.ReadFromJsonAsync<GoalDto>();
        createdGoal.Should().NotBeNull();
        createdGoal.Title.Should().Be(goal.title);
    }
}
```

### 3.2 Database Integration Tests

```csharp
[Fact]
public async Task Goal_CRUD_Operations()
{
    using var context = CreateDbContext();

    // Create
    var goal = new Goal { Title = "Test", EmployeeId = Guid.NewGuid() };
    context.Goals.Add(goal);
    await context.SaveChangesAsync();

    // Read
    var retrieved = await context.Goals.FindAsync(goal.GoalId);
    retrieved.Should().NotBeNull();

    // Update
    retrieved.ProgressPercent = 50;
    await context.SaveChangesAsync();

    // Delete
    context.Goals.Remove(retrieved);
    await context.SaveChangesAsync();

    var deleted = await context.Goals.FindAsync(goal.GoalId);
    deleted.Should().BeNull();
}
```

---

## 4. End-to-End Testing

### 4.1 Playwright Tests

**Test Structure:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Goal Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000');
    await page.fill('[name="username"]', 'john.doe');
    await page.fill('[name="password"]', 'Employee@123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*employee/);
  });

  test('should create a new goal', async ({ page }) => {
    // Navigate to goals page
    await page.click('text=أهدافي');

    // Click create button
    await page.click('button:has-text("إنشاء هدف جديد")');

    // Fill form
    await page.fill('[name="title"]', 'Test E2E Goal');
    await page.fill('[name="weight"]', '30');
    await page.selectOption('[name="type"]', 'Strategic');

    // Submit
    await page.click('button:has-text("حفظ")');

    // Verify
    await expect(page.locator('text=Test E2E Goal')).toBeVisible();
  });

  test('should update goal progress', async ({ page }) => {
    await page.click('text=أهدافي');
    await page.click('.goal-card:first-child');
    await page.fill('[name="progressPercent"]', '75');
    await page.click('button:has-text("تحديث")');

    await expect(page.locator('text=75%')).toBeVisible();
  });
});
```

**Run E2E Tests:**
```bash
cd frontend
npx playwright test
npx playwright test --headed  # With browser
npx playwright test --debug   # Debug mode
```

---

## 5. Performance Testing

### 5.1 Load Testing with k6

**Test Script:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200
    { duration: '5m', target: 200 },  // Stay at 200
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],  // 95% < 1s
    http_req_failed: ['rate<0.01'],     // Error rate < 1%
  },
};

export default function () {
  // Login
  const loginRes = http.post('https://api.performance.gov.sa/api/v1/auth/login',
    JSON.stringify({
      username: 'loadtest.user',
      password: 'Test@123'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(loginRes, {
    'login successful': (r) => r.status === 200,
  });

  const token = loginRes.json('accessToken');

  // Get goals
  const goalsRes = http.get('https://api.performance.gov.sa/api/v1/goals/my', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(goalsRes, {
    'goals retrieved': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
```

**Run Load Tests:**
```bash
k6 run tests/load-test.js
k6 run --vus 100 --duration 30s tests/load-test.js
```

### 5.2 Stress Testing

**Find breaking point:**
```javascript
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 200 },
    { duration: '5m', target: 300 },
    { duration: '5m', target: 400 },
    { duration: '2m', target: 0 },
  ],
};
```

---

## 6. Security Testing

### 6.1 Automated Security Tests

**SQL Injection Test:**
```csharp
[Fact]
public async Task Login_SQLInjection_Rejected()
{
    var maliciousPayload = new
    {
        username = "admin' OR '1'='1",
        password = "any"
    };

    var response = await _client.PostAsJsonAsync("/api/v1/auth/login", maliciousPayload);

    response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
}
```

**XSS Test:**
```csharp
[Fact]
public async Task CreateGoal_XSSPayload_Sanitized()
{
    var xssPayload = new
    {
        title = "<script>alert('XSS')</script>",
        weight = 30
    };

    var response = await _client.PostAsJsonAsync("/api/v1/goals", xssPayload);

    var goal = await response.Content.ReadFromJsonAsync<GoalDto>();
    goal.Title.Should().NotContain("<script>");
}
```

### 6.2 Manual Penetration Testing

**Checklist:**
- [ ] Authentication bypass
- [ ] Authorization checks
- [ ] SQL injection
- [ ] XSS (Stored & Reflected)
- [ ] CSRF
- [ ] SSRF
- [ ] File upload vulnerabilities
- [ ] Business logic flaws

---

## 7. Test Automation

### 7.1 CI/CD Integration

**GitHub Actions:**
```yaml
name: Run All Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
      - name: Run tests
        run: |
          cd backend
          dotnet test --logger "trx;LogFileName=test-results.trx"

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
      - name: Run tests
        run: |
          cd frontend
          npm ci
          npm test
```

### 7.2 Test Coverage Requirements

**Minimum Coverage:**
- Backend: 80%
- Frontend: 70%
- Critical paths: 100%

**Coverage Report:**
```bash
# Backend
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
reportgenerator -reports:coverage.opencover.xml -targetdir:coveragereport

# Frontend
npm run test:coverage
open coverage/index.html
```

---

## 8. Test Data Management

### 8.1 Test Database

**Setup:**
```sql
-- Create test database
CREATE DATABASE PerformanceSystem_Test;

-- Seed test data
INSERT INTO Roles (RoleName, RoleNameAr) VALUES
('Employee', 'موظف'),
('Manager', 'مدير');

-- Create test users
INSERT INTO Users (Username, Email, EmployeeId) VALUES
('test.employee', 'test@test.com', NEWID()),
('test.manager', 'manager@test.com', NEWID());
```

### 8.2 Test Data Factories

```csharp
public class TestDataFactory
{
    public static Goal CreateTestGoal()
    {
        return new Goal
        {
            GoalId = Guid.NewGuid(),
            Title = $"Test Goal {DateTime.Now.Ticks}",
            Weight = 30,
            EmployeeId = Guid.NewGuid(),
            Status = "Draft"
        };
    }

    public static Evaluation CreateTestEvaluation()
    {
        return new Evaluation
        {
            EvaluationId = Guid.NewGuid(),
            Period = "2025",
            EmployeeId = Guid.NewGuid(),
            Status = "Draft"
        };
    }
}
```

---

## 9. Test Reporting

### 9.1 Test Results Dashboard

**Metrics to Track:**
- Total tests
- Passed / Failed
- Coverage percentage
- Execution time
- Flaky tests

### 9.2 HTML Reports

```bash
# Generate HTML report
dotnet test --logger "html;LogFileName=test-report.html"

# Playwright report
npx playwright show-report
```

---

## 10. Testing Best Practices

### 10.1 AAA Pattern

```csharp
[Fact]
public async Task TestMethod()
{
    // Arrange - Setup
    var service = new MyService();
    var input = new TestInput();

    // Act - Execute
    var result = await service.DoSomething(input);

    // Assert - Verify
    result.Should().NotBeNull();
}
```

### 10.2 Test Independence

✅ **Good:**
```csharp
[Fact]
public async Task Test1()
{
    using var context = CreateFreshDbContext();
    // Test with clean database
}

[Fact]
public async Task Test2()
{
    using var context = CreateFreshDbContext();
    // Test with clean database
}
```

❌ **Bad:**
```csharp
private static Goal _sharedGoal;

[Fact]
public async Task Test1()
{
    _sharedGoal = CreateGoal();  // Creates shared state
}

[Fact]
public async Task Test2()
{
    // Depends on Test1 running first
    var goal = _sharedGoal;
}
```

### 10.3 Meaningful Test Names

```csharp
// ✅ Good
[Fact]
public async Task CreateGoal_WeightExceeds100_ThrowsValidationException()

// ❌ Bad
[Fact]
public async Task Test1()
```

---

## 11. Continuous Testing

### 11.1 Pre-Commit Hooks

```bash
# .git/hooks/pre-commit
#!/bin/bash

# Run unit tests
echo "Running unit tests..."
cd backend && dotnet test --filter Category=Unit
if [ $? -ne 0 ]; then
  echo "Unit tests failed. Commit aborted."
  exit 1
fi

# Run linting
cd ../frontend && npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed. Commit aborted."
  exit 1
fi

echo "All checks passed!"
```

### 11.2 Nightly Test Suite

- Full regression tests
- Performance tests
- Security scans
- Coverage reports

---

**Last Updated**: November 2025
**Version**: 1.0
**Status**: ✅ Ready for Implementation
