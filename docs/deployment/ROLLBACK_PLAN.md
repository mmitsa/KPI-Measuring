# Rollback Plan
# خطة التراجع عن النشر

## 🔄 Quick Rollback Guide

### When to Rollback:
- Critical bugs discovered in production
- System performance degradation > 50%
- Data integrity issues
- Security vulnerabilities exposed
- Unable to fix forward within 1 hour

### Rollback Decision Matrix:

| Severity | Impact | Rollback Decision |
|----------|--------|-------------------|
| **Critical** | System down / Data loss | **Immediate rollback** |
| **High** | Major feature broken | **Rollback within 30 min** |
| **Medium** | Minor feature broken | **Fix forward or rollback** |
| **Low** | UI issue | **Fix forward** |

---

## 1. Pre-Rollback Checklist

- [ ] Rollback decision approved by Tech Lead
- [ ] Stakeholders notified
- [ ] Backup verified and accessible
- [ ] Rollback team assembled
- [ ] Maintenance mode enabled

---

## 2. Application Rollback

### 2.1 Backend Rollback (Systemd - Linux)

```bash
# Stop current service
sudo systemctl stop performance-api

# Remove current version
sudo rm -rf /var/www/performance-api

# Restore previous version
sudo cp -r /var/www/performance-api-backup-v{{previous-version}} /var/www/performance-api

# Restore configuration
sudo cp /etc/performance/appsettings.Production.v{{previous-version}}.json /var/www/performance-api/appsettings.Production.json

# Start service
sudo systemctl start performance-api

# Verify
sudo systemctl status performance-api
curl https://api.performance.gov.sa/health
```

### 2.2 Backend Rollback (IIS - Windows)

```powershell
# Stop App Pool
Stop-WebAppPool -Name "PerformanceSystemAPI"

# Remove current version
Remove-Item -Path "C:\inetpub\performance-api\*" -Recurse -Force

# Restore previous version
Copy-Item -Path "C:\inetpub\backups\performance-api-v{{previous-version}}\*" -Destination "C:\inetpub\performance-api\" -Recurse

# Start App Pool
Start-WebAppPool -Name "PerformanceSystemAPI"

# Verify
Invoke-WebRequest -Uri "https://api.performance.gov.sa/health"
```

### 2.3 Frontend Rollback (Nginx)

```bash
# Remove current version
sudo rm -rf /var/www/performance-app/*

# Restore previous version
sudo cp -r /var/www/backups/performance-app-v{{previous-version}}/* /var/www/performance-app/

# Reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Verify
curl https://app.performance.gov.sa
```

### 2.4 Docker Rollback

```bash
# Stop current containers
docker-compose down

# Switch to previous version
docker-compose -f docker-compose.v{{previous-version}}.yml up -d

# Verify
docker-compose ps
docker logs performance-api
curl https://api.performance.gov.sa/health
```

---

## 3. Database Rollback

### 3.1 Check Current State

```bash
# Check applied migrations
dotnet ef migrations list --project PerformanceSystem.Infrastructure

# Check current version
SELECT TOP 1 * FROM __EFMigrationsHistory ORDER BY MigrationId DESC
```

### 3.2 Rollback Migration

```bash
# Rollback to specific migration
dotnet ef database update {{PreviousMigrationName}} --project PerformanceSystem.Infrastructure

# Example:
dotnet ef database update AddEvaluationsTable --project PerformanceSystem.Infrastructure
```

### 3.3 Full Database Restore

⚠️ **Use only if migration rollback fails**

```bash
# Stop application
sudo systemctl stop performance-api

# Backup current database (just in case)
sqlcmd -S localhost -U sa -P $SA_PASSWORD -Q "BACKUP DATABASE [PerformanceSystem] TO DISK='/backups/emergency_backup_$(date +%Y%m%d_%H%M%S).bak' WITH COMPRESSION"

# Restore from backup
sqlcmd -S localhost -U sa -P $SA_PASSWORD -Q "ALTER DATABASE [PerformanceSystem] SET SINGLE_USER WITH ROLLBACK IMMEDIATE"
sqlcmd -S localhost -U sa -P $SA_PASSWORD -Q "RESTORE DATABASE [PerformanceSystem] FROM DISK='/backups/PerformanceSystem_{{previous-backup-date}}.bak' WITH REPLACE"
sqlcmd -S localhost -U sa -P $SA_PASSWORD -Q "ALTER DATABASE [PerformanceSystem] SET MULTI_USER"

# Restart application
sudo systemctl start performance-api
```

---

## 4. Configuration Rollback

### 4.1 Rollback appsettings.json

