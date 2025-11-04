# Backend Setup Guide

## Prerequisites

### Required Software
- **.NET 8.0 SDK** or later ([Download](https://dotnet.microsoft.com/download/dotnet/8.0))
- **SQL Server 2019+** or **SQL Server Express** ([Download](https://www.microsoft.com/sql-server/sql-server-downloads))
- **Visual Studio 2022** or **VS Code** with C# extension (optional but recommended)

### Verify Installation
```bash
# Check .NET SDK version
dotnet --version
# Should output: 8.0.x or higher

# Check SQL Server connection
# You can use SQL Server Management Studio (SSMS) or Azure Data Studio
```

## Project Structure

```
backend/
├── src/
│   ├── PerformanceSystem.API/          # Web API Layer
│   ├── PerformanceSystem.Application/   # Business Logic & Services
│   ├── PerformanceSystem.Core/          # Domain Entities & Enums
│   ├── PerformanceSystem.Infrastructure/ # Data Access & DbContext
│   └── PerformanceSystem.Tests/         # Unit & Integration Tests
├── PerformanceSystem.sln                # Solution file
└── Dockerfile                           # Docker build configuration
```

## Quick Start

### 1. Restore Dependencies
```bash
cd backend
dotnet restore
```

### 2. Update Connection String

Edit `src/PerformanceSystem.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=PerformanceSystemDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

**For SQL Server Authentication:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=PerformanceSystemDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"
  }
}
```

### 3. Create Database Migration

```bash
# Navigate to API project
cd src/PerformanceSystem.API

# Create initial migration
dotnet ef migrations add InitialCreate --project ../PerformanceSystem.Infrastructure

# Apply migration to create database
dotnet ef database update --project ../PerformanceSystem.Infrastructure
```

### 4. Run the Application

```bash
# From the API project directory
cd src/PerformanceSystem.API
dotnet run

# Or from the solution root
dotnet run --project src/PerformanceSystem.API/PerformanceSystem.API.csproj
```

The API will start at:
- **HTTP**: http://localhost:5001
- **Swagger UI**: http://localhost:5001 (in Development mode)

## Database Initialization

The application automatically:
1. Creates the database if it doesn't exist
2. Seeds initial data:
   - 5 Roles (Employee, Manager, HR, Admin, Executive)
   - 16 Permissions across modules
   - 3 Departments (IT, HR, Finance)
   - 3 Positions with grades
   - 5 Sample employees with manager relationships
   - 5 Sample users with role assignments

### Default Credentials

After seeding, you can login with these test accounts:

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| admin | Admin@123 | Admin | Full system access |
| hr.manager | Hr@123 | HR | HR management access |
| it.manager | Manager@123 | Manager | Department manager |
| john.doe | Employee@123 | Employee | Regular employee |
| jane.smith | Employee@123 | Employee | Regular employee |

## API Documentation

### Swagger UI
When running in Development mode, open your browser to:
```
http://localhost:5001
```

### Available Endpoints

#### Authentication
- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/logout` - Logout current user
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user info

#### Goals
- `GET /api/goals` - Get goals (with filtering)
- `GET /api/goals/{id}` - Get goal by ID
- `POST /api/goals` - Create new goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal
- `PUT /api/goals/{id}/progress` - Update goal progress
- `POST /api/goals/{id}/approve` - Approve/reject goal (Manager+)

#### Evaluations
- `GET /api/evaluations` - Get evaluations (with filtering)
- `GET /api/evaluations/{id}` - Get evaluation by ID
- `POST /api/evaluations` - Create evaluation (Manager+)
- `PUT /api/evaluations/{id}/scores` - Update scores (Manager+)
- `POST /api/evaluations/{id}/items` - Add evaluation item (Manager+)
- `POST /api/evaluations/{id}/finalize` - Finalize evaluation (Manager+)
- `POST /api/evaluations/{id}/approve` - Approve evaluation (HR+)

## Development Commands

### Build
```bash
# Build entire solution
dotnet build

# Build in Release mode
dotnet build -c Release
```

### Test
```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Clean
```bash
# Clean build artifacts
dotnet clean
```

### Database Commands

```bash
# Add new migration
dotnet ef migrations add MigrationName --project src/PerformanceSystem.Infrastructure

# Apply migrations
dotnet ef database update --project src/PerformanceSystem.Infrastructure

# Rollback to specific migration
dotnet ef database update PreviousMigrationName --project src/PerformanceSystem.Infrastructure

# Remove last migration (if not applied)
dotnet ef migrations remove --project src/PerformanceSystem.Infrastructure

# Generate SQL script
dotnet ef migrations script --project src/PerformanceSystem.Infrastructure --output migration.sql
```

## Docker Deployment

### Build Docker Image
```bash
cd backend
docker build -t performance-system-api .
```

### Run with Docker Compose
```bash
# From project root
docker-compose up -d
```

This will start:
- SQL Server on port 1433
- Backend API on port 5001
- Frontend on port 3000

## Configuration

### JWT Settings
Edit `appsettings.json`:

```json
{
  "Jwt": {
    "SecretKey": "your-super-secret-key-at-least-32-characters-long",
    "Issuer": "PerformanceSystem",
    "Audience": "PerformanceSystemAPI",
    "ExpirationMinutes": 60
  }
}
```

**IMPORTANT**: Change the `SecretKey` in production!

### CORS Settings
```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://your-production-domain.com"
    ]
  }
}
```

### Logging
Logs are written to:
- Console (stdout)
- File: `logs/log-YYYYMMDD.txt` (rotating daily)

Configure in `appsettings.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  }
}
```

## Troubleshooting

### Connection String Issues
- Ensure SQL Server is running
- Check server name (use `localhost` or `(localdb)\\mssqllocaldb` for LocalDB)
- Verify authentication method (Windows Auth vs SQL Auth)
- Enable TCP/IP in SQL Server Configuration Manager

### Migration Errors
```bash
# Reset database (WARNING: Deletes all data!)
dotnet ef database drop --project src/PerformanceSystem.Infrastructure
dotnet ef database update --project src/PerformanceSystem.Infrastructure
```

### Build Errors
```bash
# Clear NuGet cache
dotnet nuget locals all --clear

# Restore packages
dotnet restore
```

### Port Already in Use
Edit `src/PerformanceSystem.API/Properties/launchSettings.json` to change ports.

## Performance Evaluation Algorithm

The system implements the Saudi government performance evaluation formula:

```
FinalScore = (GoalsScore × 0.6) + (BehaviorScore × 0.3) + (InitiativesScore × 0.1) + TrainingImpact
```

**Training Impact Rules:**
- Average ≥85% → +0.15
- Average <60% → -0.20
- Otherwise → 0

**Performance Ratings:**
| Rating | Score Range |
|--------|-------------|
| Excellent (ممتاز) | 4.5 - 5.0 |
| Above Expected (أعلى من المتوقع) | 3.5 - 4.49 |
| Satisfactory (مرضي) | 2.5 - 3.49 |
| Below Expected (أقل من المتوقع) | 1.5 - 2.49 |
| Poor (ضعيف) | 0.0 - 1.49 |

**Automatic PIP Creation:**
- If FinalScore < 2.5, a Performance Improvement Plan (PIP) is automatically created

## Next Steps

1. ✅ Install .NET 8.0 SDK
2. ✅ Install SQL Server
3. ✅ Update connection string in appsettings.json
4. ✅ Run `dotnet restore`
5. ✅ Run `dotnet ef database update`
6. ✅ Run `dotnet run`
7. ✅ Open http://localhost:5001
8. ✅ Login with default credentials
9. ✅ Test API endpoints via Swagger

## Support

For issues and questions:
- Check logs in `logs/` directory
- Review Swagger documentation at http://localhost:5001
- See [BUILD.md](../BUILD.md) for general build instructions
