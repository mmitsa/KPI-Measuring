# Data Privacy & Protection
# حماية البيانات والخصوصية

<div dir="rtl">

## 📋 نظرة عامة

سياسات حماية البيانات الشخصية والامتثال لمعايير NCA و SDAIA.

</div>

---

## 1. Data Classification 📊

### 1.1 Classification Levels

| Level | Description | Examples | Protection Required |
|-------|-------------|----------|---------------------|
| **Critical** | Most sensitive | National ID, Passwords, Final Scores | Encryption at rest + transit, Access logging |
| **Confidential** | Internal sensitive | Evaluation details, PIPs, Objections | Encryption, Role-based access |
| **Internal** | Internal use | Goals, Training results | Authentication required |
| **Public** | Publicly accessible | Job positions, Competencies | No special protection |

### 1.2 Sensitive Fields

**Must be encrypted:**
```sql
-- Employees table
Employees.NationalId          -- رقم الهوية الوطنية (AES-256)
Employees.PhoneNumber         -- رقم الهاتف (AES-256)

-- Evaluations table
Evaluations.FinalScore        -- الدرجة النهائية (AES-256)
Evaluations.ManagerNotes      -- ملاحظات المدير (AES-256)
Evaluations.EmployeeNotes     -- ملاحظات الموظف (AES-256)

-- Objections table
Objections.Details            -- تفاصيل الاعتراض (AES-256)

-- PIP table
PIP.PlanJson                  -- تفاصيل الخطة (AES-256)
```

---

## 2. Personal Data Inventory 📝

### 2.1 Data We Collect

| Data Type | Purpose | Legal Basis | Retention |
|-----------|---------|-------------|-----------|
| **Identity Data** | Employee identification | Employment contract | During employment + 5 years |
| **Contact Data** | Communication | Legitimate interest | During employment + 2 years |
| **Performance Data** | Performance evaluation | Legal obligation | Permanent (archival) |
| **Training Data** | Professional development | Legitimate interest | 10 years |
| **Authentication Data** | System access | Security | 12 months |

### 2.2 Data Subjects Rights

Saudi government employees have the right to:
- ✅ Access their personal data
- ✅ Correct inaccurate data
- ✅ Object to evaluations (formal process)
- ✅ Request data portability (JSON/PDF export)
- ❌ Deletion (not applicable - legal archival requirement)

---

## 3. Data Protection Measures 🛡️

### 3.1 Technical Measures

**Encryption:**
```csharp
// Example: Encrypt National ID
public class EncryptionService
{
    private readonly string _encryptionKey;

    public string Encrypt(string plainText)
    {
        using (Aes aes = Aes.Create())
        {
            aes.Key = Convert.FromBase64String(_encryptionKey);
            aes.GenerateIV();

            ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

            using (MemoryStream ms = new MemoryStream())
            {
                ms.Write(aes.IV, 0, aes.IV.Length);
                using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                using (StreamWriter sw = new StreamWriter(cs))
                {
                    sw.Write(plainText);
                }
                return Convert.ToBase64String(ms.ToArray());
            }
        }
    }
}
```

**Access Control:**
```csharp
// Role-based data access
[Authorize(Roles = "HR,Manager")]
[HttpGet("employees/{id}/sensitive-data")]
public async Task<IActionResult> GetSensitiveData(Guid id)
{
    // Only HR and direct managers can access
    if (!await _authService.CanAccessEmployeeData(User, id))
    {
        return Forbid();
    }

    var data = await _employeeService.GetSensitiveDataAsync(id);

    // Audit log
    await _auditService.LogAsync(new AuditLog
    {
        UserId = User.GetUserId(),
        Action = "ViewSensitiveData",
        Entity = "Employee",
        EntityId = id.ToString()
    });

    return Ok(data);
}
```

### 3.2 Organizational Measures

- ✅ Data Protection Officer (DPO) appointed
- ✅ Privacy policy published
- ✅ Employee training on data protection
- ✅ Data processing agreements with vendors
- ✅ Regular privacy audits

---

## 4. Data Retention Policy 📅

### 4.1 Retention Periods