```bash
# Restore previous configuration
sudo cp /etc/performance/backups/appsettings.Production.v{{previous-version}}.json /var/www/performance-api/appsettings.Production.json

# Restart service
sudo systemctl restart performance-api
```

### 4.2 Rollback Environment Variables

```bash
# Restore previous .env
sudo cp /etc/performance/backups/.env.v{{previous-version}} /var/www/performance-app/.env.production

# Restart Nginx
sudo systemctl reload nginx
```

---

## 5. Azure Rollback

### 5.1 Azure App Service Rollback

```bash
# Via Portal: Deployment Slots → Swap
# Or via CLI:
az webapp deployment slot swap \
  --resource-group rg-performance-prod \
  --name api-performance-prod \
  --slot staging \
  --target-slot production
```

### 5.2 Azure Container Apps Rollback

```bash
# List revisions
az containerapp revision list \
  --name performance-api \
  --resource-group rg-performance-prod

# Activate previous revision
az containerapp revision activate \
  --name performance-api \
  --resource-group rg-performance-prod \
  --revision {{previous-revision-name}}
```

---

## 6. Post-Rollback Verification

### 6.1 Health Checks

```bash
# API Health
curl https://api.performance.gov.sa/health
# Expected: { "status": "Healthy", "version": "v{{previous-version}}" }

# Frontend
curl https://app.performance.gov.sa
# Expected: 200 OK

# Database Connection
curl https://api.performance.gov.sa/api/v1/health/db
# Expected: { "status": "Healthy" }
```

### 6.2 Smoke Tests

```bash
# Test login
curl -X POST https://api.performance.gov.sa/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin@123"}'

# Test goals endpoint
curl https://api.performance.gov.sa/api/v1/goals/my \
  -H "Authorization: Bearer {{token}}"
```

### 6.3 Monitor

- [ ] Check error logs (no new critical errors)
- [ ] Check Application Insights / Prometheus
- [ ] Check database connection pool
- [ ] Check response times (< 1 second)
- [ ] Check memory usage (< 80%)

---

## 7. Communication

### 7.1 Notify Stakeholders

**Email Template:**

```
Subject: [IMPORTANT] System Rollback - v{{new-version}} → v{{previous-version}}

Dear Team,

We have rolled back the Performance Management System from version {{new-version}} to {{previous-version}} due to {{reason}}.

Details:
- Rollback Time: {{timestamp}}
- Affected Services: {{services}}
- Downtime: {{duration}}
- Current Status: System is operational

The issue will be investigated and fixed before the next deployment.

Regards,
Technical Team
```

### 7.2 Update Status Page

```
Status: Operational ✅
Last Incident: System rolled back to v{{previous-version}}
Duration: {{downtime}} minutes
Resolution: Rollback completed successfully
```

---

## 8. Root Cause Analysis

### 8.1 Post-Mortem Template

```markdown
# Incident Post-Mortem

## Summary
- **Date**: {{date}}
- **Duration**: {{duration}}
- **Impact**: {{impact}}
- **Root Cause**: {{root-cause}}

## Timeline
- {{time}}: Deployment started
- {{time}}: Issue detected
- {{time}}: Rollback decision made
- {{time}}: Rollback completed
- {{time}}: System verified healthy

## Root Cause
{{detailed-explanation}}

## Impact Assessment
- **Users Affected**: {{number}}
- **Data Loss**: {{yes/no}}
- **Revenue Impact**: {{if-applicable}}

## Action Items
1. [ ] Fix the bug that caused the rollback
2. [ ] Add test coverage for this scenario
3. [ ] Update deployment checklist
4. [ ] Schedule next deployment

## Lessons Learned
- {{lesson-1}}
- {{lesson-2}}
```

---

## 9. Prevention

### 9.1 Pre-Deployment

- [ ] Thorough testing in staging environment
- [ ] Code review by 2+ developers
- [ ] Security scan passed
- [ ] Performance testing passed
- [ ] Database migration tested on staging

### 9.2 Deployment

- [ ] Blue-Green deployment strategy
- [ ] Canary deployment (10% → 50% → 100%)
- [ ] Feature flags for risky features
- [ ] Automated rollback triggers

### 9.3 Monitoring

- [ ] Real-time error monitoring
- [ ] Performance monitoring
- [ ] User behavior analytics
- [ ] Automated alerts

---

## 10. Rollback Time Estimates

| Component | Rollback Time | Downtime |
|-----------|---------------|----------|
| **Backend only** | 5-10 minutes | ~5 minutes |
| **Frontend only** | 2-5 minutes | ~2 minutes |
| **Database migration** | 10-30 minutes | ~15 minutes |
| **Full system** | 20-40 minutes | ~25 minutes |

---

**Last Updated**: November 2025
**Version**: 1.0
**Owner**: Technical Team
