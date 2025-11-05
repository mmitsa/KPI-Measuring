# Performance Optimization Guide
# دليل تحسين الأداء

## 🚀 Overview

This guide covers performance optimization strategies for the Government Performance Management System.

---

## 1. Backend Optimization

### 1.1 Database Query Optimization

```csharp
// ❌ Bad: N+1 Query Problem
var employees = await _context.Employees.ToListAsync();
foreach (var emp in employees)
{
    var goals = await _context.Goals.Where(g => g.EmployeeId == emp.EmployeeId).ToListAsync();
}

// ✅ Good: Use Include
var employees = await _context.Employees
    .Include(e => e.Goals)
    .ToListAsync();

// ✅ Better: Use projection
var employees = await _context.Employees
    .Select(e => new {
        e.EmployeeId,
        e.FullNameAr,
        GoalsCount = e.Goals.Count
    })
    .ToListAsync();
```

### 1.2 Caching Strategy

```csharp
// Distributed Cache (Redis)
public async Task<List<Competency>> GetCompetenciesAsync()
{
    const string cacheKey = "competencies:all";

    var cached = await _cache.GetStringAsync(cacheKey);
    if (cached != null)
    {
        return JsonSerializer.Deserialize<List<Competency>>(cached);
    }

    var competencies = await _context.Competencies.ToListAsync();

    await _cache.SetStringAsync(cacheKey,
        JsonSerializer.Serialize(competencies),
        new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1) });

    return competencies;
}
```

### 1.3 Async/Await Best Practices

```csharp
// ✅ Use async all the way
public async Task<IActionResult> GetGoals()
{
    var goals = await _goalService.GetGoalsAsync();
    return Ok(goals);
}

// ❌ Don't block on async
// var goals = _goalService.GetGoalsAsync().Result;  // Deadlock risk!
```

### 1.4 Response Compression

```csharp
// Program.cs
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});

app.UseResponseCompression();
```

---

## 2. Frontend Optimization

### 2.1 Code Splitting

```typescript
// Lazy load routes
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'));
const ManagerDashboard = lazy(() => import('./pages/ManagerDashboard'));
const HRDashboard = lazy(() => import('./pages/HRDashboard'));

// Use Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/employee" element={<EmployeeDashboard />} />
  </Routes>
</Suspense>
```

### 2.2 Memoization

```typescript
// Use React.memo
export const GoalCard = React.memo(({ goal }: Props) => {
  return <Card>{goal.title}</Card>;
});

// Use useMemo for expensive calculations
const totalWeight = useMemo(() => {
  return goals.reduce((sum, g) => sum + g.weight, 0);
}, [goals]);

// Use useCallback
const handleSubmit = useCallback(async (data) => {
  await dispatch(createGoal(data));
}, [dispatch]);
```

### 2.3 Virtual Scrolling

```typescript
// Use react-window for large lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={employees.length}
  itemSize={60}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <EmployeeRow employee={employees[index]} />
    </div>
  )}
</FixedSizeList>
```

---

## 3. Database Optimization

### 3.1 Indexing Strategy

```sql
-- Index on foreign keys
CREATE NONCLUSTERED INDEX IX_Goals_EmployeeId ON Goals(EmployeeId);
CREATE NONCLUSTERED INDEX IX_Evaluations_EmployeeId ON Evaluations(EmployeeId);

-- Composite indexes for common queries
CREATE NONCLUSTERED INDEX IX_Evaluations_EmployeeId_Period
ON Evaluations(EmployeeId, Period) INCLUDE (FinalScore, Status);

-- Filtered indexes
CREATE NONCLUSTERED INDEX IX_Goals_Active
ON Goals(EmployeeId, Status)
WHERE Status IN ('Approved', 'InProgress');
```

### 3.2 Query Optimization

```sql
-- Use EXISTS instead of COUNT
-- ❌ Slow
IF (SELECT COUNT(*) FROM Goals WHERE EmployeeId = @EmpId) > 0

-- ✅ Fast
IF EXISTS (SELECT 1 FROM Goals WHERE EmployeeId = @EmpId)

-- Use appropriate JOINs
-- ✅ Use INNER JOIN when possible
SELECT e.*, ev.FinalScore
FROM Employees e
INNER JOIN Evaluations ev ON e.EmployeeId = ev.EmployeeId
WHERE ev.Period = '2025';
```

---

## 4. API Performance

### 4.1 Pagination

```csharp
public async Task<PagedResult<Goal>> GetGoalsAsync(int page, int pageSize)
{
    var totalCount = await _context.Goals.CountAsync();

    var goals = await _context.Goals
        .OrderByDescending(g => g.CreatedAt)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return new PagedResult<Goal>
    {
        Data = goals,
        Page = page,
        PageSize = pageSize,
        TotalCount = totalCount
    };
}
```

### 4.2 Response Caching

```csharp
[ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Client)]
[HttpGet("competencies")]
public async Task<IActionResult> GetCompetencies()
{
    var competencies = await _competencyService.GetAllAsync();
    return Ok(competencies);
}
```

---

## 5. Load Testing

### 5.1 k6 Script

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '3m', target: 50 },   // Stay at 50 users
    { duration: '1m', target: 100 },  // Ramp up to 100 users
    { duration: '3m', target: 100 },  // Stay at 100 users
    { duration: '1m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests < 1s
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

export default function () {
  // Test login
  const loginRes = http.post('https://api.performance.gov.sa/api/v1/auth/login', JSON.stringify({
    username: 'test.user',
    password: 'Test@123'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'token received': (r) => r.json('accessToken') !== '',
  });

  const token = loginRes.json('accessToken');

  // Test get goals
  const goalsRes = http.get('https://api.performance.gov.sa/api/v1/goals/my', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  check(goalsRes, {
    'goals fetched': (r) => r.status === 200,
  });

  sleep(1);
}

// Run: k6 run load-test.js
```

---

## 6. Monitoring Performance

### 6.1 Key Metrics

| Metric | Target | Action If Exceeded |
|--------|--------|-------------------|
| API Response Time (p95) | < 1s | Investigate slow queries |
| Page Load Time | < 3s | Optimize bundle size |
| Error Rate | < 0.1% | Check logs, rollback if needed |
| Database Query Time | < 500ms | Add indexes, optimize queries |
| Memory Usage | < 75% | Check for memory leaks |

### 6.2 Application Insights Queries

```kusto
// Slowest API endpoints
requests
| where timestamp > ago(1h)
| summarize avg(duration), p95=percentile(duration, 95) by operation_Name
| order by p95 desc
| limit 10

// Failed requests
requests
| where timestamp > ago(1h)
| where success == false
| summarize count() by operation_Name, resultCode
| order by count_ desc
```

---

**Last Updated**: November 2025
**Version**: 1.0
