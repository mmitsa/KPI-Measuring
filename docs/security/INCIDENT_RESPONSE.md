# Incident Response Plan
# خطة الاستجابة للحوادث الأمنية

## 🚨 Overview

This document outlines the incident response procedures for security incidents affecting the Performance Management System.

---

## 1. Incident Classification

### Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| **P1 - Critical** | System compromised, data breach | Immediate (15 min) | Database breach, ransomware |
| **P2 - High** | Partial system compromise | 1 hour | Successful privilege escalation |
| **P3 - Medium** | Security vulnerability | 4 hours | Unpatched CVE, misconfiguration |
| **P4 - Low** | Security concern | 24 hours | Failed login attempts, suspicious activity |

---

## 2. Incident Response Team

### Core Team

| Role | Responsibilities | Contact |
|------|------------------|---------|
| **Incident Commander** | Overall coordination | [Phone], [Email] |
| **Technical Lead** | Technical investigation | [Phone], [Email] |
| **Security Officer** | Security assessment | [Phone], [Email] |
| **DBA** | Database investigation | [Phone], [Email] |
| **Legal Advisor** | Legal guidance | [Phone], [Email] |
| **Communications** | Stakeholder communication | [Phone], [Email] |

### Extended Team
- DevOps Engineer
- Network Administrator
- HR Representative
- External Security Consultant (if needed)

---

## 3. Response Phases

### Phase 1: Detection & Analysis (0-1 hour)

**Actions:**
1. Alert received (automated or manual)
2. Assign incident commander
3. Verify incident is real (not false positive)
4. Classify severity level
5. Activate response team
6. Document initial findings

**Tools:**
```bash
# Check for suspicious logins
SELECT TOP 100 *
FROM AuditLogs
WHERE Action = 'LoginFailed'
  AND CreatedAt > DATEADD(HOUR, -1, GETDATE())
ORDER BY CreatedAt DESC;

# Check for privilege escalation
SELECT *
FROM AuditLogs
WHERE Action LIKE '%Role%'
  AND CreatedAt > DATEADD(HOUR, -24, GETDATE());

# Check system logs
tail -f /var/log/performance-api/app.log | grep ERROR
journalctl -u performance-api -f --since "1 hour ago"
```

### Phase 2: Containment (1-4 hours)

**Immediate Actions:**
1. Isolate affected systems
2. Disable compromised accounts
3. Block malicious IPs
4. Preserve evidence
5. Enable enhanced logging

**Commands:**
```bash
# Disable user account
az ad user update --id user@domain.com --account-enabled false

# Block IP in firewall
sudo ufw deny from 192.168.1.100

# Snapshot database for forensics
sqlcmd -Q "BACKUP DATABASE PerformanceSystem TO DISK='/forensics/backup_$(date +%Y%m%d_%H%M%S).bak'"

# Enable debug logging
sed -i 's/"LogLevel": "Information"/"LogLevel": "Debug"/g' appsettings.json
systemctl restart performance-api
```

### Phase 3: Eradication (4-24 hours)

**Actions:**
1. Identify root cause
2. Remove malware/backdoors
3. Patch vulnerabilities
4. Reset compromised passwords
5. Revoke compromised tokens

**Example - Remove compromised user:**
```sql
-- Audit compromised user activity
SELECT *
FROM AuditLogs
WHERE UserId = 'compromised-user-id'
  AND CreatedAt > DATEADD(DAY, -7, GETDATE())
ORDER BY CreatedAt DESC;

-- Disable user
UPDATE Users
SET IsActive = 0
WHERE UserId = 'compromised-user-id';

-- Revoke all sessions
DELETE FROM UserSessions
WHERE UserId = 'compromised-user-id';

-- Force password reset
UPDATE Users
SET PasswordResetRequired = 1
WHERE UserId = 'compromised-user-id';
```

### Phase 4: Recovery (24-72 hours)

**Actions:**
1. Restore systems from clean backups if needed
2. Re-enable services gradually
3. Monitor for suspicious activity
4. Verify system integrity
5. Update security controls

