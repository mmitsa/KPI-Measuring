# Security Checklist
# قائمة التحقق الأمني

<div dir="rtl">

## 📋 نظرة عامة

قائمة شاملة للتحقق من الأمان قبل وبعد النشر، متوافقة مع معايير NCA.

</div>

---

## 1. Authentication & Authorization 🔐

### 1.1 Authentication
- [ ] JWT tokens use strong secret keys (min 256-bit)
- [ ] Tokens expire after 60 minutes
- [ ] Refresh tokens rotate on use
- [ ] Password complexity enforced (min 8 chars, uppercase, lowercase, number, special char)
- [ ] Account lockout after 5 failed attempts
- [ ] Multi-factor authentication enabled for admins
- [ ] SSO integration tested (نفاذ الوطني)
- [ ] Session management secure (no session fixation)

### 1.2 Authorization
- [ ] Role-Based Access Control (RBAC) implemented
- [ ] Least privilege principle enforced
- [ ] Permission checks on all sensitive endpoints
- [ ] Horizontal privilege escalation prevented
- [ ] Vertical privilege escalation prevented
- [ ] API endpoints protected with [Authorize] attribute
- [ ] Resource-level authorization verified

**Test Commands:**
```bash
# Test unauthorized access
curl -X GET https://api.performance.gov.sa/api/v1/admin/users
# Expected: 401 Unauthorized

# Test with invalid token
curl -X GET https://api.performance.gov.sa/api/v1/goals/my \
  -H "Authorization: Bearer invalid-token"
# Expected: 401 Unauthorized

# Test privilege escalation
curl -X GET https://api.performance.gov.sa/api/v1/admin/users \
  -H "Authorization: Bearer {employee-token}"
# Expected: 403 Forbidden
```

---

## 2. Data Protection 🛡️

### 2.1 Encryption at Rest
- [ ] Database encryption enabled (TDE)
- [ ] Sensitive fields encrypted (NationalId, FinalScore)
- [ ] Encryption keys stored in Azure Key Vault
- [ ] Key rotation policy defined (every 90 days)
- [ ] Backups encrypted with AES-256

### 2.2 Encryption in Transit
- [ ] TLS 1.3 enabled (TLS 1.0/1.1 disabled)
- [ ] Valid SSL certificate installed
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] HSTS header enabled (max-age=31536000)
- [ ] Database connections use SSL/TLS

### 2.3 Data Masking
- [ ] Sensitive data masked in logs
- [ ] PII not exposed in error messages
- [ ] API responses don't leak sensitive info
- [ ] Database queries use parameterized statements

**Verification:**
```sql
-- Check TDE status
SELECT DB_NAME(database_id) AS DatabaseName,
       encryption_state,
       encryptor_type
FROM sys.dm_database_encryption_keys;

-- Check encrypted columns
SELECT SCHEMA_NAME(o.schema_id) + '.' + o.name AS TableName,
       c.name AS ColumnName,
       c.encryption_type_desc
FROM sys.columns c
INNER JOIN sys.objects o ON c.object_id = o.object_id
WHERE c.encryption_type IS NOT NULL;
```

---

## 3. Input Validation & Sanitization 🧹

### 3.1 Input Validation
- [ ] All user inputs validated (length, type, format)
- [ ] File uploads restricted (type, size, content)
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (input sanitization)
- [ ] LDAP injection protection
- [ ] XML injection protection
- [ ] Command injection protection

### 3.2 API Validation
- [ ] Request body size limited (max 10MB)
- [ ] Rate limiting enabled (1000 requests/hour per user)
- [ ] Content-Type validation
- [ ] Request origin validation (CORS)

**Test Cases:**
```bash
# SQL Injection test
curl -X POST https://api.performance.gov.sa/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin'\'' OR 1=1--", "password": "any"}'
# Expected: 400 Bad Request or 401 Unauthorized

# XSS test
curl -X POST https://api.performance.gov.sa/api/v1/goals \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title": "<script>alert(1)</script>"}'
# Expected: Input sanitized or rejected

# Large payload test
curl -X POST https://api.performance.gov.sa/api/v1/goals \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d @large-payload.json  # 20MB file
# Expected: 413 Request Entity Too Large
```