| Data Type | Retention Period | Deletion Method |
|-----------|------------------|-----------------|
| **Active employee data** | During employment | Archived on termination |
| **Terminated employee data** | 5 years | Soft delete, then hard delete |
| **Evaluation records** | Permanent | Archival storage |
| **Audit logs** | 12 months (active), 7 years (archive) | Compressed archival |
| **Session tokens** | 1 hour (active), 24 hours (refresh) | Automatic expiry |
| **Notifications** | 6 months (read), 12 months (unread) | Batch deletion |

### 4.2 Data Deletion

**Soft Delete:**
```sql
-- Mark employee as inactive
UPDATE Employees
SET IsActive = 0, Status = 'Terminated'
WHERE EmployeeId = @EmployeeId;

-- Archive associated data
INSERT INTO Employees_Archive
SELECT * FROM Employees WHERE EmployeeId = @EmployeeId;
```

**Hard Delete (after retention period):**
```sql
-- Delete old notifications (older than 6 months, read)
DELETE FROM Notifications
WHERE IsRead = 1
  AND ReadAt < DATEADD(MONTH, -6, GETDATE());

-- Archive old audit logs (older than 12 months)
INSERT INTO AuditLogs_Archive
SELECT * FROM AuditLogs
WHERE CreatedAt < DATEADD(MONTH, -12, GETDATE());

DELETE FROM AuditLogs
WHERE CreatedAt < DATEADD(MONTH, -12, GETDATE());
```

---

## 5. Data Sharing & Transfer 🔄

### 5.1 Internal Sharing

| Recipient | Data Shared | Purpose | Access Method |
|-----------|-------------|---------|---------------|
| **Direct Manager** | Goals, Progress, Evaluations | Performance management | Role-based access |
| **HR Department** | All employee data | HR operations | Role-based access |
| **IT Support** | Authentication logs | Troubleshooting | Audit logged |
| **Executives** | Aggregated statistics | Strategic planning | Dashboard (anonymized) |

### 5.2 External Sharing

| Recipient | Data Shared | Purpose | Legal Basis |
|-----------|-------------|---------|-------------|
| **Masar Platform** | Evaluation results | Government reporting | Legal obligation |
| **Training Provider** | Training requests | Professional development | Contract |
| **External Auditors** | Selected records | Compliance audit | Legal obligation |

**Data Transfer Agreement Template:**
```markdown
# Data Processing Agreement

Between: [Government Entity]
And: [External Service Provider]

1. Purpose: [Specify purpose]
2. Data Categories: [List data types]
3. Security Measures: [Required controls]
4. Retention: [Period and deletion]
5. Liability: [Responsibilities]
6. Termination: [Data return/deletion]
```

---

## 6. Privacy by Design 🏗️

### 6.1 Design Principles

1. **Data Minimization**
   - Only collect necessary data
   - Avoid excessive logging
   - Aggregate when possible

2. **Purpose Limitation**
   - Use data only for specified purpose
   - No secondary use without consent

3. **Accuracy**
   - Regular data validation
   - Self-service correction by employees

4. **Storage Limitation**
   - Automated retention enforcement
   - Regular archival and deletion

5. **Integrity & Confidentiality**
   - Encryption at rest and in transit
   - Access controls and audit logging

### 6.2 Privacy-Enhancing Technologies

**Data Masking in Logs:**
```csharp
public class SensitiveDataLogger : ILogger
{
    public void Log(string message)
    {
        // Mask National IDs
        message = Regex.Replace(message, @"\d{10}", "**********");

        // Mask emails
        message = Regex.Replace(message, @"[\w\.-]+@[\w\.-]+", "***@***");

        // Write to log
        _innerLogger.Log(message);
    }
}
```

**Anonymization for Analytics:**
```sql
-- Generate anonymized dataset for analytics
SELECT
    HASHBYTES('SHA2_256', CONVERT(VARBINARY(MAX), EmployeeId)) AS EmployeeHash,
    DepartmentId,
    Grade,
    FinalScore,
    FinalRating,
    Period
FROM Evaluations
WHERE Period = '2025';
```

---

## 7. Breach Notification 🚨

### 7.1 Breach Response Plan

**Timeline:**
1. **Detection** (T+0): Identify breach
2. **Containment** (T+1 hour): Stop data leak
3. **Assessment** (T+4 hours): Evaluate impact
4. **Notification** (T+72 hours): Notify affected parties
5. **Remediation** (T+7 days): Fix vulnerability
6. **Report** (T+30 days): Submit to NCA