**Verification Checklist:**
- [ ] All malicious files removed
- [ ] All backdoors closed
- [ ] All compromised accounts secured
- [ ] All systems patched
- [ ] Monitoring enhanced
- [ ] Backups verified

### Phase 5: Lessons Learned (Within 30 days)

**Post-Incident Review:**
1. Document timeline
2. Analyze root cause
3. Identify improvements
4. Update procedures
5. Training updates

**Template:**
```markdown
# Post-Incident Report

## Incident Summary
- **Date**: [Date]
- **Duration**: [Duration]
- **Severity**: [P1/P2/P3/P4]
- **Impact**: [Description]

## Timeline
- [Time]: Incident detected
- [Time]: Response team activated
- [Time]: Containment achieved
- [Time]: Systems recovered

## Root Cause
[Detailed analysis]

## Impact Assessment
- Systems affected: [List]
- Data accessed: [List]
- Users impacted: [Count]
- Downtime: [Duration]

## Response Effectiveness
- What went well
- What could be improved

## Action Items
1. [ ] [Action] - Owner: [Name], Due: [Date]
2. [ ] [Action] - Owner: [Name], Due: [Date]

## Recommendations
[List recommendations]
```

---

## 4. Common Incident Scenarios

### Scenario 1: Data Breach

**Symptoms:**
- Unauthorized database access detected
- Large data export detected
- External IP accessing internal systems

**Response:**
```bash
# 1. Immediately isolate database
# Stop accepting connections
ALTER DATABASE PerformanceSystem SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

# 2. Identify accessed data
SELECT *
FROM AuditLogs
WHERE Action IN ('Select', 'Export')
  AND CreatedAt > @IncidentStartTime;

# 3. Notify affected users
# Execute notification script

# 4. Report to NCA within 72 hours
```

### Scenario 2: Ransomware

**Symptoms:**
- Files encrypted
- Ransom note displayed
- System performance degraded

**Response:**
```bash
# 1. DO NOT PAY RANSOM
# 2. Immediately disconnect from network
sudo ifconfig eth0 down

# 3. Isolate infected systems
# Shutdown compromised VMs

# 4. Restore from clean backup
# Use backup from before infection date

# 5. Scan all systems
clamscan -r /var/www/
```

### Scenario 3: DDoS Attack

**Symptoms:**
- Extremely high traffic
- System slow or unresponsive
- Legitimate users can't access

**Response:**
```bash
# 1. Enable DDoS protection (Azure/Cloudflare)
# 2. Block attacking IPs
sudo iptables -A INPUT -s 192.168.1.0/24 -j DROP

# 3. Enable rate limiting
# Update Nginx config
limit_req_zone $binary_remote_addr zone=ddos:10m rate=10r/s;

# 4. Contact ISP/Cloud provider
# Request upstream filtering
```

### Scenario 4: Privilege Escalation

**Symptoms:**
- Regular user accessing admin endpoints
- Unusual permission changes
- Unauthorized data access

**Response:**
```sql
-- 1. Identify affected user
SELECT * FROM Users WHERE UserId = @SuspiciousUserId;

-- 2. Check recent activity
SELECT * FROM AuditLogs
WHERE UserId = @SuspiciousUserId
  AND CreatedAt > DATEADD(HOUR, -24, GETDATE());

-- 3. Revoke elevated privileges
DELETE FROM UserRoles
WHERE UserId = @SuspiciousUserId
  AND RoleId IN (3, 4, 5);  -- HR, Admin, Executive

-- 4. Lock account
UPDATE Users SET IsActive = 0 WHERE UserId = @SuspiciousUserId;

-- 5. Audit all changes made
-- Review AuditLogs for data modifications
```

---

## 5. Communication Plan

### Internal Communication

**Immediate notification (15 minutes):**
- Incident Commander
- Technical Lead
- Security Officer

**Within 1 hour:**
- CIO/CTO
- Legal Team
- HR (if employee data affected)

