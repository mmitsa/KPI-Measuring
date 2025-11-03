# دليل البناء والتشغيل | Build & Run Guide

<div dir="rtl">

## نظام قياس الأداء الوظيفي - Government Performance Management System

---

## 📋 المتطلبات الأساسية | Prerequisites

### للتطوير المحلي (Local Development)

#### 1. البرامج المطلوبة:

- **Node.js** ≥ 18.0.0 ([تحميل](https://nodejs.org/))
- **npm** ≥ 9.0.0 (يأتي مع Node.js)
- **.NET SDK** 8.0 ([تحميل](https://dotnet.microsoft.com/download))
- **SQL Server** 2019+ أو **PostgreSQL** 15+ ([SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads) | [PostgreSQL](https://www.postgresql.org/download/))
- **Git** ([تحميل](https://git-scm.com/downloads))
- **Visual Studio Code** أو **Visual Studio 2022** (اختياري)
- **Docker Desktop** (اختياري - للتطوير عبر Containers)

#### 2. التحقق من التثبيت:

```bash
node --version    # يجب أن يكون ≥ v18.0.0
npm --version     # يجب أن يكون ≥ 9.0.0
dotnet --version  # يجب أن يكون ≥ 8.0.0
git --version
```

---

## 🚀 البدء السريع | Quick Start

### الطريقة 1: التشغيل المحلي (Local)

#### 1️⃣ Clone المشروع

```bash
git clone https://github.com/mmitsa/KPI-Measuring.git
cd KPI-Measuring
```

#### 2️⃣ إعداد قاعدة البيانات

##### SQL Server:

```bash
# تشغيل SQL Server Management Studio (SSMS)
# إنشاء قاعدة بيانات جديدة:
CREATE DATABASE PerformanceSystemDB;
GO
```

##### PostgreSQL:

```bash
psql -U postgres
CREATE DATABASE performance_db;
\q
```

#### 3️⃣ إعداد Backend

```bash
cd backend

# استعادة الحزم (Packages)
dotnet restore

# تحديث Connection String
# افتح src/PerformanceSystem.API/appsettings.Development.json
# عدّل ConnectionStrings:DefaultConnection

# تطبيق Migrations
cd src/PerformanceSystem.API
dotnet ef database update

# تشغيل Backend
dotnet run

# سيعمل على: https://localhost:5001
```

#### 4️⃣ إعداد Frontend

```bash
# في terminal جديد
cd frontend

# تثبيت Dependencies
npm install

# تشغيل Development Server
npm run dev

# سيعمل على: http://localhost:3000
```

#### 5️⃣ افتح المتصفح

```
http://localhost:3000
```

---

### الطريقة 2: التشغيل عبر Docker 🐳

#### 1️⃣ تأكد من تثبيت Docker

```bash
docker --version
docker-compose --version
```

#### 2️⃣ بناء وتشغيل Containers

```bash
# في المجلد الرئيسي للمشروع
docker-compose up -d

# الانتظار حتى تجهز جميع الـ Services
# يمكنك متابعة الـ Logs:
docker-compose logs -f
```

#### 3️⃣ الوصول للتطبيق

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Swagger Docs**: http://localhost:5001/swagger
- **Database**: localhost:1433 (SQL Server) أو localhost:5432 (PostgreSQL)

#### 4️⃣ إيقاف Containers

```bash
docker-compose down
```

---

## 📦 أوامر البناء | Build Commands

### Frontend

```bash
cd frontend

# Development Mode
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview

# Run Tests
npm test

# Run Tests with UI
npm run test:ui

# Check Coverage
npm run test:coverage

# Type Check
npm run type-check

# Lint
npm run lint

# Fix Lint Issues
npm run lint:fix

# Format Code
npm run format
```

### Backend

```bash
cd backend

# Restore Packages
dotnet restore

# Build Solution
dotnet build

# Run API (Development)
cd src/PerformanceSystem.API
dotnet run

# Run API (Watch Mode - Auto Reload)
dotnet watch run

# Run Tests
cd ../..
dotnet test

# Run Tests with Coverage
dotnet test /p:CollectCoverage=true

# Publish (Production Build)
dotnet publish -c Release -o ./publish
```

---

## 🗄️ إدارة قاعدة البيانات | Database Management

### Entity Framework Migrations

#### إنشاء Migration جديد:

```bash
cd backend/src/PerformanceSystem.API

dotnet ef migrations add InitialCreate

# أو لتحديث جدول معين:
dotnet ef migrations add AddObjectionsTable
```

#### تطبيق Migrations:

```bash
dotnet ef database update
```

#### التراجع عن آخر Migration:

```bash
dotnet ef migrations remove
```

#### عرض جميع Migrations:

```bash
dotnet ef migrations list
```

#### إنشاء SQL Script من Migration:

```bash
dotnet ef migrations script -o migration.sql
```

---

## 🔧 الإعدادات | Configuration

### Frontend Configuration

**ملف:** `frontend/.env.local` (أنشئه يدوياً)

```env
# API Base URL
VITE_API_URL=http://localhost:5001/api

# SSO Configuration
VITE_SSO_PROVIDER=nafath
VITE_SSO_CLIENT_ID=your-client-id
VITE_SSO_REDIRECT_URI=http://localhost:3000/auth/callback

# Feature Flags
VITE_ENABLE_POWER_BI=false
VITE_ENABLE_NOTIFICATIONS=true
```

### Backend Configuration

**ملف:** `backend/src/PerformanceSystem.API/appsettings.Development.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=PerformanceSystemDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "SecretKey": "your-super-secret-key-change-in-production",
    "Issuer": "PerformanceSystem",
    "Audience": "PerformanceSystemAPI",
    "ExpirationMinutes": 60
  },
  "SSO": {
    "Provider": "Nafath",
    "Authority": "https://nafath.sa",
    "ClientId": "your-client-id",
    "ClientSecret": "your-client-secret"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

---

## 🧪 الاختبارات | Testing

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/components/Login.test.tsx
```

### Backend Tests

```bash
cd backend

# Run all tests
dotnet test

# Run tests with details
dotnet test --verbosity normal

# Run specific test project
dotnet test src/PerformanceSystem.Tests/PerformanceSystem.Tests.csproj

# Run tests with coverage
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
```

---

## 📝 Seed Data (بيانات تجريبية)

لتعبئة قاعدة البيانات ببيانات تجريبية:

```bash
cd backend/src/PerformanceSystem.API

# تشغيل Seed Data Script
dotnet run --seed
```

**البيانات التجريبية تشمل:**
- 5 مستخدمين (واحد لكل دور)
- 10 موظفين
- 3 إدارات
- 20 هدف
- 10 تقييمات
- 5 اعتراضات

**حسابات تجريبية:**

| الدور | Username | Password |
|-------|----------|----------|
| Employee | employee@test.com | Test@123 |
| Manager | manager@test.com | Test@123 |
| HR | hr@test.com | Test@123 |
| Admin | admin@test.com | Test@123 |
| Executive | executive@test.com | Test@123 |

---

## 🐛 استكشاف الأخطاء | Troubleshooting

### Frontend Issues

#### 1. Port 3000 مُستخدم بالفعل:

```bash
# ابحث عن العملية المستخدمة للـ Port
lsof -i :3000   # Mac/Linux
netstat -ano | findstr :3000   # Windows

# اقتل العملية
kill -9 <PID>   # Mac/Linux
taskkill /PID <PID> /F   # Windows

# أو غيّر الـ Port في vite.config.ts
```

#### 2. Module not found:

```bash
# احذف node_modules وأعد التثبيت
rm -rf node_modules package-lock.json
npm install
```

#### 3. TypeScript Errors:

```bash
# أعد بناء TypeScript
npm run type-check
```

### Backend Issues

#### 1. Port 5001 مُستخدم:

```bash
# عدّل الـ Port في launchSettings.json
# backend/src/PerformanceSystem.API/Properties/launchSettings.json
```

#### 2. Database Connection Failed:

```bash
# تحقق من Connection String
# تحقق من تشغيل SQL Server/PostgreSQL
# جرّب:
dotnet ef database update --verbose
```

#### 3. Migrations Failed:

```bash
# احذف جميع Migrations وابدأ من جديد
rm -rf Migrations/
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 🚢 النشر (Deployment)

### Frontend (Production Build)

```bash
cd frontend

# Build for production
npm run build

# الملفات الناتجة ستكون في: dist/
# يمكن نشرها على أي Web Server (Nginx, Apache, etc.)
```

### Backend (Production Publish)

```bash
cd backend

# Publish for production
dotnet publish -c Release -o ./publish

# الملفات الناتجة ستكون في: publish/
# يمكن نشرها على IIS, Linux Server, Docker, etc.
```

### Docker Deployment

```bash
# Build Docker Images
docker-compose -f docker-compose.prod.yml build

# Run in Production
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 مراقبة الأداء | Performance Monitoring

### Frontend

```bash
# Analyze Bundle Size
npm run build -- --analyze

# Lighthouse Audit
npx lighthouse http://localhost:3000 --view
```

### Backend

```bash
# Enable Application Insights
# أضف في appsettings.json:
"ApplicationInsights": {
  "InstrumentationKey": "your-key"
}

# استخدم dotnet-trace للتحليل:
dotnet trace collect --process-id <pid>
```

---

## 📚 موارد إضافية | Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/ef/core/)
- [Material-UI](https://mui.com/)
- [Vite](https://vitejs.dev/)

---

## 💬 الدعم | Support

إذا واجهت أي مشاكل:

1. **تحقق من Logs**:
   - Frontend: Console في المتصفح (F12)
   - Backend: Terminal/Console

2. **راجع الوثائق**: [CONTRIBUTING.md](./CONTRIBUTING.md)

3. **أنشئ Issue**: [GitHub Issues](https://github.com/mmitsa/KPI-Measuring/issues)

4. **تواصل مع الفريق**: dev@performance.gov.sa

---

**آخر تحديث**: نوفمبر 2025
**الإصدار**: v1.0.0

</div>
