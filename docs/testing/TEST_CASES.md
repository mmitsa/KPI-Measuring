# Test Cases
# حالات الاختبار التفصيلية

## 1. Authentication Test Cases

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| TC-AUTH-001 | Valid login | 1. Enter valid credentials<br>2. Click login | User logged in, redirected to dashboard | High |
| TC-AUTH-002 | Invalid password | 1. Enter wrong password | Error: "Invalid credentials" | High |
| TC-AUTH-003 | Account lockout | 1. Fail login 5 times | Account locked for 15 minutes | High |
| TC-AUTH-004 | Token expiration | 1. Wait 60 minutes<br>2. Make API call | 401 Unauthorized | Medium |

## 2. Goals Management Test Cases

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| TC-GOAL-001 | Create valid goal | 1. Fill all required fields<br>2. Submit | Goal created successfully | High |
| TC-GOAL-002 | Weight validation | 1. Enter weight > 100<br>2. Submit | Error: "Weight must be 0-100" | High |
| TC-GOAL-003 | Approve goal (Manager) | 1. Manager reviews goal<br>2. Clicks approve | Goal status = Approved | High |
| TC-GOAL-004 | Update progress | 1. Enter new progress %<br>2. Save | Progress updated | Medium |

## 3. Evaluation Test Cases

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| TC-EVAL-001 | Create evaluation | 1. Manager creates evaluation<br>2. Enter scores | Evaluation created | High |
| TC-EVAL-002 | Calculate final score | 1. Enter all scores<br>2. Finalize | FinalScore = (Goals×0.6)+(Behavior×0.3)+(Initiatives×0.1)+Training | Critical |
| TC-EVAL-003 | Auto PIP creation | 1. Final score < 2.5<br>2. Finalize | PIP created automatically | Critical |
| TC-EVAL-004 | HR approval | 1. HR reviews<br>2. Approves | Status = Approved | High |

## 4. Performance Test Cases

| ID | Test Case | Load | Expected Response Time | Pass Criteria |
|----|-----------|------|------------------------|---------------|
| TC-PERF-001 | API login | 100 users/sec | < 500ms | 95th percentile < 1s |
| TC-PERF-002 | Get goals | 50 requests/sec | < 300ms | Success rate > 99% |
| TC-PERF-003 | Dashboard load | 200 concurrent | < 2s | Page load < 3s |

## 5. Security Test Cases

| ID | Test Case | Attack Type | Expected Result | Priority |
|----|-----------|-------------|-----------------|----------|
| TC-SEC-001 | SQL Injection | ' OR 1=1-- | Request blocked/sanitized | Critical |
| TC-SEC-002 | XSS Attack | <script>alert(1)</script> | Input sanitized | Critical |
| TC-SEC-003 | Unauthorized access | Access admin endpoint as employee | 403 Forbidden | Critical |
| TC-SEC-004 | CSRF Attack | Cross-site form submit | Request rejected | High |

**Last Updated**: November 2025