**Within 4 hours:**
- All stakeholders
- Executive management

### External Communication

**Within 72 hours (if required):**
- Affected users
- NCA (National Cybersecurity Authority)
- CITC (if telecommunication involved)
- Media (if public disclosure required)

**Communication Template:**
```
Subject: [CONFIDENTIAL] Security Incident Notification

Classification: [P1/P2/P3/P4]
Status: [Active/Contained/Resolved]

## Incident Details
- Type: [Type]
- Severity: [Level]
- Systems Affected: [List]
- Data Affected: [Yes/No/Unknown]

## Current Status
[Status description]

## Actions Taken
1. [Action]
2. [Action]

## Next Steps
[Timeline and actions]

## Contact
Incident Commander: [Name], [Contact]
```

---

## 6. Evidence Collection

### What to Preserve

1. **System logs**
   ```bash
   # Copy all logs
   tar -czf evidence-logs-$(date +%Y%m%d).tar.gz /var/log/
   ```

2. **Database state**
   ```sql
   -- Full database backup
   BACKUP DATABASE PerformanceSystem
   TO DISK='/forensics/db_backup_$(date).bak'
   WITH COPY_ONLY, COMPRESSION;
   ```

3. **Memory dump**
   ```bash
   # Create memory dump
   dotnet-dump collect -p $(pidof PerformanceSystem.API)
   ```

4. **Network traffic**
   ```bash
   # Capture network packets
   tcpdump -i eth0 -w capture-$(date +%Y%m%d).pcap
   ```

5. **Audit logs**
   ```sql
   -- Export audit logs
   SELECT * FROM AuditLogs
   WHERE CreatedAt BETWEEN @IncidentStart AND @IncidentEnd
   ORDER BY CreatedAt;
   ```

### Chain of Custody

Document all evidence:
- Who collected it
- When it was collected
- Where it's stored
- Who has accessed it

---

## 7. Tools & Resources

### Security Tools

```bash
# Log analysis
sudo tail -f /var/log/performance-api/app.log | grep -i "error\|exception\|unauthorized"

# Network monitoring
sudo netstat -tulpn | grep ESTABLISHED

# Process monitoring
ps aux | grep dotnet

# Disk usage
df -h

# Memory usage
free -m
```

### External Resources

- **NCA CERT**: cert@nca.gov.sa
- **Threat Intelligence**: https://nca.gov.sa/pages/Alerts.html
- **Security Community**: [Local ISACA chapter]

---

## 8. Incident Response Drills

### Quarterly Tabletop Exercise

**Scenario:** Simulated data breach
**Duration:** 2 hours
**Participants:** Full IR team

**Agenda:**
1. Scenario presentation (15 min)
2. Detection & analysis (30 min)
3. Containment plan (30 min)
4. Recovery discussion (30 min)
5. Debrief (15 min)

### Annual Full Simulation

**Includes:**
- Real system isolation
- Communication testing
- Backup restore
- Team coordination

---

## 9. Regulatory Reporting

### NCA Reporting (Required for P1/P2)

**Timeline:** Within 72 hours

**Information Required:**
1. Incident description
2. Affected systems
3. Data compromised
4. Number of affected individuals
5. Actions taken
6. Preventive measures

**Submission:**
- Portal: https://nca.gov.sa
- Email: cert@nca.gov.sa
- Phone: [NCA Hotline]

---

## 10. Continuous Improvement

### After Each Incident

1. **Update playbooks** based on lessons learned
2. **Enhance detection** rules
3. **Improve response time**
4. **Train team** on new procedures
5. **Update tools** and scripts

### Metrics to Track

| Metric | Target | Current |
|--------|--------|---------|
| Detection time | < 15 min | - |
| Response time | < 1 hour | - |
| Recovery time | < 4 hours | - |
| False positive rate | < 5% | - |

---

**Emergency Hotline**: [24/7 Number]
**Incident Email**: security@performance.gov.sa
**Last Updated**: November 2025
**Version**: 1.0
