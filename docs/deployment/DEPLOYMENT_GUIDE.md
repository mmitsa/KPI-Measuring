# Deployment Guide
# دليل النشر الشامل

<div dir="rtl">

## 📋 نظرة عامة

هذا الدليل يوضح خطوات نشر نظام قياس الأداء الوظيفي على بيئات مختلفة.

### البيئات المدعومة:

| البيئة | الاستخدام | المتطلبات |
|--------|-----------|-----------|
| **Development** | التطوير المحلي | Docker Desktop / Local Services |
| **Staging** | الاختبار | VM / Azure App Service |
| **Production** | الإنتاج | On-Premise / Azure Gov Cloud |

</div>

---

## 1. Pre-Deployment Checklist

### 1.1 Infrastructure Requirements

#### Backend Server
- **OS**: Windows Server 2019+ or Linux (Ubuntu 20.04+)
- **CPU**: 4 cores minimum (8 cores recommended)
- **RAM**: 8 GB minimum (16 GB recommended)
- **Storage**: 100 GB SSD
- **.NET Runtime**: .NET 8.0

#### Frontend Server
- **OS**: Any (Docker/Nginx)
- **CPU**: 2 cores minimum
- **RAM**: 4 GB minimum
- **Storage**: 20 GB SSD
- **Web Server**: Nginx 1.22+ or IIS 10+

#### Database Server
- **DBMS**: SQL Server 2019+ or PostgreSQL 15+
- **CPU**: 8 cores minimum
- **RAM**: 16 GB minimum (32 GB recommended)
- **Storage**: 500 GB SSD
- **Backup**: Automated daily backups

### 1.2 Network Requirements

```
Internet → Load Balancer → WAF → Reverse Proxy → Application Servers
                                                  ↓
                                              Database (Private Network)
```

**Ports:**
- HTTP: 80 (redirect to HTTPS)
- HTTPS: 443
- Database: 1433 (SQL Server) / 5432 (PostgreSQL) - Internal only
- Redis: 6379 - Internal only

**Security:**
- TLS 1.3 certificate (valid SSL)
- Firewall rules (allow only necessary ports)
- VPN for admin access

### 1.3 External Services

- **SSO Provider**: نفاذ الوطني / Azure AD
- **SMTP**: Email server for notifications
- **Object Storage**: Azure Blob / MinIO for file uploads
- **Monitoring**: Application Insights / Prometheus

---

## 2. Backend Deployment

### 2.1 Build Backend

```bash
# Clone repository
git clone https://github.com/org/KPI-Measuring.git
cd KPI-Measuring/backend

# Restore dependencies
dotnet restore

# Build for Release
dotnet build --configuration Release

# Publish
cd src/PerformanceSystem.API
dotnet publish --configuration Release --output ./publish
```

### 2.2 Configure appsettings.json

```bash
cd publish
cp appsettings.json appsettings.Production.json
nano appsettings.Production.json
```

**appsettings.Production.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=sql-prod.internal;Database=PerformanceSystem;User Id=perfuser;Password=***;TrustServerCertificate=False;Encrypt=True;"
  },
  "Jwt": {
    "SecretKey": "*** from Azure Key Vault ***",
    "Issuer": "https://api.performance.gov.sa",
    "Audience": "https://app.performance.gov.sa",
    "ExpirationMinutes": 60
  },
  "SSO": {
    "Provider": "Nafath",
    "ClientId": "***",
    "ClientSecret": "*** from Key Vault ***",
    "RedirectUri": "https://app.performance.gov.sa/auth/callback"
  },
  "Email": {
    "SmtpHost": "smtp.gov.sa",
    "SmtpPort": 587,
    "UseSsl": true,
    "Username": "noreply@performance.gov.sa",
    "Password": "*** from Key Vault ***"
  },
  "Redis": {
    "ConnectionString": "redis-prod.internal:6379"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    },
    "ApplicationInsights": {
      "InstrumentationKey": "***"
    }
  }
}
```

### 2.3 Database Migration

```bash
# Set connection string
export ConnectionStrings__DefaultConnection="Server=..."

# Run migrations
dotnet ef database update --project ../PerformanceSystem.Infrastructure