### 7.2 Notification Template

```
Subject: [URGENT] Data Security Incident Notification

Dear [Name],

We are writing to inform you of a data security incident that may have affected your personal information.

**Incident Details:**
- Date of Incident: [Date]
- Type of Data Affected: [Data types]
- Number of Affected Individuals: [Count]

**Actions Taken:**
- Immediate containment measures
- Security enhancement implemented
- Notification to relevant authorities

**Your Rights:**
- Contact our Data Protection Officer
- Request detailed information
- File a complaint with NCA

Contact: dpo@performance.gov.sa
```

---

## 8. Data Subject Access Requests 📬

### 8.1 Request Process

**Employee can request:**
1. Access to their personal data
2. Correction of inaccurate data
3. Export of their data (portability)

**Response Timeline:**
- Acknowledge: 3 business days
- Fulfill: 30 days
- Extend (if complex): 60 days (with notification)

### 8.2 Data Export Format

```json
{
  "employee": {
    "employeeId": "...",
    "fullName": "...",
    "email": "...",
    "department": "...",
    "position": "...",
    "hireDate": "..."
  },
  "goals": [
    {
      "title": "...",
      "period": "...",
      "weight": 30,
      "status": "...",
      "progress": 80
    }
  ],
  "evaluations": [
    {
      "period": "2025",
      "finalScore": 4.3,
      "rating": "Above Expected"
    }
  ],
  "trainings": [...],
  "exportDate": "2025-11-05T10:00:00Z"
}
```

---

## 9. Third-Party Processors 🤝

### 9.1 Vendor Management

**Requirements for Processors:**
- ✅ Data Processing Agreement signed
- ✅ NCA compliance verified
- ✅ ISO 27001 certified (preferred)
- ✅ Data location: Saudi Arabia or approved countries
- ✅ Annual security audits

**Current Processors:**
| Vendor | Service | Data Processed | Location |
|--------|---------|----------------|----------|
| Azure Gov Cloud | Hosting | All data | Saudi Arabia |
| Microsoft | Email | Email addresses | Saudi Arabia |
| [Training Provider] | Training results | Scores | Saudi Arabia |

### 9.2 Vendor Assessment

```markdown
# Vendor Security Assessment

Vendor: [Name]
Service: [Description]
Date: [Assessment Date]

Security Controls:
- [ ] Data encryption at rest
- [ ] Data encryption in transit
- [ ] Access controls
- [ ] Audit logging
- [ ] Incident response plan
- [ ] Business continuity plan
- [ ] Compliance certifications

Risk Level: [Low/Medium/High]
Approval: [Approved/Rejected/Conditional]
```

---

## 10. Employee Training 🎓

### 10.1 Training Requirements

**All employees must complete:**
- Data protection awareness (annually)
- Information security basics (annually)
- Phishing awareness (quarterly)

**Admins and developers must complete:**
- Secure coding practices
- Incident response procedures
- Privacy by design principles

### 10.2 Training Topics

1. **What is personal data?**
2. **Employee rights**
3. **Data classification**
4. **Access controls**
5. **Incident reporting**
6. **Social engineering awareness**

---

## 11. Monitoring & Compliance 📊

### 11.1 Privacy Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Data access requests response time | < 30 days | - | - |
| Security incidents | 0 | - | - |
| Unauthorized access attempts | 0 | - | - |
| Data breaches | 0 | - | - |
| Compliance audit score | > 95% | - | - |

### 11.2 Regular Audits

- **Quarterly**: Access logs review
- **Semi-annually**: Data inventory update
- **Annually**: Full privacy audit
- **Bi-annually**: Penetration testing

---

## 12. Contact Information 📞

**Data Protection Officer (DPO):**
- Name: [DPO Name]
- Email: dpo@performance.gov.sa
- Phone: [Phone Number]

**Security Team:**
- Email: security@performance.gov.sa
- Emergency: [24/7 Hotline]

**NCA Reporting:**
- Website: https://nca.gov.sa
- Email: cert@nca.gov.sa

---

**Last Updated**: November 2025
**Version**: 1.0
**Compliance**: NCA, SDAIA, PDPL