---

## 4. Security Headers 📋

### 4.1 Required Headers
- [ ] X-Frame-Options: DENY or SAMEORIGIN
- [ ] X-Content-Type-Options: nosniff
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Content-Security-Policy configured
- [ ] Strict-Transport-Security: max-age=31536000; includeSubDomains
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy configured

### 4.2 Verification
```bash
# Check security headers
curl -I https://api.performance.gov.sa/api/v1/health

# Expected headers:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# Strict-Transport-Security: max-age=31536000
# Content-Security-Policy: default-src 'self'
```

---

## 5. Audit & Logging 📝

### 5.1 Audit Logging
- [ ] All authentication attempts logged
- [ ] All authorization failures logged
- [ ] All data modifications logged (Create, Update, Delete)
- [ ] All admin actions logged
- [ ] Logs include: UserId, Action, Timestamp, IP, UserAgent
- [ ] Logs stored for min 12 months (NCA requirement)
- [ ] Log tampering prevented (append-only)

### 5.2 Security Monitoring
- [ ] Failed login attempts monitored (alert after 5 failures)
- [ ] Privilege escalation attempts detected
- [ ] Unusual API usage patterns detected
- [ ] Data exfiltration attempts detected

**SQL Query:**
```sql
-- Check recent authentication failures
SELECT TOP 100
    Username,
    Action,
    IpAddress,
    CreatedAt
FROM AuditLogs
WHERE Action = 'LoginFailed'
  AND CreatedAt > DATEADD(HOUR, -1, GETDATE())
ORDER BY CreatedAt DESC;

-- Check admin actions
SELECT TOP 100
    Username,
    Action,
    Entity,
    EntityId,
    CreatedAt
FROM AuditLogs
WHERE UserId IN (SELECT UserId FROM UserRoles WHERE RoleId = 4)  -- Admin role
  AND CreatedAt > DATEADD(DAY, -7, GETDATE())
ORDER BY CreatedAt DESC;
```

---

## 6. Dependency Security 🔍

### 6.1 Backend Dependencies
- [ ] NuGet packages up to date
- [ ] No known vulnerabilities in dependencies
- [ ] Dependency scanning automated (GitHub Dependabot)
- [ ] Vulnerable packages patched within 30 days

```bash
# Check vulnerabilities
cd backend
dotnet list package --vulnerable --include-transitive
```

### 6.2 Frontend Dependencies
- [ ] npm packages up to date
- [ ] No known vulnerabilities in dependencies
- [ ] npm audit run regularly
- [ ] Vulnerable packages patched within 30 days

```bash
# Check vulnerabilities
cd frontend
npm audit
npm audit fix
```

---

## 7. Network Security 🌐

### 7.1 Firewall Rules
- [ ] Only necessary ports open (80, 443)
- [ ] Database port (1433) not exposed to internet
- [ ] Redis port (6379) not exposed to internet
- [ ] SSH/RDP restricted to VPN only
- [ ] DDoS protection enabled

### 7.2 Network Segmentation
- [ ] Application tier separated from database tier
- [ ] Database on private network
- [ ] Bastion host for admin access

---

## 8. API Security 🔌

### 8.1 API Protection
- [ ] API versioning implemented
- [ ] Rate limiting per endpoint
- [ ] Request throttling (max 100 req/sec)
- [ ] API keys for external integrations
- [ ] Webhook signatures validated

### 8.2 CORS Configuration
- [ ] CORS restricted to allowed origins only
- [ ] Preflight requests handled correctly
- [ ] Credentials allowed only for trusted origins