# Verify migration
dotnet ef migrations list --project ../PerformanceSystem.Infrastructure
```

### 2.4 Deploy with Systemd (Linux)

```bash
# Create service file
sudo nano /etc/systemd/system/performance-api.service
```

**performance-api.service:**
```ini
[Unit]
Description=Performance Management System API
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/performance-api
ExecStart=/usr/bin/dotnet /var/www/performance-api/PerformanceSystem.API.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=performance-api
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable performance-api
sudo systemctl start performance-api
sudo systemctl status performance-api
```

### 2.5 Deploy with IIS (Windows)

1. Install IIS with ASP.NET Core Hosting Bundle
2. Create Application Pool:
   - Name: `PerformanceSystemAPI`
   - .NET CLR Version: `No Managed Code`
   - Managed Pipeline Mode: `Integrated`
3. Create Website:
   - Physical Path: `C:\inetpub\performance-api`
   - Binding: HTTPS, Port 443, SSL Certificate
4. Deploy files to `C:\inetpub\performance-api`
5. Set permissions for `IIS_IUSRS`

---

## 3. Frontend Deployment

### 3.1 Build Frontend

```bash
cd frontend

# Install dependencies
npm ci --production

# Build for production
npm run build

# Output: dist/ directory
```

### 3.2 Configure Environment

```bash
# Create .env.production
cat > .env.production << EOF
VITE_API_BASE_URL=https://api.performance.gov.sa/api/v1
VITE_ENVIRONMENT=production
VITE_SSO_PROVIDER=nafath
VITE_SENTRY_DSN=***
EOF
```

### 3.3 Deploy with Nginx

```bash
# Install Nginx
sudo apt install nginx

