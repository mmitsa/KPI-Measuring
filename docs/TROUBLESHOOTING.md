# Troubleshooting Guide
# دليل حل المشاكل

## 🔧 Common Issues & Solutions

### 1. Backend Issues

#### Issue: API Returns 500 Internal Server Error

**Symptoms:**
- API endpoints return 500 errors
- Logs show "Cannot connect to database"

**Solutions:**
```bash
# Check database connection
sqlcmd -S localhost -U sa -P YourPassword -Q "SELECT 1"

# Verify connection string in appsettings.json
cat appsettings.json | grep ConnectionStrings

# Check backend logs
tail -f /var/log/performance-api/app.log

# Restart service
sudo systemctl restart performance-api
```

#### Issue: JWT Token Invalid

**Symptoms:**
- 401 Unauthorized errors
- "Invalid token" message

**Solutions:**
```bash
# Check JWT configuration
cat appsettings.json | grep Jwt

# Verify token expiration
# Check system time sync
timedatectl status

# Clear browser cache and re-login
```

---

### 2. Frontend Issues

#### Issue: Blank Page on Load

**Symptoms:**
- White screen
- No errors in logs

**Solutions:**
```javascript
// Check browser console (F12)
// Look for errors

// Verify API base URL
console.log(import.meta.env.VITE_API_BASE_URL)

// Check network tab for failed requests

// Clear cache and hard reload (Ctrl+Shift+R)
```

#### Issue: CORS Errors

**Symptoms:**
- "CORS policy" errors in console
- API calls blocked

**Solutions:**
```csharp
// Add CORS in Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

app.UseCors("AllowAll");
```

---

### 3. Database Issues

#### Issue: Connection Pool Exhausted

**Symptoms:**
- "Timeout expired" errors
- Slow API responses

**Solutions:**
```sql
-- Check active connections
SELECT
    session_id,
    login_name,
    status,
    command,
    cpu_time,
    total_elapsed_time
FROM sys.dm_exec_sessions
WHERE is_user_process = 1;

-- Kill long-running queries
KILL <session_id>;

-- Increase connection pool size in appsettings.json
"ConnectionStrings": {
    "DefaultConnection": "...;Max Pool Size=200;"
}
```

#### Issue: Slow Queries

**Symptoms:**
- API timeout errors
- High database CPU

**Solutions:**
```sql
-- Find slow queries
SELECT TOP 10
    qs.execution_count,
    qs.total_elapsed_time / 1000000.0 AS total_elapsed_time_seconds,
    SUBSTRING(qt.text, (qs.statement_start_offset/2)+1,
        ((CASE qs.statement_end_offset
            WHEN -1 THEN DATALENGTH(qt.text)
            ELSE qs.statement_end_offset
        END - qs.statement_start_offset)/2) + 1) AS query_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
ORDER BY qs.total_elapsed_time DESC;

-- Add missing indexes
CREATE NONCLUSTERED INDEX IX_Missing ON Table(Column);

-- Update statistics
UPDATE STATISTICS Table WITH FULLSCAN;
```

---

### 4. Docker Issues

#### Issue: Container Won't Start

```bash
# Check container logs
docker logs performance-api

# Check container status
docker ps -a

# Remove and recreate
docker-compose down
docker-compose up -d --force-recreate

# Check resource usage
docker stats
```

#### Issue: Out of Disk Space

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a
docker volume prune

# Remove old images
docker image prune -a
```

---

### 5. Performance Issues

#### Issue: High CPU Usage

```bash
# Check top processes
top

# Check .NET processes
dotnet-counters ps
dotnet-counters monitor -p <PID>

# Enable GC diagnostics
dotnet-dump collect -p <PID>
```

#### Issue: Memory Leak

```bash
# Monitor memory
free -h
watch -n 1 free -m

# .NET memory profiling
dotnet-gcdump collect -p <PID>

# Analyze dump
dotnet-gcdump report <dump-file>
```

---

### 6. SSL/TLS Issues

#### Issue: Certificate Error

```bash
# Check certificate validity
openssl x509 -in cert.crt -text -noout

# Verify certificate chain
openssl verify -CAfile ca.crt cert.crt

# Test SSL
curl -vI https://api.performance.gov.sa
```

---

## 📊 Diagnostic Commands

### Backend Diagnostics

```bash
# Check service status
systemctl status performance-api

# View logs
journalctl -u performance-api -f

# Check ports
netstat -tulpn | grep :5000

# Test API
curl http://localhost:5000/health
```

### Database Diagnostics

```sql
-- Check database size
EXEC sp_spaceused

-- Check active transactions
DBCC OPENTRAN

-- Check locks
SELECT * FROM sys.dm_tran_locks

-- Check blocking
EXEC sp_who2 'active'
```

### Network Diagnostics

```bash
# Test connectivity
ping api.performance.gov.sa

# Test DNS
nslookup api.performance.gov.sa

# Test port
telnet api.performance.gov.sa 443

# Check firewall
sudo ufw status
```

---

## 🆘 Emergency Procedures

### System Down

1. Check health endpoints
2. View error logs
3. Check database connectivity
4. Restart services
5. If persists, initiate rollback

### Data Corruption

1. Stop application immediately
2. Backup current database
3. Restore from latest backup
4. Verify data integrity
5. Resume operations

---

**Last Updated**: November 2025