**CORS Config:**
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionPolicy", builder =>
        builder
            .WithOrigins("https://app.performance.gov.sa")
            .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH")
            .WithHeaders("Authorization", "Content-Type")
            .AllowCredentials());
});
```

---

## 9. Third-Party Integration Security 🔗

### 9.1 SSO Integration
- [ ] OAuth2/SAML implementation reviewed
- [ ] Token validation strict
- [ ] Callback URLs whitelisted
- [ ] State parameter used (CSRF protection)

### 9.2 External APIs
- [ ] API keys stored securely (Key Vault)
- [ ] HTTPS only for external calls
- [ ] Timeout configured (30 seconds)
- [ ] Retry logic implemented
- [ ] Circuit breaker pattern used

---

## 10. Infrastructure Security 🏗️

### 10.1 Server Hardening
- [ ] Operating system updated
- [ ] Unnecessary services disabled
- [ ] Default passwords changed
- [ ] SSH key-based authentication only
- [ ] Firewall enabled

### 10.2 Container Security (Docker)
- [ ] Base images from trusted sources
- [ ] Images scanned for vulnerabilities (Trivy)
- [ ] Containers run as non-root user
- [ ] Resource limits set (CPU, memory)
- [ ] Secrets not hardcoded in images

```bash
# Scan Docker image
trivy image performance-api:latest

# Run as non-root
docker run --user 1000:1000 performance-api
```

---

## 11. Incident Response 🚨

### 11.1 Preparedness
- [ ] Incident response plan documented
- [ ] Incident response team identified
- [ ] Contact list updated
- [ ] Communication channels defined
- [ ] Backup & restore tested

### 11.2 Detection
- [ ] Security alerts configured
- [ ] Monitoring dashboards active
- [ ] Log analysis automated
- [ ] Threat intelligence integrated

---

## 12. Compliance (NCA) ⚖️

### 12.1 Essential Cybersecurity Controls (ECC)
- [ ] ECC 1-1: Asset Management
- [ ] ECC 2-1: Access Control
- [ ] ECC 3-1: Cybersecurity Awareness
- [ ] ECC 4-1: Data Security
- [ ] ECC 5-1: Incident Management
- [ ] ECC 6-1: Third Party Cybersecurity
- [ ] ECC 7-1: Cybersecurity Operations

### 12.2 Documentation
- [ ] Security policy documented
- [ ] Risk assessment completed
- [ ] Security architecture reviewed
- [ ] Penetration test report
- [ ] Compliance certificate obtained

---

## 13. Penetration Testing 🎯

### 13.1 Required Tests
- [ ] Authentication bypass attempts
- [ ] Authorization checks
- [ ] SQL injection
- [ ] XSS (Cross-Site Scripting)
- [ ] CSRF (Cross-Site Request Forgery)
- [ ] SSRF (Server-Side Request Forgery)
- [ ] File upload vulnerabilities
- [ ] Business logic flaws

### 13.2 Tools
- [ ] OWASP ZAP scan completed
- [ ] Burp Suite Professional scan
- [ ] Nessus vulnerability scan
- [ ] Manual penetration test by certified tester

---

## 14. Secrets Management 🔑

### 14.1 Key Vault
- [ ] Azure Key Vault configured
- [ ] All secrets stored in Key Vault
- [ ] Access policies defined (least privilege)
- [ ] Secret rotation automated
- [ ] Audit logging enabled

### 14.2 Development
- [ ] No secrets in source code
- [ ] .env files in .gitignore
- [ ] Developers use local key vault for dev
- [ ] CI/CD pipelines use managed identities

---

## 15. Backup & Recovery 💾

### 15.1 Backup Security
- [ ] Backups encrypted (AES-256)
- [ ] Backup encryption keys separate from data keys
- [ ] Backups stored off-site
- [ ] Backup access restricted (admin only)
- [ ] Backup integrity verified monthly

### 15.2 Recovery Testing
- [ ] Recovery procedures documented
- [ ] Recovery tested quarterly
- [ ] RTO defined (4 hours)
- [ ] RPO defined (1 hour)

---

## Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Security Officer** | | | |
| **Technical Lead** | | | |
| **DBA** | | | |
| **Compliance Officer** | | | |

---

**Last Updated**: November 2025
**Version**: 1.0
**Compliance**: NCA ECC/DCC Standards