# Copy built files
sudo cp -r dist/* /var/www/performance-app/

# Configure Nginx
sudo nano /etc/nginx/sites-available/performance-app
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name app.performance.gov.sa;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.performance.gov.sa;

    ssl_certificate /etc/ssl/certs/performance.gov.sa.crt;
    ssl_certificate_key /etc/ssl/private/performance.gov.sa.key;
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/performance-app;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://api.performance.gov.sa;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Caching static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/performance-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Docker Deployment

### 4.1 Build Docker Images

```bash
# Build Backend
cd backend
docker build -t performance-api:1.0.0 -f Dockerfile .

# Build Frontend
cd ../frontend
docker build -t performance-frontend:1.0.0 -f Dockerfile .
```

### 4.2 Docker Compose (Production)

```yaml
version: '3.8'

services:
  backend:
    image: performance-api:1.0.0
    container_name: performance-api
    restart: always
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Server=db;Database=PerformanceSystem;User=sa;Password=***;
    ports:
      - "5000:5000"
    depends_on:
      - db
      - redis
    networks:
      - performance-network

  frontend:
    image: performance-frontend:1.0.0
    container_name: performance-frontend
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - backend
    networks:
      - performance-network

  db:
    image: mcr.microsoft.com/mssql/server:2019-latest
    container_name: performance-db
    restart: always
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong!Passw0rd
    ports:
      - "1433:1433"
    volumes:
      - db-data:/var/opt/mssql
    networks:
      - performance-network

  redis:
    image: redis:7-alpine
    container_name: performance-redis
    restart: always
    ports:
      - "6379:6379"
    networks:
      - performance-network

volumes:
  db-data:

networks:
  performance-network:
    driver: bridge
```

### 4.3 Deploy with Docker Compose

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

---

## 5. Azure Deployment

### 5.1 Azure App Service (Backend)

```bash
# Login to Azure
az login

# Create Resource Group
az group create --name rg-performance-prod --location uaenorth

# Create App Service Plan
az appservice plan create \
  --name asp-performance-prod \
  --resource-group rg-performance-prod \
  --sku P2V3 \
  --is-linux

# Create Web App
az webapp create \
  --name api-performance-prod \
  --resource-group rg-performance-prod \
  --plan asp-performance-prod \
  --runtime "DOTNETCORE:8.0"

# Deploy
cd backend/src/PerformanceSystem.API
az webapp deploy \
  --resource-group rg-performance-prod \
  --name api-performance-prod \
  --src-path ./publish.zip \
  --type zip
```

### 5.2 Azure Static Web Apps (Frontend)

```bash
# Create Static Web App
az staticwebapp create \
  --name swa-performance-prod \
  --resource-group rg-performance-prod \
  --source https://github.com/org/KPI-Measuring \
  --location uaenorth \
  --branch main \
  --app-location "/frontend" \
  --output-location "dist" \
  --api-location ""
```

### 5.3 Azure SQL Database

```bash
# Create SQL Server
az sql server create \
  --name sql-performance-prod \
  --resource-group rg-performance-prod \
  --location uaenorth \
  --admin-user sqladmin \
  --admin-password ***

# Create Database
az sql db create \
  --resource-group rg-performance-prod \
  --server sql-performance-prod \
  --name PerformanceSystem \
  --service-objective S3 \
  --backup-storage-redundancy Zone

# Configure Firewall
az sql server firewall-rule create \
  --resource-group rg-performance-prod \
  --server sql-performance-prod \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

---

## 6. SSL Certificate Setup

### 6.1 Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d app.performance.gov.sa -d api.performance.gov.sa

# Auto-renewal
sudo certbot renew --dry-run
```

### 6.2 Custom Certificate

```bash
# Place certificate files
sudo cp performance.gov.sa.crt /etc/ssl/certs/
sudo cp performance.gov.sa.key /etc/ssl/private/
sudo chmod 600 /etc/ssl/private/performance.gov.sa.key

# Update Nginx config
ssl_certificate /etc/ssl/certs/performance.gov.sa.crt;
ssl_certificate_key /etc/ssl/private/performance.gov.sa.key;
```

---

## 7. Post-Deployment

### 7.1 Smoke Tests

```bash
# Test API health
curl https://api.performance.gov.sa/health

# Test frontend
curl https://app.performance.gov.sa

# Test database connection
curl https://api.performance.gov.sa/api/v1/health/db
```

### 7.2 Verify Monitoring

- Application Insights: Check telemetry
- Logs: Verify log aggregation
- Alerts: Test alert triggers

### 7.3 Performance Testing

```bash
# Load test with k6
k6 run --vus 100 --duration 5m tests/load-test.js
```

---

## 8. Rollback Plan

### 8.1 Quick Rollback

```bash
# Systemd
sudo systemctl stop performance-api
sudo rm -rf /var/www/performance-api
sudo cp -r /var/www/performance-api-backup-v1.0.0 /var/www/performance-api
sudo systemctl start performance-api

# Docker
docker-compose down
docker-compose -f docker-compose.v1.0.0.yml up -d
```

### 8.2 Database Rollback

```bash
# Restore from backup
sqlcmd -S localhost -U sa -P *** -Q "RESTORE DATABASE PerformanceSystem FROM DISK='/backup/PerformanceSystem_20251105.bak' WITH REPLACE"
```

---

## 9. Backup Strategy

### 9.1 Automated Backups

```bash
# Cron job for daily backups
0 3 * * * /usr/local/bin/backup-performance-db.sh
```

**backup-performance-db.sh:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/performance"
DB_NAME="PerformanceSystem"

# SQL Server backup
sqlcmd -S localhost -U sa -P $SA_PASSWORD -Q "BACKUP DATABASE [$DB_NAME] TO DISK='$BACKUP_DIR/PerformanceSystem_$DATE.bak' WITH COMPRESSION"

# Compress
gzip "$BACKUP_DIR/PerformanceSystem_$DATE.bak"

# Upload to Azure Blob
az storage blob upload --account-name storageaccount --container backups --file "$BACKUP_DIR/PerformanceSystem_$DATE.bak.gz"

# Delete old backups (keep 30 days)
find $BACKUP_DIR -name "*.bak.gz" -mtime +30 -delete
```

---

## 10. Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| API not responding | Check systemd status, logs, firewall |
| Database connection error | Verify connection string, firewall rules |
| Frontend blank page | Check browser console, API URL |
| SSL certificate error | Verify certificate validity, chain |
| High memory usage | Check for memory leaks, increase RAM |

---

**آخر تحديث**: نوفمبر 2025
**الإصدار**: 1.0
**الحالة**: ✅ جاهز للإنتاج
