# End-to-End Test Scenarios
# سيناريوهات الاختبار الشاملة

## Scenario 1: Complete Goal Lifecycle

**Actor:** Employee + Manager

**Steps:**
1. **Employee** logs in
2. **Employee** creates new goal "Improve customer satisfaction"
3. **Employee** sets weight = 40%, target = 90%
4. **Manager** receives notification
5. **Manager** reviews and approves goal
6. **Employee** updates progress to 50%
7. **Employee** updates progress to 100%
8. **Manager** confirms goal completion

**Expected Result:** Goal status = Completed, Progress = 100%

---

## Scenario 2: Full Evaluation Cycle

**Actor:** Manager + Employee + HR

**Steps:**
1. **Manager** creates annual evaluation for employee
2. **Manager** enters goals scores (4.5/5)
3. **Manager** enters behavior scores (4.2/5)
4. **Manager** enters initiatives scores (4.0/5)
5. **System** calculates final score: (4.5×0.6) + (4.2×0.3) + (4.0×0.1) = 4.36
6. **Manager** finalizes evaluation
7. **Employee** views evaluation
8. **HR** reviews and approves
9. **Employee** receives notification

**Expected Result:** 
- FinalScore = 4.36
- Rating = "Above Expected"
- Status = Approved

---

## Scenario 3: Objection Workflow

**Actor:** Employee + HR

**Steps:**
1. **Employee** views evaluation (FinalScore = 3.2)
2. **Employee** disagrees with score
3. **Employee** submits objection with details
4. **HR** receives notification (SLA: 5 days)
5. **HR** reviews objection and supporting documents
6. **HR** accepts objection
7. **HR** adjusts FinalScore to 3.6
8. **Employee** receives notification of decision

**Expected Result:** 
- Objection status = Accepted
- FinalScore updated to 3.6
- All changes logged in AuditLogs

---

## Scenario 4: PIP Creation & Completion

**Actor:** Manager + Employee

**Steps:**
1. **Employee** receives FinalScore = 2.3 (< 2.5)
2. **System** automatically creates PIP
3. **Manager** receives notification
4. **Manager** customizes PIP with specific actions
5. **Manager** sets 3-month timeline
6. **Employee** completes training (score: 88%)
7. **Manager** reviews progress (monthly)
8. **Manager** marks PIP as completed after 3 months

**Expected Result:** 
- PIP created automatically
- PIP status = Completed
- TrainingImpact = +0.15 for next evaluation

---

## Scenario 5: Multi-User Concurrent Access

**Actors:** 10 Employees + 3 Managers

**Steps:**
1. All 10 employees log in simultaneously
2. 5 employees create goals concurrently
3. 3 managers approve goals concurrently
4. 5 employees update progress concurrently
5. System handles all operations without conflicts

**Expected Result:** 
- No database deadlocks
- All operations complete successfully
- Response time < 2 seconds

---

**Last Updated**: November 2025
**Total Scenarios**: 5
**Coverage**: Critical User Journeys
